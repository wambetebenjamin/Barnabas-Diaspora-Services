import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, Building, MapPin, Ruler, BedDouble, MessageCircle, CheckCircle } from "lucide-react";
import { PROPERTIES } from "@/lib/data";
import { formatKES, SITE, WHATSAPP_PROPERTY_TEXT } from "@/lib/design";

export const revalidate = 300; // ISR 300

export function generateStaticParams() {
  return PROPERTIES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const property = PROPERTIES.find((p) => p.slug === slug);
  if (!property) return { title: "Property not found" };
  return {
    title: property.name,
    description: property.blurb,
    openGraph: {
      title: `${property.name} | Barnabas Diaspora Services`,
      description: property.blurb,
      images: [{ url: property.image, width: 1200, height: 630 }],
    },
  };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = PROPERTIES.find((p) => p.slug === slug);
  if (!property) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: property.name,
    description: property.blurb,
    image: property.image,
    offers: {
      "@type": "Offer",
      priceCurrency: "KES",
      price: property.priceKES,
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="page-hero">
        <div className="container">
          <span className="eyebrow" style={{ color: "#9db4ff", borderColor: "rgba(255,255,255,0.25)" }}>
            Property listing
          </span>
          <h1>{property.name}</h1>
          <p>
            <MapPin size={15} aria-hidden="true" /> {property.location} · {formatKES(property.priceKES)}
          </p>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <div className="contact-grid">
            <div>
              {/* Photo gallery */}
              <div className="grid-2" aria-label="Photo gallery">
                <img
                  className="property-img"
                  src={property.image}
                  alt={`${property.name} exterior`}
                  width={640}
                  height={400}
                  style={{ borderRadius: 8 }}
                />
                <img
                  className="property-img"
                  src="/images/family-video-call.jpg"
                  alt="Family viewing the property over a video call"
                  width={640}
                  height={400}
                  style={{ borderRadius: 8 }}
                />
              </div>

              <h2 style={{ marginTop: 28, fontSize: "var(--text-h3)" }}>About this property</h2>
              <p>{property.blurb}</p>

              <h2 style={{ fontSize: "var(--text-h4)" }}>Specifications</h2>
              <div className="grid-2">
                <div className="contact-line">
                  <BedDouble size={18} aria-hidden="true" />
                  <span>{property.bedrooms} bedrooms</span>
                </div>
                <div className="contact-line">
                  <Ruler size={18} aria-hidden="true" />
                  <span>{property.sizeSqM} m²</span>
                </div>
                <div className="contact-line">
                  <Building size={18} aria-hidden="true" />
                  <span>Developer: {property.developer}</span>
                </div>
                <div className="contact-line">
                  <Calendar size={18} aria-hidden="true" />
                  <span>Completion: {property.completionDate}</span>
                </div>
              </div>

              <h2 style={{ fontSize: "var(--text-h4)" }}>Amenities</h2>
              <ul style={{ paddingLeft: 18 }}>
                {property.amenities.map((a) => (
                  <li key={a} className="row" style={{ gap: 8 }}>
                    <CheckCircle size={14} aria-hidden="true" /> {a}
                  </li>
                ))}
              </ul>

              <h2 style={{ fontSize: "var(--text-h4)" }}>Location map</h2>
              <iframe
                className="map-embed"
                title={`Map of ${property.location}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(property.location)}&z=13&ie=UTF8&iwloc=&output=embed`}
              />
            </div>

            <aside>
              <div className="transfer-panel">
                <div className="property-price" style={{ fontSize: "var(--text-h2)" }}>
                  {formatKES(property.priceKES)}
                  <small>
                    ≈ £{(property.priceKES / 172.4).toLocaleString("en-GB", { maximumFractionDigits: 0 })} GBP
                  </small>
                </div>
                <p className="muted">
                  {property.developer} · {property.completionDate}
                </p>

                <a
                  className="btn btn-primary btn-lg"
                  style={{ width: "100%" }}
                  href={`https://wa.me/${SITE.whatsappNumber}?text=${WHATSAPP_PROPERTY_TEXT}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle size={16} className="icon-anim" />
                  Schedule a Virtual Viewing
                </a>

                <Link href="/contact" className="btn btn-outline" style={{ width: "100%", marginTop: 12 }}>
                  Request a call back
                </Link>

                <p className="meta" style={{ marginTop: 16 }}>
                  Virtual viewings run on WhatsApp video at a time that suits your schedule. Our legal
                  team verifies title, rates clearance and consents before any deposit.
                </p>
              </div>

              <div className="card" style={{ marginTop: 20 }}>
                <h3 style={{ fontSize: "var(--text-h5)" }}>Buying from abroad</h3>
                <p className="muted" style={{ fontSize: 13, margin: 0 }}>
                  Payment plans from 30% deposit. Funds move through our regulated client account, and
                  completion documents are couriered or held in escrow until you instruct release.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
