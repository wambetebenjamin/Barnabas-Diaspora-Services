# Barnabas Diaspora Services — Design Source Audit

> **Status: complete — produced before any new code.**
> Source: `finanza-v1.0.0.zip` (757,633 bytes) found in the repository root.
> Unpacked in full to `design-source/` (133 files, 1.7 MB).
> Template identified as **Finanza — Financial Services Website Template** by HTML Codex
> (`READ-ME.txt`: https://htmlcodex.com/financial-services-website-template), distributed via ThemeWagon.

---

## 1. Full file tree (unpacked zip)

```
finanza-v1.0.0.zip
├── READ-ME.txt
├── LICENSE.txt
├── financial-services-website-template.jpg      (800×500 preview)
├── index.html            (775 lines)
├── about.html            (400)
├── service.html          (376)
├── project.html          (253)
├── feature.html          (258)
├── team.html             (262)
├── testimonial.html      (265)
├── contact.html          (260)
├── 404.html              (221)
├── css/
│   ├── bootstrap.min.css        (Bootstrap v5.0.0, 164 KB)
│   └── style.css                (540 lines — the template stylesheet)
├── js/
│   └── main.js                  (115 lines)
├── img/
│   ├── header.jpg        (1920×600, page-header background)
│   ├── carousel-1.jpg    (1920×1080)
│   ├── carousel-2.jpg    (1920×1080)
│   ├── about.jpg         (700×700)
│   ├── bg.png            (760×341, gradient texture)
│   ├── service-1..4.jpg  (550×600 each)
│   ├── team-1..3.jpg     (550×550 each)
│   └── testimonial-1..4.jpg (100×100 each)
├── lib/
│   ├── animate/   (animate.css + animate.min.css @ v2.1.6)
│   ├── counterup/ (counterup.min.js)
│   ├── easing/    (easing.js + easing.min.js)
│   ├── owlcarousel/ (owl.carousel 2.x + themes, LICENSE, ajax-loader.gif)
│   ├── waypoints/ (waypoints.min.js + links.php)
│   └── wow/       (wow.js + wow.min.js, WOW v1.3.0 — 2016-10-04)
└── scss/
    ├── bootstrap.scss
    └── bootstrap/scss/  (full Bootstrap 5.0.0 SCSS source, incl. _variables.scss)
```

No build tooling, no `package.json`, no API layer — the source is a **static HTML template**.

---

## 2. CSS custom properties (complete)

The template declares exactly **five** custom properties, on `:root` in `css/style.css`:

| Token | Value | Use in template |
|---|---|---|
| `--primary` | `#355EFC` | brand blue — buttons, links, gradients, hovers |
| `--secondary` | `#E93C05` | orange accent (declared; sparingly used) |
| `--tertiary` | `#555555` | body/nav muted text, breadcrumb separators |
| `--light` | `#DFE4FD` | pale lavender — text on primary, footer links, borders, dots |
| `--dark` | `#011A41` | deep navy — footer surface (`bg-dark`) |

Additional hard-coded colors extracted from `style.css` and HTML (no variables):

| Value | Use |
|---|---|
| `#FFFFFF` | page background, card surfaces, spinner bg, mobile nav bg |
| `#000B1C` | copyright bar background (deeper than `--dark`) |
| `rgba(53, 94, 252, .07)` | top-bar bottom border (primary @ 7%) |
| `rgba(0, 0, 0, .07)` | mobile nav top border |
| `rgba(255, 255, 255, .5)` | project image hover wash |
| `rgba(53, 94, 252, .95)` | facts/callback gradient over `img/bg.png` texture |

## 3. Typography (FONTS ARE SACRED — extracted exactly)

Loaded from Google Fonts CDN (`fonts.googleapis.com` / `fonts.gstatic.com`, with preconnects):

```
https://fonts.googleapis.com/css2?family=Jost:wght@500;600;700&family=Open+Sans:wght@400;500&display=swap
```

| Role | Family | Weights | Notes |
|---|---|---|---|
| Display / headings / brand / buttons | **Jost** | **500, 600, 700** | Geometric sans (designed by indestructible type*). |
| Body / copy / metadata / nav | **Open Sans** | **400, 500** | Humanist sans (Steve Matteson / Ascender). |

* No font binaries are bundled in the zip (webfonts are CDN-loaded). These are the **exact
typefaces and weights** and are reproduced exactly by self-hosting the same Google Fonts
woff2 files in the Next.js build (`fonts/`, via `next/font/local`) so the site never depends
on a font CDN.

Weight mapping in `style.css` (kept):

| Selector | Weight | Font |
|---|---|---|
| `h1, .h1, h2, .h2, .fw-bold` | 700 | Jost |
| `h3, .h3, h4, .h4, .fw-medium` | 600 | Jost |
| `h5, .h5, h6, .h6, .fw-semi-bold` | 500 | Jost |
| `.btn` | 500 | Jost |
| body, `.nav-link`, footer links, `small`, `span` | 400/500 | Open Sans |

Font size floors per project spec (applied on top of the source type system):
body ≥ 15px, metadata ≥ 11px, navigation 13px, buttons 12px, natural wrapping.

## 4. Loading screen (spinner)

Present in every page of the zip (`#spinner`):

* Full-viewport fixed overlay, `bg-white`, flex-centred, `z-index: 99999`.
* Bootstrap `spinner-border text-primary`, 3rem × 3rem, `role="status"` semantics.
* Dismiss transition: `opacity .5s ease-out, visibility 0s linear .5s` (`.show` → hidden
  after `window.load`, via `setTimeout(..., 1)` in `js/main.js`).
* **No** wordmark, progress text, or skip control in the source → the production loading
  screen therefore uses the brief's fallback spec: **EFFECT-25** (globe SVG preloader with
  diaspora→Nairobi arcs, progressive line-draw, progress bar, skip at 3s,
  `role="status"` completion announcement, plain percentage under `prefers-reduced-motion`)
  plus **EFFECT-08** ("BARNABAS" wordmark self-draws, path length measured at runtime,
  drawn once, reused in preloader).

