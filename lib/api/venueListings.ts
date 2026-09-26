/**
 * List Your Venue — NestJS `VenueListingsModule`
 *   POST /venue-listings   VenueListingInput → SubmissionReceipt
 *   GET  /venue-listings   → VenueListing[]   (admin only; JWT guard on the backend)
 * Approved listings become rows served by GET /venues (see lib/api/venues.ts).
 */
// import { apiFetch } from "./http";
import { logMock, mockLatency, mockReceipt } from "./mock";
import type { SubmissionReceipt, VenueListing, VenueListingInput } from "./types";

/** Dummy store: what POST /venue-listings has "saved" in this browser tab. */
const dummyListings: VenueListing[] = [];

export async function submitVenueListing(input: VenueListingInput): Promise<SubmissionReceipt> {
  // ── Real API ────────────────────────────────────────────────────────────────
  // return apiFetch<SubmissionReceipt>("/venue-listings", {
  //   method: "POST",
  //   body: JSON.stringify(input),
  // });

  // ── Dummy data (current) ────────────────────────────────────────────────────
  await mockLatency();
  const receipt = mockReceipt("VEN");
  dummyListings.unshift({ ...input, ...receipt });
  logMock("POST /venue-listings", input);
  return receipt;
}

export async function listVenueListings(): Promise<VenueListing[]> {
  // ── Real API ────────────────────────────────────────────────────────────────
  // return apiFetch<VenueListing[]>("/venue-listings", {
  //   headers: { Authorization: `Bearer ${adminToken}` },
  // });

  // ── Dummy data (current) ────────────────────────────────────────────────────
  await mockLatency(100, 250);
  return [...dummyListings];
}
