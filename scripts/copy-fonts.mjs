// Re-extracts the sacred design-source fonts (Jost 500/600/700, Open Sans 400/500 —
// exactly the weights declared by the Finanza template's Google Fonts link) from
// @fontsource packages into ./fonts for next/font/local self-hosting.
// Run: npm run fonts:sync
import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "fonts");
mkdirSync(out, { recursive: true });

const pick = [
  ["@fontsource/jost/files", "jost", [500, 600, 700]],
  ["@fontsource/open-sans/files", "open-sans", [400, 500]],
];

for (const [pkg, name, weights] of pick) {
  for (const w of weights) {
    for (const subset of ["latin", "latin-ext"]) {
      const file = `${name}-${subset}-${w}-normal.woff2`;
      try {
        copyFileSync(join(root, "node_modules", pkg, file), join(out, file));
        console.log("copied", file);
      } catch {
        console.warn("missing", file);
      }
    }
  }
}
