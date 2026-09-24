# CLAN B WEBSITE — MASTER BUILD PROMPT (for Antigravity or any coding AI)

> Paste this whole file as the first message of the build session. Put the whole `clanb-site-kit/` folder in the repo root first, because this prompt refers to files inside it.
> This prompt is the **single source of truth** for *what* to build. `PROJECT_TRACKER.md` is the single source of truth for *what is done*. `AGENTS.md` holds the rules that apply to every session.

---

## 0. YOUR ROLE AND THE PRIME DIRECTIVES

You are a senior frontend engineer and motion developer. You are building the **public website and frontend** for **Clan B**, a game-tech platform, in **Next.js (App Router) + TypeScript**.

Four rules come before everything else:

1. **Visual and motion replica.** The site must reproduce the fonts, dark theme, layout system and every animation of **https://mashtechnologies.co** as closely as possible. The exact values below were read from that site's shipped code and are not approximations. Do **not** "improve", simplify or reinterpret them. The only deliberate differences are:
   - the brand accent colour, which comes from the Clan B logo;
   - Clan B content and logo;
   - a stricter reduced-motion mode, which the Clan B FRD requires (§12.4).
2. **Frontend first, and finish it.** Build every public page and the key logged-in and provider screens as working UI on a typed mock-data layer. Real backend and payments are out of scope. The data layer must be swappable for the real NestJS API later (§14).
3. **The product is not the agency.** Clan B is a multi-sided platform for playing, hosting and running **board games and sports**. Players discover and book. Vendors, facilitators, venues and organizers host and run. Clan B also runs official events. Every piece of copy and every section must sell *that*. See §2.
4. **No context rot.** Before each work session:
   - read `AGENTS.md`;
   - read `PROJECT_TRACKER.md`;
   - read the section of this prompt for the task you are on.

   After each task, update the tracker. Never mark something done unless it meets its acceptance criteria.
5. **Autonomous, fast, continuous execution.** Complete the **entire project end-to-end in one continuous run**:
   - Do **not** stop after a task or phase to report, summarise or ask for confirmation.
   - Update the tracker silently and move straight to the next task.
   - Stop only if you hit a true blocker that no default in §17 resolves. If that happens, log it as `[!]` in the tracker, work around it with the closest safe default, and keep going.
   - Report to the user **once, at the very end** (§18).
6. **Zero bugs is a hard requirement.** Speed must never come from skipping verification.
   - Every task passes the §15 gates **before** you move on.
   - Fix every error, warning and failing check the moment it appears. Never defer a known bug to "later".
   - Finish with the full run-and-fix pass in §18.

---

## 1. KIT CONTENTS (already in repo root)

```
clanb-site-kit/
  MASTER_PROMPT.md                         ← this file
  PROJECT_TRACKER.md                       ← task status, decisions, session log (update constantly)
  AGENTS.md                                ← persistent rules for any AI session (copy to repo root)
  brand/clanb-logo.svg                     ← wordmark, white letters + lime "b" (for dark bg)
  brand/clanb-logo-currentcolor.svg        ← same, letters use currentColor
  docs/reference/mash-motion-forensics.md  ← full forensic report of the reference site (A01–A50 animation IDs)
```

In Session 1:
- copy `AGENTS.md` to the repo root;
- move the SVGs to `public/brand/`;
- keep `docs/` in the repo.

---

## 2. UNDERSTAND THE PRODUCT (from the Clan B Product + Functional Requirements Document v0.1, 24 Sep 2026)

**Product sentence:** *Clan B is technology for playing, hosting and running games and sports — making it easier to join and easier to operate.*
**Positioning:** Sports + Board Games Technology Platform. It is a service-led, multi-sided platform for people, vendors, facilitators, venues and organizers.
**Brand tagline:** "The future of games." The founder's framing is **"gamify tech"**: technology that makes play easy, plus a place for vendors to host.
**Company:** CLANB TECH SOLUTIONS PRIVATE LIMITED. Offices in Bengaluru (registered) and Chennai.

**North-star loop:** Discover → Decide → Book → Attend → Complete → Rebook / Follow → Host / Organize → More supply → Better recommendations → More participation.

**Audiences and promises:**

| Audience | Clan B promise |
|---|---|
| Player | Find something worth doing and book it with confidence. |
| Fan | Follow sports and turn interest into participation. |
| Vendor / facilitator | Launch and manage sessions/events without operational chaos. |
| Venue / café | Turn available space and time into structured, bookable inventory. |
| Organizer | Run tournaments/leagues and participant operations from one system. |
| Clan B | Operate marketplace, media and managed-event services on the same platform. |

**Service types (booking unit):**
- Open session (seat)
- Private session (block/table/court/room)
- Event (ticket)
- Tournament (entry/team/slot)
- League/season (membership)
- Venue resource (resource-time slot)
- Coaching/guided play (appointment)
- Custom event (request/quote)
- Clan B official service

**Principles that affect the UI:**
- Browse first, sign in only when necessary.
- AI appears as small inline actions, **never a chatbot**.
- Trust is product: verification, policies and reviews are visible.
- Content leads to action: every article or sport page links to follow, discover or play.
- Design for both sides: every demand feature has a supply counterpart.
- Liquidity before breadth: one city and a few categories first. The launch city is TBD; use **Bengaluru** in mock data.
- The public website can be cinematic. **Operational dashboards must be dense, fast and task-focused, with no scroll theatrics.**

**Event lifecycle:** Draft → Pending review → Published → Open → Full / Waitlist → Live → Completed → Archived, plus an explicit Cancelled state.
**Booking states:** draft, pending, held, confirmed, cancelled, completed, no-show, refunded.
**Payment states:** initiated, pending, paid, failed, partially refunded, refunded.

---

## 3. TECH STACK (pin these)

- **Next.js** (latest stable, App Router, RSC) + **React 19** + **TypeScript `strict: true`**.
- **Tailwind CSS v4** (CSS-first `@theme`, oklch palette, `color-mix`). There is no `tailwind.config.js` unless it is needed for plugins.
- **gsap** + **ScrollTrigger** + **@gsap/react** (`useGSAP`).
- **lenis** (smooth scroll).
- **three** + **@react-three/fiber** (v9, React 19 compatible) for the hero canvas. Import it with `next/dynamic` and `ssr:false`.
- **lucide-react** (icons), **clsx** + **tailwind-merge** (`cn()` helper).
- **next/font/google** for fonts (§4).
- Forms: **react-hook-form** + **zod**. Dates: **date-fns**.
- Package manager **pnpm**. Tooling:
  - ESLint (next config) + Prettier;
  - **Playwright** for smoke and e2e tests;
  - `@next/bundle-analyzer` (optional).
- No UI kit (no shadcn default styling, no MUI). Every component is hand-built to the spec below.

Folder structure:

```
app/
  layout.tsx               fonts, <SmoothScrollProvider>, <SiteHeader>, <CinematicPage>, JSON-LD
  page.tsx                 home (server component composing client sections)
  (public)/play/…  events/…  venues/…  sports/…  games/…  clubs/…  for-providers/…  about/  help/…  legal/…  search/
  (auth)/login  signup
  (account)/me/…           My Clan B (mock auth)
  (provider)/provider/…    Provider workspace (dense UI)
  sitemap.ts  robots.ts  not-found.tsx  opengraph-image.tsx
components/
  motion/                  SmoothScrollProvider, CinematicPage, CinematicSection, RevealHeadline, KineticText, Marquee
  hero/                    ArenaHero, ArenaCanvas (R3F), useLiquidLens
  home/                    PlayRunway, HostStack, SportsPulse, GamesMood (+ Playbook), Intelligence (+ ClanGraph), Community, Trust, FinalCta
  layout/                  SiteHeader, SiteFooter, PageHero, Section
  ui/                      Button, Pill, Chip, Card, Tabs, Input, Select, Badge, Stat, EmptyState, Skeleton, Dialog, Sheet
  discovery/ booking/ provider/ account/
lib/
  cn.ts  motion.ts (shared constants)  seo.ts
  data/types.ts            domain types (§14)
  data/mock/*.ts           fixtures
  data/repo.ts             repository interface + mock implementation
content/                   all marketing copy as typed TS objects (never hard-code copy inside components)
public/brand/  public/hero/
docs/                      decisions, reference, screenshots
```

---

## 4. TYPOGRAPHY (exact replica)

```ts
// app/fonts.ts
import { Syne, DM_Sans, JetBrains_Mono } from "next/font/google";
export const display = Syne({ subsets: ["latin"], weight: ["400","500","600","700","800"], variable: "--font-display", display: "swap" });
export const body    = DM_Sans({ subsets: ["latin"], variable: "--font-body", display: "swap" });
export const mono    = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });
// <html className={`${display.variable} ${body.variable} ${mono.variable}`}>
```

**Font roles:**
- **Syne 600:** every heading, the logo text fallback, stat numbers and big marquee words.
- **DM Sans:** body and UI.
- **JetBrains Mono:** index labels ("01 / 05"), console visuals and signal feeds.

**Type scale (use these exact utilities):**

| Role | Classes |
|---|---|
| Eyebrow | `text-xs uppercase tracking-[0.28em] text-signal` (hero: `text-[10px] tracking-[0.24em] sm:text-xs sm:tracking-[0.32em]`) |
| Hero H1 | `font-display font-semibold text-[1.85rem] min-[400px]:text-4xl sm:text-5xl md:text-6xl lg:text-[3.75rem] leading-[1.08] tracking-tight max-w-[16ch] sm:max-w-[14ch] drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]` |
| Section H2 | `font-display font-semibold tracking-tight text-balance text-3xl md:text-5xl` (compact variant `text-2xl sm:text-3xl md:text-5xl`; CTA `text-4xl md:text-6xl`) |
| Card H3 | `font-display text-2xl sm:text-3xl md:text-5xl font-semibold tracking-tight` |
| Mission statement | `font-display font-semibold text-balance tracking-tight leading-[1.15] text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl` |
| Body | `text-sm md:text-base leading-relaxed text-mist` (hero sub `sm:text-base md:text-lg`) |
| Pill tag | `rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-mist` |
| Micro label | `text-[10px] uppercase tracking-[0.18em–0.28em] text-zinc-400/500` |
| Stat | `font-display text-4xl md:text-5xl font-semibold` with suffix `text-signal` |
| Split-text words | each word `inline-block mr-[0.28em] last:mr-0`, with the gradient `bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent` |

