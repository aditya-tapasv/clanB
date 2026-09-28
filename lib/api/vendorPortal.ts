/**
 * Vendor workspace — NestJS `VendorPortalModule` (vendor-role guard; the backend scopes every
 * query to the vendor's own organization from the token, so no org id is sent).
 *   GET   /vendor/dashboard            → ProviderDashboardData
 *   GET   /vendor/sessions             → Event[]
 *   GET   /vendor/bookings             → ProviderBookingRow[]
 *   PATCH /vendor/bookings/:id/checkin { checkedIn }
 * Dummy data comes from the typed mock repo (lib/data).
 */
// import { backendFetch } from "./http";
import { repo, type ProviderDashboardData } from "@/lib/data/repo";
import type { Event, ProviderBookingRow } from "@/lib/data/types";

async function mockOrgId(): Promise<string> {
  const [org] = await repo.listProviderOrganizations();
  return org.id;
}

export async function getVendorDashboard(): Promise<ProviderDashboardData> {
  // ── Real API ────────────────────────────────────────────────────────────────
  // return backendFetch<ProviderDashboardData>("/vendor/dashboard");

  // ── Dummy data (current) ────────────────────────────────────────────────────
  return repo.getProviderDashboard(await mockOrgId());
}

export async function listVendorSessions(): Promise<Event[]> {
  // return backendFetch<Event[]>("/vendor/sessions");
  return repo.listProviderSessions(await mockOrgId());
}

export async function listVendorBookings(): Promise<ProviderBookingRow[]> {
  // return backendFetch<ProviderBookingRow[]>("/vendor/bookings");
  return repo.listProviderBookings(await mockOrgId());
}

export async function setVendorCheckIn(bookingId: string, checkedIn: boolean): Promise<void> {
  // await backendFetch(`/vendor/bookings/${bookingId}/checkin`, { method: "PATCH", body: JSON.stringify({ checkedIn }) });
  return repo.setCheckIn(bookingId, checkedIn);
}
