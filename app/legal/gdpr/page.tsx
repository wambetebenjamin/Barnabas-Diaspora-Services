import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GDPR Notice",
  description:
    "GDPR notice for Barnabas Diaspora Services customers in the UK and EU: legal bases, international transfers, rights and contacts.",
};

export default function GdprPage() {
  return (
    <>
      <header className="page-hero">
        <div className="container">
          <span className="eyebrow" style={{ color: "#9db4ff", borderColor: "rgba(255,255,255,0.25)" }}>
            Legal
          </span>
          <h1>GDPR Notice (UK &amp; EU Users)</h1>
          <p>Last updated 8 October 2026</p>
        </div>
      </header>

      <section className="section">
        <article className="legal container">
          <h2>Who we are</h2>
          <p>
            Barnabas Diaspora Services, with a UK desk at 2nd Floor, 45 King William Street, London
            EC4R 9AN, acts as controller for personal data described in our{" "}
            <a href="/legal/privacy-policy">Privacy Policy</a>.
          </p>

          <h2>Legal bases</h2>
          <ul>
            <li><strong>Contract (Art. 6(1)(b)):</strong> executing transfers, KYC before contract, support.</li>
            <li><strong>Legal obligation (Art. 6(1)(c)):</strong> AML record-keeping, tax reporting.</li>
            <li><strong>Consent (Art. 6(1)(a)):</strong> marketing emails, analytics cookies.</li>
            <li><strong>Legitimate interests (Art. 6(1)(f)):</strong> fraud prevention, service security.</li>
          </ul>

          <h2>International transfers</h2>
          <p>
            Transfer and KYC data is processed in Kenya (where you receive our remittance service)
            and on EU/UK/US cloud infrastructure. Kenya benefits from an adequacy-style framework
            recognised under section 49 safeguards, and we supplement this with Standard Contractual
            Clauses and encryption in transit and at rest.
          </p>

          <h2>Your rights</h2>
          <p>
            Access, rectification, erasure, restriction, portability and objection — plus the right
            to withdraw consent and to lodge a complaint with the ICO (UK) or your local EU
            supervisory authority. Requests go to dpo@barnabasdiaspora.co.ke and are answered within
            30 days.
          </p>

          <h2>Automated decisions</h2>
          <p>
            Fraud-scoring on transfers may be automated; you can request human review of any decision
            that significantly affects you by contacting the DPO.
          </p>

          <h2>Retention</h2>
          <p>
            Financial records are kept 7 years (AML law); KYC data for the relationship + 5 years;
            marketing consent records until withdrawal. Details in our{" "}
            <a href="/legal/privacy-policy">Privacy Policy</a>.
          </p>
        </article>
      </section>
    </>
  );
}