**Body base:** `-webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;`

---

## 5. THEME TOKENS (Tailwind v4 `@theme` in `app/globals.css`)

The Mash token structure is kept exactly. **Only `--color-signal` changes: it becomes the Clan B logo lime.**

```css
@import "tailwindcss";

@theme {
  --font-display: var(--font-display), "Syne", ui-sans-serif, system-ui, sans-serif;
  --font-body: var(--font-body), "DM Sans", ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-mono), "JetBrains Mono", ui-monospace, monospace;

  --color-ink: #030706;        /* page bg (Mash exact) */
  --color-ink-soft: #071210;   /* alternate section bg */
  --color-panel: #050a09;      /* data panels */
  --color-mist: #A8A29E;       /* muted text */
  --color-signal: #5CF111;     /* CLAN B LIME (logo) — Mash used #10B981 */
  --color-signal-alt: #10B981; /* Mash emerald, kept for secondary accents */
  --color-glow: #06B6D4;       /* cyan secondary (Mash exact) */
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
.noise-overlay::before { content:""; pointer-events:none; position:absolute; inset:0; opacity:.035; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }
.section-seam-fade { mask-image: linear-gradient(transparent, #000 12% 88%, transparent); }

@keyframes marquee-x { from { transform: translateX(0) } to { transform: translateX(-50%) } }
.marquee-track { animation: marquee-x 42s linear infinite; }
.marquee-track-slow { animation-duration: 55s; }

.hero-veil-blend { background: linear-gradient(#030706 0 38%, #030706eb 52%, #0307068c 68%, transparent 86%); }
@media (min-width: 768px) { .hero-veil-blend { background: linear-gradient(118deg, #030706 0 28%, #030706eb 42%, #03070666 56%, transparent 72%); } }

@media (prefers-reduced-motion: reduce) { .marquee-track, .marquee-track-slow { animation: none; } }
```

**Colour substitution rule.** Wherever the Mash spec uses emerald, do the following:
- `#10B981`, `emerald-400` and `emerald-500` become `signal` / `#5CF111`.
- `rgba(16,185,129,a)` and `rgba(61,255,154,a)` become `rgba(92,241,17,a)`, keeping the same alpha.
- Cyan (`#06B6D4`, `cyan-400`) stays the same.
- Amber-600 (hero tagline) stays the same.
- White-alpha borders and zinc greys stay the same.

**Signature surfaces (exact values, lime-substituted):**
- **Card:** `rounded-[20px] sm:rounded-[28px] border border-zinc-800/80 bg-zinc-950 p-5 sm:p-6 md:p-10 shadow-[0_24px_80px_rgba(0,0,0,0.55)]`, with an accent wash `radial-gradient(ellipse at 20% 0%, {accent}22, transparent 45%)` at `opacity-40`.
- **Panel:** `rounded-2xl border border-white/10 bg-panel`. Dot texture: `radial-gradient(rgba(255,255,255,.45) .55px, transparent .55px)`, 16px at opacity .14.
- **Section washes:**
  - `radial-gradient(at top, rgba(92,241,17,.08), transparent 45%)`;
  - `radial-gradient(at bottom, rgba(92,241,17,.10), transparent 50%)`;
  - `radial-gradient(at 50% 40%, rgba(92,241,17,.13), transparent 52%), radial-gradient(at 85% 15%, rgba(6,182,212,.08), transparent 42%)`.
- **Glass:**
  - header `bg-ink/80 backdrop-blur-xl`;
  - dropdown `bg-ink-soft/95 backdrop-blur-xl`;
  - ghost button `bg-[#030706]/40 backdrop-blur-sm`.
- **Hero cover sheet:** `rounded-t-[1.75rem] md:rounded-t-[2.5rem] border-t border-white/10 bg-[#030706] shadow-[0_-40px_100px_rgba(0,0,0,0.75)]`.
- **Accent palette for items (in order):** `#5CF111, #06B6D4, #D97706, #34D399, #5EEAD4, #A78BFA, #F59E0B, #38BDF8, #FB7185, #84CC16`.

**Buttons (exact):**
- **Primary:** `inline-flex items-center gap-2 rounded-full bg-signal px-6 py-3 text-sm font-semibold text-ink transition hover:bg-white`. The hero variant uses `py-3.5` with `hover:bg-glow`.
- **Ghost:** `rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white transition duration-300 hover:border-white/30 hover:bg-white/10`.
- **Hero ghost:** `rounded-full border border-zinc-700/80 bg-[#030706]/40 px-6 py-3.5 text-sm text-zinc-200 backdrop-blur-sm hover:border-signal/50 hover:text-white`.
- **Signal ghost:** `rounded-full border border-signal/40 bg-signal/10 px-5 py-3 text-sm font-medium text-signal hover:bg-signal/20`.
- **Arrow icon:** lucide `ArrowUpRight`, `h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5`.

**Logo:** render `/public/brand/clanb-logo.svg` through `next/image` or an inline SVG component.
- Header: height 22–26px.
- Footer: height 36px.
- Keep the lime "b". Never recolour it. Never place it on a light background.
- The wordmark is built on a 45-unit pixel-tile grid. This is the brand's "gamified" motif, and §7 uses it only in the hero texture.

---

## 6. GLOBAL MOTION SYSTEM (replicate exactly — IDs refer to `docs/reference/mash-motion-forensics.md`)

Put all shared constants in `lib/motion.ts`. Register `ScrollTrigger` once. Wrap every effect in `useGSAP(() => {...}, { scope })` or `gsap.context` and revert it on unmount. Gate desktop behaviour with `gsap.matchMedia()`.

### 6.1 SmoothScrollProvider (A01)
```ts
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const touch  = matchMedia("(hover: none) and (pointer: coarse)").matches;
const small  = matchMedia("(max-width: 1023px)").matches;
const refresh = () => ScrollTrigger.refresh();
if (reduce || touch || small) { requestAnimationFrame(refresh); addEventListener("load", refresh); addEventListener("resize", refresh); setTimeout(refresh, 400); return; }
const lenis = new Lenis({ duration: 1.2, smoothWheel: true, syncTouch: false, touchMultiplier: 1.2, wheelMultiplier: 1, autoResize: true });
lenis.on("scroll", ScrollTrigger.update);
const tick = (t: number) => lenis.raf(t * 1000);
gsap.ticker.add(tick); gsap.ticker.lagSmoothing(0);
requestAnimationFrame(refresh); addEventListener("load", refresh); setTimeout(refresh, 400);
// expose lenis via React context; cleanup: remove listeners, ticker.remove, lenis.destroy()
```

### 6.2 CinematicPage — dip-to-black between chapters (A02)
A fixed overlay `div.pointer-events-none.fixed.inset-0.z-[35].bg-[#030706].opacity-0` (aria-hidden) is rendered after the page. After 180 ms:
- collect `[data-cinematic]`; if there are fewer than 2, stop;
- set the overlay opacity to 0;
- for every element except index 0:
```ts
gsap.timeline({ scrollTrigger: { trigger: el, start: "top 98%", end: "top 60%", scrub: 1 } })
  .fromTo(overlay, { opacity: 0 }, { opacity: 0.22, duration: 0.4, ease: "none" })
  .to(overlay, { opacity: 0, duration: 0.6, ease: "none" });
```
Call `ScrollTrigger.refresh()` after setup. The header (z-50) stays above the overlay.

### 6.3 CinematicSection — section wrapper (A03, A04)
Props: `id?`, `className?`, `fadeTop = true`, `fadeBottom = true`, `motion = true`.

Markup:
```html
<div id data-cinematic class="relative">
  top fade:    <div aria-hidden class="pointer-events-none absolute inset-x-0 top-0 z-20 h-16 bg-gradient-to-b from-[#030706] to-transparent md:h-24"/>
  <div ref=inner class="relative z-[1] will-change-[transform,opacity,filter]">{children}</div>
  bottom fade: <div aria-hidden class="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-16 bg-gradient-to-t from-[#030706] to-transparent md:h-24"/>
</div>
```

Animation:
```ts
gsap.fromTo(inner, { opacity: .35, y: 40, filter: "blur(10px)" },
  { opacity: 1, y: 0, filter: "blur(0px)", ease: "power2.out",
    scrollTrigger: { trigger: wrapper, start: "top 85%", end: "top 45%", scrub: .8, immediateRender: false } });
```

### 6.4 RevealHeadline (A21, A47)
Props: `text`, `as = "h2"`, `className`, `split: "word" | "char"`.

Structure:
- Split the text on whitespace. Render each word as `span.mr-[0.28em].inline-block.max-w-full.last:mr-0.[overflow-wrap:anywhere]`.
- Inside each word, render either one unit per word, or one unit per character (`Array.from(word)`).
- Each unit is `span[data-reveal-unit].inline-block.bg-gradient-to-b.from-white.to-zinc-400.bg-clip-text.text-transparent.will-change-[opacity,transform,filter]`.
- Put `aria-label={text}` on the heading element.
- Base classes: `font-display font-semibold tracking-tight text-balance`.

Animation:
```ts
gsap.set(units, { opacity: .18, filter: "blur(3px)", y: 12 });
gsap.to(units, { opacity: 1, filter: "blur(0px)", y: 0, ease: "power2.out",
  stagger: split === "char" ? .018 : .045,
  scrollTrigger: { trigger: el, start: "top 75%", end: "top 25%", scrub: .65 } });
```

### 6.5 KineticText (A23)
Props: `text`, `mode: "scroll-highlight" | "split-up"`, `className`. The element is a `<p>` with `font-display text-balance leading-[1.15] tracking-tight` and `aria-label`.

