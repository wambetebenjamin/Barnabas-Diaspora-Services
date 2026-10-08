"use client";

import { useEffect, useRef, useState } from "react";
import { Wordmark } from "@/components/effects/Wordmark";
import { useCanHover, usePrefersReducedMotion, useDocumentVisible } from "@/lib/motion";

/* ============================================================
   Shared pieces
   ============================================================ */

/** EFFECT-17 — liquid blob with a bounded SVG filter (never applied to text). */
export function LiquidBlobFilterDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" style={{ position: "absolute" }}>
      <defs>
        <filter id="liquid-blob-filter" x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.016" numOctaves="2" seed="7" result="noise">
            <animate
              attributeName="baseFrequency"
              dur="12s"
              values="0.012 0.016;0.018 0.011;0.012 0.016"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="26" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  );
}

function useInView<T extends HTMLElement>(threshold = 0.25) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) setInView(entry.isIntersecting);
      },
      { threshold },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/* ============================================================
   Card 1 — EFFECT-07: looping globe line-art network
   ============================================================ */
function NetworkGlobeCard() {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div className="gallery-media network-globe" ref={ref} aria-hidden={undefined}>
      <svg
        width="120"
        height="110"
        viewBox="0 0 120 110"
        role="img"
        aria-label="Global remittance network animation"
      >
        <circle cx="60" cy="55" r="38" fill="none" stroke="#355efc" strokeWidth="1.6" opacity="0.7" />
        <ellipse cx="60" cy="55" rx="38" ry="15" fill="none" stroke="#355efc" strokeWidth="1" opacity="0.5" />
        <ellipse cx="60" cy="55" rx="15" ry="38" fill="none" stroke="#355efc" strokeWidth="1" opacity="0.5" />
        <g
          fill="none"
          stroke="#355efc"
          strokeWidth="2"
          strokeLinecap="round"
          className="arcs"
          style={{ animationPlayState: inView ? "running" : "paused" }}
        >
          <path className="arc" d="M12 34 Q 40 10 58 52" />
          <path className="arc" d="M8 78 Q 36 88 58 60" />
          <path className="arc" d="M110 30 Q 82 12 64 50" />
          <path className="arc" d="M114 84 Q 86 92 64 62" />
        </g>
        <circle cx="60" cy="55" r="4.5" fill="#355efc" />
        <style>{`.network-globe .arcs .arc { animation-play-state: inherit; }`}</style>
      </svg>
    </div>
  );
}

/* ============================================================
   Card 3 — EFFECT-09: morphing currency symbols (matched points)
   ============================================================ */

/** Each symbol = two paths, each with exactly three cubic segments (matched points). */
const SYMBOLS: [string, string][] = [
  // £
  [
    "M22 54 C22 42 21 30 22 20 C23 12 28 8 36 8 C41 8 45 10 45 10 C45 10 45 10 45 10",
    "M12 32 C18 31 26 30 32 30 C36 30 42 31 46 31 C48 31 50 31 50 31 C50 31 50 31 50 31",
  ],
  // $
  [
    "M38 12 C38 8 22 7 22 15 C22 22 40 23 40 32 C40 40 24 40 24 46 C24 50 34 52 39 47",
    "M30 3 C30 12 30 22 30 32 C30 42 30 50 30 56 C30 56 30 56 30 56 C30 56 30 56 30 56",
  ],
  // KES / KSh mark
  [
    "M16 6 C16 18 16 32 16 44 C16 48 16 52 16 54 C16 54 16 54 16 54",
    "M48 8 C42 18 34 28 26 38 C22 44 18 50 16 54 C30 42 42 30 52 18",
  ],
];

function interpolatePath(a: string, b: string, t: number): string {
  const numsA = a.match(/-?\d+(\.\d+)?/g)?.map(Number) ?? [];
  const numsB = b.match(/-?\d+(\.\d+)?/g)?.map(Number) ?? [];
  if (numsA.length !== numsB.length) return t < 0.5 ? a : b;
  let i = 0;
  return a.replace(/-?\d+(\.\d+)?/g, () => {
    const v = numsA[i] + (numsB[i] - numsA[i]) * t;
    i += 1;
    return v.toFixed(2);
  });
}

