# Login, roles and data security (OTP + RBAC + RLS)

## What the user sees

1. **Login / Register** (header, top-right) → `/login`.
2. Choose **Phone number** or **Email**. Register also asks for a name.
3. **Send OTP**: a 6-digit code goes to that phone or email.
4. **Verify**, then the user lands by role:

| Role | Lands on | Can open |
|---|---|---|
| `admin` (an admin email) | `/admin` | `/admin/*`, `/vendor/*`, `/account` |
| `vendor` (approved vendor) | `/vendor` | `/vendor/*`, `/account` |
| `user` (player) | `/account`, or the page they came from | `/account` and the public site |

Opening a protected page while logged out goes to `/login?next=<page>`. Opening another role's area sends you to your own home.

## How it is built (frontend: this repo)

```
Browser ──► /api/auth/otp/request ─┐
        ──► /api/auth/otp/verify  ─┼─► lib/auth/backend.ts ──► NestJS /auth/otp/* (commented; mock active)
        ◄── httpOnly cookie "clanb_session" (HS256 JWT: user + role + backend access token)
proxy.ts          reads the cookie on /login, /admin, /vendor, /account → redirects by role
/api/backend/*    forwards admin/vendor/account calls to NestJS with "Authorization: Bearer <token>"
```

| File | Job |
|---|---|
| `lib/auth/roles.ts` | Roles, landing pages, which paths each role may open, safe `next` redirect |
| `lib/auth/token.ts` | Sign/verify the session cookie (`jose`, `SESSION_SECRET`) |
| `lib/auth/backend.ts` | OTP request/verify: real NestJS calls commented, mock active |
| `app/api/auth/*` | `otp/request`, `otp/verify`, `session`, `logout` route handlers |
| `app/api/backend/[...path]` | Authenticated pass-through to NestJS; the browser never holds the token |
| `proxy.ts` | Role-based routing (Next 16 `proxy`, formerly `middleware`) |
| `components/auth/*` | `SessionProvider`, header `AccountMenu`, `OtpAuthForm` |
| `lib/api/admin.ts`, `vendorPortal.ts`, `account.ts` | Dashboard data: real calls commented, mock active |

**Mock mode (now):**
- Any OTP is `123456` (`MOCK_OTP_CODE`), and development shows it on screen.
- `admin@clanb.in` gets admin and `vendor@clanb.in` gets vendor (`ADMIN_EMAILS` / `VENDOR_IDENTIFIERS`).
- Anyone else is a player.

**Production needs `SESSION_SECRET`** (32+ random characters). Without it, login shows "Login isn't configured yet".

## Switching to the real backend

1. Build the NestJS endpoints below.
2. In `lib/auth/backend.ts`, uncomment the `post` helper, the `API_BASE_URL` import and both **Real API** lines, then delete the **Dummy data** blocks.
3. Do the same in `lib/api/admin.ts`, `vendorPortal.ts`, `account.ts` and the form services (uncomment `backendFetch` / `apiFetch`).
4. Delete `lib/api/mockStore.ts`, and remove `ADMIN_EMAILS`, `VENDOR_IDENTIFIERS` and `MOCK_OTP_CODE` from the env.

### NestJS `AuthModule` contract

| Method & path | Body | Response |
|---|---|---|
| `POST /auth/otp/request` | `{ channel: "phone"｜"email", identifier, purpose: "login"｜"register", name? }` | `{ sent: true, resendInSec: 30 }` |
| `POST /auth/otp/verify` | `{ channel, identifier, code, name? }` | `{ accessToken, user: { id, name, role, email?, phone? } }` |

- Identifiers arrive normalised: e-mails lower-cased, phones as `+91XXXXXXXXXX`.
- **Store OTPs hashed** (e.g. bcrypt/argon2) with a 5-minute expiry and a maximum of 5 attempts. Rate-limit requests per identifier and per IP (`@nestjs/throttler`).
- **Delivery:** SMS via MSG91, Twilio or AWS SNS (India needs DLT-registered templates); email via SES, Resend or SMTP.
- **Role is decided by the backend only:**
  - `admin` if the email is in `ADMIN_EMAILS` (backend env) or `users.role = 'admin'`;
  - `vendor` once an admin approves their vendor application (`PATCH /vendors/:id {status:"approved"}` sets `users.role = 'vendor'`);
  - otherwise `user`.
- `purpose: "register"` creates the user on verify; `"login"` for an unknown identifier should say "No account — register first".
- `accessToken`: a JWT with `sub` and `role`, verified by a `JwtAuthGuard`.

### Guards (RBAC in NestJS)

```ts
@Roles('admin') @UseGuards(JwtAuthGuard, RolesGuard)   // /admin/*, GET/PATCH /vendors, /partners, /venue-listings, /contact, /users
@Roles('vendor', 'admin')                               // /vendor/*
@UseGuards(JwtAuthGuard)                                // /me/*
```

### Row-level security (Postgres RLS)

The guards stop the wrong *role*, and RLS stops a vendor from reading *another vendor's* rows even if a query forgets a `WHERE`. In each request, run inside a transaction:

```sql
select set_config('app.user_id', $1, true), set_config('app.role', $2, true);
```

Then enable policies such as:

```sql
alter table sessions enable row level security;
create policy vendor_own_sessions on sessions
  using (current_setting('app.role') = 'admin'
      or organization_id in (select organization_id from org_members
                             where user_id = current_setting('app.user_id')::uuid));

alter table bookings enable row level security;
create policy own_bookings on bookings
  using (current_setting('app.role') = 'admin'
      or user_id = current_setting('app.user_id')::uuid
      or session_id in (select id from sessions));   -- vendors: bookings on their own sessions (sessions is already RLS-filtered)

alter table contact_queries enable row level security;
create policy admin_only on contact_queries using (current_setting('app.role') = 'admin');
```

Connect as a non-owner database role (table owners bypass RLS unless you use `force row level security`). If you use Supabase, the same policies can use `auth.uid()` and a `role` claim in the JWT instead of `set_config`.

### Admin endpoints used by `/admin`

`GET /admin/stats`, `GET|PATCH /vendors[/:id]`, `GET|PATCH /partners[/:id]`, `GET|PATCH /venue-listings[/:id]`, `GET|PATCH /contact[/:id]`, `GET|PATCH /users[/:id]`. The shapes are in `lib/api/types.ts` (`AdminStats`, `Admin*` records, `AdminUser`).

### Vendor and account endpoints

`GET /vendor/dashboard`, `GET /vendor/sessions`, `GET /vendor/bookings`, `PATCH /vendor/bookings/:id/checkin`, and `GET /me/bookings`. The backend scopes all of them to the caller from the token.
