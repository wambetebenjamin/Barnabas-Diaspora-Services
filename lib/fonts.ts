import localFont from "next/font/local";

/**
 * FONTS ARE SACRED.
 * Exact reproduction of the design source's type system
 * (finanza-v1.0.0.zip → Google Fonts: Jost 500/600/700 + Open Sans 400/500),
 * self-hosted from the same Google Fonts woff2 files (extracted via
 * `npm run fonts:sync` into /fonts).
 */

export const jost = localFont({
  variable: "--font-jost",
  display: "swap",
  preload: true,
  src: [
    { path: "../fonts/jost-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../fonts/jost-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../fonts/jost-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
});

export const openSans = localFont({
  variable: "--font-open-sans",
  display: "swap",
  preload: true,
  src: [
    { path: "../fonts/open-sans-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/open-sans-latin-500-normal.woff2", weight: "500", style: "normal" },
  ],
});
