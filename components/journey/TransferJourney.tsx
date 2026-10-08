"use client";

import { useEffect, useRef, useState } from "react";
import { Smartphone, FileText, Landmark, BellRing } from "lucide-react";
import { JOURNEY_BEATS } from "@/lib/data";
import { usePrefersReducedMotion } from "@/lib/motion";

const BEAT_ICONS = [Smartphone, FileText, Landmark, BellRing];

/**
 * EFFECT-02 — pinned scrollytelling transfer journey, 4 beats.
 * IntersectionObserver drives active beat; the page never hijacks wheel
 * speed. Reduced motion renders a flat stacked article list.
 */
export function TransferJourney() {
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(0);
  const beatRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    if (reduced) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = Number((entry.target as HTMLElement).dataset.index ?? 0);
            setActive(index);
          }
        }
      },
      { threshold: 0.55, rootMargin: "-10% 0px -25% 0px" },
    );
    beatRefs.current.forEach((node) => node && observer.observe(node));
    return () => observer.disconnect();
  }, [reduced]);

  const ActiveIcon = BEAT_ICONS[active] ?? Smartphone;

  return (
    <section className="journey" aria-labelledby="journey-heading">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow" style={{ color: "#9db4ff", borderColor: "rgba(255,255,255,0.2)" }}>
            The transfer journey
          </span>
          <h2 id="journey-heading" style={{ color: "#fff" }}>
            From London to Nairobi in four beats
          </h2>
        </div>

        <div className="journey-track">
          {/* Pinned visual column (desktop) */}
          <div className="journey-sticky">
            <div className="journey-visual" aria-hidden="true">
              <div style={{ textAlign: "center", color: "#fff" }}>
                <ActiveIcon size={92} strokeWidth={1.2} />
                <p style={{ marginTop: 18, fontFamily: "var(--font-display)", letterSpacing: "0.08em" }}>
                  BEAT {active + 1} / 4
                </p>
              </div>
            </div>

            {/* Beats — scrolling column */}
            <div className="journey-beats">
              {JOURNEY_BEATS.map((beat, i) => {
                const Icon = BEAT_ICONS[i] ?? Smartphone;
                return (
                  <article
                    key={beat.title}
                    data-index={i}
                    ref={(node) => {
                      beatRefs.current[i] = node;
                    }}
                    className={`journey-beat${!reduced && i === active ? " active" : ""}`}
                  >
                    <div className="row" style={{ gap: 12 }}>
                      <Icon size={22} aria-hidden="true" />
                      <h3>{beat.title}</h3>
                    </div>
                    <p style={{ color: "rgba(255,255,255,0.82)", maxWidth: "56ch" }}>{beat.body}</p>
                  </article>
                );
              })}
            </div>
          </div>

          {/* Flat stacked article fallback under reduced motion */}
          {reduced ? (
            <div className="journey-flat">
              {JOURNEY_BEATS.map((beat) => (
                <article key={`flat-${beat.title}`} style={{ marginBottom: 28 }}>
                  <h3 style={{ color: "#fff" }}>{beat.title}</h3>
                  <p style={{ color: "rgba(255,255,255,0.82)" }}>{beat.body}</p>
                </article>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
