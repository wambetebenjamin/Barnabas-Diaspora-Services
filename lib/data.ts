/** Editorial + product content for Barnabas Diaspora Services. */

export type Investment = {
  slug: string;
  name: string;
  blurb: string;
  expectedReturn: string;
  minInvestmentKES: number;
  risk: "Low" | "Medium" | "High";
  category: string;
};

export const INVESTMENTS: Investment[] = [
  {
    slug: "government-bonds",
    name: "Government Bonds",
    blurb:
      "Kenya Treasury bills and infrastructure bonds with predictable coupon payments, held in your name and monitored from abroad.",
    expectedReturn: "9.5% p.a.",
    minInvestmentKES: 50_000,
    risk: "Low",
    category: "Government Bonds",
  },
  {
    slug: "unit-trusts",
    name: "Unit Trusts",
    blurb:
      "Professionally managed money-market and balanced funds — start small and top up every month from your diaspora salary.",
    expectedReturn: "12.8% p.a.",
    minInvestmentKES: 10_000,
    risk: "Medium",
    category: "Unit Trusts",
  },
  {
    slug: "real-estate-investment",
    name: "Real Estate Investment",
    blurb:
      "Vetted development projects in Nairobi, Mombasa and Kisumu with title-deed diligence handled by our Kenyan legal team.",
    expectedReturn: "16.2% p.a.",
    minInvestmentKES: 250_000,
    risk: "Medium",
    category: "Real Estate Investment",
  },
  {
    slug: "chama-investment-accounts",
    name: "Chama Investment Accounts",
    blurb:
      "Group accounts with transparent ledgers, scheduled contributions and joint approvals — built for chamas in the UK, USA and Canada.",
    expectedReturn: "11.4% p.a.",
    minInvestmentKES: 5_000,
    risk: "Medium",
    category: "Chama Investment Accounts",
  },
  {
    slug: "fixed-deposits",
    name: "Fixed Deposits",
    blurb:
      "Lock in a guaranteed rate for 3 to 24 months with Kenyan banks. Ideal for school fees and planned projects back home.",
    expectedReturn: "8.2% p.a.",
    minInvestmentKES: 100_000,
    risk: "Low",
    category: "Fixed Deposits",
  },
  {
    slug: "business-loans-sme",
    name: "Business Loans to Kenya SMEs",
    blurb:
      "Fund vetted Kenyan small businesses and earn monthly interest while creating jobs — full due-diligence reports included.",
    expectedReturn: "14.6% p.a.",
    minInvestmentKES: 50_000,
    risk: "High",
    category: "Business Loans to Kenya SMEs",
  },
];

export type Property = {
  slug: string;
  name: string;
  location: string;
  priceKES: number;
  developer: string;
  completionDate: string;
  bedrooms: number;
  sizeSqM: number;
  image: string;
  blurb: string;
  amenities: string[];
};

