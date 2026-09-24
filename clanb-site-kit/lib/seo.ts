import type { Event, Organization, Venue } from "@/lib/data/types";

/** Public origin for canonical URLs, sitemap and JSON-LD. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://clanb.in").replace(/\/$/, "");
export const SITE_NAME = "Clan B";

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Safe JSON for <script type="application/ld+json"> (escapes "<" so it can't close the tag). */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CLANB TECH SOLUTIONS PRIVATE LIMITED",
    alternateName: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl("/brand/clanb-logo.svg"),
    slogan: "The future of games.",
    address: [
      { "@type": "PostalAddress", addressLocality: "Bengaluru", addressRegion: "Karnataka", addressCountry: "IN" },
      { "@type": "PostalAddress", addressLocality: "Chennai", addressRegion: "Tamil Nadu", addressCountry: "IN" },
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/search?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

const EVENT_STATUS: Partial<Record<Event["status"], string>> = {
  cancelled: "https://schema.org/EventCancelled",
};

export function eventJsonLd(event: Event, organization: Organization, venue?: Venue) {
  const soldOut = event.status === "full" || event.status === "waitlist";
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.summary,
    startDate: event.startsAt,
    endDate: event.endsAt,
    eventStatus: EVENT_STATUS[event.status] ?? "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    url: absoluteUrl(`/events/${event.slug}`),
    organizer: { "@type": "Organization", name: organization.name, url: absoluteUrl(`/providers/${organization.slug}`) },
    ...(venue && {
      location: {
        "@type": "Place",
        name: venue.name,
        address: {
          "@type": "PostalAddress",
          streetAddress: venue.address.line1,
          addressLocality: venue.address.city,
          addressRegion: venue.address.state,
          postalCode: venue.address.postalCode,
          addressCountry: "IN",
        },
      },
    }),
    offers: {
      "@type": "Offer",
      price: (event.price.amount / 100).toFixed(2),
      priceCurrency: event.price.currency,
      availability: soldOut ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
      url: absoluteUrl(`/events/${event.slug}`),
    },
  };
}
