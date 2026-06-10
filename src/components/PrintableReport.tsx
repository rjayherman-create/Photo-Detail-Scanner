"use client";

import { PhotoAnalysis } from "@/lib/types";

function money(value: number | null | undefined) {
  if (value === null || value === undefined) return "Unknown";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function PrintableReport({
  analysis,
}: {
  analysis: PhotoAnalysis;
}) {
  return (
    <div id="printable-report" className="hidden print:block">
      <div className="p-8 text-black">
        <div className="border-b pb-4">
          <h1 className="text-3xl font-bold">Photo Detail Scanner Report</h1>
          <p className="mt-1 text-sm">
            AI marketplace inventory, value, and buy/pass report
          </p>
        </div>

        <section className="mt-6">
          <h2 className="text-2xl font-bold">{analysis.title}</h2>
          <p className="mt-2">{analysis.summary}</p>
          <p className="mt-2">
            <strong>Scan Mode:</strong> {analysis.scanMode}
          </p>
          <p>
            <strong>Confidence:</strong> {analysis.confidence}
          </p>
        </section>

        <section className="mt-6 rounded border p-4">
          <h3 className="text-xl font-bold">Deal Recommendation</h3>
          <p className="mt-2">
            <strong>Decision:</strong>{" "}
            {analysis.buyRecommendation?.decision?.toUpperCase()}
          </p>
          <p>
            <strong>Suggested Max Offer:</strong>{" "}
            {money(analysis.buyRecommendation?.maxOfferLow)} -{" "}
            {money(analysis.buyRecommendation?.maxOfferHigh)}
          </p>
          <p className="mt-2">{analysis.buyRecommendation?.reasoning}</p>
        </section>

        <section className="mt-6 grid grid-cols-3 gap-4">
          <div className="rounded border p-3">
            <div className="text-sm">Retail Resale</div>
            <div className="text-lg font-bold">
              {money(analysis.valueEstimate?.likelyRetailResaleLow)} -{" "}
              {money(analysis.valueEstimate?.likelyRetailResaleHigh)}
            </div>
          </div>
          <div className="rounded border p-3">
            <div className="text-sm">Quick Sale</div>
            <div className="text-lg font-bold">
              {money(analysis.valueEstimate?.likelyQuickSaleLow)} -{" "}
              {money(analysis.valueEstimate?.likelyQuickSaleHigh)}
            </div>
          </div>
          <div className="rounded border p-3">
            <div className="text-sm">Melt Value</div>
            <div className="text-lg font-bold">
              {money(analysis.valueEstimate?.meltValueLow)} -{" "}
              {money(analysis.valueEstimate?.meltValueHigh)}
            </div>
          </div>
        </section>

        <section className="mt-6">
          <h3 className="text-xl font-bold">Visible Inventory</h3>
          <table className="mt-3 w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border p-2 text-left">Item</th>
                <th className="border p-2 text-left">Category</th>
                <th className="border p-2 text-left">Condition</th>
                <th className="border p-2 text-left">Confidence</th>
                <th className="border p-2 text-left">Estimated Value</th>
                <th className="border p-2 text-left">Notes</th>
              </tr>
            </thead>
            <tbody>
              {analysis.visibleInventory?.map((item, index) => (
                <tr key={index}>
                  <td className="border p-2">{item.itemName}</td>
                  <td className="border p-2">{item.category}</td>
                  <td className="border p-2">{item.condition}</td>
                  <td className="border p-2">{item.confidence}</td>
                  <td className="border p-2">
                    {money(item.estimatedResaleLow)} -{" "}
                    {money(item.estimatedResaleHigh)}
                  </td>
                  <td className="border p-2">{item.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {analysis.markingsDetected?.length > 0 && (
          <section className="mt-6">
            <h3 className="text-xl font-bold">Marks / Stamps Detected</h3>
            <table className="mt-3 w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border p-2 text-left">Visible Text</th>
                  <th className="border p-2 text-left">Likely Meaning</th>
                  <th className="border p-2 text-left">Confidence</th>
                  <th className="border p-2 text-left">Importance</th>
                </tr>
              </thead>
              <tbody>
                {analysis.markingsDetected?.map((mark, index) => (
                  <tr key={index}>
                    <td className="border p-2">{mark.visibleText}</td>
                    <td className="border p-2">{mark.likelyMeaning}</td>
                    <td className="border p-2">{mark.confidence}</td>
                    <td className="border p-2">{mark.importance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        <section className="mt-6 grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-bold">Risks</h3>
            <ul className="mt-2 list-disc pl-5">
              {analysis.risks?.map((risk, index) => (
                <li key={index}>{risk}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold">Questions For Seller</h3>
            <ul className="mt-2 list-disc pl-5">
              {analysis.questionsForSeller?.map((question, index) => (
                <li key={index}>{question}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-6">
          <h3 className="text-xl font-bold">Resale Plan</h3>
          <ul className="mt-2 list-disc pl-5">
            {analysis.resalePlan?.map((plan, index) => (
              <li key={index}>{plan}</li>
            ))}
          </ul>
        </section>

        <section className="mt-6">
          <h3 className="text-xl font-bold">Listing Title Ideas</h3>
          <ul className="mt-2 list-disc pl-5">
            {analysis.listingTitleSuggestions?.map((title, index) => (
              <li key={index}>{title}</li>
            ))}
          </ul>
        </section>

        <section className="mt-8 border-t pt-4 text-xs">
          <strong>Disclaimer:</strong> {analysis.disclaimer}
        </section>
      </div>
    </div>
  );
}
