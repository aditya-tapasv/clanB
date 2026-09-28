# CLAN B — MASTER SPECIFICATION (as built, 28 Sep 2026)

> **Purpose of this document.** This is the complete, exact description of the Clan B website *as it exists today*. It doubles as a product requirements document (PRD) and functional requirements document (FRD). Hand it to any developer or AI as the master prompt to **replicate the site exactly**.
>
> **Rule zero — change nothing.** Every value here (colours, fonts, copy, spacing classes, animation timings, easing, order of sections, routes, validation messages) is intentional. Do not "improve", rename, reorder, restyle, add sections, or swap libraries. If something here looks odd, it is still the spec: reproduce it as written. Section 17 lists the known quirks you must keep.
>
> **Source of truth.** The live code is in the GitHub repo **https://github.com/aditya-tapasv/clanB** (branch `main`, latest commit). It is deployed at **https://clan-b.vercel.app**. If you can access the repo, clone it: that is the exact site. This document is the full written description, for when you must rebuild or verify without the repo.

---

## Table of contents

1. What Clan B is
2. What the website does today (scope)
3. Tech stack and exact versions
4. Project structure
5. Brand: logo, colours, typography, global CSS
6. Global layout: root layout, header, search palette, footer, interior page template
7. Motion system (exact parameters)
8. Homepage — exact order, exact copy, exact styling
9. Services section — hub + 3 forms
10. Contact Us page (Name + Query + popup)
11. Venues directory (paginated) and venue detail
12. Other pages still in the app (not in the header)
13. Redirects
14. Data layer and NestJS-ready API layer
15. SEO, accessibility, performance, error handling
16. Functional requirements (FRD) with acceptance criteria
17. Known as-built quirks (keep them)
18. Build, run, test and deploy

---

## 1. What Clan B is

**Clan B** (company: **CLANB TECH SOLUTIONS PRIVATE LIMITED**, offices in **Bengaluru** (registered) and **Chennai**) is a **game-tech platform** for **board games and sports**.

- **Product sentence:** *Clan B is technology for playing, hosting and running games and sports — making it easier to join and easier to operate.*
- **Brand tagline:** *The future of games.*
- **Founder framing:** "gamify tech": technology that makes play easy, plus a home for vendors to host.
- **Who it serves:**
  - **Players** find venues and sessions (board-game cafés, badminton courts, futsal turfs, chess rooms) and book with confidence.
  - **Vendors / facilitators** run game nights, coaching and open sessions.
  - **Partners** (vendors, organizers, corporates, sports clubs/academies) bring their business onto Clan B.
  - **Venue owners** list their tables, courts and rooms as bookable space.
  - **Organizers** run tournaments and leagues.
- **Launch city:** Bengaluru (neighbourhoods used across the site: Koramangala, Indiranagar, HSR Layout, Jayanagar, Whitefield, JP Nagar).

The website is a **cinematic, dark, lime-accented marketing and lead-capture site**. The homepage sells the idea, **Venues** lets players browse spaces, and **Services** collects applications and enquiries from vendors, partners and venue owners. **Contact Us** sends general queries to the admin.

---

## 2. What the website does today (scope)

### In scope (live)
1. **Homepage:** cinematic 3D hero, intro, games marquee, mission statement, a 4-card **Services** stack, a **Trust** section, and a large footer with a final call-to-action.
2. **Venues:** a searchable, filterable, **paginated (6 per page)** directory of 12 verified Bengaluru venues, plus a detail page per venue with a slot picker.
3. **Services:** a hub page plus three forms:
   - **Become a Vendor**
   - **Partner with Clan B** (enquiries go to **aditya.gopal.pandey@gmail.com**)
   - **List Your Venue**
4. **Contact Us:** **Name + Query** only. Submit shows a confirmation **popup**, and the query is routed to the **admin**.
5. **NestJS-ready API layer:** every backend call is written but **commented out**; the site runs on **dummy data**.

### Explicitly out of scope / removed (must stay removed)
- **No passwords, saves or follows.** Login is OTP-only (section 6.6). `/signup` and `/register` redirect to `/login?mode=register`, and `/me` redirects to `/account`.
- **No provider dashboard** (`/provider`) and **no provider profile pages** (`/providers/*`).
- **Header shows only "Venues" and "Services"** (no Play, Events, Sports, Games).
- The homepage **does not** contain the Play runway, Sports pulse, Games mood, Intelligence or Community sections.

---

## 3. Tech stack and exact versions

| Area | Choice |
|---|---|
| Framework | **Next.js 16.3.6** (App Router, Turbopack), **React 19.2.8**, **TypeScript 5** (strict) |
| Styling | **Tailwind CSS v4** (`@tailwindcss/postcss`), tokens in `@theme` inside `app/globals.css`, `clsx` + `tailwind-merge` via `cn()` |
| Animation | **GSAP 3.15** + `@gsap/react` 2.1 (`useGSAP`), **ScrollTrigger**, **Lenis 1.3.26** (smooth scroll) |
| 3D | **three 0.186** + **@react-three/fiber 9.8** (hero canvas only) |
| Icons | **lucide-react** |
| Forms | **react-hook-form 7.88** (built-in rules, no resolver) |
| Other | `date-fns`, `zod` (installed), `qrcode.react` (booking QR) |
| Tests | **Playwright 1.63** (+ `@axe-core/playwright`) using installed **Chrome/Edge** channels |
| Package manager | **pnpm 11.5.2** (pinned in `packageManager`) |
| Hosting | **Vercel**; `vercel.json` forces framework `nextjs`, install `pnpm install`, build `pnpm build`, output `.next` |

Scripts: `dev` → `next dev`, `build` → `next build`, `start` → `next start`, `lint` → `eslint`, `typecheck` → `tsc --noEmit`, `test:e2e` → `playwright test`.

---

## 4. Project structure (repository root = the app)

```
app/
  layout.tsx, globals.css, fonts.ts, fonts/*.woff2 (self-hosted fonts)
  page.tsx                       Homepage
  venues/page.tsx, venues/[slug]/page.tsx
  services/page.tsx              Services hub
  services/vendor/page.tsx       Become a Vendor
  services/partner/page.tsx      Partner with Clan B (?type= preselect)
  services/list-venue/page.tsx   List Your Venue
  contact/page.tsx               Contact Us
  (secondary, not in header) play/, play/request, events/, events/[slug], sports/, sports/[sport],
  games/, games/[slug], clubs/, about/, help/, help/[topic], legal/[doc], search/, checkout/[id], lab/
  not-found.tsx, error.tsx, global-error.tsx, sitemap.ts, robots.ts, opengraph-image.tsx
components/
  motion/    SmoothScrollProvider, CinematicPage, CinematicSection, RevealHeadline, KineticText, Marquee
  hero/      ArenaHero, ArenaCanvas, makeArenaTexture, useLiquidLens, WebGLGuard
  home/      IntroSection, GamesMarqueeSection, MissionSection, HostStack (= Services stack), Trust
  layout/    SiteHeader, SiteFooter
  auth/      SessionProvider, AccountMenu, OtpAuthForm
  dashboard/ DashboardShell, ui   ·   admin/ AdminOverview, SubmissionQueue, UsersTable   ·   vendor/ VendorViews   ·   account/ AccountView
  interior/  PageHero, InteriorPageLayout, StepGrid, FaqList
  leads/     BecomeVendorForm, PartnerForm, ListVenueForm, ContactForm, LeadSuccess, CheckboxGroup, validators
  discovery/ VenueCard, VenuesListingView, VenueSlotPicker, EventCard, … (secondary pages)
  checkout/  CheckoutFlow, HoldTimer, PriceBreakdown, BookingQr, WaitlistForm (guest booking)
  ui/        Button, Pill, Badge, Card, Chip, Dialog, Sheet, Input, Select, Tabs, Skeleton, EmptyState, Logo, Panel
content/     home.ts, leadForms.ts, help.ts, legal.ts, about.ts, clubs.ts, games.ts, sports.ts (all copy lives here)
lib/
  api/       config, http, types, mock, venues, contact, partners, vendors, venueListings  (NestJS layer)
  data/      types.ts, repo.ts, mock/fixtures.ts, mock/bookingStore.ts, slots.ts, errors.ts, games.ts, status.ts
  motion.ts, format.ts, seo.ts, search.ts, analytics.ts, cn.ts, useFocusTrap.ts
public/brand/clanb-logo.svg, clanb-logo-currentcolor.svg
docs/BACKEND_NESTJS.md, docs/API_SWAP.md, docs/CLANB_MASTER_SPEC.md (this file)
e2e/*.spec.ts, playwright.config.ts, next.config.ts, vercel.json
```

---

## 5. Brand

