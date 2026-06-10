import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { PhotoAnalysis } from "@/lib/types";

function safeFileName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 70);
}

function money(value: number | null | undefined) {
  if (value === null || value === undefined) return "";
  return value;
}

export function exportAnalysisToExcel(analysis: PhotoAnalysis) {
  const fileBase = safeFileName(analysis.title || "photo-detail-scan-report");

  const summarySheet = [
    ["Report Title", analysis.title],
    ["Scan Mode", analysis.scanMode],
    ["Confidence", analysis.confidence],
    ["Summary", analysis.summary],
    ["Recommendation", analysis.buyRecommendation?.decision],
    ["Recommended Max Offer Low", money(analysis.buyRecommendation?.maxOfferLow)],
    ["Recommended Max Offer High", money(analysis.buyRecommendation?.maxOfferHigh)],
    ["Retail Resale Low", money(analysis.valueEstimate?.likelyRetailResaleLow)],
    ["Retail Resale High", money(analysis.valueEstimate?.likelyRetailResaleHigh)],
    ["Quick Sale Low", money(analysis.valueEstimate?.likelyQuickSaleLow)],
    ["Quick Sale High", money(analysis.valueEstimate?.likelyQuickSaleHigh)],
    ["Melt Value Low", money(analysis.valueEstimate?.meltValueLow)],
    ["Melt Value High", money(analysis.valueEstimate?.meltValueHigh)],
    ["Replacement Piece Potential", analysis.valueEstimate?.replacementPiecePotential],
    ["Disclaimer", analysis.disclaimer],
  ];

  const inventorySheet =
    analysis.visibleInventory?.map((item) => ({
      Item: item.itemName,
      Category: item.category,
      Condition: item.condition,
      Confidence: item.confidence,
      "Estimated Resale Low": money(item.estimatedResaleLow),
      "Estimated Resale High": money(item.estimatedResaleHigh),
      "Visible Details": item.visibleDetails?.join("; "),
      Notes: item.notes,
    })) || [];

  const marksSheet =
    analysis.markingsDetected?.map((mark) => ({
      "Visible Text": mark.visibleText,
      "Likely Meaning": mark.likelyMeaning,
      Confidence: mark.confidence,
      Importance: mark.importance,
    })) || [];

  const risksSheet = [
    ...(analysis.risks || []).map((risk) => ({
      Type: "Risk",
      Detail: risk,
    })),
    ...(analysis.questionsForSeller || []).map((question) => ({
      Type: "Question For Seller",
      Detail: question,
    })),
    ...(analysis.resalePlan || []).map((plan) => ({
      Type: "Resale Plan",
      Detail: plan,
    })),
    ...(analysis.listingTitleSuggestions || []).map((title) => ({
      Type: "Listing Title Suggestion",
      Detail: title,
    })),
  ];

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.aoa_to_sheet(summarySheet),
    "Summary",
  );

  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet(inventorySheet),
    "Inventory",
  );

  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet(marksSheet),
    "Marks",
  );

  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet(risksSheet),
    "Risks Questions Plan",
  );

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, `${fileBase}.xlsx`);
}

export function exportAnalysisToCSV(analysis: PhotoAnalysis) {
  const rows =
    analysis.visibleInventory?.map((item) => ({
      Item: item.itemName,
      Category: item.category,
      Condition: item.condition,
      Confidence: item.confidence,
      EstimatedResaleLow: item.estimatedResaleLow ?? "",
      EstimatedResaleHigh: item.estimatedResaleHigh ?? "",
      VisibleDetails: item.visibleDetails?.join("; ") || "",
      Notes: item.notes,
    })) || [];

  const sheet = XLSX.utils.json_to_sheet(rows);
  const csv = XLSX.utils.sheet_to_csv(sheet);

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8",
  });

  const fileBase = safeFileName(analysis.title || "inventory-export");
  saveAs(blob, `${fileBase}.csv`);
}

export function exportAnalysisToJSON(analysis: PhotoAnalysis) {
  const blob = new Blob([JSON.stringify(analysis, null, 2)], {
    type: "application/json;charset=utf-8",
  });

  const fileBase = safeFileName(analysis.title || "scan-report");
  saveAs(blob, `${fileBase}.json`);
}

export function createShareText(analysis: PhotoAnalysis) {
  const inventoryLines =
    analysis.visibleInventory
      ?.map((item, index) => {
        const value =
          item.estimatedResaleLow !== null && item.estimatedResaleHigh !== null
            ? `$${item.estimatedResaleLow}-$${item.estimatedResaleHigh}`
            : "value unknown";

        return `${index + 1}. ${item.itemName} - ${item.condition} - ${value}`;
      })
      .join("\n") || "";

  const risks =
    analysis.risks?.map((risk) => `- ${risk}`).join("\n") || "None listed.";

  const questions =
    analysis.questionsForSeller?.map((q) => `- ${q}`).join("\n") ||
    "None listed.";

  return `
PHOTO DETAIL SCANNER REPORT

${analysis.title}

Summary:
${analysis.summary}

Recommendation:
${analysis.buyRecommendation?.decision?.toUpperCase()}

Suggested Max Offer:
$${analysis.buyRecommendation?.maxOfferLow ?? "?"} - $${analysis.buyRecommendation?.maxOfferHigh ?? "?"}

Estimated Retail Resale:
$${analysis.valueEstimate?.likelyRetailResaleLow ?? "?"} - $${analysis.valueEstimate?.likelyRetailResaleHigh ?? "?"}

Estimated Quick Sale:
$${analysis.valueEstimate?.likelyQuickSaleLow ?? "?"} - $${analysis.valueEstimate?.likelyQuickSaleHigh ?? "?"}

Inventory:
${inventoryLines}

Risks:
${risks}

Questions For Seller:
${questions}

Reasoning:
${analysis.buyRecommendation?.reasoning}

Disclaimer:
${analysis.disclaimer}
`.trim();
}
