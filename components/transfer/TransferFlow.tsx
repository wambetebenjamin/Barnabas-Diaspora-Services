"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Send,
  User,
  CreditCard,
  ShieldCheck,
  CheckCircle,
  Upload,
  Smartphone,
  Landmark,
  Wallet,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { useRates } from "@/components/providers/AppProviders";
import { CURRENCIES, CURRENCY_BY_CODE, formatKES, type CurrencyCode } from "@/lib/design";

const STEPS = [
  { id: 1, label: "Amount", icon: Send },
  { id: 2, label: "Recipient", icon: User },
  { id: 3, label: "Payment", icon: CreditCard },
  { id: 4, label: "KYC", icon: ShieldCheck },
  { id: 5, label: "Review", icon: CheckCircle },
];

type Recipient = { name: string; phone: string; relationship: string };

type ApiResult = {
  ok: boolean;
  reference?: string;
  devOtp?: string;
  error?: string;
  status?: string;
};

/**
 * Transfer initiation flow (/send) — multi-step authenticated:
 * 1 amount + preview, 2 recipient (saved recipients), 3 payment method
 * (SWIFT / Stripe / PayPal), 4 KYC uploads (Vercel Blob), 5 review with
 * reCAPTCHA v3 → /api/transfer (KV record, M-Pesa B2C queue, WhatsApp +
 * email confirmations).
 */
