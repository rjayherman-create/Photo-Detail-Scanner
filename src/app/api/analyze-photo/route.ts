import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { buildPhotoScannerPrompt } from "@/lib/prompts";
import {
  BusinessContext,
  ItemSetting,
  PhotoAnalysis,
  ScanHistoryEntry,
  ScanMode,
  ScanSource,
} from "@/lib/types";
import {
  clearScanHistory,
  getDatabaseStatus,
  prependScanHistoryEntry,
  readScanHistory,
} from "@/lib/scanStore";

export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function hasRealOpenAiKey() {
  const key = process.env.OPENAI_API_KEY;
  return Boolean(key && key !== "put_your_openai_api_key_here");
}

function buildFallbackAnalysis(mode: ScanMode): PhotoAnalysis {
  return {
    scanMode: mode,
    title: "Quick Photo Report",
    summary:
      "Analysis is running in fallback mode because OpenAI is not configured yet. Add a real OPENAI_API_KEY in .env.local for full AI item detection.",
    confidence: "low",
    visibleInventory: [
      {
        itemName: "Uploaded lot photos",
        category: "Unclassified",
        visibleDetails: ["Photos received", "AI analysis disabled"],
        condition: "unknown",
        confidence: "low",
        estimatedResaleLow: null,
        estimatedResaleHigh: null,
        notes: "Set OPENAI_API_KEY to generate item-level valuation.",
      },
    ],
    markingsDetected: [],
    valueEstimate: {
      likelyRetailResaleLow: null,
      likelyRetailResaleHigh: null,
      likelyQuickSaleLow: null,
      likelyQuickSaleHigh: null,
      meltValueLow: null,
      meltValueHigh: null,
      replacementPiecePotential: "unknown",
      valueNotes: [
        "No model inference in fallback mode.",
        "Configure OPENAI_API_KEY to enable valuation.",
      ],
    },
    risks: [
      "Prices are unavailable until AI analysis is enabled.",
      "Confirm condition and authenticity manually.",
    ],
    questionsForSeller: [
      "Can you share close-up photos of marks, labels, and model numbers?",
      "Are all items tested and complete?",
    ],
    buyRecommendation: {
      decision: "need_more_photos",
      maxOfferLow: null,
      maxOfferHigh: null,
      reasoning:
        "Unable to calculate a safe offer without AI analysis and clearer detail photos.",
    },
    resalePlan: [
      "Capture close-up photos of marks, serials, and condition.",
      "Enable OPENAI_API_KEY and rescan for value estimates.",
    ],
    listingTitleSuggestions: [
      "Mixed lot for review - details pending",
      "Unsorted item lot - verification required",
    ],
    disclaimer:
      "AI estimate from visible photos only. Confirm marks, weight, condition, authenticity, and working condition before buying or selling.",
  };
}

function toHistoryEntry(mode: ScanMode, analysis: PhotoAnalysis): ScanHistoryEntry {
  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    mode,
    title: analysis.title,
    recommendation: analysis.buyRecommendation?.decision,
    analysisSnapshot: analysis,
    estimate: {
      likelyRetailResaleLow: analysis.valueEstimate?.likelyRetailResaleLow,
      likelyRetailResaleHigh: analysis.valueEstimate?.likelyRetailResaleHigh,
    },
  };
}

async function saveHistorySafe(mode: ScanMode, analysis: PhotoAnalysis) {
  try {
    await prependScanHistoryEntry(toHistoryEntry(mode, analysis));
  } catch (err: unknown) {
    console.error("Save scan history error:", err);
  }
}

function isValidMode(mode: string): mode is ScanMode {
  return ["silver", "golf", "tools"].includes(mode);
}

function isBusinessContext(value: string): value is BusinessContext {
  return ["thrift_shop", "pawn_shop"].includes(value);
}

