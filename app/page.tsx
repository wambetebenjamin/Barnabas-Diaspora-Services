import { Hero } from "@/components/hero/Hero";
import { RateCalculator } from "@/components/calculator/RateCalculator";
import { TransferJourney } from "@/components/journey/TransferJourney";
import { InvestmentRail } from "@/components/investments/InvestmentRail";
import { PropertyGrid } from "@/components/properties/PropertyGrid";
import { ServicesGallery } from "@/components/services/ServicesGallery";
import { ARExperience } from "@/components/ar/ARExperience";
import { ChamaSection } from "@/components/chama/ChamaSection";
import { DocumentServices } from "@/components/documents/DocumentServices";
import { Flipbook } from "@/components/guide/Flipbook";
import { Testimonials } from "@/components/testimonials/Testimonials";
import { ContactSection } from "@/components/contact/ContactSection";
import { Reveal } from "@/components/effects/Reveal";
import { RISK_TIPS } from "@/lib/data";
import { ShieldCheck, Users, Clock } from "lucide-react";
import { NewsletterForm } from "@/components/newsletter/NewsletterForm";

const TIP_ICONS = [ShieldCheck, Users, Clock];

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Why diaspora trusts us */}
      <section className="section" aria-label="Why choose Barnabas">
        <div className="container">
          <div className="grid-3">
            {RISK_TIPS.map((tip, i) => {
              const Icon = TIP_ICONS[i] ?? ShieldCheck;
              return (
                <Reveal key={tip.title} delay={i * 120}>
                  <div className="card">
                    <div className="invest-icon" aria-hidden="true">
                      <Icon size={22} />
                    </div>
                    <h3 style={{ fontSize: "var(--text-h4)" }}>{tip.title}</h3>
                    <p className="muted" style={{ margin: 0 }}>{tip.body}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <RateCalculator />
      <TransferJourney />
      <InvestmentRail />
      <PropertyGrid />
      <ServicesGallery />
      <ARExperience />
      <ChamaSection />
      <DocumentServices />
      <Flipbook />
      <Testimonials />

      {/* Newsletter */}
      <section className="section" id="newsletter" aria-labelledby="newsletter-heading">
        <div className="container">
          <div className="newsletter-band">
            <div className="grid-2" style={{ alignItems: "center" }}>
              <div>
                <span className="eyebrow" style={{ color: "#9db4ff", borderColor: "rgba(255,255,255,0.25)" }}>
                  Newsletter
                </span>
                <h2 id="newsletter-heading" style={{ color: "#fff" }}>
                  Monthly diaspora investment tips and rate alerts.
                </h2>
                <p style={{ color: "rgba(255,255,255,0.85)" }}>
                  One email a month — rate forecasts, new investment products, property releases and
                  deadline reminders for Kenyan documents.
                </p>
              </div>
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>

      <ContactSection />
    </>
  );
}
