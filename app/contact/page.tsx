import type { Metadata } from "next";
import { ContactSection } from "@/components/contact/ContactSection";

export const metadata: Metadata = {
  title: "Contact the Diaspora Desk",
  description:
    "Nairobi and London offices, WhatsApp, phone and email — talk to the Barnabas diaspora desk about transfers, investments, property or documents.",
};

export default function ContactPage() {
  return (
    <>
      <header className="page-hero">
        <div className="container">
          <span className="eyebrow" style={{ color: "#9db4ff", borderColor: "rgba(255,255,255,0.25)" }}>
            Contact
          </span>
          <h1>We are here in every time zone</h1>
          <p>
            Reach the Nairobi or London office — or message us on WhatsApp and we will pick up
            where you left off.
          </p>
        </div>
      </header>
      <ContactSection />
    </>
  );
}
