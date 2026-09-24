# Swapping the mock data layer for the NestJS API

Every page and component talks to one object, `repo`, exported from `lib/data/repo.ts`. It implements the `ClanBRepo` interface. There are two implementations:

- `mockRepo`: fixtures from `lib/data/mock/fixtures.ts`, 250–600 ms simulated latency, and browser-persisted booking and provider state (`bookingStore.ts`, `providerStore.ts`).
- `apiRepo`: thin `fetch` calls to `NEXT_PUBLIC_API_BASE_URL`, grouped by the FRD §21.1 domains.

Switch with `NEXT_PUBLIC_DATA_SOURCE=api`. No component changes are needed as long as the backend returns the shapes in `lib/data/types.ts` and the `repo.ts` interfaces.

## Endpoint map

| Repo method | Method & path | Domain |
|---|---|---|
| `search(q)` | GET `/search?q=` → `SearchResults` | search |
| `searchActivities` / `listGames` / `listSports` | GET `/catalog/activities` · `/catalog/games` · `/catalog/sports` (filters as query) | catalog |
| `getGame` / `getSport` | GET `/catalog/games/:slug` · `/catalog/sports/:slug` → `ActivityDetail` | catalog |
| `listVenues` / `getVenue` | GET `/catalog/venues` · `/catalog/venues/:slug` | catalog |
| `listOrganizations` / `getOrganization` / `getProvider` | GET `/catalog/organizations[/:slug[/profile]]` | catalog |
| `listClubs` | GET `/community/clubs` | community |
| `listEvents` / `getEvent` / `getEventById` | GET `/events` · `/events/:slug` · `/events/id/:id` | events |
| `listSportsFeed(kind?, sport?)` | GET `/content/feed?kind=&sport=` | content |
| `listCompetitions` / `getCompetition` | GET `/competition/tournaments[/:slug]` | competition |
| `listVenueSlots(venue, resource, date)` | GET `/availability/venues/:id/slots?resourceId=&date=` | availability |
| `getCheckoutItem(id, slot?)` | GET `/bookings/checkout/:id[?venueId&resourceId&date&start]` | bookings |
| `holdBooking` | POST `/bookings/hold` `{sessionId? , slot?, quantity}` | bookings |
| `applyPromoCode` | POST `/payments/bookings/:id/promo` `{code}` → `Payment` | payments |
| `confirmBooking` | POST `/bookings/:id/confirm` `{paymentMethod}` | bookings/payments |
| `cancelBooking` | POST `/bookings/:id/cancel` | bookings |
| `joinWaitlist` | POST `/events/:id/waitlist` `{email}` → `{position}` | events |
| `getBooking` / `listMyBookings` | GET `/bookings/:id` · `/bookings/user` | bookings |
| `listProviderOrganizations` | GET `/admin/providers/me/organizations` | admin |
| `getProviderDashboard` / `listProviderServices` / `listProviderSessions` / `listProviderBookings` / `getProviderInsights` | GET `/admin/providers/:org/{dashboard,services,sessions,bookings,insights}` | admin |
| `setCheckIn` | PUT `/events/check-ins/:bookingId` `{checkedIn}` | events |
| `listAnnouncements` / `sendAnnouncement` | GET/POST `/community/providers/:org/announcements` | community |
| `getProviderInventory` | GET `/availability/providers/:org/inventory` | availability |
| `setOpeningHours` | PUT `/availability/venues/:id/hours` `{days}` | availability |
| `addBlackout` / `removeBlackout` | POST `/availability/venues/:id/blackouts` · DELETE `/availability/blackouts/:id` | availability |
| `listPayouts` | GET `/payments/providers/:org/payouts` | payments |
| `draftSessionWithAI` | POST `/ai/providers/:org/session-draft` `{brief}` → `SessionDraft` | ai |
| `createSession` | POST `/events` `{organizationId, draft, publish}` → `Event[]` | events |
| `updateSessionStatus` | PATCH `/events/:id/status` `{status}` | events |

## Contract details the UI relies on

1. **Booking errors.** Checkout renders states from `BookingError.code` (`lib/data/errors.ts`): `CAPACITY_REACHED` → waitlist, `HOLD_EXPIRED` → start again, `PAYMENT_FAILED` → retry while the hold is kept, and `NOT_BOOKABLE`, `NOT_FOUND`, `INVALID_PROMO`, `INVALID_INPUT`. `fetchApi` currently throws a generic `Error`. When the API lands, map error responses (for example `{ code, message }` with 409/410/402/422) to `new BookingError(code, message)` in `fetchApi`.
2. **Pricing is server truth.** `Payment.lines` must contain `base`, an optional `discount` (negative amount), `platform-fee`, `tax` and `total`, in display order. The UI prints them as they are.
3. **Holds.** `Booking.heldUntil` drives the countdown. The server must reject confirmation after it (`HOLD_EXPIRED`).
4. **Money** is in paise (`Money.amount`) and **times** are ISO UTC. The UI shows them in IST.
5. **Auth.** `lib/auth.ts` is a mock (`useSession`, `signIn`, `signOut`). Replace its internals with the real auth domain. Keep the `SessionState` shape and the rule that only checkout and `/me` require a session.
6. **Freshness.** Sports feed items need `source` and `updatedAt`. Every feed row shows them (FRD requirement).
7. **Client calls.** Checkout, My Clan B, the venue slot picker, the search palette and the whole provider workspace call `repo` from the browser. The API needs CORS for the site origin, and cookie or bearer auth on those calls.

## What to delete afterwards

`lib/data/mock/` and the `mockRepo` object, plus the demo-only affordances:
- the "Test card — always declines" method (`DECLINE_TEST_METHOD`);
- the OTP hint "any 6 digits work";
- the "Demo data" footnotes in the provider workspace.
