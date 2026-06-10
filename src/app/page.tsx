import {
  ArrowRight,
  Camera,
  CheckCircle2,
  ClipboardList,
  Coins,
  FileSpreadsheet,
  Gauge,
  Gem,
  PackageSearch,
  Printer,
  ShieldAlert,
  Sparkles,
  Zap,
} from "lucide-react";
import PhotoScanner from "@/components/PhotoScanner";

const categories = [
  "Sterling silver",
  "Golf bags",
  "Storage lockers",
  "Camera gear",
  "Tool lots",
  "Video games",
  "Estate boxes",
  "Collectibles",
];

const workflow = [
  {
    title: "Upload the photos",
    text: "Use Facebook Marketplace, Craigslist, estate sale, auction, or storage locker pictures.",
    icon: Camera,
  },
  {
    title: "AI builds the inventory",
    text: "The scanner reads visible items, brands, model clues, markings, condition, and risk.",
    icon: ClipboardList,
  },
  {
    title: "Get value + offer range",
    text: "See retail value, quick-sale value, melt value when relevant, and a safe max offer.",
    icon: Gauge,
  },
  {
    title: "Export the deal report",
    text: "Create printable reports, spreadsheets, CSV files, and shareable summaries.",
    icon: FileSpreadsheet,
  },
];

