"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileSpreadsheet, ShieldAlert, Sparkles } from "lucide-react";
import { PhotoAnalysis } from "@/lib/types";

function money(value: number | null | undefined) {
  if (value === null || value === undefined) return "Unknown";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ScanReportPage() {
  const router = useRouter();
  const [analysis] = useState<PhotoAnalysis | null>(() => {
    if (typeof window === "undefined") return null;

    try {
      const raw = sessionStorage.getItem("newScanResult");
      if (!raw) return null;
      return JSON.parse(raw) as PhotoAnalysis;
    } catch {
      return null;
    }
  });

  return (
    <main className="min-h-screen bg-[#F8F1E3] text-[#18232E]">
      <div className="mx-auto w-full max-w-md px-4 pb-8 pt-[calc(12px+env(safe-area-inset-top))]">
        <header className="flex items-center justify-between py-2">
          <button
            type="button"
            onClick={() => router.push("/scan/new")}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-[#18232E]"
            aria-label="Back to new scan"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-4xl font-black tracking-tight" style={{ fontFamily: '"Georgia", serif', fontSize: "2rem" }}>
            Scan Report
          </h1>
          <div className="h-11 w-11" />
        </header>

        {!analysis ? (
          <section className="mt-6 rounded-2xl border border-[#E4D7BD] bg-[#FFFDF7] p-5 text-center">
            <p className="text-[#5E6A72]">No scan report found yet.</p>
            <Link href="/scan/new" className="btn btn-primary mt-4 inline-flex">
              Start new scan
            </Link>
          </section>
        ) : (
          <section className="mt-4 space-y-4">
            <article className="rounded-2xl border border-[#E4D7BD] bg-[#FFFDF7] p-5 shadow-[0_8px_20px_rgba(24,35,46,0.08)]">
              <div className="mb-1 text-xs font-black uppercase tracking-wider text-[#007B7A]">
                New lot result
              </div>
              <h2 className="text-3xl font-black">{analysis.title}</h2>
              <p className="mt-2 text-[#5E6A72]">{analysis.summary}</p>
            </article>

            <article className="grid grid-cols-3 gap-2">
              <div className="rounded-xl border border-[#E4D7BD] bg-[#FFFDF7] p-3">
                <div className="text-xs text-[#5E6A72]">Resale</div>
                <div className="text-lg font-black text-[#007B7A]">
                  {money(analysis.valueEstimate?.likelyRetailResaleLow)} - {money(analysis.valueEstimate?.likelyRetailResaleHigh)}
                </div>
              </div>
              <div className="rounded-xl border border-[#E4D7BD] bg-[#FFFDF7] p-3">
                <div className="text-xs text-[#5E6A72]">Max offer</div>
                <div className="text-lg font-black text-[#F47A2A]">
                  {money(analysis.buyRecommendation?.maxOfferHigh)}
                </div>
              </div>
              <div className="rounded-xl border border-[#E4D7BD] bg-[#FFFDF7] p-3">
                <div className="text-xs text-[#5E6A72]">Confidence</div>
                <div className="text-lg font-black capitalize">{analysis.confidence}</div>
              </div>
            </article>

            <article className="rounded-2xl border border-[#E4D7BD] bg-[#FFFDF7] p-4">
              <div className="mb-2 flex items-start gap-2">
                <Sparkles className="mt-0.5 h-5 w-5 text-[#007B7A]" />
                <div>
                  <div className="font-black">Top clue</div>
                  <div className="text-sm text-[#5E6A72]">{analysis.valueEstimate?.valueNotes?.[0] || "Review item-level clues."}</div>
                </div>
              </div>

              <div className="mt-3 flex items-start gap-2">
                <ShieldAlert className="mt-0.5 h-5 w-5 text-[#D94A38]" />
                <div>
                  <div className="font-black">Risk warning</div>
                  <div className="text-sm text-[#5E6A72]">{analysis.risks?.[0] || "Confirm condition and authenticity before payment."}</div>
                </div>
              </div>
            </article>

            <article className="rounded-2xl border border-[#E4D7BD] bg-[#FFFDF7] p-4">
              <h3 className="font-black">Visible inventory</h3>
              <div className="mt-3 space-y-2">
                {analysis.visibleInventory?.slice(0, 6).map((item, idx) => (
                  <div key={`${item.itemName}-${idx}`} className="rounded-xl border border-[#E4D7BD] bg-white px-3 py-2">
                    <div className="font-semibold">{item.itemName}</div>
                    <div className="text-xs text-[#5E6A72]">
                      {item.category} • {item.condition} • {money(item.estimatedResaleLow)} - {money(item.estimatedResaleHigh)}
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <div className="grid grid-cols-2 gap-2">
              <Link href="/scan/new" className="btn btn-secondary inline-flex min-h-12 items-center justify-center rounded-xl border border-[#E4D7BD] bg-[#FFFDF7] font-bold">
                New Scan
              </Link>
              <Link href="/" className="btn btn-primary inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#007B7A] font-bold text-white">
                <FileSpreadsheet className="h-5 w-5" />
                Full workspace
              </Link>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
