/**
 * Mock booking/payment state. On the server it lives in memory; in the browser it is
 * mirrored to localStorage so checkout → confirmation → My Clan B survive reloads.
 * Replaced wholesale by the NestJS bookings/payments domains in `apiRepo`.
 */
import type { Booking, Payment, Session } from "../types";
import { BookingError } from "../errors";
import { seedBookings, seedPayments } from "./fixtures";

const STORAGE_KEY = "clanb.mock.bookings.v1";

interface PersistedState {
  bookings: Booking[];
  payments: Payment[];
  slotSessions: Session[];
}

export interface BookingStore {
  get(bookingId: string): { booking: Booking; payment: Payment };
  find(bookingId: string): { booking: Booking; payment?: Payment } | undefined;
  all(): { booking: Booking; payment?: Payment }[];
  saveBooking(booking: Booking, payment: Payment): void;
  saveSlotSession(session: Session): void;
  slotSession(id: string): Session | undefined;
  /** Seats currently held (not yet confirmed or expired) on a session. */
  heldSeats(sessionId: string): number;
  isSlotTaken(sessionId: string): boolean;
  persist(): void;
}

function load(): PersistedState {
  const seed: PersistedState = {
    bookings: seedBookings.map((b) => ({ ...b })),
    payments: seedPayments.map((p) => ({ ...p })),
    slotSessions: [],
  };
  if (typeof window === "undefined") return seed;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return seed;
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    return {
      bookings: Array.isArray(parsed.bookings) ? parsed.bookings : seed.bookings,
      payments: Array.isArray(parsed.payments) ? parsed.payments : seed.payments,
      slotSessions: Array.isArray(parsed.slotSessions) ? parsed.slotSessions : [],
    };
  } catch {
    return seed;
  }
}

let store: BookingStore | null = null;

export function bookingStore(): BookingStore {
  if (store) return store;
  const state = load();
  const isLiveHold = (b: Booking) => b.state === "held" && !!b.heldUntil && Date.parse(b.heldUntil) > Date.now();

  store = {
    get(bookingId) {
      const booking = state.bookings.find((b) => b.id === bookingId);
      const payment = booking && state.payments.find((p) => p.id === booking.paymentId);
      if (!booking || !payment) throw new BookingError("NOT_FOUND", "Booking not found.");
      return { booking, payment };
    },
    find(bookingId) {
      const booking = state.bookings.find((b) => b.id === bookingId);
      return booking && { booking, payment: state.payments.find((p) => p.id === booking.paymentId) };
    },
    all() {
      return state.bookings.map((booking) => ({
        booking,
        payment: state.payments.find((p) => p.id === booking.paymentId),
      }));
    },
    saveBooking(booking, payment) {
      state.bookings.push(booking);
      state.payments.push(payment);
      this.persist();
    },
    saveSlotSession(session) {
      if (!state.slotSessions.some((s) => s.id === session.id)) state.slotSessions.push(session);
    },
    slotSession(id) {
      return state.slotSessions.find((s) => s.id === id);
    },
    heldSeats(sessionId) {
      return state.bookings
        .filter((b) => b.sessionId === sessionId && isLiveHold(b))
        .reduce((n, b) => n + b.quantity, 0);
    },
    isSlotTaken(sessionId) {
      return state.bookings.some((b) => b.sessionId === sessionId && (b.state === "confirmed" || isLiveHold(b)));
    },
    persist() {
      if (typeof window === "undefined") return;
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        // Storage full or blocked (private mode): keep working in memory.
      }
    },
  };
  return store;
}
