/**
 * Lead-capture submission layer for the "Become a Host / Partner / List Your Venue /
 * Contact Us" forms. Mirrors the mock-then-swap pattern in `lib/data/repo.ts`.
 *
 * Today: simulates latency and returns a reference, no data leaves the browser.
 * Later: set NEXT_PUBLIC_LEADS_ENDPOINT to a Google Sheets–connected webhook
 * (Apps Script, SheetMonkey, Zapier, etc.) and this function starts posting
 * real submissions there — no component changes needed.
 */

export type LeadType = "host" | "partner" | "venue" | "contact";

export interface LeadSubmission {
  type: LeadType;
  submittedAt: string;
  fields: Record<string, string>;
}

export interface LeadResult {
  reference: string;
}

const LEAD_PREFIX: Record<LeadType, string> = {
  host: "HOST",
  partner: "PTR",
  venue: "VEN",
  contact: "MSG",
};

function makeReference(type: LeadType): string {
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `CB-${LEAD_PREFIX[type]}-${rand}`;
}

function simulateLatency(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 400));
}

export async function submitLead(type: LeadType, fields: Record<string, string>): Promise<LeadResult> {
  const submission: LeadSubmission = { type, submittedAt: new Date().toISOString(), fields };
  const endpoint = process.env.NEXT_PUBLIC_LEADS_ENDPOINT;

  if (endpoint) {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submission),
    });
    if (!res.ok) throw new Error("Couldn't submit right now. Please try again in a moment.");
    return { reference: makeReference(type) };
  }

  await simulateLatency();
  if (process.env.NODE_ENV === "development") {
    // Visible in the terminal running `pnpm dev` until a real endpoint is wired up.
    console.info(`[lead:${type}]`, fields);
  }
  return { reference: makeReference(type) };
}
