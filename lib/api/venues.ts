/**
 * Venues — NestJS `VenuesModule`
 *   GET /venues?page=&pageSize=&query=&neighbourhood=   → Paginated<Venue>
 *   GET /venues/:slug                                  → Venue
 */
import type { Venue } from "@/lib/data/types";
import { venues as dummyVenues } from "@/lib/data/mock/fixtures";
// import { apiFetch, ApiError } from "./http";
import { mockLatency } from "./mock";
import type { Paginated, VenueQuery } from "./types";

export const VENUES_PAGE_SIZE = 6;

export async function getVenues({ page = 1, pageSize = VENUES_PAGE_SIZE, query = "", neighbourhood = "" }: VenueQuery = {}): Promise<
  Paginated<Venue>
> {
  // ── Real API ────────────────────────────────────────────────────────────────
  // const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  // if (query) params.set("query", query);
  // if (neighbourhood) params.set("neighbourhood", neighbourhood);
  // return apiFetch<Paginated<Venue>>(`/venues?${params.toString()}`);

  // ── Dummy data (current) ────────────────────────────────────────────────────
  await mockLatency(150, 350);
  const q = query.trim().toLowerCase();
  const n = neighbourhood.trim().toLowerCase();
  const filtered = dummyVenues.filter(
    (v) =>
      (!n || v.address.neighbourhood.toLowerCase() === n) &&
      (!q ||
        v.name.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q) ||
        v.address.neighbourhood.toLowerCase().includes(q) ||
        v.amenities.some((a) => a.toLowerCase().includes(q)))
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  return {
    items: filtered.slice((safePage - 1) * pageSize, safePage * pageSize),
    page: safePage,
    pageSize,
    total: filtered.length,
    totalPages,
  };
}

export async function getVenueBySlug(slug: string): Promise<Venue | null> {
  // ── Real API ────────────────────────────────────────────────────────────────
  // try {
  //   return await apiFetch<Venue>(`/venues/${encodeURIComponent(slug)}`);
  // } catch (err) {
  //   if (err instanceof ApiError && err.status === 404) return null;
  //   throw err;
  // }

  // ── Dummy data (current) ────────────────────────────────────────────────────
  await mockLatency(100, 250);
  return dummyVenues.find((v) => v.slug === slug) ?? null;
}
