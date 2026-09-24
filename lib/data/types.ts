export type EntityId = string;
export type ISODateTime = string;
export type CurrencyCode = "INR";

export interface Money {
  /** Monetary value in the smallest currency unit (paise for INR). */
  amount: number;
  currency: CurrencyCode;
}

export type ServiceType =
  | "open-session"
  | "private-session"
  | "event"
  | "tournament"
  | "league-season"
  | "venue-resource"
  | "coaching-guided-play"
  | "custom-event"
  | "clanb-official-service";

export type EventStatus =
  | "draft"
  | "pending-review"
  | "published"
  | "open"
  | "full"
  | "waitlist"
  | "live"
  | "completed"
  | "archived"
  | "cancelled";

export type BookingState =
  | "draft"
  | "pending"
  | "held"
  | "confirmed"
  | "cancelled"
  | "completed"
  | "no-show"
  | "refunded";

export type PaymentState =
  | "initiated"
  | "pending"
  | "paid"
  | "failed"
  | "partially-refunded"
  | "refunded";

export type OrganizationType =
  | "vendor"
  | "facilitator"
  | "venue"
  | "organizer"
  | "corporate"
  | "clanb";

export type BookingMode = "instant" | "provider-approval" | "request-quote";
export type ActivityKind = "board-game" | "sport";
export type SkillLevel = "all-levels" | "beginner" | "intermediate" | "advanced";
export type Complexity = "light" | "medium" | "heavy";

export interface User {
  id: EntityId;
  name: string;
  email: string;
  avatarUrl?: string;
  city: string;
  createdAt: ISODateTime;
}

export interface Organization {
  id: EntityId;
  slug: string;
  name: string;
  type: OrganizationType;
  description: string;
  verified: boolean;
  city: string;
  logoUrl?: string;
  ownerIds: EntityId[];
}

export interface Address {
  line1: string;
  neighbourhood: string;
  city: string;
  state: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
}

export interface Venue {
  id: EntityId;
  slug: string;
  organizationId: EntityId;
  name: string;
  description: string;
  address: Address;
  amenities: string[];
  images: string[];
  verified: boolean;
  rating?: number;
  reviewCount: number;
}

export interface Resource {
  id: EntityId;
  venueId: EntityId;
  name: string;
  kind: "table" | "court" | "room" | "turf" | "equipment";
  capacity: number;
  indoor: boolean;
  active: boolean;
}

export interface Activity {
  id: EntityId;
  slug: string;
  name: string;
  kind: ActivityKind;
  category: string;
  format: string;
  playerMin: number;
  playerMax: number;
  durationMin: number;
  skill: SkillLevel;
  complexity?: Complexity;
  moods: string[];
  indoor?: boolean;
  imageUrl?: string;
}

export interface Policy {
  id: EntityId;
  name: string;
  cancellationSummary: string;
  refundSummary: string;
  eligibilitySummary?: string;
  termsUrl?: string;
}

export interface Service {
  id: EntityId;
  slug: string;
  type: ServiceType;
  activityId?: EntityId;
  organizationId: EntityId;
  venueId?: EntityId;
  resourceIds: EntityId[];
  title: string;
  description: string;
  bookingMode: BookingMode;
  basePrice: Money;
  policyId: EntityId;
  active: boolean;
}

export interface Session {
  id: EntityId;
  slug: string;
  serviceId: EntityId;
  title: string;
  startsAt: ISODateTime;
  endsAt: ISODateTime;
  timezone: string;
  status: EventStatus;
  capacity: number;
  booked: number;
  waitlist: number;
  price: Money;
  policyId: EntityId;
  venueId?: EntityId;
  resourceId?: EntityId;
  hostId?: EntityId;
  isFeatured?: boolean;
}

export interface Event extends Session {
  summary: string;
  activityId?: EntityId;
  organizerId: EntityId;
  checkInStartsAt?: ISODateTime;
}

export type PaymentLineType = "base" | "platform-fee" | "tax" | "discount" | "total";

export interface PaymentLine {
  type: PaymentLineType;
  label: string;
  amount: Money;
}

export interface Payment {
  id: EntityId;
  bookingId: EntityId;
  state: PaymentState;
  lines: PaymentLine[];
  total: Money;
  providerReference?: string;
}

export interface Booking {
  id: EntityId;
  userId: EntityId;
  sessionId: EntityId;
  state: BookingState;
  quantity: number;
  heldUntil?: ISODateTime;
  paymentId?: EntityId;
  createdAt: ISODateTime;
  confirmationCode?: string;
}

