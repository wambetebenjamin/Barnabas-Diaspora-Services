"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { UserPlus, ShieldCheck, CheckCircle } from "lucide-react";
import { SEND_FROM_COUNTRIES } from "@/lib/design";

function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/send";

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    country: SEND_FROM_COUNTRIES[0] as string,
    otp: "",
  });
  const [phase, setPhase] = useState<"details" | "otp">("details");
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (phase === "details") {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            password: form.password,
            phone: form.phone,
            country: form.country,
          }),
        });
        const json = (await res.json()) as { ok: boolean; devOtp?: string; error?: string };
        if (json.ok) {
          setPhase("otp");
          setDevOtp(json.devOtp ?? null);
        } else {
          setError(json.error ?? "Registration failed.");
        }
      } else {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email, password: form.password, otp: form.otp }),
        });
        const json = (await res.json()) as { ok: boolean; error?: string };
        if (json.ok) {
          router.push(next);
          router.refresh();
        } else {
          setError(json.error ?? "Verification failed.");
        }
      }
    } catch {
      setError("Network error — please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="section" style={{ maxWidth: 560, marginInline: "auto" }}>
      <div className="transfer-panel">
        <div className="row" style={{ gap: 10 }}>
          <UserPlus size={22} aria-hidden="true" />
          <h1 style={{ fontSize: 28, margin: 0 }}>Create your account</h1>
        </div>
        <p className="muted">
          One account for transfers, investments, property enquiries and document services — with
          two-factor security from day one.
        </p>

        <form onSubmit={submit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-name">Full name</label>
            <input
              id="reg-name"
              className="form-input"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">Email</label>
            <input
              id="reg-email"
              type="email"
              className="form-input"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">Password (min 8 characters)</label>
            <input
              id="reg-password"
              type="password"
              className="form-input"
              required
              minLength={8}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="reg-phone">Phone / WhatsApp</label>
              <input
                id="reg-phone"
                className="form-input"
                placeholder="+44 …"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-country">Country of residence</label>
              <select
                id="reg-country"
                className="form-select"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
              >
                {SEND_FROM_COUNTRIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {phase === "otp" ? (
            <div className="form-group">
              <label className="form-label" htmlFor="reg-otp">
                <ShieldCheck size={13} aria-hidden="true" /> Verification code (2FA)
              </label>
              <input
                id="reg-otp"
                className="form-input"
                inputMode="numeric"
                placeholder="123456"
                value={form.otp}
                onChange={(e) => setForm({ ...form, otp: e.target.value })}
                required
              />
              {devOtp ? (
                <p className="meta" role="status">
                  <CheckCircle size={13} aria-hidden="true" /> Dev mode — your code is{" "}
                  <strong>{devOtp}</strong> (no SMTP configured).
                </p>
              ) : (
                <p className="meta">We emailed a six-digit code to {form.email}.</p>
              )}
            </div>
          ) : null}

          {error ? <p className="form-error" role="alert">{error}</p> : null}

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: "100%" }} disabled={busy}>
            {busy ? "Working…" : phase === "otp" ? "Verify and continue" : "Create account"}
          </button>
        </form>

        <p className="meta" style={{ marginTop: 16 }}>
          Already registered? <Link href={`/login?next=${encodeURIComponent(next)}`}>Sign in</Link>
        </p>
      </div>
    </section>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="section" />}>
      <RegisterForm />
    </Suspense>
  );
}
