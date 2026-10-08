"use client";

import { useEffect, useRef, useState } from "react";
import { Wordmark } from "@/components/effects/Wordmark";
import { usePrefersReducedMotion } from "@/lib/motion";

/**
 * EFFECT-25 + EFFECT-08 loading screen.
 * Globe SVG preloader whose diaspora→Nairobi routes draw themselves
 * progressively during load, with a progress bar below, a skip control
 * appearing after 3 seconds, and role=status completion announcement.
 * Under reduced motion: static globe + plain percentage text.
 */
export function LoadingScreen({ onDone }: { onDone?: () => void }) {
  const reduced = usePrefersReducedMotion();
  const [progress, setProgress] = useState(0);
  const [hidden, setHidden] = useState(false);
  const [skippable, setSkippable] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const doneRef = useRef(false);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    setProgress(100);
    setAnnouncement("Loading complete.");
    window.setTimeout(() => {
      setHidden(true);
      onDone?.();
    }, 350);
  };

  useEffect(() => {
    // progress simulation that settles on window load
    const start = Date.now();
    const tick = window.setInterval(() => {
      const elapsed = Date.now() - start;
      setProgress(Math.min(92, Math.round((elapsed / 1500) * 92)));
    }, 90);

    const skipTimer = window.setTimeout(() => setSkippable(true), 3000);

    const onLoad = () => {
      window.clearInterval(tick);
      // small beat so the draw animation can complete
      window.setTimeout(finish, reduced ? 150 : 700);
    };

    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad);

    // hard cap so the site is never blocked
    const cap = window.setTimeout(() => {
      window.clearInterval(tick);
      finish();
    }, 6000);

    return () => {
      window.clearInterval(tick);
      window.clearTimeout(skipTimer);
      window.clearTimeout(cap);
      window.removeEventListener("load", onLoad);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  return (
    <div className={`preloader${hidden ? " hide" : ""}`} role="status" aria-live="polite" aria-busy={!hidden}>
      {/* EFFECT-25: globe with connecting lines from diaspora cities to Nairobi */}
      <svg
        className="preloader-globe"
        viewBox="0 0 280 180"
        aria-hidden="true"
        style={{ opacity: reduced ? 0.85 : 1 }}
      >
        <circle cx="140" cy="90" r="62" fill="none" stroke="#dfe4fd" strokeWidth="1.5" />
        <ellipse cx="140" cy="90" rx="62" ry="24" fill="none" stroke="#dfe4fd" strokeWidth="1" />
        <ellipse cx="140" cy="90" rx="24" ry="62" fill="none" stroke="#dfe4fd" strokeWidth="1" />
        <circle cx="140" cy="90" r="4" fill="#355efc" />
        <g fill="none" stroke="#355efc" strokeWidth="2" strokeLinecap="round">
          <path className="route" style={{ ["--len" as string]: "150", animationDelay: "0ms" }} d="M40 44 Q 90 20 138 86" />
          <path className="route" style={{ ["--len" as string]: "140", animationDelay: "120ms" }} d="M28 104 Q 80 118 138 92" />
          <path className="route" style={{ ["--len" as string]: "160", animationDelay: "240ms" }} d="M64 152 Q 110 130 140 96" />
          <path className="route" style={{ ["--len" as string]: "150", animationDelay: "360ms" }} d="M236 40 Q 190 26 144 84" />
          <path className="route" style={{ ["--len" as string]: "150", animationDelay: "480ms" }} d="M252 110 Q 200 122 144 94" />
          <path className="route" style={{ ["--len" as string]: "170", animationDelay: "600ms" }} d="M206 156 Q 172 128 142 98" />
        </g>
        <g fill="#355efc">
          <circle cx="40" cy="44" r="3" />
          <circle cx="28" cy="104" r="3" />
          <circle cx="64" cy="152" r="3" />
          <circle cx="236" cy="40" r="3" />
          <circle cx="252" cy="110" r="3" />
          <circle cx="206" cy="156" r="3" />
        </g>
        <text x="140" y="174" textAnchor="middle" fontSize="10" fontFamily="Jost, sans-serif" fill="#555">
          Nairobi
        </text>
      </svg>

      {/* EFFECT-08: wordmark self-draws, reused in preloader */}
      <Wordmark animated={!reduced} height={38} stroke="#011a41" />

      <div className="preloader-progress" aria-hidden={!reduced}>
        <div className="preloader-progress-bar" style={{ width: `${progress}%` }} />
      </div>

      <div className="preloader-meta">
        {reduced ? (
          <span>Loading — {progress}% complete</span>
        ) : (
          <span>Loading — {progress}%</span>
        )}
        <button
          type="button"
          className={`preloader-skip${skippable ? " ready" : ""}`}
          onClick={finish}
          tabIndex={skippable ? 0 : -1}
          aria-hidden={!skippable}
        >
          Skip
        </button>
      </div>

      <span className="sr-only">{announcement}</span>
    </div>
  );
}
