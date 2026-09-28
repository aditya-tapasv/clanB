/**
 * List Your Venue — NestJS `VenueListingsModule`
 *   POST /venue-listings   VenueListingInput → SubmissionReceipt
 * Admin review (GET /venue-listings, PATCH /venue-listings/:id) lives in lib/api/admin.ts.
 * Approved listings become rows served by GET /venues (see lib/api/venues.ts).
 */
// import { apiFetch } from "./http";
import { logMock, mockLatency, mockReceipt } from "./mock";
import { mockStore } from "./mockStore";
import type { SubmissionReceipt, VenueListingInput } from "./types";

export async function submitVenueListing(input: VenueListingInput): Promise<SubmissionReceipt> {
  // ── Real API ────────────────────────────────────────────────────────────────
  // return apiFetch<SubmissionReceipt>("/venue-listings", {
  //   method: "POST",
  //   body: JSON.stringify(input),
  // });

  // ── Dummy data (current) ────────────────────────────────────────────────────
  await mockLatency();
  const receipt = mockReceipt("VEN");
  mockStore.venueListings.unshift({ ...input, ...receipt, status: "pending" });
  logMock("POST /venue-listings", input);
  return receipt;
}
