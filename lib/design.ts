/** Site-wide constants — Barnabas Diaspora Services. */

export const SITE = {
  name: "Barnabas Diaspora Services",
  shortName: "Barnabas",
  tagline: "Send Money Home with Confidence.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://barnabasdiaspora.co.ke",
  description:
    "Fast, secure, and trusted transfers from the UK, USA, UAE, and Canada to Kenya. Invest while you are away.",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "254112272061",
  phoneUk: process.env.NEXT_PUBLIC_PHONE_UK ?? "+44 20 1234 5678",
  phoneKe: process.env.NEXT_PUBLIC_PHONE_KE ?? "+254 112 272 061",
  email: "hello@barnabasdiaspora.co.ke",
  dpoEmail: process.env.DPO_EMAIL ?? "dpo@barnabasdiaspora.co.ke",
  officeNairobi:
    "Barnabas Diaspora Services, 4th Floor, Delta Towers, Chiromo Road, Westlands, Nairobi, Kenya",
  officeUk:
    "Barnabas Diaspora Services UK Desk, 2nd Floor, 45 King William Street, London EC4R 9AN, United Kingdom",
} as const;

export const WHATSAPP_HREF = `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(
  "Hello! I am in the diaspora and would like to use Barnabas Diaspora Services.",
)}`;

export const WHATSAPP_TRANSFER_TEXT = encodeURIComponent(
  "Hello! I would like help with a transfer to Kenya.",
);
export const WHATSAPP_PROPERTY_TEXT = encodeURIComponent(
  "Hello! I would like to schedule a virtual viewing for a property listing.",
);
export const WHATSAPP_INVEST_TEXT = encodeURIComponent(
  "Hello! I would like to enquire about diaspora investment products.",
);

/** Navbar currency selector — the five sending currencies supported. */
export const CURRENCIES = [
  { code: "GBP", label: "British Pound", symbol: "£", locale: "en-GB", flag: "🇬🇧" },
  { code: "USD", label: "US Dollar", symbol: "$", locale: "en-US", flag: "🇺🇸" },
  { code: "EUR", label: "Euro", symbol: "€", locale: "de-DE", flag: "🇪🇺" },
  { code: "AED", label: "UAE Dirham", symbol: "د.إ", locale: "ar-AE", flag: "🇦🇪" },
  { code: "CAD", label: "Canadian Dollar", symbol: "CA$", locale: "en-CA", flag: "🇨🇦" },
] as const;

export type CurrencyCode = (typeof CURRENCIES)[number]["code"];

export const CURRENCY_BY_CODE: Record<CurrencyCode, (typeof CURRENCIES)[number]> =
  Object.fromEntries(CURRENCIES.map((c) => [c.code, c])) as Record<
    CurrencyCode,
    (typeof CURRENCIES)[number]
  >;

export const SEND_FROM_COUNTRIES = [
  "United Kingdom",
  "United States",
  "Canada",
  "Germany",
  "United Arab Emirates",
  "Qatar",
  "Australia",
] as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/send", label: "Send Money" },
  { href: "/invest", label: "Invest" },
  { href: "/property", label: "Property" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
] as const;

export function formatKES(value: number): string {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatMoney(value: number, currency: string, locale = "en"): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: value < 100 ? 2 : 0,
    }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
}
