# NestJS backend contract

The frontend's API calls live in `lib/api/`, one file per backend module. Each function contains the real `fetch` call **commented out** and currently returns **dummy data**. To switch a module on:

1. Build the matching NestJS endpoint below.
2. In the `lib/api/<module>.ts` function, uncomment the **Real API** block (and the `apiFetch` import) and delete the **Dummy data** block.
3. Set `NEXT_PUBLIC_API_BASE_URL` (e.g. `https://api.clanb.in/api`) in Vercel.

DTO shapes are in `lib/api/types.ts`; mirror them as `class-validator` DTOs.

## Endpoints

| Frontend function | Method & path | Body → Response | Notes |
|---|---|---|---|
| `getVenues()` — `lib/api/venues.ts` | `GET /venues?page=&pageSize=&query=&neighbourhood=` | → `Paginated<Venue>` | Powers the paginated `/venues` page (6 per page). `Venue` shape: `lib/data/types.ts`. |
| `getVenueBySlug()` — `lib/api/venues.ts` | `GET /venues/:slug` | → `Venue` (404 if missing) | |
| `submitContactQuery()` — `lib/api/contact.ts` | `POST /contact` | `{ name, query }` → `SubmissionReceipt` | **Goes to the admin**: store it for the admin dashboard and notify `ADMIN_INBOX_EMAIL`. |
| `submitPartnerEnquiry()` — `lib/api/partners.ts` | `POST /partners` | `PartnerEnquiryInput` → `SubmissionReceipt` | **Emailed to `PARTNER_INBOX_EMAIL=aditya.gopal.pandey@gmail.com`**. |
| `applyAsVendor()` — `lib/api/vendors.ts` | `POST /vendors` | `VendorApplicationInput` → `SubmissionReceipt` | "Become a Vendor". |
| `listVendorApplications()` — `lib/api/vendors.ts` | `GET /vendors` | → `VendorApplication[]` | Admin only (JWT guard). |
| `submitVenueListing()` — `lib/api/venueListings.ts` | `POST /venue-listings` | `VenueListingInput` → `SubmissionReceipt` | "List Your Venue". Approved listings become rows in `GET /venues`. |
| `listVenueListings()` — `lib/api/venueListings.ts` | `GET /venue-listings` | → `VenueListing[]` | Admin only (JWT guard). |

`SubmissionReceipt` = `{ id, reference, receivedAt, status: "received" }`. The frontend shows `reference` to the user. Errors should use Nest's default body `{ statusCode, message, error }`; `lib/api/http.ts` shows `message` to the user.

## Email routing

Recipients are **backend config, never sent from the browser**, so the API can't be used as an open mail relay:

```env
ADMIN_INBOX_EMAIL=<admin address>            # Contact Us queries
PARTNER_INBOX_EMAIL=aditya.gopal.pandey@gmail.com   # Partner With Clan B enquiries
```

`lib/api/config.ts` → `MAIL_ROUTING` documents the same routing on the frontend side.

## Suggested module layout

```
src/
  main.ts                 app.setGlobalPrefix("api"); enableCors({ origin: [SITE_URL] }); ValidationPipe({ whitelist: true })
  venues/                 VenuesController  GET /venues, GET /venues/:slug
  contact/                ContactController POST /contact        → ContactService saves + MailService.send(ADMIN_INBOX_EMAIL)
  partners/               PartnersController POST /partners      → MailService.send(PARTNER_INBOX_EMAIL)
  vendors/                VendorsController POST /vendors, GET /vendors (AdminGuard)
  venue-listings/         VenueListingsController POST /venue-listings, GET /venue-listings (AdminGuard)
  mail/                   MailService (e.g. @nestjs-modules/mailer + SMTP / SES / Resend)
```

Add rate limiting (`@nestjs/throttler`) on the four POST routes: they are public forms.