**`scroll-highlight`:**
- Words are `span[data-word].mr-[0.28em].inline-block`, each wrapping a gradient `span`.
- Animation:
```ts
gsap.set(words, { opacity: .18, filter: "blur(3px)" });
gsap.to(words, { opacity: 1, filter: "blur(0px)", ease: "none", stagger: .28,
  scrollTrigger: { trigger: el, start: "top 75%", end: "top 25%", scrub: .65 } });
```

**`split-up`:**
- Each word wrapper is `overflow-hidden align-bottom`, with an inner `span[data-word-inner].inline-block`.
- Animation:
```ts
gsap.set(inner, { yPercent: 110, rotate: 5, transformOrigin: "50% 100%" });
gsap.to(inner, { yPercent: 0, rotate: 0, ease: "power3.out", stagger: .03,
  scrollTrigger: { trigger: el, start: "top 80%", toggleActions: "play none none reverse" } });
```

### 6.6 Marquee (A22, A46)
- Duplicate the item list (`[...items, ...items]`) inside `div.marquee-track.flex.w-max`.
- Add left and right edge fades: `pointer-events-none absolute inset-y-0 left|right-0 z-10 w-16 md:w-28 bg-gradient-to-r|l from-{ink|ink-soft} to-transparent`.
- Default speed is 42 s. `slow` uses 55 s.

### 6.7 SiteHeader (A05, A06)
- `header.fixed.inset-x-0.top-0.z-50.transition-colors.duration-300`:
  - on `/` while `scrollY <= 24`: `bg-transparent`;
  - otherwise: `border-b border-white/10 bg-ink/80 backdrop-blur-xl`.
- Use a passive scroll listener.
- Inner row: `page-shell page-x flex h-[72px] items-center justify-between`.
- Dropdown panel: `absolute left-1/2 top-full w-[360px] -translate-x-1/2 pt-4 transition`, toggling `opacity-0 pointer-events-none` ↔ `opacity-100 pointer-events-auto` on mouseenter/leave. The inner box is `max-h-[min(70vh,420px)] overflow-y-auto rounded-2xl border border-white/10 bg-ink-soft/95 p-3 shadow-2xl backdrop-blur-xl`. Items are `block rounded-xl px-3 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white`.
- Links: `text-sm text-white/70 hover:text-white` (active route `text-white`).
- Mobile (`lg:hidden`):
  - a 40px round bordered burger that swaps Menu/X and locks `body.style.overflow`;
  - the drawer is `max-h-[calc(100dvh-72px)] overflow-y-auto border-t border-white/10 bg-ink/95 page-x py-6 backdrop-blur-xl`;
  - accordion chevrons use `rotate-180`;
  - close the drawer on route change.

### 6.8 Interaction micro-motion (A48–A50)
- All colour and border hovers use Tailwind's default `transition` (150 ms, cubic-bezier(.4,0,.2,1)). Group arrows use 300 ms.
- There is no custom cursor, no magnetic buttons and no cursor trail.

---

## 7. THE HERO — "ArenaHero" (replica of Mash BioTechHero, A07–A20)

### 7.1 Layer structure
```html
<main class="relative bg-ink">
  <section data-cinematic class="sticky top-0 z-0 h-[100svh] min-h-[560px] overflow-hidden bg-[#030706]">
    <div ref=canvasWrap class="absolute inset-0 z-0 origin-center will-change-transform">
      <div class="absolute inset-0 overflow-hidden bg-[#030706]">
        <ArenaCanvas class="h-full w-full" onReady={api => canvasApi.current = api}/>   <!-- dynamic, ssr:false, fallback = static plate at opacity .5 -->
        <div class="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#030706]/60 to-transparent"/>
        <div class="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#030706]/75 to-transparent"/>
      </div>
    </div>
    <div ref=veil aria-hidden class="pointer-events-none absolute inset-0 z-[2] hero-veil-blend"/>
    <div class="relative z-10 page-shell page-x flex h-full items-end pb-10 pt-24 sm:items-center sm:py-28">
      <div ref=copy class="relative w-full max-w-xl will-change-transform lg:max-w-2xl"> …copy (§9 S0)… </div>
    </div>
  </section>
  <div data-hero-cover data-cinematic class="relative z-20 -mt-1">
    <div class="relative rounded-t-[1.75rem] border-t border-white/10 bg-[#030706] shadow-[0_-40px_100px_rgba(0,0,0,0.75)] md:rounded-t-[2.5rem]">
      …ALL other home sections…
    </div>
  </div>
</main>
```
The hero copy is **static on load**: there is no entrance animation, matching the reference.

### 7.2 Scroll timeline (md+ only, inside `gsap.matchMedia().add("(min-width: 768px)")`)
```ts
const proxy = { p: 0 };
gsap.timeline({ scrollTrigger: { trigger: "[data-hero-cover]", start: "top bottom", end: "top top", scrub: 1 } })
  .to(copy,       { y: -48, opacity: .35, ease: "none", duration: 1 }, 0)
  .to(canvasWrap, { scale: 1.06,          ease: "none", duration: 1 }, 0)
  .to(proxy, { p: 1, duration: 1, ease: "none",
      onUpdate: () => { canvasApi.current?.setZoom(.65 * proxy.p); canvasApi.current?.setPulse(.3 + .45 * proxy.p); } }, 0);
requestAnimationFrame(() => ScrollTrigger.refresh());
```

### 7.3 Liquid-lens cursor mask on the veil (A18), md+ only
Implement this in `useLiquidLens(sectionRef, veilRef)`, using the exact maths below.
```ts
const target = { x: 28, y: 45, active: 0 }, cur = { x: 28, y: 45, size: 0 }, trail = { x: 28, y: 45 };
let raf = 0, px = 28, py = 45;
function paint() {
  if (cur.size <= 1) { veil.style.maskImage = veil.style.webkitMaskImage = "none"; return; }
  const t = performance.now() / 1000, s = cur.size * (1 + .08 * Math.sin(2.4 * t));
  const v = Math.min(2.2 * Math.hypot(cur.x - px, cur.y - py), 1), st = 1 + .55 * v, sq = 1 - .22 * v;
  const o1x = 8*Math.cos(1.5*t), o1y = 6*Math.sin(1.8*t), o2x = -10*Math.cos(1.1*t+1.2), o2y = 8*Math.sin(1.35*t+.6), o3x = 7*Math.sin(1.7*t+2.1), o3y = -5*Math.cos(1.25*t+1.4);
  const stops = "transparent 0%, transparent 20%, rgba(0,0,0,0.3) 48%, rgba(0,0,0,0.65) 74%, #000 100%";
  const stopsTrail = "transparent 0%, transparent 10%, rgba(0,0,0,0.4) 42%, rgba(0,0,0,0.78) 70%, #000 100%";
  const m = [
    `radial-gradient(ellipse ${1.05*s*st}px ${.72*s*sq}px at calc(${cur.x}% + ${o1x}px) calc(${cur.y}% + ${o1y}px), ${stops})`,
    `radial-gradient(ellipse ${.78*s*sq}px ${.98*s*st}px at calc(${cur.x}% + ${o2x}px) calc(${cur.y}% + ${o2y}px), ${stops})`,
    `radial-gradient(ellipse ${.92*s}px ${.70*s}px at calc(${trail.x}% + ${o3x}px) calc(${trail.y}% + ${o3y}px), ${stopsTrail})`,
  ].join(", ");
  veil.style.webkitMaskImage = veil.style.maskImage = m;
  veil.style.webkitMaskComposite = "multiply"; (veil.style as any).maskComposite = "intersect";
}
function loop() { if (raf) return; const step = () => {
  px = cur.x; py = cur.y;
  cur.x += (target.x - cur.x) * .085; cur.y += (target.y - cur.y) * .085;
  trail.x += (cur.x - trail.x) * .055; trail.y += (cur.y - trail.y) * .055;
  const goal = target.active ? 168 : 0; cur.size += (goal - cur.size) * .12; paint();
  const moving = Math.abs(target.x-cur.x)>.02 || Math.abs(target.y-cur.y)>.02 || Math.abs(cur.x-trail.x)>.04 || Math.abs(goal-cur.size)>.4 || cur.size>1;
  raf = moving ? requestAnimationFrame(step) : 0; if (!moving && cur.size <= 1) paint(); };
  raf = requestAnimationFrame(step); }
onPointerMove(e => { const r = section.getBoundingClientRect(); const x = (e.clientX-r.left)/r.width*100, y = (e.clientY-r.top)/r.height*100;
  target.x = x; target.y = y; target.active = x < 62 ? 1 : 0; loop(); });
onPointerLeave(() => { target.active = 0; loop(); });
```

### 7.4 ArenaCanvas (R3F), a replica of LizardTechCanvas with Clan B content
- The canvas setup:
  - `<Canvas dpr={[1, 1.75]} camera={{ position: [0,0,5], fov: 40 }} gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}>`
  - `<color attach="background" args={["#030706"]}/>`
  - `<ambientLight intensity={.4}/>`
- The component exposes an imperative API `{ setZoom(v), setPulse(v) }` through `onReady`. It keeps these refs: `zoom = 0`, `pulse = .35`, `hover = 0`.
- Pointer enter and leave on the canvas wrapper:
  - **enter:** `hover = 1`, `pulse = .9`;
  - **leave:** `hover = 0`, `pulse = .35`.

**Plane mesh.**
- Geometry: `planeGeometry(1.1*viewport.width, 1.1*viewport.height)` inside a `group`.
- Idle motion runs in `useFrame`:
  - `rotation.y = .06 sin(.35t) + .08·hover`
  - `rotation.x = .03 cos(.28t) − .04·hover`
  - `rotation.z = .015 sin(.2t)`
  - `k = (1 + .18·zoom)(1 + .014 sin(1.5t)(.5 + pulse))`
  - `scale = (k(1 + .08·zoom), k(1 + .12·zoom), 1)`
- Uniforms: `uHover` lerps toward the hover ref at `.07` per frame.

**ShaderMaterial.** The uniforms are:
- `uMap`, `uTime`, `uZoom`, `uPulse`, `uHover`;
- `uResolution`, `uImageSize`;
- `uSignal = #5CF111`, `uCyan = #06B6D4`.