## 5. Cookie banner

**Absent** from the zip (no markup, JS, or CSS). → Production build uses the brief's fallback:
bottom-fixed full-width banner, copy about personalising the remittance experience, Cookie
Policy link, “Accept All” + “Manage Preferences”, modal with Necessary (locked)/Functional/
Analytics/Marketing, `localStorage` persistence, no repeat, `/legal/cookie-policy`,
Kenya Data Protection Act 2019 + GDPR compliant.

## 6. CAPTCHA

**Absent** (no reCAPTCHA/hCaptcha references). → Brief fallback: Google **reCAPTCHA v3** on
transfer initiation, registration, login, investment enquiry, property enquiry, contact,
newsletter, chama registration; server-side verification; v2 fallback under 0.5 score;
secret in environment variables (`/api/captcha`).

## 7. Legal pages

**Absent** (footer has a dead “Terms & Condition” link only). → Production pages:
`/legal/privacy-policy`, `/legal/terms`, `/legal/cookie-policy`, `/legal/gdpr`
(full text per brief; Kenya DPA 2019 + GDPR sections; DPO contact; encrypted financial data).

## 8. 404 page

Present: `404.html` — Bootstrap layout, `bi-exclamation-triangle display-1 text-primary`,
`display-1` “404”, heading “Page Not Found”, apology copy, “Go Back To Home” primary CTA,
shared navbar/footer. Production adapts it per brief (EFFECT-17): copy
**“This destination was not found.”**, CTA **“Return to Send Money.”**, liquid blob
animation (bounded SVG filter, never on text).

## 9. 500 page

**Absent.** → Brief fallback: “Our transfer system is temporarily offline. Your funds are
safe. Please try again shortly.” + Try Again button + prominent WhatsApp support number.

## 10. API routes

**Absent** (static template). → Full backend surface per brief:
`/api/transfer`, `/api/rates`, `/api/investment`, `/api/property`, `/api/chama`, `/api/kyc`,
`/api/newsletter`, `/api/contact`, `/api/captcha`, `/api/ws`, plus `/api/auth/*`
(login, register, OTP 2FA, session, logout).

## 11. Package / library versions (as bundled in the zip)

