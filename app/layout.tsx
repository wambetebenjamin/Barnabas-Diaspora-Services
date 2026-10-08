import type { Metadata, Viewport } from "next";
import "./globals.css";
import { jost, openSans } from "@/lib/fonts";
import { AppProviders } from "@/components/providers/AppProviders";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFab } from "@/components/layout/WhatsAppFab";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { LiquidBlobFilterDefs } from "@/components/services/ServicesGallery";
import { SITE } from "@/lib/design";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Send Money Home with Confidence`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "send money to Kenya",
    "diaspora remittance",
    "Kenya M-Pesa transfer",
    "diaspora investment Kenya",
    "Kenya property for diaspora",
    "chama investment account",
  ],
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: `${SITE.name} — Send Money Home with Confidence`,
    description: SITE.description,
    url: SITE.url,
    images: [{ url: "/images/family-video-call.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — Send Money Home with Confidence`,
    description: SITE.description,
    images: ["/images/family-video-call.jpg"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#355efc",
  width: "device-width",
  initialScale: 1,
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE.url}/#organization`,
      name: SITE.name,
      url: SITE.url,
      logo: `${SITE.url}/icon.svg`,
      description: SITE.description,
      address: [
        {
          "@type": "PostalAddress",
          streetAddress: "4th Floor, Delta Towers, Chiromo Road, Westlands",
          addressLocality: "Nairobi",
          addressCountry: "KE",
        },
        {
          "@type": "PostalAddress",
          streetAddress: "2nd Floor, 45 King William Street",
          addressLocality: "London",
          postalCode: "EC4R 9AN",
          addressCountry: "GB",
        },
      ],
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: SITE.phoneKe,
          contactType: "customer support",
          areaServed: ["KE", "GB", "US", "CA", "DE", "AE", "QA", "AU"],
          availableLanguage: ["en", "sw"],
        },
      ],
      sameAs: [
        "https://www.facebook.com/",
        "https://twitter.com/",
        "https://www.linkedin.com/",
        "https://www.youtube.com/",
      ],
    },
    {
      "@type": "FinancialService",
      "@id": `${SITE.url}/#financial-service`,
      name: SITE.name,
      provider: { "@id": `${SITE.url}/#organization` },
      areaServed: ["KE", "GB", "US", "CA", "DE", "AE", "QA", "AU"],
      serviceType: [
        "International money transfer",
        "Diaspora investment facilitation",
        "Property search and conveyancing support",
        "Legal services for Kenyans abroad",
        "Event ticketing for diaspora community events",
      ],
      audience: {
        "@type": "Audience",
        name: "Kenyans abroad, diaspora investment groups and chamas",
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jost.variable} ${openSans.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <LoadingScreen />
        <AppProviders>
          <Navbar />
          <main id="main-content">{children}</main>
          <Footer />
          <WhatsAppFab />
          <CookieConsent />
        </AppProviders>
        <LiquidBlobFilterDefs />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </body>
    </html>
  );
}