export interface Review {
  id: EntityId;
  userId: EntityId;
  organizationId?: EntityId;
  venueId?: EntityId;
  sessionId?: EntityId;
  rating: 1 | 2 | 3 | 4 | 5;
  body: string;
  createdAt: ISODateTime;
}

export type SportsFeedKind = "live" | "upcoming" | "result" | "news";

export interface SportsFeedItem {
  id: EntityId;
  sport: string;
  /** Activity slug when the item maps to a sport in the catalog. */
  sportSlug?: string;
  kind: SportsFeedKind;
  title: string;
  detail: string;
  competition: string;
  source: string;
  updatedAt: ISODateTime;
  sessionId?: EntityId;
}

export interface Competition {
  id: EntityId;
  slug: string;
  name: string;
  sport: string;
  organizerId: EntityId;
  status: EventStatus;
}

export interface Match {
  id: EntityId;
  competitionId: EntityId;
  round: string;
  participantOne: string;
  participantTwo: string;
  startsAt: ISODateTime;
  status: "scheduled" | "live" | "completed" | "cancelled";
  resultId?: EntityId;
}

export interface Result {
  id: EntityId;
  matchId: EntityId;
  winner: string;
  score: string;
  verifiedAt?: ISODateTime;
}

export interface Follow {
  id: EntityId;
  userId: EntityId;
  targetType: "activity" | "organization" | "venue" | "competition";
  targetId: EntityId;
  createdAt: ISODateTime;
}

export interface Notification {
  id: EntityId;
  userId: EntityId;
  type: "booking" | "waitlist" | "reminder" | "follow" | "system";
  title: string;
  body: string;
  readAt?: ISODateTime;
  createdAt: ISODateTime;
}

/** Clubs are a Phase-2 (Future) FRD feature: listed now, joining ships later. */
export interface Club {
  id: EntityId;
  slug: string;
  name: string;
  kind: ActivityKind;
  /** Catalog slug of the club's main game or sport. */
  activitySlug: string;
  neighbourhood: string;
  description: string;
  members: number;
  cadence: string;
}

// ── Provider workspace (FRD §19.1) ────────────────────────────────────────────

export interface Attendee {
  name: string;
  email: string;
}

/** A booking as the provider sees it: who, for what, paid how, checked in or not. */
export interface ProviderBookingRow {
  booking: Booking;
  session: Session;
  payment?: Payment;
  attendee: Attendee;
  checkedIn: boolean;
}

export interface Announcement {
  id: EntityId;
  organizationId: EntityId;
  /** Omitted = all upcoming sessions. */
  sessionId?: EntityId;
  subject: string;
  body: string;
  audienceCount: number;
  sentAt: ISODateTime;
}

export interface OpeningHoursDay {
  /** 0 = Sunday. */
  day: number;
  open: string;
  close: string;
  closed: boolean;
}

export interface OpeningHours {
  venueId: EntityId;
  days: OpeningHoursDay[];
}

export interface Blackout {
  id: EntityId;
  venueId: EntityId;
  resourceId?: EntityId;
  startsAt: ISODateTime;
  endsAt: ISODateTime;
  reason: string;
}

export interface Payout {
  id: EntityId;
  organizationId: EntityId;
  periodStart: ISODateTime;
  periodEnd: ISODateTime;
  gross: Money;
  fees: Money;
  net: Money;
  bookings: number;
  status: "scheduled" | "processing" | "paid";
  paidAt?: ISODateTime;
}

export interface ProviderInsights {
  funnel: { views: number; bookingStarts: number; holds: number; confirmed: number };
  fillRate: { sessionId: EntityId; title: string; capacity: number; booked: number }[];
  weekly: { label: string; bookings: number; revenue: number }[];
}

/** Editable draft for the create-session wizard (VEN-03/04). */
export interface SessionDraft {
  title: string;
  summary: string;
  activityId: EntityId;
  serviceType: ServiceType;
  format: string;
  pricePaise: number;
  capacity: number;
  durationMin: number;
  rules: string;
  venueId: EntityId;
  resourceId?: EntityId;
  bookingMode: BookingMode;
  /** "YYYY-MM-DD" + "HH:MM" IST. */
  date: string;
  time: string;
  repeatWeekly: boolean;
  policyId: EntityId;
}
