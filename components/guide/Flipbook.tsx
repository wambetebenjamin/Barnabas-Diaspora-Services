"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, BookOpen, BookMarked } from "lucide-react";
import { GUIDE_PAGES } from "@/lib/data";
import { usePrefersReducedMotion } from "@/lib/motion";

/**
 * EFFECT-30 — flipbook remittance guide.
 * "Your Complete Guide to Sending Money to Kenya." 3D page-flip CSS
 * transforms, keyboard navigation, page number announced via live region,
 * text reading-mode toggle.
 */
export function Flipbook() {
  const reduced = usePrefersReducedMotion();
  const [page, setPage] = useState(0);
  const [readingMode, setReadingMode] = useState(false);

  const go = (delta: number) => {
    setPage((current) => Math.min(GUIDE_PAGES.length - 1, Math.max(0, current + delta)));
  };

  return (
    <section className="section" id="guide" aria-labelledby="guide-heading">
      <div className="container">
        <div className="section-head row" style={{ justifyContent: "space-between" }}>
          <div>
            <span className="eyebrow">Remittance guide</span>
            <h2 id="guide-heading">Your Complete Guide to Sending Money to Kenya</h2>
          </div>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => setReadingMode((r) => !r)}
            aria-pressed={readingMode}
          >
            {readingMode ? <BookOpen size={16} /> : <BookMarked size={16} />}
            {readingMode ? "Flipbook mode" : "Text reading mode"}
          </button>
        </div>

        {/* Keyboard navigation + announced page number */}
        <div
          className="flipbook"
          role="group"
          aria-label="Remittance guide flipbook"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight" || e.key === "PageDown") {
              go(1);
              e.preventDefault();
            }
            if (e.key === "ArrowLeft" || e.key === "PageUp") {
              go(-1);
              e.preventDefault();
            }
          }}
        >
          <div className="flip-stage" aria-hidden={readingMode}>
            {GUIDE_PAGES.map((p, i) => (
              <article
                key={p.title}
                className={`flip-page${i <= page ? "" : " flipped"}`}
                style={{
                  zIndex: GUIDE_PAGES.length - i,
                  visibility: readingMode ? "hidden" : "visible",
                }}
              >
                <p className="meta">Page {i + 1} of {GUIDE_PAGES.length}</p>
                <h3>{p.title}</h3>
                <p style={{ fontSize: 14 }}>{p.body}</p>
              </article>
            ))}
          </div>

          {/* Flat reading mode */}
          <div className={`flip-reading${readingMode ? " open" : ""}`}>
            {GUIDE_PAGES.map((p, i) => (
              <article key={`read-${p.title}`} style={{ marginBottom: 26 }}>
                <p className="meta">Page {i + 1}</p>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="flip-controls" style={{ justifyContent: "center", marginTop: 22 }}>
          <button type="button" className="btn btn-light" onClick={() => go(-1)} disabled={page === 0}>
            <ChevronLeft size={18} />
            Previous
          </button>
          <span role="status" aria-live="polite" className="meta" style={{ minWidth: 140, textAlign: "center" }}>
            Page {page + 1} of {GUIDE_PAGES.length}
          </span>
          <button
            type="button"
            className="btn btn-light"
            onClick={() => go(1)}
            disabled={page === GUIDE_PAGES.length - 1}
          >
            Next
            <ChevronRight size={18} />
          </button>
        </div>

        {reduced ? (
          <p className="meta" style={{ textAlign: "center", marginTop: 10 }}>
            Page flipping is disabled by your reduced-motion preference — use the reading mode above
            or the previous/next buttons.
          </p>
        ) : null}
      </div>
    </section>
  );
}