const useCases = [
  {
    title: "Silver Lot Scanner",
    text: "Separate sterling from plated. Detect marks like STERLING, 925, 800, EPNS, Rogers, 90, and plate.",
    badge: "Melt + replacement value",
  },
  {
    title: "Golf Bag Analyzer",
    text: "Identify visible clubs, bag value, missing pieces, brand clues, and part-out strategy.",
    badge: "Facebook deal finder",
  },
  {
    title: "Storage Unit Bid Tool",
    text: "Estimate visible value, hidden-value potential, trash burden, labor, and max safe bid.",
    badge: "Bid or pass",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#07111f] text-white">
      <section className="relative border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#18d5ff33,transparent_35%),radial-gradient(circle_at_75%_20%,#ffb00024,transparent_30%),linear-gradient(135deg,#07111f_0%,#0b1d33_50%,#0a0f1a_100%)]" />
        <div className="absolute -right-32 top-20 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-10 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:py-16">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100 shadow-[0_0_30px_rgba(34,211,238,.14)]">
              <Sparkles className="h-4 w-4" />
              AI Photo-to-Profit Scanner for Resellers
            </div>

            <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
              Scan messy lots.
              <span className="block bg-gradient-to-r from-cyan-200 via-white to-amber-200 bg-clip-text text-transparent">
                Find hidden value.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-xl leading-8 text-slate-300">
              Upload photos from Facebook Marketplace, Craigslist, estate sales,
              storage lockers, or silverware drawers. Get an inventory, value range,
              risks, max offer, printable report, and spreadsheet.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#scanner"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-6 py-4 text-lg font-black text-slate-950 shadow-[0_0_35px_rgba(103,232,249,.25)] transition hover:-translate-y-px hover:bg-cyan-200"
              >
                Start scanning
                <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
              </a>

              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-6 py-4 text-lg font-bold text-white backdrop-blur transition hover:bg-white/15"
              >
                See how it works
              </a>
            </div>

            <div className="mt-8 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
              {categories.map((category) => (
                <div
                  key={category}
                  className="rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-center text-sm font-semibold text-slate-200"
                >
                  {category}
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-r from-cyan-300/20 to-amber-300/20 blur-2xl" />

            <div className="relative rounded-[2rem] border border-white/15 bg-white/[0.08] p-4 shadow-2xl backdrop-blur-xl">
              <div className="rounded-[1.5rem] border border-white/10 bg-[#081425] p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-cyan-200">
                      Live Scan Report
                    </div>
                    <div className="text-2xl font-black">Sterling Silver Lot</div>
                  </div>
                  <div className="rounded-full bg-emerald-300 px-3 py-1 text-sm font-black text-emerald-950">
                    BUY
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl bg-white/[0.07] p-4">
                    <div className="text-xs uppercase tracking-wide text-slate-400">
                      Retail range
                    </div>
                    <div className="mt-1 text-2xl font-black">$425-$690</div>
                  </div>
                  <div className="rounded-2xl bg-white/[0.07] p-4">
                    <div className="text-xs uppercase tracking-wide text-slate-400">
                      Max offer
                    </div>
                    <div className="mt-1 text-2xl font-black">$210</div>
                  </div>
                  <div className="rounded-2xl bg-white/[0.07] p-4">
                    <div className="text-xs uppercase tracking-wide text-slate-400">
                      Confidence
                    </div>
                    <div className="mt-1 text-2xl font-black">Medium</div>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-cyan-200/20 bg-cyan-200/10 p-4">
                  <div className="mb-2 flex items-center gap-2 font-black text-cyan-100">
                    <Gem className="h-5 w-5" />
                    Hidden Value Alert
                  </div>
                  <p className="text-sm leading-6 text-slate-300">
                    Markings suggest sterling or European silver. Replacement-piece
                    resale may exceed melt value. Verify weight and close-up stamps.
                  </p>
                </div>

                <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-white/[0.06] text-slate-300">
                      <tr>
                        <th className="p-3">Item</th>
                        <th className="p-3">Clue</th>
                        <th className="p-3">Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      <tr>
                        <td className="p-3 font-semibold">Dinner fork</td>
                        <td className="p-3 text-slate-300">Sterling mark</td>
                        <td className="p-3 font-black">$65-$110</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold">Serving spoon</td>
                        <td className="p-3 text-slate-300">Pattern visible</td>
                        <td className="p-3 font-black">$90-$160</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold">Knife</td>
                        <td className="p-3 text-slate-300">Weighted warning</td>
                        <td className="p-3 font-black">$25-$60</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="flex items-center justify-center gap-2 rounded-xl bg-white/[0.07] px-3 py-3 text-sm font-bold">
                    <Printer className="h-4 w-4" />
                    Print
                  </div>
                  <div className="flex items-center justify-center gap-2 rounded-xl bg-white/[0.07] px-3 py-3 text-sm font-bold">
                    <FileSpreadsheet className="h-4 w-4" />
                    Excel
                  </div>
                  <div className="flex items-center justify-center gap-2 rounded-xl bg-white/[0.07] px-3 py-3 text-sm font-bold">
                    <PackageSearch className="h-4 w-4" />
                    Save
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-amber-300/30 bg-amber-300 px-5 py-4 font-black text-slate-950 shadow-xl md:block">
              Know before you bid.
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#09182b]">
        <div className="mx-auto grid max-w-7xl gap-4 px-5 py-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5">
            <div className="mb-2 flex items-center gap-2 font-black text-cyan-200">
              <Zap className="h-5 w-5" />
              Fast deal analysis
            </div>
            <p className="text-sm leading-6 text-slate-300">
              Most marketplace lots are under-described. The scanner turns weak
              photos into a structured buying report.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5">
            <div className="mb-2 flex items-center gap-2 font-black text-amber-200">
              <Coins className="h-5 w-5" />
              Hidden value detection
            </div>
            <p className="text-sm leading-6 text-slate-300">
              Find the one item that changes the whole deal: sterling marks,
              premium golf clubs, camera lenses, games, tools, and collectibles.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5">
            <div className="mb-2 flex items-center gap-2 font-black text-rose-200">
              <ShieldAlert className="h-5 w-5" />
              Risk warnings
            </div>
            <p className="text-sm leading-6 text-slate-300">
              Avoid plated silver, weighted handles, broken electronics, missing
              parts, storage locker trash burden, and overpaying.
            </p>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-[#07111f] px-5 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <div className="mb-3 text-sm font-black uppercase tracking-[0.25em] text-cyan-200">
              The workflow
            </div>
            <h2 className="text-4xl font-black tracking-tight md:text-5xl">
              From messy photo to buying decision.
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-300">
              The app is not just a photo scanner. It is a resale decision engine
              that creates inventory, price ranges, offer advice, and exportable
              reports.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-4">
            {workflow.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="relative rounded-3xl border border-white/10 bg-white/[0.06] p-6"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-300 text-slate-950">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="text-5xl font-black text-white/10">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="text-xl font-black">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    {step.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0b1d33] px-5 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:items-end">
            <div>
              <div className="mb-3 text-sm font-black uppercase tracking-[0.25em] text-amber-200">
                Built for profitable lots
              </div>
              <h2 className="text-4xl font-black tracking-tight md:text-5xl">
                Start with silver and golf. Expand to every messy lot.
              </h2>
            </div>
            <p className="text-lg leading-8 text-slate-300">
              The same engine can analyze sterling silver, golf bags, camera lots,
              toolboxes, video game bundles, storage lockers, estate boxes, and
              collectibles. Each mode has its own risk rules and valuation logic.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {useCases.map((useCase) => (
              <div
                key={useCase.title}
                className="group rounded-3xl border border-white/10 bg-[#07111f] p-6 transition hover:-translate-y-1 hover:border-cyan-300/40"
              >
                <div className="mb-5 inline-flex rounded-full bg-amber-300 px-3 py-1 text-xs font-black uppercase tracking-wide text-slate-950">
                  {useCase.badge}
                </div>
                <h3 className="text-2xl font-black">{useCase.title}</h3>
                <p className="mt-3 leading-7 text-slate-300">{useCase.text}</p>
                <div className="mt-6 flex items-center gap-2 font-black text-cyan-200">
                  Analyze this category
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="scanner" className="bg-slate-50 text-slate-950">
        <PhotoScanner />
      </section>

      <section className="bg-[#07111f] px-5 py-14">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-gradient-to-r from-cyan-300/15 to-amber-300/15 p-8 text-center shadow-2xl">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-300 text-slate-950">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h2 className="text-4xl font-black tracking-tight">
            The deal is won before the pickup.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-300">
            Scan first. Price fast. Ask better questions. Know your max offer.
            Export the report and keep every deal organized.
          </p>
          <a
            href="#scanner"
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-7 py-4 text-lg font-black text-slate-950"
          >
            Scan a lot now
            <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      </section>
    </main>
  );
}
