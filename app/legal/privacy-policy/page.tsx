import type { Metadata } from "next";
import { SITE } from "@/lib/design";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Barnabas Diaspora Services collects, encrypts and protects remittance, KYC and financial data under the Kenya Data Protection Act 2019 and the GDPR.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <header className="page-hero">
        <div className="container">
          <span className="eyebrow" style={{ color: "#9db4ff", borderColor: "rgba(255,255,255,0.25)" }}>
            Legal
          </span>
          <h1>Privacy Policy</h1>
          <p>Last updated 8 October 2026 · Kenya Data Protection Act 2019 &amp; GDPR compliant</p>
        </div>
      </header>

      <section className="section">
        <article className="legal container">
          <p>
            Barnabas Diaspora Services (&ldquo;Barnabas&rdquo;, &ldquo;we&rdquo;) operates from
            Nairobi, Kenya with a UK desk in London. This policy explains what personal data we
            collect when you send money, invest, enquire about property, register a chama or use our
            document services — and how that data is protected.
          </p>

          <h2>1. Remittance Data</h2>
          <p>
            When you initiate a transfer we collect your name, contact details, the recipient&apos;s
            name and M-Pesa number, the transfer amount and currency, and the payment method you
            choose. This data is required to execute your instruction, to provide confirmations by
            email and WhatsApp, and to give you receipts and statements.
          </p>
          <p>
            Remittance records are stored encrypted in transit (TLS 1.2+) and at rest (AES-256) in
            our Vercel KV data store, with access limited to authorised operations staff under
            strict role-based controls.
          </p>

          <h2>2. KYC Data</h2>
          <p>
            For first-time senders and certain investment products we must complete Know Your
            Customer checks: a government photo ID, a recent proof of address, and a selfie for
            liveness verification. These documents are uploaded to Vercel Blob storage, encrypted
            at rest, and served only through short-lived signed URLs (15-minute expiry).
          </p>
          <p>
            We process KYC data to comply with Kenyan anti-money-laundering law (Proceeds of Crime
            and Anti-Money Laundering Act) and equivalent UK/EU obligations — never for marketing.
          </p>

          <h2>3. Financial Transaction Records</h2>
          <p>
            <strong>
              All financial transaction records are encrypted and secured using industry-standard
              controls (TLS in transit, AES-256 at rest, least-privilege access, and full audit
              logging).
            </strong>{" "}
            Records include transfer references, converted KES amounts, applied rates and fees,
            M-Pesa payout conversation IDs and payment processor references (Stripe, PayPal, SWIFT).
          </p>

          <h2>4. GDPR Rights for EU Users</h2>
          <p>
            If you are in the UK, EU or EEA, the GDPR gives you the right to access, rectify, erase,
            restrict and port your personal data, and to object to processing based on legitimate
            interests. Our legal bases are contract performance (Article 6(1)(b)), legal obligation
            (Article 6(1)(c)) and consent (Article 6(1)(a)) for marketing. You may withdraw consent
            at any time. You also have the right to lodge a complaint with your supervisory authority
            (in the UK, the ICO).
          </p>

          <h2>5. Kenya Data Protection Act Rights</h2>
          <p>
            Under the Kenya Data Protection Act 2019 you have the right to be informed of the use of
            your data, to access and correct it, to object to processing, to data portability, and to
            delete data that is no longer necessary. Complaints may be lodged with the Office of the
            Data Protection Commissioner (ODPC) of Kenya. We are registered as a data controller and
            processor under the Act.
          </p>

          <h2>6. Retention Policy</h2>
          <ul>
            <li>Remittance and financial transaction records: 7 years (statutory AML requirement).</li>
            <li>KYC documents: duration of the customer relationship + 5 years, then secure deletion.</li>
            <li>Support and contact correspondence: 24 months.</li>
            <li>Newsletter subscriptions: until you unsubscribe (instant deletion).</li>
            <li>Cookie preferences: until changed by you (stored locally in your browser).</li>
          </ul>

          <h2>7. Contact the Data Protection Officer</h2>
          <p>
            For any privacy request — access, correction, deletion, portability or complaint —
            contact our Data Protection Officer:
          </p>
          <ul>
            <li>
              Email: <a href={`mailto:${SITE.dpoEmail}`}>{SITE.dpoEmail}</a>
            </li>
            <li>
              Post: Data Protection Officer, {SITE.officeNairobi}
            </li>
            <li>
              UK desk: {SITE.officeUk}
            </li>
            <li>
              WhatsApp / phone: {SITE.phoneKe}
            </li>
          </ul>
          <p className="meta">
            We respond to verified requests within 30 days. See also our{" "}
            <a href="/legal/terms">Terms</a>, <a href="/legal/cookie-policy">Cookie Policy</a> and{" "}
            <a href="/legal/gdpr">GDPR notice</a>.
          </p>
        </article>
      </section>
    </>
  );
}