The vertex shader passes `vUv`. Use this fragment shader verbatim; the only change from the reference is that the emerald uniform is renamed to `uSignal`:
```glsl
precision highp float;
varying vec2 vUv;
uniform sampler2D uMap; uniform float uTime, uZoom, uPulse, uHover; uniform vec2 uResolution, uImageSize; uniform vec3 uSignal, uCyan;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453123); }
vec2 coverUv(vec2 uv, vec2 res, vec2 img){ float sa = res.x/max(res.y,1.0), ia = img.x/max(img.y,1.0); vec2 s = vec2(1.0);
  if (sa > ia) s.y = ia/sa; else s.x = sa/ia; return (uv-0.5)*s+0.5; }
void main(){
  float z = mix(1.0, 1.45, clamp(uZoom,0.0,1.0));
  vec2 uv = coverUv(vUv, uResolution, uImageSize);
  uv -= 0.5; uv *= 1.0/z; uv.x += 0.05;
  uv.x += sin(uTime*0.12)*0.008*(0.4+uHover); uv.y += cos(uTime*0.1)*0.006; uv += 0.5;
  vec4 tex = texture2D(uMap, clamp(uv, 0.001, 0.999));
  float glowMask = smoothstep(0.12, 0.52, max(tex.g, tex.b) - tex.r*0.35);
  vec2 rainUv = vec2(uv.x*55.0, uv.y*90.0 - uTime*6.0);
  float col = hash(vec2(floor(rainUv.x), 0.0));
  float stream = step(0.62, col) * step(0.7, fract(rainUv.y + col*4.0 + uTime)) * smoothstep(0.18, 0.85, glowMask);
  float d = length(uv - vec2(0.58, 0.5));
  float ring = smoothstep(0.02, 0.0, abs(d - fract(uTime*0.15)*0.55)) * (0.35 + uPulse*0.45);
  float n1 = smoothstep(0.992, 1.0, sin(uv.x*48.0 + uTime*0.25) * sin(uv.y*36.0));
  float arc = smoothstep(0.012, 0.0, abs(uv.y - 0.42 - 0.04*sin(uv.x*9.0 + uTime*0.35)));
  arc += smoothstep(0.01, 0.0, abs(uv.x - 0.62 - 0.03*cos(uv.y*8.0)));
  vec3 color = tex.rgb;
  color += mix(uSignal, uCyan, 0.55) * glowMask * (0.12 + uPulse*0.18 + uHover*0.14);
  color += uCyan * stream * 0.4;
  color += uSignal * ring * glowMask;
  color += mix(uCyan, uSignal, 0.4) * (n1*0.45 + arc*0.2);
  float vig = smoothstep(1.2, 0.28, length((vUv-0.5)*vec2(1.12,1.05)));
  color *= mix(0.62, 1.0, vig); color = pow(color, vec3(0.96));
  gl_FragColor = vec4(color, 1.0);
}
```
Texture settings: `colorSpace = SRGBColorSpace`, `anisotropy = 8`, wrap `ClampToEdgeWrapping`.

**Particles.**
- **A:** 110 points, positions `x∈±3`, `y∈±2`, `z∈[−1.6, −0.2]`, `size .018`, `color #06B6D4`, `opacity .55`, `depthWrite false`. In `useFrame`: `rotation.y = .03t`, `scale = 1 + .15·zoom`.
- **B:** 40 points, `x = (rand − .15)·4.5`, `y ± 1.6`, `z ∈ [.05, .4]`, `size .03`, `color #5CF111`, `opacity .45`. In `useFrame`: `rotation.z = .04 sin(.15t)`, `opacity = .35 + .2 sin(2.2t)`.

### 7.5 Hero texture ("the arena plate")
The reference uses a photographic "bio-tech lizard" plate, and the shader's glow, rain and ring effects key off bright green and cyan areas of that texture.

