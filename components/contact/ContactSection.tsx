"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, MessageCircle, Send, CheckCircle } from "lucide-react";
import { SITE, WHATSAPP_HREF } from "@/lib/design";

/**
 * Contact section — Nairobi + UK offices, Google Maps embed, phone /
 * WhatsApp / email, enquiry form with reCAPTCHA v3 → /api/contact (Nodemailer).
 */
export function ContactSection() {
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState("busy");
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          phone: form.get("phone"),
          topic: form.get("topic"),
          message: form.get("message"),
        }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (json.ok) {
        setState("done");
        setMessage("Thank you — our diaspora desk will reply within one working day.");
        (e.target as HTMLFormElement).reset();
      } else {
        setState("error");
        setMessage(json.error ?? "Could not send your enquiry — please try again.");
      }
    } catch {
      setState("error");
      setMessage("Network error — please try again.");
    }
  };

  return (
    <section className="section" id="contact" aria-labelledby="contact-heading">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Contact</span>
          <h2 id="contact-heading">Talk to the diaspora desk</h2>
        </div>

        <div className="contact-grid">
          <div>
            <div className="contact-line">
              <MapPin size={18} aria-hidden="true" />
              <div>
                <strong>Nairobi office</strong>
                <div className="meta">{SITE.officeNairobi}</div>
              </div>
            </div>
            <div className="contact-line">
              <MapPin size={18} aria-hidden="true" />
              <div>
                <strong>UK office</strong>
                <div className="meta">{SITE.officeUk}</div>
              </div>
            </div>
            <div className="contact-line">
              <Phone size={18} aria-hidden="true" />
              <div>
                <strong>Phone</strong>
                <div className="meta">
                  {SITE.phoneKe} (Nairobi) · {SITE.phoneUk} (London)
                </div>
              </div>
            </div>
            <div className="contact-line">
              <MessageCircle size={18} aria-hidden="true" />
              <div>
                <strong>WhatsApp</strong>
                <div className="meta">
                  <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer">
                    Chat with the team on WhatsApp
                  </a>
                </div>
              </div>
            </div>
            <div className="contact-line">
              <Mail size={18} aria-hidden="true" />
              <div>
                <strong>Email</strong>
                <div className="meta">
                  <a href={`mailto:${SITE.email}`}>{SITE.email}</a> · DPO:{" "}
                  <a href={`mailto:${SITE.dpoEmail}`}>{SITE.dpoEmail}</a>
                </div>
              </div>
            </div>

            {/* Google Maps embed (privacy-enhanced mode) */}
            <iframe
              className="map-embed"
              style={{ marginTop: 22 }}
              title="Barnabas Diaspora Services Nairobi office location"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://maps.google.com/maps?q=Chiromo%20Road%20Westlands%20Nairobi&t=&z=14&ie=UTF8&iwloc=&output=embed"
            />
          </div>

          <form className="calc-card" onSubmit={submit} noValidate>
            <h3>Send an enquiry</h3>
            <div className="form-group">
              <label className="form-label" htmlFor="contact-name">Full name</label>
              <input id="contact-name" name="name" className="form-input" required />
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="contact-email">Email</label>
                <input id="contact-email" name="email" type="email" className="form-input" required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="contact-phone">Phone / WhatsApp</label>
                <input id="contact-phone" name="phone" className="form-input" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="contact-topic">Topic</label>
              <select id="contact-topic" name="topic" className="form-select" defaultValue="Money transfer">
                <option>Money transfer</option>
                <option>Investment enquiry</option>
                <option>Property enquiry</option>
                <option>Document services</option>
                <option>Chama registration</option>
                <option>Data protection / GDPR</option>
                <option>Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="contact-message">Message</label>
              <textarea id="contact-message" name="message" className="form-textarea" required />
            </div>
            <button type="submit" className="btn btn-primary btn-lg" disabled={state === "busy"}>
              <Send size={16} className="icon-anim" />
              {state === "busy" ? "Sending…" : "Send enquiry"}
            </button>
            <p role="status" style={{ minHeight: 22, marginTop: 10 }}>
              {state === "done" ? <CheckCircle size={15} aria-hidden="true" /> : null} {message}
            </p>
            <p className="meta">
              Protected by reCAPTCHA v3. Your message is processed under our Privacy Policy and the
              Kenya Data Protection Act 2019.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
