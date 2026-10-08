import type { MetadataRoute } from "next";
import { PROPERTIES } from "@/lib/data";
import { SITE } from "@/lib/design";

/** Dynamic sitemap from public pages only — authenticated routes excluded. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const publicPages: MetadataRoute.Sitemap = [
    { url: `${SITE.url}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE.url}/invest`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE.url}/property`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE.url}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE.url}/rates`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE.url}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE.url}/legal/privacy-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE.url}/legal/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE.url}/legal/cookie-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE.url}/legal/gdpr`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    // /send, /login, /register are authenticated or utility — excluded
  ];

  const propertyPages: MetadataRoute.Sitemap = PROPERTIES.map((p) => ({
    url: `${SITE.url}/property/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...publicPages, ...propertyPages];
}
