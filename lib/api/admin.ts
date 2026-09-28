/**
 * Admin dashboard — NestJS admin endpoints (all behind an admin-role guard on the backend).
 *   GET   /admin/stats                        → AdminStats
 *   GET   /vendors            PATCH /vendors/:id         { status }
 *   GET   /partners           PATCH /partners/:id        { status }
 *   GET   /venue-listings     PATCH /venue-listings/:id  { status }
 *   GET   /contact            PATCH /contact/:id         { status }
 *   GET   /users              PATCH /users/:id           { role }
 * Calls go through backendFetch (/api/backend/* → NestJS with the admin's token).
 */
// import { backendFetch } from "./http";
import { mockLatency } from "./mock";
import { mockStore } from "./mockStore";
import type {
  AdminContactQuery,
  AdminPartnerEnquiry,
  AdminStats,
  AdminUser,
  AdminVendorApplication,
  AdminVenueListing,
  QueryStatus,
  ReviewStatus,
} from "./types";

export async function getAdminStats(): Promise<AdminStats> {
  // ── Real API ────────────────────────────────────────────────────────────────
  // return backendFetch<AdminStats>("/admin/stats");

  // ── Dummy data (current) ────────────────────────────────────────────────────
  await mockLatency(100, 250);
  return {
    pendingVendors: mockStore.vendors.filter((r) => r.status === "pending").length,
    newPartnerEnquiries: mockStore.partners.filter((r) => r.status === "pending").length,
    pendingVenueListings: mockStore.venueListings.filter((r) => r.status === "pending").length,
    openQueries: mockStore.queries.filter((r) => r.status === "open").length,
    totalUsers: mockStore.users.length,
  };
}

export async function listVendorApplications(): Promise<AdminVendorApplication[]> {
  // return backendFetch<AdminVendorApplication[]>("/vendors");
  await mockLatency(100, 250);
  return [...mockStore.vendors];
}

export async function setVendorStatus(id: string, status: ReviewStatus): Promise<void> {
  // await backendFetch(`/vendors/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
  await mockLatency(100, 250);
  update(mockStore.vendors, id, { status });
}

export async function listPartnerEnquiries(): Promise<AdminPartnerEnquiry[]> {
  // return backendFetch<AdminPartnerEnquiry[]>("/partners");
  await mockLatency(100, 250);
  return [...mockStore.partners];
}

export async function setPartnerStatus(id: string, status: ReviewStatus): Promise<void> {
  // await backendFetch(`/partners/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
  await mockLatency(100, 250);
  update(mockStore.partners, id, { status });
}

export async function listVenueListings(): Promise<AdminVenueListing[]> {
  // return backendFetch<AdminVenueListing[]>("/venue-listings");
  await mockLatency(100, 250);
  return [...mockStore.venueListings];
}

export async function setVenueListingStatus(id: string, status: ReviewStatus): Promise<void> {
  // await backendFetch(`/venue-listings/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
  await mockLatency(100, 250);
  update(mockStore.venueListings, id, { status });
}

export async function listContactQueries(): Promise<AdminContactQuery[]> {
  // return backendFetch<AdminContactQuery[]>("/contact");
  await mockLatency(100, 250);
  return [...mockStore.queries];
}

export async function setQueryStatus(id: string, status: QueryStatus): Promise<void> {
  // await backendFetch(`/contact/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
  await mockLatency(100, 250);
  update(mockStore.queries, id, { status });
}

export async function listUsers(): Promise<AdminUser[]> {
  // return backendFetch<AdminUser[]>("/users");
  await mockLatency(100, 250);
  return [...mockStore.users];
}

export async function setUserRole(id: string, role: AdminUser["role"]): Promise<void> {
  // await backendFetch(`/users/${id}`, { method: "PATCH", body: JSON.stringify({ role }) });
  await mockLatency(100, 250);
  update(mockStore.users, id, { role });
}

function update<T extends { id: string }>(rows: T[], id: string, patch: Partial<T>) {
  const i = rows.findIndex((r) => r.id === id);
  if (i >= 0) rows[i] = { ...rows[i], ...patch };
}
