/**
 * Clan B Data Repository Interface & Implementations (FRD §20, §21, §14).
 * Provides typed abstraction layer for mock data (with 250–600ms latency)
 * and future NestJS API backend.
 */
import type {
  Activity, Booking, Competition, Event, EventStatus,
  Organization, Policy, Resource, Review, Service, Session,
  SportsFeedItem, SportsFeedKind, Venue, Payment, SkillLevel, Complexity, Club,
  Announcement, Blackout, OpeningHours, OpeningHoursDay, Payout, ProviderBookingRow, ProviderInsights, SessionDraft,
} from "./types";
import {
  activities, clubs, competitions, events as initialEvents,
  organizations, policies, resources, reviews,
  services, sportsFeed, venues,
} from "./mock/fixtures";
import { bookingStore } from "./mock/bookingStore";
import { BookingError } from "./errors";
import { ISO_DATE_PATTERN, findVenueSlot, getVenueSlots, istDate, istToIso, type VenueSlot } from "./slots";
import { DEFAULT_HOURS, hash, persistProviderState, providerState, seedRowsFor } from "./mock/providerStore";

export interface ActivityFilters {
  query?: string;
  kind?: "board-game" | "sport";
  category?: string;
  skill?: SkillLevel;
  complexity?: Complexity;
  indoor?: boolean;
  mood?: string;
}

export interface EventFilters {
  query?: string;
  kind?: "board-game" | "sport";
  activitySlug?: string;
  venueSlug?: string;
  status?: EventStatus;
  featuredOnly?: boolean;
  date?: string;
  neighbourhood?: string;
}

export interface VenueFilters {
  query?: string;
  neighbourhood?: string;
  hasAmenities?: string[];
}

export interface EventDetail {
  event: Event;
  service: Service;
  activity?: Activity;
  venue?: Venue;
  organization: Organization;
  policy: Policy;
  resource?: Resource;
}

export interface VenueDetail {
  venue: Venue;
  organization: Organization;
  resources: Resource[];
  upcomingEvents: Event[];
  reviews: Review[];
}

export interface ActivityDetail {
  activity: Activity;
  events: Event[];
  venues: Venue[];
}

export interface SlotRequest {
  venueId: string;
  resourceId: string;
  /** IST calendar date, "YYYY-MM-DD". */
  date: string;
  /** Slot start, "HH:MM" IST. */
  start: string;
}

export interface HoldBookingInput {
  /** Event/session id; omit when booking a venue slot. */
  sessionId?: string;
  slot?: SlotRequest;
  quantity: number;
  userId?: string;
}

/** Everything checkout needs to render, for either an event seat or a venue slot. */
export type CheckoutItem =
  | ({ kind: "event"; session: Event } & EventDetail)
  | {
      kind: "slot";
      session: Session;
      venue: Venue;
      resource?: Resource;
      organization: Organization;
      policy: Policy;
    };

export { BookingError, isBookingError, type BookingErrorCode } from "./errors";

export const HOLD_MINUTES = 10;
/** Mock-only payment method that always declines, to exercise the failure path. */
export const DECLINE_TEST_METHOD = "test-decline";

export interface BookingDetail {
  booking: Booking;
  session: Session;
  event?: Event;
  venue?: Venue;
  payment?: Payment;
  policy?: Policy;
}

export interface ProviderDashboardData {
  organization: Organization;
  /** Upcoming sessions in the next 7 days. */
  upcoming: Event[];
  checkIns: { expected: number; done: number };
  cancellations: ProviderBookingRow[];
  actionItems: { id: string; label: string; href: string; severity: "info" | "warning" }[];
  metrics: {
    totalBookings: number;
    fillRatePercent: number;
    revenueTotalPaise: number;
    pendingPayoutsPaise: number;
  };
}

export interface ProviderProfile {
  organization: Organization;
  venues: Venue[];
  upcomingEvents: Event[];
  reviews: Review[];
  stats: {
    sessionsHosted: number;
    averageRating: number | null;
    reviewCount: number;
  };
}

export interface AnnouncementInput {
  organizationId: string;
  sessionId?: string;
  subject: string;
  body: string;
}

export interface ProviderInventory {
  venues: Venue[];
  resources: Resource[];
  hours: OpeningHours[];
  blackouts: Blackout[];
}

export interface SearchResults {
  events: Event[];
  games: Activity[];
  sports: Activity[];
  venues: Venue[];
  organizations: Organization[];
}

export interface ClanBRepo {
  // Discovery & Search
  search(query: string): Promise<SearchResults>;
  listClubs(): Promise<Club[]>;
  searchActivities(filters?: ActivityFilters): Promise<Activity[]>;
  listGames(filters?: ActivityFilters): Promise<Activity[]>;
  getGame(slug: string): Promise<ActivityDetail | null>;
  listSports(filters?: ActivityFilters): Promise<Activity[]>;
  getSport(slug: string): Promise<ActivityDetail | null>;

  // Events
  listEvents(filters?: EventFilters): Promise<Event[]>;
  getEvent(slug: string): Promise<EventDetail | null>;
  getEventById(id: string): Promise<EventDetail | null>;

  // Venues
  listVenues(filters?: VenueFilters): Promise<Venue[]>;
  getVenue(slug: string): Promise<VenueDetail | null>;

  // Sports Feed & Competitions
  listSportsFeed(kind?: SportsFeedKind, sportSlug?: string): Promise<SportsFeedItem[]>;
  listCompetitions(): Promise<Competition[]>;
  getCompetition(slug: string): Promise<Competition | null>;

  // Organizations
  listOrganizations(): Promise<Organization[]>;
  getOrganization(slug: string): Promise<Organization | null>;
  getProvider(slug: string): Promise<ProviderProfile | null>;

  // Availability, Bookings & Payments
  listVenueSlots(venueId: string, resourceId: string, date: string): Promise<VenueSlot[]>;
  getCheckoutItem(id: string, slot?: SlotRequest): Promise<CheckoutItem | null>;
  holdBooking(input: HoldBookingInput): Promise<{ booking: Booking; payment: Payment }>;
  applyPromoCode(bookingId: string, code: string): Promise<Payment>;
  confirmBooking(bookingId: string, paymentMethod?: string): Promise<{ booking: Booking; payment: Payment }>;
  cancelBooking(bookingId: string, reason?: string): Promise<{ booking: Booking; payment?: Payment }>;
  joinWaitlist(sessionId: string, email: string): Promise<{ position: number }>;
  getBooking(id: string): Promise<BookingDetail | null>;
  listMyBookings(userId?: string): Promise<BookingDetail[]>;

