# PROJECT_TRACKER — Clan B Website

> **Status legend:** `[ ]` todo · `[~]` in progress · `[x]` done (acceptance met) · `[!]` blocked (give the reason)
> Any AI must update this file after every task. It is the memory of the project; chat history is not.
> Spec: `clanb-site-kit/MASTER_PROMPT.md` (§ numbers below). Motion reference IDs A01–A50: `docs/reference/mash-motion-forensics.md`.

## Current focus
- **Phase:** Done — awaiting product-owner decisions (T-1004) and Safari/Firefox pass (T-906)
- **Next task:** T-906 / T-1004 / T-909 value-by-value audit
- **Last updated:** 2026-09-24 · Claude Code

## Progress summary
| Phase | Tasks | Done |
|---|---|---|
| 0 Setup | 8 | 8 |
| 1 Motion core | 9 | 9 |
| 2 Hero | 8 | 8 |
| 3 Home sections | 13 | 13 |
| 4 Data layer | 5 | 5 |
| 5 Public pages | 12 | 12 |
| 6 Booking journey | 6 | 6 |
| 7 For Providers | 5 | 5 |
| 8 Provider workspace | 9 | 9 |
| 9 Hardening | 9 | 7 (+1 partial, 1 blocked) |
| 10 Handoff | 4 | 3 (+1 needs PO) |

---

## Phase 0 — Setup (§3, §4, §5)
| ID | Status | Task | Acceptance | Files / notes |
|---|---|---|---|---|
| T-001 | [x] | Create Next.js App Router + TS strict project with pnpm; ESLint + Prettier | `pnpm build` passes on the blank app | Completed; Next 16 App Router |
| T-002 | [x] | Install deps: gsap, @gsap/react, lenis, three, @react-three/fiber, lucide-react, clsx, tailwind-merge, react-hook-form, zod, date-fns, @playwright/test | Lockfile committed; versions logged under Decisions | R3F 9.8.0, Three 0.186, GSAP 3.15, Lenis 1.3 |
| T-003 | [x] | Tailwind v4 + `globals.css` tokens, utilities, keyframes exactly as §5 | Token values match §5 character for character | `app/globals.css` exact replica |
| T-004 | [x] | Fonts via next/font (Syne, DM Sans, JetBrains Mono) as §4; html variables; body smoothing | Computed font-family is correct on h1/body/mono | `app/fonts.ts` & `app/layout.tsx` |
| T-005 | [x] | `lib/cn.ts`, `lib/motion.ts` (register ScrollTrigger, `usePrefersReducedMotion`, shared constants) | Imported without SSR errors | `lib/cn.ts`, `lib/motion.ts` |
| T-006 | [x] | Brand: move SVGs to `public/brand/`; `<Logo/>` component; favicon/app icons from the lime "b" tile | Logo renders crisp in header/footer sizes | `public/brand/*`, `components/ui/Logo.tsx` |
| T-007 | [x] | Copy `AGENTS.md` to root; keep `docs/reference/`; folder skeleton from §3 | Structure matches §3 | Skeleton created in `components/`, `lib/`, `content/` |
| T-008 | [x] | Base UI kit: Button (primary/ghost/hero-ghost/signal-ghost), Pill, Chip, Card, Panel, Tabs, Input, Select, Badge, Dialog, Sheet, Skeleton, EmptyState | Class strings match §5; /lab shows all | 13 UI components built in `components/ui/` |

