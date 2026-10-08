import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description:
    "Remittance terms and limits, KYC requirements, investment and property disclaimers, and governing law (Kenya) with the GDPR note for EU users.",
};

export default function TermsPage() {
  return (
    <>
      <header className="page-hero">
        <div className="container">
          <span className="eyebrow" style={{ color: "#9db4ff", borderColor: "rgba(255,255,255,0.25)" }}>
            Legal
          </span>
          <h1>Terms and Conditions</h1>
          <p>Last updated 8 October 2026</p>
        </div>
      </header>

      <section className="section">
        <article className="legal container">
          <h2>1. Remittance Terms and Limits</h2>
          <p>
            Barnabas Diaspora Services facilitates money transfers from the diaspora to Kenya.
            Personal transfers range from 10 to 15,000 units of your sending currency (GBP, USD,
            EUR, AED or CAD) per day and up to 40,000 per rolling month, subject to recipient
            M-Pesa limits. Larger transfers require a source-of-funds check arranged by our desk.
          </p>
          <p>
            Fees and the applicable exchange rate are shown before you confirm and locked at
            confirmation. Delivery estimates (minutes for instant, two working days for standard)
            assume normal banking operations; cut-off times, public holidays and compliance reviews
            may extend delivery. We may refuse or delay a transfer where required by law or where
            fraud is suspected, and we will tell you unless prohibited.
          </p>

          <h2>2. KYC Requirements</h2>
          <p>
            All senders complete identity verification: government photo ID, proof of address dated
            within three months, and a selfie for liveness. Business senders and investment clients
            may be asked for additional incorporation or source-of-funds documents. Failure to
            complete KYC prevents transfer execution. KYC data is handled per our{" "}
            <a href="/legal/privacy-policy">Privacy Policy</a>.
          </p>

          <h2>3. Investment Product Disclaimer</h2>
          <p>
            Investment facilitation is provided for information and arrangement only — it is{" "}
            <strong>not financial advice</strong> and returns are not guaranteed. Expected annual
            returns are estimates based on historical product performance; capital is at risk,
            particularly for SME lending and real estate products. Past performance is not a reliable
            indicator of future results. Consider your circumstances or seek independent advice
            before investing.
          </p>

          <h2>4. Property Listing Disclaimer</h2>
          <p>
            Property listings are supplied by developers and agents. While our legal team verifies
            title, rates clearance and consents where stated, prices, completion dates and
            specifications may change. Virtual viewings and photographs are indicative. All offers,
            deposits and completion payments are governed by the sale agreement with the developer,
            in addition to these terms.
          </p>

          <h2>5. Governing Law (Kenya) — GDPR Note for EU Users</h2>
          <p>
            These terms are governed by the laws of Kenya, and disputes are subject to the exclusive
            jurisdiction of the courts of Kenya. Nothing in this clause deprives UK/EU consumers of
            the mandatory protections of their home country: where the GDPR or UK GDPR applies, you
            retain your statutory rights and may bring proceedings in your country of residence, and
            we will comply with lawful cross-border enforcement of those rights.
          </p>

          <h3>Acceptable use</h3>
          <p>
            You must not use the service for fraud, money laundering, sanctions evasion or any
            unlawful purpose. You are responsible for the accuracy of recipient details; transfers
            executed to the details you provided are final once paid out.
          </p>

          <h3>Complaints</h3>
          <p>
            Contact <a href="/contact">our desk</a> first — we acknowledge within 1 working day and
            resolve within 14 days. Unresolved disputes may be escalated to the Central Bank of
            Kenya (remittances) or the Office of the Data Protection Commissioner (data matters).
          </p>
        </article>
      </section>
    </>
  );
}
