import {
  Check,
  FileSpreadsheet,
  Search,
  ShieldAlert,
  Tag,
} from "lucide-react";
import PhotoScanner from "@/components/PhotoScanner";
import { AppShell } from "@/components/AppShell";
import {
  Card,
  FormCard,
  PageHeading,
  TableWrap,
  WorkflowCard,
} from "@/components/AppLayoutBlocks";

const navItems = [
  { label: "Dashboard", to: "/" },
  { label: "New", to: "/scan/new" },
  { label: "Inventory", to: "#scan-types" },
  { label: "Analyze", to: "#sample-report" },
  { label: "Reports", to: "#pricing" },
  { label: "Settings", to: "#scanner" },
];

const bottomNavItems = [
  { label: "Dashboard", to: "/" },
  { label: "New", to: "/scan/new" },
  { label: "Inventory", to: "#scan-types" },
  { label: "Analyze", to: "#sample-report" },
];

const valueOutputs = [
  {
    title: "Estimated resale range",
    value: "$425-$690",
    note: "What similar lots sell for",
    icon: Tag,
  },
  {
    title: "Max safe offer",
    value: "$210",
    note: "Your top offer guidance",
    icon: ShieldAlert,
  },
  {
    title: "Hidden value clues",
    value: "Show what others miss",
    note: "Marks, models, demand",
    icon: Search,
  },
  {
    title: "Risk warnings",
    value: "Avoid costly mistakes",
    note: "Damage, missing parts, fakes",
    icon: ShieldAlert,
  },
];