## Phase 1 — Motion core (§6)
| ID | Status | Task | A-IDs | Acceptance |
|---|---|---|---|---|
| T-101 | [x] | SmoothScrollProvider (Lenis + GSAP ticker + gating) | A01 | Lenis only ≥1024 with a fine pointer and no reduced motion; ScrollTrigger refreshes on load/+400 ms |
| T-102 | [x] | CinematicPage dip overlay | A02 | Opacity peaks at .22 at 40% of the 98%→60% window; header unaffected |
| T-103 | [x] | CinematicSection | A03, A04 | .35/40px/blur10 → 1/0/0, top 85%→45%, scrub .8; seam fades present |
| T-104 | [x] | RevealHeadline (word/char) | A21, A47 | .18/blur3/y12, stagger .045/.018, top 75%→25%, scrub .65; aria-label |
| T-105 | [x] | KineticText (scroll-highlight + split-up) | A23 | Values per §6.5 |
| T-106 | [x] | Marquee (42 s / 55 s, edge fades) | A22, A46 | Seamless loop; stops under reduced motion |
| T-107 | [x] | SiteHeader (desktop nav, For Providers dropdown, search trigger, mobile drawer) | A05, A06, A50 | Transparent → glass after 24 px on `/`; drawer locks scroll |
| T-108 | [x] | Search command palette (Dialog, grouped mock results, ⌘K) | — | Keyboard-only usable |
| T-109 | [x] | `/lab` page showcasing every primitive + reduced-motion toggle note | — | All primitives visible and working |

## Phase 2 — Hero (§7)
| ID | Status | Task | A-IDs | Acceptance |
|---|---|---|---|---|
| T-201 | [x] | ArenaHero layer structure + sticky + cover sheet (`data-hero-cover`) | A07 | The curtain slides over the hero with rounded top and shadow |
| T-202 | [x] | Hero copy + CTAs + tagline (content/home.ts) | — | Matches §9 S0; responsive as §11 |
| T-203 | [x] | Hero scroll timeline (md+) | A08, A09, A10 | y −48 / opacity .35 / scale 1.06 / zoom .65 / pulse .3→.75 |
| T-204 | [x] | ArenaCanvas: R3F Canvas, shader verbatim, plane sway, imperative API | A10–A15, A19 | Uniforms/params exactly as §7.4 |
| T-205 | [x] | Particles A (110 cyan) + B (40 lime) | A16, A17 | Params as §7.4 |
| T-206 | [x] | `makeArenaTexture()` procedural pixel-tile plate + fallback image | A20 | Glow/rain/rings visibly pick up lime tiles; left 38% dark |
| T-207 | [x] | useLiquidLens on veil (md+, x<62%) | A18 | Maths exactly §7.3; loop self-stops |
| T-208 | [x] | Hero perf + reduced motion: dynamic import, offscreen pause, static frame | — | No canvas work when off-screen; static under reduced motion |

## Phase 3 — Home sections (§8, §9)
| ID | Status | Task | A-IDs | Acceptance |
|---|---|---|---|---|
| T-301 | [x] | S1 Intro | A03, A21 | Copy §9 S1 |
| T-302 | [x] | S2 Games & Sports marquee | A22 | 20 pills, ink-soft bg |
| T-303 | [x] | S3 Mission KineticText | A23 | Word sweep |
| T-304 | [x] | S4 PlayRunway + 5 cards + progress bar | A26–A28 | Pin ≥2400 px; x = −(overflow+40); mobile list |
| T-305 | [x] | S5 HostStack + 4 cards | A24, A25 | Sticky top 72 px; recede .94/.55; next top 85%→25% |
| T-306 | [x] | S5 visuals: console, slots, metrics, mobile | — | Match §9 S5 |
| T-307 | [x] | S6 SportsPulse | A29, A33, A34 | Source/freshness line on every panel |
| T-308 | [x] | S7 GamesMood + live Playbook (6 moods) | A29–A34 | Tab change re-animates; bars scale to % |
| T-309 | [x] | S8 Intelligence counters + chips | A35, A36 | Counters 1.8 s power2.out at top 85% |
| T-310 | [x] | S8 ClanGraph (intro timeline, loops, hover/focus) | A37–A45 | Timeline §8.5 exact; keyboard focus works |
| T-311 | [x] | S9 Community | A46 | Slow marquee 55 s |
| T-312 | [x] | S10 Trust | A29-style | 4 steps reveal |
| T-313 | [x] | S11 FinalCta + SiteFooter + Chapters anchors | A47 | Char reveal; FRD footer columns |
| — | [!] | **Full home parity review** vs reference (desktop 1440 and mobile 375), screenshots to docs/screenshots | all | Full-page capture blocked: Playwright's headless-shell download repeatedly reset/timed out. Source parity and production endpoint smoke checks passed. |

