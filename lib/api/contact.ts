/**
 * Contact Us — NestJS `ContactModule`
 *   POST /contact  { name, query }  → SubmissionReceipt
 * General queries go to the ADMIN (stored for the admin dashboard + ADMIN_INBOX_EMAIL).
 */
// import { apiFetch } from "./http";
import { MAIL_ROUTING } from "./config";
import { logMock, mockLatency, mockReceipt } from "./mock";
import type { ContactQueryInput, SubmissionReceipt } from "./types";

export async function submitContactQuery(input: ContactQueryInput): Promise<SubmissionReceipt> {
  // ── Real API ────────────────────────────────────────────────────────────────
  // return apiFetch<SubmissionReceipt>("/contact", {
  //   method: "POST",
  //   body: JSON.stringify(input),
  // });

  // ── Dummy data (current) ────────────────────────────────────────────────────
  await mockLatency();
  logMock(`POST /contact → ${MAIL_ROUTING.contact}`, input);
  return mockReceipt("MSG");
}
