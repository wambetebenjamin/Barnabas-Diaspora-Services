import type { MetadataRoute } from "next";
import { SITE } from "@/lib/design";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/send", "/api/", "/login", "/register"],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