function isItemSetting(value: string): value is ItemSetting {
  return ["single_item", "multiple_items"].includes(value);
}
function isScanSource(value: string): value is ScanSource {
  return ["facebook", "craigslist", "estate_sale", "storage_locker"].includes(value);
}


async function fileToBase64(file: File) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  return buffer.toString("base64");
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const modeRaw = String(formData.get("mode") || "silver");
    const mode: ScanMode = isValidMode(modeRaw) ? modeRaw : "silver";
    const contextRaw = String(formData.get("businessContext") || "thrift_shop");
    const businessContext: BusinessContext = isBusinessContext(contextRaw)
      ? contextRaw
      : "thrift_shop";
    const sourceRaw = String(formData.get("source") || "facebook");
    const scanSource: ScanSource = isScanSource(sourceRaw)
      ? sourceRaw
      : "facebook";
    const itemSettingRaw = String(formData.get("itemSetting") || "single_item");
    const itemSetting: ItemSetting = isItemSetting(itemSettingRaw)
      ? itemSettingRaw
      : "single_item";

    const files = formData.getAll("photos").filter(Boolean) as File[];

    if (!files.length) {
      return NextResponse.json(
        { error: "Upload at least one photo." },
        { status: 400 },
      );
    }

    const imageParts = [];

    for (const file of files.slice(0, 8)) {
      if (!file.type.startsWith("image/")) continue;

      const base64 = await fileToBase64(file);
      imageParts.push({
        type: "image_url" as const,
        image_url: {
          url: `data:${file.type};base64,${base64}`,
          detail: "high" as const,
        },
      });
    }

    if (!imageParts.length) {
      return NextResponse.json(
        { error: "No valid image files were uploaded." },
        { status: 400 },
      );
    }

    if (!hasRealOpenAiKey()) {
      const fallback = buildFallbackAnalysis(mode);
      await saveHistorySafe(mode, fallback);
      return NextResponse.json(fallback);
    }

    const prompt = buildPhotoScannerPrompt(
      mode,
      businessContext,
      itemSetting,
      scanSource,
    );

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      temperature: 0.15,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are a careful visual marketplace resale analyst. Return only valid JSON. Never claim certainty where the photo is unclear.",
        },
        {
          role: "user",
          content: [{ type: "text", text: prompt }, ...imageParts],
        },
      ],
    });

    const text = response.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(text) as PhotoAnalysis;
    await saveHistorySafe(mode, parsed);

    return NextResponse.json(parsed);
  } catch (err: unknown) {
    console.error("Analyze photo error:", err);
    return NextResponse.json(
      {
        error: "Photo analysis failed.",
        detail: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const [dbStatus, historyResult] = await Promise.allSettled([
      getDatabaseStatus(),
      readScanHistory(),
    ]);

    const status =
      dbStatus.status === "fulfilled"
        ? dbStatus.value
        : {
            engine: "postgres",
            configured: Boolean(process.env.DATABASE_URL),
            connected: false,
            message:
              dbStatus.reason instanceof Error
                ? dbStatus.reason.message
                : "Status unavailable",
          };

    const entries =
      historyResult.status === "fulfilled" ? historyResult.value : [];

    return NextResponse.json({
      entries,
      backendStatus: {
        aiConfigured: hasRealOpenAiKey(),
        database: status,
      },
    });
  } catch (err: unknown) {
    console.error("Read scan history error:", err);
    return NextResponse.json(
      {
        entries: [],
        backendStatus: {
          aiConfigured: hasRealOpenAiKey(),
          database: {
            engine: "postgres",
            configured: Boolean(process.env.DATABASE_URL),
            connected: false,
            message: err instanceof Error ? err.message : "Unknown error",
          },
        },
      },
      { status: 200 },
    );
  }
}

export async function DELETE() {
  try {
    await clearScanHistory();
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    console.error("Clear scan history error:", err);
    return NextResponse.json(
      {
        error: "Failed to clear scan history.",
        detail: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
