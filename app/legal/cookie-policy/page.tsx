import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "How Barnabas Diaspora Services uses cookies — necessary, functional, analytics and marketing — in line with the Kenya Data Protection Act 2019 and the GDPR.",
};

export default function CookiePolicyPage() {
  return (
    <>
      <header className="page-hero">
        <div className="container">
          <span className="eyebrow" style={{ color: "#9db4ff", borderColor: "rgba(255,255,255,0.25)" }}>
            Legal
          </span>
          <h1>Cookie Policy</h1>
          <p>Last updated 8 October 2026</p>
        </div>
      </header>

      <section className="section">
        <article className="legal container">
          <p>
            Barnabas Diaspora Services uses cookies to personalise your remittance experience and
            remember your settings. This policy explains each category and how to change your choice
            at any time via the &ldquo;Cookie settings&rdquo; control at the bottom-left of every
            page.
          </p>

          <h2>Cookie categories</h2>
          <h3>1. Necessary (always on)</h3>
          <p>
            Session security, fraud prevention, load balancing and storage of your cookie choice
            itself. The site cannot function without these.
          </p>

          <h3>2. Functional (optional)</h3>
          <p>
            Remembers your sending currency (GBP, USD, EUR, AED, CAD), saved recipients, language
            preferences and calculator state so you do not re-enter them.
          </p>

          <h3>3. Analytics (optional)</h3>
          <p>
            Aggregated, pseudonymised usage statistics that help us understand how diaspora
            customers use the site so we can improve it.
          </p>

          <h3>4. Marketing (optional)</h3>
          <p>
            Used to show rate alerts and investment offers relevant to you, and to measure campaign
            performance. We do not sell personal data.
          </p>

          <h2>How we store your choice</h2>
          <p>
            Your consent is stored in your browser&apos;s localStorage under{" "}
            <code>bds_cookie_consent</code> and is respected across the site. You will not be asked
            again until you change your settings. Withdrawal of consent is as easy as granting it.
          </p>

          <h2>Legal framework</h2>
          <p>
            Optional cookies are set only with your consent under Article 6(1)(a) of the GDPR and
            section 30–32 of the Kenya Data Protection Act 2019. Necessary cookies rely on Article
            6(1)(b)/(f) (service delivery and security). For questions, contact our Data Protection
            Officer at dpo@barnabasdiaspora.co.ke.
          </p>
        </article>
      </section>
    </>
  );
}