export const PROPERTIES: Property[] = [
  {
    slug: "kilimani-riverside-apartments",
    name: "Kilimani Riverside Apartments",
    location: "Kilimani, Nairobi",
    priceKES: 12_500_000,
    developer: "Riverstone Developments",
    completionDate: "December 2026",
    bedrooms: 3,
    sizeSqM: 142,
    image: "/images/property-investment.jpg",
    blurb:
      "Riverside two and three bedroom apartments with a rooftop garden, backup power and 24-hour security — ten minutes from Yaya Centre.",
    amenities: ["Rooftop garden", "Backup generator", "Borehole water", "CCTV security", "Fibre ready"],
  },
  {
    slug: "westlands-panorama-suites",
    name: "Westlands Panorama Suites",
    location: "Westlands, Nairobi",
    priceKES: 18_900_000,
    developer: "Savannah Urban",
    completionDate: "June 2027",
    bedrooms: 2,
    sizeSqM: 118,
    image: "/images/diaspora-professional.jpg",
    blurb:
      "Executive suites above Chiromo Road with co-working lounges, a gym and guaranteed buy-back options for diaspora investors.",
    amenities: ["Gym", "Co-working lounge", "Pool", "Two lifts", "Managed rentals"],
  },
  {
    slug: "diani-beach-villas",
    name: "Diani Beach Villas",
    location: "Diani, Mombasa",
    priceKES: 22_400_000,
    developer: "Coastline Living",
    completionDate: "March 2027",
    bedrooms: 4,
    sizeSqM: 240,
    image: "/images/family-video-call.jpg",
    blurb:
      "Holiday villas 400 metres from Diani beach with rental management included — a holiday home that pays for itself.",
    amenities: ["Private pool", "Rental management", "Solar water", "Beach access", "Title deed ready"],
  },
  {
    slug: "thika-green-estate",
    name: "Thika Green Estate",
    location: "Thika, Kiambu County",
    priceKES: 6_800_000,
    developer: "Maji Build Kenya",
    completionDate: "August 2026",
    bedrooms: 3,
    sizeSqM: 120,
    image: "/images/property-investment.jpg",
    blurb:
      "Affordable family homes on the Thika Superhighway corridor, ideal for first-time diaspora buyers with flexible payment plans.",
    amenities: ["Playground", "Borehole", "Perimeter wall", "Payment plan", "Near SGR"],
  },
  {
    slug: "karen-luxury-townhouses",
    name: "Karen Luxury Townhouses",
    location: "Karen, Nairobi",
    priceKES: 35_000_000,
    developer: "Acacia Prime",
    completionDate: "November 2026",
    bedrooms: 5,
    sizeSqM: 320,
    image: "/images/property-investment.jpg",
    blurb:
      "Gated community townhouses with mature gardens, servant quarters and a residents' clubhouse in the heart of Karen.",
    amenities: ["Gated community", "Clubhouse", "Servant quarters", "Solar heating", "Double garage"],
  },
  {
    slug: "nairobi-riverbank-lofts",
    name: "Nairobi Riverbank Lofts",
    location: "Parklands, Nairobi",
    priceKES: 9_750_000,
    developer: "Riverstone Developments",
    completionDate: "February 2027",
    bedrooms: 1,
    sizeSqM: 76,
    image: "/images/mobile-money-received.jpg",
    blurb:
      "Compact designer lofts for young professionals and short-stay investors, with strong projected Airbnb yields.",
    amenities: ["Airbnb ready", "Concierge", "Gym", "Parking", "Smart locks"],
  },
];

export type DocService = {
  name: string;
  description: string;
  required: string[];
  feeGBP: number;
  feeUSD: number;
};

export const DOC_SERVICES: DocService[] = [
  {
    name: "Kenya Power Billing",
    description:
      "We follow up billing errors, token failures and account regularisation with Kenya Power on your behalf while you are abroad.",
    required: ["Copy of national ID or passport", "Kenya Power account number", "Signed authorisation letter"],
    feeGBP: 15,
    feeUSD: 19,
  },
  {
    name: "NTSA Services",
    description:
      "Driving licence renewals, logbook transfers and NTSA account recovery handled end-to-end for diaspora vehicle owners.",
    required: ["Copy of national ID or passport", "Driving licence or logbook copy", "KRA PIN"],
    feeGBP: 25,
    feeUSD: 32,
  },
  {
    name: "Kenya Revenue Authority Facilitation",
    description:
      "KRA PIN registration, iTax password resets, tax compliance certificates and nil returns filed for Kenyans abroad.",
    required: ["Copy of national ID or passport", "KRA PIN (if available)", "Email used for iTax"],
    feeGBP: 30,
    feeUSD: 38,
  },
  {
    name: "Passport Renewal Assistance",
    description:
      "End-to-end support for eCitizen passport renewals: forms, appointments, document checks and follow-up with immigration.",
    required: ["Current passport copy", "Passport-size photo", "Birth certificate copy", "eCitizen account details"],
    feeGBP: 45,
    feeUSD: 57,
  },
];

export type Testimonial = {
  name: string;
  country: string;
  service: string;
  quote: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Grace W.",
    country: "United Kingdom",
    service: "Money transfer",
    quote:
      "I sent rent to my mother in Kisumu on a Sunday night and she had the M-Pesa notification in minutes. The fees are honest and the rate is always clear.",
  },
  {
    name: "David M.",
    country: "USA",
    service: "Government bonds",
    quote:
      "The team walked me through my first Treasury bond purchase on WhatsApp. Everything is documented, and I can track my coupon payments from Texas.",
  },
  {
    name: "Faith N.",
    country: "Canada",
    service: "Property purchase",
    quote:
      "They conducted the title search in Nairobi while I was in Toronto and arranged a virtual viewing. I bought my plot without a single stressful flight.",
  },
  {
    name: "Samuel K.",
    country: "Germany",
    service: "Chama investment account",
    quote:
      "Our Frankfurt chama finally has a transparent ledger. Monthly contributions are automatic and every member sees where the money goes.",
  },
  {
    name: "Amina H.",
    country: "Qatar",
    service: "KRA & NTSA facilitation",
    quote:
      "My KRA compliance certificate and licence renewal were sorted while I was working in Doha. Fast, polite and completely professional.",
  },
  {
    name: "Peter O.",
    country: "Australia",
    service: "Fixed deposits",
    quote:
      "I lock away school fees in a fixed deposit every quarter. The rate alerts help me time the transfers from Sydney perfectly.",
  },
];

