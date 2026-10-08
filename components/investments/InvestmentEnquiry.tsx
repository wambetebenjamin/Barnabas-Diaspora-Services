"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Send, CheckCircle } from "lucide-react";
import { INVESTMENTS } from "@/lib/data";

/** Investment enquiry form — reCAPTCHA v3 → /api/investment. */
export function InvestmentEnquiry() {
  const params = useSearchParams();
  const preselected = params.get("product") ?? "";
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState("busy");
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/investment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          phone: form.get("phone"),
          product: form.get("product"),
          amount: form.get("amount"),
          message: form.get("message"),
        }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (json.ok) {
        setState("done");
        setMessage("Enquiry received — our investment desk will contact you within one working day.");
        (e.target as HTMLFormElement).reset();
      } else {
        setState("error");
        setMessage(json.error ?? "Could not send your enquiry.");
      }
    } catch {
      setState("error");
      setMessage("Network error — please try again.");
    }
  };

  return (
    <section className="section" id="enquire" aria-labelledby="invest-enquiry-heading">
      <div className="container" style={{ maxWidth: 720 }}>
        <div className="section-head">
          <span className="eyebrow">Investment enquiry</span>
          <h2 id="invest-enquiry-heading">Talk to the investment desk</h2>
        </div>
        <form className="calc-card" onSubmit={submit} noValidate>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="ie-name">Full name</label>
              <input id="ie-name" name="name" className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="ie-email">Email</label>
              <input id="ie-email" name="email" type="email" className="form-input" required />
            </div>
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="ie-phone">Phone / WhatsApp</label>
              <input id="ie-phone" name="phone" className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="ie-product">Product</label>
              <select id="ie-product" name="product" className="form-select" defaultValue={preselected}>
                <option value="">Select a product…</option>
                {INVESTMENTS.map((p) => (
                  <option key={p.slug} value={p.slug}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="ie-amount">Planned investment (KES)</label>
            <input id="ie-amount" name="amount" className="form-input" inputMode="numeric" placeholder="250000" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="ie-message">Questions or notes</label>
            <textarea id="ie-message" name="message" className="form-textarea" />
          </div>
          <button type="submit" className="btn btn-primary btn-lg" disabled={state === "busy"}>
            <Send size={16} className="icon-anim" />
            {state === "busy" ? "Sending…" : "Submit investment enquiry"}
          </button>
          <p role="status" style={{ minHeight: 22, marginTop: 10 }}>
            {state === "done" ? <CheckCircle size={15} aria-hidden="true" /> : null} {message}
          </p>
          <p className="meta">
            reCAPTCHA v3 protected. Investment products carry risk — see our Investment Product
            Disclaimer in the <a href="/legal/terms">Terms</a>.
          </p>
        </form>
      </div>
    </section>
  );
}
