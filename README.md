# Barnabas Diaspora Services

**Send Money Home with Confidence.** Fast, secure, and trusted transfers from the UK, USA, UAE,
and Canada to Kenya — invest while you are away.

Remittance · investment facilitation · property search · legal & document services · diaspora
event ticketing, for Kenyans in the UK, USA, Canada, Germany, UAE, Qatar and Australia.

Built with **Next.js 16.4 (App Router, TypeScript) on Node 24 LTS** — the exact stack Vercel
deploys. Design system extracted pixel-first from the supplied design source
(`finanza-v1.0.0.zip`, unpacked and audited in
[`docs/design-source-audit.md`](docs/design-source-audit.md)).

---

## Quick start

```bash
node -v        # v24.x (see .nvmrc — 24.21.0)
npm install
npm run dev    # http://localhost:3000
npm run build  # production build (verified green)
npm run start
```

Environment variables: copy `.env.example` → `.env.local`. The app runs fully with **no** env
vars (fallback FX board, dev OTP codes, dev-bypass captcha, queued integrations) and upgrades to
production behaviour as soon as each secret is set.

## Design source (extracted values)

| Token | Value | From zip |
|---|---|---|
| `--primary` | `#355efc` | ✓ verbatim |
| `--secondary` | `#e93c05` | ✓ verbatim |
| `--tertiary` | `#555555` | ✓ verbatim |
| `--light` | `#dfe4fd` | ✓ verbatim |
| `--dark` | `#011a41` | ✓ verbatim |
| `#000b1c` | copyright bar | ✓ |
| radius 8px, .5s motion, 45px top-bar | | ✓ |

**Fonts are sacred.** Jost **500/600/700** (display/headings/buttons) + Open Sans **400/500**
(body) — the exact Google Fonts weights declared by the template — self-hosted via
`next/font/local` from the woff2 files in `/fonts` (provenance: `@fontsource` packages, re-extract
with `npm run fonts:sync`). Type floors per brief: body ≥15px, metadata ≥11px, nav 13px,
buttons 12px.

## Structure

```
app/                  App Router pages + API routes
  api/                transfer, rates, ws (live SSE bus), investment, property,
                      chama, kyc, newsletter, contact, captcha, auth/*
  legal/              privacy-policy, terms, cookie-policy, gdpr
  property/[slug]/    ISR (revalidate 300) + per-property Open Graph
  send/               protected transfer flow (SSR, edge-gated)
  rates/              SSR live rate board
  invest/ services/ contact/ login/ register/
components/           hero (WebGL globe), calculator, journey, investments,
                      properties, services gallery (EFFECT-01…31), ar, chama,
                      documents, flipbook, testimonials, newsletter, contact,
                      transfer, layout, effects, providers
lib/                  rates + fees, KV/Blob stores, sessions (jose), auth+OTP,
                      reCAPTCHA, mail, WhatsApp, Daraja, live-rate bus
fonts/                Jost 500/600/700 + Open Sans 400/500 (sacred)
public/images/        Pexels photography (see image-credits.md — no AI images)
docs/                 design-source-audit.md (full zip inspection)
proxy.ts              edge auth guard for /send (Next 16 "proxy" convention)
vercel.json           HSTS + security headers
```

## Effects coverage (all 31 reduced-motion fallbacks in `globals.css`)

