"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Check,
  CircleDollarSign,
  FileSpreadsheet,
  Gem,
  MapPin,
  Printer,
  Search,
  ShieldAlert,
  Sparkles,
  X,
} from "lucide-react";

/* ─── data ──────────────────────────────────────────────────────────── */

const boardCards = [
  {
    title: "Sterling silverware",
    tag: "Sterling mark?",
    tagColor: "bg-[#FFD447] text-[#2a2508]",
    rotate: "-rotate-3",
    bg: "bg-[linear-gradient(120deg,#ece0c6,#f6ead5,#e8d9b8)]",
  },
  {
    title: "Golf clubs",
    tag: "Premium shaft",
    tagColor: "bg-[#c6ecee] text-[#00484a]",
    rotate: "rotate-2",
    bg: "bg-[linear-gradient(120deg,#d6e8d4,#e8f4e7,#c8dfc6)]",
  },
  {
    title: "Camera gear",
    tag: "Check model number",
    tagColor: "bg-[#ffe0c0] text-[#7a3000]",
    rotate: "-rotate-1",
    bg: "bg-[linear-gradient(120deg,#d4d8de,#eaecf0,#c8cdd6)]",
  },
  {
    title: "Tool lots",
    tag: "Missing charger risk",
    tagColor: "bg-[#ffd6d6] text-[#8a1a1a]",
    rotate: "rotate-1",
    bg: "bg-[linear-gradient(120deg,#d9cfc0,#ede5d8,#d0c4b0)]",
  },
  {
    title: "Video games",
    tag: "Good resale",
    tagColor: "bg-[#d4f0d4] text-[#1a5c1a]",
    rotate: "-rotate-2",
    bg: "bg-[linear-gradient(120deg,#c8cfe8,#dde3f5,#bac3e0)]",
  },
  {
    title: "Storage lockers",
    tag: "Heavy shipping",
    tagColor: "bg-[#e8e0c0] text-[#5a4a00]",
    rotate: "rotate-3",
    bg: "bg-[linear-gradient(120deg,#d6c8a8,#ede4cc,#cabda0)]",
  },
];

const valueStrip = [
  {
    icon: CircleDollarSign,
    value: "$425–$690",
    label: "Estimated resale range",
    sub: "What similar lots sell for",
    color: "text-[#007B7A]",
  },
  {
    icon: ShieldAlert,
    value: "$210",
    label: "Max safe offer",
    sub: "Your top offer guidance",
    color: "text-[#FF8A3D]",
  },
  {
    icon: Search,
    value: "Show what others miss",
    label: "Hidden value clues",
    sub: "Marks, models, demand",
    color: "text-[#18B7B2]",
  },
  {
    icon: ShieldAlert,
    value: "Avoid costly mistakes",
    label: "Risk warnings",
    sub: "Damage, missing parts, fakes",
    color: "text-[#D94A38]",
  },
];

const steps = [
  {
    n: "1",
    title: "Drop in the photos",
    body: "Upload screenshots, listing photos, or photos you took in person.",
  },
  {
    n: "2",
    title: "Get the scan report",
    body: "The app identifies visible clues, possible value, missing parts, condition risks, and resale notes.",
  },
  {
    n: "3",
    title: "Decide before you pay",
    body: "Use the max offer, confidence score, print report, or Excel export.",
  },
];

const scanTypes = [
  { icon: "🥄", label: "Sterling silver" },
  { icon: "⛳", label: "Golf clubs" },
  { icon: "🔧", label: "Tool lots" },
  { icon: "📷", label: "Camera gear" },
  { icon: "🎮", label: "Video games" },
  { icon: "📦", label: "Storage lockers" },
  { icon: "🏠", label: "Estate boxes" },
  { icon: "⭐", label: "Collectibles" },
  { icon: "💻", label: "Electronics" },
  { icon: "🎸", label: "Musical instruments" },
];

const checklist = [
  "Is it real or plated?",
  "Is the set complete?",
  "Are important pieces missing?",
  "Is the brand/model visible?",
  "Is there damage or heavy shipping risk?",
  "Can individual pieces sell for more than the lot?",
  "What is the highest safe offer?",
];

