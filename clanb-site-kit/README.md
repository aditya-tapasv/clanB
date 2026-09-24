# Clan B — website & provider workspace

The Clan B frontend: a cinematic public site for discovering and booking board games and sports, a mock booking journey, and a dense provider workspace. Next.js 16 (App Router), React 19, TypeScript strict, Tailwind v4, GSAP + Lenis, React Three Fiber.

The whole app runs on a **typed mock data layer**. The real NestJS backend replaces it by switching one environment variable (see [docs/API_SWAP.md](docs/API_SWAP.md)).

- **Spec:** [`MASTER_PROMPT.md`](MASTER_PROMPT.md)
- **Status and decisions:** [`PROJECT_TRACKER.md`](PROJECT_TRACKER.md)
- **Motion reference:** [`docs/reference/mash-motion-forensics.md`](docs/reference/mash-motion-forensics.md)

## Run it

Requires Node 22+ and pnpm (the version is pinned in `package.json` → `packageManager`).

```bash
pnpm install
pnpm dev            # http://localhost:3000
```

Quality gates (all must pass with 0 errors and 0 warnings):

```bash
pnpm typecheck && pnpm lint && pnpm build
```

End-to-end tests. They run against the production build and use your installed **Chrome and Edge**, so there's no browser download:

```bash
pnpm build
pnpm test:e2e       # ~2.5 min: navigation, search, booking, axe, reduced motion, 375/414 layout, perf budgets
```

### Environment variables

| Variable | Default | Purpose |
|---|---|---|
| `NEXT_PUBLIC_DATA_SOURCE` | `mock` | `mock` = fixtures + browser-persisted state; `api` = NestJS backend |
| `NEXT_PUBLIC_API_BASE_URL` | `https://api.clanb.in/v1` | Backend base URL when `DATA_SOURCE=api` |
| `NEXT_PUBLIC_SITE_URL` | `https://clanb.in` | Canonical origin for the sitemap, robots, OG and JSON-LD |
| `NEXT_PUBLIC_DEBUG_ANALYTICS` | — | `true` logs `track()` funnel events in dev |

## Deploy to Vercel

1. Import the repo. Set **Root Directory** to `clanb-site-kit`. The framework preset is detected as Next.js.
2. Environment variables: set `NEXT_PUBLIC_SITE_URL` to the production URL, and leave `NEXT_PUBLIC_DATA_SOURCE` unset (mock) until the API is live.
3. Add `ENABLE_EXPERIMENTAL_COREPACK=1` so Vercel uses the exact pnpm version pinned in `package.json`.
4. Deploy. Nearly all pages are static (SSG). Only `/search`, `/checkout/[id]`, `/games` (for `?mood=`), `/events` (for `?host=`), `/login`, `/signup` and a few provider pages render on demand.

What keeps the site from crashing in the wild:
- **3D hero:** it's wrapped in `WebGLGuard`. With no WebGL, or if the canvas throws, visitors see a static branded plate and all copy and CTAs still work.
- **Error screens:** `app/error.tsx` and `app/global-error.tsx` show a branded retry screen instead of a blank page.
- **Browser storage:** every `localStorage` read is in try/catch and shape-checked, so private mode, blocked storage or stale data just mean an empty state.
- **Mock state:** it's per browser, so demo bookings never leak between visitors.

## Structure

```
app/                      routes (public pages, /checkout, /me, /provider/* workspace, sitemap, robots, OG image)
components/
  motion/                 SmoothScrollProvider, CinematicPage, CinematicSection, RevealHeadline, KineticText, Marquee
  hero/                   ArenaHero, ArenaCanvas (R3F), useLiquidLens, WebGLGuard
  home/                   homepage sections (HostStack, Intelligence, Trust accept a `content` prop for reuse)
  interior/               PageHero, InteriorPageLayout, StepGrid, FaqList
  discovery/ sports/      listing and detail building blocks
  checkout/ account/ auth/  booking journey, My Clan B, mock auth
  providers/ provider/    For Providers marketing + onboarding wizard; dense workspace
  ui/                     Button, Badge, Tabs, Dialog, Sheet, Input, Select, …
content/                  all page copy (edit copy here, not in components)
lib/
  data/types.ts           domain model (FRD §20)
  data/repo.ts            ClanBRepo interface + mockRepo + apiRepo
  data/mock/              fixtures, bookingStore, providerStore (localStorage-backed mock state)
  data/slots.ts           deterministic venue slot availability
  auth.ts saved.ts        mock session, saves/follows
  format.ts               deterministic ₹ / IST formatting (hydration-safe)
  motion.ts seo.ts analytics.ts
e2e/                      Playwright + axe specs
```

## Motion system

All scroll motion is built from a few primitives in `components/motion`, with values copied from the reference (A-IDs in the tracker):

- **SmoothScrollProvider:** Lenis, only at ≥1024 px with a fine pointer and no reduced motion.
- **CinematicPage:** the dip-to-black overlay between chapters.
- **CinematicSection:** the blur-rise and seam fades on every section.
- **RevealHeadline / KineticText / Marquee:** type and marquee motion.

**Reduced motion** (`prefers-reduced-motion: reduce`) is stricter than the reference. There's no Lenis, no dip overlay, marquees stop, reveals render at their final state, and the hero renders one static frame. `e2e/reduced-motion.spec.ts` guards this.

The provider workspace (`/provider`) deliberately has **no cinematic motion**: 14 px type, compact tables and 150 ms transitions (FRD §19.1).

## Rules that matter when changing code

- Read `AGENTS.md`: this Next.js version differs from older docs (for example, `error.tsx` receives `retry`, not `reset`).
- The UI never computes booking or payment truth. Prices, holds, availability and failure states come from the repo (`BookingError` codes).
- Don't format dates or currency with `Intl` in components that render on the server; use `lib/format.ts`.
- Update `PROJECT_TRACKER.md` after every task.
