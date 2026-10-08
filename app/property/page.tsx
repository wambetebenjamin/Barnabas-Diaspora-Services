import type { Metadata } from "next";
import { PropertyGrid } from "@/components/properties/PropertyGrid";

export const metadata: Metadata = {
  title: "Property for Diaspora Buyers",
  description:
    "Title-checked property in Nairobi, Mombasa and beyond — prices in KES and GBP, virtual viewings over WhatsApp, legal support through completion.",
  openGraph: {
    title: "Property for Diaspora Buyers | Barnabas Diaspora Services",
    description:
      "Own a home in Kenya from wherever you are — diaspora-targeted listings with virtual viewings.",
    images: [{ url: "/images/property-investment.jpg", width: 1200, height: 630 }],
  },
};

/** Property listings — ISR revalidate 300. */
export const revalidate = 300;

export default function PropertyPage() {
  return (
    <>
      <header className="page-hero">
        <div className="container">
          <span className="eyebrow" style={{ color: "#9db4ff", borderColor: "rgba(255,255,255,0.25)" }}>
            Property search
          </span>
          <h1>Property built for diaspora buyers</h1>
          <p>
            Every listing is title-checked by our Kenyan legal team, priced in KES and GBP, and
            viewable over WhatsApp from anywhere in the world.
          </p>
        </div>
      </header>
      <PropertyGrid limit={6} />
    </>
  );
}