function MorphCurrencyCard() {
  const reduced = usePrefersReducedMotion();
  const canHover = useCanHover();
  const [index, setIndex] = useState(0);
  const [morph, setMorph] = useState(1); // 1 = fully current symbol
  const [engaged, setEngaged] = useState(false);
  const rafRef = useRef<number>(0);

  // cycle while engaged (hover or focus); reversible on mouse-out (returns home)
  useEffect(() => {
    if (reduced) return;
    let from = index;
    let start = 0;

    const step = (ts: number) => {
      if (!start) start = ts;
      const t = Math.min(1, (ts - start) / 420);
      setMorph(t);
      if (t < 1) rafRef.current = requestAnimationFrame(step);
    };

    if (engaged) {
      const id = window.setInterval(() => {
        from = (from + 1) % SYMBOLS.length;
        setIndex(from);
        start = 0;
        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(step);
      }, 900);
      return () => window.clearInterval(id);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [engaged, reduced, index]);

  const prev = SYMBOLS[index];
  const next = SYMBOLS[(index + 1) % SYMBOLS.length];
  const [p1, p2] = prev;
  const [n1, n2] = next;
  const d1 = reduced ? p1 : interpolatePath(p1, n1, morph);
  const d2 = reduced ? p2 : interpolatePath(p2, n2, morph);

  return (
    <div
      className="gallery-media"
      onMouseEnter={() => canHover && setEngaged(true)}
      onMouseLeave={() => {
        setEngaged(false);
        setMorph(1);
      }}
      onFocus={() => setEngaged(true)}
      onBlur={() => setEngaged(false)}
      tabIndex={0}
      aria-label="Cycling currency symbols: pound, dollar, Kenyan shilling"
      role="img"
    >
      <svg width="90" height="90" viewBox="0 0 60 60">
        <g fill="none" stroke="#355efc" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
          <path d={d1} style={reduced ? { opacity: 1, transition: "opacity 200ms linear" } : undefined} />
          <path d={d2} style={reduced ? { opacity: 1, transition: "opacity 200ms linear" } : undefined} />
        </g>
      </svg>
    </div>
  );
}

/* ============================================================
   Card 4 — EFFECT-13: family mascot receiving a transfer, waving
   ============================================================ */
export function FamilyMascot({
  waving = false,
  size = 120,
  hideLabel = true,
}: {
  waving?: boolean;
  size?: number;
  hideLabel?: boolean;
}) {
  return (
    <svg
      className={`mascot${waving ? " wave" : ""}`}
      width={size}
      height={size}
      viewBox="0 0 110 110"
      aria-hidden={hideLabel ? "true" : undefined}
      role={hideLabel ? undefined : "img"}
    >
      {/* ground */}
      <ellipse cx="55" cy="100" rx="34" ry="6" fill="#dfe4fd" />
      {/* body */}
      <rect x="36" y="52" width="38" height="40" rx="12" fill="#355efc" />
      {/* head */}
      <circle cx="55" cy="36" r="16" fill="#8d5a3b" />
      <path d="M42 30 q6 -12 20 -6 q6 3 6 8 q-8 -6 -18 -2 q-6 2 -8 0z" fill="#2c1a12" />
      {/* eyes + smile */}
      <circle cx="50" cy="36" r="1.8" fill="#2c1a12" />
      <circle cx="61" cy="36" r="1.8" fill="#2c1a12" />
      <path d="M50 43 q5 4 10 0" stroke="#2c1a12" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      {/* phone with received transfer */}
      <rect x="66" y="58" width="16" height="26" rx="3" fill="#011a41" />
      <rect x="68.5" y="62" width="11" height="15" rx="1.5" fill="#6ee7a8" />
      {/* waving arm */}
      <g className="arm">
        <path d="M40 60 q-12 -6 -14 -18" stroke="#8d5a3b" strokeWidth="7" fill="none" strokeLinecap="round" />
        <circle cx="25" cy="41" r="5" fill="#8d5a3b" />
      </g>
      {/* standing arm */}
      <path d="M70 62 q8 6 6 18" stroke="#8d5a3b" strokeWidth="7" fill="none" strokeLinecap="round" />
      {/* legs */}
      <path d="M45 90 v8 M65 90 v8" stroke="#011a41" strokeWidth="7" strokeLinecap="round" />
    </svg>
  );
}

/* ============================================================
   Card 5 — EFFECT-14: faux-3D phone transfer confirmation
   ============================================================ */
function Phone3DCard() {
  const canHover = useCanHover();
  const [tilt, setTilt] = useState(false);
  return (
    <div
      className="gallery-media"
      onMouseEnter={() => canHover && setTilt(true)}
      onMouseLeave={() => setTilt(false)}
      onFocus={() => setTilt(true)}
      onBlur={() => setTilt(false)}
      tabIndex={0}
      role="img"
      aria-label="Phone showing a transfer confirmation screen"
    >
      <div className={`phone3d${tilt ? " tilt" : ""}`}>
        <div className="screen">
          <strong style={{ fontSize: 11 }}>Transfer confirmed</strong>
          <div style={{ marginTop: 6, color: "#127c4c", fontWeight: 700 }}>KES 172,400</div>
          <div style={{ marginTop: 4 }}>to Mary W.</div>
          <div style={{ marginTop: 10, fontSize: 9, color: "#555" }}>M-Pesa · minutes</div>
        </div>
        <div className="layer2" />
      </div>
    </div>
  );
}

/* ============================================================
   Card 6 — EFFECT-16: mixed-media collage (Nairobi cut-out + vector)
   ============================================================ */
function CollageCard() {
  return (
    <div className="gallery-media" style={{ padding: 0 }}>
      <div className="collage" style={{ width: "100%", height: "100%" }} role="img" aria-label="Collage of Nairobi and diaspora skylines">
        {/* diaspora city skyline vector */}
        <svg className="skyline-vector" viewBox="0 0 120 60" aria-hidden="true">
          <g fill="#355efc" opacity="0.75">
            <rect x="4" y="22" width="14" height="38" />
            <rect x="22" y="10" width="12" height="50" />
            <rect x="38" y="28" width="16" height="32" />
            <rect x="58" y="16" width="10" height="44" />
            <rect x="72" y="30" width="18" height="30" />
            <rect x="94" y="20" width="12" height="40" />
          </g>
        </svg>
        {/* Nairobi skyline cut-out */}
        <svg className="skyline-cutout" viewBox="0 0 140 70" aria-hidden="true">
          <path
            d="M0 70 V44 h14 v-12 h10 v12 h12 V22 h14 v22 h10 V34 h12 v10 h8 V18 h12 v26 h10 v-14 h12 v14 h12 v22 z"
            fill="#011a41"
          />
          <circle cx="112" cy="12" r="7" fill="#e93c05" opacity="0.85" />
        </svg>
        <div className="grain" aria-hidden="true" />
      </div>
    </div>
  );
}

/* ============================================================
   Card 7 — EFFECT-17: liquid blob on hover
   ============================================================ */
function BlobCard() {
  return (
    <div className="gallery-media" tabIndex={0} role="img" aria-label="Liquid blob shape">
      <div className="blob-host">
        <svg width="100%" height="100%" viewBox="0 0 200 132" preserveAspectRatio="xMidYMid slice">
          <path
            className="blob-shape"
            filter="url(#liquid-blob-filter)"
            d="M40 24 C80 8 130 12 158 38 C182 60 176 98 142 112 C104 128 56 120 34 92 C14 68 12 38 40 24 Z"
          />
        </svg>
      </div>
    </div>
  );
}

/* ============================================================
   Card 8 — EFFECT-19: isometric home assembling on scroll
   ============================================================ */
function IsometricHomeCard() {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  return (
    <div className="gallery-media" ref={ref}>
      <svg
        className={`iso-scene${inView ? " assembled" : ""}`}
        width="150"
        height="110"
        viewBox="0 0 150 110"
        role="img"
        aria-label="Isometric scene of a Kenyan home being built with remittance funds"
      >
        {/* 120-degree isometric axes */}
        <g className="iso-piece">
          <path d="M20 78 L75 48 L130 78 L75 108 Z" fill="#dfe4fd" stroke="#355efc" strokeWidth="1.5" />
        </g>
        <g className="iso-piece">
          <path d="M42 74 L75 56 L108 74 L75 92 Z" fill="#ffffff" stroke="#355efc" strokeWidth="1.5" />
        </g>
        <g className="iso-piece">
          <path d="M42 74 L42 46 L75 28 L75 56 Z" fill="#7c9bff" stroke="#355efc" strokeWidth="1.5" />
          <path d="M108 74 L108 46 L75 28 L75 56 Z" fill="#4f7dff" stroke="#355efc" strokeWidth="1.5" />
        </g>
        <g className="iso-piece">
          <path d="M42 46 L75 14 L108 46 L75 62 Z" fill="#e93c05" stroke="#011a41" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

/* ============================================================
   Card 9 — EFFECT-21: hand-drawn doodle arrows toward Kenya
   ============================================================ */
function DoodleArrowsCard() {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  return (
    <div className="gallery-media" ref={ref}>
      <svg
        className={`doodle${inView ? " drawn" : ""}`}
        width="150"
        height="110"
        viewBox="0 0 150 110"
        role="img"
        aria-label="Hand-drawn arrows flying from different countries toward Kenya"
      >
        <g fill="none" stroke="#355efc" strokeWidth="2.2" strokeLinecap="round">
          <path className="arrow" style={{ ["--len" as string]: "120" }} d="M8 18 C 40 16 70 34 92 52" />
          <path className="arrow" style={{ ["--len" as string]: "120" }} d="M10 52 C 38 52 66 56 90 60" />
          <path className="arrow" style={{ ["--len" as string]: "120" }} d="M16 92 C 40 88 66 76 90 66" />
          <path className="arrow" style={{ ["--len" as string]: "120" }} d="M140 12 C 122 26 108 42 96 54" />
        </g>
        <circle cx="98" cy="58" r="10" fill="#e93c05" />
        <text x="98" y="62" textAnchor="middle" fontSize="9" fill="#fff" fontFamily="Jost, sans-serif">KE</text>
      </svg>
    </div>
  );
}

/* ============================================================
   Card 10 — EFFECT-31: coin stop-motion stacking (8–12 fps)
   ============================================================ */
function CoinStopMotionCard() {
  const reduced = usePrefersReducedMotion();
  const visible = useDocumentVisible();
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const [frame, setFrame] = useState(0);
  const FRAMES = 5;

  useEffect(() => {
    if (reduced || !inView || !visible) return;
    // 10 fps stop-motion
    const id = window.setInterval(() => setFrame((f) => (f + 1) % FRAMES), 100);
    return () => window.clearInterval(id);
  }, [reduced, inView, visible]);

  return (
    <div className="gallery-media" ref={ref}>
      <div className="coins" role="img" aria-label="Coins stacking into a pile, stop-motion">
        {[0, 1, 2, 3, 4].map((i) => (
          <svg
            key={i}
            className={`frame${i === frame || (reduced && i === 0) ? " on" : ""}${i === 0 ? " first" : ""}`}
            width="110"
            height="90"
            viewBox="0 0 110 90"
            aria-hidden="true"
          >
            {Array.from({ length: i + 1 }).map((_, c) => (
              <g key={c}>
                <ellipse cx={55 + (c % 2 === 0 ? 0 : 4)} cy={72 - c * 13} rx="26" ry="9" fill="#e9b949" stroke="#b8860b" strokeWidth="1.5" />
                <text x={55 + (c % 2 === 0 ? 0 : 4)} y={75 - c * 13} textAnchor="middle" fontSize="10" fill="#8a6508" fontFamily="Jost, sans-serif">K</text>
              </g>
            ))}
          </svg>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   The gallery — 10 cards
   ============================================================ */
const CARDS: { title: string; body: string; media: React.ReactNode; effect: string }[] = [];

export function ServicesGallery() {
  CARDS.length = 0;
  CARDS.push(
    {
      effect: "EFFECT-07",
      title: "Global remittance network",
      body: "Live routes from London, Toronto, Dubai, Doha, Sydney and more converge on Nairobi.",
      media: <NetworkGlobeCard />,
    },
    {
      effect: "EFFECT-08",
      title: "The Barnabas wordmark",
      body: "Our name, drawn stroke by stroke — the same mark that greets you on every transfer.",
      media: (
        <div className="gallery-media">
          <Wordmark animated height={36} />
        </div>
      ),
    },
    {
      effect: "EFFECT-09",
      title: "Every currency, one destination",
      body: "Pounds, dollars and shillings — hover or focus to watch currencies transform.",
      media: <MorphCurrencyCard />,
    },
    {
      effect: "EFFECT-13",
      title: "Family first, always",
      body: "Every transfer is someone’s rent, school fees or hospital bill. Wave hello to Grace.",
      media: (
        <div className="gallery-media">
          <FamilyMascot waving />
        </div>
      ),
    },
    {
      effect: "EFFECT-14",
      title: "Confirmations you can trust",
      body: "Instant receipts on your phone, mirrored by WhatsApp and email for both sides.",
      media: <Phone3DCard />,
    },
    {
      effect: "EFFECT-16",
      title: "Nairobi meets the diaspora",
      body: "Two skylines, one story — mixed-media art from our design team.",
      media: <CollageCard />,
    },
    {
      effect: "EFFECT-17",
      title: "Fluid like the market",
      body: "Rates move. So do we — liquid by design, stable where it matters.",
      media: <BlobCard />,
    },
    {
      effect: "EFFECT-19",
      title: "Build something at home",
      body: "Watch a Kenyan home take shape, funded by steady remittance bricks.",
      media: <IsometricHomeCard />,
    },
    {
      effect: "EFFECT-21",
      title: "From everywhere, to Kenya",
      body: "Hand-drawn routes from every continent point home.",
      media: <DoodleArrowsCard />,
    },
    {
      effect: "EFFECT-31",
      title: "Watch your savings grow",
      body: "Little by little — contributions stacking into real capital.",
      media: <CoinStopMotionCard />,
    },
  );

  return (
    <section className="section" id="services" aria-labelledby="services-heading">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Services gallery, 10 cards</span>
          <h2 id="services-heading">Everything the diaspora needs, in one place</h2>
          <p className="muted">
            Remittance, investment, property and legal services — built for Kenyans in the UK, USA,
            Canada, Germany, UAE, Qatar and Australia.
          </p>
        </div>

        <div className="gallery">
          {CARDS.map((card) => (
            <article key={card.effect} className="gallery-card">
              {card.media}
              <h3>{card.title}</h3>
              <p>{card.body}</p>
              <span className="meta">{card.effect}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
