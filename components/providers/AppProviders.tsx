"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { CURRENCIES, type CurrencyCode } from "@/lib/design";

export type RatesBoard = {
  rates: Record<string, number>;
  updatedAt: number;
  source: string;
};

type RatesContextValue = {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  rates: RatesBoard | null;
  presence: number;
  secondsAgo: number;
  refresh: () => void;
  /** Optimistic local tick after a currency change (single-visitor state). */
  optimisticAt: number;
};

const RatesContext = createContext<RatesContextValue | null>(null);

const STORAGE_KEY = "bds_currency";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("GBP");
  const [rates, setRates] = useState<RatesBoard | null>(null);
  const [presence, setPresence] = useState(1);
  const [now, setNow] = useState(() => Date.now());
  const [optimisticAt, setOptimisticAt] = useState(0);
  const sourceRef = useRef<EventSource | null>(null);
  const retryRef = useRef<number>(0);

  // restore selection
  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as CurrencyCode | null;
    if (saved && CURRENCIES.some((c) => c.code === saved)) setCurrencyState(saved);
  }, []);

  // initial fetch
  useEffect(() => {
    fetch("/api/rates")
      .then((r) => r.json())
      .then((data: { rates?: Record<string, number>; updatedAt?: number; source?: string }) => {
        if (data.rates) {
          setRates({ rates: data.rates, updatedAt: data.updatedAt ?? Date.now(), source: data.source ?? "cache" });
        }
      })
      .catch(() => undefined);
  }, []);

  // /api/ws — live rate pushes with auto-reconnect (SSE/WebSocket contract)
  useEffect(() => {
    let closed = false;

    const connect = () => {
      if (closed) return;
      const es = new EventSource("/api/ws");
      sourceRef.current = es;

      es.onopen = () => {
        retryRef.current = 0;
      };

      es.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data) as {
            type: string;
            snapshot?: { rates: Record<string, number>; updatedAt: number; source: string };
            presence?: number;
          };
          if (msg.type === "rates" && msg.snapshot) {
            setRates({
              rates: msg.snapshot.rates,
              updatedAt: msg.snapshot.updatedAt,
              source: msg.snapshot.source,
            });
          }
          if (typeof msg.presence === "number") setPresence(msg.presence);
        } catch {
          /* ignore malformed frames */
        }
      };

      es.onerror = () => {
        es.close();
        if (closed) return;
        // auto-reconnect with capped exponential backoff
        const delay = Math.min(1000 * 2 ** retryRef.current, 15000);
        retryRef.current += 1;
        window.setTimeout(connect, delay);
      };
    };

    connect();
    return () => {
      closed = true;
      sourceRef.current?.close();
    };
  }, []);

  // seconds-ago ticker
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const setCurrency = useCallback((code: CurrencyCode) => {
    setCurrencyState(code);
    window.localStorage.setItem(STORAGE_KEY, code);
    // optimistic local update — visible before the next server push
    setOptimisticAt(Date.now());
  }, []);

  const refresh = useCallback(() => {
    fetch("/api/rates?refresh=1")
      .then((r) => r.json())
      .then((data: { rates?: Record<string, number>; updatedAt?: number; source?: string }) => {
        if (data.rates) {
          setRates({ rates: data.rates, updatedAt: data.updatedAt ?? Date.now(), source: data.source ?? "cache" });
        }
      })
      .catch(() => undefined);
  }, []);

  const secondsAgo = Math.max(0, Math.round((now - (rates?.updatedAt ?? now)) / 1000));

  const value = useMemo<RatesContextValue>(
    () => ({ currency, setCurrency, rates, presence, secondsAgo, refresh, optimisticAt }),
    [currency, setCurrency, rates, presence, secondsAgo, refresh, optimisticAt],
  );

  return <RatesContext.Provider value={value}>{children}</RatesContext.Provider>;
}

export function useRates(): RatesContextValue {
  const ctx = useContext(RatesContext);
  if (!ctx) throw new Error("useRates must be used within AppProviders");
  return ctx;
}
