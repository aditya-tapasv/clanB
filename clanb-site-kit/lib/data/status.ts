import type { Event, EventStatus } from "./types";

/** Lifecycle states a player can still act on (book, join the waitlist or follow live). */
export const DISCOVERABLE_STATUSES: readonly EventStatus[] = ["published", "open", "full", "waitlist", "live"];

export function isDiscoverable(event: Event): boolean {
  return DISCOVERABLE_STATUSES.includes(event.status);
}