## Phase 4 — Data layer (§14)
| ID | Status | Task | Acceptance |
|---|---|---|---|
| T-401 | [x] | `lib/data/types.ts` from FRD §20 + state unions | Compiles; lifecycle/booking/payment unions complete |
| T-402 | [x] | Fixtures (Bengaluru): 12 venues, 30 games, 8 sports, 40 sessions/events, 6 providers, sports feed | Covers all service types + Full/Waitlist/Cancelled |
| T-403 | [x] | `ClanBRepo` interface + `mockRepo` with latency | All page needs covered |
| T-404 | [x] | `apiRepo` stub + env switch | Builds with `NEXT_PUBLIC_DATA_SOURCE=api` |
| T-405 | [x] | `track()` analytics no-op wrapper | Funnel events wired later |

## Phase 5 — Public pages (§10)
| ID | Status | Task | Acceptance |
|---|---|---|---|
| T-501 | [x] | PageHero + interior page template | Reused by all interior pages |
| T-502 | [x] | `/play` discover (search, filters USR-02/03, reason chips, empty state) | Filters update results |
| T-503 | [x] | `/play/request` demand request (USR-14) | Validated form + success state |
| T-504 | [x] | `/events` list + `/events/[slug]` detail (USR-04, USR-09) | All detail fields + waitlist state |
| T-505 | [x] | `/venues` + `/venues/[slug]` (slot picker) | Slots selectable |
| T-506 | [x] | `/sports` + `/sports/[sport]` (source/freshness) | Tabs work | `app/sports/*`, `components/sports/*`, `content/sports.ts`, `lib/data/status.ts`. Live/Upcoming/Recent/News tabs; per-row "Updated n min ago · Source" + "Sample data" label; explainers; Local play (sessions + venues) |
| T-507 | [x] | `/games` + `/games/[slug]` + collections | Mood/player/time filters | `GamesCatalogView` (mood/players/time/complexity + 4 collections, `?mood=` preselect; home GamesMood CTA passes the tab). `lib/data/games.ts` derives the 6 §9 moods from fixtures. `content/games.ts` overview + how-to-play for 30 games. `SportCard` → shared `discovery/ActivityCard` |
| T-508 | [x] | `/clubs` (Future ribbons) | | `Club` type + 7 fixtures + `repo.listClubs`; Join disabled with "Coming soon"; Teams/Ladders/Follows ribbons |
| T-509 | [x] | `/search` | Grouped results | `repo.search()` + `lib/search.ts` groups. ⌘K palette rebuilt on real data (it had hard-coded 404 links); ↑/↓/Enter work; "See all results" → `/search?q=`. Providers group waits for T-704 profile pages |
| T-510 | [x] | `/about` (#how loop) | | 10-step north-star loop via reusable `interior/StepGrid`; `#contact`, `#careers` anchors (footer links) |
| T-511 | [x] | `/help`, `/help/[topic]`, report-issue form | | Topics bookings/refunds/safety/report (footer slugs). RHF form with inline errors. `Input`/`Select` now wire `aria-invalid`/`aria-describedby`; Select chevron no longer shifts on error |
| T-512 | [x] | `/legal/*` + branded 404 | TODO legal markers present | `/legal/[doc]` (5 docs, `dynamicParams=false`) with "TODO legal review" note; `app/not-found.tsx` tile motif |

## Phase 6 — Booking journey (FRD §15)
| ID | Status | Task | Acceptance |
|---|---|---|---|
| T-601 | [x] | Sticky booking card on event/venue detail | Qty/slot selection | Event card existed; venue `VenueSlotPicker` rebuilt on `repo.listVenueSlots` (deterministic `lib/data/slots.ts`), dates client-only (was a stale build-date on static HTML), price no longer in URL, past slots unavailable |
| T-602 | [x] | `/checkout/[id]`: review policies → hold timer → itemised price | USR-05/06 | `CheckoutFlow`: policy acknowledgement → 10:00 `HoldTimer` → repo-priced lines (base/discount/fee/GST/total), promo `FIRSTGAME`/`CLANB20`, 4 payment methods |
| T-603 | [x] | Confirmation + QR + receipt | USR-10 | `BookingQr` (qrcode.react) + receipt with payment ref |
| T-604 | [x] | Failure states: hold expired, capacity reached → waitlist, payment failed (recoverable) | FRD 15.2 | Typed `BookingError` codes from repo. "Test card — always declines" exercises payment failure; seats stay held. Inline `WaitlistForm` (also on event page `#waitlist`) |
| T-605 | [x] | `/login`, `/signup` mock auth + "sign in when needed" gating at checkout only | USR-01 | Passwordless email/phone + OTP (any 6 digits). `lib/auth.ts` `useSession` (hydration-safe). Inline sign-in at hold step; header shows My Clan B when signed in; `?next=` restricted to same-site paths |
| T-606 | [x] | `/me` My Clan B: next booking, bookings list, cancel, follows/saves, profile | USR-07/08/13 | Next-up QR card, Upcoming/Past with receipts, cancel dialog showing policy, Saved & following (Save/Follow buttons on event/venue/game/sport heroes), profile edit |

## Phase 7 — For Providers
| ID | Status | Task | Acceptance |
|---|---|---|---|
| T-701 | [x] | `/for-providers` landing (reuse HostStack, Intelligence provider copy, Trust, FAQ) | | HostStack/Intelligence/Trust take an optional `content` prop (home unchanged); provider types, 4-step `StepGrid`, shared `FaqList` |
| T-702 | [x] | Sub-landings: host, venues, organizers, corporate | | `/for-providers/[type]` (`dynamicParams=false`); CTA → `/apply?type=` preselects provider type |
| T-703 | [x] | `/for-providers/apply` onboarding wizard (VEN-01) | Multi-step with progress persistence | 5 steps, per-step RHF validation, draft in localStorage (client-only render), docs UI-only, review + submit. Fixed rapid-click activity toggle race |
| T-704 | [x] | Provider public profile page (VEN-02) | Trust indicators | `/providers/[slug]` + `repo.getProvider` (verified, avg rating, sessions, venues, reviews). Linked from event/venue pages; "Hosts & organizers" search group; `/events?host=clanb` now filters |
| T-705 | [x] | Motion review of provider pages | Parity with home primitives | Built only from existing primitives (CinematicSection, RevealHeadline, StepGrid .08 stagger, HostStack/Intelligence/Trust) — no new motion values |

## Phase 8 — Provider workspace (dense UI, FRD §19.1)
| ID | Status | Task | Acceptance |
|---|---|---|---|
| T-801 | [x] | Workspace shell (sidebar, org switcher, role label) | Role switching explicit (FRD 4.1) | `app/provider/layout.tsx` + `ProviderShell`: dense 14px UI, no Lenis/cinematic; org switcher (hydration-safe store); "Acting as {type} · Owner" label; "Player view" exit |
| T-802 | [x] | Today view | | Stats, action items (low fill → announce, waitlist, drafts, verification), 24 h check-in progress, 7-day table, cancellations |
| T-803 | [x] | Services & sessions list | | Services + sessions with Upcoming/Drafts/Past/Cancelled filters, publish, cancel with confirm |
| T-804 | [x] | Create session/event wizard + "Draft with AI" (mock, human review) | VEN-03/04, AI rule 14.1 | `repo.draftSessionWithAI` parses brief (activity, area, players, ₹, weekday, time, weekly); AI-filled fields badged until edited; nothing publishes without a click; unverified org → pending-review; weekly = 4 occurrences |
| T-805 | [x] | Bookings table with state filters | VEN-05 | State chips with counts + search; booking and payment state pills |
| T-806 | [x] | Participants + check-in | ORG-07 | Per-session roster with `role=switch` toggles, optimistic with rollback, persisted |
| T-807 | [x] | Announcements composer | VEN-06 | Audience = one session or all upcoming; validation from repo; history with recipient counts; `?session=` preselect from Today |
| T-808 | [x] | Inventory: resources, hours, blackout windows | FRD §10 | Resources table, 7-day hours editor (close > open validated), blackouts add/remove in IST |
| T-809 | [x] | Payouts + Insights (fill rate, funnel) | VEN-07/12 | Weekly payouts (base − discounts − 2% processing, mock terms). Insights: funnel, fill rate, weekly bookings — single-hue bars, hover/focus tooltips, table views |

## Phase 9 — Hardening (§12, FRD §22/§26)
| ID | Status | Task | Acceptance |
|---|---|---|---|
| T-901 | [x] | Reduced-motion audit (every component) | FRD 26.1 #11 | `e2e/reduced-motion.spec.ts`: text at final state, marquees stopped, no Lenis, **dip overlay now not created** (was always rendered) |
| T-902 | [x] | Keyboard/focus/landmarks audit; axe clean | 0 critical | axe (wcag2a/aa) on 10 template pages: 0 critical. Labelled header navs. Raised faint text (`text-white/40`, `text-mist/60-80`). Remaining *serious* contrast hits are spec-mandated `text-zinc-500` micro-labels — see Known issues |
| T-903 | [x] | Performance budgets (LCP/CLS/TBT) mobile + desktop | Budgets met | `e2e/perf.spec.ts`: LCP 0.4–1.5 s, CLS 0.000 on /, /events, /games, venue (local prod build, unthrottled) |
| T-904 | [x] | SEO: metadata, JSON-LD, sitemap, robots, OG image | | `app/sitemap.ts`, `app/robots.ts` (private routes disallowed), `app/opengraph-image.tsx`, `metadataBase` via `NEXT_PUBLIC_SITE_URL`, Organization + WebSite(SearchAction) JSON-LD, `Event` JSON-LD on event pages |
| T-905 | [x] | Playwright e2e: landing→reach Play/Sports/Games/Events/Providers; search→find event; book flow (mock); reduced-motion nav | Green | `pnpm test:e2e` (build first). Uses installed Chrome/Edge channels — no browser download. 73 passed / 2.4 min; console-clean fixture on every test |
| T-906 | [!] | Cross-browser: Chrome, Safari (mask-composite!), Firefox | | Chrome + Edge green. **Blocked:** Safari/WebKit and Firefox can't be installed in this Windows environment — test on a Mac/BrowserStack before launch |
| T-907 | [x] | Mobile pass 375/414, iOS Safari 100svh behaviour | | No horizontal overflow at 375/414 on template pages (e2e). iOS Safari itself untested (see T-906) |
| T-908 | [x] | Console/ScrollTrigger cleanup on route change (no leaks) | | e2e navigates 5 routes + back with scroll, console clean. **Fixed:** hero scroll timeline targeted `[data-hero-cover]` outside its GSAP scope → never ran + warning |
| T-909 | [~] | Final motion parity checklist (below) all ✓ | | Hero timeline fixed this session; A-ID parameter values were implemented in Phases 1–3 but not re-audited value-by-value here |

## Phase 10 — Handoff
| ID | Status | Task |
|---|---|---|
| T-1001 | [x] | README (run, structure, motion system) — `README.md` incl. Vercel deploy steps and crash-safety notes |
| T-1002 | [x] | API swap guide for NestJS backend (repo → endpoints map) — `docs/API_SWAP.md` (endpoint map, BookingError contract, what to delete) |
| T-1003 | [x] | Screenshots + short screen recording in docs/ — `docs/screenshots/*` (9 pages × 1440/375) + `booking-flow.webm`; regenerate with `node scripts/capture-screenshots.mjs` |
| T-1004 | [!] | Open decisions list reviewed with product owner — list compiled below; **needs the product owner** |

---

## Motion parity checklist (reference A-ID → Clan B component)
| A-ID | Reference effect | Clan B component | Parity |
|---|---|---|---|
| A01 | Lenis 1.2 s, gated | SmoothScrollProvider | [ ] |
| A02 | Dip-to-black .22 | CinematicPage | [ ] |
| A03/A04 | Section blur-rise + seams | CinematicSection | [ ] |
| A05/A06 | Header glass / dropdown | SiteHeader | [ ] |
| A07 | Sticky hero + curtain | ArenaHero | [ ] |
| A08–A10 | Hero scroll zoom | ArenaHero timeline | [ ] |
| A11–A17 | Shader loops, particles | ArenaCanvas | [ ] |
| A18 | Liquid lens | useLiquidLens | [ ] |
| A19 | Shader hover | ArenaCanvas | [ ] |
| A21/A47 | Word/char reveal | RevealHeadline | [ ] |
| A22/A46 | Marquees | Marquee | [ ] |
| A23 | Scroll highlight | KineticText | [ ] |
| A24/A25 | Sticky recede stack | HostStack | [ ] |
| A26–A28 | Pinned runway + bar | PlayRunway | [ ] |
| A29–A34 | Tabs + live panel | GamesMood / SportsPulse | [ ] |
| A35/A36 | Counters, chips | Intelligence | [ ] |
| A37–A45 | Topology | ClanGraph | [ ] |
| A48–A50 | Hover micro-motion | UI kit | [ ] |

## Decisions log
| # | Date | Decision | Why |
|---|---|---|---|
| D-01 | 2026-09-24 | Signal colour = logo lime #5CF111 (Mash emerald kept as `signal-alt`) | Brand match; one-line revert |
| D-02 | 2026-09-24 | Hero plate = procedural pixel-tile texture until artwork is delivered | Unblocks build; motion unchanged |
| D-03 | 2026-09-24 | Reduced-motion mode stricter than the reference | FRD §7.1 / §26.1 #11 |
| D-04 | 2026-09-24 | Mock data layer, Bengaluru fixtures, NestJS API later via repo swap | Frontend-first scope |
| D-05 | 2026-09-24 | Intelligence counters show product facts, not traction | No invented metrics |
| D-06 | 2026-09-24 | `SportsFeedItem` gains `kind: "news"` and `sportSlug`; `listSportsFeed(kind?, sportSlug?)` (API: `?kind=&sport=`) | §10 needs a News tab and per-sport feeds |
| D-09 | 2026-09-24 | Mock bookings persist in `localStorage` (`lib/data/mock/bookingStore.ts`); auth/saves likewise | Checkout → confirmation → My Clan B must survive reloads without a backend |
| D-10 | 2026-09-24 | Added `qrcode.react` for check-in QR | Correct QR encoding; tiny dependency |
| D-11 | 2026-09-24 | Deterministic `lib/format.ts` (IST, ₹ grouping) instead of `Intl` in hydrated components | Node vs browser ICU output can differ → hydration mismatch |
| D-12 | 2026-09-24 | Provider workspace is client-rendered against the repo; edits persist in `lib/data/mock/providerStore.ts` (localStorage). Seed participants are generated deterministically from each session's `booked` count | Mutations must survive reloads without a backend. Limitation: sessions created in the workspace are not visible on server-rendered public pages until the API exists |
| D-08 | 2026-09-24 | Home SportsPulse "Where to play nearby" → `/sports/{sport}#local-play` | Old links pointed at non-existent venue slugs |
| D-07 | 2026-09-24 | Freshness renders a fixed IST time in SSR HTML, then "n min ago" on the client | Avoids hydration mismatch from `Date.now()` |

## Open questions (for the product owner)
- **Colour contrast vs spec:** keep spec'd `text-zinc-500` micro-labels (axe *serious* contrast) or lift to `zinc-400`?
- **Commercial terms:** payout model is mocked as base − discounts − 2% processing, weekly; platform fee 5% + 18% GST charged to players.
- **Promo codes:** `FIRSTGAME` (10%) and `CLANB20` (20%) are demo codes — confirm or remove.
- **Hold window:** 10 minutes; max 4 seats per booking.
- **Legal copy:** all `/legal/*` pages carry "TODO legal review".
- **Sports data:** feed is labelled "Sample data" until a licensed provider is chosen.
- Confirm the contact email (`hello@clanb.in`?).
- Launch city and first 2–5 categories.
- Final hero artwork brief approval (MASTER_PROMPT §7.5).
- Booking mode per service type; payment provider.

## Known issues
- Safari/Firefox not tested (T-906). mask-composite and 100svh need a real Safari check.
- axe *serious* colour-contrast remains on spec-mandated `text-zinc-500` 10–11px labels (e.g. §8.4 freshness footer). Changing them deviates from §5/§8 — product owner to decide.
- Console: `THREE.Clock deprecated` warning is emitted inside @react-three/fiber 9 (not our code); allow-listed in e2e.
- Deploy safety: hero canvas wrapped in `WebGLGuard` (no WebGL / canvas error → static plate); `app/error.tsx` + `app/global-error.tsx`; all localStorage reads try/catch + shape-checked.
- Link crawl (prod build, 479 URLs): no broken links. `/provider` (workspace) is linked only from the apply success state until Phase 8.
- Local machine hits Windows commit-limit OOM when dev server + build run together; stop the dev server before `pnpm build`.
- Full-page visual screenshot capture is blocked because the Playwright headless-shell download from the CDN resets/times out in this environment. The downloaded Chromium executable also exits before capturing because its GPU process is unusable here.

## Session log
| Date | Tool / model | Tasks | Notes |
|---|---|---|---|
| | | | |
| 2026-09-24 | Codex | Audit / repair | `typecheck`, `lint`, and production build are clean. Added keyboard focus trapping and focus restoration for Dialog/Sheet, a skip link and main landmarks, and removed a render-time header state update. The remaining roadmap (Phase 3 acceptance through Phase 10) is still incomplete. |
| 2026-09-24 | Codex | T-301–T-313 audit, T-401 | Confirmed existing S1–S11 implementation against the source spec and recorded the blocked screenshot review. Added typed domain contracts in `lib/data/types.ts`; `typecheck`, `lint`, and production build pass. |
| 2026-09-24 | Claude Code (Opus 5.5) | T-506 | `/sports` + 8 `/sports/[sport]` pages SSG. Expanded sports feed fixture (16 items incl. cricket/news). `Tabs` gained optional `idPrefix` for aria-controls. typecheck/lint/build clean; dev console clean; all 30 in-page links 200, unknown sport 404; checked at 375 and 1440. Reduced-motion path uses the same matchMedia guard as the other components but was not emulated in the browser. |
| 2026-09-24 | Claude Code (Opus 5.5) | T-507–T-512 | Phase 5 complete. Gates: typecheck/lint/build clean (114 pages). Prod crawl of 172 URLs: all Phase 5 routes 200, unknown URLs 404. Browser: games filters, palette keyboard flow, report form validation + success, console clean. |
| 2026-09-24 | Claude Code (Opus 5.5) | T-601–T-606 | Phase 6 complete. Browser E2E on prod build: event checkout (sign-in → hold → declined card → promo → pay → QR/receipt), My Clan B persistence + cancel, full event → waitlist, hold expiry (clock fast-forward), venue slot booking. Found/fixed: past slots were bookable. Console clean. |
| 2026-09-24 | Claude Code (Opus 5.5) | T-701–T-705 | Phase 7 complete. Crawl 479 URLs clean. Wizard E2E: validation per step, resume after reload, file pick, submit clears draft. Also: footer Chapters links were `#id` (dead on interior pages) → `/#id`. |
| 2026-09-24 | Claude Code (Opus 5.5) | T-801–T-809 | Phase 8 complete. Crawl 489 URLs clean. Browser: org switch, AI draft → publish, check-in persists across reload, announcement validation + send, hours validation, blackout add/remove, session cancel, bookings filters, payouts, insights; console clean. Fixed: "every Friday" not weekly, payout period extending into the future (seed bookings dated in future), Today page title template, mobile nav scrollbar. |
| 2026-09-24 | Claude Code (Opus 5.5) | T-901–T-909 | Phase 9. Playwright + axe suite green (73). Fixed: hero timeline scope bug, dip overlay under reduced motion, logo preload warning, unlabelled navs, faint text. Added WebGL guard + error boundaries for Vercel. |
| 2026-09-24 | Claude Code (Opus 5.5) | T-1001–T-1004 | README with Vercel guide, API swap guide, screenshots + booking recording (first full-page home capture). Open decisions compiled. |