| Package | Version | Source |
|---|---|---|
| Bootstrap | **5.0.0** (CSS + full SCSS + JS 5.0.0 via CDN) | `css/`, `scss/`, cdn.jsdelivr.net |
| jQuery | 3.4.1 | CDN (code.jquery.com) |
| WOW.js | **1.3.0** (2016-10-04) | `lib/wow` |
| animate.css | **2.1.6** | `lib/animate` |
| Owl Carousel | 2.x (2.3.4 line) | `lib/owlcarousel` |
| Waypoints | 4.0.x | `lib/waypoints` |
| CounterUp | 1.x | `lib/counterup` |
| jQuery easing | 1.x | `lib/easing` |
| Font Awesome | 5.10.0 | CDN |
| Bootstrap Icons | 1.4.1 | CDN |
| Google Fonts | Jost 500/600/700, Open Sans 400/500 | CDN |

### Production stack (per “latest Node and Next, rhymes with Vercel”)

| Package | Version | Notes |
|---|---|---|
| Node.js | **24.x LTS** (`.nvmrc`, `engines: ">=24.0.0"`) | newest release line Vercel deploys |
| Next.js | **16.4.0** (App Router, TypeScript) | `next@16` is current `latest` on npm |
| React / React DOM | **19.3.x** | required by Next 16 |
| three | 0.186.x | WebGL globe (EFFECT-01) |
| lucide-react | 1.x | **only** icon set permitted |
| jose | 6.x | signed session cookies (edge-safe) |
| nodemailer | 10.x | `/api/contact` email |
| @fontsource/jost + @fontsource/open-sans | 5.x | provenance of the sacred woff2 files |
| TypeScript | 5.9.x | standard Next 16 pairing |

## 12. Environment variables

**None in the source.** Production `.env.example` (all secrets env-only):

```
# Public
NEXT_PUBLIC_SITE_URL, NEXT_PUBLIC_WHATSAPP_NUMBER, NEXT_PUBLIC_PHONE_UK, NEXT_PUBLIC_PHONE_KE,
NEXT_PUBLIC_RECAPTCHA_SITE_KEY, NEXT_PUBLIC_GA_ID (optional)
# Security / auth
AUTH_SECRET, RECAPTCHA_SECRET_KEY, RECAPTCHA_V2_SECRET_KEY
# Data (Vercel)
KV_REST_API_URL, KV_REST_API_TOKEN, BLOB_READ_WRITE_TOKEN
# Integrations
EXCHANGE_RATE_API_KEY, MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET, MPESA_SHORTCODE,
MPESA_PASSKEY, MPESA_CALLBACK_URL, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET,
SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM, DPO_EMAIL
```

## 13. Layout / motion values extracted (applied as custom properties)

* Top bar 45px high; navbar pads `25px 15px` per link; sticky behaviour re-homes at `scrollTop > 45`.
* Card radius **8px**; icon buttons square 32/38/48px circles; carousel controls 3rem.
* Default transition **.5s**; footer link hover **.3s** (letter-spacing 1px); spinner .5s ease-out.
* Page header: `padding-top: 12rem; padding-bottom: 6rem`, `header.jpg` cover.
* Facts/Callback: `linear-gradient(rgba(53,94,252,.95), …), url(bg.png)`.
* WOW scroll entrances: fadeIn / fadeInUp, delays 0.1s–0.5s (mapped to IntersectionObserver
  reveals in the rebuild).
* Dropdowns: `rotateX(-75deg) → 0deg`, `transform-origin: 0% 0%`, .5s.
* Back-to-top: fixed, 30px/30px, 48px circle.

## 14. Gap list → production sources (zip ⇒ brief fallback)

| Area | In zip? | Production source |
|---|---|---|
| Colours + type + radii + motion | yes | reused verbatim as CSS custom properties |
| Fonts | CDN refs only | self-hosted exact Jost/Open Sans weights |
| Loading spinner | basic | EFFECT-25 + EFFECT-08 (brief fallback) |
| Cookie banner | no | brief fallback (DPA 2019 + GDPR) |
| CAPTCHA | no | reCAPTCHA v3 + v2 fallback (brief) |
| Legal pages | no | brief legal copy |
| 404 | yes (adapted) | EFFECT-17 blob + brief copy |
| 500 | no | brief copy |
| APIs | no | full `/api/*` surface (brief) |
| WebXR, WebGL globe, flipbook, scrollytelling… | no | brief effect specs (EFFECT-01…31) |

## 15. Photos

Template photos (`img/*`) are generic finance stock (New York office, handshakes) — they are
**not** used as content. Replacement photography per brief is sourced from **Pexels /
Unsplash only**, saved locally under `public/images/`, credited in `image-credits.md`.
No AI-generated images anywhere in the project.
