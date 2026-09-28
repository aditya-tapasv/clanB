import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Private or per-user pages; they also send noindex.
      disallow: ["/checkout/", "/search", "/login", "/account", "/admin", "/vendor", "/api/"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
