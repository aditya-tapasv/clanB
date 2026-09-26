/**
 * Partner With Clan B — NestJS `PartnersModule`
 *   POST /partners  PartnerEnquiryInput → SubmissionReceipt
 * The backend emails every enquiry to PARTNER_INBOX_EMAIL = aditya.gopal.pandey@gmail.com
 * (it is NOT sent from the browser, so the address can't be abused as a relay).
 */
// import { apiFetch } from "./http";
import { MAIL_ROUTING } from "./config";
import { logMock, mockLatency, mockReceipt } from "./mock";
import type { PartnerEnquiryInput, SubmissionReceipt } from "./types";

export async function submitPartnerEnquiry(input: PartnerEnquiryInput): Promise<SubmissionReceipt> {
  // ── Real API ────────────────────────────────────────────────────────────────
  // return apiFetch<SubmissionReceipt>("/partners", {
  //   method: "POST",
  //   body: JSON.stringify(input),
  // });

  // ── Dummy data (current) ────────────────────────────────────────────────────
  await mockLatency();
  logMock(`POST /partners → email ${MAIL_ROUTING.partner}`, input);
  return mockReceipt("PTR");
}
