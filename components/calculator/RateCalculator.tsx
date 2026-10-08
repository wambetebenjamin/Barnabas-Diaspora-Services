"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Send, Zap, Clock, Users, ArrowLeftRight, CheckCircle } from "lucide-react";
import { useRates } from "@/components/providers/AppProviders";
import { CURRENCIES, CURRENCY_BY_CODE, SEND_FROM_COUNTRIES, formatKES, type CurrencyCode } from "@/lib/design";
import { usePrefersReducedMotion } from "@/lib/motion";

const INSTANT_FEE = (a: number) => Math.min(a * 0.015 + 2.99, 25);
const STANDARD_FEE = (a: number) => Math.min(a * 0.0075 + 0.99, 25);

/**
 * Live exchange rate calculator — EFFECT-05 (shared live updates,
 * "Rate updated N seconds ago", optimistic updates, auto-reconnect) and
 * EFFECT-12 (full motion states 120–320ms, aria-invalid on bad amounts).
 * Includes the EFFECT-27 neumorphic transfer widget cluster.
 */
export function RateCalculator() {
  const { currency, setCurrency, rates, secondsAgo, presence } = useRates();
  const reduced = usePrefersReducedMotion();

  const [amount, setAmount] = useState("1000");
  const [country, setCountry] = useState<string>(SEND_FROM_COUNTRIES[0]);
  const [speed, setSpeed] = useState<"instant" | "standard">("instant");
  const [invalid, setInvalid] = useState(false);
  const [savedRecipients, setSavedRecipients] = useState(0);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("bds_saved_recipients");
      if (raw) setSavedRecipients(JSON.parse(raw).length ?? 0);
    } catch {
      /* ignore */
    }
  }, []);

  const numeric = Number(amount.replace(/,/g, ""));
  const amountOk = Number.isFinite(numeric) && numeric > 0 && numeric <= 15000;

  useEffect(() => {
    setInvalid(amount !== "" && !amountOk);
  }, [amount, amountOk]);

  const rate = rates?.rates?.[currency] ?? (currency === "GBP" ? 172.4 : 0);

  const fee = useMemo(() => {
    if (!amountOk) return 0;
    return speed === "instant" ? INSTANT_FEE(numeric) : STANDARD_FEE(numeric);
  }, [numeric, speed, amountOk]);

  const recipientGets = useMemo(() => {
    if (!amountOk || !rate) return 0;
    return (numeric - fee) * rate;
  }, [numeric, fee, rate, amountOk]);

  const delivery = speed === "instant" ? "Arrives in minutes via M-Pesa" : "Arrives within 2 working days";

  return (
    <section className="section" id="calculator" aria-labelledby="calc-heading">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Live exchange rate calculator</span>
          <h2 id="calc-heading">See exactly what your family receives</h2>
          <p className="muted">
            Rates update live across every open session. Optimistic updates keep the numbers moving
            while the board refreshes.
          </p>
        </div>

        <div className="calc-grid">
          <div className="calc-card">
            {/* EFFECT-05 live indicator */}
            <div className="row" style={{ justifyContent: "space-between", marginBottom: 18 }}>
              <span className="live-indicator" role="status" aria-live="polite">
                <span className="dot" aria-hidden="true" />
                Rate updated {secondsAgo <= 1 ? "just now" : `${secondsAgo} second${secondsAgo === 1 ? "" : "s"} ago`}
              </span>
              <span className="meta">
                {presence > 1 ? `${presence} people calculating right now` : "You are the only visitor on this board"}
                {" · "}source: {rates?.source ?? "connecting…"}
              </span>
            </div>

            <div className="calc-field form-group">
              <label className="form-label" htmlFor="calc-amount">
                Amount to send ({currency})
              </label>
              <input
                id="calc-amount"
                className="form-input"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                aria-invalid={invalid}
                aria-describedby="calc-amount-error"
                placeholder="1000"
              />
              <p id="calc-amount-error" className="form-error" role="alert">
                {invalid ? "Enter an amount between 1 and 15,000 " + currency + "." : ""}
              </p>
            </div>

            <div className="calc-field form-group">
              <label className="form-label" htmlFor="calc-currency">
                Sending currency
              </label>
              <select
                id="calc-currency"
                className="form-select"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} — {c.label} ({c.symbol})
                  </option>
                ))}
              </select>
            </div>

            <div className="calc-field form-group">
              <label className="form-label" htmlFor="calc-country">
                Send from country
              </label>
              <select
                id="calc-country"
                className="form-select"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                {SEND_FROM_COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="calc-result">
              <div>
                <div className="form-label">Recipient receives in KES</div>
                <div className="calc-receive" aria-live="polite">
                  {amountOk ? formatKES(recipientGets) : "—"}
                </div>
              </div>
              <div className="row" style={{ justifyContent: "space-between" }}>
                <span>
                  <strong>Transfer fee:</strong> {amountOk ? `${CURRENCY_BY_CODE[currency].symbol}${fee.toFixed(2)}` : "—"}
                </span>
                <span>
                  <strong>Delivery:</strong> {delivery}
                </span>
              </div>
              <div className="row" style={{ justifyContent: "space-between" }}>
                <span className="meta">Rate: 1 {currency} = KES {rate ? rate.toFixed(2) : "…"}</span>
                <span className="meta">To M-Pesa, Airtel Money or bank in Kenya</span>
              </div>
            </div>

            <div style={{ marginTop: 20 }}>
              <Link href="/send" className="btn btn-primary btn-lg">
                <Send size={16} className="icon-anim" />
                Send Now
              </Link>
            </div>
          </div>

          {/* EFFECT-27: neumorphic transfer widget */}
          <aside className="neo-cluster" aria-label="Transfer options">
            <div>
              <div className="neo-label">Currency toggle</div>
              <div className="neo-segment" role="group" aria-label="Currency toggle">
                {CURRENCIES.slice(0, 3).map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    aria-pressed={currency === c.code}
                    onClick={() => setCurrency(c.code)}
                  >
                    {c.code}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="neo-label">Transfer speed</div>
              <div className="neo-segment" role="group" aria-label="Transfer speed selector">
                <button type="button" aria-pressed={speed === "instant"} onClick={() => setSpeed("instant")}>
                  <Zap size={14} aria-hidden="true" /> Instant
                </button>
                <button type="button" aria-pressed={speed === "standard"} onClick={() => setSpeed("standard")}>
                  <Clock size={14} aria-hidden="true" /> Standard
                </button>
              </div>
            </div>

            <div>
              <div className="neo-label">Fee comparison</div>
              <div className="fee-compare">
                <div>
                  <strong>{amountOk ? `${CURRENCY_BY_CODE[currency].symbol}${INSTANT_FEE(numeric).toFixed(2)}` : "—"}</strong>
                  <span className="meta">Instant</span>
                </div>
                <div>
                  <strong>{amountOk ? `${CURRENCY_BY_CODE[currency].symbol}${STANDARD_FEE(numeric).toFixed(2)}` : "—"}</strong>
                  <span className="meta">Standard</span>
                </div>
              </div>
            </div>

            <div className="neo-badge" role="status">
              <Users size={16} aria-hidden="true" />
              {savedRecipients > 0
                ? `${savedRecipients} saved recipient${savedRecipients === 1 ? "" : "s"}`
                : "No saved recipients yet"}
            </div>

            <div className="neo-panel" tabIndex={0}>
              <div className="row" style={{ justifyContent: "space-between" }}>
                <span className="neo-label">You send</span>
                <strong>{amountOk ? `${CURRENCY_BY_CODE[currency].symbol}${numeric.toFixed(2)}` : "—"}</strong>
              </div>
              <div className="row" style={{ justifyContent: "space-between", marginTop: 8 }}>
                <span className="neo-label">They get</span>
                <strong style={{ color: "var(--primary)" }}>
                  {amountOk ? formatKES(recipientGets) : "—"}
                </strong>
              </div>
              <div className="row" style={{ marginTop: 12 }}>
                <CheckCircle size={16} aria-hidden="true" />
                <span className="meta">
                  {reduced ? "Rates shown are refreshed every 5 minutes." : "Live board — pushed to all open sessions."}
                </span>
              </div>
            </div>

            <div className="neo-panel" style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <ArrowLeftRight size={18} aria-hidden="true" />
              <span className="meta">
                Switching currency updates exchange rates across the whole site instantly.
              </span>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