- **Final asset (tracked as a design task):** `public/hero/clanb-arena.webp` at 2400×1350.
  - A dark, cinematic scene of a **game table / arena**: board-game pieces, dice, meeples and cards, plus a sports-court line hint.
  - Emissive **lime (#5CF111) and cyan** accents on the right-hand 60% of the frame.
  - Near-black (#030706) on the left 40%, where the copy sits.
  - No text and no real brand products.
- **Until the asset exists:** use `makeArenaTexture()`, which builds a procedural `THREE.CanvasTexture` at 2048×1152:
  - background `#030706`;
  - a grid of **45-unit pixel tiles** (the logo's grid): tile size ≈ 42px, gap 3px, radius 4px, colour `#0b1512`;
  - about 9% of the tiles on the right 60% are lit in lime (#5CF111 at 60–100% alpha), about 3% in cyan;
  - an oversized faint "b" glyph built from lit tiles, centred at (68%, 52%);
  - a subtle radial light at (70%, 40%);
  - the left 38% is fully dark.

  This makes the shader's glowMask, rain and rings pick up the lime tiles, which gives a gamified, pixel-board look while keeping every motion identical.
- **Loading fallback:** a static image of the same plate at `opacity-50`.

---

## 8. HOMEPAGE SECTION COMPONENTS (motion specs)

### 8.1 PlayRunway — pinned horizontal runway (A26–A28), a replica of HorizontalRunway
- **Section:** `section#play.relative.overflow-hidden.bg-ink-soft.py-16.md:box-border.md:flex.md:h-svh.md:flex-col.md:py-0`, with a wash `radial-gradient(at top, rgba(92,241,17,.08), transparent 45%)`.
- **Header row:** `relative z-10 flex page-shell shrink-0 flex-col gap-4 page-x pb-8 pt-2 md:flex-row md:items-end md:justify-between md:pb-5 md:pt-[5.75rem]`. On the right, a note in `hidden max-w-sm text-sm text-mist md:block`.
- **Track:** `flex w-full flex-col gap-6 page-x will-change-transform md:w-max md:flex-row md:gap-8`.
- **Cards:** `relative min-w-0 overflow-hidden rounded-[20px] sm:rounded-[28px] border border-white/10 bg-zinc-950/90 p-5 sm:p-6 md:min-w-[min(80vw,1100px)] md:p-10`, with a tone gradient overlay (`bg-gradient-to-br {tone}`) and inner `grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center`.
  - **Left side:**
    - category pill;
    - mono `0{i+1} / 0{n}` in `font-mono text-xs text-white/40`;
    - H3;
    - summary;
    - chips in `rounded-2xl border border-white/10 bg-black/30 page-x py-3 text-sm`;
    - a signal-ghost CTA with an arrow.
  - **Right side:** a wireframe booking-card mock:
    - `min-h-[240px] md:min-h-[320px] rounded-2xl border border-white/10 bg-black/50`;
    - a 36px grid texture at opacity .5;
    - an inner `inset-6` gradient card;
    - skeleton bars;
    - a 3-tile row.
- **Progress bar:** `h-[2px] w-full overflow-hidden rounded-full bg-white/10`. The fill is `h-full w-full origin-left scale-x-0 bg-gradient-to-r from-signal via-glow to-white will-change-transform`.
- **Motion (md+):**
```ts
gsap.set(track, { xPercent: 0 }); gsap.set(bar, { scaleX: 0, transformOrigin: "0% 50%" });
gsap.timeline({ scrollTrigger: { trigger: section, start: "top top", end: () => "+=" + Math.max(2400, .75 * track.scrollWidth), pin: true, scrub: 1, anticipatePin: 1, invalidateOnRefresh: true } })
  .to(track, { x: () => { const o = track.scrollWidth - innerWidth; return o > 0 ? -o - 40 : 0; }, ease: "none", duration: 1 }, 0)
  .to(bar, { scaleX: 1, ease: "none", duration: 1 }, 0);
```
- **Mobile (<768):** `clearProps` on the track, and `bar.scaleX = 1`, so it becomes a vertical list.

### 8.2 HostStack — sticky receding card stack (A24–A25), a replica of StickyCardStack
- **Header:**
  - eyebrow;
  - a flex row holding a RevealHeadline (word) with `mt-3 text-2xl sm:text-3xl md:text-5xl`, and a right link `text-sm text-white/60 hover:text-white`;
  - header padding `pb-6 pt-12 md:pb-0 md:pt-24`.
- **Card wrappers:** `relative flex items-center py-4 md:sticky md:top-[72px] md:h-[100svh] md:py-0`, with `style={{ zIndex: i + 1 }}`.
- **Card:** the signature card with `md:origin-top`. The inner layout is `grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:min-h-[min(58vh,560px)]`.
  - **Left:**
    - tag pill with an accent icon;
    - H3;
    - description;
    - a `ul.grid.gap-3.sm:grid-cols-2` of capabilities with 1.5px accent dots;
    - a ghost button with `md:mt-auto`.
  - **Right:** a visual panel (§9 S5).
- **Motion (md+):** for each card except the last:
```ts
gsap.fromTo(card, { scale: 1, filter: "brightness(1)" }, { scale: .94, filter: "brightness(0.55)", ease: "none",
  scrollTrigger: { trigger: card.parentElement.nextElementSibling, start: "top 85%", end: "top 25%", scrub: true, invalidateOnRefresh: true } });
```
- **Mobile:** `clearProps: "transform,filter"`.

### 8.3 GamesMood — tab switcher with a live panel (A29–A34), a replica of Industries + Playbook
- **Section:** `section#games.relative.overflow-hidden.bg-ink.page-x.py-20.md:py-32`.
- **One-shot reveal:**
```ts
gsap.from("[data-reveal]", { y: 36, opacity: 0, duration: .85, stagger: .08, ease: "power3.out", scrollTrigger: { trigger: section, start: "top 72%" } });
```
  It applies, in order, to the intro, the tab row, the main panel and the CTA strip.
- **Tabs:** `rounded-full border page-x py-2 text-sm transition`.
  - **Selected:** `border-signal bg-signal text-ink`.
  - **Unselected:** `border-white/15 text-white/70 hover:border-white/30 hover:text-white`.
- **Main panel:** `mt-10 grid gap-8 overflow-hidden rounded-[20px] sm:rounded-[28px] border border-white/10 bg-ink-soft p-5 sm:p-6 md:grid-cols-[1.05fr_0.95fr] md:p-10`.
- **On tab change:**
  - left copy: `fromTo({ opacity: .35, y: 10 }, { opacity: 1, y: 0, duration: .4, ease: "power2.out" })`.
- **Live panel (remounts per tab):** `min-h-[320px] md:min-h-[380px] rounded-2xl border border-white/10 bg-panel p-5 md:p-6`, with a background `radial-gradient(ellipse at 20% 0%, {accent}22, transparent 45%), radial-gradient(ellipse at 90% 80%, rgba(6,182,212,.1), transparent 40%)` and a dot texture.
  - `[data-playbook-block]`: `fromTo({ y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: .45, stagger: .06, ease: "power3.out" })`.
  - Metric bars: `h-1.5 rounded-full bg-white/10`. The fill is `origin-left` with `linear-gradient(90deg, {accent}, #06B6D4)` and `fromTo({ scaleX: 0 }, { scaleX: value/100, duration: .8, delay: .12 + .08*i, ease: "power3.out" })`.
  - Feed rows: `fromTo({ x: -10, opacity: 0 }, { x: 0, opacity: 1, duration: .4, stagger: .08, delay: .2, ease: "power2.out" })`.
  - Ping dot: `span.relative.flex.h-2.w-2`, containing `span.absolute.inset-0.animate-ping.rounded-full.opacity-70` and a solid dot, both in the accent colour.

### 8.4 SportsPulse — new section, built only from the vocabulary above
- **Section:** `section#sports.relative.overflow-hidden.bg-ink-soft.page-x.py-20.md:py-32`.
- **Layout:** the intro (eyebrow, RevealHeadline and sub) with a right link. Below it sits a `grid gap-6 lg:grid-cols-3` of three panels in the GamesMood live-panel style:
  - **"Live now"**, with a ping dot;
  - **"Upcoming"**;
  - **"Recent results"**.
- **Rows:** mono `text-[11px]` rows. Each row shows:
  - teams or players;
  - a score or time;
  - the competition;
  - a "Where to play nearby →" link on the last row.
- **Freshness footer:** every panel ends with the line `Updated {n} min ago · Source: {source}` in `text-[10px] text-zinc-500`. This is required by the FRD: sports data must be source-aware.
- **Motion:**
  - the same one-shot `[data-reveal]` reveal as §8.3;
  - rows use the feed-row stagger, triggered at `top 72%`;
  - ping dots.
- Add nothing else.

### 8.5 Intelligence — counters, chips and the live graph (A35–A45), a replica of Outcomes + Topology
- **Section:** `relative overflow-hidden bg-ink-soft page-x py-24 md:py-32`, with `page-shell grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]`.
- **Counters:** a 2×2 grid of stats with `border-t border-white/15 pt-5`.
```ts
gsap.to(obj, { val: target, duration: 1.8, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 85%" }, onUpdate: () => el.textContent = target % 1 === 0 ? Math.round(obj.val) + "" : obj.val.toFixed(1) });
```
- **Chips:** `rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/70`.
```ts
gsap.from("[data-outcome-chip]", { y: 20, opacity: 0, stagger: .06, duration: .7, ease: "power3.out", scrollTrigger: { trigger: section, start: "top 70%" } });
```
- **ClanGraph:**
  - Container: `relative h-[300px] min-h-[280px] sm:h-[380px] md:h-[500px]`, with the panel `rounded-[28px] border border-white/10 bg-panel`, the lime/cyan wash, and a 17px dot texture at .16.
  - SVG: `viewBox 0 0 100 100`, `preserveAspectRatio="none"`.
  - Edges are quadratic curves. For an edge between nodes a and b:
    - `M ax ay Q (mx − .08·dy) (my + .08·dx) bx by`, where `(mx, my)` is the midpoint and `(dx, dy) = b − a`.
    - Draw each edge twice. The base edge uses `stroke rgba(255,255,255,.07)` at width .35. The animated `[data-topo-edge]` uses `rgba(255,255,255,.16)` at width .32 and opacity .55. When active, it switches to a gradient `#5CF111@.2 → #06B6D4@.75` at width .65 and opacity 1, with `transition-[stroke,stroke-width] duration-300`.
    - Each edge also gets a `[data-packet]` circle: r .55, `#06B6D4`. When active it becomes r .85, `#5CF111`, with an `feGaussianBlur stdDeviation 1.1` glow filter.
  - Nodes are buttons, absolutely positioned at `left:x%`, `top:y%`, with `-translate-x-1/2 -translate-y-1/2`.
    - **Dot:** 10px, or 18px for the core node. Its colour follows the node kind: `core #5CF111`, `edge #06B6D4`, `data #A8A29E`.
    - **Active:** `scale-125 border-white/50`, `box-shadow 0 0 0 4px {c}22, 0 0 28px {c}88`.
    - **Inactive:** `opacity-80`, `0 0 12px {c}33`, hover `scale-110`.
    - **Label:** `text-[9px] sm:text-[10px] uppercase tracking-[0.14em] sm:tracking-[0.16em]`, colour `text-white/30` (hover /65, active white), hidden below sm.
    - **Core node:** two sonar rings `h-11 w-11 rounded-full border border-signal/35` and `border-cyan-400/25`.
    - Pointer enter and focus set the active node. Pointer leave on the container resets it to the core node.
  - **Glow blob:** `absolute h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-3xl radial({kindColor}44)`. It tweens to the active node with `left/top`, `duration .55` (0 before the intro completes), `ease power3.out`.
  - **Focus panel:** at the bottom, over a gradient from panel colour to transparent. It shows:
    - "Active node" label;
    - node label in Syne `text-xl md:text-2xl`;
    - blurb;
    - kind pill.

    On node change it animates `fromTo({ y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: .35, stagger: .04, ease: "power2.out" })`.
  - Top-left: a "Live graph" ping label.
  - **Intro timeline** (`scrollTrigger: { trigger: panel, start: "top 78%", once: true }`), after setting each edge's `strokeDasharray` and `strokeDashoffset` to its length, nodes to `scale .45, opacity 0`, packets to `opacity 0`, and the focus panel to `y 18, opacity 0`:
```ts
tl.to(edges, { strokeDashoffset: 0, duration: 1.15, stagger: .055, ease: "power2.out" })
  .to(nodes, { scale: 1, opacity: 1, duration: .55, stagger: .05, ease: "back.out(1.55)" }, .28)
  .to(focus, { y: 0, opacity: 1, duration: .55, ease: "power3.out" }, .45)
  .add(() => edges.forEach((e, i) => { e.style.strokeDasharray = "2.8 3.6"; gsap.to(e, { strokeDashoffset: -80, duration: 3.8 + (i % 3) * .55, ease: "none", repeat: -1 }); }))
  .to(packets, { opacity: 1, duration: .35 }, "-=0.1");
packets.forEach((p, i) => { const path = edges[i], L = path.getTotalLength(), o = { t: 0 };
  gsap.to(o, { t: 1, duration: 2.6 + (i % 4) * .4, ease: "none", repeat: -1, delay: 1.2 + .24 * i,
    onUpdate: () => { const pt = path.getPointAtLength(o.t * L); p.setAttribute("cx", pt.x + ""); p.setAttribute("cy", pt.y + ""); } }); });
rings.forEach((r, i) => gsap.fromTo(r, { scale: .75, opacity: .5 }, { scale: 1.85 + .2 * i, opacity: 0, duration: 2.35 + .35 * i, repeat: -1, ease: "power1.out", delay: .65 * i }));
```

### 8.6 Community — a replica of Partners
- **Section:** `section#community.relative.overflow-hidden.bg-ink.py-16.md:py-20`.
- **Layout:**
  - left: eyebrow and RevealHeadline `text-2xl md:text-3xl`;
  - right: pills `rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/60`;
  - below: a slow marquee (`gap-10 px-6`) of `font-display text-2xl md:text-3xl font-semibold tracking-tight text-white/25` words.

### 8.7 Trust — new section, built only from the vocabulary above
- **Section:** `section#trust.relative.overflow-hidden.bg-ink.page-x.py-20.md:py-28`.
- **Layout:**
  - the intro (eyebrow, RevealHeadline and sub);
  - below it, `grid gap-6 sm:grid-cols-2 lg:grid-cols-4` steps, each with `border-t border-white/15 pt-5`:
    - mono index `0n`;
    - Syne `text-xl` title;
    - `text-sm text-mist` body;
    - an accent lucide icon;
  - then a link.
- **Motion:** the one-shot `[data-reveal]` reveal from §8.3, applied per step with stagger .08.

### 8.8 FinalCta + SiteFooter — a replica of the Mash footer
- `footer.relative.overflow-hidden.bg-ink`, with `grid-bg opacity-30` and a bottom lime wash, wrapped in a CinematicSection.
- **Top grid:** `grid gap-12 border-b border-white/10 pb-16 lg:grid-cols-[1.3fr_1fr]`.
  - Left:
    - eyebrow;
    - **RevealHeadline `split="char"`** with `mt-4 text-4xl md:text-6xl`;
    - sub;
    - primary and ghost buttons.
  - Right: a contact list with lucide icons in `text-signal`.
- **Link grid:** `grid gap-10 py-14 md:grid-cols-3 lg:grid-cols-[1.4fr_repeat(5,1fr)]`, with a brand column and five FRD columns (§9 footer).
- **Legal bar:** `flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-white/40 md:flex-row md:items-center md:justify-between`.

---

## 9. HOMEPAGE — EXACT ORDER AND COPY

Put all copy in `content/home.ts`. The order follows FRD §7 (12 chapters), mapped onto the reference site's component rhythm. Every top-level section below S0 is wrapped in `CinematicSection` inside the hero cover sheet.

**S0 — ArenaHero (FRD 01)**
- **Eyebrow:** `GAME-TECH PLATFORM`
- **H1:** `Technology that makes games easier to play and easier to run`
- **Sub:** `Board games and sports, discovered, booked and hosted in one place — for players who want a table tonight and for the vendors, venues and organizers who make it happen.`
- **CTAs:**
  - primary `Explore Clan B` → `/play`;
  - hero ghost `Host with Clan B` → `/for-providers`.
- **Tagline:** a 32px amber rule followed by `PLAY · HOST · RUN` (`text-[11px] tracking-[0.22em] text-amber-600`).

**S1 — Intro**
- `bg-ink page-x py-16 sm:py-20 md:py-28`, in two columns that are `md:items-end`.
- **Eyebrow:** `Where Play Gets Built`
- **RevealHeadline:** `Play, with a system behind it`
- **Right blurb:** `From a Saturday strategy table to a city-wide badminton ladder — Clan B turns scattered chats, spreadsheets and phone calls into bookable, trackable, repeatable play.`
- **Link:** `How Clan B works →` (`/about#how`)

**S2 — Games & sports marquee**
- `bg-ink-soft py-8`.
- **Label:** `Games & Sports on Clan B`.
- **Pills:** Chess, Catan, Codenames, Ticket to Ride, Azul, Splendor, Dixit, Carrom, Badminton, Pickleball, Futsal, Box Cricket, Table Tennis, Snooker, Basketball, Football 5s, Quiz Nights, Deduction Games, Co-op Campaigns, Party Games.

**S3 — Mission (KineticText scroll-highlight)**
- **Label:** `Mission`
- **Text:** `We build the technology that makes games and sports easier to join and easier to run — real tables, real courts, real people, one connected platform.`

**S4 — Play: PlayRunway (FRD 02)**
- **Eyebrow:** `Play`
- **H2:** `Find something worth playing`
- **Link:** `Explore Play →` (`/play`)
- **Note:** `Scroll vertically — the runway moves through five ways to play.`
- **Cards** (category · name · summary · chips · tone · CTA):
  1. Board Games · **Board-Game Nights** · "Hosted tables at cafés with a facilitator who teaches the rules and keeps the game moving." · ["4–6 seats per table", "Beginner-friendly"] · `from-lime-400/30 via-transparent to-cyan-400/20` · Find a Game → `/games`
  2. Drop-in · **Open Sessions** · "Join an existing session instead of organising your own group. Book a seat, show up, play." · ["Book a single seat", "Waitlist when full"] · `from-sky-400/30 via-transparent to-indigo-400/20` · Browse Sessions → `/events?type=open-session`
  3. Venues · **Courts & Tables** · "Reserve a badminton court, a snooker table or a private game room — by the slot." · ["Slot-based booking", "Clear house rules"] · `from-violet-400/30 via-transparent to-fuchsia-400/20` · Find a Venue → `/venues`
  4. Competition · **Tournaments & Leagues** · "Register solo or as a team, then follow brackets, fixtures and standings." · ["Brackets & standings", "Team entries"] · `from-amber-300/30 via-transparent to-orange-400/20` · Explore Events → `/events?type=tournament`
  5. Groups · **Private Groups** · "Book a whole table, court or room for your crew, your office or a birthday." · ["Group booking", "Invite your crew"] · `from-teal-300/30 via-transparent to-lime-300/20` · Plan a Group → `/play?mode=group`

**S5 — Host / Space / Events / Clan B Services: HostStack (FRD 03, 04, 05, 10)**
- **Eyebrow:** `For Providers`
- **RevealHeadline:** `Four ways to run it.`
- **Link:** `Partner with Clan B →` (`/for-providers`)

**Card 01 — Host a Session.**
- Tag: `01 — Host`. Accent `#5CF111`. Icon `Dices`.
- Description: "Launch board-game nights, coaching and open sessions with capacity, pricing, rules and a cancellation policy — without the group-chat chaos."
- Capabilities: Session builder · Capacity & waitlist · Participant messaging · Payouts & reconciliation.
- CTA: `Host a Session` → `/for-providers/host`.
- **Visual "console"** (replica of the Mash terminal visual, `font-mono text-xs`):
  - three traffic-light dots, labelled `session.builder`;
  - `$ clanb publish --session "Strategy Night"`;
  - `→ 3 tables · capacity 18`;
  - `→ waitlist enabled`;
  - `✓ 14 / 18 seats booked` (in the accent colour);
  - tiles: `fill 78%`, `check-ins 12`, `rating 4.8`.

**Card 02 — List Your Space.**
- Tag: `02 — Space`. Accent `#06B6D4`. Icon `LayoutGrid`.
- Description: "Turn empty tables, courts, rooms and pods into bookable inventory with opening hours, blackout windows and booking rules."
- Capabilities: Resource inventory · Slots & blackout windows · Auto-confirm rules · Occupancy view.
- CTA: `List Your Space` → `/for-providers/venues`.
- **Visual "slots":** a 7×5 grid of `h-6 rounded-md border border-white/10` cells labelled Mon–Sun. Some cells are filled with the accent at 20–70% alpha, and one pulses with `animate-pulse`. It uses the Mash dot texture.

**Card 03 — Run Tournaments.**
- Tag: `03 — Compete`. Accent `#D97706`. Icon `Trophy`.
- Description: "Set up leagues and knockouts with registrations, brackets, scoring and standings — all from one organizer workspace."
- Capabilities: Registrations · Brackets & seeding · Score entry with audit trail · Live standings.
- CTA: `Organize a Tournament` → `/for-providers/organizers`.
- **Visual "metrics"** (replica of the Mash bar chart):
  - label `Registrations`, value `64/64`, `+ waitlist 9` in the accent colour;
  - 10 bars with heights `[42, 58, 46, 72, 64, 88, 76, 94, 81, 97]%`, each a `linear-gradient(180deg, accent, transparent)` at opacity `.35 + .06i`.

**Card 04 — Clan B Events.**
- Tag: `04 — Official`. Accent `#34D399`. Icon `Sparkles`.
- Description: "Clan B also hosts and operates official game nights, tournaments and corporate playdays — end to end, with verified hosts."
- Capabilities: Official events · Corporate & group playdays · Managed operations · Verified hosts.
- CTA: `See Clan B Events` → `/events?host=clanb`.
- **Visual "mobile"** (replica of the Mash phone): `rounded-[2rem]`, glow `0 0 60px {accent}33`, four list rows with borders in `{accent}44`.

**S6 — Sports: SportsPulse (FRD 06)**
- **Eyebrow:** `Sports`
- **RevealHeadline:** `Follow the sports you care about`
- **Sub:** `Upcoming fixtures, recent results and where to play it near you — information that turns into participation.`
- **Link:** `Explore Sports →`
- Mock rows cover cricket, football, badminton and chess.
- The source label reads `Sample data` until a licensed provider is integrated.

**S7 — Games: GamesMood (FRD 07)**
- **Eyebrow:** `Games`
- **RevealHeadline:** `Discover board games by group, time and mood`
- **Sub:** `Tell us who's playing and how long you've got. We'll show games that fit — and the tables where they're being played.`
- **Tabs (mood):** Quick · Strategic · Social · Competitive · Party · Co-op.

| Mood | Quote | Body | Impact bullets | Accent | Metrics (label, value, bar %) | Feed rows |
|---|---|---|---|---|---|---|
| Quick | "In and out in under 30 minutes" | "Light rules, fast turns, instant rematches — perfect before dinner or between rounds." | Learn in 5 minutes · Great for 2–6 · Easy rematches | #5CF111 | Players 2–6 (70), Play time 20 min (30), Complexity Light (25) | table.open — Indiranagar café, 7:30 PM · seats.left 3 · host.verified |
| Strategic | "Plan deep, play long" | "Engine-builders and area-control games for players who like to think three turns ahead." | Deep decisions · Rewarding replays · Facilitator on hand | #06B6D4 | Players 2–4 (45), Play time 90 min (85), Complexity Heavy (88) | table.open — Koramangala, 6 PM · teach.included · seats.left 1 |
| Social | "Talk, laugh, bluff" | "Games where the table conversation is the game — ideal for new groups and mixed crowds." | Icebreakers · Low pressure · Big groups welcome | #34D399 | Players 4–10 (90), Play time 30 min (40), Complexity Light (22) | table.open — HSR, 8 PM · group.friendly · seats.left 6 |
| Competitive | "Bring your A-game" | "Ranked nights, ladders and head-to-heads for players who keep score." | Ladders & ratings · Tournament formats · Verified results | #D97706 | Players 2 (35), Play time 45 min (55), Complexity Medium (60) | ladder.round 3 live · bracket.updated · results.verified |
| Party | "The louder the better" | "Word, drawing and reaction games built for big tables and loud rooms." | 6+ players · Minimal setup · Instant laughs | #FB7185 | Players 6–12 (95), Play time 25 min (35), Complexity Light (18) | party.night Friday · seats.left 10 · host.verified |
| Co-op | "Win together or lose together" | "Team up against the game — campaigns, puzzles and escape-room style adventures." | Teamwork first · Great for couples & teams · Campaign nights | #A78BFA | Players 1–4 (55), Play time 60 min (70), Complexity Medium (62) | campaign.session 4 · seats.left 2 · teach.included |

- **Panel title:** `{Mood} Table`, with a `Live tables` label and a pill for the mood.
- **Panel sub:** `Games, tables and open seats that match your mood — updated from real availability.`
- **CTA strip:** "Can't find your game? That's not a problem." / "Tell us what you want to play and when. We'll let you know when a table opens." with the button `Request a game` → `/play/request`.

**S8 — Intelligence (FRD 08)**
- **Eyebrow:** `Intelligence`
- **RevealHeadline:** `Smart where it matters. Never a chatbot.`
- **Sub:** `Recommendations and helpers live inside the pages where you decide — ranked by real inventory, never invented.`
- **Counters:** these are product facts. Replace them with real metrics after launch, and **never show invented traction numbers**.
  - `9` + "" · "Bookable service types"
  - `5` + "" · "Sides of one marketplace"
  - `100` + "%" · "Server-verified bookings"
  - `14` + "" · "Embedded AI helpers mapped"
- **Chips:** Smart discovery · Contextual recommendations · Event builder · Schedule optimizer · Player matching · Fill-rate assistant.
- **ClanGraph nodes** (id, x, y, label, kind, blurb):

  | id | x | y | label | kind | blurb |
  |---|---|---|---|---|---|
  | engine | 50 | 48 | Clan B Engine | core | "One source of truth for activities, inventory, bookings and people." |
  | discovery | 78 | 26 | Smart Discovery | edge | "Ranked recommendations from real, bookable inventory only." |
  | builder | 82 | 66 | Event Builder | edge | "Drafts an event from a short brief — you review before publishing." |
  | matching | 66 | 80 | Player Matching | edge | "Opt-in matching for balanced groups and teams." |
  | inventory | 22 | 30 | Inventory | data | "Tables, courts, rooms and seats with live availability." |
  | bookings | 18 | 68 | Bookings | data | "Holds, confirmations and check-ins without double-booking." |
  | catalog | 36 | 16 | Game Catalog | data | "Player count, play time, complexity and mood for every game." |
  | venues | 48 | 86 | Venues | data | "Verified spaces, rules and opening hours." |

  - **Edges:** engine–inventory, engine–discovery, engine–bookings, engine–builder, inventory–catalog, discovery–builder, bookings–matching, builder–venues, matching–venues, catalog–discovery.
  - **Kind pill labels:** Core / Edge / Data.

**S9 — Community: Community (FRD 09)**
- **Eyebrow:** `Community`
- **RevealHeadline:** `Find your crowd. Keep playing.`
- **Pills:** Clubs · Teams · Ladders · Follows · Reviews · Rebooking
- **Marquee** (sample clubs): Friday Strategy Club · Koramangala Smashers · Chess After Dark · Weekend Futsal League · Co-op Campaign Crew · Pickleball Ladder · Deduction Night · And your clan

**S10 — Trust (FRD 11)**
- **Eyebrow:** `Trust`
- **RevealHeadline:** `Know who runs it — and what happens if plans change`
- **Sub:** `Every listing shows who is hosting, the rules, and the cancellation policy before you pay.`
- **Steps:**
  1. **Verified providers** — "Hosts and venues are verified before they go live, and their trust markers show on every page." (`ShieldCheck`)
  2. **Clear policies** — "Cancellation, refund and eligibility rules are visible before booking, and saved with your booking." (`FileCheck`)
  3. **Check-in & receipts** — "Show a QR code at the door, and get itemised receipts for every booking." (`QrCode`)
  4. **Real support** — "Report an issue, reach support and see what happens next — from the booking itself." (`LifeBuoy`)
- **Link:** `How bookings work →` (`/help/bookings`)

**S11 — Final CTA + Footer (FRD 12)**
- **Eyebrow:** `Ready when you are`
- **RevealHeadline (char):** `Play. Host. Run it better.`
- **Sub:** `Clan B is technology for playing, hosting and running games and sports — making it easier to join and easier to operate.`
- **Buttons:**
  - primary `Book a Game` → `/play`;
  - ghost `Become a Partner` → `/for-providers`.
- **Contact:**
  - `hello@clanb.in` (**TODO confirm address**);
  - `Bengaluru · Chennai`.
- **Brand column:** the logo and "The future of games. Technology for playing, hosting and running games and sports."
- **Footer columns (FRD 6.2):**
  - **Explore:** Sports, Games, Events, Venues, Clubs
  - **For business:** Become a Vendor, List a Venue, Organize a Tournament, Corporate/Group Events
  - **Company:** About, Contact, Careers, Partner with Us
  - **Support:** Help Center, Booking Policies, Refunds, Safety, Report an Issue
  - **Legal:** Terms, Privacy, Cookies, Accessibility, Data Controls
- **Legal bar:** `© {year} CLANB TECH SOLUTIONS PRIVATE LIMITED. All rights reserved.`, plus a "Chapters" row of anchor links (#play, #host, #sports, #games, #community, #trust). The FRD requires direct section navigation.

**Header (FRD 6.1)**
- Logo → `/`.
- Primary nav (lg+): `Play`, `Events`, `Venues`, `Sports`, `Games`.
- `For Providers` has a hover dropdown: Become a Vendor, List a Venue, Organize a Tournament, Corporate & Group Events, and "All provider tools".
- Right cluster:
  - a search button: a pill `Search games, venues, events…` with a ⌘K hint on xl, or an icon on lg;
  - ghost `Log in`;
  - primary `Host an Event`.
- The search opens a command-palette **Dialog** styled like the Mash dropdown (glass panel, grouped results from the mock repo). It is keyboard accessible.
- After mock login, `Log in` becomes the `My Clan B` avatar menu.
- Mobile drawer: the same items, plus About and Help.

---

## 10. ALL OTHER PAGES (frontend complete, mock data)

**Interior public pages** use the same system with no WebGL:
- **`PageHero`:** `pt-[calc(72px+4rem)] pb-12`, an eyebrow, a RevealHeadline `text-4xl md:text-6xl`, a mist sub, an optional action row, a lime/cyan radial wash and `grid-bg` at opacity .3.
- Wrap the page body in CinematicSections so the dip-to-black and blur-rise effects still apply.
- Listing grids use the signature card styles and the §8.3 reveal.

| Route | Content (FRD reference) |
|---|---|
| `/play` | Discover: search bar and filters (date/time, distance, price, category, skill, duration, availability, format — USR-03), list/grid toggle, result cards showing a recommendation reason chip ("Fits your time · 3 seats left"), empty state with **Request a game** (USR-14) |
| `/play/request` | Demand request form (activity, date window, group size, area) with a success state |
| `/events`, `/events/[slug]` | Calendar strip and category filters. The detail page shows: title, provider (verified badge), venue, date/time, capacity bar, price, rules, suitability, inclusions, **cancellation policy**, booking status, emergency/support contact, a sticky booking card (USR-04), and a waitlist state (USR-09) |
| `/venues`, `/venues/[slug]` | Venue profile, resources (tables/courts/rooms), opening hours, a slot picker grid, house rules, photos placeholder, reviews |
| `/sports`, `/sports/[sport]` | Live/Upcoming/Recent/News tabs, explainers, "Local play" block linking to events/venues. Every data module shows source and freshness |
| `/games`, `/games/[slug]` | Catalog filters (players, time, complexity, mood). The detail page shows: overview, how to play, ideal group, related sessions, tables where it's available. Include collections ("Best for 4 players", "Under 60 minutes") |
| `/clubs` | Clubs and communities list (Phase-2 labelled "Coming soon" ribbons where FRD marks Future) |
| `/for-providers` | B2B landing. It reuses **HostStack**, **Intelligence (provider-side copy)** and **Trust**, a 4-step onboarding timeline, provider types (Vendor/Facilitator, Venue/Café, Organizer), an FAQ accordion, and a CTA `Apply to host` |
| `/for-providers/{host,venues,organizers,corporate}` | Sub-landings with PageHero, benefits, and a CTA into onboarding |
| `/for-providers/apply` | Multi-step onboarding (VEN-01): org profile → contact → provider type and activities → verification docs (UI only) → review and submit. It saves progress in local state |
| `/about` (+ `#how`) | Story, product sentence, the north-star loop as an animated step row (§8.7 style), the two offices |
| `/help`, `/help/[topic]` | Help centre: booking policies, refunds, safety, report an issue (form) |
| `/legal/{terms,privacy,cookies,accessibility,data-controls}` | MDX/TSX prose pages with placeholder text marked **TODO legal review** |
| `/search?q=` | Full search results grouped by type |
| `/login`, `/signup` | Email/phone auth UI (mock). Browse-first: never gate public pages |
| `/checkout/[id]` | Booking journey (FRD 15.1): quantity/slot → review policies → **hold timer** (mock 10:00 countdown) → itemised price (base, platform fee, taxes, discount, total — USR-06) → confirm → confirmation with QR code and receipt. Include failure states: hold expired, capacity reached (waitlist), payment failed (recoverable) |
| `/me` | My Clan B (USR-13): next booking card, bookings (upcoming/past, receipt, cancel — USR-07), follows and saves (USR-08), profile |
| `/provider` | **Provider workspace (dense, no cinematic motion — FRD 1.3/19.1)**: Today (upcoming events, check-ins, cancellations, action items), Services and Sessions list, **Create session/event wizard** (VEN-03/04: activity, format, pricing, capacity, duration, rules, location, booking mode, schedule, cancellation policy, and an inline **"Draft with AI"** button that fills a suggested draft for human review — mock), Bookings table with state filters (VEN-05), Participants with check-in toggle (ORG-07), Announcements composer (VEN-06), Inventory (venue resources and blackout windows), Payouts (VEN-12, mock), Insights (fill rate, views→bookings funnel, basic charts) |
| `not-found` | Branded 404 with the logo tile motif and a link home |

Dashboards use DM Sans at 14px, compact tables, 150 ms transitions only, no Lenis-dependent effects, and the same dark tokens.

---

## 11. RESPONSIVE RULES (replicate the reference gates)

| Behaviour | ≥1024 & fine pointer | 768–1023 | <768 or touch |
|---|---|---|---|
| Lenis | on | off | off |
| Hero scroll timeline and liquid lens | on | on | off |
| HostStack sticky and recede | on | on | off (stacked list) |
| PlayRunway pin and horizontal | on | on | off (vertical list, bar full) |
| CinematicSection, dip overlay, RevealHeadline, KineticText, counters, marquees, graph | on | on | on |
| Header | inline nav (lg) | drawer | drawer |

- Hero on mobile: copy is bottom-aligned (`items-end pb-10`), buttons are full-width (`w-full sm:w-auto`), and the veil uses the vertical gradient.
- Test viewports: 375×812, 768×1024, 1280×800 and 1440×900.

---

## 12. ACCESSIBILITY, PERFORMANCE, SEO (FRD §22 — mandatory)

1. **Content is never gated by animation.** SSR HTML renders all text fully visible. GSAP sets the start states only after hydration. CTAs and booking information are never animated in from hidden.
2. **Keyboard:**
   - a visible focus ring `focus-visible:outline-2 outline-signal outline-offset-2`;
   - a skip link to `#main`;
   - topology nodes are buttons, and focus sets them active;
   - Dialog and Sheet trap focus.
3. **Semantics:** one H1 per page, landmarks, `aria-label` on split text, and `aria-hidden` on decorative layers.
4. **Reduced motion (stricter than the reference, as the FRD requires).** When `prefers-reduced-motion: reduce`:
   - no Lenis;
   - marquees stop;
   - the dip overlay is not created;
   - CinematicSection, RevealHeadline and KineticText render at their final state;
   - PlayRunway and HostStack use the mobile layout;
   - the hero canvas renders one static frame (`frameloop="demand"`) and has no lens;
   - counters show their final values;
   - graph loops are off.

   Implement this once in `lib/motion.ts` as `usePrefersReducedMotion()` plus a `gsap.matchMedia` condition.
5. **Performance:**
   - load the hero canvas with `next/dynamic({ ssr:false })` and show the fallback plate;
   - `dpr [1, 1.75]`;
   - pause the R3F frameloop when the hero is off-screen (IntersectionObserver → `frameloop="never"`);
   - lazy-load decorative media;
   - `next/image` for everything;
   - budgets: LCP < 2.5 s on 4G mid-tier mobile, CLS < 0.05, TBT < 200 ms;
   - no layout shift from fonts (next/font already applies size-adjust).
6. **SEO:**
   - the Next Metadata API per route;
   - JSON-LD Organization, WebSite and (for events) `Event` schema;
   - `sitemap.ts` and `robots.ts`;
   - an OG image built with the logo on ink;
   - `theme-color #030706`, `color-scheme dark`.
7. **Analytics hooks:** a `track(event, props)` no-op wrapper for the FRD §23 funnel events (search, detail view, book start, hold, confirm). Do not add a vendor yet.

---

## 13. BUILD ORDER (mirrors PROJECT_TRACKER.md — do not skip ahead)

Run all phases back to back without pausing between them (§0.5). To go faster without breaking anything:
- Build shared primitives once and reuse them. Never duplicate a component.
- Batch similar pages (for example, all listing pages together).
- Generate fixtures with small scripts, not by hand.
- Keep `pnpm dev` running and check each page in the browser as you finish it.

- **Phase 0 — Setup:** repo, deps, fonts, tokens, `cn`, lint, AGENTS.md and tracker in place, brand assets.
- **Phase 1 — Motion core:** SmoothScrollProvider, CinematicPage, CinematicSection, RevealHeadline, KineticText, Marquee, SiteHeader, a `/lab` page demoing each primitive. **Verify each primitive against its A-ID before moving on.**
- **Phase 2 — Hero:** ArenaHero layers, curtain, scroll timeline, liquid lens, ArenaCanvas with the procedural texture, fallback, reduced-motion path.
- **Phase 3 — Home sections:** S1→S11 in order, then SiteFooter. Run a full-page parity check against the reference.
- **Phase 4 — Data layer:** types, mock fixtures (Bengaluru), repository interface.
- **Phase 5 — Public pages:** Play, Events, Venues, Sports, Games, Clubs, Search, About, Help, Legal, 404.
- **Phase 6 — Booking journey:** event/venue detail booking card → checkout → confirmation → My Clan B.
- **Phase 7 — For Providers:** landing, sub-landings, onboarding wizard.
- **Phase 8 — Provider workspace:** dense dashboard screens.
- **Phase 9 — Hardening:** a11y audit, reduced-motion audit, performance budgets, SEO, Playwright e2e for FRD §26.1 tests 1, 2, 4 (UI level) and 11, cross-browser (Chrome, Safari, Firefox), mobile pass.
- **Phase 10 — Handoff:** a README, an API-swap guide for the NestJS backend, and screenshots in `docs/screenshots/`.

---

## 14. DATA LAYER (typed, mock now, NestJS later)

Create `lib/data/types.ts` from FRD §20:
- User, Organization, Venue, Resource;
- Activity (`kind: "board-game" | "sport"`, category, format, playerMin/Max, durationMin, skill, complexity, moods[], indoor);
- Service (`type` = the 9 service types in §2);
- Session / Event (lifecycle `status` union from §2, capacity, booked, waitlist, price, policyId);
- Booking (`state` union), PaymentLine (base/fee/tax/discount/total);
- Policy, Review, Content (sports item with `source` and `updatedAt`), Competition/Match/Result, Follow, Notification.

`lib/data/repo.ts` exports the interface `ClanBRepo`:
- `searchActivities(filters)`, `getEvent(slug)`, `listEvents(filters)`, `getVenue(slug)`, `listVenues(filters)`, `listGames(filters)`, `getGame(slug)`, `listSportsFeed(kind)`;
- `holdBooking(input)`, `confirmBooking(id)`, `cancelBooking(id)`, `listMyBookings()`;
- provider methods.

Provide `mockRepo`, which reads fixtures and adds 250–600 ms latency so loading states can be exercised. Select the implementation with `NEXT_PUBLIC_DATA_SOURCE = "mock" | "api"`. The `api` implementation is a stub that calls `NEXT_PUBLIC_API_BASE_URL`, and it must match the FRD §21.1 domains (auth, catalog, search, availability, bookings, payments, events, competition, content, community, ai, admin). **The client never computes booking or payment truth**; the UI only renders states returned by the repo.

Fixtures cover:
- 12 venues in Bengaluru neighbourhoods (Koramangala, Indiranagar, HSR Layout, Jayanagar, Whitefield, JP Nagar);
- 30 games;
- 8 sports;
- 40 sessions/events across all service types and lifecycle states (including Full / Waitlist and Cancelled);
- 6 providers (one Clan B first-party);
- a sports feed.

All fixture names are fictional. Mark sample data in the UI where the FRD requires source attribution.

---

## 15. QUALITY GATES FOR "DONE" (every task — zero-bug policy)

- `pnpm typecheck && pnpm lint && pnpm build` pass with **0 errors and 0 warnings**. No `any`, no `@ts-ignore`, no `eslint-disable` added to silence a real problem.
- The page loads in `pnpm dev` with **no browser console errors or warnings**. This includes hydration mismatches, React key warnings, missing-image 404s, WebGL errors and GSAP "target not found" messages.
- No runtime crash when:
  - resizing between 375 and 1440 px;
  - navigating to another route and back (no ScrollTrigger or Lenis leaks, no duplicated triggers);
  - reloading mid-page.
- Every interactive element tested once: links resolve (no 404s), forms validate, tabs switch, dialogs open, close and trap focus.
- Tested at 375, 768 and 1440 widths, and with reduced motion on.
- For motion tasks: the task's A-ID parameters are copied exactly (starts, ends, scrub, eases, staggers, durations). Record "Parity ✓" in the tracker with the component name.
- No console errors. ScrollTrigger markers are off.
- Copy comes from `content/*` and matches this prompt.
- Tracker updated: status, files touched, notes, and the next task.

---

## 16. THINGS YOU MUST NOT DO

- Do not change fonts, token values, easing, trigger positions, scrub values, durations or staggers from this spec.
- Do not add animation libraries (Framer Motion, AOS, Locomotive) or extra effects beyond the reference (no custom cursors, tilt cards, particle backgrounds outside the hero, or page-transition wipes).
- Do not show invented traction metrics, testimonials, partner logos or reviews as if they were real.
- Do not use real brand logos of games or sports leagues. Game names as plain text are fine.
- Do not add a chatbot. AI appears only as inline buttons or chips ("Draft with AI", "Why this?").
- Do not gate public browsing behind login.
- Do not put cinematic scroll effects on dashboards.

---

## 17. OPEN DECISIONS (use the default, log it in the tracker, and flag it in the UI with a TODO)

- **Launch city and first categories.** Default: Bengaluru; board games, badminton, pickleball, football 5s, chess.
- **Contact email.** Default: `hello@clanb.in`.
- **Hero plate.** Default: procedural until the final artwork arrives.
- **Signal colour.** Default: logo lime `#5CF111`. For a pure Mash emerald look, set `--color-signal: #10B981` — one line.
- **Booking confirmation mode per service type.** Default: instant for resources, provider-approval for custom events.
- **Payment provider.** Default: UI only, no SDK.

---

## 18. FINAL RUN-AND-FIX PASS (mandatory, after Phase 10)

1. Delete `.next` and run a clean install and build: `pnpm install --frozen-lockfile && pnpm typecheck && pnpm lint && pnpm build`. Fix everything until it is 100% clean.
2. Run the production build (`pnpm start`) and open **every route** in the browser at 1440 px and 375 px:
   - home, `/play`, `/play/request`, `/events` plus one event detail, `/venues` plus one venue detail;
   - `/sports` plus one sport, `/games` plus one game, `/clubs`, `/search?q=catan`;
   - `/for-providers` plus all sub-pages and `/for-providers/apply`;
   - `/about`, `/help` plus one topic, all `/legal/*`;
   - `/login`, `/signup`, `/checkout/[id]` (happy path and all 3 failure states), `/me`;
   - every `/provider` screen, and a bad URL (404).

   Fix every console error or warning, broken layout, dead link, missing asset and animation glitch.
3. Scroll the whole home page slowly and quickly, forwards and backwards, and check each animation against the parity checklist. Check the pinned runway, the sticky stack and the hero curtain in particular. Then repeat with reduced motion on.
4. Run `pnpm test:e2e` until all tests are green.
5. Search the codebase for existing errors from earlier sessions: stale imports, unused files, TODOs that hide bugs, and type holes. Fix them.
6. Repeat steps 1–5 until one full pass finds **nothing**.
7. Only now report to the user, once, with:
   - what was built (the route list);
   - how to run it;
   - the remaining product-owner TODOs from §17;
   - the confirmation that build, lint, typecheck, e2e and console are all clean.

**Start now:** read `AGENTS.md` and `PROJECT_TRACKER.md`, then execute Phase 0 through Phase 10 and §18 continuously, without stopping between phases.
