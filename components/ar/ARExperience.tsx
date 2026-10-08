"use client";

import { useEffect, useRef, useState } from "react";
import { Play, X, Globe, Send } from "lucide-react";
import { usePrefersReducedMotion } from "@/lib/motion";

/**
 * EFFECT-03 — AR experience demo bay.
 * "See Your Money Reach Home in AR." Opt-in Enter AR button (WebXR on
 * consent, no autoplay). Fallback: draggable 360° map of the transfer route
 * from sender country to Kenya. Persistent Exit control always focusable.
 */
export function ARExperience() {
  const reduced = usePrefersReducedMotion();
  const [mode, setMode] = useState<"idle" | "xr" | "map">("idle");
  const [xrSupported, setXrSupported] = useState(false);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef({ active: false, startX: 0, offset: 0 });

  useEffect(() => {
    const nav = navigator as Navigator & { xr?: { isSessionSupported?: (m: string) => Promise<boolean> } };
    nav.xr
      ?.isSessionSupported?.("immersive-ar")
      .then((ok) => setXrSupported(Boolean(ok)))
      .catch(() => setXrSupported(false));
  }, []);

  const enterAR = async () => {
    if (xrSupported) {
      try {
        const nav = navigator as Navigator & {
          xr?: { requestSession?: (m: string, o?: unknown) => Promise<{ end: () => Promise<void> }> };
        };
        const session = await nav.xr?.requestSession?.("immersive-ar", {
          optionalFeatures: ["local-floor"],
        });
        if (session) {
          setMode("xr");
          await session.end();
          setMode("idle");
          return;
        }
      } catch {
        /* fall back to the 360 map */
      }
    }
    setMode("map");
  };

  const exit = () => setMode("idle");

  // drag-to-pan 360 map
  const onPointerDown = (e: React.PointerEvent) => {
    dragRef.current = { active: true, startX: e.clientX, offset: dragRef.current.offset };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.active || !mapRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const offset = Math.max(-220, Math.min(220, dragRef.current.offset + dx));
    mapRef.current.style.transform = `translateX(${offset}px)`;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (mapRef.current) {
      const matrix = new DOMMatrixReadOnly(getComputedStyle(mapRef.current).transform);
      dragRef.current.offset = matrix.m41;
    }
    dragRef.current.active = false;
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  return (
    <section className="section" id="ar" aria-labelledby="ar-heading">
      <div className="container">
        <div className="ar-bay">
          <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ maxWidth: 640 }}>
              <span className="eyebrow" style={{ color: "#9db4ff", borderColor: "rgba(255,255,255,0.25)" }}>
                AR demo bay
              </span>
              <h2 id="ar-heading" style={{ color: "#fff" }}>
                See Your Money Reach Home in AR.
              </h2>
              <p style={{ color: "rgba(255,255,255,0.85)" }}>
                Point your phone at the floor and watch the transfer route travel from your city to
                Nairobi. Nothing starts without your consent — tap Enter AR when you are ready.
              </p>
              <div className="row" style={{ marginTop: 18 }}>
                <button type="button" className="btn btn-primary" onClick={enterAR}>
                  <Play size={16} className="icon-anim" />
                  Enter AR
                </button>
                <span className="meta" style={{ color: "rgba(255,255,255,0.7)" }}>
                  {xrSupported
                    ? "WebXR available on this device"
                    : "WebXR unavailable — a draggable 360° map will open instead"}
                </span>
              </div>
            </div>

            {/* Persistent Exit control — always focusable */}
            {mode !== "idle" ? (
              <button type="button" className="btn btn-light ar-exit" onClick={exit} autoFocus>
                <X size={16} />
                Exit
              </button>
            ) : null}
          </div>

          {mode === "map" ? (
            <div
              className="ar-map"
              style={{ marginTop: 28 }}
              role="application"
              aria-label="Draggable 360-degree map of the transfer route to Kenya. Drag or use arrow keys to pan."
              tabIndex={0}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onKeyDown={(e) => {
                const step = e.shiftKey ? 40 : 16;
                if (e.key === "ArrowLeft") {
                  dragRef.current.offset = Math.max(-220, dragRef.current.offset - step);
                } else if (e.key === "ArrowRight") {
                  dragRef.current.offset = Math.min(220, dragRef.current.offset + step);
                } else return;
                if (mapRef.current) mapRef.current.style.transform = `translateX(${dragRef.current.offset}px)`;
                e.preventDefault();
              }}
            >
              <div className="ar-map-inner" ref={mapRef}>
                <svg width="100%" height="100%" viewBox="0 0 900 340" preserveAspectRatio="xMidYMid slice">
                  <rect width="900" height="340" fill="#0a2050" />
                  {/* stylised world bands */}
                  <g stroke="#2749c9" strokeWidth="1" opacity="0.6">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <line key={i} x1="0" y1={i * 40} x2="900" y2={i * 40} />
                    ))}
                    {Array.from({ length: 18 }).map((_, i) => (
                      <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="340" />
                    ))}
                  </g>
                  <path
                    d="M80 120 C 220 40 380 60 520 140 C 600 186 660 220 760 240"
                    fill="none"
                    stroke="#ffd27d"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                  <circle cx="80" cy="120" r="12" fill="#7c9bff" />
                  <text x="80" y="96" textAnchor="middle" fill="#dfe4fd" fontSize="16" fontFamily="Jost, sans-serif">
                    London
                  </text>
                  <circle cx="760" cy="240" r="16" fill="#6ee7a8" />
                  <text x="760" y="284" textAnchor="middle" fill="#dfe4fd" fontSize="18" fontFamily="Jost, sans-serif">
                    Nairobi
                  </text>
                  <g transform="translate(430 84)">
                    <rect x="-70" y="-26" width="140" height="52" rx="10" fill="rgba(255,255,255,0.12)" stroke="#7c9bff" />
                    <text x="0" y="6" textAnchor="middle" fill="#fff" fontSize="17" fontFamily="Jost, sans-serif">
                      £1,000 → KES 172,400
                    </text>
                  </g>
                </svg>
              </div>
            </div>
          ) : null}

          {mode === "xr" ? (
            <p style={{ color: "#fff", marginTop: 18 }} role="status">
              <Globe size={16} aria-hidden="true" /> AR session running — point your device at a flat
              surface.
            </p>
          ) : null}

          {mode === "idle" && !reduced ? (
            <div className="row" style={{ marginTop: 26, color: "rgba(255,255,255,0.75)" }}>
              <Send size={16} aria-hidden="true" />
              <span className="meta" style={{ color: "rgba(255,255,255,0.75)" }}>
                Typical route: sender country → London clearing → Nairobi payout
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