  // Provider workspace (FRD §19.1)
  listProviderOrganizations(): Promise<Organization[]>;
  getProviderDashboard(orgId: string): Promise<ProviderDashboardData>;
  listProviderServices(orgId: string): Promise<Service[]>;
  listProviderSessions(orgId: string): Promise<Event[]>;
  listProviderBookings(orgId: string): Promise<ProviderBookingRow[]>;
  setCheckIn(bookingId: string, checkedIn: boolean): Promise<void>;
  listAnnouncements(orgId: string): Promise<Announcement[]>;
  sendAnnouncement(input: AnnouncementInput): Promise<Announcement>;
  getProviderInventory(orgId: string): Promise<ProviderInventory>;
  setOpeningHours(venueId: string, days: OpeningHoursDay[]): Promise<OpeningHours>;
  addBlackout(input: Omit<Blackout, "id">): Promise<Blackout>;
  removeBlackout(id: string): Promise<void>;
  listPayouts(orgId: string): Promise<Payout[]>;
  getProviderInsights(orgId: string): Promise<ProviderInsights>;
  /** Mock "Draft with AI": a suggestion the provider must review (AI rule 14.1). */
  draftSessionWithAI(orgId: string, brief: string): Promise<SessionDraft>;
  createSession(orgId: string, draft: SessionDraft, publish: boolean): Promise<Event[]>;
  updateSessionStatus(sessionId: string, status: EventStatus): Promise<Event>;
}

/**
 * Latency simulator: delays response by 250–600ms to allow UI loading skeletons
 * and suspense boundaries to be realistically exercised.
 */
