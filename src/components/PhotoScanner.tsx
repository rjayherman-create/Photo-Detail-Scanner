"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Camera,
  CheckCircle2,
  Coins,
  ImagePlus,
  ListChecks,
  Loader2,
  PackageSearch,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Upload,
} from "lucide-react";
import { PhotoAnalysis, ScanHistoryEntry, ScanMode } from "@/lib/types";
import ReportActions from "@/components/ReportActions";
import PrintableReport from "@/components/PrintableReport";

const scanModes: {
  value: ScanMode;
  label: string;
  description: string;
}[] = [
  {
    value: "general",
    label: "General Lot",
    description: "Mixed Facebook, Craigslist, estate, or garage-sale lot.",
  },
  {
    value: "silver",
    label: "Silver / Flatware",
    description: "Sterling, silverplate, marks, melt value, replacements.",
  },
  {
    value: "golf",
    label: "Golf Bag",
    description: "Clubs, shafts, bag, resale value, missing pieces.",
  },
  {
    value: "tools",
    label: "Tools",
    description: "Toolboxes, hand tools, rust, missing pieces, risk.",
  },
  {
    value: "camera",
    label: "Camera Gear",
    description: "Bodies, lenses, flashes, bags, chargers, lens value.",
  },
  {
    value: "video_games",
    label: "Video Games",
    description: "Consoles, games, controllers, cables, untested risk.",
  },
  {
    value: "storage_locker",
    label: "Storage Locker",
    description: "Visible value, hidden value, trash burden, max bid.",
  },
  {
    value: "collectibles",
    label: "Collectibles",
    description: "Toys, records, books, figures, vintage items.",
  },
];

