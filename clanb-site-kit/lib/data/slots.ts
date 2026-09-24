/**
 * Venue resource-time slots (FRD service type "venue-resource").
 * Deterministic so server-rendered pages, the slot picker and checkout always agree.
 */

export interface VenueSlot {
  /** "HH:MM" start, IST. */
  start: string;
  end: string;
  label: string;
  /** Paise. */
  price: number;
  available: boolean;
}

const SLOT_TEMPLATE: { start: string; end: string; price: number }[] = [
  { start: "07:00", end: "08:00", price: 60000 },
  { start: "08:00", end: "09:00", price: 60000 },
  { start: "09:30", end: "10:30", price: 60000 },
  { start: "11:00", end: "12:00", price: 50000 },
  { start: "14:00", end: "15:00", price: 50000 },
  { start: "16:00", end: "17:00", price: 70000 },
  { start: "17:30", end: "18:30", price: 70000 },
  { start: "19:00", end: "20:00", price: 80000 },
  { start: "20:30", end: "21:30", price: 80000 },
  { start: "22:00", end: "23:00", price: 70000 },
];

function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** `date` is an IST calendar date, "YYYY-MM-DD". */
export function getVenueSlots(venueId: string, resourceId: string, date: string): VenueSlot[] {
  return SLOT_TEMPLATE.map((s) => ({
    ...s,
    label: `${s.start} – ${s.end}`,
    available: hash(`${venueId}|${resourceId}|${date}|${s.start}`) % 4 !== 0,
  }));
}

export function findVenueSlot(venueId: string, resourceId: string, date: string, start: string): VenueSlot | undefined {
  return getVenueSlots(venueId, resourceId, date).find((s) => s.start === start);
}

/** ISO timestamp for an IST date + "HH:MM". */
export function istToIso(date: string, time: string): string {
  return new Date(`${date}T${time}:00+05:30`).toISOString();
}

/** Today's IST calendar date plus `offset` days, "YYYY-MM-DD". */
export function istDate(offset = 0, now = Date.now()): string {
  const d = new Date(now + 330 * 60_000 + offset * 86_400_000);
  return d.toISOString().slice(0, 10);
}

export const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
