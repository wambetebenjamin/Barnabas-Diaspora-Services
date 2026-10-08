import { FileText, CheckCircle, Send } from "lucide-react";
import { DOC_SERVICES } from "@/lib/data";

/** Document services — Kenya Power, NTSA, KRA, passport renewal. */
export function DocumentServices() {
  return (
    <section className="section" id="documents" aria-labelledby="docs-heading">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Document services</span>
          <h2 id="docs-heading">Kenyan paperwork, handled while you are abroad</h2>
          <p className="muted">
            Our Nairobi office runs the errands: billing errors, licences, tax filings and passport
            renewals — with clear fees in GBP or USD.
          </p>
        </div>

        <div className="grid-2">
          {DOC_SERVICES.map((service) => (
            <article key={service.name} className="doc-card">
              <div className="row" style={{ gap: 12 }}>
                <div className="invest-icon" aria-hidden="true">
                  <FileText size={22} />
                </div>
                <h3 style={{ margin: 0 }}>{service.name}</h3>
              </div>
              <p className="muted" style={{ fontSize: 13 }}>{service.description}</p>

              <div>
                <strong style={{ fontSize: 12, fontFamily: "var(--font-display)" }}>Required documents</strong>
                <ul style={{ margin: "8px 0 0", paddingLeft: 18 }}>
                  {service.required.map((doc) => (
                    <li key={doc} className="row" style={{ gap: 8, fontSize: 13 }}>
                      <CheckCircle size={14} aria-hidden="true" /> {doc}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="row" style={{ justifyContent: "space-between", marginTop: "auto" }}>
                <span className="doc-fee">
                  £{service.feeGBP} GBP / ${service.feeUSD} USD
                </span>
                <a href="/contact" className="btn btn-primary">
                  <Send size={15} className="icon-anim" />
                  Request This Service
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
