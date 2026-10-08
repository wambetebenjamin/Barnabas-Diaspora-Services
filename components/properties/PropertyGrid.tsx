"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Building, MapPin, Calendar, Eye, MessageCircle } from "lucide-react";
import { PROPERTIES, type Property } from "@/lib/data";
import { formatKES, WHATSAPP_PROPERTY_TEXT, SITE } from "@/lib/design";
import { usePrefersReducedMotion } from "@/lib/motion";

const GBP_PER_KES = 1 / 172.4;

function PropertyCard({ property }: { property: Property }) {
  return (
    <article className="property-card">
      <img
        className="property-img"
        src={property.image}
        alt={`${property.name} in ${property.location}`}
        width={640}
        height={400}
        loading="lazy"
      />
      <div className="property-body">
        <div className="row" style={{ gap: 8 }}>
          <MapPin size={15} aria-hidden="true" />
          <span className="meta">{property.location}</span>
        </div>
        <h3 style={{ marginBottom: 4 }}>{property.name}</h3>
        <div className="property-price">
          {formatKES(property.priceKES)}
          <small>
            ≈ £{(property.priceKES * GBP_PER_KES).toLocaleString("en-GB", { maximumFractionDigits: 0 })} GBP
          </small>
        </div>
        <p className="muted" style={{ fontSize: 13, margin: 0 }}>{property.blurb}</p>
        <div className="row meta" style={{ gap: 14 }}>
          <span className="row" style={{ gap: 6 }}>
            <Building size={13} aria-hidden="true" /> {property.developer}
          </span>
          <span className="row" style={{ gap: 6 }}>
            <Calendar size={13} aria-hidden="true" /> {property.completionDate}
          </span>
        </div>
        <div className="row" style={{ marginTop: "auto", paddingTop: 12 }}>
          <Link href={`/property/${property.slug}`} className="btn btn-primary">
            <Eye size={15} className="icon-anim" />
            View Property
          </Link>
          <a
            className="btn btn-light"
            href={`https://wa.me/${SITE.whatsappNumber}?text=${WHATSAPP_PROPERTY_TEXT}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={15} className="icon-anim" />
            Enquire
          </a>
        </div>
      </div>
    </article>
  );
}

function SkeletonCard() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <div className="skeleton skeleton-img" />
      <div style={{ paddingTop: 22 }}>
        <div className="skeleton skeleton-line lg" />
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line sm" />
      </div>
    </div>
  );
}

/**
 * EFFECT-24 — property cards load behind shimmer skeletons with exact
 * dimensions and aria-busy on the container (zero CLS; grey skeletons under
 * reduced motion).
 */
export function PropertyGrid({ limit = 6 }: { limit?: number }) {
  const reduced = usePrefersReducedMotion();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Property[]>([]);

  useEffect(() => {
    const id = window.setTimeout(
      () => {
        setItems(PROPERTIES.slice(0, limit));
        setLoading(false);
      },
      reduced ? 120 : 650,
    );
    return () => window.clearTimeout(id);
  }, [limit, reduced]);

  return (
    <section className="section" id="property" aria-labelledby="property-heading">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Property for diaspora buyers</span>
          <h2 id="property-heading">Own a home in Kenya from wherever you are</h2>
          <p className="muted">
            Title-checked developments with prices shown in KES and GBP, virtual viewings over
            WhatsApp, and legal support through completion.
          </p>
        </div>

        <div className="grid-3" aria-busy={loading} aria-live="polite">
          {loading
            ? Array.from({ length: limit }).map((_, i) => <SkeletonCard key={`sk-${i}`} />)
            : items.map((property) => <PropertyCard key={property.slug} property={property} />)}
        </div>

        <div className="row" style={{ marginTop: 32 }}>
          <Link href="/property" className="btn btn-outline">
            Browse all properties
          </Link>
        </div>
      </div>
    </section>
  );
}

export { PropertyCard };
