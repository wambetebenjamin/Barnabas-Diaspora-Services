"use client";

import { useState } from "react";
import { Users, CheckCircle, Send } from "lucide-react";
import { FamilyMascot } from "@/components/services/ServicesGallery";
import { SEND_FROM_COUNTRIES } from "@/lib/design";

const INTERESTS = [
  "Government bonds",
  "Unit trusts",
  "Real estate",
  "Fixed deposits",
  "SME business loans",
  "Land purchase",
];

/**
 * Chama investment accounts — registration form with reCAPTCHA v3,
 * saved via /api/chama with WhatsApp notification.
 * Includes the waving mascot variant (EFFECT-13) in the CTA band.
 */
export function ChamaSection() {
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const [interests, setInterests] = useState<string[]>([]);

  const toggleInterest = (interest: string) => {
    setInterests((current) =>
      current.includes(interest) ? current.filter((i) => i !== interest) : [...current, interest],
    );
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState("busy");
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/chama", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chamaName: form.get("chamaName"),
          country: form.get("country"),
          members: form.get("members"),
          monthlyContribution: form.get("monthlyContribution"),
          currency: form.get("currency"),
          interests,
          leadName: form.get("leadName"),
          leadEmail: form.get("leadEmail"),
          leadPhone: form.get("leadPhone"),
        }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (json.ok) {
        setState("done");
        setMessage("Chama registered! A WhatsApp confirmation is on its way to the lead contact.");
        (e.target as HTMLFormElement).reset();
        setInterests([]);
      } else {
        setState("error");
        setMessage(json.error ?? "Registration failed — please try again.");
      }
    } catch {
      setState("error");
      setMessage("Network error — please try again.");
    }
  };

  return (
    <section className="section" id="chama" aria-labelledby="chama-heading">
      <div className="container">
        <div className="chama-band">
          <div className="grid-2" style={{ alignItems: "start" }}>
            <div>
              {/* Waving mascot variant in the investment CTA band (EFFECT-13) */}
              <div className="row" style={{ gap: 16, marginBottom: 8 }}>
                <FamilyMascot waving size={96} />
                <Users size={40} aria-hidden="true" />
              </div>
              <h2 id="chama-heading">
                Register your chama abroad and invest together in Kenya.
              </h2>
              <p style={{ color: "rgba(255,255,255,0.9)" }}>
                Transparent ledgers, scheduled contributions in GBP or USD, and joint approvals —
                built for diaspora investment groups in the UK, USA, Canada, Germany, UAE, Qatar and
                Australia.
              </p>
              <ul style={{ color: "#fff", paddingLeft: 18, lineHeight: 2 }}>
                <li>Monthly contributions from £50 / $60 per member</li>
                <li>Group investment accounts with dual approvals</li>
                <li>Statements and tax reports shared automatically</li>
              </ul>
            </div>

            <form className="chama-form" onSubmit={submit} noValidate>
              <h3 style={{ color: "#fff" }}>Chama registration</h3>

              <div className="form-group">
                <label className="form-label" htmlFor="chama-name">Chama name</label>
                <input id="chama-name" name="chamaName" className="form-input" required placeholder="e.g. Diaspora Kings & Queens Chama" />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="chama-country">Country</label>
                  <select id="chama-country" name="country" className="form-select" defaultValue={SEND_FROM_COUNTRIES[0]}>
                    {SEND_FROM_COUNTRIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="chama-members">Number of members</label>
                  <input id="chama-members" name="members" className="form-input" inputMode="numeric" required placeholder="12" />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="chama-contribution">Total monthly contribution</label>
                  <input id="chama-contribution" name="monthlyContribution" className="form-input" inputMode="decimal" required placeholder="2000" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="chama-currency">Currency</label>
                  <select id="chama-currency" name="currency" className="form-select" defaultValue="GBP">
                    <option value="GBP">GBP (£)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
              </div>

              <fieldset style={{ border: 0, padding: 0, margin: "0 0 14px" }}>
                <legend className="form-label" style={{ marginBottom: 8 }}>Investment interests</legend>
                <div className="grid-2" style={{ gap: 6 }}>
                  {INTERESTS.map((interest) => (
                    <label key={interest} className="checkbox-row" style={{ color: "#fff" }}>
                      <input
                        type="checkbox"
                        checked={interests.includes(interest)}
                        onChange={() => toggleInterest(interest)}
                      />
                      <span style={{ fontSize: 13 }}>{interest}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="chama-lead-name">Lead contact name</label>
                  <input id="chama-lead-name" name="leadName" className="form-input" required />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="chama-lead-phone">Lead WhatsApp number</label>
                  <input id="chama-lead-phone" name="leadPhone" className="form-input" required placeholder="+44 …" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="chama-lead-email">Lead email</label>
                <input id="chama-lead-email" name="leadEmail" className="form-input" type="email" required />
              </div>

              <button type="submit" className="btn btn-primary btn-lg" disabled={state === "busy"}>
                <Send size={16} className="icon-anim" />
                {state === "busy" ? "Registering…" : "Register Chama"}
              </button>

              <p role="status" style={{ minHeight: 22, marginTop: 10, color: state === "error" ? "#ffd2c4" : "#eafff2" }}>
                {state === "done" ? <CheckCircle size={15} aria-hidden="true" /> : null} {message}
              </p>
              <p className="meta" style={{ color: "rgba(255,255,255,0.75)" }}>
                Protected by reCAPTCHA v3 — we never share your chama data without consent (Kenya
                Data Protection Act 2019 / GDPR).
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
