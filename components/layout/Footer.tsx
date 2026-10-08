import Link from "next/link";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { SITE } from "@/lib/design";
import { NewsletterForm } from "@/components/newsletter/NewsletterForm";

export function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <h4>Barnabas Diaspora Services</h4>
              <p className="footer-link" style={{ textTransform: "none" }}>
                <MapPin size={14} aria-hidden="true" /> {SITE.officeNairobi}
              </p>
              <p className="footer-link" style={{ textTransform: "none" }}>
                <MapPin size={14} aria-hidden="true" /> {SITE.officeUk}
              </p>
              <p className="footer-link" style={{ textTransform: "none" }}>
                <Phone size={14} aria-hidden="true" /> {SITE.phoneKe} · {SITE.phoneUk}
              </p>
              <p className="footer-link" style={{ textTransform: "none" }}>
                <Mail size={14} aria-hidden="true" /> {SITE.email}
              </p>
              <div className="social-row">
                <a href="https://www.facebook.com/" aria-label="Barnabas on Facebook">Fb</a>
                <a href="https://twitter.com/" aria-label="Barnabas on X (Twitter)">X</a>
                <a href="https://www.youtube.com/" aria-label="Barnabas on YouTube">Yt</a>
                <a href="https://www.linkedin.com/" aria-label="Barnabas on LinkedIn">In</a>
                <a
                  href={`https://wa.me/${SITE.whatsappNumber}`}
                  aria-label="Barnabas on WhatsApp"
                >
                  <MessageCircle size={18} aria-hidden="true" />
                </a>
              </div>
            </div>

            <div>
              <h4>Services</h4>
              <Link className="footer-link" href="/send">Money transfers</Link>
              <Link className="footer-link" href="/services#documents">Document services</Link>
              <Link className="footer-link" href="/services#documents">Kenya Power billing</Link>
              <Link className="footer-link" href="/services#documents">NTSA &amp; KRA facilitation</Link>
              <Link className="footer-link" href="/services#documents">Passport renewal assistance</Link>
              <Link className="footer-link" href="/services#guide">Remittance guide</Link>
            </div>

            <div>
              <h4>Quick Links</h4>
              <Link className="footer-link" href="/invest">Investment products</Link>
              <Link className="footer-link" href="/property">Property for diaspora</Link>
              <Link className="footer-link" href="/#chama">Chama accounts</Link>
              <Link className="footer-link" href="/rates">Live exchange rates</Link>
              <Link className="footer-link" href="/contact">Contact us</Link>
              <Link className="footer-link" href="/legal/privacy-policy">Privacy Policy</Link>
              <Link className="footer-link" href="/legal/terms">Terms &amp; Conditions</Link>
              <Link className="footer-link" href="/legal/cookie-policy">Cookie Policy</Link>
              <Link className="footer-link" href="/legal/gdpr">GDPR notice</Link>
            </div>

            <div>
              <h4>Newsletter</h4>
              <p style={{ textTransform: "none", fontSize: 13 }}>
                Monthly diaspora investment tips and rate alerts.
              </p>
              <NewsletterForm compact />
            </div>
          </div>

          <div className="pay-icons" aria-label="Accepted payment networks">
            <span className="pay-chip">SWIFT</span>
            <span className="pay-chip">VISA</span>
            <span className="pay-chip">MASTERCARD</span>
            <span className="pay-chip">M-PESA</span>
            <span className="pay-chip">PAYPAL</span>
          </div>

          <p className="gdpr-notice">
            GDPR notice for our UK and EU customers: Barnabas Diaspora Services processes remittance
            and KYC data under Article 6(1)(b) and 6(1)(c) of the GDPR and the Kenya Data Protection
            Act 2019. You may access, rectify, port or erase your data at any time — contact our Data
            Protection Officer at {SITE.dpoEmail}. Financial data is encrypted in transit and at rest.
          </p>
        </div>
      </footer>

      <div className="copyright">
        <div className="container row" style={{ justifyContent: "space-between" }}>
          <span>
            © {new Date().getFullYear()} Barnabas Diaspora Services. All rights reserved.
          </span>
          <span>
            Nairobi · London — built for the Kenyan diaspora
          </span>
        </div>
      </div>
    </>
  );
}
