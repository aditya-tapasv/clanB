/**
 * Become a Vendor — NestJS `VendorsModule`
 *   POST /vendors   VendorApplicationInput → SubmissionReceipt
 * Admin review (GET /vendors, PATCH /vendors/:id) lives in lib/api/admin.ts.
 */
// import { apiFetch } from "./http";
import { logMock, mockLatency, mockReceipt } from "./mock";
import { mockStore } from "./mockStore";
import type { SubmissionReceipt, VendorApplicationInput } from "./types";

export async function applyAsVendor(input: VendorApplicationInput): Promise<SubmissionReceipt> {
  // ── Real API ────────────────────────────────────────────────────────────────
  // return apiFetch<SubmissionReceipt>("/vendors", {
  //   method: "POST",
  //   body: JSON.stringify(input),
  // });

  // ── Dummy data (current) ────────────────────────────────────────────────────
  await mockLatency();
  const receipt = mockReceipt("VND");
  mockStore.vendors.unshift({ ...input, ...receipt, status: "pending" });
  logMock("POST /vendors", input);
  return receipt;
}
