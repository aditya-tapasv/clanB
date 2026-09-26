/**
 * Become a Vendor — NestJS `VendorsModule`
 *   POST /vendors   VendorApplicationInput → SubmissionReceipt
 *   GET  /vendors   → VendorApplication[]   (admin only; JWT guard on the backend)
 */
// import { apiFetch } from "./http";
import { logMock, mockLatency, mockReceipt } from "./mock";
import type { SubmissionReceipt, VendorApplication, VendorApplicationInput } from "./types";

/** Dummy store: what POST /vendors has "saved" in this browser tab. */
const dummyApplications: VendorApplication[] = [];

export async function applyAsVendor(input: VendorApplicationInput): Promise<SubmissionReceipt> {
  // ── Real API ────────────────────────────────────────────────────────────────
  // return apiFetch<SubmissionReceipt>("/vendors", {
  //   method: "POST",
  //   body: JSON.stringify(input),
  // });

  // ── Dummy data (current) ────────────────────────────────────────────────────
  await mockLatency();
  const receipt = mockReceipt("VND");
  dummyApplications.unshift({ ...input, ...receipt });
  logMock("POST /vendors", input);
  return receipt;
}

export async function listVendorApplications(): Promise<VendorApplication[]> {
  // ── Real API ────────────────────────────────────────────────────────────────
  // return apiFetch<VendorApplication[]>("/vendors", {
  //   headers: { Authorization: `Bearer ${adminToken}` },
  // });

  // ── Dummy data (current) ────────────────────────────────────────────────────
  await mockLatency(100, 250);
  return [...dummyApplications];
}
