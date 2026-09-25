import type { MetadataRoute } from "next";
import { repo } from "@/lib/data/repo";
import { absoluteUrl } from "@/lib/seo";
import { HELP_TOPICS } from "@/content/help";
import { LEGAL_DOCS } from "@/content/legal";

const STATIC_ROUTES = [
  "/", "/play", "/play/request", "/events", "/venues", "/sports", "/games", "/clubs", "/about", "/help",
  "/for-providers", "/for-providers/host", "/for-providers/partner", "/for-providers/venues", "/contact",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [events, venues, games, sports] = await Promise.all([
    repo.listEvents(),
    repo.listVenues(),
    repo.listGames(),
    repo.listSports(),
  ]);

  const paths = [
    ...STATIC_ROUTES,
    ...events.filter((e) => e.status !== "draft" && e.status !== "pending-review").map((e) => `/events/${e.slug}`),
    ...venues.map((v) => `/venues/${v.slug}`),
    ...games.map((g) => `/games/${g.slug}`),
    ...sports.map((s) => `/sports/${s.slug}`),
    ...HELP_TOPICS.map((t) => `/help/${t.slug}`),
    ...LEGAL_DOCS.map((d) => `/legal/${d.slug}`),
  ];

  return paths.map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: path.startsWith("/events") || path === "/sports" ? "daily" : "weekly",
    priority: path === "/" ? 1 : path.split("/").length <= 2 ? 0.8 : 0.6,
  }));
}
