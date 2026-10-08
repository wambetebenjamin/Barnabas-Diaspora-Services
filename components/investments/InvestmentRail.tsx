"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { TrendingUp, Landmark, Building, Users, ShieldCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { INVESTMENTS, type Investment } from "@/lib/data";
import { formatKES } from "@/lib/design";
import { useCanHover, usePrefersReducedMotion } from "@/lib/motion";

const CATEGORY_ICONS = [Landmark, TrendingUp, Building, Users, ShieldCheck, TrendingUp];

function riskClass(risk: Investment["risk"]): string {
  return risk === "Low" ? "risk-low" : risk === "Medium" ? "risk-medium" : "risk-high";
}

/**
 * EFFECT-15 — horizontal scroll-snap rail of investment product categories,
 * labelled "Investment categories, 6 items", keyboard navigable, plain grid
 * under reduced motion. EFFECT-26 — hover/focus reveals expected returns and
 * minimum investment (gated behind hover:hover, works on focus-visible and
 * tap toggle on touch).
 */
export function InvestmentRail() {
  const railRef = useRef<HTMLDivElement | null>(null);
  const canHover = useCanHover();
  const reduced = usePrefersReducedMotion();
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  const scrollBy = (delta: number) => {
    railRef.current?.scrollBy({ left: delta, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <section className="section" id="investments" aria-labelledby="invest-heading">
      <div className="container">
        <div className="section-head row" style={{ justifyContent: "space-between" }}>
          <div>
            <span className="eyebrow">Investment categories, 6 items</span>
            <h2 id="invest-heading">Invest while you are away</h2>
            <p className="muted">
              Vetted Kenyan investment products with transparent returns, risk levels and minimums.
            </p>
          </div>
          <div className="row">
            <button type="button" className="btn btn-light" onClick={() => scrollBy(-360)} aria-label="Scroll investments left">
              <ChevronLeft size={18} />
            </button>
            <button type="button" className="btn btn-light" onClick={() => scrollBy(360)} aria-label="Scroll investments right">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div
          className="rail"
          ref={railRef}
          role="group"
          aria-label="Investment categories, 6 items"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") {
              scrollBy(340);
              e.preventDefault();
            }
            if (e.key === "ArrowLeft") {
              scrollBy(-340);
              e.preventDefault();
            }
          }}
        >
          {INVESTMENTS.map((item, i) => {
            const Icon = CATEGORY_ICONS[i] ?? TrendingUp;
            const open = openSlug === item.slug;
            return (
              <div className="rail-item" key={item.slug}>
                <article
                  className={`invest-card${open ? " open" : ""}`}
                  tabIndex={0}
                  onClick={() => {
                    if (!canHover) setOpenSlug(open ? null : item.slug);
                  }}
                >
                  <div className="invest-icon" aria-hidden="true">
                    <Icon size={24} />
                  </div>
                  <h3>{item.name}</h3>
                  <p className="muted" style={{ fontSize: 13 }}>{item.blurb}</p>
                  <span className={`risk ${riskClass(item.risk)}`}>
                    {item.risk} risk
                  </span>

                  {/* EFFECT-26 hover/focus reveal */}
                  <div className="invest-reveal">
                    <dl>
                      <dt>Expected return</dt>
                      <dd>{item.expectedReturn}</dd>
                      <dt>Minimum investment</dt>
                      <dd>{formatKES(item.minInvestmentKES)}</dd>
                    </dl>
                  </div>

                  <div style={{ marginTop: "auto" }}>
                    <Link
                      href={`/invest?product=${item.slug}`}
                      className="btn btn-primary"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Invest Now
                    </Link>
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
