/**
 * Deterministic formatters (no Intl/ICU), so server HTML and client hydration always match.
 * All times are shown in IST, the launch city's timezone.
 */
import type { Money } from "@/lib/data/types";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const IST_OFFSET_MS = 330 * 60_000;

function ist(iso: string): Date {
  return new Date(Date.parse(iso) + IST_OFFSET_MS);
}

/** 1234567 paise → "₹12,345.67"; whole rupees drop the decimals. */
export function formatINR(money: Money | number): string {
  const paise = typeof money === "number" ? money : money.amount;
  const negative = paise < 0;
  const abs = Math.abs(paise);
  const rupees = Math.floor(abs / 100);
  const rest = abs % 100;
  const digits = String(rupees);
  // Indian grouping: last 3 digits, then pairs.
  const head = digits.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  const grouped = head ? `${head},${digits.slice(-3)}` : digits;
  return `${negative ? "−" : ""}₹${grouped}${rest ? `.${String(rest).padStart(2, "0")}` : ""}`;
}

/** "Fri, 26 Sep" */
export function formatDate(iso: string): string {
  const d = ist(iso);
  return `${WEEKDAYS[d.getUTCDay()]}, ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
}

/** "19:30" */
export function formatTime(iso: string): string {
  const d = ist(iso);
  return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
}

/** "Fri, 26 Sep · 19:30–22:00 IST" */
export function formatSessionTime(startsAt: string, endsAt?: string): string {
  return `${formatDate(startsAt)} · ${formatTime(startsAt)}${endsAt ? `–${formatTime(endsAt)}` : ""} IST`;
}
