import type { Metadata } from "next";
import { ServicesGallery } from "@/components/services/ServicesGallery";
import { DocumentServices } from "@/components/documents/DocumentServices";
import { Flipbook } from "@/components/guide/Flipbook";
import { ARExperience } from "@/components/ar/ARExperience";

export const metadata: Metadata = {
  title: "Services for Kenyans Abroad",
  description:
    "Remittance network, document services (Kenya Power, NTSA, KRA, passport renewal), the remittance guide and our AR experience.",
};

export default function ServicesPage() {
  return (
    <>
      <header className="page-hero">
        <div className="container">
          <span className="eyebrow" style={{ color: "#9db4ff", borderColor: "rgba(255,255,255,0.25)" }}>
            Services
          </span>
          <h1>Everything the diaspora needs</h1>
          <p>
            Money movement, Kenyan paperwork, legal support, event ticketing for diaspora
            community events — and the people in Nairobi who handle it for you.
          </p>
        </div>
      </header>

      <ServicesGallery />
      <DocumentServices />
      <Flipbook />
      <ARExperience />
    </>
  );
}
