import { CURRENCIES, type CurrencyCode } from "./design";

export type RatesSnapshot = {
  base: "KES";
  rates: Record<CurrencyCode, number>;
  updatedAt: number;
  /** External provider or "fallback" when the network is unreachable. */
  source: "ExchangeRate-API" | "fallback";
};

/**
 * Fallback board used when ExchangeRate-API is unreachable (e.g. offline
 * preview / CI). GBP is pinned to the daily quote used in the marketing copy:
 * "1 GBP equals KES 172.40 today."
 */
const FALLBACK_RATES: Record<CurrencyCode, number> = {
  GBP: 172.4,
  USD: 129.2,
  EUR: 150.35,
  AED: 35.18,
  CAD: 93.85,
};

type CacheEntry = { snapshot: RatesSnapshot; expires: number };
const globalStore = globalThis as typeof globalThis & { __rateCache?: CacheEntry };

const CACHE_MS = 5 * 60 * 1000;

export async function getRates(forceRefresh = false): Promise<RatesSnapshot> {
  const now = Date.now();
  const cached = globalStore.__rateCache;
  if (!forceRefresh && cached && cached.expires > now) return cached.snapshot;

  let snapshot: RatesSnapshot | null = null;
  const apiKey = process.env.EXCHANGE_RATE_API_KEY;

  try {
    const base = "https://v6.exchangerate-api.com/v6";
    const url = apiKey
      ? `${base}/${apiKey}/latest/USD`
      : `https://open.er-api.com/v6/latest/USD`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2500);
    const res = await fetch(url, { signal: controller.signal, next: { revalidate: 300 } });
    clearTimeout(timer);
    if (res.ok) {
      const json = (await res.json()) as { rates?: Record<string, number> };
      const usd = json.rates;
      if (usd && usd.USD && usd.KES) {
        // Convert everything via USD → KES.
        const rates = {} as Record<CurrencyCode, number>;
        for (const c of CURRENCIES) {
          const perUsd = usd[c.code];
          rates[c.code] = perUsd ? usd.KES / perUsd : FALLBACK_RATES[c.code];
        }
        rates.GBP = round(rates.GBP);
        rates.USD = round(rates.USD);
        rates.EUR = round(rates.EUR);
        rates.AED = round(rates.AED);
        rates.CAD = round(rates.CAD);
        snapshot = { base: "KES", rates, updatedAt: now, source: "ExchangeRate-API" };
      }
    }
  } catch {
    /* fall through to the pinned board */
  }

  if (!snapshot) {
    snapshot = { base: "KES", rates: FALLBACK_RATES, updatedAt: now, source: "fallback" };
  }

  globalStore.__rateCache = { snapshot, expires: now + CACHE_MS };
  return snapshot;
}

function round(n: number) {
  return Math.round(n * 100) / 100;
}

/** Transfer fee schedule — 1.5% + fixed, capped at 25 units of sending currency. */
export function computeFee(amount: number, speed: "instant" | "standard"): number {
  const pct = speed === "instant" ? 0.015 : 0.0075;
  const fixed = speed === "instant" ? 2.99 : 0.99;
  return Math.min(round(amount * pct + fixed), 25);
}

export function estimateDelivery(speed: "instant" | "standard"): string {
  return speed === "instant" ? "Arrives in minutes" : "Arrives within 2 working days";
}

export function convertToKES(amount: number, currency: CurrencyCode, rates: RatesSnapshot): number {
  return round2(amount * rates.rates[currency]);
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

export function formatRate(value: number): string {
  return value.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