| | Effect | Implementation |
|---|---|---|
| 01 | WebGL transfer globe | Three.js arcs, drag + arrow-key orbit, poster fallback |
| 02 | Scrollytelling journey | 4 pinned beats, IntersectionObserver, flat under RM |
| 03 | AR experience | opt-in WebXR, draggable 360° fallback, persistent Exit |
| 04 | Headline stagger + "Home" glitch | aria-hidden splits + sr-only sentence |
| 05 | Live rate updates | /api/ws push, "Rate updated N seconds ago", auto-reconnect |
| 06 | Currency particles | aria-hidden, <0.2 opacity, paused on hidden tab |
| 07 | Globe line-art network | looping arcs in viewport, static frame under RM |
| 08 | Self-drawn wordmark | runtime `getTotalLength`, drawn once, reused in preloader |
| 09 | Currency morph | matched-point path interpolation, reversible, crossfade under RM |
| 10 | Logo | animates once, replays on click |
| 11 | Icon motion | 180–420ms Lucide micro-animations |
| 12 | Input motion states | 120–320ms, `aria-invalid` shake |
| 13 | Family mascot | wave on hover/focus; waving variant in CTA band |
| 14 | Faux-3D phone | stacked CSS layers + tilt, flat under RM |
| 15 | Investment rail | scroll-snap, labelled, keyboard, grid under RM |
| 16 | Mixed-media collage | skyline cut-out + vector + grain, lazy, dimensioned |
| 17 | Liquid blob | bounded SVG filter, 404 + gallery card, never on text |
| 18 | Gradient backdrop | background-position only, contrast-verified |
| 19 | Isometric home | assembles on scroll, 120° axes |
| 21 | Doodle arrows | draw-on; mobile menu doodle driven by `aria-expanded` |
| 23 | Hero entrance | sequenced < 1.6s, CTA focusable immediately |
| 24 | Property skeletons | shimmer, exact dims, `aria-busy`, zero CLS |
| 25 | Globe preloader | progressive route draw, progress bar, skip at 3s, role=status |
| 26 | Invest reveal | hover:hover gated + focus-visible + tap toggle |
| 27 | Neumorphic widget | dual shadows, AA contrast, distinct pressed states |
| 28 | Glass navbar | blur max 20px, solid fallback, visible focus rings |
| 30 | Flipbook | 3D page flips, keyboard, announced pages, reading mode |
| 31 | Coin stop-motion | single sprite frames @10fps, halts off-screen |

## Backend / integrations

* `/api/transfer` — KV record → FX conversion → M-Pesa B2C (Daraja) queue → WhatsApp + email
* `/api/rates` — ExchangeRate-API fetch + 5-min cache + pinned fallback board
  (GBP 172.40 → KES, per the daily quote used site-wide)
* `/api/ws` — live rate pushes + presence to every open session (SSE transport with the
  WebSocket contract; auto-reconnecting client hook) — Vercel serverless cannot hold raw
  WebSockets, so the endpoint streams `text/event-stream`
* `/api/investment`, `/api/property`, `/api/chama`, `/api/newsletter`, `/api/contact`,
  `/api/kyc` (Vercel Blob + signed URLs), `/api/captcha` (server-side reCAPTCHA v3,
  v2 fallback under 0.5), `/api/auth/*` (NextAuth-style sessions, 2FA OTP)
* Vercel KV via REST when `KV_REST_API_URL` set; durable in-process store otherwise

## Compliance & security

* reCAPTCHA v3 on transfer, registration, login, investment/property/contact/newsletter/chama
  forms; secret env-only
* Cookie consent: Necessary (locked) / Functional / Analytics / Marketing — Kenya Data
  Protection Act 2019 + GDPR, `localStorage`, no repeat
* Privacy Policy (Remittance, KYC, Financial Records — encrypted & secured, GDPR rights, Kenya
  DPA rights, retention, DPO) · Terms (Remittance limits, KYC, investment & property
  disclaimers, Kenya governing law + EU note) · Cookie Policy · GDPR notice
* HSTS + security headers in `vercel.json` and `next.config.ts`
* Edge `proxy.ts` blocks `/send` without a valid signed session; authenticated routes excluded
  from the sitemap

## Photography

Pexels only, saved locally in `public/images/`, credited in [`image-credits.md`](image-credits.md).
No AI-generated images.

## Deployment (Vercel)

Node 24.x (`.nvmrc`), Next 16.4 (`engines.node >= 24.0.0`). Import the repo — Vercel detects
Next.js automatically; set the env vars from `.env.example` in Project Settings. Rates page is
SSR; property + investment pages are ISR (300s); `/send` is SSR-only and uncacheable.
