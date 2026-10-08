"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { LogIn, ShieldCheck, CheckCircle } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/send";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [phase, setPhase] = useState<"credentials" | "otp">("credentials");
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, otp: phase === "otp" ? otp : undefined }),
      });
      const json = (await res.json()) as {
        ok: boolean;
        otpRequired?: boolean;
        devOtp?: string;
        error?: string;
      };
      if (json.ok && json.otpRequired) {
        setPhase("otp");
        setDevOtp(json.devOtp ?? null);
      } else if (json.ok) {
        router.push(next);
        router.refresh();
      } else {
        setError(json.error ?? "Sign-in failed.");
      }
    } catch {
      setError("Network error — please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="section" style={{ maxWidth: 520, marginInline: "auto" }}>
      <div className="transfer-panel">
        <div className="row" style={{ gap: 10 }}>
          <LogIn size={22} aria-hidden="true" />
          <h1 style={{ fontSize: 28, margin: 0 }}>Sign in</h1>
        </div>
        <p className="muted">
          Access your transfers, saved recipients and investment portfolio. Protected by two-factor
          verification.
        </p>

        <form onSubmit={submit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              className="form-input"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              className="form-input"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {phase === "otp" ? (
            <div className="form-group">
              <label className="form-label" htmlFor="login-otp">
                <ShieldCheck size={13} aria-hidden="true" /> Verification code (2FA)
              </label>
              <input
                id="login-otp"
                className="form-input"
                inputMode="numeric"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              {devOtp ? (
                <p className="meta" role="status">
                  <CheckCircle size={13} aria-hidden="true" /> Dev mode — your code is{" "}
                  <strong>{devOtp}</strong> (no SMTP configured).
                </p>
              ) : (
                <p className="meta">We emailed a six-digit code to {email}.</p>
              )}
            </div>
          ) : null}

          {error ? (
            <p className="form-error" role="alert">{error}</p>
          ) : null}

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: "100%" }} disabled={busy}>
            {busy ? "Checking…" : phase === "otp" ? "Verify and sign in" : "Continue"}
          </button>
        </form>

        <p className="meta" style={{ marginTop: 16 }}>
          New to Barnabas? <Link href={`/register?next=${encodeURIComponent(next)}`}>Create an account</Link>
        </p>
      </div>
    </section>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="section" />}>
      <LoginForm />
    </Suspense>
  );
}
