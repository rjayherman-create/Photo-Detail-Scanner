"use client";

import { useCallback, useState } from "react";
import {
  Copy,
  Download,
  FileJson,
  FileSpreadsheet,
  Printer,
  Share2,
} from "lucide-react";
import { PhotoAnalysis } from "@/lib/types";
import {
  createShareText,
  exportAnalysisToCSV,
  exportAnalysisToExcel,
  exportAnalysisToJSON,
} from "@/lib/exportReport";

export default function ReportActions({
  analysis,
}: {
  analysis: PhotoAnalysis;
}) {
  const [toasts, setToasts] = useState<
    { id: number; message: string; kind: "success" | "warning" | "error" }[]
  >([]);

  const pushToast = useCallback(
    (
      message: string,
      kind: "success" | "warning" | "error" = "success",
    ) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
      setToasts((prev) => [...prev, { id, message, kind }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 2600);
    },
    [],
  );

  async function copyReport() {
    try {
      const text = createShareText(analysis);
      await navigator.clipboard.writeText(text);
      pushToast("Report copied to clipboard.");
    } catch {
      pushToast("Copy failed. Please try again.", "error");
    }
  }

  async function shareReport() {
    try {
      const text = createShareText(analysis);

      if (navigator.share) {
        await navigator.share({
          title: analysis.title,
          text,
        });
        pushToast("Report shared.");
        return;
      }

      await navigator.clipboard.writeText(text);
      pushToast("Share unavailable. Report copied instead.", "warning");
    } catch {
      pushToast("Share canceled or failed.", "warning");
    }
  }

  function printReport() {
    window.print();
    pushToast("Opened print dialog.");
  }

  function exportExcel() {
    try {
      exportAnalysisToExcel(analysis);
      pushToast("Excel exported.");
    } catch {
      pushToast("Excel export failed.", "error");
    }
  }

  function exportCSV() {
    try {
      exportAnalysisToCSV(analysis);
      pushToast("CSV exported.");
    } catch {
      pushToast("CSV export failed.", "error");
    }
  }

  function exportJSON() {
    try {
      exportAnalysisToJSON(analysis);
      pushToast("JSON exported.");
    } catch {
      pushToast("JSON export failed.", "error");
    }
  }

  function toastClass(kind: "success" | "warning" | "error") {
    if (kind === "error") {
      return "border-rose-200/80 bg-rose-50/95 text-rose-900";
    }
    if (kind === "warning") {
      return "border-amber-200/80 bg-amber-50/95 text-amber-900";
    }
    return "border-emerald-200/80 bg-emerald-50/95 text-emerald-900";
  }

  return (
    <>
      <div className="no-print rounded-2xl border bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-col gap-1">
          <h3 className="text-xl font-semibold">Export / Print / Share</h3>
          <p className="text-sm text-slate-500">
            Create spreadsheets, printable reports, and shareable summaries for each
            deal.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <button
            onClick={exportExcel}
            className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Excel
          </button>

          <button
            onClick={exportCSV}
            className="flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold hover:bg-slate-50"
          >
            <Download className="h-4 w-4" />
            CSV
          </button>

          <button
            onClick={printReport}
            className="flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold hover:bg-slate-50"
          >
            <Printer className="h-4 w-4" />
            Print / PDF
          </button>

          <button
            onClick={copyReport}
            className="flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold hover:bg-slate-50"
          >
            <Copy className="h-4 w-4" />
            Copy
          </button>

          <button
            onClick={shareReport}
            className="flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold hover:bg-slate-50"
          >
            <Share2 className="h-4 w-4" />
            Share
          </button>
        </div>

        <div className="mt-3">
          <button
            onClick={exportJSON}
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-950"
          >
            <FileJson className="h-4 w-4" />
            Download raw JSON for audit/history
          </button>
        </div>
      </div>

      <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[min(92vw,360px)] flex-col gap-2 no-print">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-xl border px-4 py-3 text-sm font-semibold shadow-lg backdrop-blur ${toastClass(toast.kind)}`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </>
  );
}
