/**
 * Mock provider-workspace state: deterministic seed participants per session, plus
 * provider edits (check-ins, announcements, hours, blackouts, created sessions) persisted
 * per browser. Replaced by the NestJS events/bookings/admin domains in `apiRepo`.
 */
import type {
  Announcement, Attendee, Blackout, Booking, Event, EventStatus, OpeningHoursDay, Payment, Session,
} from "../types";

const STORAGE_KEY = "clanb.mock.provider.v1";

const FIRST = ["Aarav", "Diya", "Kabir", "Ananya", "Rohan", "Isha", "Vihaan", "Meera", "Arjun", "Sara", "Nikhil", "Tara", "Dev", "Zoya", "Karthik", "Riya", "Farhan", "Leela", "Omar", "Neha"];
const LAST = ["Rao", "Iyer", "Shetty", "Menon", "Kapoor", "Nair", "Reddy", "Gowda", "Das", "Pillai", "Khan", "Joshi"];

export function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export interface SeedRow {
  booking: Booking;
  payment: Payment;
  attendee: Attendee;
  checkedInDefault: boolean;
}

/** Splits a session's booked seats into 1–3 seat bookings with stable fake attendees. */
export function seedRowsFor(
  session: Event,
  price: (session: Session, quantity: number) => Pick<Payment, "lines" | "total">
): SeedRow[] {
  const rows: SeedRow[] = [];
  let remaining = session.booked;
  let i = 0;
  const started = Date.parse(session.startsAt) <= Date.now();
  while (remaining > 0) {
    const h = hash(`${session.id}#${i}`);
    const quantity = Math.min(remaining, (h % 3) + 1);
    const first = FIRST[h % FIRST.length];
    const last = LAST[(h >> 5) % LAST.length];
    const id = `bk-seed-${session.id}-${i}`;
    // Booked 1–9 days before the session, but never in the future.
    const createdAt = new Date(
      Math.min(Date.parse(session.startsAt) - ((h % 9) + 1) * 86_400_000, Date.now() - ((h % 72) + 1) * 3_600_000)
    ).toISOString();
    rows.push({
      booking: {
        id,
        userId: `usr-seed-${h.toString(36)}`,
        sessionId: session.id,
        state: session.status === "cancelled" ? "refunded" : session.status === "completed" ? "completed" : "confirmed",
        quantity,
        paymentId: `pay-seed-${session.id}-${i}`,
        createdAt,
        confirmationCode: `CB-${h.toString(36).slice(0, 4).toUpperCase()}`,
      },
      payment: {
        id: `pay-seed-${session.id}-${i}`,
        bookingId: id,
        state: session.status === "cancelled" ? "refunded" : "paid",
        ...price(session, quantity),
      },
      attendee: { name: `${first} ${last}`, email: `${first}.${last}@example.com`.toLowerCase() },
      checkedInDefault: started && h % 5 !== 0,
    });
    remaining -= quantity;
    i += 1;
  }
  return rows;
}

export const DEFAULT_HOURS: OpeningHoursDay[] = [0, 1, 2, 3, 4, 5, 6].map((day) => ({
  day,
  open: day === 0 || day === 6 ? "08:00" : "10:00",
  close: "23:00",
  closed: false,
}));

interface ProviderState {
  checkIns: Record<string, boolean>;
  announcements: Announcement[];
  blackouts: Blackout[];
  hours: Record<string, OpeningHoursDay[]>;
  createdEvents: Event[];
  statusOverrides: Record<string, EventStatus>;
}

const EMPTY: ProviderState = {
  checkIns: {},
  announcements: [],
  blackouts: [],
  hours: {},
  createdEvents: [],
  statusOverrides: {},
};

let state: ProviderState | null = null;

export function providerState(): ProviderState {
  if (state) return state;
  state = { ...EMPTY, checkIns: {}, hours: {}, statusOverrides: {}, announcements: [], blackouts: [], createdEvents: [] };
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? (JSON.parse(raw) as Partial<ProviderState>) : null;
      if (parsed && typeof parsed === "object") {
        state = {
          checkIns: parsed.checkIns && typeof parsed.checkIns === "object" ? parsed.checkIns : {},
          announcements: Array.isArray(parsed.announcements) ? parsed.announcements : [],
          blackouts: Array.isArray(parsed.blackouts) ? parsed.blackouts : [],
          hours: parsed.hours && typeof parsed.hours === "object" ? parsed.hours : {},
          createdEvents: Array.isArray(parsed.createdEvents) ? parsed.createdEvents : [],
          statusOverrides: parsed.statusOverrides && typeof parsed.statusOverrides === "object" ? parsed.statusOverrides : {},
        };
      }
    } catch {
      // Corrupt or blocked storage: start fresh.
    }
  }
  return state;
}

export function persistProviderState() {
  if (typeof window === "undefined" || !state) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full/blocked: keep working in memory.
  }
}