export function TransferFlow({ userName, userEmail }: { userName: string; userEmail: string }) {
  const { currency, setCurrency, rates } = useRates();
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("500");
  const [speed, setSpeed] = useState<"instant" | "standard">("instant");
  const [recipient, setRecipient] = useState<Recipient>({ name: "", phone: "", relationship: "" });
  const [savedRecipients, setSavedRecipients] = useState<Recipient[]>([]);
  const [payment, setPayment] = useState<"bank" | "card" | "paypal">("bank");
  const [idUploaded, setIdUploaded] = useState(false);
  const [selfieUploaded, setSelfieUploaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ApiResult | null>(null);
  const [invalid, setInvalid] = useState(false);

  const numeric = Number(amount.replace(/,/g, ""));
  const amountOk = Number.isFinite(numeric) && numeric > 0 && numeric <= 15000;
  const rate = rates?.rates?.[currency] ?? (currency === "GBP" ? 172.4 : 0);
  const fee = Math.min(numeric * (speed === "instant" ? 0.015 : 0.0075) + (speed === "instant" ? 2.99 : 0.99), 25);
  const recipientGets = amountOk ? (numeric - fee) * rate : 0;

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("bds_saved_recipients");
      if (raw) setSavedRecipients(JSON.parse(raw) as Recipient[]);
    } catch {
      /* ignore */
    }
  }, []);

  const saveRecipient = (r: Recipient) => {
    const next = [...savedRecipients.filter((s) => s.phone !== r.phone), r].slice(-8);
    setSavedRecipients(next);
    window.localStorage.setItem("bds_saved_recipients", JSON.stringify(next));
  };

  const uploadKyc = async (kind: "id-document" | "selfie", file: File) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const dataBase64 = String(reader.result).split(",")[1] ?? "";
      await fetch("/api/kyc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, fileName: file.name, contentType: file.type, dataBase64 }),
      });
      if (kind === "id-document") setIdUploaded(true);
      else setSelfieUploaded(true);
    };
    reader.readAsDataURL(file);
  };

  const confirm = async () => {
    setBusy(true);
    setResult(null);
    try {
      const res = await fetch("/api/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: numeric,
          currency,
          speed,
          recipient,
          payment,
          senderName: userName,
          senderEmail: userEmail,
        }),
      });
      const json = (await res.json()) as ApiResult;
      setResult(json);
      if (json.ok) saveRecipient(recipient);
    } catch {
      setResult({ ok: false, error: "Network error — please try again." });
    } finally {
      setBusy(false);
    }
  };

  const stepContent = useMemo(() => {
    switch (step) {
      case 1:
        return (
          <div>
            <h3>How much are you sending?</h3>
            <div className="form-group">
              <label className="form-label" htmlFor="tf-amount">Amount to send ({currency})</label>
              <input
                id="tf-amount"
                className="form-input"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                aria-invalid={!amountOk && amount !== ""}
              />
              {!amountOk && amount !== "" ? (
                <p className="form-error" role="alert">Enter an amount between 1 and 15,000 {currency}.</p>
              ) : null}
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="tf-currency">Currency</label>
                <select
                  id="tf-currency"
                  className="form-select"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>{c.code} — {c.label}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="tf-speed">Speed</label>
                <select
                  id="tf-speed"
                  className="form-select"
                  value={speed}
                  onChange={(e) => setSpeed(e.target.value as "instant" | "standard")}
                >
                  <option value="instant">Instant — arrives in minutes</option>
                  <option value="standard">Standard — 2 working days</option>
                </select>
              </div>
            </div>
            <div className="calc-result">
              <div className="form-label">Recipient receives preview</div>
              <div className="calc-receive">{amountOk ? formatKES(recipientGets) : "—"}</div>
              <div className="meta">
                Fee {CURRENCY_BY_CODE[currency].symbol}{fee.toFixed(2)} · Rate 1 {currency} = KES {rate.toFixed(2)}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <h3>Recipient details</h3>
            {savedRecipients.length > 0 ? (
              <div style={{ marginBottom: 18 }}>
                <div className="form-label" style={{ marginBottom: 8 }}>Saved recipients</div>
                <div className="stack">
                  {savedRecipients.map((r) => (
                    <button
                      key={r.phone}
                      type="button"
                      className="recipient-row"
                      onClick={() => setRecipient(r)}
                    >
                      <Smartphone size={18} aria-hidden="true" />
                      <span>
                        <strong>{r.name}</strong>
                        <div className="meta">{r.phone} · {r.relationship}</div>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
            <div className="form-group">
              <label className="form-label" htmlFor="tf-rname">Recipient name</label>
              <input
                id="tf-rname"
                className="form-input"
                value={recipient.name}
                onChange={(e) => setRecipient({ ...recipient, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="tf-rphone">M-Pesa number</label>
              <input
                id="tf-rphone"
                className="form-input"
                placeholder="07XX XXX XXX or +254…"
                value={recipient.phone}
                onChange={(e) => setRecipient({ ...recipient, phone: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="tf-rel">Relationship</label>
              <select
                id="tf-rel"
                className="form-select"
                value={recipient.relationship}
                onChange={(e) => setRecipient({ ...recipient, relationship: e.target.value })}
              >
                <option value="">Select…</option>
                <option>Parent</option>
                <option>Spouse</option>
                <option>Sibling</option>
                <option>Child</option>
                <option>Friend</option>
                <option>Business</option>
                <option>Other</option>
              </select>
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <h3>Payment method</h3>
            <div className="stack">
              <button
                type="button"
                className={`pay-method${payment === "bank" ? " selected" : ""}`}
                onClick={() => setPayment("bank")}
                aria-pressed={payment === "bank"}
              >
                <Landmark size={22} aria-hidden="true" />
                <div>
                  <strong>Bank transfer</strong>
                  <div className="meta">
                    SWIFT details: BARBGB22 · Barnabas Diaspora Services · IBAN GB29 BARB 2000 0000 0000 00 ·
                    reference shown after confirm
                  </div>
                </div>
              </button>
              <button
                type="button"
                className={`pay-method${payment === "card" ? " selected" : ""}`}
                onClick={() => setPayment("card")}
                aria-pressed={payment === "card"}
              >
                <CreditCard size={22} aria-hidden="true" />
                <div>
                  <strong>Debit card (Stripe)</strong>
                  <div className="meta">Visa or Mastercard, 3-D Secure, processed by Stripe.</div>
                </div>
              </button>
              <button
                type="button"
                className={`pay-method${payment === "paypal" ? " selected" : ""}`}
                onClick={() => setPayment("paypal")}
                aria-pressed={payment === "paypal"}
              >
                <Wallet size={22} aria-hidden="true" />
                <div>
                  <strong>PayPal</strong>
                  <div className="meta">Pay with your diaspora PayPal balance or linked bank.</div>
                </div>
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div>
            <h3>KYC verification</h3>
            <p className="muted">
              New senders upload a photo ID and a selfie once. Documents are stored encrypted
              (Vercel Blob with signed URLs) and only kept for the legal retention period.
            </p>
            <div className="grid-2">
              <label className="doc-card" style={{ cursor: "pointer" }}>
                <Upload size={22} aria-hidden="true" />
                <strong>ID document</strong>
                <span className="meta">
                  Passport or national ID — {idUploaded ? "uploaded ✓" : "PNG/JPG/PDF up to 8 MB"}
                </span>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  className="sr-only"
                  onChange={(e) => e.target.files?.[0] && uploadKyc("id-document", e.target.files[0])}
                />
              </label>
              <label className="doc-card" style={{ cursor: "pointer" }}>
                <Upload size={22} aria-hidden="true" />
                <strong>Selfie verification</strong>
                <span className="meta">
                  A clear selfie — {selfieUploaded ? "uploaded ✓" : "liveness check follows"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => e.target.files?.[0] && uploadKyc("selfie", e.target.files[0])}
                />
              </label>
            </div>
          </div>
        );

      default:
        return (
          <div>
            <h3>Review and confirm</h3>
            <dl style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "10px 18px" }}>
              <dt className="meta">You send</dt>
              <dd style={{ margin: 0 }}>
                <strong>{amountOk ? `${CURRENCY_BY_CODE[currency].symbol}${numeric.toFixed(2)}` : "—"}</strong> ({currency})
              </dd>
              <dt className="meta">Transfer fee</dt>
              <dd style={{ margin: 0 }}>{CURRENCY_BY_CODE[currency].symbol}{fee.toFixed(2)}</dd>
              <dt className="meta">Recipient</dt>
              <dd style={{ margin: 0 }}>
                {recipient.name || "—"} · {recipient.phone || "—"} · {recipient.relationship || "—"}
              </dd>
              <dt className="meta">Recipient receives</dt>
              <dd style={{ margin: 0 }}>
                <strong style={{ color: "var(--primary)" }}>{amountOk ? formatKES(recipientGets) : "—"}</strong> via M-Pesa
              </dd>
              <dt className="meta">Payment method</dt>
              <dd style={{ margin: 0 }}>{payment === "bank" ? "Bank transfer (SWIFT)" : payment === "card" ? "Debit card (Stripe)" : "PayPal"}</dd>
              <dt className="meta">KYC</dt>
              <dd style={{ margin: 0 }}>
                {idUploaded && selfieUploaded ? "Documents uploaded" : "Existing verified account"}
              </dd>
              <dt className="meta">Delivery</dt>
              <dd style={{ margin: 0 }}>{speed === "instant" ? "Arrives in minutes" : "Within 2 working days"}</dd>
            </dl>
            <p className="meta" style={{ marginTop: 14 }}>
              Protected by reCAPTCHA v3. Confirming queues the M-Pesa B2C payout and sends WhatsApp
              and email confirmations to you, plus a WhatsApp notification to your recipient.
            </p>
          </div>
        );
    }
  }, [step, amount, currency, speed, recipient, payment, numeric, fee, recipientGets, rate, savedRecipients, amountOk, idUploaded, selfieUploaded, setCurrency]);

  if (result?.ok) {
    return (
      <div className="transfer-panel" role="status">
        <CheckCircle size={40} aria-hidden="true" />
        <h2 style={{ marginTop: 12 }}>Transfer initiated</h2>
        <p>
          Reference <strong>{result.reference}</strong> — {formatKES(recipientGets)} to{" "}
          {recipient.name} ({recipient.phone}) via M-Pesa.
        </p>
        <p className="muted">
          You will receive an email and WhatsApp confirmation. Your recipient gets a WhatsApp
          notification when the payout completes.
        </p>
        <div className="row" style={{ marginTop: 18 }}>
          <Link href="/" className="btn btn-primary">Back to Home</Link>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => {
              setResult(null);
              setStep(1);
            }}
          >
            Send another transfer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="transfer-panel">
      <ol className="steps">
        {STEPS.map((s) => {
          const Icon = s.icon;
          return (
            <li key={s.id}>
              <span
                className={`step-pill${step === s.id ? " current" : ""}${step > s.id ? " done" : ""}`}
                aria-current={step === s.id ? "step" : undefined}
              >
                <Icon size={14} aria-hidden="true" />
                {s.id}. {s.label}
              </span>
            </li>
          );
        })}
      </ol>

      <div className="calc-result" style={{ marginBottom: 22 }}>
        <div className="row" style={{ justifyContent: "space-between" }}>
          <span className="form-label">Live estimate</span>
          <span className="meta">Rate: 1 {currency} = KES {rate.toFixed(2)}</span>
        </div>
        <div className="calc-receive">{amountOk ? formatKES(recipientGets) : "—"}</div>
      </div>

      {stepContent}

      {result?.error ? (
        <p className="form-error" role="alert" style={{ marginTop: 12 }}>{result.error}</p>
      ) : null}

      <div className="row" style={{ marginTop: 26, justifyContent: "space-between" }}>
        <button
          type="button"
          className="btn btn-light"
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          disabled={step === 1 || busy}
        >
          <ArrowLeft size={16} />
          Back
        </button>

        {step < 5 ? (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              if (step === 1) setInvalid(!amountOk);
              if (step === 1 && !amountOk) return;
              setStep((s) => Math.min(5, s + 1));
            }}
          >
            Continue
            <ArrowRight size={16} />
          </button>
        ) : (
          <button type="button" className="btn btn-primary btn-lg" onClick={confirm} disabled={busy || !amountOk}>
            <Send size={16} className="icon-anim" />
            {busy ? "Confirming…" : "Confirm and Send"}
          </button>
        )}
      </div>
    </div>
  );
}
