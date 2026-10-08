import type { Metadata } from "next";
import { Suspense } from "react";
import { InvestmentRail } from "@/components/investments/InvestmentRail";
import { InvestmentEnquiry } from "@/components/investments/InvestmentEnquiry";
import { INVESTMENTS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Diaspora Investment Products",
  description:
    "Government bonds, unit trusts, real estate, chama accounts, fixed deposits and SME loans in Kenya — with transparent returns and risk levels.",
  openGraph: {
    title: "Diaspora Investment Products | Barnabas Diaspora Services",
    description:
      "Invest while you are away: vetted Kenyan investment products with expected returns, minimums and risk levels.",
    images: [{ url: "/images/investment-planning.jpg", width: 1200, height: 630 }],
  },
};

export default function InvestPage() {
  return (
    <>
      <header className="page-hero">
        <div className="container">
          <span className="eyebrow" style={{ color: "#9db4ff", borderColor: "rgba(255,255,255,0.25)" }}>
            Investment facilitation
          </span>
          <h1>Invest while you are away</h1>
          <p>
            Six vetted product categories, each with transparent expected returns, minimum
            investment and risk level — arranged end-to-end from wherever you live.
          </p>
        </div>
      </header>

      <InvestmentRail />

      <section className="section" aria-label="Investment product details">
        <div className="container">
          <div className="grid-2">
            {INVESTMENTS.map((item) => (
              <article className="card" key={`detail-${item.slug}`}>
                <h3>{item.name}</h3>
                <p className="muted">{item.blurb}</p>
                <div className="row" style={{ justifyContent: "space-between" }}>
                  <span>
                    <strong>{item.expectedReturn}</strong> expected annual return
                  </span>
                  <span className="meta">Min. KES {item.minInvestmentKES.toLocaleString()}</span>
                </div>
                <span className={`risk ${item.risk === "Low" ? "risk-low" : item.risk === "Medium" ? "risk-medium" : "risk-high"}`}>
                  {item.risk} risk
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Suspense fallback={<div className="section" />}>
        <InvestmentEnquiry />
      </Suspense>
    </>
  );
}
