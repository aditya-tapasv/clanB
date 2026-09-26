/**
 * API configuration for the Clan B NestJS backend.
 *
 * Every service in `lib/api/*` has its real HTTP call written out but commented, and
 * currently returns dummy data. To go live: uncomment the "Real API" block in each
 * service, delete its "Dummy data" block, and set NEXT_PUBLIC_API_BASE_URL.
 * The full endpoint contract is in docs/BACKEND_NESTJS.md.
 */

/** NestJS base URL, e.g. https://api.clanb.in/api (global prefix `api`). */
export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api").replace(/\/$/, "");

/**
 * Where submissions are routed. The backend owns the actual addresses (env vars) so the
 * browser can never choose a recipient; these are documented here for reference.
 *  - Contact Us queries        → admin inbox / admin dashboard   (ADMIN_INBOX_EMAIL)
 *  - Partner With Clan B       → aditya.gopal.pandey@gmail.com   (PARTNER_INBOX_EMAIL)
 */
export const MAIL_ROUTING = {
  contact: "admin",
  partner: "aditya.gopal.pandey@gmail.com",
} as const;
