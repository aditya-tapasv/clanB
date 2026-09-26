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