function money(value: number | null | undefined) {
  if (value === null || value === undefined) return "Unknown";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function decisionClass(decision?: string) {
  if (decision === "buy")
    return "bg-emerald-100 text-emerald-800 border-emerald-200";
  if (decision === "maybe") return "bg-amber-100 text-amber-800 border-amber-200";
  if (decision === "pass") return "bg-red-100 text-red-800 border-red-200";
  return "bg-slate-100 text-slate-800 border-slate-200";
}

export default function PhotoScanner() {
  const [mode, setMode] = useState<ScanMode>("silver");
  const [files, setFiles] = useState<File[]>([]);
  const [analysis, setAnalysis] = useState<PhotoAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [mobileReportTab, setMobileReportTab] = useState<"overview" | "inventory" | "plan">("overview");
  const [historyEntries, setHistoryEntries] = useState<ScanHistoryEntry[]>([]);
  const [backendStatus, setBackendStatus] = useState<{
    aiConfigured: boolean;
    database: {
      engine: string;
      configured: boolean;
      connected: boolean;
      message?: string;
    };
  } | null>(null);

  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await fetch("/api/analyze-photo", {
          method: "GET",
          cache: "no-store",
        });
        if (!res.ok) return;
        const payload = (await res.json()) as {
          entries?: ScanHistoryEntry[];
          backendStatus?: {
            aiConfigured: boolean;
            database: {
              engine: string;
              configured: boolean;
              connected: boolean;
              message?: string;
            };
          };
        };
        if (Array.isArray(payload.entries)) {
          setHistoryEntries(payload.entries);
        }
        if (payload.backendStatus) {
          setBackendStatus(payload.backendStatus);
        }
      } catch {
        setHistoryEntries([]);
      }
    }

    void loadHistory();
  }, []);

  const previews = useMemo(() => {
    return files.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));
  }, [files]);

  function handleFiles(selected: FileList | null) {
    if (!selected) return;
    const next = Array.from(selected).filter((f) => f.type.startsWith("image/"));
    setFiles(next.slice(0, 8));
    setAnalysis(null);
    setErr("");
    setCurrentStep(2);
  }

  async function analyze() {
    try {
      setLoading(true);
      setErr("");
      setAnalysis(null);

      const form = new FormData();
      form.append("mode", mode);
      files.forEach((file) => form.append("photos", file));

      const res = await fetch("/api/analyze-photo", {
        method: "POST",
        body: form,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to analyze photos.");
      }

      setAnalysis(data);

      try {
        const historyRes = await fetch("/api/analyze-photo", {
          method: "GET",
          cache: "no-store",
        });
        if (historyRes.ok) {
          const payload = (await historyRes.json()) as {
            entries?: ScanHistoryEntry[];
            backendStatus?: {
              aiConfigured: boolean;
              database: {
                engine: string;
                configured: boolean;
                connected: boolean;
                message?: string;
              };
            };
          };
          if (Array.isArray(payload.entries)) {
            setHistoryEntries(payload.entries);
          }
          if (payload.backendStatus) {
            setBackendStatus(payload.backendStatus);
          }
        }
      } catch {
        // Keep analysis visible even if history refresh fails.
      }

      setCurrentStep(3);
      setMobileReportTab("overview");
    } catch (e: unknown) {
      if (e instanceof Error) {
        setErr(e.message || "Something went wrong.");
      } else {
        setErr("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function clearHistory() {
    try {
      const res = await fetch("/api/analyze-photo", {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Could not clear history.");
      }
      setHistoryEntries([]);
    } catch {
      setErr("Could not clear history.");
    }
  }

  function resetScan() {
    setFiles([]);
    setAnalysis(null);
    setErr("");
    setCurrentStep(1);
  }

  function openHistoryReport(entry: ScanHistoryEntry) {
    if (!entry.analysisSnapshot) {
      setErr("This older history entry has no full saved report.");
      return;
    }

    setErr("");
    setAnalysis(entry.analysisSnapshot);
    setCurrentStep(3);
    setMobileReportTab("overview");
    window.requestAnimationFrame(() => {
      const reportAnchor = document.getElementById("scan-report");
      reportAnchor?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function recommendationBadgeClass(recommendation?: string) {
    if (recommendation === "buy") return "bg-emerald-100 text-emerald-800";
    if (recommendation === "maybe") return "bg-amber-100 text-amber-800";
    if (recommendation === "pass") return "bg-rose-100 text-rose-800";
    return "bg-slate-200 text-slate-700";
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-800">
              <Sparkles className="h-3.5 w-3.5" />
              Guided Workflow
            </div>
            <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-semibold">
              <span
                className={`rounded-full border px-2 py-1 ${
                  backendStatus?.aiConfigured
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-amber-200 bg-amber-50 text-amber-700"
                }`}
              >
                AI {backendStatus?.aiConfigured ? "connected" : "fallback"}
              </span>
              <span
                className={`rounded-full border px-2 py-1 ${
                  backendStatus?.database?.connected
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-rose-200 bg-rose-50 text-rose-700"
                }`}
                title={backendStatus?.database?.message || ""}
              >
                DB {backendStatus?.database?.connected ? "postgres" : "not connected"}
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Photo Detail Scanner
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              3 simple steps: choose a mode, upload photos, analyze and decide.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                currentStep === 1 ? "bg-slate-900 text-white" : "border bg-white"
              }`}
            >
              1. Mode
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                currentStep === 2 ? "bg-slate-900 text-white" : "border bg-white"
              }`}
            >
              2. Photos
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                currentStep === 3 ? "bg-slate-900 text-white" : "border bg-white"
              }`}
            >
              3. Report
            </button>
            <button
              type="button"
              onClick={resetScan}
              className="inline-flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              <RotateCcw className="h-4 w-4" />
              Start over
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-5 py-6 lg:grid-cols-[380px_1fr]">
        <aside className="space-y-4">
          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <h2 className="flex items-center gap-2 text-base font-semibold">
              <ListChecks className="h-4 w-4" />
              Workflow checklist
            </h2>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                <span>Choose mode</span>
                {mode ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : null}
              </div>
              <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                <span>Upload photos</span>
                {files.length > 0 ? (
                  <span className="text-xs font-semibold text-emerald-700">{files.length} added</span>
                ) : (
                  <span className="text-xs text-slate-500">waiting</span>
                )}
              </div>
              <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                <span>Review report</span>
                {analysis ? (
                  <span className="text-xs font-semibold text-emerald-700">ready</span>
                ) : (
                  <span className="text-xs text-slate-500">not yet</span>
                )}
              </div>
            </div>
          </div>

          {(currentStep === 1 || (!analysis && files.length === 0)) && (
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <h2 className="flex items-center gap-2 text-xl font-semibold">
                <PackageSearch className="h-5 w-5" />
                Step 1: Choose scanner mode
              </h2>
              <div className="mt-4 grid gap-2">
                {scanModes.map((m) => (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => {
                      setMode(m.value);
                      setCurrentStep(2);
                    }}
                    className={`rounded-xl border p-3 text-left transition hover:border-slate-400 ${
                      mode === m.value
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "bg-white"
                    }`}
                  >
                    <div className="font-semibold">{m.label}</div>
                    <div
                      className={`mt-1 text-xs ${
                        mode === m.value ? "text-slate-300" : "text-slate-500"
                      }`}
                    >
                      {m.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {(currentStep === 2 || files.length > 0) && (
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <h2 className="flex items-center gap-2 text-xl font-semibold">
                <ImagePlus className="h-5 w-5" />
                Step 2: Upload photos
              </h2>

              <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center hover:bg-slate-100">
                <Upload className="mb-3 h-8 w-8 text-slate-500" />
                <div className="font-semibold">Click to upload photos</div>
                <div className="mt-1 text-xs text-slate-500">
                  Up to 8 images. Include close-ups of marks when possible.
                </div>
                <input
                  className="hidden"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFiles(e.target.files)}
                />
              </label>

              {previews.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {previews.map((p) => (
                    <img
                      key={p.url}
                      src={p.url}
                      alt={p.name}
                      className="h-24 w-full rounded-xl border object-cover"
                    />
                  ))}
                </div>
              )}

              <button
                disabled={loading || files.length === 0}
                onClick={analyze}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Analyzing photos...
                  </>
                ) : (
                  <>
                    <Camera className="h-5 w-5" />
                    Analyze photos
                  </>
                )}
              </button>

              {err && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {err}
                </div>
              )}
            </div>
          )}

          <details className="rounded-2xl border bg-white p-5 shadow-sm">
            <summary className="cursor-pointer text-sm font-semibold text-slate-700">
              Safety notes and recent scans
            </summary>

            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <div className="flex items-start gap-2">
                <ShieldAlert className="mt-0.5 h-5 w-5" />
                <div>
                  <div className="font-semibold">Important buying rule</div>
                  <p className="mt-1">
                    Confirm marks, weight, authenticity, and working condition
                    before purchasing expensive lots.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold">Recent scans</h3>
                <button
                  type="button"
                  onClick={clearHistory}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-900"
                >
                  Clear history
                </button>
              </div>

              {historyEntries.length === 0 && (
                <p className="text-sm text-slate-500">
                  No scans yet. Run an analysis and it will appear here.
                </p>
              )}

              {historyEntries.length > 0 && (
                <div className="space-y-3">
                  {historyEntries.slice(0, 6).map((entry, index) => (
                    <div
                      key={`${entry.createdAt}-${index}`}
                      className="rounded-xl border bg-slate-50 p-3"
                    >
                      <div className="text-sm font-semibold text-slate-900">{entry.title}</div>
                      <div className="mt-1 text-xs text-slate-500">
                        {new Date(entry.createdAt).toLocaleString()} | {entry.mode.replaceAll("_", " ")}
                      </div>
                      <div className="mt-2 flex items-center justify-between gap-2 text-xs">
                        <span
                          className={`rounded-full px-2 py-1 font-semibold uppercase ${recommendationBadgeClass(entry.recommendation)}`}
                        >
                          {entry.recommendation?.replaceAll("_", " ") || "unknown"}
                        </span>
                        <span className="font-semibold text-slate-700">
                          {money(entry.estimate?.likelyRetailResaleLow ?? null)} - {" "}
                          {money(entry.estimate?.likelyRetailResaleHigh ?? null)}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => openHistoryReport(entry)}
                        className="mt-3 w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                      >
                        Open report
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </details>
        </aside>

        <section id="scan-report" className="space-y-5">
          {!analysis && (
            <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
              <Coins className="mx-auto mb-4 h-12 w-12 text-slate-400" />
              <h2 className="text-2xl font-semibold">Step 3: Your report appears here</h2>
              <p className="mx-auto mt-2 max-w-2xl text-slate-600">
                Choose mode, upload photos, and run analysis to get a clean buy/pass
                report with values and risk flags.
              </p>
            </div>
          )}

          {analysis && (
            <>
              <ReportActions analysis={analysis} />
              <PrintableReport analysis={analysis} />

              <div className="grid grid-cols-3 gap-2 lg:hidden">
                <button
                  type="button"
                  onClick={() => setMobileReportTab("overview")}
                  className={`rounded-lg border px-3 py-2 text-xs font-semibold ${
                    mobileReportTab === "overview"
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "bg-white text-slate-700"
                  }`}
                >
                  Overview
                </button>
                <button
                  type="button"
                  onClick={() => setMobileReportTab("inventory")}
                  className={`rounded-lg border px-3 py-2 text-xs font-semibold ${
                    mobileReportTab === "inventory"
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "bg-white text-slate-700"
                  }`}
                >
                  Inventory
                </button>
                <button
                  type="button"
                  onClick={() => setMobileReportTab("plan")}
                  className={`rounded-lg border px-3 py-2 text-xs font-semibold ${
                    mobileReportTab === "plan"
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "bg-white text-slate-700"
                  }`}
                >
                  Plan
                </button>
              </div>

              <div
                className={`rounded-2xl border bg-white p-5 shadow-sm ${
                  mobileReportTab === "overview" ? "block" : "hidden lg:block"
                }`}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{analysis.title}</h2>
                    <p className="mt-2 text-slate-600">{analysis.summary}</p>
                    <div className="mt-3 text-sm text-slate-500">
                      Confidence:{" "}
                      <span className="font-semibold">{analysis.confidence}</span>
                    </div>
                  </div>

                  <div
                    className={`rounded-2xl border px-5 py-4 text-center ${decisionClass(
                      analysis.buyRecommendation?.decision,
                    )}`}
                  >
                    <div className="text-sm font-medium uppercase tracking-wide">
                      Recommendation
                    </div>
                    <div className="text-3xl font-bold capitalize">
                      {analysis.buyRecommendation?.decision?.replaceAll("_", " ")}
                    </div>
                    <div className="mt-1 text-sm">
                      Max offer:{" "}
                      <strong>
                        {money(analysis.buyRecommendation?.maxOfferLow)} -{" "}
                        {money(analysis.buyRecommendation?.maxOfferHigh)}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`grid gap-5 md:grid-cols-3 ${
                  mobileReportTab === "overview" ? "grid" : "hidden lg:grid"
                }`}
              >
                <div className="rounded-2xl border bg-white p-5 shadow-sm">
                  <div className="text-sm text-slate-500">Retail resale estimate</div>
                  <div className="mt-1 text-2xl font-bold">
                    {money(analysis.valueEstimate?.likelyRetailResaleLow)} -{" "}
                    {money(analysis.valueEstimate?.likelyRetailResaleHigh)}
                  </div>
                </div>

                <div className="rounded-2xl border bg-white p-5 shadow-sm">
                  <div className="text-sm text-slate-500">Quick-sale estimate</div>
                  <div className="mt-1 text-2xl font-bold">
                    {money(analysis.valueEstimate?.likelyQuickSaleLow)} -{" "}
                    {money(analysis.valueEstimate?.likelyQuickSaleHigh)}
                  </div>
                </div>

                <div className="rounded-2xl border bg-white p-5 shadow-sm">
                  <div className="text-sm text-slate-500">Melt estimate</div>
                  <div className="mt-1 text-2xl font-bold">
                    {money(analysis.valueEstimate?.meltValueLow)} -{" "}
                    {money(analysis.valueEstimate?.meltValueHigh)}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    For silver only. Requires confirmed purity and weight.
                  </div>
                </div>
              </div>

              <div
                className={`rounded-2xl border bg-white p-5 shadow-sm ${
                  mobileReportTab === "inventory" ? "block" : "hidden lg:block"
                }`}
              >
                <h3 className="mb-4 text-xl font-semibold">Visible inventory</h3>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[850px] border-collapse text-sm">
                    <thead>
                      <tr className="border-b bg-slate-50 text-left">
                        <th className="p-3">Item</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Condition</th>
                        <th className="p-3">Confidence</th>
                        <th className="p-3">Estimated value</th>
                        <th className="p-3">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analysis.visibleInventory?.map((item, idx) => (
                        <tr key={idx} className="border-b align-top">
                          <td className="p-3 font-semibold">{item.itemName}</td>
                          <td className="p-3">{item.category}</td>
                          <td className="p-3 capitalize">{item.condition}</td>
                          <td className="p-3 capitalize">{item.confidence}</td>
                          <td className="p-3">
                            {money(item.estimatedResaleLow)} -{" "}
                            {money(item.estimatedResaleHigh)}
                          </td>
                          <td className="p-3 text-slate-600">
                            <div>{item.notes}</div>
                            {item.visibleDetails?.length > 0 && (
                              <ul className="mt-2 list-disc pl-5">
                                {item.visibleDetails.map((d, i) => (
                                  <li key={i}>{d}</li>
                                ))}
                              </ul>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {analysis.markingsDetected?.length > 0 && (
                <div
                  className={`rounded-2xl border bg-white p-5 shadow-sm ${
                    mobileReportTab === "overview" ? "block" : "hidden lg:block"
                  }`}
                >
                  <h3 className="mb-4 text-xl font-semibold">Marks / stamps detected</h3>
                  <div className="grid gap-3">
                    {analysis.markingsDetected.map((m, idx) => (
                      <div key={idx} className="rounded-xl border bg-slate-50 p-4">
                        <div className="font-semibold">{m.visibleText}</div>
                        <div className="mt-1 text-slate-700">{m.likelyMeaning}</div>
                        <div className="mt-2 text-sm text-slate-500">
                          Confidence: {m.confidence} - {m.importance}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div
                className={`grid gap-5 md:grid-cols-2 ${
                  mobileReportTab === "plan" ? "grid" : "hidden lg:grid"
                }`}
              >
                <div className="rounded-2xl border bg-white p-5 shadow-sm">
                  <h3 className="mb-3 text-xl font-semibold">Risks</h3>
                  <ul className="list-disc space-y-2 pl-5 text-slate-700">
                    {analysis.risks?.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border bg-white p-5 shadow-sm">
                  <h3 className="mb-3 text-xl font-semibold">Questions for seller</h3>
                  <ul className="list-disc space-y-2 pl-5 text-slate-700">
                    {analysis.questionsForSeller?.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div
                className={`rounded-2xl border bg-white p-5 shadow-sm ${
                  mobileReportTab === "plan" ? "block" : "hidden lg:block"
                }`}
              >
                <h3 className="mb-3 text-xl font-semibold">Buy reasoning</h3>
                <p className="text-slate-700">{analysis.buyRecommendation?.reasoning}</p>
              </div>

              <div
                className={`grid gap-5 md:grid-cols-2 ${
                  mobileReportTab === "plan" ? "grid" : "hidden lg:grid"
                }`}
              >
                <div className="rounded-2xl border bg-white p-5 shadow-sm">
                  <h3 className="mb-3 text-xl font-semibold">Resale plan</h3>
                  <ul className="list-disc space-y-2 pl-5 text-slate-700">
                    {analysis.resalePlan?.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border bg-white p-5 shadow-sm">
                  <h3 className="mb-3 text-xl font-semibold">Listing title ideas</h3>
                  <ul className="list-disc space-y-2 pl-5 text-slate-700">
                    {analysis.listingTitleSuggestions?.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div
                className={`rounded-2xl border bg-slate-900 p-5 text-sm text-slate-200 shadow-sm ${
                  mobileReportTab === "overview" ? "block" : "hidden lg:block"
                }`}
              >
                {analysis.disclaimer}
              </div>
            </>
          )}
        </section>
      </section>
    </main>
  );
}
