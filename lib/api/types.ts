/** Request/response DTOs shared with the NestJS backend (mirror these as class-validator DTOs there). */

export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface SubmissionReceipt {
  id: string;
  /** Human-friendly reference shown to the user, e.g. CB-VND-7K2Q. */
  reference: string;
  receivedAt: string;
  status: "received";
}

/** POST /contact — routed to the admin. */
export interface ContactQueryInput {
  name: string;
  query: string;
}

/** POST /partners — emailed to the partnerships inbox. */
export interface PartnerEnquiryInput {
  businessName: string;
  contactPerson: string;
  email: string;
  phone: string;
  businessType: string;
  location: string;
  services: string[];
  message?: string;
}

/** POST /vendors — "Become a Vendor" applications. */
export interface VendorApplicationInput {
  name: string;
  email: string;
  phone: string;
  city: string;
  gameType: string;
  experience: string;
  venueAvailable: string;
  message?: string;
}

/** POST /venue-listings — "List Your Venue" submissions. */
export interface VenueListingInput {
  venueName: string;
  owner: string;
  location: string;
  capacity: number;
  facilities: string[];
  email: string;
  phone: string;
}

export type VendorApplication = VendorApplicationInput & SubmissionReceipt;
export type VenueListing = VenueListingInput & SubmissionReceipt;

export interface VenueQuery {
  page?: number;
  pageSize?: number;
  query?: string;
  neighbourhood?: string;
}

// ── Admin & portals ───────────────────────────────────────────────────────────

export type ReviewStatus = "pending" | "approved" | "rejected";
export type QueryStatus = "open" | "resolved";

/** A stored form submission as the admin sees it. */
export type AdminRecord<T, S extends string = ReviewStatus> = T & Omit<SubmissionReceipt, "status"> & { status: S };

export type AdminVendorApplication = AdminRecord<VendorApplicationInput>;
export type AdminPartnerEnquiry = AdminRecord<PartnerEnquiryInput>;
export type AdminVenueListing = AdminRecord<VenueListingInput>;
export type AdminContactQuery = AdminRecord<ContactQueryInput, QueryStatus>;

export interface AdminUser {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: "admin" | "vendor" | "user";
  joinedAt: string;
}

export interface AdminStats {
  pendingVendors: number;
  newPartnerEnquiries: number;
  pendingVenueListings: number;
  openQueries: number;
  totalUsers: number;
}