function simulateLatency(): Promise<void> {
  const ms = Math.floor(250 + Math.random() * 350);
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// In-memory state for mock sessions; bookings live in a store persisted per browser.
const mockEvents: Event[] = [...initialEvents];

const PROMO_CODES: Record<string, { label: string; percent: number }> = {
  FIRSTGAME: { label: "FIRSTGAME — 10% off", percent: 10 },
  CLANB20: { label: "CLANB20 — 20% off", percent: 20 },
};

function slotSessionId(venueId: string, resourceId: string, date: string, start: string): string {
  return `slot-${venueId}-${resourceId || "general"}-${date}-${start.replace(":", "")}`;
}

function buildSlotSession(req: SlotRequest): Session | null {
  if (!ISO_DATE_PATTERN.test(req.date)) return null;
  const venue = venues.find((v) => v.id === req.venueId);
  const resource = resources.find((r) => r.id === req.resourceId && r.venueId === req.venueId);
  if (!venue || (req.resourceId && !resource)) return null;
  const slot = findVenueSlot(req.venueId, req.resourceId, req.date, req.start);
  if (!slot) return null;
  const service = services.find((s) => s.type === "venue-resource" && s.venueId === venue.id);
  const id = slotSessionId(req.venueId, req.resourceId, req.date, req.start);
  return {
    id,
    slug: id,
    serviceId: service?.id ?? "srv-venue-slot",
    title: `${resource?.name ?? "Venue booking"} · ${venue.name}`,
    startsAt: istToIso(req.date, slot.start),
    endsAt: istToIso(req.date, slot.end),
    timezone: "Asia/Kolkata",
    status: slot.available ? "open" : "full",
    capacity: 1,
    booked: slot.available ? 0 : 1,
    waitlist: 0,
    price: { amount: slot.price, currency: "INR" },
    policyId: "pol-venue",
    venueId: venue.id,
    resourceId: resource?.id,
  };
}

function findSession(id: string): Session | undefined {
  return mockEvents.find((e) => e.id === id) ?? bookingStore().slotSession(id);
}

/** Itemised price (USR-06). Computed by the repo, never by the UI. */
function priceLines(
  session: Session,
  quantity: number,
  promo?: { label: string; percent: number }
): Pick<Payment, "lines" | "total"> {
  const base = session.price.amount * quantity;
  const discount = promo ? Math.round((base * promo.percent) / 100) : 0;
  const fee = Math.round((base - discount) * 0.05);
  const tax = Math.round(fee * 0.18);
  const total = base - discount + fee + tax;
  const inr = (amount: number) => ({ amount, currency: "INR" as const });
  return {
    lines: [
      { type: "base", label: `${session.title} × ${quantity}`, amount: inr(base) },
      ...(promo ? [{ type: "discount" as const, label: promo.label, amount: inr(-discount) }] : []),
      { type: "platform-fee", label: "Platform fee", amount: inr(fee) },
      { type: "tax", label: "GST on platform fee (18%)", amount: inr(tax) },
      { type: "total", label: "Total", amount: inr(total) },
    ],
    total: inr(total),
  };
}

function toDetail(booking: Booking, payment?: Payment): BookingDetail | null {
  const session = findSession(booking.sessionId);
  if (!session) return null;
  return {
    booking,
    session,
    event: mockEvents.find((e) => e.id === session.id),
    venue: venues.find((v) => v.id === session.venueId),
    payment,
    policy: policies.find((p) => p.id === session.policyId),
  };
}

/** Org sessions: fixtures + sessions created in the workspace, with status edits applied. */
function providerEvents(orgId: string): Event[] {
  const state = providerState();
  const base = mockEvents
    .filter((e) => e.organizerId === orgId)
    .map((e) => (state.statusOverrides[e.id] ? { ...e, status: state.statusOverrides[e.id] } : e));
  return [...base, ...state.createdEvents.filter((e) => e.organizerId === orgId)];
}

function providerRows(orgId: string): ProviderBookingRow[] {
  const state = providerState();
  const sessions = providerEvents(orgId);
  const byId = new Map(sessions.map((s) => [s.id, s]));
  const rows: ProviderBookingRow[] = [];
  for (const session of sessions) {
    for (const seed of seedRowsFor(session, priceLines)) {
      rows.push({
        booking: seed.booking,
        session,
        payment: seed.payment,
        attendee: seed.attendee,
        checkedIn: state.checkIns[seed.booking.id] ?? seed.checkedInDefault,
      });
    }
  }
  // Real (mock-checkout) bookings made in this browser for this org's sessions.
  for (const { booking, payment } of bookingStore().all()) {
    const session = byId.get(booking.sessionId);
    if (!session || booking.id.startsWith("bk-sample") || payment?.state === "initiated" || payment?.state === "failed") continue;
    rows.push({
      booking,
      session,
      payment,
      attendee: { name: "Clan B player", email: `${booking.userId}@players.clanb.in` },
      checkedIn: state.checkIns[booking.id] ?? false,
    });
  }
  return rows;
}

function baseAmount(payment?: Payment): number {
  if (!payment) return 0;
  return payment.lines
    .filter((l) => l.type === "base" || l.type === "discount")
    .reduce((n, l) => n + l.amount.amount, 0);
}

/** Weekly payouts: provider receives base minus discounts, less 2% payment processing (mock terms). */
function buildPayouts(orgId: string, rows: ProviderBookingRow[]): Payout[] {
  const now = Date.now();
  const week = 7 * 86_400_000;
  return Array.from({ length: 5 }, (_, i) => {
    const periodEnd = now - i * week;
    const periodStart = periodEnd - week;
    const inPeriod = rows.filter((r) => {
      const t = Date.parse(r.booking.createdAt);
      return r.payment?.state === "paid" && t > periodStart && t <= periodEnd;
    });
    const gross = inPeriod.reduce((n, r) => n + baseAmount(r.payment), 0);
    const fees = Math.round(gross * 0.02);
    const status: Payout["status"] = i === 0 ? "scheduled" : i === 1 ? "processing" : "paid";
    return {
      id: `po-${orgId}-${i}`,
      organizationId: orgId,
      periodStart: new Date(periodStart).toISOString(),
      periodEnd: new Date(periodEnd).toISOString(),
      gross: { amount: gross, currency: "INR" as const },
      fees: { amount: fees, currency: "INR" as const },
      net: { amount: gross - fees, currency: "INR" as const },
      bookings: inPeriod.length,
      status,
      paidAt: status === "paid" ? new Date(periodEnd + 2 * 86_400_000).toISOString() : undefined,
    };
  });
}

export const mockRepo: ClanBRepo = {
  async searchActivities(filters?: ActivityFilters): Promise<Activity[]> {
    await simulateLatency();
    let res = activities;
    if (filters?.kind) {
      res = res.filter((a) => a.kind === filters.kind);
    }
    if (filters?.category) {
      const cat = filters.category.toLowerCase();
      res = res.filter((a) => a.category.toLowerCase().includes(cat));
    }
    if (filters?.skill) {
      res = res.filter((a) => a.skill === filters.skill || a.skill === "all-levels");
    }
    if (filters?.complexity) {
      res = res.filter((a) => a.complexity === filters.complexity);
    }
    if (filters?.indoor !== undefined) {
      res = res.filter((a) => a.indoor === filters.indoor);
    }
    if (filters?.mood) {
      const moodLower = filters.mood.toLowerCase();
      res = res.filter((a) => a.moods.some((m) => m.toLowerCase().includes(moodLower)));
    }
    if (filters?.query) {
      const q = filters.query.toLowerCase().trim();
      res = res.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          a.moods.some((m) => m.toLowerCase().includes(q))
      );
    }
    return res;
  },

  async search(query: string): Promise<SearchResults> {
    await simulateLatency();
    const q = query.toLowerCase().trim();
    if (!q) return { events: [], games: [], sports: [], venues: [], organizations: [] };
    const has = (...fields: (string | undefined)[]) => fields.some((f) => f?.toLowerCase().includes(q));

    const matchedActivities = activities.filter((a) => has(a.name, a.category, ...a.moods));
    const matchedActivityIds = new Set(matchedActivities.map((a) => a.id));
    return {
      events: mockEvents.filter(
        (e) => has(e.title, e.summary) || (e.activityId !== undefined && matchedActivityIds.has(e.activityId))
      ),
      games: matchedActivities.filter((a) => a.kind === "board-game"),
      sports: matchedActivities.filter((a) => a.kind === "sport"),
      venues: venues.filter((v) => has(v.name, v.description, v.address.neighbourhood, ...v.amenities)),
      organizations: organizations.filter((o) => has(o.name, o.description)),
    };
  },

  async listClubs(): Promise<Club[]> {
    await simulateLatency();
    return clubs;
  },

  async listGames(filters?: ActivityFilters): Promise<Activity[]> {
    return this.searchActivities({ ...filters, kind: "board-game" });
  },

  async getGame(slug: string): Promise<ActivityDetail | null> {
    await simulateLatency();
    const activity = activities.find((a) => a.slug === slug && a.kind === "board-game");
    if (!activity) return null;
    const matchingEvents = mockEvents.filter((e) => e.activityId === activity.id);
    const venueIds = Array.from(new Set(matchingEvents.map((e) => e.venueId).filter(Boolean)));
    const matchingVenues = venues.filter((v) => venueIds.includes(v.id));
    return { activity, events: matchingEvents, venues: matchingVenues };
  },

  async listSports(filters?: ActivityFilters): Promise<Activity[]> {
    return this.searchActivities({ ...filters, kind: "sport" });
  },

  async getSport(slug: string): Promise<ActivityDetail | null> {
    await simulateLatency();
    const activity = activities.find((a) => a.slug === slug && a.kind === "sport");
    if (!activity) return null;
    const matchingEvents = mockEvents.filter((e) => e.activityId === activity.id);
    const venueIds = Array.from(new Set(matchingEvents.map((e) => e.venueId).filter(Boolean)));
    const matchingVenues = venues.filter((v) => venueIds.includes(v.id));
    return { activity, events: matchingEvents, venues: matchingVenues };
  },

  async listEvents(filters?: EventFilters): Promise<Event[]> {
    await simulateLatency();
    let res = mockEvents;
    if (filters?.featuredOnly) {
      res = res.filter((e) => e.isFeatured);
    }
    if (filters?.status) {
      res = res.filter((e) => e.status === filters.status);
    }
    if (filters?.activitySlug) {
      const act = activities.find((a) => a.slug === filters.activitySlug);
      if (act) {
        res = res.filter((e) => e.activityId === act.id);
      }
    }
    if (filters?.venueSlug) {
      const ven = venues.find((v) => v.slug === filters.venueSlug);
      if (ven) {
        res = res.filter((e) => e.venueId === ven.id);
      }
    }
    if (filters?.kind) {
      const matchingActivityIds = activities.filter((a) => a.kind === filters.kind).map((a) => a.id);
      res = res.filter((e) => e.activityId && matchingActivityIds.includes(e.activityId));
    }
    if (filters?.neighbourhood) {
      const venIds = venues
        .filter((v) => v.address.neighbourhood.toLowerCase() === filters.neighbourhood?.toLowerCase())
        .map((v) => v.id);
      res = res.filter((e) => e.venueId && venIds.includes(e.venueId));
    }
    if (filters?.query) {
      const q = filters.query.toLowerCase().trim();
      res = res.filter((e) => e.title.toLowerCase().includes(q) || e.summary.toLowerCase().includes(q));
    }
    return res;
  },

  async getEvent(slug: string): Promise<EventDetail | null> {
    await simulateLatency();
    const event = mockEvents.find((e) => e.slug === slug);
    if (!event) return null;
    const service = services.find((s) => s.id === event.serviceId) ?? services[0];
    const activity = activities.find((a) => a.id === event.activityId);
    const venue = venues.find((v) => v.id === event.venueId);
    const organization = organizations.find((o) => o.id === event.organizerId) ?? organizations[0];
    const policy = policies.find((p) => p.id === event.policyId) ?? policies[0];
    const resource = resources.find((r) => r.id === event.resourceId);
    return { event, service, activity, venue, organization, policy, resource };
  },

  async getEventById(id: string): Promise<EventDetail | null> {
    await simulateLatency();
    const event = mockEvents.find((e) => e.id === id);
    if (!event) return null;
    return this.getEvent(event.slug);
  },

  async listVenues(filters?: VenueFilters): Promise<Venue[]> {
    await simulateLatency();
    let res = venues;
    if (filters?.neighbourhood) {
      const n = filters.neighbourhood.toLowerCase();
      res = res.filter((v) => v.address.neighbourhood.toLowerCase() === n);
    }
    if (filters?.query) {
      const q = filters.query.toLowerCase().trim();
      res = res.filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          v.address.neighbourhood.toLowerCase().includes(q) ||
          v.amenities.some((a) => a.toLowerCase().includes(q))
      );
    }
    return res;
  },

  async getVenue(slug: string): Promise<VenueDetail | null> {
    await simulateLatency();
    const venue = venues.find((v) => v.slug === slug);
    if (!venue) return null;
    const organization = organizations.find((o) => o.id === venue.organizationId) ?? organizations[0];
    const matchingResources = resources.filter((r) => r.venueId === venue.id);
    const upcomingEvents = mockEvents.filter((e) => e.venueId === venue.id);
    const matchingReviews = reviews.filter((r) => r.venueId === venue.id);
    return { venue, organization, resources: matchingResources, upcomingEvents, reviews: matchingReviews };
  },

  async listSportsFeed(kind?: SportsFeedKind, sportSlug?: string): Promise<SportsFeedItem[]> {
    await simulateLatency();
    return sportsFeed.filter(
      (item) => (!kind || item.kind === kind) && (!sportSlug || item.sportSlug === sportSlug)
    );
  },

  async listCompetitions(): Promise<Competition[]> {
    await simulateLatency();
    return competitions;
  },

  async getCompetition(slug: string): Promise<Competition | null> {
    await simulateLatency();
    return competitions.find((c) => c.slug === slug) ?? null;
  },

  async listOrganizations(): Promise<Organization[]> {
    await simulateLatency();
    return organizations;
  },

  async getOrganization(slug: string): Promise<Organization | null> {
    await simulateLatency();
    return organizations.find((o) => o.slug === slug) ?? null;
  },

  async getProvider(slug: string): Promise<ProviderProfile | null> {
    await simulateLatency();
    const organization = organizations.find((o) => o.slug === slug);
    if (!organization) return null;
    const hosted = mockEvents.filter((e) => e.organizerId === organization.id);
    const orgReviews = reviews.filter((r) => r.organizationId === organization.id);
    const averageRating = orgReviews.length
      ? Math.round((orgReviews.reduce((n, r) => n + r.rating, 0) / orgReviews.length) * 10) / 10
      : null;
    return {
      organization,
      venues: venues.filter((v) => v.organizationId === organization.id),
      upcomingEvents: hosted.filter((e) => ["published", "open", "full", "waitlist", "live"].includes(e.status)),
      reviews: orgReviews,
      stats: {
        sessionsHosted: hosted.filter((e) => e.status !== "draft" && e.status !== "pending-review").length,
        averageRating,
        reviewCount: orgReviews.length,
      },
    };
  },

  async listVenueSlots(venueId: string, resourceId: string, date: string): Promise<VenueSlot[]> {
    await simulateLatency();
    const store = bookingStore();
    const now = Date.now();
    return getVenueSlots(venueId, resourceId, date).map((slot) => ({
      ...slot,
      available:
        slot.available &&
        Date.parse(istToIso(date, slot.start)) > now &&
        !store.isSlotTaken(slotSessionId(venueId, resourceId, date, slot.start)),
    }));
  },

  async getCheckoutItem(id: string, slot?: SlotRequest): Promise<CheckoutItem | null> {
    await simulateLatency();
    if (id.startsWith("slot-")) {
      const session = slot && buildSlotSession({ ...slot, venueId: id.slice("slot-".length) });
      if (!session) return null;
      const venue = venues.find((v) => v.id === session.venueId);
      if (!venue) return null;
      return {
        kind: "slot",
        session,
        venue,
        resource: resources.find((r) => r.id === session.resourceId),
        organization: organizations.find((o) => o.id === venue.organizationId) ?? organizations[0],
        policy: policies.find((p) => p.id === session.policyId) ?? policies[0],
      };
    }
    const event = mockEvents.find((e) => e.id === id);
    if (!event) return null;
    const detail = await this.getEvent(event.slug);
    return detail && { kind: "event", ...detail, session: detail.event };
  },

  async holdBooking(input: HoldBookingInput): Promise<{ booking: Booking; payment: Payment }> {
    await simulateLatency();
    const store = bookingStore();
    let session: Session;
    let quantity = input.quantity;

    if (input.slot) {
      const slotSession = buildSlotSession(input.slot);
      if (!slotSession) throw new BookingError("NOT_FOUND", "That slot doesn't exist.");
      if (Date.parse(slotSession.startsAt) <= Date.now()) {
        throw new BookingError("NOT_BOOKABLE", "This slot has already started. Pick a later time.");
      }
      if (slotSession.status === "full" || store.isSlotTaken(slotSession.id)) {
        throw new BookingError("CAPACITY_REACHED", "Someone just booked this slot.");
      }
      session = slotSession;
      quantity = 1;
      store.saveSlotSession(slotSession);
    } else {
      const event = mockEvents.find((e) => e.id === input.sessionId);
      if (!event) throw new BookingError("NOT_FOUND", "That session doesn't exist.");
      if (Date.parse(event.startsAt) <= Date.now()) {
        throw new BookingError("NOT_BOOKABLE", "This session has already started.");
      }
      if (!["published", "open", "full", "waitlist"].includes(event.status)) {
        throw new BookingError("NOT_BOOKABLE", `This session is ${event.status} and can't be booked.`);
      }
      if (quantity < 1 || quantity > 4) throw new BookingError("INVALID_INPUT", "You can book 1–4 seats at a time.");
      const seatsLeft = event.capacity - event.booked - store.heldSeats(event.id);
      if (event.status === "full" || event.status === "waitlist" || seatsLeft < quantity) {
        throw new BookingError(
          "CAPACITY_REACHED",
          seatsLeft > 0 ? `Only ${seatsLeft} seat${seatsLeft === 1 ? "" : "s"} left.` : "This session just filled up."
        );
      }
      session = event;
    }

    const now = Date.now();
    const booking: Booking = {
      id: `bk-${now.toString(36)}`,
      userId: input.userId ?? "usr-guest-current",
      sessionId: session.id,
      state: "held",
      quantity,
      heldUntil: new Date(now + HOLD_MINUTES * 60_000).toISOString(),
      paymentId: `pay-${now.toString(36)}`,
      createdAt: new Date(now).toISOString(),
      confirmationCode: `CB-${now.toString(36).slice(-4).toUpperCase()}-${(now % 9000) + 1000}`,
    };
    const payment: Payment = {
      id: `pay-${now.toString(36)}`,
      bookingId: booking.id,
      state: "initiated",
      ...priceLines(session, quantity),
    };
    store.saveBooking(booking, payment);
    return { booking, payment };
  },

  async applyPromoCode(bookingId: string, code: string): Promise<Payment> {
    await simulateLatency();
    const store = bookingStore();
    const { booking, payment } = store.get(bookingId);
    const session = findSession(booking.sessionId);
    if (!session) throw new BookingError("NOT_FOUND", "Booking not found.");
    const promo = PROMO_CODES[code.trim().toUpperCase()];
    if (!promo) throw new BookingError("INVALID_PROMO", "That code isn't valid.");
    Object.assign(payment, priceLines(session, booking.quantity, promo));
    store.persist();
    return { ...payment };
  },

  async confirmBooking(bookingId: string, paymentMethod = "upi"): Promise<{ booking: Booking; payment: Payment }> {
    await simulateLatency();
    const store = bookingStore();
    const { booking, payment } = store.get(bookingId);

    if (booking.state !== "held") throw new BookingError("NOT_BOOKABLE", `Booking is already ${booking.state}.`);
    if (booking.heldUntil && Date.parse(booking.heldUntil) < Date.now()) {
      booking.state = "cancelled";
      payment.state = "failed";
      store.persist();
      throw new BookingError("HOLD_EXPIRED", "Your hold expired and the seats were released.");
    }
    if (paymentMethod === DECLINE_TEST_METHOD) {
      payment.state = "failed";
      store.persist();
      throw new BookingError("PAYMENT_FAILED", "Your bank declined the payment. You haven't been charged.");
    }

    booking.state = "confirmed";
    payment.state = "paid";
    payment.providerReference = `sim_${paymentMethod}_${Date.now().toString(36)}`;
    const ev = mockEvents.find((e) => e.id === booking.sessionId);
    if (ev) {
      ev.booked += booking.quantity;
      if (ev.booked >= ev.capacity) ev.status = "full";
    }
    store.persist();
    return { booking: { ...booking }, payment: { ...payment } };
  },

  async cancelBooking(bookingId: string): Promise<{ booking: Booking; payment?: Payment }> {
    await simulateLatency();
    const store = bookingStore();
    const { booking, payment } = store.get(bookingId);
    if (booking.state !== "confirmed" && booking.state !== "held") {
      throw new BookingError("NOT_BOOKABLE", `Booking is already ${booking.state}.`);
    }
    const wasPaid = payment.state === "paid";
    booking.state = "cancelled";
    if (wasPaid) payment.state = "refunded";
    const ev = mockEvents.find((e) => e.id === booking.sessionId);
    if (ev && wasPaid) {
      ev.booked = Math.max(0, ev.booked - booking.quantity);
      if (ev.status === "full") ev.status = "open";
    }
    store.persist();
    return { booking: { ...booking }, payment: { ...payment } };
  },

  async joinWaitlist(sessionId: string, email: string): Promise<{ position: number }> {
    await simulateLatency();
    const event = mockEvents.find((e) => e.id === sessionId);
    if (!event) throw new BookingError("NOT_FOUND", "That session doesn't exist.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new BookingError("INVALID_INPUT", "Enter a valid email.");
    event.waitlist += 1;
    return { position: event.waitlist };
  },

  async getBooking(id: string): Promise<BookingDetail | null> {
    await simulateLatency();
    const found = bookingStore().find(id);
    return found ? toDetail(found.booking, found.payment) : null;
  },

  async listMyBookings(userId = "usr-guest-current"): Promise<BookingDetail[]> {
    await simulateLatency();
    return bookingStore()
      .all()
      // Only bookings that were paid for; abandoned or expired holds never reach My Clan B.
      .filter(
        ({ booking, payment }) =>
          booking.userId === userId &&
          !!payment &&
          ["paid", "refunded", "partially-refunded"].includes(payment.state)
      )
      .map(({ booking, payment }) => toDetail(booking, payment))
      .filter((d): d is BookingDetail => d !== null)
      .sort((a, b) => Date.parse(a.session.startsAt) - Date.parse(b.session.startsAt));
  },

  async listProviderOrganizations(): Promise<Organization[]> {
    await simulateLatency();
    return organizations;
  },

  async getProviderDashboard(orgId: string): Promise<ProviderDashboardData> {
    await simulateLatency();
    const organization = organizations.find((o) => o.id === orgId) ?? organizations[0];
    const sessions = providerEvents(organization.id);
    const rows = providerRows(organization.id);
    const now = Date.now();
    const weekAhead = now + 7 * 86_400_000;

    const upcoming = sessions
      .filter((e) => ["open", "full", "waitlist", "live", "published"].includes(e.status) && Date.parse(e.endsAt) > now)
      .sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt));
    const thisWeek = upcoming.filter((e) => Date.parse(e.startsAt) <= weekAhead);
    const checkInSessions = upcoming.filter((e) => e.status === "live" || Date.parse(e.startsAt) - now < 86_400_000);
    const checkInRows = rows.filter((r) => checkInSessions.some((s) => s.id === r.session.id) && r.booking.state === "confirmed");

    const actionItems: ProviderDashboardData["actionItems"] = [];
    for (const e of upcoming.slice(0, 12)) {
      const fill = e.capacity ? e.booked / e.capacity : 1;
      if (fill < 0.4 && Date.parse(e.startsAt) - now < 4 * 86_400_000) {
        actionItems.push({
          id: `low-${e.id}`,
          severity: "warning",
          label: `Low fill (${Math.round(fill * 100)}%) for “${e.title}” — send an announcement`,
          href: `/provider/announcements?session=${e.id}`,
        });
      }
      if (e.waitlist > 0 && (e.status === "full" || e.status === "waitlist")) {
        actionItems.push({
          id: `wl-${e.id}`,
          severity: "info",
          label: `${e.waitlist} on the waitlist for “${e.title}” — consider adding capacity`,
          href: `/provider/sessions`,
        });
      }
    }
    for (const e of sessions.filter((s) => s.status === "draft")) {
      actionItems.push({ id: `draft-${e.id}`, severity: "info", label: `Finish and publish draft “${e.title}”`, href: "/provider/sessions" });
    }
    if (!organization.verified) {
      actionItems.push({ id: "verify", severity: "warning", label: "Complete verification to go live", href: "/for-providers/apply" });
    }

    const paid = rows.filter((r) => r.payment?.state === "paid");
    const capacity = upcoming.reduce((n, e) => n + e.capacity, 0);
    const booked = upcoming.reduce((n, e) => n + e.booked, 0);
    const payouts = buildPayouts(organization.id, rows);

    return {
      organization,
      upcoming: thisWeek,
      checkIns: {
        expected: checkInRows.reduce((n, r) => n + r.booking.quantity, 0),
        done: checkInRows.filter((r) => r.checkedIn).reduce((n, r) => n + r.booking.quantity, 0),
      },
      cancellations: rows
        .filter((r) => r.booking.state === "cancelled" || r.booking.state === "refunded")
        .sort((a, b) => Date.parse(b.booking.createdAt) - Date.parse(a.booking.createdAt))
        .slice(0, 5),
      actionItems,
      metrics: {
        totalBookings: paid.length,
        fillRatePercent: capacity ? Math.round((booked / capacity) * 100) : 0,
        revenueTotalPaise: paid.reduce((n, r) => n + baseAmount(r.payment), 0),
        pendingPayoutsPaise: payouts.filter((p) => p.status !== "paid").reduce((n, p) => n + p.net.amount, 0),
      },
    };
  },

  async listProviderServices(orgId: string): Promise<Service[]> {
    await simulateLatency();
    return services.filter((s) => s.organizationId === orgId);
  },

  async listProviderSessions(orgId: string): Promise<Event[]> {
    await simulateLatency();
    return providerEvents(orgId).sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt));
  },

  async listProviderBookings(orgId: string): Promise<ProviderBookingRow[]> {
    await simulateLatency();
    return providerRows(orgId).sort((a, b) => Date.parse(b.booking.createdAt) - Date.parse(a.booking.createdAt));
  },

  async setCheckIn(bookingId: string, checkedIn: boolean): Promise<void> {
    await simulateLatency();
    providerState().checkIns[bookingId] = checkedIn;
    persistProviderState();
  },

  async listAnnouncements(orgId: string): Promise<Announcement[]> {
    await simulateLatency();
    return providerState()
      .announcements.filter((a) => a.organizationId === orgId)
      .sort((a, b) => Date.parse(b.sentAt) - Date.parse(a.sentAt));
  },

  async sendAnnouncement(input: AnnouncementInput): Promise<Announcement> {
    await simulateLatency();
    if (input.subject.trim().length < 3 || input.body.trim().length < 10) {
      throw new BookingError("INVALID_INPUT", "Add a subject and a message of at least 10 characters.");
    }
    const rows = providerRows(input.organizationId).filter(
      (r) =>
        r.booking.state === "confirmed" &&
        (input.sessionId ? r.session.id === input.sessionId : Date.parse(r.session.startsAt) > Date.now())
    );
    const announcement: Announcement = {
      id: `ann-${Date.now().toString(36)}`,
      organizationId: input.organizationId,
      sessionId: input.sessionId,
      subject: input.subject.trim(),
      body: input.body.trim(),
      audienceCount: new Set(rows.map((r) => r.attendee.email)).size,
      sentAt: new Date().toISOString(),
    };
    providerState().announcements.push(announcement);
    persistProviderState();
    return announcement;
  },

  async getProviderInventory(orgId: string): Promise<ProviderInventory> {
    await simulateLatency();
    const orgVenues = venues.filter((v) => v.organizationId === orgId);
    const state = providerState();
    return {
      venues: orgVenues,
      resources: resources.filter((r) => orgVenues.some((v) => v.id === r.venueId)),
      hours: orgVenues.map((v) => ({ venueId: v.id, days: state.hours[v.id] ?? DEFAULT_HOURS })),
      blackouts: state.blackouts
        .filter((b) => orgVenues.some((v) => v.id === b.venueId))
        .sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt)),
    };
  },

  async setOpeningHours(venueId: string, days: OpeningHoursDay[]): Promise<OpeningHours> {
    await simulateLatency();
    for (const d of days) {
      if (!d.closed && d.open >= d.close) {
        throw new BookingError("INVALID_INPUT", "Closing time must be after opening time.");
      }
    }
    providerState().hours[venueId] = days;
    persistProviderState();
    return { venueId, days };
  },

  async addBlackout(input: Omit<Blackout, "id">): Promise<Blackout> {
    await simulateLatency();
    if (Date.parse(input.endsAt) <= Date.parse(input.startsAt)) {
      throw new BookingError("INVALID_INPUT", "The end must be after the start.");
    }
    const blackout: Blackout = { ...input, id: `blk-${Date.now().toString(36)}` };
    providerState().blackouts.push(blackout);
    persistProviderState();
    return blackout;
  },

  async removeBlackout(id: string): Promise<void> {
    await simulateLatency();
    const state = providerState();
    state.blackouts = state.blackouts.filter((b) => b.id !== id);
    persistProviderState();
  },

  async listPayouts(orgId: string): Promise<Payout[]> {
    await simulateLatency();
    return buildPayouts(orgId, providerRows(orgId));
  },

  async getProviderInsights(orgId: string): Promise<ProviderInsights> {
    await simulateLatency();
    const rows = providerRows(orgId).filter((r) => r.payment?.state === "paid");
    const confirmed = rows.length;
    const h = hash(orgId);
    const now = Date.now();
    const weekly = Array.from({ length: 6 }, (_, i) => {
      const end = now - (5 - i) * 7 * 86_400_000;
      const start = end - 7 * 86_400_000;
      const inWeek = rows.filter((r) => {
        const t = Date.parse(r.booking.createdAt);
        return t > start && t <= end;
      });
      return {
        label: i === 5 ? "This wk" : `${5 - i}w ago`,
        bookings: inWeek.length,
        revenue: inWeek.reduce((n, r) => n + baseAmount(r.payment), 0),
      };
    });
    return {
      funnel: {
        views: confirmed * (8 + (h % 5)),
        bookingStarts: Math.round(confirmed * 2.3),
        holds: Math.round(confirmed * 1.4),
        confirmed,
      },
      fillRate: providerEvents(orgId)
        .filter((e) => ["open", "full", "waitlist", "live"].includes(e.status))
        .slice(0, 8)
        .map((e) => ({ sessionId: e.id, title: e.title, capacity: e.capacity, booked: e.booked })),
      weekly,
    };
  },

  async draftSessionWithAI(orgId: string, brief: string): Promise<SessionDraft> {
    await simulateLatency();
    const text = brief.toLowerCase();
    const orgEvents = providerEvents(orgId);
    const orgVenues = venues.filter((v) => v.organizationId === orgId);
    const activity =
      activities.find((a) => text.includes(a.name.toLowerCase()) || text.includes(a.slug.replace(/-/g, " "))) ??
      activities.find((a) => a.id === orgEvents[0]?.activityId) ??
      activities[0];
    const venue =
      venues.find((v) => text.includes(v.address.neighbourhood.toLowerCase())) ??
      orgVenues[0] ??
      venues.find((v) => v.id === orgEvents[0]?.venueId) ??
      venues[0];
    const capacity = Number(/(\d{1,3})\s*(players|people|seats|spots)/.exec(text)?.[1] ?? activity.playerMax * 2);
    const price = Number(/(?:₹|rs\.?\s?|inr\s?)(\d{2,5})/.exec(text)?.[1] ?? (activity.kind === "sport" ? 300 : 350));
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const dayIdx = days.findIndex((d) => text.includes(d));
    const hourMatch = /(\d{1,2})(?::(\d{2}))?\s*(am|pm)/.exec(text);
    const hour = hourMatch ? (Number(hourMatch[1]) % 12) + (hourMatch[3] === "pm" ? 12 : 0) : activity.kind === "sport" ? 7 : 19;
    const today = new Date(Date.now() + 330 * 60_000);
    const offset = dayIdx >= 0 ? ((dayIdx - today.getUTCDay() + 7) % 7 || 7) : 3;
    const beginner = /beginner|first[- ]time|newbie|learn/.test(text);
    const label = activity.kind === "sport" ? "Open Play" : "Game Night";
    return {
      title: `${beginner ? "Beginners' " : ""}${activity.name} ${label} — ${venue.address.neighbourhood}`,
      summary: `${beginner ? "A friendly, teach-first" : "A well-run"} ${activity.name} session for ${capacity} players at ${venue.name}. ${activity.kind === "sport" ? "Teams are balanced on arrival." : "A host teaches the rules and keeps tables moving."}`,
      activityId: activity.id,
      serviceType: "open-session",
      format: activity.format,
      pricePaise: Math.max(0, price) * 100,
      capacity: Math.max(2, Math.min(200, capacity)),
      durationMin: activity.durationMin + (activity.kind === "sport" ? 0 : 60),
      rules: beginner
        ? "No experience needed — rules are taught at the table. Please arrive 10 minutes early."
        : "Arrive 10 minutes before start. Late arrivals may join the next round.",
      venueId: venue.id,
      bookingMode: "instant",
      date: istDate(offset),
      time: `${String(Math.min(23, hour)).padStart(2, "0")}:00`,
      repeatWeekly: /weekly|(every|each) (week|sunday|monday|tuesday|wednesday|thursday|friday|saturday)/.test(text),
      policyId: activity.kind === "sport" ? "pol-venue" : "pol-flexible",
    };
  },

  async createSession(orgId: string, draft: SessionDraft, publish: boolean): Promise<Event[]> {
    await simulateLatency();
    if (draft.title.trim().length < 4) throw new BookingError("INVALID_INPUT", "Give the session a title.");
    if (draft.capacity < 1) throw new BookingError("INVALID_INPUT", "Capacity must be at least 1.");
    if (!ISO_DATE_PATTERN.test(draft.date) || !/^\d{2}:\d{2}$/.test(draft.time)) {
      throw new BookingError("INVALID_INPUT", "Pick a date and start time.");
    }
    const firstStart = Date.parse(istToIso(draft.date, draft.time));
    if (firstStart <= Date.now()) throw new BookingError("INVALID_INPUT", "The start time must be in the future.");
    const organization = organizations.find((o) => o.id === orgId);
    const service = services.find((s) => s.organizationId === orgId) ?? services[0];
    const occurrences = draft.repeatWeekly ? 4 : 1;
    const baseId = Date.now().toString(36);
    const status: EventStatus = !publish ? "draft" : organization?.verified ? "open" : "pending-review";

    const created: Event[] = Array.from({ length: occurrences }, (_, i) => {
      const startsAt = firstStart + i * 7 * 86_400_000;
      const id = `evt-new-${baseId}-${i}`;
      return {
        id,
        slug: `${draft.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${baseId}-${i}`,
        serviceId: service.id,
        title: draft.title.trim(),
        summary: draft.summary.trim(),
        startsAt: new Date(startsAt).toISOString(),
        endsAt: new Date(startsAt + draft.durationMin * 60_000).toISOString(),
        timezone: "Asia/Kolkata",
        status,
        capacity: draft.capacity,
        booked: 0,
        waitlist: 0,
        price: { amount: draft.pricePaise, currency: "INR" },
        policyId: draft.policyId,
        venueId: draft.venueId,
        resourceId: draft.resourceId,
        activityId: draft.activityId,
        organizerId: orgId,
      };
    });
    const state = providerState();
    state.createdEvents.push(...created);
    persistProviderState();
    return created;
  },

  async updateSessionStatus(sessionId: string, status: EventStatus): Promise<Event> {
    await simulateLatency();
    const state = providerState();
    const created = state.createdEvents.find((e) => e.id === sessionId);
    const base = created ?? mockEvents.find((e) => e.id === sessionId);
    if (!base) throw new BookingError("NOT_FOUND", "Session not found.");
    if (created) created.status = status;
    else state.statusOverrides[sessionId] = status;
    persistProviderState();
    return { ...base, status };
  },
};

