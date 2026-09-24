import type { SearchResults } from "@/lib/data/repo";

export type SearchCategory = "Event" | "Game" | "Sport" | "Venue" | "Provider";

export interface SearchResultItem {
  id: string;
  title: string;
  category: SearchCategory;
  subtitle: string;
  href: string;
}

export interface SearchGroup {
  category: SearchCategory;
  label: string;
  items: SearchResultItem[];
}

/** Turns repo search results into display groups shared by /search and the ⌘K palette. */
export function toSearchGroups(results: SearchResults): SearchGroup[] {
  const groups: SearchGroup[] = [
    {
      category: "Event",
      label: "Events & sessions",
      items: results.events.map((e) => ({
        id: e.id,
        title: e.title,
        category: "Event",
        subtitle: e.summary,
        href: `/events/${e.slug}`,
      })),
    },
    {
      category: "Game",
      label: "Games",
      items: results.games.map((g) => ({
        id: g.id,
        title: g.name,
        category: "Game",
        subtitle: `${g.category} · ${g.playerMin}–${g.playerMax} players`,
        href: `/games/${g.slug}`,
      })),
    },
    {
      category: "Sport",
      label: "Sports",
      items: results.sports.map((s) => ({
        id: s.id,
        title: s.name,
        category: "Sport",
        subtitle: `${s.category} · ${s.format}`,
        href: `/sports/${s.slug}`,
      })),
    },
    {
      category: "Venue",
      label: "Venues",
      items: results.venues.map((v) => ({
        id: v.id,
        title: v.name,
        category: "Venue",
        subtitle: v.address.neighbourhood,
        href: `/venues/${v.slug}`,
      })),
    },
    {
      category: "Provider",
      label: "Hosts & organizers",
      items: results.organizations.map((o) => ({
        id: o.id,
        title: o.name,
        category: "Provider",
        subtitle: `${o.verified ? "Verified · " : ""}${o.city}`,
        href: `/providers/${o.slug}`,
      })),
    },
  ];
  return groups.filter((g) => g.items.length > 0);
}

export const SEARCH_SUGGESTIONS: SearchResultItem[] = [
  { id: "s-play", title: "Find something to play tonight", category: "Event", subtitle: "Discover sessions near you", href: "/play" },
  { id: "s-events", title: "Browse events", category: "Event", subtitle: "Tournaments, game nights, leagues", href: "/events" },
  { id: "s-games", title: "Board games catalog", category: "Game", subtitle: "Filter by group, time and mood", href: "/games" },
  { id: "s-sports", title: "Sports", category: "Sport", subtitle: "Fixtures, results and where to play", href: "/sports" },
  { id: "s-venues", title: "Venues", category: "Venue", subtitle: "Cafés, courts and turfs in Bengaluru", href: "/venues" },
];
