import type { MetadataRoute } from "next";
import { repo } from "@/lib/data/repo";
import { absoluteUrl } from "@/lib/seo";
import { HELP_TOPICS } from "@/content/help";
import { LEGAL_DOCS } from "@/content/legal";
import { SUB_LANDINGS } from "@/content/providers";

const STATIC_ROUTES = [
  "/", "/play", "/play/request", "/events", "/venues", "/sports", "/games", "/clubs", "/about", "/help",
  "/for-providers", "/for-providers/apply",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [events, venues, games, sports, orgs] = await Promise.all([
    repo.listEvents(),
    repo.listVenues(),
    repo.listGames(),
    repo.listSports(),
    repo.listOrganizations(),
  ]);

  const paths = [
    ...STATIC_ROUTES,
    ...events.filter((e) => e.status !== "draft" && e.status !== "pending-review").map((e) => `/events/${e.slug}`),
    ...venues.map((v) => `/venues/${v.slug}`),
    ...games.map((g) => `/games/${g.slug}`),
    ...sports.map((s) => `/sports/${s.slug}`),
    ...orgs.map((o) => `/providers/${o.slug}`),
    ...HELP_TOPICS.map((t) => `/help/${t.slug}`),
    ...LEGAL_DOCS.map((d) => `/legal/${d.slug}`),
    ...SUB_LANDINGS.map((l) => `/for-providers/${l.slug}`),
  ];

  return paths.map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: path.startsWith("/events") || path === "/sports" ? "daily" : "weekly",
    priority: path === "/" ? 1 : path.split("/").length <= 2 ? 0.8 : 0.6,
  }));
}