/**
 * apiRepo: Real backend stub conforming to FRD §21.1 domains:
 * auth, catalog, search, availability, bookings, payments, events,
 * competition, content, community, ai, admin.
 */
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.clanb.in/v1";

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export const apiRepo: ClanBRepo = {
  search: (query) => fetchApi<SearchResults>(`/search?q=${encodeURIComponent(query)}`),
  listClubs: () => fetchApi<Club[]>("/community/clubs"),
  searchActivities: (filters) =>
    fetchApi<Activity[]>(`/catalog/activities?${new URLSearchParams(filters as Record<string, string>).toString()}`),
  listGames: (filters) =>
    fetchApi<Activity[]>(`/catalog/games?${new URLSearchParams(filters as Record<string, string>).toString()}`),
  getGame: (slug) => fetchApi<ActivityDetail>(`/catalog/games/${slug}`),
  listSports: (filters) =>
    fetchApi<Activity[]>(`/catalog/sports?${new URLSearchParams(filters as Record<string, string>).toString()}`),
  getSport: (slug) => fetchApi<ActivityDetail>(`/catalog/sports/${slug}`),
  listEvents: (filters) =>
    fetchApi<Event[]>(`/events?${new URLSearchParams(filters as Record<string, string>).toString()}`),
  getEvent: (slug) => fetchApi<EventDetail>(`/events/${slug}`),
  getEventById: (id) => fetchApi<EventDetail>(`/events/id/${id}`),
  listVenues: (filters) =>
    fetchApi<Venue[]>(`/catalog/venues?${new URLSearchParams(filters as Record<string, string>).toString()}`),
  getVenue: (slug) => fetchApi<VenueDetail>(`/catalog/venues/${slug}`),
  listSportsFeed: (kind, sportSlug) => {
    const params = new URLSearchParams();
    if (kind) params.set("kind", kind);
    if (sportSlug) params.set("sport", sportSlug);
    const qs = params.toString();
    return fetchApi<SportsFeedItem[]>(`/content/feed${qs ? `?${qs}` : ""}`);
  },
  listCompetitions: () => fetchApi<Competition[]>("/competition/tournaments"),
  getCompetition: (slug) => fetchApi<Competition>(`/competition/tournaments/${slug}`),
  listOrganizations: () => fetchApi<Organization[]>("/catalog/organizations"),
  getOrganization: (slug) => fetchApi<Organization>(`/catalog/organizations/${slug}`),
  getProvider: (slug) => fetchApi<ProviderProfile>(`/catalog/organizations/${slug}/profile`),
  listVenueSlots: (venueId, resourceId, date) =>
    fetchApi<VenueSlot[]>(
      `/availability/venues/${venueId}/slots?${new URLSearchParams({ resourceId, date }).toString()}`
    ),
  getCheckoutItem: (id, slot) =>
    fetchApi<CheckoutItem>(`/bookings/checkout/${id}${slot ? `?${new URLSearchParams({ ...slot }).toString()}` : ""}`),
  applyPromoCode: (bookingId, code) =>
    fetchApi<Payment>(`/payments/bookings/${bookingId}/promo`, { method: "POST", body: JSON.stringify({ code }) }),
  joinWaitlist: (sessionId, email) =>
    fetchApi<{ position: number }>(`/events/${sessionId}/waitlist`, { method: "POST", body: JSON.stringify({ email }) }),
  holdBooking: (input) =>
    fetchApi<{ booking: Booking; payment: Payment }>("/bookings/hold", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  confirmBooking: (bookingId, paymentMethod) =>
    fetchApi<{ booking: Booking; payment: Payment }>(`/bookings/${bookingId}/confirm`, {
      method: "POST",
      body: JSON.stringify({ paymentMethod }),
    }),
  cancelBooking: (bookingId, reason) =>
    fetchApi<{ booking: Booking; payment?: Payment }>(`/bookings/${bookingId}/cancel`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    }),
  getBooking: (id) => fetchApi<BookingDetail>(`/bookings/${id}`),
  listMyBookings: (userId) => fetchApi<BookingDetail[]>(`/bookings/user${userId ? `?userId=${userId}` : ""}`),
  listProviderOrganizations: () => fetchApi<Organization[]>("/admin/providers/me/organizations"),
  getProviderDashboard: (orgId) => fetchApi<ProviderDashboardData>(`/admin/providers/${orgId}/dashboard`),
  listProviderServices: (orgId) => fetchApi<Service[]>(`/admin/providers/${orgId}/services`),
  listProviderSessions: (orgId) => fetchApi<Event[]>(`/admin/providers/${orgId}/sessions`),
  listProviderBookings: (orgId) => fetchApi<ProviderBookingRow[]>(`/admin/providers/${orgId}/bookings`),
  setCheckIn: (bookingId, checkedIn) =>
    fetchApi<void>(`/events/check-ins/${bookingId}`, { method: "PUT", body: JSON.stringify({ checkedIn }) }),
  listAnnouncements: (orgId) => fetchApi<Announcement[]>(`/community/providers/${orgId}/announcements`),
  sendAnnouncement: (input) =>
    fetchApi<Announcement>(`/community/providers/${input.organizationId}/announcements`, {
      method: "POST",
      body: JSON.stringify(input),
    }),
  getProviderInventory: (orgId) => fetchApi<ProviderInventory>(`/availability/providers/${orgId}/inventory`),
  setOpeningHours: (venueId, days) =>
    fetchApi<OpeningHours>(`/availability/venues/${venueId}/hours`, { method: "PUT", body: JSON.stringify({ days }) }),
  addBlackout: (input) =>
    fetchApi<Blackout>(`/availability/venues/${input.venueId}/blackouts`, { method: "POST", body: JSON.stringify(input) }),
  removeBlackout: (id) => fetchApi<void>(`/availability/blackouts/${id}`, { method: "DELETE" }),
  listPayouts: (orgId) => fetchApi<Payout[]>(`/payments/providers/${orgId}/payouts`),
  getProviderInsights: (orgId) => fetchApi<ProviderInsights>(`/admin/providers/${orgId}/insights`),
  draftSessionWithAI: (orgId, brief) =>
    fetchApi<SessionDraft>(`/ai/providers/${orgId}/session-draft`, { method: "POST", body: JSON.stringify({ brief }) }),
  createSession: (orgId, draft, publish) =>
    fetchApi<Event[]>(`/events`, { method: "POST", body: JSON.stringify({ organizationId: orgId, draft, publish }) }),
  updateSessionStatus: (sessionId, status) =>
    fetchApi<Event>(`/events/${sessionId}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
};

/**
 * Active repository selected by environment variable NEXT_PUBLIC_DATA_SOURCE ("mock" | "api").
 * Defaults to mock for client prototype & offline development.
 */
const dataSource = process.env.NEXT_PUBLIC_DATA_SOURCE || "mock";
export const repo: ClanBRepo = dataSource === "api" ? apiRepo : mockRepo;