/* ─── component ─────────────────────────────────────────────────────── */

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8F1E3] text-[#18232E]">
      {/* NAV */}
      <header className="sticky top-0 z-40 border-b border-[#E4D7BD] bg-[#FFFDF7]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 md:px-8">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#007B7A]">
              <Search className="h-5 w-5 text-white" />
            </div>
            <div className="leading-tight">
              <div className="text-[15px] font-black tracking-tight">Photo Detail Scanner</div>
              <div className="text-[11px] font-semibold text-[#FF8A3D]">Find value. Bid smarter.</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 text-[13px] font-semibold md:flex">
            <a href="#how-it-works"  className="hover:text-[#007B7A] transition-colors">How it works</a>
            <a href="#scan-types"    className="hover:text-[#007B7A] transition-colors">Scan types</a>
            <a href="#sample-report" className="hover:text-[#007B7A] transition-colors">Sample report</a>
            <a href="#pricing"       className="hover:text-[#007B7A] transition-colors">Pricing</a>
          </nav>

          <Link
            href="/scan/new"
            className="hidden md:inline-flex items-center gap-2 rounded-xl bg-[#007B7A] px-5 py-2.5 text-[13px] font-black text-white shadow-[0_4px_14px_rgba(0,123,122,.28)] transition hover:bg-[#005F5E]"
          >
            Start scanning <ArrowRight className="h-4 w-4" />
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#E4D7BD] bg-white md:hidden"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : (
              <span className="flex flex-col gap-1.5 items-center">
                <span className="block h-0.5 w-5 rounded bg-[#18232E]" />
                <span className="block h-0.5 w-5 rounded bg-[#18232E]" />
                <span className="block h-0.5 w-5 rounded bg-[#18232E]" />
              </span>
            )}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-[#E4D7BD] bg-[#FFFDF7] px-5 py-4 md:hidden">
            <nav className="grid gap-1">
              {[
                { href: "#how-it-works",  label: "How it works" },
                { href: "#scan-types",    label: "Scan types" },
                { href: "#sample-report", label: "Sample report" },
                { href: "#pricing",       label: "Pricing" },
              ].map((l) => (
                <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-[#F8F1E3]">
                  {l.label}
                </a>
              ))}
              <Link href="/scan/new"
                className="mt-2 block rounded-xl bg-[#007B7A] px-4 py-3 text-center text-sm font-black text-white">
                Start scanning
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-[#E4D7BD] bg-[radial-gradient(circle_at_15%_30%,#fff6d4_0%,transparent_50%),radial-gradient(circle_at_85%_10%,#e8f9f8_0%,transparent_45%)]">
        <div className="mx-auto grid max-w-7xl items-start gap-10 px-5 py-12 md:px-8 md:py-16 lg:grid-cols-2 lg:items-center">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#E4D7BD] bg-[#FFFDF7] px-3.5 py-1.5 text-xs font-black uppercase tracking-widest text-[#007B7A]">
              <MapPin className="h-3.5 w-3.5" /> Reseller Treasure Hunt
            </div>
            <h1 className="text-[clamp(2.4rem,7vw,4.5rem)] font-black leading-[0.93] tracking-tighter">
              Find the one item<br />
              <span className="relative inline-block">
                everyone else
                <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 300 8" fill="none" preserveAspectRatio="none">
                  <path d="M2 6 Q75 1 150 5 Q225 9 298 3" stroke="#FF8A3D" strokeWidth="3" strokeLinecap="round" fill="none" />
                </svg>
              </span>{" "}missed.
            </h1>
            <p className="mt-6 max-w-xl text-[15px] leading-7 text-[#5E6A72]">
              Upload marketplace photos, estate boxes, silverware drawers, golf bags, tool lots, camera gear,
              or storage locker photos. Get item clues, value ranges, risk warnings, max offer guidance, and
              exportable reports before you bid.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/scan/new"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#007B7A] px-7 py-4 text-base font-black text-white shadow-[0_8px_22px_rgba(0,123,122,.30)] transition hover:bg-[#005F5E] hover:-translate-y-0.5">
                <Sparkles className="h-5 w-5" /> Scan My First Lot <ArrowRight className="h-5 w-5" />
              </Link>
              <a href="#sample-report"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#C8BCA2] bg-[#FFFDF7] px-7 py-4 text-base font-bold transition hover:bg-[#F8F1E3]">
                <FileSpreadsheet className="h-5 w-5" /> See Sample Report
              </a>
            </div>
          </div>

          {/* collage board */}
          <div className="relative rounded-3xl border border-[#E4D7BD] bg-[#ede8da] p-5 shadow-[0_20px_50px_rgba(24,35,46,.14)]">
            <div className="mb-4 flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#FF8A3D]" />
              <div className="h-3 w-3 rounded-full bg-[#FFD447]" />
              <div className="h-3 w-3 rounded-full bg-[#18B7B2]" />
              <span className="ml-2 text-[11px] font-black uppercase tracking-widest text-[#5E6A72]">Investigation Board</span>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {boardCards.map((card) => (
                <div key={card.title}
                  className={`relative rounded-2xl border border-[#D8CAB0] bg-[#FFFDF7] p-3 shadow-[0_6px_18px_rgba(24,35,46,.12)] ${card.rotate} transition-transform hover:rotate-0 hover:scale-105`}>
                  <div className={`mb-2 h-20 rounded-xl ${card.bg} border border-[#E4D7BD]`} />
                  <div className="text-center text-[12px] font-black">{card.title}</div>
                  <div className={`absolute -right-2 -top-2 max-w-[110px] rounded-lg px-2 py-1 text-[10px] font-black shadow-sm rotate-3 border border-black/10 ${card.tagColor}`}>
                    {card.tag}
                  </div>
                  <div className="absolute left-1/2 top-1 h-2 w-2 -translate-x-1/2 rounded-full bg-[#007B7A] opacity-60" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* VALUE STRIP */}
      <section className="border-b border-[#E4D7BD] bg-[#FFFDF7]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-px bg-[#E4D7BD] sm:grid-cols-2 lg:grid-cols-4">
          {valueStrip.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-start gap-4 bg-[#FFFDF7] px-6 py-5">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F8F1E3]">
                  <Icon className={`h-5 w-5 ${item.color}`} />
                </div>
                <div>
                  <div className="text-[11px] font-black uppercase tracking-wider text-[#5E6A72]">{item.label}</div>
                  <div className={`text-xl font-black leading-tight ${item.color}`}>{item.value}</div>
                  <div className="mt-0.5 text-[12px] text-[#5E6A72]">{item.sub}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* THREE-STEP WORKFLOW */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="mb-3 text-[11px] font-black uppercase tracking-widest text-[#007B7A]">The workflow</div>
        <h2 className="text-[clamp(1.6rem,4vw,2.5rem)] font-black tracking-tight">From messy photos to buying decision</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.n} className="relative rounded-3xl border border-[#E4D7BD] bg-[#FFFDF7] p-7 shadow-[0_4px_16px_rgba(24,35,46,.07)]">
              {i < steps.length - 1 && (
                <div className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 md:block">
                  <ArrowRight className="h-5 w-5 text-[#C8BCA2]" />
                </div>
              )}
              <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#007B7A] text-xl font-black text-white shadow-[0_4px_12px_rgba(0,123,122,.30)]">
                {step.n}
              </div>
              <h3 className="text-xl font-black">{step.title}</h3>
              <p className="mt-2.5 text-[14px] leading-6 text-[#5E6A72]">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CHECKLIST + SAMPLE REPORT */}
      <section className="border-t border-[#E4D7BD] bg-[#FFFDF7]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 md:px-8 lg:grid-cols-[1.15fr_.85fr]">
          <div className="rounded-3xl border border-[#E4D7BD] bg-[#FFF9EB] p-7 shadow-[0_4px_16px_rgba(24,35,46,.07)]">
            <div className="mb-6 inline-flex items-center gap-2 rounded-xl bg-[#FFD447] px-3 py-1.5 text-[12px] font-black uppercase tracking-wide text-[#2a2508]">
              <BookOpen className="h-4 w-4" /> Know before you bid
            </div>
            <ul className="space-y-2.5">
              {checklist.map((item) => (
                <li key={item} className="flex items-center gap-3 rounded-xl bg-[#FFFDF7] px-4 py-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-[#007B7A]">
                    <Check className="h-3 w-3 text-[#007B7A]" />
                  </span>
                  <span className="text-[14px] font-semibold">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div id="sample-report" className="rounded-3xl border border-[#B9D6D5] bg-[#f4fdfc] p-7 shadow-[0_16px_40px_rgba(24,35,46,.13)]">
            <div className="mb-1 text-[11px] font-black uppercase tracking-widest text-[#007B7A]">Sample Report</div>
            <h3 className="text-4xl font-black tracking-tight">Sterling Silver Lot</h3>
            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-[#D5ECEA] bg-white p-3 text-center">
                <div className="text-[11px] text-[#5E6A72]">Estimated resale</div>
                <div className="text-xl font-black text-[#007B7A]">$425–$690</div>
              </div>
              <div className="rounded-2xl border border-[#D5ECEA] bg-white p-3 text-center">
                <div className="text-[11px] text-[#5E6A72]">Max offer</div>
                <div className="text-xl font-black text-[#FF8A3D]">$210</div>
              </div>
              <div className="rounded-2xl border border-[#D5ECEA] bg-white p-3 text-center">
                <div className="text-[11px] text-[#5E6A72]">Confidence</div>
                <div className="text-xl font-black text-[#c68500]">Medium</div>
              </div>
            </div>
            <div className="mt-4 space-y-3 rounded-2xl border border-[#D5ECEA] bg-white p-4">
              <div className="flex items-start gap-3">
                <Gem className="mt-0.5 h-5 w-5 shrink-0 text-[#007B7A]" />
                <div>
                  <div className="text-[13px] font-black">Hidden value clue</div>
                  <div className="text-[12px] text-[#5E6A72]">Replacement-piece resale may exceed melt value.</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-[#FF8A3D]" />
                <div>
                  <div className="text-[13px] font-black">Risk warning</div>
                  <div className="text-[12px] text-[#5E6A72]">Verify sterling marks, weight, and weighted handles.</div>
                </div>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2">
              <button className="flex items-center justify-center gap-1.5 rounded-xl border border-[#D5ECEA] bg-white py-2.5 text-[12px] font-bold hover:bg-[#f0faf9]">
                <Printer className="h-4 w-4" /> Print
              </button>
              <button className="flex items-center justify-center gap-1.5 rounded-xl border border-[#D5ECEA] bg-white py-2.5 text-[12px] font-bold hover:bg-[#f0faf9]">
                <FileSpreadsheet className="h-4 w-4" /> Export Excel
              </button>
              <button className="flex items-center justify-center gap-1.5 rounded-xl border border-[#D5ECEA] bg-white py-2.5 text-[12px] font-bold hover:bg-[#f0faf9]">
                <Sparkles className="h-4 w-4" /> Save Scan
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SCAN TYPES */}
      <section id="scan-types" className="border-t border-[#E4D7BD] bg-[#F8F1E3]">
        <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
          <div className="mb-3 text-[11px] font-black uppercase tracking-widest text-[#007B7A]">Categories</div>
          <h2 className="mb-8 text-[clamp(1.4rem,3.5vw,2rem)] font-black tracking-tight">Scan any lot. Any category.</h2>
          <div className="flex flex-wrap gap-3">
            {scanTypes.map((t) => (
              <Link key={t.label} href="/scan/new"
                className="inline-flex items-center gap-2 rounded-2xl border border-[#E4D7BD] bg-[#FFFDF7] px-4 py-2.5 text-[13px] font-bold shadow-[0_2px_8px_rgba(24,35,46,.06)] transition hover:border-[#007B7A] hover:bg-[#f0faf9] hover:text-[#007B7A]">
                <span className="text-base">{t.icon}</span> {t.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section id="pricing" className="border-t border-[#E4D7BD] bg-[#FFE7AC]">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-5 py-14 md:flex-row md:items-center md:px-8">
          <div>
            <h2 className="text-[clamp(1.6rem,5vw,2.8rem)] font-black leading-tight tracking-tight">
              Stop guessing from bad photos.
            </h2>
            <p className="mt-2 max-w-md text-[15px] leading-7 text-[#3f3a2a]">
              Turn messy listings into a buying report before you risk your cash.
            </p>
          </div>
          <Link href="/scan/new"
            className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-[#007B7A] px-8 py-4 text-[15px] font-black text-white shadow-[0_8px_22px_rgba(0,123,122,.30)] transition hover:bg-[#005F5E] hover:-translate-y-0.5">
            <Sparkles className="h-5 w-5" /> Start scanning <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#E4D7BD] bg-[#FFFDF7]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-6 text-[12px] text-[#5E6A72] md:flex-row md:px-8">
          <span className="font-semibold text-[#18232E]">Photo Detail Scanner</span>
          <span>Built for practical reseller decisions.</span>
          <a href="#" className="font-semibold text-[#007B7A] hover:underline">Back to top ↑</a>
        </div>
      </footer>
    </div>
  );
}
