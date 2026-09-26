/**
 * Dummy-data helpers used until the NestJS backend is live. Submissions are kept in
 * memory for the current browser tab so the GET endpoints return what was POSTed.
 */
import type { SubmissionReceipt } from "./types";

export function mockLatency(min = 300, max = 700): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, min + Math.random() * (max - min)));
}

export function mockReceipt(prefix: string): SubmissionReceipt {
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return {
    id: `${prefix.toLowerCase()}_${Date.now().toString(36)}`,
    reference: `CB-${prefix}-${rand}`,
    receivedAt: new Date().toISOString(),
    status: "received",
  };
}

/** Logs what would have been sent, in dev only. */
export function logMock(endpoint: string, payload: unknown) {
  if (process.env.NODE_ENV === "development") {
    console.info(`[mock api] ${endpoint}`, payload);
  }
}
