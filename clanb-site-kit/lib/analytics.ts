/**
 * Analytics tracking wrapper (FRD §23).
 * No-op implementation for public alpha / dev.
 * Provides typed interface for funnel events:
 * - search
 * - detail view
 * - booking start
 * - hold created
 * - booking confirmed
 * - waitlist joined
 */

export type FunnelEventType =
  | "search"
  | "activity_view"
  | "event_view"
  | "venue_view"
  | "booking_start"
  | "booking_hold"
  | "booking_confirm"
  | "booking_cancel"
  | "waitlist_join"
  | "filter_change"
  | "demand_request_submit";

export interface EventProperties {
  [key: string]: string | number | boolean | undefined | null;
}

export function track(event: FunnelEventType, props?: EventProperties): void {
  // In development, log cleanly to debug console if enabled
  if (process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_DEBUG_ANALYTICS === "true") {
    console.debug(`[Analytics Track] ${event}`, props ?? {});
  }
  // Vendor implementation (Mixpanel, PostHog, GA4) will plug in here when configured
}