/** Globe transfer routes: diaspora cities → Nairobi (lat, lng). */
export const DIASPORA_CITIES = [
  { name: "London", lat: 51.5074, lng: -0.1278 },
  { name: "Manchester", lat: 53.4808, lng: -2.2426 },
  { name: "New York", lat: 40.7128, lng: -74.006 },
  { name: "Washington DC", lat: 38.9072, lng: -77.0369 },
  { name: "Toronto", lat: 43.6532, lng: -79.3832 },
  { name: "Berlin", lat: 52.52, lng: 13.405 },
  { name: "Frankfurt", lat: 50.1109, lng: 8.6821 },
  { name: "Dubai", lat: 25.2048, lng: 55.2708 },
  { name: "Doha", lat: 25.2854, lng: 51.531 },
  { name: "Sydney", lat: -33.8688, lng: 151.2093 },
  { name: "Melbourne", lat: -37.8136, lng: 144.9631 },
] as const;

export const NAIROBI = { name: "Nairobi", lat: -1.2921, lng: 36.8219 } as const;

/** Scrollytelling transfer journey — EFFECT-02 pinned beats. */
export const JOURNEY_BEATS = [
  {
    title: "Beat 1 — Opening Barnabas in London",
    body: "A Kenyan in London opens Barnabas on their phone during her lunch break. The live rate board greets her with today’s GBP to KES rate before she even taps send.",
  },
  {
    title: "Beat 2 — Entering the transfer",
    body: "She enters the amount and recipient details. Her mother’s M-Pesa number is saved from last month, so it takes seconds. The fee and delivery time are shown up front.",
  },
  {
    title: "Beat 3 — Paying from the UK",
    body: "Payment is processed from her UK bank with a verified reference. KYC is already complete, so there is nothing else to upload.",
  },
  {
    title: "Beat 4 — M-Pesa in Nairobi",
    body: "Minutes later her mother receives an M-Pesa notification in Nairobi, and both of them get a WhatsApp confirmation with the full receipt.",
  },
];

/** Flipbook guide — EFFECT-30 content. */
export const GUIDE_PAGES = [
  {
    title: "Your Complete Guide to Sending Money to Kenya",
    body: "Welcome. This short guide explains how exchange rates work, what your transfer limits are, which documents KYC requires, and the simple habits that save you money on every transfer.",
  },
  {
    title: "Exchange rates, explained",
    body: "The mid-market rate is the real rate you see on Google. Providers add a margin — we show the margin openly. A rate of 172.40 means each £1 buys KES 172.40 before fees. Rates move with inflation, interest rates and trade flows, so timing large transfers can save real money.",
  },
  {
    title: "Transfer limits",
    body: "Personal transfers run from £10 up to £15,000 per day and £40,000 per month (equivalent in USD, EUR, AED or CAD). Larger investment transfers are arranged with our desk after a source-of-funds check. Recipient M-Pesa limits also apply per transaction.",
  },
  {
    title: "KYC requirements",
    body: "Every sender completes a one-time KYC check: a government photo ID, a proof of address dated within three months, and a selfie for liveness. We store documents encrypted and only for the retention period required by Kenyan and UK law.",
  },
  {
    title: "Saving on fees",
    body: "Send in standard rather than instant mode when you can — fees are halved and most transfers still arrive the same day. Combine small transfers into one monthly send, lock a rate on large amounts, and use chama accounts to split costs across members.",
  },
  {
    title: "Staying safe",
    body: "We never ask for your PIN or one-time codes over WhatsApp. Confirm every recipient number verbally. Report suspicious messages to our support line immediately — your funds remain protected while we investigate.",
  },
];

export const RISK_TIPS = [
  {
    title: "No Hidden Cost",
    body: "Every fee is shown before you confirm — the recipient receives exactly what the calculator promised.",
  },
  {
    title: "Dedicated Diaspora Desk",
    body: "A named adviser in Nairobi and London, reachable on WhatsApp in your time zone.",
  },
  {
    title: "24/7 Availability",
    body: "Initiate transfers and investment enquiries any time; payouts settle during Kenyan business hours.",
  },
];
