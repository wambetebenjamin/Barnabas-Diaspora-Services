"use client";

import { useEffect, useRef, useState } from "react";

/**
 * EFFECT-08 — "BARNABAS" wordmark that self-draws.
 * Path lengths are measured at runtime (getTotalLength) and the strokes are
 * drawn once. Reused in the preloader and the services gallery card 2.
 */
export function Wordmark({
  className = "",
  animated = true,
  stroke = "#355efc",
  strokeWidth = 3,
  height = 44,
  onDrawn,
}: {
  className?: string;
  animated?: boolean;
  stroke?: string;
  strokeWidth?: number;
  height?: number;
  onDrawn?: () => void;
}) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [ready, setReady] = useState(!animated);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const paths = Array.from(svg.querySelectorAll<SVGPathElement>(".wm-stroke"));
    for (const path of paths) {
      const len = path.getTotalLength();
      path.style.setProperty("--len", String(len));
      path.style.strokeDasharray = String(len);
      path.style.strokeDashoffset = animated ? String(len) : "0";
    }
    if (!animated) {
      setReady(true);
      onDrawn?.();
      return;
    }
    // Draw once — force reflow then release the dashoffset (CSS animates).
    void svg.getBoundingClientRect();
    const id = window.setTimeout(() => {
      setReady(true);
      onDrawn?.();
    }, 1200);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animated]);

  return (
    <svg
      ref={svgRef}
      className={className}
      width={height * 4.58}
      height={height}
      viewBox="0 0 220 48"
      role="img"
      aria-label="Barnabas"
      data-drawn={ready ? "true" : "false"}
    >
      <g
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* B */}
        <path className="wm-stroke" d="M4 6 V42" />
        <path className="wm-stroke" d="M4 6 H14 Q22 6 22 14 Q22 22 14 22 H4" />
        <path className="wm-stroke" d="M4 22 H16 Q24 22 24 32 Q24 42 14 42 H4" />
        {/* A */}
        <path className="wm-stroke" d="M28 42 L38 6 L48 42" />
        <path className="wm-stroke" d="M32 28 H44" />
        {/* R */}
        <path className="wm-stroke" d="M54 42 V6 H64 Q72 6 72 16 Q72 24 64 24 H54" />
        <path className="wm-stroke" d="M62 24 L74 42" />
        {/* N */}
        <path className="wm-stroke" d="M80 42 V6 L98 42 V6" />
        {/* A */}
        <path className="wm-stroke" d="M106 42 L116 6 L126 42" />
        <path className="wm-stroke" d="M110 28 H122" />
        {/* B */}
        <path className="wm-stroke" d="M132 6 V42" />
        <path className="wm-stroke" d="M132 6 H142 Q150 6 150 14 Q150 22 142 22 H132" />
        <path className="wm-stroke" d="M132 22 H144 Q152 22 152 32 Q152 42 142 42 H132" />
        {/* A */}
        <path className="wm-stroke" d="M158 42 L168 6 L178 42" />
        <path className="wm-stroke" d="M162 28 H174" />
        {/* S */}
        <path
          className="wm-stroke"
          d="M204 12 Q204 6 196 6 H188 Q180 6 180 14 Q180 21 188 22 H194 Q204 23 204 32 Q204 42 194 42 H186 Q176 42 176 36"
        />
      </g>
      <style>{`
        .wm-stroke { transition: stroke-dashoffset 1.1s cubic-bezier(0.65, 0, 0.35, 1); }
        [data-drawn="true"] .wm-stroke { stroke-dashoffset: 0 !important; }
        @media (prefers-reduced-motion: reduce) {
          .wm-stroke { transition: none !important; stroke-dashoffset: 0 !important; }
        }
      `}</style>
    </svg>
  );
}