### 5.1 Logo
- **Files:** `public/brand/clanb-logo.svg` (white + lime) and `public/brand/clanb-logo-currentcolor.svg` (white parts use `currentColor`).
- **Artwork:** the wordmark **"CLAN" in white (#FFFFFF)** plus a lowercase **"b" in lime (#5CF111)**. It is built from pixel-style square tiles with small rounded corners, and there is a small lime square inside the "A". The `viewBox` is **`378 372 956 286`** (aspect ratio 956 : 286 ≈ 3.34).
- **Seamless ("clean, not pixelated") rendering — required.** Every **filled** tile `<path>` carries a hairline stroke in its own fill colour:
  `stroke="<same colour as fill>" stroke-width="0.75" vector-effect="non-scaling-stroke" stroke-linejoin="round"`.
  This closes the anti-aliasing seams between tiles at every size. Stroke-only paths (`fill="none"`) are unchanged. The one tile that already had a stroke keeps `stroke-width="0.75" vector-effect="non-scaling-stroke"`.
- **`<Logo height={n} />` component:** a `next/image` of `/brand/clanb-logo.svg` with width = `Math.round(height * 956/286)`, `style={{ height: n px, width: "auto" }}`, wrapped in `<Link href="/" aria-label="Clan B Home">` with `hover:opacity-90` and the focus ring. **Header height 24, footer height 36.**
- **Favicon / apple icon / shortcut:** `/brand/clanb-logo.svg`.

### 5.2 Colour tokens (Tailwind v4 `@theme`, exact)

| Token | Hex | Use |
|---|---|---|
| `--color-ink` | `#030706` | Page background (near-black green) |
| `--color-ink-soft` | `#071210` | Alternate section background |
| `--color-panel` | `#050a09` | Cards/panels/forms |
| `--color-mist` | `#A8A29E` | Muted body text |
| `--color-signal` | `#5CF111` | **Clan B lime**: primary accent, buttons, eyebrows |
| `--color-signal-alt` | `#10B981` | Emerald secondary |
| `--color-glow` | `#06B6D4` | Cyan (used by the hero primary button's hover and a few secondary UI accents; **not** in the hero canvas) |

Other colours used literally: white `#FFFFFF` text; zinc greys (`zinc-300/400/500/600/800/950`); amber `#D97706` / `amber-600` (hero tagline, tournament accent); the **hero canvas uses only lime + white** (section 7.9). Text selection is `color-mix(in oklab, #5CF111 35%, transparent)` with white text. Viewport `themeColor` is `#030706`, `colorScheme` is `dark`, and `<html>` has class `dark`.

### 5.3 Typography (exact)
Fonts are **self-hosted** latin variable woff2 files loaded with `next/font/local` (`app/fonts.ts`), each with `display: "swap"`:

| Role | Family | File | Weight range | CSS variable |
|---|---|---|---|---|
| Display / headings | **Syne** | `app/fonts/syne-latin.woff2` | 400–800 | `--font-display` |
| Body | **DM Sans** | `app/fonts/dm-sans-latin.woff2` | 100–1000 | `--font-body` |
| Mono / labels | **JetBrains Mono** | `app/fonts/jetbrains-mono-latin.woff2` | 100–800 | `--font-mono` |

`@theme` fallbacks: `--font-display: var(--font-display), "Syne", ui-sans-serif, system-ui, sans-serif;`, `--font-body: … "DM Sans" …`, `--font-mono: … "JetBrains Mono", ui-monospace, monospace;`. `<body>` uses the body font, `antialiased`, with `-webkit-font-smoothing: antialiased`.

**Type patterns used everywhere:**
- **Eyebrow:** `text-xs uppercase tracking-[0.28em] text-signal font-medium` (on interior pages `font-mono`).
- **Section headline:** `font-display font-semibold tracking-tight`, rendered by `RevealHeadline` with a **white→zinc-400 vertical gradient text** (`bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent`).
- **Body:** `text-sm md:text-base leading-relaxed text-mist`.
- **Micro labels:** `font-mono text-[10px]–text-xs uppercase tracking-wider text-zinc-500`.

### 5.4 Global CSS (`app/globals.css`, verbatim)
```css
@import "tailwindcss";

@theme {
  --font-display: var(--font-display), "Syne", ui-sans-serif, system-ui, sans-serif;
  --font-body: var(--font-body), "DM Sans", ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-mono), "JetBrains Mono", ui-monospace, monospace;
  --color-ink: #030706;
  --color-ink-soft: #071210;
  --color-panel: #050a09;
  --color-mist: #A8A29E;
  --color-signal: #5CF111;
  --color-signal-alt: #10B981;
  --color-glow: #06B6D4;
}

html { scroll-behavior: auto; overflow-x: clip; }
html.lenis, html.lenis body { height: auto; }
body { background: var(--color-ink); color: #fff; font-family: var(--font-body); -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; overflow-x: clip; }
::selection { background: color-mix(in oklab, var(--color-signal) 35%, transparent); color: #fff; }

.page-shell { width: 100%; max-width: 1440px; margin-inline: auto; }
.page-x { padding-inline: max(.75rem, env(safe-area-inset-left)) max(.75rem, env(safe-area-inset-right)); }
@media (min-width: 640px)  { .page-x { padding-inline: max(1rem, env(safe-area-inset-left)) max(1rem, env(safe-area-inset-right)); } }
@media (min-width: 1024px) { .page-x { padding-inline: max(1.25rem, env(safe-area-inset-left)) max(1.25rem, env(safe-area-inset-right)); } }

.text-gradient-headline { color: transparent; background-image: linear-gradient(#fff, #a1a1aa); -webkit-background-clip: text; background-clip: text; }
.grid-bg { background-image: linear-gradient(#ffffff0a 1px, transparent 0), linear-gradient(90deg, #ffffff0a 1px, transparent 0); background-size: 48px 48px; }
.noise-overlay::before { content:""; pointer-events:none; position:absolute; inset:0; opacity:.035; background-image:url("data:image/svg+xml,…fractalNoise baseFrequency='0.85' numOctaves='4'…"); }
.section-seam-fade { mask-image: linear-gradient(transparent, #000 12% 88%, transparent); }

@keyframes marquee-x { from { transform: translateX(0) } to { transform: translateX(-50%) } }
.marquee-track { animation: marquee-x 42s linear infinite; }
.marquee-track-slow { animation-duration: 55s; }

.hero-veil-blend { background: linear-gradient(#030706 0 38%, #030706eb 52%, #0307068c 68%, transparent 86%); }
@media (min-width: 768px) { .hero-veil-blend { background: linear-gradient(118deg, #030706 0 28%, #030706eb 42%, #03070666 56%, transparent 72%); } }

@media (prefers-reduced-motion: reduce) { .marquee-track, .marquee-track-slow { animation: none; } }
```

### 5.5 Buttons (`components/ui/Button.tsx`, exact variants)
All buttons are `group cursor-pointer select-none` plus their variant. `withArrow` appends a lucide **ArrowUpRight** `h-4 w-4` that moves `-translate-y-0.5 translate-x-0.5` on hover (`duration-300`). Every variant has the focus ring `focus-visible:outline-2 focus-visible:outline-signal focus-visible:outline-offset-2`.

| Variant | Classes |
|---|---|
| `primary` | `inline-flex items-center justify-center gap-2 rounded-full bg-signal px-6 py-3 text-sm font-semibold text-ink transition hover:bg-white` |
| `hero-primary` | same shape, `px-6 py-3.5`, `hover:bg-glow` (cyan on hover) |
| `ghost` | `rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white transition duration-300 hover:border-white/30 hover:bg-white/10` |
| `hero-ghost` | `rounded-full border border-zinc-700/80 bg-[#030706]/40 px-6 py-3.5 text-sm text-zinc-200 backdrop-blur-sm transition duration-300 hover:border-signal/50 hover:text-white` |
| `signal-ghost` | `rounded-full border border-signal/40 bg-signal/10 px-5 py-3 text-sm font-medium text-signal transition duration-300 hover:bg-signal/20` |

With an `href`, a Button renders a Next `<Link>`; without one it renders a `<button>`.

**Pill:** `inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-mist`, with an optional `h-1.5 w-1.5` accent dot.

**Inputs** (`Input`/`Select`): `rounded-xl border border-white/15 px-4 py-2.5 text-sm text-white`, focus `border-signal/70 ring-1 ring-signal/70`. Input background is `bg-white/5`; Select is `bg-ink-soft` with a ChevronDown icon. On error they get `border-rose-500/70` plus a `role="alert"` message `mt-1 text-xs text-rose-400` with id `<id>-error`, wired via `aria-invalid` / `aria-describedby`. **Textareas** use `bg-ink-soft`, the same border and focus, and `placeholder:text-zinc-500`.

---

## 6. Global layout

### 6.1 Root layout (`app/layout.tsx`)
- `<html lang="en" class="{syne var} {dm-sans var} {jetbrains var} dark" suppressHydrationWarning>`.
- `<body class="min-h-screen bg-ink text-white antialiased selection:bg-signal/35 selection:text-white">`.
- The **skip link** comes first: "Skip to main content" → `#main`, styled `sr-only fixed left-4 top-4 z-[60] rounded-full bg-signal px-4 py-2 text-sm font-semibold text-ink focus:not-sr-only`.
- **JSON-LD** (Organization + WebSite with SearchAction to `/search?q=`) is injected at the end of body.
- Metadata: title "Clan B — Technology for Playing, Hosting and Running Games & Sports"; description "The future of games. Board games and sports platform for players, venues, facilitators, and organizers."; `metadataBase` from `NEXT_PUBLIC_SITE_URL` (default `https://clanb.in`); OpenGraph siteName "Clan B", locale `en_IN`.

### 6.2 Header (`SiteHeader`, used on every public page)
- `<header>`: `fixed inset-x-0 top-0 z-50 transition-colors duration-300`.
  - **On the homepage, before the page is scrolled more than 24px (and with the mobile menu closed), it is transparent** (`bg-transparent`).
  - Otherwise it is `border-b border-white/10 bg-ink/80 backdrop-blur-xl`.
- The inner row is `page-shell page-x flex h-[72px] items-center justify-between`.
- **Left:** `Logo height={24}`, then (≥`lg`) `<nav aria-label="Primary">` with `gap-6`:
  1. **Venues** → `/venues` (`text-sm font-medium`; active: `text-white font-semibold`, else `text-white/70`).
  2. **Services ▾**: a hover-to-open dropdown (`onMouseEnter`/`onMouseLeave`).
     - Trigger: "Services" + ChevronDown `h-3.5 w-3.5` that rotates 180° when open. It shows as active on `/services*` and `/contact`.
     - Panel: `absolute left-1/2 top-full w-[360px] -translate-x-1/2 pt-4 transition duration-200`. Closed: `opacity-0 -translate-y-1 pointer-events-none`; open: `opacity-100 translate-y-0`.
     - Inner card: `rounded-2xl border border-white/10 bg-ink-soft/95 p-3 shadow-2xl backdrop-blur-xl`.
     - **Items, in this order** (each a row with a `h-7 w-7` bordered icon tile in lime, the title `text-sm font-medium`, and the description `text-xs text-mist`):
       1. **Become a Vendor**: "Run sessions & coaching" → `/services/vendor` (icon Dices)
       2. **Partner with Clan B**: "Vendors, organizers & corporates" → `/services/partner` (icon Handshake)
       3. **List Your Venue**: "Monetize tables, courts & rooms" → `/services/list-venue` (icon Building2)
       4. **Contact Us**: "General questions & enquiries" → `/contact` (icon Mail)
- **Right (≥`lg`):**
  - **AccountMenu** (this replaced the old search pill):
    - While loading: a `h-[34px] w-[150px]` pulsing placeholder pill.
    - Signed out: a link **"Login / Register"** → `/login` (`rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium`, lime LogIn icon).
    - Signed in: a pill with a lime initials avatar (`h-7 w-7`) + name + chevron. Its menu (`w-60 rounded-2xl bg-ink-soft/95`) shows the name, email/phone and a role badge, then "Admin dashboard" or "Vendor workspace" (for those roles), **My account**, and **Log out**.
  - **Explore Venues**: primary Button `withArrow`, `px-4 py-2 text-xs`, → `/venues`.
- **Mobile (<`lg`):** round `h-10 w-10` account and burger buttons. The account button (lime LogIn icon, or initials when signed in) → `/login`, or to the role home when signed in; the burger has `aria-label` "Open menu"/"Close menu". The drawer is `max-h-[calc(100dvh-72px)] overflow-y-auto border-t border-white/10 bg-ink/95 page-x py-6 backdrop-blur-xl`, and body scroll is locked while it's open. `<nav aria-label="Mobile">` contains:
  1. **Venues** (with ArrowUpRight)
  2. A **Services** accordion with the same 4 items
  3. **About Clan B** → `/about`
  4. **Help & Support** → `/help`
  5. A divider, then **Login / Register** (ghost), or **My account / Dashboard + Log out** when signed in, followed by a full-width **Explore Venues** primary button.
- **Tagline under the logo (homepage only):** "The future of **games.**" (`mt-1 pl-0.5 text-[10px] italic leading-none tracking-[0.08em] text-mist`, with "games." in lime).
- There is no search in the header. The `/search` page still exists.

### 6.3 (removed: the search palette was replaced by login)

### 6.4 Interior page template
- **`InteriorPageLayout`:** `SmoothScrollProvider > CinematicPage > SiteHeader + <main id="main" class="min-h-screen flex flex-col justify-between"> + SiteFooter`.
- **`PageHero`** (every interior page):
  - `<header class="relative overflow-hidden pt-[calc(72px+4rem)] pb-12 border-b border-white/[0.06]">`.
  - Background: `grid-bg` at 30% opacity; a `720×380` radial wash centred above the top (`radial-gradient(ellipse at center, rgba(92,241,17,0.12), rgba(34,211,238,0.06), transparent 70%)`, `blur-3xl`); a bottom hairline gradient.
  - Content in `container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl`:
    - **Breadcrumbs:** `text-xs text-mist`, "Home" › … with ChevronRight `h-3 w-3 text-white/30`; the current item is `text-white font-medium`.
    - **Eyebrow:** `text-xs uppercase tracking-[0.28em] font-mono text-signal`, plus an optional badge.
    - **Title:** `RevealHeadline as="h1"` in `font-display font-semibold tracking-tight text-balance text-4xl sm:text-5xl md:text-6xl text-white leading-[1.08]`.
    - **Sub:** `mt-4 text-base sm:text-lg text-mist leading-relaxed max-w-2xl text-balance`.
    - Then optional actions and children.
- Page bodies sit inside `CinematicSection`s.

### 6.5 Footer (`SiteFooter`, every page, includes the final CTA)
- **Container:** `<footer class="relative overflow-hidden bg-ink">`, with an absolute `grid-bg opacity-30` and a bottom lime wash `h-96 opacity-20` using `radial-gradient(at bottom, rgba(92,241,17,.25), transparent 60%)`.
- Everything is inside `CinematicSection class="page-shell page-x pt-20 pb-12"`:
  1. **Final CTA row:** `grid gap-12 border-b border-white/10 pb-16 lg:grid-cols-[1.3fr_1fr] items-end`.
     - **Left:**
       - Eyebrow **"Ready when you are"**.
       - `RevealHeadline split="char"` h2 **"Play. Host. Run it better."** (`mt-4 text-4xl sm:text-5xl md:text-6xl text-white`).
       - Sub: "Clan B is technology for playing, hosting and running games and sports — making it easier to join and easier to operate."
       - Buttons: **Book a Game** (primary + arrow → `/play`) and **Become a Partner** (ghost → `/services/partner`).
     - **Right:** a contact card (`rounded-2xl border border-white/10 bg-white/[0.02] p-6 max-w-md lg:ml-auto`):
       - Label "Get in touch" (mono, zinc-500).
       - Mail icon + **hello@clanb.in** (a `mailto:` link).
       - MapPin icon + **Bengaluru · Chennai**.
  2. **Link grid:** `grid gap-10 py-14 md:grid-cols-3 lg:grid-cols-[1.4fr_repeat(5,1fr)]`.
     - **Brand column:** `Logo height={36}` + "The future of games. Technology for playing, hosting and running games and sports." (`text-xs text-mist max-w-xs`).
     - **Five columns** (heading `text-xs uppercase font-mono tracking-wider text-zinc-400`; links `text-sm text-mist hover:text-white`):
       - **Explore:** Sports `/sports` · Games `/games` · Events `/events` · Venues `/venues` · Clubs `/clubs`
       - **For business:** Become a Vendor `/services/vendor` · Partner with Clan B `/services/partner` · List Your Venue `/services/list-venue` · Organize a Tournament `/services/partner?type=Organizer`
       - **Company:** About `/about` · Contact `/contact` · Careers `/about#careers` · Services `/services`
       - **Support:** Help Center `/help` · Booking Policies `/help/bookings` · Refunds `/help/refunds` · Safety `/help/safety` · Report an Issue `/help/report`
       - **Legal:** Terms · Privacy · Cookies · Accessibility · Data Controls (`/legal/terms|privacy|cookies|accessibility|data-controls`)
  3. **Legal bar:** `border-t border-white/10 pt-8 text-xs text-white/60`, flex row on md.
     - "© 2026 CLANB TECH SOLUTIONS PRIVATE LIMITED. All rights reserved."
     - A **Chapters** row: "Chapters:" (`text-zinc-600 font-mono`), then **Services** → `/#host` and **Trust** → `/#trust` (`font-mono hover:text-signal`).

---

### 6.6 Login and role areas (details in `docs/AUTH_RBAC.md`)
- **`/login`:**
  - Layout: SiteHeader, then a full-height main with `grid-bg` at 30% and a lime radial wash.
  - Left column (≥lg): eyebrow "Clan B account", h1 "One login for players, vendors and the team", a sub line, and the italic tagline.
  - Right: an `OtpAuthForm` card (`rounded-2xl border-white/10 bg-panel/90`) containing:
    - a Login / Register pill tablist;
    - (Register only) Full name;
    - a Phone number / Email toggle and the identifier field;
    - **Send OTP**, then the code step: "Change number", a 6-digit mono input with `tracking-[0.6em]`, a 30 s resend countdown, and **"Verify & log in"** or **"Verify & create account"**;
    - a footer note: "No passwords… Vendor and admin access is granted by the Clan B team."
- **Session:** an httpOnly `clanb_session` cookie (HS256 JWT, 7 days). `proxy.ts` guards `/admin` (admin), `/vendor` (vendor, admin) and `/account` (anyone signed in).
- **`/admin`:** DashboardShell (fixed h-16 top bar with Logo 20 + "Admin" badge + user + Log out, and a w-64 sidebar). Pages:
  - Overview (stat cards + queues);
  - Vendor applications, Partner enquiries, Venue listings, Contact queries (expandable rows, status filters, Approve / Reject or Mark resolved / Reopen);
  - Users & roles (a role select per user).
- **`/vendor`:** the same shell with a "Vendor" badge. Pages: Overview (Bookings, Fill rate, Revenue, Pending payouts, This week, Check-ins today), Sessions, and Bookings & check-in.
- **`/account`:** the interior page template with PageHero "MY ACCOUNT" / "Your Clan B", a profile card, and "My bookings".

## 7. Motion system (exact parameters)

All motion uses GSAP + ScrollTrigger (registered once in `lib/motion.ts`). The easing vocabulary is `power2.out` (out), `power3.out` (smooth), `back.out(1.55)` and `none`.

### 7.1 Smooth scroll: Lenis (`SmoothScrollProvider`)
- **Enabled only** when **not** `prefers-reduced-motion: reduce`, **not** a touch device (`(hover: none) and (pointer: coarse)`), and **not** `max-width: 1023px`. Otherwise native scroll, with `ScrollTrigger.refresh()` on rAF, `load`, `resize` and after 400 ms.
- `new Lenis({ duration: 1.2, smoothWheel: true, syncTouch: false, touchMultiplier: 1.2, wheelMultiplier: 1, autoResize: true })`.
- `lenis.on("scroll", ScrollTrigger.update)`; driven by `gsap.ticker.add(t => lenis.raf(t*1000))` with `gsap.ticker.lagSmoothing(0)`; refresh on rAF, `load` and +400 ms.

### 7.2 Dip-to-black between chapters (`CinematicPage`)
- A single overlay `pointer-events-none fixed inset-0 z-[35] bg-[#030706] opacity-0` (`data-dip-overlay`). **It is not rendered at all under reduced motion.**
- After a **180 ms** delay, for every `[data-cinematic]` element **except the first**:
  - a scrubbed timeline with ScrollTrigger `{ trigger: el, start: "top 98%", end: "top 60%", scrub: 1 }`;
  - `.fromTo(overlay, {opacity:0}, {opacity:0.22, duration:0.4, ease:"none"})`;
  - `.to(overlay, {opacity:0, duration:0.6, ease:"none"})`.
  - It runs only if there are at least 2 sections, then calls `ScrollTrigger.refresh()`.

### 7.3 Section blur-rise (`CinematicSection`)
- Wrapper `relative` with `data-cinematic`. It has optional **seam fades** (both on by default):
  - top `absolute inset-x-0 top-0 z-20 h-16 md:h-24 bg-gradient-to-b from-[#030706] to-transparent`;
  - bottom (mirrored) `bg-gradient-to-t`.
- The inner content (`relative z-[1] will-change-[transform,opacity,filter]`) animates:
  - `gsap.fromTo(inner, {opacity:0.35, y:40, filter:"blur(10px)"}, {opacity:1, y:0, filter:"blur(0px)", ease:"power2.out", scrollTrigger:{ trigger: wrapper, start:"top 85%", end:"top 45%", scrub:0.8, immediateRender:false }})`.
  - This is skipped under reduced motion or when `motion={false}`.

### 7.4 Headline reveal (`RevealHeadline`)
- **Structure:** each word is split into `inline-block` spans (`mr-[0.28em]`). With `split="char"`, each character gets its own span. Every unit has `data-reveal-unit` and uses the **white→zinc-400 gradient text**. The element carries `aria-label={full text}`.
- **Start state:** `gsap.set(units, {opacity:0.18, filter:"blur(3px)", y:12})`.
- **Animation:** `gsap.to(units, {opacity:1, filter:"blur(0px)", y:0, ease:"power2.out", stagger: char ? 0.018 : 0.045, scrollTrigger:{ trigger: el, start:"top 75%", end:"top 25%", scrub:0.65 }})`.
- Skipped under reduced motion (the text stays fully visible).

### 7.5 Kinetic mission text (`KineticText`, mode `scroll-highlight`)
- Words are `inline-block` spans with `data-word` and gradient text.
- **Start:** `gsap.set(words, {opacity:0.18, filter:"blur(3px)"})`.
- **Animation:** `gsap.to(words, {opacity:1, filter:"blur(0px)", ease:"none", stagger:0.28, scrollTrigger:{ trigger: el, start:"top 75%", end:"top 25%", scrub:0.65 }})`.
- (A `split-up` mode also exists: `yPercent:110, rotate:5` → `0`, `power3.out`, stagger 0.03, start "top 80%", `toggleActions: "play none none reverse"`; it's unused on the homepage.)

### 7.6 Marquee
- The content is rendered **twice** (the second copy `aria-hidden`) inside `flex w-max` with class `marquee-track` (42 s linear infinite, `translateX(0 → -50%)`) or `marquee-track-slow` (55 s).
- Each copy is `flex shrink-0 items-center gap-6 pr-6`.
- Edge fades: `w-16 md:w-28` gradients from `ink` or `ink-soft` (matching the section) to transparent.
- It stops under reduced motion.

### 7.7 Hero scroll timeline (`ArenaHero`, `md+` only via `gsap.matchMedia("(min-width: 768px)")`)
- **Trigger:** the **cover curtain** element (by ref), `start: "top bottom"`, `end: "top top"`, `scrub: 1`.
- **Timeline (all at position 0, `duration: 1`, `ease: "none"`):**
  - copy `y: -48, opacity: 0.35`;
  - canvas wrap `scale: 1.06`;
  - a proxy `p: 0 → 1` whose `onUpdate` calls `canvas.setZoom(0.65 * p)` and `canvas.setPulse(0.3 + 0.45 * p)`.
- Then `ScrollTrigger.refresh()` on the next frame.

### 7.8 Liquid-lens cursor mask on the hero veil (`useLiquidLens`)
- **Gate:** `(min-width: 768px) and (pointer: fine)` and not reduced motion.
- **State:** `target {x:28, y:45, active:0}`, `cur {x:28, y:45, size:0}`, `trail {x:28, y:45}` (percent coordinates).
- **Pointer move:** `target = pointer % of section`; `active = x < 62 ? 1 : 0`. Pointer leave sets `active = 0`.
- **rAF step:**
  - `cur += (target - cur) * 0.085`
  - `trail += (cur - trail) * 0.055`
  - `size += ((active ? 168 : 0) - size) * 0.12`
  - It loops while anything is still moving, otherwise it stops.
- **Paint:**
  - `s = size * (1 + 0.08 sin(2.4t))`; `v = min(2.2·hypot(cur − prev), 1)`; `st = 1 + 0.55v`; `sq = 1 − 0.22v`.
  - Offsets:
    - `o1 = (8cos1.5t, 6sin1.8t)`
    - `o2 = (−10cos(1.1t+1.2), 8sin(1.35t+0.6))`
    - `o3 = (7sin(1.7t+2.1), −5cos(1.25t+1.4))`
  - The mask is three radial-gradient ellipses:
    - `(1.05·s·st × 0.72·s·sq)` at `cur + o1`, stops `transparent 0%, transparent 20%, rgba(0,0,0,.3) 48%, rgba(0,0,0,.65) 74%, #000 100%`;
    - `(0.78·s·sq × 0.98·s·st)` at `cur + o2`, same stops;
    - `(0.92·s × 0.70·s)` at `trail + o3`, stops `transparent 0%, transparent 10%, rgba(0,0,0,.4) 42%, rgba(0,0,0,.78) 70%, #000 100%`.
  - `-webkit-mask-composite: destination-out ×3`, `mask-composite: intersect`. When `size ≤ 1` the mask is `none`.

### 7.9 Hero 3D canvas (`ArenaCanvas`, `@react-three/fiber`)
- **Loading:** client-only (`next/dynamic`, `ssr:false`), showing the fallback plate while loading. It is wrapped in **`WebGLGuard`**: if WebGL isn't supported or the canvas throws, the static **HeroFallbackPlate** shows instead:
  `bg-[#030706]` + `radial-gradient(ellipse at 70% 40%, rgba(92,241,17,0.18), transparent 55%)` + `radial-gradient(ellipse at 85% 80%, rgba(255,255,255,0.06), transparent 45%)`.
- **Canvas:** `<Canvas dpr={[1, 1.75]} camera={{ position:[0,0,5], fov:40 }} gl={{ antialias:true, alpha:false, powerPreference:"high-performance" }} frameloop={reducedMotion ? "demand" : "always"}>`. Background `#030706`, `ambientLight intensity 0.4`.
- **Pointer:** enter → `hover = 1, pulse = 0.9`; leave → `hover = 0, pulse = 0.35`.
- **Plane:** size `1.1 × viewport` with a custom shader. Uniforms:
  - `uMap` (procedural texture), `uTime`, `uZoom`, `uPulse` (0.35), `uHover`;
  - `uResolution`, `uImageSize (2048, 1152)`;
  - **`uSignal #5CF111`**, **`uAccent #FFFFFF`**.
- **Fragment shader (exact):**
```glsl
precision highp float;
varying vec2 vUv;
uniform sampler2D uMap;
uniform float uTime, uZoom, uPulse, uHover;
uniform vec2 uResolution, uImageSize;
uniform vec3 uSignal, uAccent;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
vec2 coverUv(vec2 uv, vec2 res, vec2 img){
  float sa = res.x / max(res.y, 1.0); float ia = img.x / max(img.y, 1.0);
  vec2 s = vec2(1.0); if (sa > ia) s.y = ia / sa; else s.x = sa / ia;
  return (uv - 0.5) * s + 0.5; }
void main(){
  float z = mix(1.0, 1.45, clamp(uZoom, 0.0, 1.0));
  vec2 uv = coverUv(vUv, uResolution, uImageSize);
  uv -= 0.5; uv *= 1.0 / z; uv.x += 0.05;
  uv.x += sin(uTime * 0.12) * 0.008 * (0.4 + uHover);
  uv.y += cos(uTime * 0.1) * 0.006; uv += 0.5;
  vec4 tex = texture2D(uMap, clamp(uv, 0.001, 0.999));
  float glowMask = smoothstep(0.12, 0.52, max(tex.g, tex.b) - tex.r * 0.35);
  vec2 rainUv = vec2(uv.x * 55.0, uv.y * 90.0 - uTime * 6.0);
  float col = hash(vec2(floor(rainUv.x), 0.0));
  float stream = step(0.62, col) * step(0.7, fract(rainUv.y + col * 4.0 + uTime)) * smoothstep(0.18, 0.85, glowMask);
  float d = length(uv - vec2(0.58, 0.5));
  float ring = smoothstep(0.02, 0.0, abs(d - fract(uTime * 0.15) * 0.55)) * (0.35 + uPulse * 0.45);
  float n1 = smoothstep(0.992, 1.0, sin(uv.x * 48.0 + uTime * 0.25) * sin(uv.y * 36.0));
  float arc = smoothstep(0.012, 0.0, abs(uv.y - 0.42 - 0.04 * sin(uv.x * 9.0 + uTime * 0.35)));
  arc += smoothstep(0.01, 0.0, abs(uv.x - 0.62 - 0.03 * cos(uv.y * 8.0)));
  vec3 color = tex.rgb;
  color += mix(uSignal, uAccent, 0.55) * glowMask * (0.12 + uPulse * 0.18 + uHover * 0.14);
  color += uAccent * stream * 0.3;
  color += uSignal * ring * glowMask;
  color += mix(uAccent, uSignal, 0.4) * (n1 * 0.45 + arc * 0.2);
  float vig = smoothstep(1.2, 0.28, length((vUv - 0.5) * vec2(1.12, 1.05)));
  color *= mix(0.62, 1.0, vig);
  color = pow(color, vec3(0.96));
  gl_FragColor = vec4(color, 1.0); }
```
- **Per frame:**
  - `group.rotation.y = 0.06 sin(0.35t) + 0.08·hover`; `rotation.x = 0.03 cos(0.28t) − 0.04·hover`; `rotation.z = 0.015 sin(0.2t)`.
  - `k = (1 + 0.18·zoom)(1 + 0.014 sin(1.5t)(0.5 + pulse))`; `scale = (k(1 + 0.08·zoom), k(1 + 0.12·zoom), 1)`.
  - `uHover` eases toward `hover` at 0.07 per frame.
- **Particles A (white):**
  - **110** points, deterministic: `x = (|sin(i·12.9898 + 1.234)| − 0.5)·6`, `y = (|sin(i·78.233 + 4.567)| − 0.5)·4`, `z = −1.6 + |sin(i·45.123 + 8.901)|·1.4`.
  - `pointsMaterial size 0.018 color #FFFFFF transparent opacity 0.55 depthWrite false`.
  - `rotation.y = 0.03t`, scale `1 + 0.15·zoom`.
- **Particles B (lime):**
  - **40** points: `x = (|sin(i·91.234 + 2.345)| − 0.15)·4.5`, `y = (|sin(i·37.567 + 6.789)| − 0.5)·3.2`, `z = 0.05 + |sin(i·63.891 + 1.112)|·0.35`.
  - `size 0.03 color #5CF111 transparent`, opacity `0.35 + 0.2 sin(2.2t)`, `rotation.z = 0.04 sin(0.15t)`.
- **Procedural texture (`makeArenaTexture`, 2048×1152 canvas):**
  1. Fill `#030706`.
  2. A radial glow centred at (0.7w, 0.4h), r0 50 → r1 0.85h, stops `rgba(92,241,17,0.18)` → 0.4: `rgba(255,255,255,0.06)` → `rgba(3,7,6,0)`.
  3. A tile grid: **tile 42 px, gap 3 px (step 45)**, rounded radius 4. **The left 38% of the width is left empty** (behind the copy).
     - Each tile gets `rand = fract(sin(c·12.9898 + r·78.233)·43758.5453)`.
     - Base tile: `rgba(11,21,18,0.65)`.
     - If `rand < 0.09`: a **lime** tile `rgba(92,241,17, 0.6 + rand·4.4·0.4)`.
     - Else if `rand < 0.12`: a **white** tile `rgba(255,255,255,0.85)`.
  4. A **big lime "b"** built from tiles `rgba(92,241,17,0.95)`, centred at `(floor(cols·0.68), floor(rows·0.52))`, traced from the logo's b. Offsets `[dx, dy]`:
     - stem (tall ascender) `[0,-4] … [0,3]` (8 tiles);
     - bowl top `[1,0] [2,0]`, right `[3,1] [3,2]`, bottom `[1,3] [2,3]` (corners left open so it reads rounded).
     - **No accent tile above the stem.**
     - A **clear halo** (columns `cx-1 … cx+4`, rows `cy-5 … cy+4`) gets no random lime/white tiles, only the unlit base tiles, so the "b" silhouette stays legible.
  - Texture settings: `SRGBColorSpace`, anisotropy 8, clamp-to-edge.
- **Colour rule:** the hero uses **only lime (#5CF111) and white**. **No blue/cyan pixels, particles or glow.**

### 7.10 Services stack: sticky recede (`HostStack`, `md+`)
- Each card wrapper is `relative flex items-center py-4 md:sticky md:top-[72px] md:h-[100svh] md:py-0`, with `z-index: i + 1`.
- For every card **except the last**, animate it as the **next** wrapper scrolls in:
  - `gsap.fromTo(card, {scale:1, filter:"brightness(1)"}, {scale:0.94, filter:"brightness(0.55)", ease:"none", scrollTrigger:{ trigger: nextWrapper, start:"top 85%", end:"top 25%", scrub:true, invalidateOnRefresh:true }})`.
  - Card `md:origin-top`.
- **Below 768px:** no sticky/recede (`clearProps: "transform,filter"`); cards are simply stacked with `space-y-6`.
- Skipped under reduced motion.

### 7.11 Trust steps
`gsap.from("[data-trust-step]", {y:32, opacity:0, stagger:0.08, duration:0.8, ease:"power3.out", scrollTrigger:{ trigger: section, start:"top 72%" }})`, one-shot and skipped under reduced motion.

### 7.12 Micro-interactions
- Arrow icons nudge `-translate-y-0.5 translate-x-0.5` on hover (300 ms).
- Cards: `hover:border-signal/40 hover:bg-white/[0.04]`, `transition-all duration-300`.
- Links: `hover:text-white` or `hover:text-signal`.
- Header background `transition-colors duration-300`.
- Dropdown `transition duration-200`.

### 7.13 Reduced motion (`prefers-reduced-motion: reduce`) — stricter than normal
There is no Lenis, and the dip overlay isn't created. Blur-rise, headline reveals and kinetic text all render at their final (fully visible) state. Marquees stop, and there's no hero scroll timeline, liquid lens or recede stack. The canvas uses `frameloop="demand"` (a static frame).

### 7.14 Responsive gates

| Behaviour | ≥1024 & fine pointer | 768–1023 | <768 or touch |
|---|---|---|---|
| Lenis | on | off | off |
| Hero scroll timeline, liquid lens | on | on (lens needs a fine pointer) | off |
| Services sticky recede | on | on | off (stacked) |
| Blur-rise, dip overlay, reveals, marquee | on | on | on |
| Header | inline nav | drawer | drawer |

---

## 8. Homepage — exact order (top to bottom)

`app/page.tsx`:
```
SmoothScrollProvider > CinematicPage >
  SiteHeader
  ArenaHero (renders <main id="main">: sticky hero section + cover curtain containing ↓)
    1. IntroSection
    2. GamesMarqueeSection
    3. MissionSection
    4. HostStack  (= "Services", section id="host")
    5. Trust      (section id="trust")
    6. SiteFooter (final CTA + links + legal bar)
```

### 8.0 Hero (`ArenaHero`, sticky)
- **Section:** `sticky top-0 z-0 h-[100svh] min-h-[560px] overflow-hidden bg-[#030706]` with `data-cinematic`.
- **Layers, bottom to top:**
  1. The canvas wrap (`absolute inset-0 origin-center will-change-transform`), with a top fade `h-24 from-[#030706]/60` and a bottom fade `h-28 from-[#030706]/75`.
  2. The veil `absolute inset-0 z-[2] hero-veil-blend` (liquid-lens mask target).
  3. The copy `relative z-10 page-shell page-x flex h-full items-end pb-10 pt-24 sm:items-center sm:py-28`, in a copy block `max-w-xl lg:max-w-2xl`.
- **Copy (exact):**
  - **Eyebrow:** "GAME-TECH PLATFORM" (`text-[10px] tracking-[0.24em] uppercase text-signal sm:text-xs sm:tracking-[0.32em]`).
  - **H1:** "Technology that makes games easier to play and easier to run".
    - Classes: `mt-4 font-display font-semibold text-[1.85rem] leading-[1.08] tracking-tight max-w-[16ch] drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)] min-[400px]:text-4xl sm:text-5xl sm:max-w-[14ch] md:text-6xl lg:text-[3.75rem]`.
    - It's plain white text, not animated on load.
  - **Sub:** "Board games and sports, discovered, booked and hosted in one place — for players who want a table tonight and for the vendors, venues and organizers who make it happen." (`mt-6 text-sm leading-relaxed text-mist sm:text-base md:text-lg max-w-xl`).
  - **Buttons** (`mt-8 flex flex-col gap-4 sm:flex-row`, full width on mobile):
    1. **Explore Clan B**: `hero-primary` + arrow → `/venues`.
    2. **Become a Vendor**: `hero-ghost` → `/services/vendor`.
  - **Tagline:** a `h-px w-8 bg-amber-600/80` line + "PLAY · HOST · RUN" (`text-[11px] tracking-[0.22em] text-amber-600 font-medium`), `mt-10`.
- **Cover curtain** (scrolls over the sticky hero):
  - `relative z-20 -mt-1` with `data-hero-cover data-cinematic`.
  - Inner `rounded-t-[1.75rem] md:rounded-t-[2.5rem] border-t border-white/10 bg-[#030706] shadow-[0_-40px_100px_rgba(0,0,0,0.75)]`. It contains every following section.

### 8.1 Intro
- `CinematicSection class="bg-ink py-16 sm:py-20 md:py-28"`, grid `page-shell page-x grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-end`.
- **Eyebrow:** "Where Play Gets Built".
- **Headline** (`RevealHeadline h2 word`, `mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl`): "Play, with a system behind it".
- **Blurb:** "From a Saturday strategy table to a city-wide badminton ladder — Clan B turns scattered chats, spreadsheets and phone calls into bookable, trackable, repeatable play."
- **Link:** "How Clan B works →" → `/about#how` (with ArrowUpRight).

### 8.2 Games & sports marquee
- `CinematicSection class="bg-ink-soft py-8"` with **no seam fades**.
- **Label** "Games & Sports on Clan B" (`text-[10px] uppercase tracking-[0.24em] text-zinc-500 font-mono`, centred on mobile, left on md).
- A `Marquee fadeColor="ink-soft"` (42 s) of 20 pills (`rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs sm:text-sm font-medium tracking-wide text-zinc-300 hover:border-signal/40 hover:text-white`), in this order:
  Chess, Catan, Codenames, Ticket to Ride, Azul, Splendor, Dixit, Carrom, Badminton, Pickleball, Futsal, Box Cricket, Table Tennis, Snooker, Basketball, Football 5s, Quiz Nights, Deduction Games, Co-op Campaigns, Party Games.

### 8.3 Mission
- `CinematicSection class="bg-ink py-20 sm:py-24 md:py-32"`.
- Label "Mission".
- `KineticText scroll-highlight` in `max-w-5xl mt-6`, class `font-display font-semibold text-balance tracking-tight leading-[1.15] text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-mist`. Text:
  "We build the technology that makes games and sports easier to join and easier to run — real tables, real courts, real people, one connected platform."

### 8.4 Services stack (`HostStack`, `section#host`)
- **Section:** `relative bg-ink py-16 md:py-24` with `data-cinematic`.
- **Header** (`page-shell page-x pb-6 pt-12 md:pb-8 md:pt-24`):
  - Eyebrow **"Services"**.
  - `RevealHeadline h2` **"Four ways to work with Clan B."** (`text-2xl sm:text-3xl md:text-5xl`).
  - Right link **"All services →"** → `/services` (`text-sm text-white/60 hover:text-white`).
- **Card shell:**
  - `w-full md:origin-top overflow-hidden rounded-[20px] sm:rounded-[28px] border border-zinc-800/80 bg-zinc-950 p-5 sm:p-6 md:p-10 shadow-[0_24px_80px_rgba(0,0,0,0.55)]`.
  - Background `radial-gradient(ellipse at 20% 0%, {accent}22, transparent 45%)`.
  - Inner grid `lg:grid-cols-[1.1fr_0.9fr] lg:min-h-[min(58vh,560px)] items-center gap-8`.
- **Left column:**
  - A **Pill** with an accent dot, icon and tag.
  - The title `mt-4 font-display text-2xl sm:text-3xl md:text-5xl font-semibold tracking-tight`.
  - The description `mt-4 text-sm md:text-base text-mist`.
  - Four capabilities in a `sm:grid-cols-2` list with `h-1.5 w-1.5` accent dots.
  - A CTA `Button variant="ghost" withArrow`.
- **Right column:** a visual panel.
- **Cards, in order:**

| # | Tag | Accent | Title | Description | Capabilities | CTA → | Visual |
|---|---|---|---|---|---|---|---|
| 1 | 01 — Vendor | #5CF111 | **Become a Vendor** | Run board-game nights, coaching and open sessions with capacity, pricing, rules and a cancellation policy — without the group-chat chaos. | Session builder · Capacity & waitlist · Participant messaging · Payouts & reconciliation | Become a Vendor → `/services/vendor` | console |
| 2 | 02 — Partner | #34D399 | **Partner with Clan B** | Vendors, organizers, corporates and academies — bring your business onto Clan B and run official game nights, playdays and leagues with us. | Co-hosted events · Corporate & group playdays · Managed operations · Verified partner badge | Partner with Clan B → `/services/partner` | mobile |
| 3 | 03 — Space | #06B6D4 | **List Your Venue** | Turn empty tables, courts, rooms and pods into bookable inventory with opening hours, blackout windows and booking rules. | Resource inventory · Slots & blackout windows · Auto-confirm rules · Occupancy view | List Your Venue → `/services/list-venue` | slots |
| 4 | 04 — Compete | #D97706 | **Organize a Tournament** | Set up leagues and knockouts with registrations, brackets, scoring and standings — tell us what you want to run and we'll set it up with you. | Registrations · Brackets & seeding · Score entry with audit trail · Live standings | Organize a Tournament → `/services/partner?type=Organizer` | metrics |

- **Card icons:** Become a Vendor and Partner with Clan B show **Sparkles** (see section 17). List Your Venue shows **LayoutGrid**; Organize a Tournament shows **Trophy**.
- **Visuals (exact):**
  - **console:**
    - Terminal card `max-w-md rounded-2xl border border-white/10 bg-black/70 p-5 font-mono text-xs backdrop-blur-md`.
    - Header: red/amber/emerald dots and "session.builder".
    - Lines: `$ clanb publish --session "Strategy Night"` (zinc-500), "→ 3 tables · capacity 18", "→ waitlist enabled", and **"✓ 14 / 18 seats booked"** in the accent.
    - Stats: fill 78% · check-ins 12 · rating 4.8 (lime).
  - **mobile:**
    - Phone `w-64 rounded-[2rem] border-2 border-white/15 bg-black p-4`, glow `0 0 60px {accent}33`, notch `h-4 w-20 rounded-full bg-zinc-800`.
    - Four rows (border `{accent}44`), each with the subtitle "Verified Clan B Host · Live": Official Saturday Smash · Corporate Badminton Cup · Board-Game Championship · Bengaluru Chess League.
  - **slots:**
    - Panel "Resource Slots & Occupancy" / "92% Booked" (lime).
    - A 7-column grid (Mon–Sun headers) of 35 cells `h-6 rounded-md border border-white/10`.
    - Cell `idx % 3 === 0 || idx % 5 === 0` is filled with `rgba(6,182,212, 0.35 + (idx % 4)·0.15)`, else alpha 0.05.
    - Cell 18 pulses (`animate-pulse border-cyan-400 bg-cyan-400/60`).
  - **metrics:**
    - "Registrations" / "64 / 64" + "+ waitlist 9" (amber-500 mono).
    - 10 bars at heights `42, 58, 46, 72, 64, 88, 76, 94, 81, 97`%, gradient `{accent} → transparent`, opacity `0.35 + i·0.06`.
    - Labels: Round 1 · Quarterfinals · Finals.

### 8.5 Trust (`section#trust`)
- **Section:** `relative overflow-hidden bg-ink page-x py-20 md:py-28` with `data-cinematic`.
- **Intro:**
  - Eyebrow **"Trust"**.
  - `RevealHeadline h2 word` (`mt-3 text-3xl sm:text-4xl md:text-5xl`): **"Know who runs it — and what happens if plans change"**.
  - Sub: "Every listing shows who is hosting, the rules, and the cancellation policy before you pay." (`mt-4 max-w-xl text-sm md:text-base text-mist`).
- **Steps grid:** `mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4`.
  - Each step is `border-t border-white/15 pt-5 space-y-3`.
  - Top row: mono index `text-xs text-zinc-500` + a lime icon `h-5 w-5`.
  - Title `font-display text-lg font-semibold text-white`; description `text-xs sm:text-sm text-mist`.
  - Steps:
    1. **01 Verified providers** (ShieldCheck): "Hosts and venues are verified before they go live, and their trust markers show on every page."
    2. **02 Clear policies** (FileCheck): "Cancellation, refund and eligibility rules are visible before booking, and saved with your booking."
    3. **03 Check-in & receipts** (QrCode): "Show a QR code at the door, and get itemised receipts for every booking."
    4. **04 Real support** (LifeBuoy): "Report an issue, reach support and see what happens next — from the booking itself."
- **Link:** "How bookings work →" → `/help/bookings` (`mt-12 pt-4`, ArrowUpRight).

### 8.6 Footer
Exactly as in section 6.5.

---

## 9. Services section

Copy for all four pages lives in `content/leadForms.ts`. Every form page is `InteriorPageLayout` + `PageHero` + `CinematicSection class="py-12 md:py-16"` with a container `max-w-2xl`. Each form card is `space-y-5 rounded-2xl border border-white/10 bg-panel p-6 md:p-8`. Labels are `mb-1.5 block text-sm font-medium text-white`, and optional fields show "(optional)" in `text-mist`. The submit button is `primary`, `w-full sm:w-auto`: it shows a spinner and "Sending…" while submitting, and an API error appears as a `role="alert"` `text-sm text-rose-400` line.

**Validators:**
- Email pattern `^[^\s@]+@[^\s@]+\.[^\s@]+$` → "Enter a valid email address."
- Phone pattern `^(\+91[\s-]?)?[6-9]\d{9}$` → "Enter a valid 10-digit Indian mobile number."

**Multi-select** (`CheckboxGroup`): a `<fieldset>` + `<legend>` (`text-sm font-medium text-white`) of toggle chips.
- Off: `rounded-full border px-3.5 py-1.5 text-xs border-white/15 bg-white/5 text-mist hover:border-white/30 hover:text-white`.
- On: `border-signal bg-signal/15 text-signal`.
- Chips use `aria-pressed`.

**Success state** (`LeadSuccess`, replaces the form):
- A `role="status"` card `rounded-2xl border border-signal/30 bg-panel p-8 text-center`.
- A lime CheckCircle2 `h-10 w-10`, the heading (`font-display text-2xl font-semibold`), the body, and "Reference <CB-XXX-XXXX>" (`font-mono text-xs text-zinc-500`, with the code in lime).
- Buttons: [reset label] (ghost, resets the form) and **Back to Services** (signal-ghost → `/services`).

### 9.1 Services hub — `/services`
- **Metadata title:** "Services — Become a Vendor, Partner or List a Venue | Clan B".
- **PageHero:**
  - Eyebrow **SERVICES**.
  - Title **"Bring your games, courts and venues to Clan B"**.
  - Sub "Tell us a bit about what you run. A real person on the Clan B team reads every submission and gets back to you."
  - Breadcrumb Home › Services.
- **Cards grid:** `grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6`.
  - Each card is a Link `rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 hover:border-signal/40 hover:bg-white/[0.04]`.
  - It has an icon tile `h-11 w-11 rounded-xl border border-signal/25 bg-signal/10 text-signal`, a title h2 `font-display text-xl` (`group-hover:text-signal`), a description, and an ArrowRight.
  - Cards, in order:
    1. **Become a Vendor** (Dices): "Run board-game nights, coaching or open sessions for players in your city." → `/services/vendor`
    2. **Partner With Clan B** (Handshake): "Vendors, organizers and corporates — bring your business onto the platform." → `/services/partner`
    3. **List Your Venue** (Building2): "Turn your tables, courts or rooms into bookable space." → `/services/list-venue`
    4. **Contact Us** (Mail): "A general question or feedback? Send the team a quick query." → `/contact`
- **FAQ** (`max-w-3xl`, native `<details>` accordion with a lime "+" that rotates 45° when open). Heading "What happens after you submit?". Questions:
  - **"How soon will I hear back?"** Our team reviews every submission and typically replies within 2 working days.
  - **"Is there a cost to apply?"** No — submitting a form is free. We'll walk you through pricing and terms once we're in touch.
  - **"I'm not sure which form fits. What do I pick?"** Pick the closest one — a single vendor, a business or organizer, or a venue with space to fill. We'll redirect you if another path fits better.

### 9.2 Become a Vendor — `/services/vendor`
- **PageHero:**
  - Eyebrow BECOME A VENDOR.
  - Title "Run games people show up for".
  - Sub "Tell us about you and what you'd like to run — we'll follow up with next steps."
  - Breadcrumb Home › Services › Become a Vendor.
- **Fields**, in a 2-column grid on md:

| Field (label) | Control | Rules / options |
|---|---|---|
| Name | text | required "Enter your name." |
| Email | email | required "Enter your email." + email pattern |
| Phone | tel | required "Enter your phone number." + phone pattern |
| City | text | required "Enter your city." |
| Type of games | select | required "Choose one." — Board Games · Sports · Both Board Games & Sports |
| Experience | select | required "Choose one." — First-time vendor · Less than 1 year · 1–3 years · 3+ years |
| Venue available? | select (full row, `md:max-w-xs`) | required "Choose one." — Yes, I have a venue · No, I need one · Not sure yet |
| Message (optional) | textarea, 4 rows | placeholder "Anything else we should know?" |

- **Submit:** "Submit application" → `applyAsVendor()` (**POST /vendors**).
- **Success:** "Thanks — we've got your application" / "Our team reviews every vendor application and will email you within 2 working days." Reset label "Submit another application". Reference prefix `CB-VND-`.

### 9.3 Partner with Clan B — `/services/partner`
- **PageHero:**
  - Eyebrow PARTNER WITH CLAN B.
  - Title "Bring your business onto Clan B".
  - Sub "For vendors, organizers, corporates and studios who want to run at scale."
- **`?type=` preselect:** if the query `type` matches a business type exactly (e.g. `?type=Organizer`), that option is preselected.
- **Fields:**

| Field | Control | Rules / options |
|---|---|---|
| Business name | text | required "Enter your business name." |
| Contact person | text | required "Enter a contact name." |
| Email | email | required "Enter an email." + pattern |
| Phone | tel | required "Enter a phone number." + pattern |
| Business type | select | required "Choose one." — Vendor / Facilitator · Organizer · Corporate · Sports Club / Academy · Other |
| Location | text | required "Enter a location." |
| Services | chip group (multi) | at least one, "Choose at least one service." — Game Nights · Tournaments · Coaching · Corporate Events · Venue Rental · Other |
| Message (optional) | textarea 4 rows | placeholder "Tell us more about your business and what you're looking for." |

- **Submit:** "Submit enquiry" → `submitPartnerEnquiry()` (**POST /partners**). The backend emails **aditya.gopal.pandey@gmail.com**.
- **Success:** "Thanks — your enquiry is in" / "Your enquiry has gone straight to our partnerships team, who will reach out within 2 working days." Reset "Submit another enquiry". Prefix `CB-PTR-`.

### 9.4 List Your Venue — `/services/list-venue`
- **PageHero:**
  - Eyebrow LIST YOUR VENUE.
  - Title "Turn empty tables and courts into bookings".
  - Sub "Cafés, courts, turfs and private rooms — tell us what you've got."
- **Fields:**

| Field | Control | Rules / options |
|---|---|---|
| Venue name | text | required "Enter the venue name." |
| Owner | text | required "Enter the owner's name." |
| Location | text | required "Enter a location." |
| Capacity | number (min 1, placeholder "Number of people") | required "Enter a capacity.", min 1 "Must be at least 1." |
| Available facilities (optional) | chip group | Parking · WiFi · Air Conditioning · Seating / Tables · Washrooms · Refreshments / Café · Changing Rooms · Equipment Rental |
| Contact information | Email + Phone (small `text-xs text-mist` labels, 2 columns) | both required, with patterns |

- **Submit:** "Submit venue" → `submitVenueListing()` (**POST /venue-listings**, capacity sent as a number).
- **Success:** "Thanks — we've received your venue details" / "Our venues team will review and follow up within 2 working days." Reset "List another venue". Prefix `CB-VEN-`.

---

## 10. Contact Us — `/contact`
- **PageHero:**
  - Eyebrow **CONTACT US**.
  - Title **"Get in touch"**.
  - Sub "Have a question? Drop us a quick note and our team will take it from there."
  - Breadcrumb Home › Contact.
- **The form has exactly two fields:**
  1. **Name**: text, required "Enter your name.".
  2. **Query**: textarea, 6 rows, placeholder "How can we help?", required "Write your query.", min length 10 "A little more detail helps (10+ characters).".
- **Submit button** label **"Submit"** ("Submitting…" while sending).
- **On success:** the form clears and a **popup (Dialog)** opens:
  - Centred content: a lime CheckCircle2 `h-12 w-12`.
  - Heading **"Query received!"** (`font-display text-2xl font-semibold`).
  - Body **"Thanks for reaching out. Your query is now with the Clan B team, and someone will be in touch with you shortly."** (`text-sm text-mist`).
  - A **Done** primary button that closes it.
- **Dialog behaviour:** fixed overlay `bg-ink/80 backdrop-blur-md`, panel `rounded-2xl border border-white/10 bg-ink-soft/95 p-6 backdrop-blur-xl max-w-lg`, a close ✕ at top-right, focus trapped, and it closes on Esc or a backdrop click.
- **Routing:** `submitContactQuery({ name, query })` → **POST /contact** → **admin**. Reference prefix `CB-MSG-`.

---

## 11. Venues

### 11.1 Directory — `/venues`
- **Metadata:** "Verified Venues & Play Spaces | Clan B".
- **PageHero:**
  - Eyebrow VERIFIED VENUES.
  - Title "Bengaluru's Premier Gaming Hubs & Turfs".
  - Sub "Discover soundproof board game lounges, tournament-grade racquet courts, floodlit futsal turfs, and dedicated chess rooms across Bengaluru."
- **Data:** the first page is fetched on the server via `getVenues({ page: 1 })`, then the client calls `getVenues({page, pageSize: 6, query, neighbourhood})`.
- **Filter bar** (`rounded-2xl border border-white/10 bg-panel p-4 sm:p-6`):
  - A search input with a search icon, `aria-label` "Search venues", placeholder "Search venue by name, area or amenity (e.g. Smash Hub, BWF Courts, WiFi)...", debounced 300 ms, with a clear ✕.
  - Neighbourhood chips: **All, Koramangala, Indiranagar, HSR Layout, Jayanagar, Whitefield, JP Nagar** (active `bg-signal text-black font-semibold`).
  - Changing a filter or the search resets to page 1.
- **Results line:** "Showing **1–6** of **12** verified venues" (plus "Loading…" while fetching; the grid dims to 50% opacity).
- **Grid:** `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6` of **VenueCard**. Each card has:
  - a "Verified Partner" lime chip and a rating (star, amber);
  - the name (link, `font-display text-xl`, lime on hover) and a 2-line description;
  - a MapPin + address;
  - up to 3 amenity chips plus "+N more";
  - a footer with "Instant Slot Booking" and a **View Slots** pill → `/venues/[slug]`.
- **Pagination** (only when there's more than 1 page), in `<nav aria-label="Venue pages">`:
  - ◀ (`aria-label` "Previous page"), numbered pages ("Page N"; current `bg-signal text-black`, `aria-current="page"`), ▶ ("Next page").
  - Round `h-9` buttons. Clicking one smooth-scrolls to the top of the results.
- **Empty state:** "No venues found matching your criteria" / "Try selecting a different neighbourhood or broadening your search terms." with a "View All Venues" button that resets the filters.
- **The 12 venues** (dummy data, `lib/data/mock/fixtures.ts`):
  - stratplay-koramangala, smash-hub-indiranagar, arena-turf-hsr, chess-circle-jayanagar
  - hobbyist-whitefield, smash-hub-jp-nagar, clanb-pavilion-indiranagar, arena-turf-whitefield
  - stratplay-hsr, spin-lab-koramangala, south-court-jayanagar, arena-turf-jp-nagar

### 11.2 Venue detail — `/venues/[slug]`
- **PageHero:** eyebrow "VERIFIED VENUE", the venue name, its description, and a rating badge (amber star).
- **Two-column layout** (`lg:grid-cols-12`):
  - **Left:**
    - "LOCATION & ACCESS" card: address, amenity chips, and "Operated by: **Org name**" (plain text, not a link) with "Verified Provider".
    - "Available Spaces & Units (N)" list.
    - "House Rules" (3 items).
    - Community reviews.
  - **Right:** the **VenueSlotPicker**:
    - "REAL-TIME AVAILABILITY" / "Reserve a Court or Table Slot".
    - 1: Select Date (Today, Tomorrow, then weekdays; client-rendered in IST).
    - 2: Select Spot/Unit.
    - 3: 10 time slots `07:00` to `22:00`, prices ₹500–₹800. Slots already started today are disabled.
    - A summary bar and **Instant Reserve** → `/checkout/slot-{venueId}?resource=&date=&start=`.
    - Trust badges.
- **Checkout** (guest, no login): Review (a policy checkbox is required) → **Hold** (10:00 countdown) → Pay (price breakdown, promo `FIRSTGAME` 10% / `CLANB20` 20%; payment methods UPI, Card, Net banking, and "Test card — always declines") → **You're booked!** (QR + receipt + "Explore more venues" → `/venues`).

---

## 12. Other pages still in the app (not linked from the header)
These exist, render with the same design system (PageHero + CinematicSection) and are reachable from the footer and search. **Keep them as they are:**
- `/play` (discover sessions, filters) and `/play/request` (request a game form)
- `/events` (supports `?host=clanb`) and `/events/[slug]` (event detail with a booking card, waitlist, Event JSON-LD)
- `/sports`, `/sports/[sport]` (feed tabs Live/Upcoming/Recent/News, "Sample data" label, explainers, local play)
- `/games` (catalog with mood/players/time/complexity filters + collections, `?mood=`) and `/games/[slug]`
- `/clubs` (7 clubs, "Join club · Coming soon", CTA "Become a Vendor" → `/services`)
- `/about` (story, the 10-step north-star loop `#how`, offices, `#contact`, `#careers`, buttons "Book a Game" / "Become a Partner" → `/services`)
- `/help`, `/help/[topic]` (bookings, refunds, safety, report — `/help/report` has a Report-an-Issue form)
- `/legal/[doc]` (terms, privacy, cookies, accessibility, data-controls; each shows a "TODO legal review" note)
- `/search?q=` (grouped results), `/checkout/[id]` (guest checkout)
- **404** (`not-found.tsx`): "Error 404", "This tile is missing", a 3×3 lime "b" tile grid with the centre missing, and buttons "Back home" / "Find something to play".
- **Error screens:**
  - `error.tsx`: "Something went wrong", "We dropped a piece", with Try again (`retry()`) and Home.
  - `global-error.tsx`: "Clan B hit a snag" with Try again.

---

## 13. Redirects (`next.config.ts`)

| From | To | Type |
|---|---|---|
| `/for-providers` | `/services` | 308 |
| `/for-providers/host` | `/services/vendor` | 308 |
| `/for-providers/partner` | `/services/partner` | 308 |
| `/for-providers/venues` | `/services/list-venue` | 308 |
| `/for-providers/:path*` | `/services` | 308 |
| `/signup`, `/register` | `/login?mode=register` | 307 |
| `/me` | `/account` | 307 |

---

## 14. Data layer and NestJS-ready API layer

### 14.1 API layer (`lib/api/`) — the backend contract
Each function contains its **real `fetch` call commented out** (a "Real API" block) and returns **dummy data** (a "Dummy data" block). To go live, uncomment Real API, delete Dummy data, and set `NEXT_PUBLIC_API_BASE_URL` (default `http://localhost:4000/api`).

| File | Function | Endpoint | Body → Response |
|---|---|---|---|
| `venues.ts` | `getVenues(q)` | `GET /venues?page=&pageSize=&query=&neighbourhood=` | → `Paginated<Venue>` (`VENUES_PAGE_SIZE = 6`) |
| `venues.ts` | `getVenueBySlug(slug)` | `GET /venues/:slug` | → `Venue` (404 → null) |
| `contact.ts` | `submitContactQuery` | `POST /contact` | `{ name, query }` → `SubmissionReceipt` — **to admin** |
| `partners.ts` | `submitPartnerEnquiry` | `POST /partners` | `PartnerEnquiryInput` → receipt — **emailed to aditya.gopal.pandey@gmail.com** |
| `vendors.ts` | `applyAsVendor` / `listVendorApplications` | `POST /vendors` / `GET /vendors` (admin) | |
| `venueListings.ts` | `submitVenueListing` / `listVenueListings` | `POST /venue-listings` / `GET /venue-listings` (admin) | |

- **Supporting files:**
  - `config.ts`: `API_BASE_URL`, `MAIL_ROUTING = { contact: "admin", partner: "aditya.gopal.pandey@gmail.com" }` (documentation only; **recipients are backend env vars** `ADMIN_INBOX_EMAIL` and `PARTNER_INBOX_EMAIL`, never sent from the browser).
  - `http.ts`: `apiFetch<T>()` plus `ApiError` (reads the Nest `{ message }`).
  - `types.ts`: all DTOs (`Paginated`, `SubmissionReceipt {id, reference, receivedAt, status:"received"}`, `ContactQueryInput`, `PartnerEnquiryInput`, `VendorApplicationInput`, `VenueListingInput`, `VenueQuery`).
  - `mock.ts`: latency 300–700 ms, references `CB-<PREFIX>-<4 chars>`, and dev-only console logs like `[mock api] POST /partners → email aditya.gopal.pandey@gmail.com`.
- The full NestJS module layout (Venues, Contact, Partners, Vendors, VenueListings, Mail; global prefix `api`, CORS, ValidationPipe, throttling on POSTs) is in `docs/BACKEND_NESTJS.md`.

### 14.2 Mock domain data (`lib/data/`)
`types.ts` defines the domain model (Venue, Resource, Activity, Event/Session, Booking, Payment, Policy, Organization, Review, Club, …). `mock/fixtures.ts` holds the fictional Bengaluru data: 12 venues, 30 games, 8 sports, 40 events, 6 organizations, sports feed, clubs, reviews and policies. `repo.ts` is the older typed repository used by the secondary pages and checkout. **Copy the fixtures verbatim; do not invent new data.**

---

## 15. SEO, accessibility, performance, error handling
- **SEO:**
  - Per-route Metadata API titles/descriptions.
  - `sitemap.ts` lists `/`, `/play`, `/play/request`, `/events`, `/venues`, `/sports`, `/games`, `/clubs`, `/about`, `/help`, `/services`, `/services/vendor`, `/services/partner`, `/services/list-venue`, `/contact`, plus all event/venue/game/sport/help/legal detail pages.
  - `robots.ts` allows all and disallows `/checkout/`, `/search`, `/login`, `/account`, `/admin`, `/vendor`, `/api/`.
  - `opengraph-image.tsx` is 1200×630: the logo on ink with a lime wash, "The future of games." and "Play, host and run board games and sports — in one place."
  - JSON-LD: Organization + WebSite on every page, and Event on event pages.
- **Accessibility:**
  - Skip link and one `<h1>` per page.
  - Labelled navs ("Primary", "Mobile", "Venue pages").
  - Visible lime focus rings.
  - Dialogs trap focus and restore it on close.
  - Form errors use `role="alert"` + `aria-invalid` / `aria-describedby`.
  - Chips use `aria-pressed`.
  - Split-text headings keep `aria-label`, and decorative layers are `aria-hidden`.
  - The strict reduced-motion mode is described in section 7.13.
- **Performance:**
  - The hero canvas is client-only with `dpr [1, 1.75]`.
  - Fonts are self-hosted with `display: swap`.
  - Almost every page is static (SSG). Dynamic routes: `/search`, `/checkout/[id]`, `/services/partner` (`?type=`), `/games` (`?mood=`), `/events` (`?host=`).
  - Measured locally: LCP 0.4–1.5 s, CLS 0.
- **Resilience:**
  - `WebGLGuard` (no WebGL → static plate).
  - `error.tsx` / `global-error.tsx`.
  - All `localStorage` reads are try/catch and shape-checked.
  - Deterministic IST/₹ formatting (`lib/format.ts`) to avoid hydration mismatches.

---

## 16. Functional requirements (FRD) and acceptance criteria

| ID | Requirement | Acceptance criteria |
|---|---|---|
| FR-01 | Header shows Venues + Services dropdown + Login/Register (or account menu) + Explore Venues | No Play/Events/Sports/Games or search in the header |
| FR-02 | Services dropdown lists 4 items in order | Become a Vendor, Partner with Clan B, List Your Venue, Contact Us — each links to its page |
| FR-03 | Header is transparent over the home hero until scrolled > 24px | Then glass: `bg-ink/80 backdrop-blur-xl` + bottom border |
| FR-04 | Hero buttons | "Explore Clan B" → /venues, "Become a Vendor" → /services/vendor |
| FR-05 | Homepage order | Hero → Intro → Games marquee → Mission → Services (4 cards) → Trust → Footer; nothing else |
| FR-06 | Services stack cards | Become a Vendor, Partner with Clan B, List Your Venue, Organize a Tournament (preselects Organizer) |
| FR-07 | Hero visuals | Pixels/particles are lime + white only; the tile "b" has a tall stem, open-corner bowl, clear halo and no accent tile |
| FR-08 | Logo renders clean | No visible seams between tiles at 24px (header) or 36px (footer) |
| FR-09 | Contact Us | Only Name + Query; validation messages as in section 10; success opens the "Query received!" popup and clears the form; routed to admin |
| FR-10 | Partner enquiry | Required fields + ≥1 service; success card; routed to aditya.gopal.pandey@gmail.com (backend) |
| FR-11 | Vendor application, venue listing | Fields/validation/success exactly as in sections 9.2/9.4; POST to /vendors and /venue-listings |
| FR-12 | Venues pagination | 6 per page, numbered pager + prev/next, filters reset to page 1, "Showing X–Y of N" |
| FR-13 | OTP login + roles | Phone/email → 6-digit OTP. Admin → /admin, vendor → /vendor, player → /account (or `next`). Wrong role is redirected; guests go to /login?next=. Checkout still works as a guest |
| FR-14 | Old URLs | All /for-providers/* 308-redirect to /services equivalents |
| FR-15 | Backend readiness | Every call in lib/api has its real fetch commented out and dummy data active |
| FR-16 | Motion parity | Every parameter in section 7 matches exactly; reduced motion renders everything visible and static |
| FR-17 | Resilience | No WebGL → static plate; runtime error → branded retry screen; builds need no network for fonts |

---

## 17. Known as-built quirks (reproduce them; do not "fix")
1. **Services-stack icons:** the card icon map still uses the older ids `{ host: Dices, venues: LayoutGrid, organizers: Trophy, "clanb-events": Sparkles }`, while the current card ids are `vendor, partner, venues, organizers`. So **Become a Vendor and Partner with Clan B show the fallback Sparkles icon**, List Your Venue shows LayoutGrid, and Organize a Tournament shows Trophy.
2. The **slots visual** and the **List Your Venue accent** still use cyan `#06B6D4`. The "hero-primary" button hover is cyan (`bg-glow`). Only the **hero canvas** was changed to lime + white.
3. The final CTA's primary button is **"Book a Game" → /play** and the secondary is **"Become a Partner" → /services/partner** (these were intentionally left as they were).
4. `content/home.ts` still contains unused copy objects (`playRunway`, `sportsPulse`, `gamesMood`, `intelligence`, `community`). They're not rendered.
5. `lib/data/repo.ts` still contains unused provider-workspace methods. Harmless, and not imported by any UI.
6. The Contact form collects no email or phone (by instruction), so replies depend on the backend/admin process.

---

## 18. Build, run, test and deploy
```bash
pnpm install
pnpm dev                         # http://localhost:3000
pnpm typecheck && pnpm lint && pnpm build
pnpm build && pnpm test:e2e      # Playwright on installed Chrome/Edge (86 tests)
```
- **Environment variables:**
  - `NEXT_PUBLIC_SITE_URL` (canonical URL, default `https://clanb.in`)
  - `NEXT_PUBLIC_API_BASE_URL` (NestJS, default `http://localhost:4000/api`)
  - `NEXT_PUBLIC_DATA_SOURCE` (`mock` default; `api` switches `lib/data/repo.ts` to its API stub)
  - `NEXT_PUBLIC_DEBUG_ANALYTICS`
- **Vercel:** keep the Root Directory default (the app is at the repo root). `vercel.json` pins the framework `nextjs`, `pnpm install`, `pnpm build` and output `.next`. Set `ENABLE_EXPERIMENTAL_COREPACK=1` and `NEXT_PUBLIC_SITE_URL`.
- **Quality bar for any change:** typecheck, lint and build clean with 0 warnings; no browser console errors; tested at 375, 768 and 1440 widths and with reduced motion.
