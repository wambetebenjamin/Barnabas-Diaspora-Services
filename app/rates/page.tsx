import type { Metadata } from "next";
import { getRates, computeFee } from "@/lib/rates";
import { CURRENCIES, formatKES } from "@/lib/design";

export const dynamic = "force-dynamic"; // SSR for live accuracy

export const metadata: Metadata = {
  title: "Live Exchange Rates — Sending Currency to KES",
  description:
    "Today's live sending rates to the Kenyan shilling from GBP, USD, EUR, AED and CAD, with transparent fee schedules.",
};

export default async function RatesPage() {
  const snapshot = await getRates();

  return (
    <>
      <header className="page-hero">
        <div className="container">
          <span className="eyebrow" style={{ color: "#9db4ff", borderColor: "rgba(255,255,255,0.25)" }}>
            Live rates
          </span>
          <h1>Today&apos;s exchange rates to KES</h1>
          <p>
            Rendered on the server at request time for accuracy. Board source:{" "}
            {snapshot.source} · updated{" "}
            {new Date(snapshot.updatedAt).toLocaleTimeString("en-GB")}.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="container" style={{ maxWidth: 860 }}>
          <table className="card" style={{ width: "100%", borderCollapse: "collapse" }}>
            <caption className="sr-only">
              Exchange rates from sending currencies to Kenyan shilling, with sample transfer fees
            </caption>
            <thead>
              <tr>
                <th scope="col" style={{ textAlign: "left", padding: 14 }}>Currency</th>
                <th scope="col" style={{ textAlign: "right", padding: 14 }}>1 unit buys (KES)</th>
                <th scope="col" style={{ textAlign: "right", padding: 14 }}>Fee on 1,000 (instant)</th>
                <th scope="col" style={{ textAlign: "right", padding: 14 }}>1,000 sends (KES)</th>
              </tr>
            </thead>
            <tbody>
              {CURRENCIES.map((c) => {
                const rate = snapshot.rates[c.code];
                const fee = computeFee(1000, "instant");
                return (
                  <tr key={c.code} style={{ borderTop: "1px solid var(--light)" }}>
                    <td style={{ padding: 14 }}>
                      <strong>{c.code}</strong> — {c.label}
                    </td>
                    <td style={{ textAlign: "right", padding: 14 }}>
                      <strong>{rate.toFixed(2)}</strong>
                    </td>
                    <td style={{ textAlign: "right", padding: 14 }}>
                      {c.symbol}
                      {fee.toFixed(2)}
                    </td>
                    <td style={{ textAlign: "right", padding: 14 }}>
                      {formatKES((1000 - fee) * rate)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <p className="meta" style={{ marginTop: 18 }}>
            Rates refresh every 5 minutes and are pushed live to open sessions through /api/ws.
            Standard-speed transfers halve the percentage fee. Rates shown may differ at the moment
            of confirmation — the review step always shows the locked rate.
          </p>
        </div>
      </section>
    </>
  );
}