const scanTypes = [
  "Sterling silver",
  "Golf clubs",
  "Tool lots",
  "Camera gear",
  "Video games",
  "Storage lockers",
  "Estate boxes",
  "Collectibles",
  "Electronics",
  "Musical instruments",
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

const boardCards = [
  { title: "Sterling silverware", tag: "Sterling mark?" },
  { title: "Golf clubs", tag: "Premium shaft" },
  { title: "Camera gear", tag: "Check model number" },
  { title: "Tool lots", tag: "Missing charger risk" },
  { title: "Video games", tag: "Good resale" },
  { title: "Storage lockers", tag: "Heavy shipping" },
];

export default function Home() {
  return (
    <AppShell
      title="Photo Detail Scanner"
      subtitle="Find value. Bid smarter."
      navItems={navItems}
      bottomNavItems={bottomNavItems}
      rightAction={
        <a
          href="/scan/new"
          className="btn btn-primary hide-mobile"
        >
          Start scanning
        </a>
      }
    >
      <PageHeading
        eyebrow="Hidden Value Board"
        title="Find the one item everyone else missed."
        description="Upload marketplace photos, estate boxes, silverware drawers, golf bags, tool lots, camera gear, or storage locker photos. Get item clues, value ranges, risk warnings, max offer guidance, and exportable reports before you bid."
      />

      <div className="stack-lg">
        <section className="two-column">
          <Card>
            <div className="stack">
              <p className="card-text">
                A reseller&apos;s field notebook for turning bad photos into buying decisions.
              </p>
              <div className="button-row">
                <a href="/scan/new" className="btn btn-primary btn-full">
                  Scan My First Lot
                </a>
                <a href="#sample-report" className="btn btn-secondary btn-full">
                  <FileSpreadsheet className="h-5 w-5" />
                  See Sample Report
                </a>
              </div>
            </div>
          </Card>

          <Card title="Reseller Treasure Hunt Board">
            <div className="mobile-list">
              {boardCards.map((card) => (
                <div key={card.title} className="mobile-list-item">
                  <div className="flex items-center justify-between gap-3">
                    <strong>{card.title}</strong>
                    <span className="workflow-status warning">{card.tag}</span>
                  </div>
                  <div className="card-text">Investigation card placeholder with a paper-note feel for mobile and desktop.</div>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section className="three-column">
          {valueOutputs.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title} title={item.title}>
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-[#18B7B2]" />
                  <div className="text-2xl font-black text-[#18B7B2]">{item.value}</div>
                </div>
                <p className="card-text mt-2">{item.note}</p>
              </Card>
            );
          })}
        </section>

        <section id="how-it-works" className="stack">
          <PageHeading
            eyebrow="Workflow"
            title="From messy photos to buying decision"
          />

          <WorkflowCard
            step="1"
            title="Drop in the photos"
            description="Upload screenshots, listing photos, or photos you took in person."
            status="Current"
            statusType="warning"
          />

          <WorkflowCard
            step="2"
            title="Get the scan report"
            description="The app identifies visible clues, possible value, missing parts, condition risks, and resale notes."
            status="Ready"
            statusType="done"
          />

          <WorkflowCard
            step="3"
            title="Decide before you pay"
            description="Use the max offer, confidence score, print report, or Excel export."
            status="Next"
          />
        </section>

        <section className="two-column">
          <Card title="Know before you bid">
            <div className="stack">
              {checklist.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-xl border border-[#E4D7BD] bg-[#FFFDF7] px-3 py-3">
                  <Check className="mt-0.5 h-4 w-4 text-[#18B7B2]" />
                  <span className="font-medium text-[#24313a]">{item}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Scan types">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {scanTypes.map((type) => (
                <div key={type} className="rounded-full border border-[#E4D7BD] bg-[#FFFDF7] px-3 py-2 text-center text-sm font-bold">
                  {type}
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section id="sample-report" className="two-column">
          <Card title="Sample report preview">
            <div className="stack">
              <div>
                <div className="page-eyebrow">Sample report</div>
                <h3 className="card-title text-2xl">Sterling Silver Lot</h3>
              </div>

              <div className="three-column">
                <div className="stat-card">
                  <div className="card-text">Estimated resale</div>
                  <div className="text-2xl font-black text-[#18B7B2]">$425-$690</div>
                </div>
                <div className="stat-card">
                  <div className="card-text">Max offer</div>
                  <div className="text-2xl font-black text-[#FF8A3D]">$210</div>
                </div>
                <div className="stat-card">
                  <div className="card-text">Confidence</div>
                  <div className="text-2xl font-black text-[#c68500]">Medium</div>
                </div>
              </div>

              <div className="info-card">
                <div className="flex items-start gap-2">
                  <Search className="mt-0.5 h-5 w-5 text-[#18B7B2]" />
                  <div>
                    <div className="font-black">Hidden value clue</div>
                    <div className="text-sm text-[#5E6A72]">Replacement-piece resale may exceed melt value.</div>
                  </div>
                </div>
              </div>

              <div className="info-card">
                <div className="flex items-start gap-2">
                  <ShieldAlert className="mt-0.5 h-5 w-5 text-[#FF8A3D]" />
                  <div>
                    <div className="font-black">Risk warning</div>
                    <div className="text-sm text-[#5E6A72]">Verify sterling marks, weight, and weighted handles.</div>
                  </div>
                </div>
              </div>

              <TableWrap>
                <table>
                  <thead>
                    <tr>
                      <th>Action</th>
                      <th>Use</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Print</td>
                      <td>Paper copy for the field</td>
                    </tr>
                    <tr>
                      <td>Export Excel</td>
                      <td>Spreadsheet for resale tracking</td>
                    </tr>
                    <tr>
                      <td>Save Scan</td>
                      <td>Archive the lot for later review</td>
                    </tr>
                  </tbody>
                </table>
              </TableWrap>
            </div>
          </Card>

          <Card title="Actions">
            <div className="button-row">
              <button className="btn btn-secondary btn-full">Print</button>
              <button className="btn btn-secondary btn-full">Export Excel</button>
              <button className="btn btn-secondary btn-full">Save Scan</button>
            </div>
          </Card>
        </section>

        <section id="pricing" className="info-card">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="page-title">Stop guessing from bad photos.</h2>
              <p className="page-description">
                Turn messy listings into a buying report before you risk your cash.
              </p>
            </div>
            <a href="/scan/new" className="btn btn-primary">
              Start scanning
            </a>
          </div>
        </section>

        <section id="scanner" className="stack">
          <PageHeading
            eyebrow="Live scanner"
            title="Start a new lot analysis"
            description="The scanner below uses the same mobile-first layout system and should remain vertical on phones, with a hamburger menu and bottom nav where relevant."
          />
          <FormCard>
            <PhotoScanner />
          </FormCard>
        </section>
      </div>
    </AppShell>
  );
}
