"use client";

import Link from "next/link";
import { Send, Calculator, ShieldCheck } from "lucide-react";
import { StaggerText } from "@/components/effects/Reveal";
import { HeroGlobe } from "./HeroGlobe";
import { useRates } from "@/components/providers/AppProviders";
import { usePrefersReducedMotion, useDocumentVisible } from "@/lib/motion";
import { CURRENCY_BY_CODE, formatKES } from "@/lib/design";

const PARTICLE_SYMBOLS = ["£", "$", "€", "د.إ", "CA$", "KSh"];

/**
 * Hero — EFFECT-01 (globe), 04 (letter stagger + "Home" glitch),
 * 06 (currency particles), 18 (gradient backdrop), 23 (sequenced entrance).
 */
export function Hero() {
  const { currency, rates, secondsAgo } = useRates();
  const reduced = usePrefersReducedMotion();
  const visible = useDocumentVisible();

  const rateValue = rates?.rates?.[currency];
  const tickerText = rateValue
    ? `1 ${currency} equals KES ${rateValue.toFixed(2)} today.`
    : `1 ${currency} equals KES ${CURRENCY_BY_CODE[currency].code === "GBP" ? "172.40" : "—"} today.`;

  return (
    <section className="hero" aria-label="Send money home with confidence">
      {/* EFFECT-18: animated gradient backdrop (background-position only) */}
      <div className="hero-gradient" aria-hidden="true" />

      {/* EFFECT-06: ambient floating currency symbols */}
      <div
        className="currency-particles"
        aria-hidden="true"
        style={{
          animationPlayState: visible && !reduced ? "running" : "paused",
        }}
      >
        {PARTICLE_SYMBOLS.map((symbol, i) => (
          <span
            key={`${symbol}-${i}`}
            style={{
              left: `${8 + i * 15}%`,
              top: `${20 + ((i * 37) % 55)}%`,
              fontSize: `${18 + ((i * 7) % 22)}px`,
              animationDelay: `${i * -1.8}s`,
              animationDuration: `${10 + (i % 4) * 2.2}s`,
              animationPlayState: visible && !reduced ? "running" : "paused",
            }}
          >
            {symbol}
          </span>
        ))}
      </div>

      <div className="container hero-inner">
        <div className="hero-copy">
          {/* EFFECT-23: sequenced entrance < 1.6s total; CTA focusable immediately */}
          <div className="hero-entrance">
            <span className="hero-badge">
              <ShieldCheck size={14} aria-hidden="true" />
              Licensed remittance &amp; investment partner
            </span>
          </div>

          <h1 className="hero-title hero-entrance delay-1">
            <StaggerText text="Send Money Home with Confidence." keyword="Home" />
          </h1>

          <p className="hero-sub hero-entrance delay-2">
            Fast, secure, and trusted transfers from the UK, USA, UAE, and Canada to Kenya.
            Invest while you are away.
          </p>

          <div className="hero-ctas hero-entrance delay-3">
            <Link href="/send" className="btn btn-primary btn-lg">
              <Send size={16} className="icon-anim" />
              Send Money Now
            </Link>
            <Link href="/#calculator" className="btn btn-light btn-lg">
              <Calculator size={16} className="icon-anim" />
              Calculate My Transfer
            </Link>
          </div>

          <div className="hero-ticker hero-entrance delay-4" role="status" aria-live="polite">
            <span className="ticker-dot" aria-hidden="true" />
            <span>{tickerText}</span>
            <span style={{ opacity: 0.75 }}>
              {secondsAgo <= 1 ? "Live now" : `Updated ${secondsAgo}s ago`}
            </span>
          </div>
        </div>

        <div className="hero-visual">
          <HeroGlobe />
          <p className="meta" style={{ color: "rgba(255,255,255,0.8)", marginTop: 10, textAlign: "center" }}>
            Drag the globe or use arrow keys to explore transfer routes
          </p>
        </div>
      </div>
    </section>
  );
}

export function RateTickerInline() {
  const { rates, currency } = useRates();
  const rate = rates?.rates?.[currency];
  return (
    <span>
      {rate ? `1 ${currency} = KES ${rate.toFixed(2)}` : "Loading live rate…"}
      {rate ? ` (${formatKES(rate * 100)} per ${currency} 100)` : ""}
    </span>
  );
}
