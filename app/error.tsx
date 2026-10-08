"use client";

import { useEffect } from "react";
import { RefreshCw, MessageCircle, Phone } from "lucide-react";
import { SITE } from "@/lib/design";

/**
 * 500 — "Our transfer system is temporarily offline. Your funds are safe."
 * Try Again + prominent WhatsApp support number.
 */
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[Barnabas 500]", error);
  }, [error]);

  return (
    <section className="error-page">
      <div className="container">
        <p className="eyebrow">500</p>
        <h1>Our transfer system is temporarily offline.</h1>
        <h2 style={{ color: "var(--primary)" }}>Your funds are safe. Please try again shortly.</h2>
        <p className="muted" style={{ maxWidth: "56ch", marginInline: "auto" }}>
          Any transfer you have already confirmed continues to process normally. If you were
          mid-transfer and need certainty, our support team is one message away.
        </p>

        <div className="row" style={{ justifyContent: "center", marginTop: 26 }}>
          <button type="button" className="btn btn-primary btn-lg" onClick={() => reset()}>
            <RefreshCw size={16} className="icon-anim" />
            Try Again
          </button>
          <a
            className="btn btn-secondary btn-lg"
            href={`https://wa.me/${SITE.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={16} className="icon-anim" />
            WhatsApp support: +{SITE.whatsappNumber}
          </a>
        </div>

        <p className="row" style={{ justifyContent: "center", marginTop: 18, gap: 8 }}>
          <Phone size={15} aria-hidden="true" />
          <strong>{SITE.phoneKe}</strong>
          <span className="muted">Nairobi · {SITE.phoneUk} London</span>
        </p>
      </div>
    </section>
  );
}
