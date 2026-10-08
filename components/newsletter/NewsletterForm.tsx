"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { SEND_FROM_COUNTRIES } from "@/lib/design";

/** Newsletter signup — reCAPTCHA v3 on submit, /api/newsletter (Vercel KV). */
export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState<string>(SEND_FROM_COUNTRIES[0]);
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("busy");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, country }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (json.ok) {
        setState("done");
        setMessage("Subscribed — watch for monthly diaspora investment tips and rate alerts.");
        setEmail("");
      } else {
        setState("error");
        setMessage(json.error ?? "Subscription failed. Please try again.");
      }
    } catch {
      setState("error");
      setMessage("Network error — please try again.");
    }
  };

  return (
    <form className={compact ? "stack" : "newsletter-form"} onSubmit={submit} noValidate>
      <label className="sr-only" htmlFor={`nl-email-${compact ? "c" : "f"}`}>
        Email address
      </label>
      <input
        id={`nl-email-${compact ? "c" : "f"}`}
        className="form-input"
        type="email"
        required
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-invalid={state === "error"}
      />
      <label className="sr-only" htmlFor={`nl-country-${compact ? "c" : "f"}`}>
        Country of residence
      </label>
      <select
        id={`nl-country-${compact ? "c" : "f"}`}
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
      <button type="submit" className="btn btn-primary" disabled={state === "busy"}>
        <Send size={15} className="icon-anim" />
        {state === "busy" ? "Subscribing…" : "Subscribe"}
      </button>
      <p className="meta" role="status" style={{ minHeight: 18, color: state === "error" ? "#c22b0c" : undefined }}>
        {message}
      </p>
    </form>
  );
}
