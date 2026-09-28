/**
 * Player account — NestJS `MeModule` (any signed-in user; the backend only ever returns the
 * caller's own rows).
 *   GET /me/bookings → BookingDetail[]
 */
// import { backendFetch } from "./http";
import { repo, type BookingDetail } from "@/lib/data/repo";

export async function listMyBookings(): Promise<BookingDetail[]> {
  // ── Real API ────────────────────────────────────────────────────────────────
  // return backendFetch<BookingDetail[]>("/me/bookings");

  // ── Dummy data (current) ────────────────────────────────────────────────────
  return repo.listMyBookings();
}
