# Mash Technologies — Motion & Visual Forensic Report

**Target:** https://mashtechnologies.co/ (home page)
**Inspected:** 24 Sep 2026, live browser session + the site's shipped JS/CSS bundles
**Purpose:** Hand this to a coding AI so it can rebuild the *motion language, typography, visual identity and scroll experience* with different content and branding (ClanB).

---

## 0. How this was inspected (read first)

| Method | What it gave |
|---|---|
| Live DOM + computed styles in a real Chromium pane | Section order, heights, sticky/fixed layers, applied inline GSAP styles, loaded fonts |
| `document.styleSheets` + the single CSS file (`/_next/static/css/7129288ee6b5b0ca.css`, 72 KB) | Tailwind v4 theme tokens, custom classes, keyframes, media queries |
| The site's own client JS chunks (page, 13, 622, 789, 37) — de-minified | **Exact** GSAP timelines, ScrollTrigger start/end/scrub values, easings, staggers, Lenis config, the WebGL shader source, cursor-mask math |
| `performance` resource entries | Asset list (fonts, hero PNG, three.js chunks) |

Because the animation parameters were read from the site's own shipped code, most numbers below are **VERIFIED**, not eyeballed.

**Limitation:** the browser pane available was ~611 × 694 px (below the site's `md` 768 px breakpoint). The DOM state therefore reflects the *mobile* branch; desktop-only behaviours (pin, sticky stack, hero scroll timeline, cursor mask, Lenis) were verified from code, not from pixel observation at 1440 px. Screenshots at desktop width were not captured.

Evidence tags used throughout: **[V]** verified (code/DOM) · **[A]** observed/approximate · **[I]** inferred · **[U]** unknown.

---

## 1. Website overview

- **Brand:** "Mash." — "Bio-Tech AI Agency". Dark, near-black green (`#030706`) "cinematic" single-page home with emerald/cyan signal accents.
- **Stack [V]:** Next.js App Router (`/_next/static/chunks/app/...`, RSC `__next_f`), React, **Tailwind CSS v4** (oklch tokens, `color-mix`, `--animate-*` vars), **GSAP 3 + ScrollTrigger** (`gsapVersions`, `_gsap`, `ScrollTrigger` in chunks), **Lenis** smooth scroll (`html.lenis`), **Three.js via @react-three/fiber** (`__THREE__`, `its-fine`, `zustand`, `useFrame`), **lucide-react** icons, `clsx` + `tailwind-merge` (`cn()`), `next/font/google` (hashed `__variable_*` classes + generated "Fallback" faces).
- **Motion personality:** slow, heavy, "film-grade". Everything is **scrubbed to scroll** (scrub 0.65–1 s smoothing) rather than fire-and-forget. Recurrent vocabulary: *blur → sharp*, *dim → bright*, *drift up 12–48 px*, *dip-to-black between sections*, *cards receding (scale 0.94 + brightness 0.55)*, *horizontal runway on vertical scroll*, *live data "telemetry" micro-loops (ping dots, flowing dashed edges, packets)*.

---

## 2. Complete page structure (home, top → bottom)

```
<header fixed z-50>                         SiteHeader
<main class="relative bg-ink">
 ├─ S0  <section sticky top-0 h-100svh z-0 data-cinematic>   BioTechHero (WebGL canvas + veil + copy)
 └─ <div data-hero-cover data-cinematic class="relative z-20 -mt-1">   ← "curtain" that slides over the sticky hero
      <div rounded-t-[1.75rem] md:rounded-t-[2.5rem] border-t border-white/10 bg-#030706 shadow-[0_-40px_100px_rgba(0,0,0,.75)]>
        ├─ S1  CinematicSection  "Where AI Gets Built" intro (RevealHeadline)
        ├─ S2  CinematicSection  TechMarquee ("Technologies We Master")
        ├─ S3  CinematicSection  Mission (KineticText scroll-highlight)
        ├─ S4  CinematicSection  #services  StickyCardStack (4 sticky cards)
        ├─ S5  CinematicSection  #work      HorizontalRunway (pinned, 5 case cards)
        ├─ S6  CinematicSection  #industries Industries (tabs + live playbook)
        ├─ S7  CinematicSection  Outcomes (counters + animated topology mesh)
        ├─ S8  CinematicSection  #about     Partners (+ slow marquee)
        └─ S9  CinematicSection  CTA + Footer
<div fixed inset-0 z-[35] bg-#030706 opacity-0>   CinematicPage "dip-to-black" overlay
```
Measured heights at 611 px wide (mobile branch) [V]: S1 302, S2 138, S3 304, S4 3065, S5 3324, S6 1589, S7 1037, S8 302, S9 1669; total doc ≈ 12 461 px. On desktop S4 grows to ≈ 4 × 100svh and S5 gains ≥ 2400 px of pin distance [I from code].

---

## 3. Exact font information — **VERIFIED**

| Role | Family | Source | Weights | CSS var / utility |
|---|---|---|---|---|
| Display / headings / logo / numbers | **Syne** | Google Fonts via `next/font/google`, self-hosted woff2 (`8a1d8947e5852e30-s.p.woff2` latin) | variable **400–800**; used at 600 (`font-semibold`) | `--font-display`, `.font-display` |
| Body / UI | **DM Sans** | `next/font/google` (`13971731025ec697-s.p.woff2`) | variable **100–1000** (opsz axis); used 400/500/600 | `--font-body` (set on `body`) |
| Mono (terminal visual, counters "01 / 05", signal feed) | **JetBrains Mono** | `next/font/google` (`bb3ef058b751a6ad-s.p.woff2`) | variable 100–800 | `--font-mono`, `.font-mono` |

- Fallbacks [V]: `"Syne Fallback"` = local Arial with `size-adjust 98.47%`, ascent 93.93%, descent 27.93%; `"DM Sans Fallback"` = Arial `size-adjust 104.53%`; `"JetBrains Mono Fallback"` = Arial `size-adjust 134.59%`. `font-display: swap`.
- Rendering [V]: `-webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale`.
- In Next.js: `Syne({subsets:['latin'], variable:'--font-display'})`, `DM_Sans({... variable:'--font-body'})`, `JetBrains_Mono({... variable:'--font-mono'})` and put all three `.variable` classes on `<html>`.

---

## 4. Typography system [V]

| Token | Spec |
|---|---|
| **Eyebrow / kicker** | `text-xs` (12px) `uppercase tracking-[0.28em]` (hero: `tracking-[0.32em]`, `text-[10px]` mobile) colour `--color-signal #10B981` (hero uses emerald-400) |
| **Hero H1** | Syne 600, `text-[1.85rem]` → `min-[400px]:text-4xl` → `sm:text-5xl` → `md:text-6xl` → `lg:text-[3.75rem]` (60px); `leading-[1.08]`, `tracking-tight` (-0.025em), `max-w-[16ch]` (sm 14ch), `drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]` |
| **Section H2** (RevealHeadline) | Syne 600 `tracking-tight text-balance`, `text-3xl md:text-5xl` (30→48px); CTA "Let's talk." `text-4xl md:text-6xl` |
| **Card H3** | Syne 600 `text-2xl sm:text-3xl md:text-5xl tracking-tight` |
| **Mission statement** | Syne 600 `text-2xl sm:3xl md:4xl lg:5xl xl:6xl`, `leading-[1.15]` |
| **Gradient text** | every word of RevealHeadline/KineticText: `bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent` (also `.text-gradient-headline {linear-gradient(#fff,#a1a1aa)}`) |
| **Body** | DM Sans `text-sm md:text-base`, `leading-relaxed` (1.625), colour `--color-mist #A8A29E`; hero sub `sm:text-base md:text-lg` |
| **Chips / tags** | `text-xs uppercase tracking-[0.2em] text-mist` in pill `rounded-full border border-white/10|15 bg-white/5 px-3 py-1` |
| **Micro labels** | `text-[10px] uppercase tracking-[0.18–0.28em] text-zinc-400/500` |
| **Stat numbers** | Syne 600 `text-4xl md:text-5xl` + suffix in `text-signal` |
| **Hero tagline** | `text-[11px] tracking-[0.22em] text-amber-600` preceded by `h-px w-8 bg-amber-600/80` rule — "NEURAL · CLOUD · CODE" |
| **Logo** | "Mash" + "." in signal green, Syne 600 `text-lg` (footer `text-2xl`) |
| Word spacing in split text | each word `inline-block mr-[0.28em]` |

---

## 5. Colour palette [V]

| Token | Value | Use |
|---|---|---|
| `--color-ink` | `#030706` | page bg, hero bg, overlay, text on green buttons |
| `--color-ink-soft` | `#071210` | alternating section bg (marquee, runway, outcomes, industries panel) |
| panel | `#050a09` | topology + playbook panels |
| `--color-mist` | `#A8A29E` | body/muted text |
| `--color-signal` | `#10B981` (emerald) | primary accent, eyebrows, CTA bg, selection `rgba(16,185,129,.35)` |
| `--color-glow` | `#06B6D4` (cyan) | secondary accent, gradients, hover of hero CTA (`cyan-400`) |
| emerald-400 / 500 | oklch(76.5% .177 163) / oklch(69.6% .17 162) | hero eyebrow, hero CTA bg, live dots |
| amber-600 | oklch(66.6% .179 58) | hero tagline |
| zinc-200…950 | Tailwind zinc | borders `zinc-800/80`, card bg `zinc-950` |
| Per-item accents | `#10B981 #06B6D4 #D97706 #34D399 #5EEAD4 #A78BFA #F59E0B #38BDF8 #FB7185 #84CC16` | cards, industries, services |
| Lines | `white/10` borders, `white/15–20` pill borders, `white/40–70` secondary text |

**Signature gradients [V]**
- Radial washes: `radial-gradient(at 20% 0, #10b98129, transparent 50%), radial-gradient(at 90% 20%, #06b6d41a, transparent 45%)`; `radial-gradient(at top, rgba(61,255,154,.08), transparent 45%)` (runway); `radial-gradient(at bottom, rgba(61,255,154,.1), transparent 50%)` (footer).
- Card accent wash: `radial-gradient(ellipse at 20% 0%, {accent}22, transparent 45%)` at opacity .4.
- Case-card tones: `bg-gradient-to-br from-emerald-400/30 via-transparent to-cyan-400/20` (per card hue).
- Progress bar: `bg-gradient-to-r from-signal via-glow to-white`.
- Hero veil `.hero-veil-blend`: desktop `linear-gradient(118deg, #030706 0 28%, #030706eb 42%, #03070666 56%, transparent 72%)`; small screens `linear-gradient(#030706 0 38%, #030706eb 52%, #0307068c 68%, transparent 86%)` [V values; which breakpoint switches them = I, likely `sm`/`md`].

---

## 6. Design system [V]

- **Container:** `.page-shell {max-width:1440px; margin-inline:auto}`; `.page-x` gutters = `max(0.75rem|1rem|1.25rem, env(safe-area-inset-*))` stepping up by breakpoint.
- **Breakpoints:** Tailwind v4 defaults 640/768/1024/1280/1536 + custom `min-[400px]`. Motion gates: **768 px** (GSAP matchMedia) and **1024 px** (Lenis).
- **Radii:** cards `rounded-[20px] sm:rounded-[28px]`; inner visuals `rounded-2xl` (16px); pills `rounded-full`; hero cover `rounded-t-[1.75rem] md:rounded-t-[2.5rem]`; phone mock `rounded-[2rem]`.
- **Section padding:** `py-16 sm:py-20 md:py-28` / `py-20 md:py-32` / `py-24 md:py-32`.
- **Shadows:** card `0 24px 80px rgba(0,0,0,.55)`; hero cover `0 -40px 100px rgba(0,0,0,.75)`; node glow `0 0 0 4px {c}22, 0 0 28px {c}88`; phone `0 0 60px {accent}33`.
- **Textures:** `.grid-bg` 48px 1px grid lines at `#ffffff0a` (footer, opacity .3); dot grids `radial-gradient(rgba(255,255,255,.45) .55px, transparent .55px) 16–22px`; `.noise-overlay:before` fractal-noise SVG at opacity .035 (defined, usage on home [U]); `.section-seam-fade` mask (defined).
- **Glass:** header `bg-ink/80 backdrop-blur-xl`; dropdown `bg-ink-soft/95 backdrop-blur-xl`; ghost button `bg-[#030706]/40 backdrop-blur-sm`.
- **Section seams:** every CinematicSection adds top & bottom `h-16 md:h-24` gradient fades to `#030706` so sections melt into each other.
- **Edge fades on marquees:** `w-16 md:w-28` gradients `from-ink(-soft) to-transparent` left & right.

---

## 7. Component inventory

| Component | Purpose |
|---|---|
| `SmoothScrollProvider` | Lenis instance driven by GSAP ticker |
| `CinematicPage` | fixed black overlay that pulses between sections |
| `SiteHeader` | fixed nav, scroll-state bg, hover mega-dropdown, mobile drawer |
| `BioTechHero` + `LizardTechCanvas` | R3F shader plane over a hero plate, particles, cursor-mask veil, scroll zoom |
| `CinematicSection` | wrapper: blur/fade/rise-in on scroll + seam fades |
| `RevealHeadline` | word/char split headline, scrubbed blur→sharp |
| `KineticText` | long statement: `scroll-highlight` or `split-up` modes |
| `TechMarquee` / `Partners` | infinite CSS marquees |
| `StickyCardStack` | stacked sticky cards that recede |
| `HorizontalRunway` | pinned horizontal scroller + progress bar |
| `Industries` + `Playbook` | tab switcher with animated live dashboard |
| `Outcomes` + `Topology` | count-up stats, chips, interactive SVG network |
| Footer | CTA (char-split headline), link columns |

Buttons [V]: **Primary** `rounded-full bg-signal|emerald-500 px-6 py-3(.5) text-sm font-semibold text-ink` hover → `bg-white` (or `bg-cyan-400` in hero). **Ghost** `rounded-full border border-white/15–20 (bg-white/5)` hover `border-white/30 bg-white/10`. **Signal ghost** `border-signal/40 bg-signal/10 text-signal` hover `bg-signal/20`. Arrow icon `ArrowUpRight` nudges `-translate-y-0.5 translate-x-0.5` on group hover (300 ms).

---

## 8. Interaction inventory (non-scroll) [V]

| # | Element | Default | Hover / Active | Focus / other |
|---|---|---|---|---|
| I1 | Header bar | transparent on `/` at scrollY ≤ 24 | — | after 24 px: `border-b border-white/10 bg-ink/80 backdrop-blur-xl`, `transition-colors 300ms` |
| I2 | Nav links | `text-white/70` (active route `text-white`) | → white (150 ms default transition) | — |
| I3 | "Our Services" dropdown | `opacity-0 pointer-events-none`, 360 px panel, `pt-4` bridge | mouseenter → `opacity-100` (fade 150 ms) | items `hover:bg-white/5 text-white` |
| I4 | "Our AI Edge" pill | `border-white/15 text-white/80` | `border-white/30 text-white` | active route `border-signal/50` |
| I5 | Header "Let's talk" | `bg-signal text-ink` | `bg-white` | — |
| I6 | Mobile burger | 40 px round bordered | toggles Menu/X icon; body `overflow:hidden` | services accordion chevron `rotate-180` |
| I7 | Hero CTA | `bg-emerald-500` | `bg-cyan-400` | — |
| I8 | Hero ghost | `border-zinc-700/80` | `border-emerald-500/50 text-white` | — |
| I9 | Card "Explore Service"/"View Case Study" | see buttons | bg/border lighten + arrow nudge | — |
| I10 | Industry tabs | `border-white/15 text-white/70` | `border-white/30 text-white` | selected `border-signal bg-signal text-ink`; click re-runs panel animations |
| I11 | Topology nodes (buttons) | dot `opacity-80`, label `white/30` | `scale-110`, label `white/65`; pointerenter/focus → becomes active | active `scale-125`, glow, connected edges gradient; pointerleave container → resets to "orchestrator" |
| I12 | Footer links | `text-mist` | `text-white` | — |
| I13 | Text selection | — | — | `::selection` emerald 35% bg, white text |

No custom cursor, no magnetic buttons, no cursor trail. [V — no such code]

---

## 9. Complete animation inventory (IDs)

| ID | Section | Element | Trigger | Type | Pri |
|---|---|---|---|---|---|
| A01 | Global | Lenis smooth scroll | wheel | inertial scroll (desktop ≥1024, fine pointer) | P0 |
| A02 | Global | Dip-to-black overlay | scroll-linked, each section entry | opacity 0→.22→0 | P0 |
| A03 | Global | CinematicSection content | scroll-linked | opacity .35→1, y 40→0, blur 10→0 | P0 |
| A04 | Global | Section seam fades | static layers | gradient masks | P1 |
| A05 | Header | bar bg/blur/border | scroll > 24 px | colour transition 300 ms | P1 |
| A06 | Header | dropdown | hover | opacity fade | P2 |
| A07 | Hero | Sticky hero + rounded "curtain" covers it | scroll | layered sticky overlap | P0 |
| A08 | Hero | Copy block | scroll-linked (md+) | y 0→-48, opacity 1→.35 | P0 |
| A09 | Hero | Canvas wrapper | scroll-linked (md+) | scale 1→1.06 | P0 |
| A10 | Hero | Shader zoom + pulse | scroll-linked (md+) | uZoom 0→.65, uPulse .3→.75 | P0 |
| A11 | Hero | Plane mesh idle sway | time | rotY ±.06, rotX ±.03, rotZ ±.015, breathing scale | P1 |
| A12 | Hero | Texture idle drift | time | UV sin/cos drift | P1 |
| A13 | Hero | "Matrix rain" streams | time | shader | P1 |
| A14 | Hero | Neural pulse ring | time (~6.7 s loop) | shader ring expanding from (0.58,0.5) | P1 |
| A15 | Hero | Constellation shimmer + arcs | time | shader | P2 |
| A16 | Hero | Cyan particle field (110 pts) | time + scroll | rotY .03 rad/s, scale 1+.15·zoom | P1 |
| A17 | Hero | Emerald sparkle layer (40 pts) | time | opacity .35±.2, rotZ sway | P2 |
| A18 | Hero | Cursor "liquid lens" veil mask | pointermove (md+, x<62%) | 3 radial-gradient masks punch through veil | P0 |
| A19 | Hero | Shader hover glow | pointerenter canvas | uHover lerp →1, pulse →.9 | P2 |
| A20 | Hero | Fallback plate | while WebGL chunk loads | static PNG at 50% | P3 |
| A21 | S1/S4/S6/S7/S8/S9 | RevealHeadline words/chars | scroll-linked | opacity .18→1, blur 3→0, y 12→0, stagger | P0 |
| A22 | S2 | Tech marquee | auto | translateX 0→-50% 42 s linear ∞ | P1 |
| A23 | S3 | Mission scroll-highlight | scroll-linked | per word opacity .18→1, blur 3→0 | P0 |
| A24 | S4 | Sticky card stacking | scroll (CSS sticky) | cards stack at top 72 px | P0 |
| A25 | S4 | Card recede | scroll-linked | scale 1→.94, brightness 1→.55 | P0 |
| A26 | S5 | Section pin | scroll | pinned ≥2400 px | P0 |
| A27 | S5 | Runway track horizontal translate | scroll-linked | x 0 → -(scrollWidth-vw)-40 | P0 |
| A28 | S5 | Progress bar | scroll-linked | scaleX 0→1 | P1 |
| A29 | S6 | Industry intro/tabs/panel/CTA reveal | scroll-triggered | from y36 opacity0, stagger .08 | P1 |
| A30 | S6 | Panel copy swap | tab click | opacity .35→1, y10→0 .4 s | P2 |
| A31 | S6 | Playbook blocks | mount/tab change | y14→0 opacity, stagger .06 | P2 |
| A32 | S6 | Metric bars | mount/tab change | scaleX 0→bar% .8 s | P1 |
| A33 | S6 | Signal feed rows | mount/tab change | x-10→0, stagger .08 | P2 |
| A34 | S6/S7 | Live ping dots | auto | Tailwind `animate-ping` 1 s ∞ | P2 |
| A35 | S7 | Stat counters | scroll-triggered | 0→value 1.8 s | P1 |
| A36 | S7 | Capability chips | scroll-triggered | from y20 opacity0 stagger .06 | P2 |
| A37 | S7 | Topology edges draw-on | scroll-triggered once | strokeDashoffset L→0 stagger .055 | P1 |
| A38 | S7 | Topology nodes pop | same timeline | scale .45→1 back.out(1.55) | P1 |
| A39 | S7 | Focus panel rise | same timeline | y18→0 | P2 |
| A40 | S7 | Flowing dashed edges | auto after intro | dashoffset →-80 ∞ | P1 |
| A41 | S7 | Data packets along paths | auto | dot travels path ∞ | P1 |
| A42 | S7 | Core sonar rings | auto | scale .75→1.85/2.05, opacity .5→0 ∞ | P2 |
| A43 | S7 | Active-node glow blob follow | hover node | left/top tween .55 s | P2 |
| A44 | S7 | Focus copy re-reveal | hover node | y8→0 stagger .04 | P2 |
| A45 | S7 | Edge highlight | hover node | stroke/width transition 300 ms | P3 |
| A46 | S8 | Partner work marquee | auto | 55 s linear ∞ | P2 |
| A47 | S9 | "Let's talk." char split | scroll-linked | as A21, stagger .018 | P1 |
| A48 | All | Arrow icon nudge | hover | translate(2px,-2px) 300 ms | P3 |
| A49 | All | Button colour swaps | hover | 150 ms bg/border/text | P3 |
| A50 | Header mobile | chevron rotate | click | rotate 180° | P3 |

---

## 10. Detailed scroll-animation analysis (PHASE 2/3 records)

### A01 — Lenis smooth scroll [V]
- **Config:** `new Lenis({duration:1.2, smoothWheel:true, syncTouch:false, touchMultiplier:1.2, wheelMultiplier:1, autoResize:true})`; `lenis.on('scroll', ScrollTrigger.update)`; `gsap.ticker.add(t => lenis.raf(t*1000))`; `gsap.ticker.lagSmoothing(0)`.
- **Disabled when** `prefers-reduced-motion: reduce` OR `(hover:none) and (pointer:coarse)` OR `max-width:1023px` → native scroll, ScrollTrigger.refresh on load/resize/400 ms.
- CSS: `html{scroll-behavior:auto; overflow-x:clip}`, `html.lenis, html.lenis body{height:auto}`.
- **Feel:** wheel input glides ~1.2 s; combined with `scrub:1` on timelines, visuals lag scroll by an extra ~1 s → very "heavy camera".

### A02 — Dip-to-black overlay (CinematicPage) [V]
- **Element:** `div.fixed.inset-0.z-[35].bg-[#030706].pointer-events-none`, starts opacity 0 (set after 180 ms delay).
- **Trigger:** for every `[data-cinematic]` element except the first: ScrollTrigger `start:"top 98%"`, `end:"top 60%"`, `scrub:1`.
- **Timeline:** opacity 0→**0.22** (duration .4, ease none) then 0.22→0 (duration .6). I.e. over the 38 %-of-viewport scroll window as each section's top rises from the bottom edge to 60 % height, the whole screen dims to 22 % black at the 40 % point and recovers.
- **Scroll-linked:** yes. Z-35 means it dims content but NOT the header (z-50).
- **Effect:** a subtle "film cut / eye-blink" between chapters. 9 blinks on the home page.

### A03 — CinematicSection reveal [V]
- **Element:** inner wrapper of each section S1–S9.
- **From:** `opacity .35, y 40, filter blur(10px)` → **To:** `opacity 1, y 0, blur(0)`; `ease power2.out`; ScrollTrigger `trigger: section, start "top 85%", end "top 45%", scrub .8, immediateRender:false`.
- **Scroll-linked**, reversible (scrolling up re-blurs). Runs on all viewports.
- Rebuild: `gsap.fromTo(inner, {...}, {..., scrollTrigger:{...}})` in `gsap.context` inside `useLayoutEffect`/`useGSAP`.

### A07–A10 — Hero "curtain" & scroll zoom [V]
- **Layering:** hero `section.sticky.top-0.h-[100svh].min-h-[560px].z-0`; the rest of the page lives in `div[data-hero-cover].relative.z-20.-mt-1` whose first child has rounded top corners (28→40 px), a hairline `border-t white/10` and a huge upward shadow `0 -40px 100px rgba(0,0,0,.75)`. Scrolling makes this dark sheet slide up **over** the stationary hero (pure CSS sticky; works on mobile too).
- **Timeline (md+ only):** trigger `[data-hero-cover]`, `start "top bottom"`, `end "top top"`, `scrub 1`, all tweens `ease none` in parallel over the first 100 vh:
  - Copy block (`max-w-xl lg:max-w-2xl`): `y 0 → -48px`, `opacity 1 → 0.35`.
  - Canvas wrapper (`origin-center`): `scale 1 → 1.06`.
  - Proxy `p 0→1` → `canvas.setZoom(0.65·p)`, `setPulse(0.3 + 0.45·p)`. In the shader `z = mix(1, 1.45, uZoom)` so texture magnifies to ≈ ×1.29; mesh scale `(1+0.18·zoom)` with extra X `+8%·zoom`, Y `+12%·zoom`; particle field scale `1+0.15·zoom`. Glow intensity increases with pulse.
- **Net feel:** as the curtain rises, the creature image pushes in (dolly-in), glows brighter, while copy drifts up and fades — then gets covered.

### A18 — Hero cursor "liquid lens" [V]
- **Where:** hero section, md+, only when pointer X < 62 % of hero width (the dark, veiled left half where the copy sits).
- **Mechanics:** the veil layer (`.hero-veil-blend`, z-2, dark gradient over the canvas) gets a live `mask-image` of **three radial gradients** composited with `mask-composite: intersect` (`-webkit-mask-composite: multiply`). Each gradient is transparent in the middle → the veil is punched through, revealing the bright WebGL art under the cursor.
  - Pointer target `e` → smoothed `t` (lerp **0.085**/frame) → trailing `r` (lerp **0.055**/frame on `t`).
  - Size lerps (0.12/frame) to **168 px** when active, 0 when leaving; breathing `×(1 + 0.08·sin(2.4·time))`.
  - Velocity stretch: `v = min(2.2·|Δpos|,1)`; ellipse 1: `1.05·s·(1+.55v)` × `0.72·s·(1−.22v)`; ellipse 2 rotated proportions `0.78·s·(1−.22v)` × `0.98·s·(1+.55v)`; ellipse 3 at trailing point `0.92s × 0.70s`.
  - Wobble offsets in px: `(8cos1.5t, 6sin1.8t)`, `(−10cos(1.1t+1.2), 8sin(1.35t+.6))`, `(7sin(1.7t+2.1), −5cos(1.25t+1.4))`.
  - Stops: `transparent 0–20%, rgba(0,0,0,.3) 48%, rgba(0,0,0,.65) 74%, #000 100%` (trail: `0–10%, .4@42%, .78@70%`).
  - rAF loop stops itself when settled; mask reset to `none` when size ≤ 1.
- **Feel:** an organic, breathing, gooey spotlight that smears in the direction of motion and leaves a lagging "tail".

### A21 — RevealHeadline [V]
- Split: words (default) or chars; each unit `span.inline-block` with gradient-clip text.
- `set {opacity .18, filter blur(3px), y 12}` → `to {opacity 1, blur 0, y 0, ease power2.out, stagger .045 (word) / .018 (char), scrollTrigger {trigger: h2, start "top 75%", end "top 25%", scrub .65}}`.
- Scroll-linked: words light up left→right as the heading travels from 75 % to 25 % of viewport height; reverses on scroll-up.

### A23 — Mission KineticText "scroll-highlight" [V]
- Per word: `set {opacity .18, blur 3px}` → `{opacity 1, blur 0, ease none, stagger .28, scrub .65, start "top 75%", end "top 25%"}`. Much larger stagger than A21 → a reading-pace "karaoke" sweep over a 20-word paragraph.
- Alternate `split-up` mode exists (not used on home) [V]: words masked (`overflow-hidden align-bottom`), inner `yPercent 110, rotate 5, origin 50% 100%` → `0`, `power3.out`, stagger .03, toggleActions `play none none reverse`, start `top 80%`.

### A24–A25 — StickyCardStack (Services) [V]
- md+: each card wrapper `sticky top-[72px] h-[100svh] flex items-center`, `z-index: i+1`. Cards naturally stack as you scroll (each next card slides up over the previous).
- For every card except last: `fromTo(card, {scale 1, filter brightness(1)}, {scale .94, filter brightness(.55), ease none, scrollTrigger {trigger: nextWrapper, start "top 85%", end "top 25%", scrub true}})`, `transform-origin: top`.
- Result: the card underneath shrinks back and darkens while the next one rises — depth stack. Card inner grid `lg:grid-cols-[1.1fr_.9fr] lg:min-h-[min(58vh,560px)]`, right side is a mini "visual" (terminal / node graph / bar chart / phone).
- <768: plain vertical list, props cleared.

### A26–A28 — HorizontalRunway (Case Studies) [V]
- md+: section `h-svh flex-col`; ScrollTrigger `trigger section, start "top top", end "+=" + max(2400, 0.75·track.scrollWidth), pin true, scrub 1, anticipatePin 1, invalidateOnRefresh`.
- Track (`flex w-max gap-8`, cards `min-w-[min(80vw,1100px)] rounded-[28px] p-10`): `x → -(scrollWidth − innerWidth) − 40`, ease none.
- Progress bar (2 px track `white/10`, fill gradient signal→glow→white, `origin-left`): `scaleX 0 → 1` same timeline.
- Header copy literally says "Scroll vertically — the runway translates horizontally…".
- <768: vertical list, bar pre-filled.

### A29–A33 — Industries [V]
- Enter: `gsap.from('[data-industry-reveal]', {y 36, opacity 0, duration .85, stagger .08, ease power3.out, scrollTrigger {start "top 72%"}})` — one-shot (no scrub). Order: intro block → tab row → main panel → "not listed" CTA.
- On tab change: left copy `opacity .35,y10 → 1,0` (.4 s power2.out). Playbook card re-mounts: blocks `y14,opacity0 → 0,1` .45 s stagger .06 power3.out; 3 metric bars `scaleX 0 → value/100` .8 s delay .12 + .08·i power3.out (gradient accent→cyan); signal rows `x −10 → 0` .4 s stagger .08 delay .2.

### A35–A45 — Outcomes + Topology [V]
- Counters: object tween `0 → value` 1.8 s power2.out, start `top 85%`; integer rounding, decimals `.toFixed(1)` (99.9).
- Chips: `from {y 20, opacity 0}` stagger .06, .7 s, power3.out, start `top 70%`.
- Topology (SVG viewBox 0 0 100 100, `preserveAspectRatio none`, 8 nodes, 10 quadratic-curve edges with control point offset 8 % perpendicular):
  1. `once` at `top 78%`: edges `strokeDashoffset length→0` 1.15 s stagger .055 power2.out;
  2. at 0.28 s nodes `scale .45→1, opacity 0→1` .55 s stagger .05 `back.out(1.55)`;
  3. at 0.45 s focus panel `y18→0` .55 s power3.out;
  4. then edges switch to dash `2.8 3.6` and loop `strokeDashoffset → −80` over 3.8/4.35/4.9 s (i%3), linear, infinite (flowing current);
  5. packets (r .55 / .85 active) fade in and travel each path 0→1 over 2.6–3.8 s, delay 1.2 + .24·i, infinite;
  6. core node has 2 sonar rings `scale .75→1.85 (+.2), opacity .5→0` 2.35 s (+.35) infinite, delayed .65 s.
- Hover: active node → glow blob (`h-40 w-40 blur-3xl opacity-70`, radial colour 44 alpha) tweens to node position .55 s power3.out; panel copy `y8→0` stagger .04 .35 s; connected edges get gradient stroke `#10B981@.2 → #06B6D4@.75`, width .32→.65, opacity .55→1 (300 ms CSS transition); active packets turn `#34D399` with feGaussian glow.

---

## 11. Animation timeline (observed page order; % are approximate for a 1440×900 desktop [A])

```
PAGE LOAD
├─ Fonts swap in (display: swap)
├─ Hero shows static plate (fallback PNG @50%) → WebGL canvas mounts (dynamic, ssr:false)
├─ Shader idle loops start: drift, rain, pulse ring every ~6.7 s, particles rotate, sparkles twinkle
├─ Marquees start (42 s / 55 s)
├─ Lenis starts (desktop), ScrollTrigger.refresh at rAF, load, +400 ms
└─ +180 ms: dip-to-black overlay armed
NO entrance animation for hero copy (it is static on load) [V]

SCROLL 0 → ~7 %  (first 100 vh)
├─ Rounded dark curtain slides up over sticky hero
├─ Hero copy y→-48, fades to .35; canvas scale→1.06; shader zoom→.65, pulse→.75
├─ Header turns glassy after 24 px
├─ Dip-to-black #1 as curtain top passes 98%→60%
└─ S1 content de-blurs/rises; headline words light up

~7 → 12 %
├─ S2 tech marquee (already running) de-blurs in; dip #2
└─ S3 Mission: dip #3, content de-blurs, words sweep bright one-by-one

~12 → 38 %   SERVICES
├─ Dip #4; "Four systems. One delivery stack." word reveal
├─ Card 1 sticks at 72 px → card 2 rises over it; card 1 shrinks to .94 & darkens to 55 %
└─ repeats for cards 2→3, 3→4

~38 → 62 %   CASE STUDIES (PINNED)
├─ Dip #5, section pins full-screen
├─ Vertical scroll ≥2400 px → 5 cards translate right→left
├─ Progress bar fills 0→100 %
└─ Unpin

~62 → 75 %   INDUSTRIES
├─ Dip #6; intro/tabs/panel/CTA rise in staggered (one-shot)
├─ Playbook bars fill, signals slide in; ping dot pulses
└─ (click tab → panel re-animates)

~75 → 85 %   OUTCOMES
├─ Dip #7; headline reveal; counters count up; chips rise
└─ Topology draws itself, nodes pop, then live loops (flowing edges, packets, sonar)

~85 → 88 %   PARTNERS: dip #8, headline reveal, slow marquee of project names
~88 → 100 %  CTA/FOOTER: dip #9, "Let's talk." char-by-char reveal, grid bg footer
```

---

## 12. Animation matrix

| ID | Section | Element | Trigger | Type | Direction | Scroll-linked | Initial | Final | Timing | Pri |
|---|---|---|---|---|---|---|---|---|---|---|
| A01 | Global | Lenis | wheel | smooth scroll | Y | yes | — | — | duration 1.2 | P0 |
| A02 | Global | overlay | section top 98→60 % | opacity | — | yes (scrub 1) | 0 | .22→0 | .4/.6 split | P0 |
| A03 | Sections | inner | top 85→45 % | fade/rise/blur | +Y→0 | yes (.8) | .35/40px/10px | 1/0/0 | power2.out | P0 |
| A05 | Header | bar | scrollY>24 | bg+blur | — | threshold | transparent | ink/80 blur-xl | 300 ms | P1 |
| A06 | Header | dropdown | hover | opacity | — | no | 0 | 1 | 150 ms | P2 |
| A07 | Hero | curtain | scroll | CSS sticky overlap | −Y | yes (native) | — | covered | — | P0 |
| A08 | Hero | copy | cover top bottom→top | y+opacity | −Y | yes (1) | 0/1 | −48/.35 | linear | P0 |
| A09 | Hero | canvas | same | scale | Z | yes | 1 | 1.06 | linear | P0 |
| A10 | Hero | shader | same | uniform zoom/pulse | Z | yes | 0/.3 | .65/.75 | linear | P0 |
| A11–A15 | Hero | shader/mesh | time | loops | mixed | no | — | — | ∞ | P1–P2 |
| A16 | Hero | cyan points | time+scroll | rotate/scale | Y-rot | partly | — | — | .03 rad/s | P1 |
| A17 | Hero | green points | time | opacity | — | no | .15 | .55 | 2.2 rad/s | P2 |
| A18 | Hero | veil mask | pointer | mask-image | follows | no | none | 168px lens | lerp .085/.055/.12 | P0 |
| A19 | Hero | shader | pointerenter | uHover | — | no | 0 | 1 | lerp .07 | P2 |
| A21 | Headlines | words/chars | top 75→25 % | fade/blur/rise | +Y→0 | yes (.65) | .18/3px/12 | 1/0/0 | stagger .045/.018 | P0 |
| A22 | S2 | track | auto | translateX | ← | no | 0 | −50 % | 42 s linear ∞ | P1 |
| A23 | S3 | words | top 75→25 % | fade/blur | — | yes (.65) | .18/3px | 1/0 | stagger .28 | P0 |
| A24 | S4 | wrappers | scroll | sticky stack | ↑ | native | — | — | top 72px | P0 |
| A25 | S4 | card | next top 85→25 % | scale+brightness | Z | yes (true) | 1/1 | .94/.55 | linear | P0 |
| A26 | S5 | section | top top | pin | — | yes | — | — | ≥2400px | P0 |
| A27 | S5 | track | pin | translateX | ← | yes (1) | 0 | −overflow−40 | linear | P0 |
| A28 | S5 | bar | pin | scaleX | → | yes (1) | 0 | 1 | linear | P1 |
| A29 | S6 | reveal blocks | top 72 % | fade/rise | +Y→0 | no | 36/0 | 0/1 | .85 s stg .08 p3.out | P1 |
| A30–A33 | S6 | panel parts | tab click | fade/rise/bars/slide | mixed | no | — | — | .4–.8 s | P1–P2 |
| A34 | S6/S7 | dots | auto | ping | scale | no | 1/1 | 2/0 | 1 s ∞ | P2 |
| A35 | S7 | counters | top 85 % | number | — | no | 0 | value | 1.8 s p2.out | P1 |
| A36 | S7 | chips | top 70 % | fade/rise | +Y | no | 20/0 | 0/1 | .7 s stg .06 | P2 |
| A37–A39 | S7 | edges/nodes/panel | top 78 % once | draw/pop/rise | — | no | — | — | 1.15/.55/.55 s | P1 |
| A40–A42 | S7 | edges/packets/rings | auto | loops | along path | no | — | — | 2.3–4.9 s ∞ | P1–P2 |
| A43–A45 | S7 | glow/copy/edges | node hover | tween/transition | — | no | — | — | .35–.55 s | P2–P3 |
| A46 | S8 | track | auto | translateX | ← | no | 0 | −50 % | 55 s ∞ | P2 |
| A47 | S9 | chars | top 75→25 % | as A21 | — | yes | — | — | stagger .018 | P1 |
| A48–A50 | UI | icons/buttons | hover/click | micro | — | no | — | — | 150–300 ms | P3 |

---

## 13. Text-animation analysis

| Text | Initial | Trigger | Transformation | Final |
|---|---|---|---|---|
| All section H2s (RevealHeadline, word) | each word 18 % opacity, 3 px blur, +12 px | heading top at 75 % vh | scrubbed L→R stagger .045 | full, sharp, gradient white→zinc-400 |
| "Let's talk." (char) | same per char | same | stagger .018 | same |
| Mission paragraph (KineticText scroll-highlight) | words 18 %, 3 px blur (no Y) | top 75 % | slow reading sweep, stagger .28 | full |
| Hero H1/eyebrow/sub | static on load | scroll (md+) | whole block rises 48 px & fades to 35 % | covered by curtain |
| Stat numbers | "0" | top 85 % | count-up 1.8 s | 120 / 14 / 99.9 / 94 |
| Industries quote | 35 % opacity, +10 px | tab click | fade-up .4 s | full |
| Topology "Active node" copy | +8 px, 0 | node hover | stagger .04 | full |
| No typewriter, scramble, letter-spacing animation, or marquee-on-type other than chips/names marquees [V]. |

Accessibility detail [V]: split headings keep `aria-label` with the full sentence.

---

## 14. Parallax analysis

True multi-layer parallax is limited and deliberate:
- **Hero depth stack [V]:** background shader plane (zooms in ×1.29 + mesh scale), cyan particle layer (z −0.2…−1.6, scales 1.15×), emerald sparkle layer (z +0.05…+0.4), veil (static), copy (moves −48 px), curtain (moves at full scroll speed). Relative speeds: curtain 1.0 > copy ≈ 0.05 (48 px over 1 vh) > background ≈ 0 (zooms instead of translating) → strong depth illusion of "camera pushing into the creature while a sheet rises in front".
- **Idle camera sway [V]:** mesh rotY `0.06 sin(.35t) + .08·hover`, rotX `0.03 cos(.28t) − .04·hover`, rotZ `.015 sin(.2t)` → slow organic parallax without input.
- **Sticky stack [V]:** receding card (scale .94, 55 % brightness) vs incoming card (full speed) = depth parallax.
- No other background layers move at different speeds [V].

---

## 15. Sticky / pinned analysis

```
Viewport
 ├─ Header (fixed, z-50, 72 px)
 ├─ Dip overlay (fixed, z-35)
 ├─ HERO  sticky top:0, 100svh, z-0 ─────────── stays for the entire page underneath (never unsticks visually; covered)
 └─ Cover sheet (relative z-20) scrolls over it
      ├─ SERVICES: 4 × wrapper {sticky top:72px; height:100svh}  (md+)
      │     timeline per card = next wrapper's top 85%→25%  → scale .94 / brightness .55
      └─ CASE STUDIES: ScrollTrigger pin (section = 100svh) (md+)
            pin length = max(2400px, .75 × track width)
            progress 0→1 ↦ track x 0 → −(overflow+40px), bar scaleX 0→1
```
- No scroll-snapping, no scroll-jacking beyond Lenis easing [V].
- `anticipatePin:1` prevents jump at pin start; `invalidateOnRefresh` recomputes widths on resize.

---

## 16. Cursor / mouse interaction analysis

| Effect | Present | Detail |
|---|---|---|
| Custom cursor / trail / magnetic buttons | No [V] | — |
| Cursor-revealed imagery | **Yes** | A18 liquid lens on hero (md+, left 62 %) |
| Pointer-based shader response | Yes | A19 uHover (pointerenter/leave on canvas wrapper); whether it fires under the overlaying copy/veil layers is **[U]** (overlays are siblings, so it may only fire where the canvas is uncovered) |
| Hover-driven data viz | Yes | Topology nodes (A43–A45) |
| Hover dropdown | Yes | Header services menu |

---

## 17. Automatic animations

| Anim | Speed | Direction | Loop | Scroll interaction |
|---|---|---|---|---|
| Tech marquee | 42 s per half-width | ← | ∞ linear | none; disabled under reduced motion |
| Partner marquee | 55 s | ← | ∞ | same |
| Shader drift | sin(.12t)/cos(.1t) | ± | ∞ | amplitude ↑ with hover |
| Matrix rain | uTime·6 | ↓ in UV | ∞ | masked to glowing parts of image |
| Pulse ring | 1/0.15 ≈ 6.7 s | radial out from (0.58,0.5) | ∞ | brightness ↑ with scroll pulse |
| Constellation/arcs | .25–.35 rad/s | wave | ∞ | — |
| Particles | .03 rad/s rotY | — | ∞ | scale with scroll zoom |
| Sparkles | opacity 2.2 rad/s | — | ∞ | — |
| Mesh sway/breath | .2–.35 rad/s; breath 1.5 rad/s | — | ∞ | scale with zoom |
| Cursor lens breathing | 2.4 rad/s | — | while active | — |
| Ping dots | 1 s cubic-bezier(0,0,.2,1) | scale 1→2, fade | ∞ | — |
| Topology dash flow, packets, sonar | 2.3–4.9 s | along paths | ∞ (after first reveal) | — |

---

## 18. Responsive animation analysis [V]

| Behaviour | ≥1024 fine pointer | 768–1023 | <768 / touch |
|---|---|---|---|
| Lenis | on | **off** (native) | off |
| Hero scroll timeline (A08–A10) | on | on | **off** |
| Hero cursor lens | on | on | off |
| Hero layout | copy centered-left, veil 118° gradient | same | copy bottom-aligned (`items-end pb-10`), full-width buttons, vertical veil gradient |
| Sticky card stack + recede | on | on | **off** → simple list |
| Runway pin + horizontal | on | on | **off** → vertical list, bar full |
| CinematicSection / dip overlay / RevealHeadline / KineticText / counters / marquees / topology | on | on | on |
| Header nav | inline (lg) | burger | burger drawer |
| Reduced motion | marquees stop; Lenis off; GSAP scroll effects still run [V — not gated] |

---

## 19. Section-by-section reconstruction spec

**S0 Hero** — Purpose: brand statement over living art. Layout: 100svh sticky, `z-0`, canvas full-bleed; top 96 px & bottom 112 px dark gradient scrims; veil; copy column max-w-xl/2xl. Content: eyebrow → H1 (≤16ch) → sub (mist) → 2 CTAs (solid emerald / glass ghost) → amber tagline with 32 px rule. Motion: A07–A20. Rebuild notes: use R3F `<Canvas dpr={[1,1.75]} camera={{position:[0,0,5],fov:40}} gl={{antialias:true,alpha:false}}>`, background `#030706`, plane sized `1.1 × viewport`, custom ShaderMaterial (uniforms listed in §10), 2 `<points>` layers; load via `next/dynamic` `ssr:false` with PNG fallback.

**S1 Intro** — two-column (headline left, blurb + text link right, `md:items-end`). RevealHeadline word.

**S2 Tech marquee** — `bg-ink-soft py-8`, centered micro label, duplicated pill list `gap-3`, pills `rounded-full border-white/10 bg-white/[.03] text-sm text-white/70`, edge fades.

**S3 Mission** — label + one giant statement (up to xl:text-6xl) with scroll-highlight.

**S4 Services stack** — eyebrow, RevealHeadline + right "All services →"; 4 cards (tag pill w/ icon, H3, desc, 2-col bullet list with accent dots, ghost button pinned bottom via `md:mt-auto`; right visual panel). Accent colour per card feeds glow, bullets, icon, visual.

**S5 Runway** — header row (eyebrow/H2/link left, explanatory note right, `md:pt-[5.75rem]` to clear header), track of 5 cards (industry pill + mono "01 / 05", H3, summary, metric chips, signal button; right: wireframe mock with 36 px grid), 2 px progress bar at bottom.

**S6 Industries** — intro, pill tab row, 2-col panel (`md:grid-cols-[1.05fr_.95fr]`) quote + impact list | Live playbook card (ping dot, label pill, "X OS", 3 metric bars, mono signal feed), then "not listed?" CTA strip.

**S7 Outcomes** — `lg:grid-cols-[1fr_.9fr]`: headline, sub, 2×2 stats with top border, chip row | topology panel 300→500 px tall.

**S8 Partners** — eyebrow + headline left, partner pills right; slow marquee of large faded Syne words (`text-white/25 text-2xl md:text-3xl`).

**S9 CTA + Footer** — grid-bg at 30 %, bottom radial glow; CTA left (char-split "Let's talk.", sub, 2 buttons), contact list right; 4-col footer (brand blurb, Links, Services, Follow); bottom legal bar `text-xs text-white/40`.

---

## 20. Recommended implementation architecture (for the rebuild)

```
Observed behaviour → properties → technique → library
Smooth inertial scroll → eased scroll position → Lenis driven by gsap.ticker → lenis
Scrubbed reveals → opacity/blur/y bound to progress → gsap.fromTo + ScrollTrigger{scrub} → gsap
Pinned horizontal → pin + x tween → ScrollTrigger pin, invalidateOnRefresh → gsap
Sticky stack → CSS position:sticky + scale/filter tween → Tailwind + gsap
Dip-to-black → fixed overlay + per-section 2-step timeline → gsap
WebGL hero → shader plane + points → @react-three/fiber + three (dynamic import, ssr:false)
Cursor lens → rAF lerp + CSS mask-image radial gradients → vanilla TS hook
Marquee → CSS @keyframes translateX(-50%) on duplicated list → Tailwind custom class
Counters/topology → gsap tweens, SVG getTotalLength/getPointAtLength → gsap
Breakpoint gating → gsap.matchMedia('(min-width:768px)') + window.matchMedia for Lenis → gsap
```
- Wrap every effect in `gsap.context(..., scope)` / `useGSAP` and `revert()` on unmount; call `ScrollTrigger.refresh()` on rAF, `load`, and after 400 ms (fonts/images shift layout).
- Next.js App Router + TypeScript + Tailwind v4 (`@theme` tokens from §5) + `next/font/google` (§3) + lucide-react + clsx/tailwind-merge.
- Keep components client-only where they touch GSAP (`'use client'`); page itself can be a server component composing them.

---

## 21. Reconstruction priorities

- **P0 (identity):** Lenis + scrub feel (A01), dip-to-black (A02), CinematicSection blur-rise (A03), hero sticky curtain + scroll zoom (A07–A10), cursor liquid lens (A18), RevealHeadline & Mission highlight (A21, A23), sticky recede stack (A24–A25), pinned horizontal runway (A26–A27).
- **P1:** header glass state, shader idle loops & particles, marquee, runway progress bar, industries reveal + metric bars, counters, topology draw + live loops, "Let's talk" char reveal.
- **P2:** dropdown fade, sparkles, hover glow in shader, tab-change micro reveals, chips, ping dots, sonar rings, node-hover glow/copy, partner marquee.
- **P3:** fallback plate, arrow nudges, colour-swap hovers, chevron rotation, edge highlight transitions.

---

## 22. Verified vs approximate vs inferred vs unknown

- **VERIFIED:** stack (Next.js App Router, Tailwind v4, GSAP+ScrollTrigger, Lenis, three/R3F); all fonts and fallbacks; all colour tokens; every GSAP parameter quoted; Lenis config & gating; shader source; cursor-mask math; section order and component names; breakpoints; reduced-motion rule.
- **OBSERVED — APPROXIMATE:** scroll-percentage positions in §11 (depend on viewport); perceived "weight" of scrubbing.
- **INFERRED:** which breakpoint swaps the two `.hero-veil-blend` gradients; desktop section heights; `next/font/google` usage (strongly implied by hashed `__variable_*` classes and generated fallback faces); that the hero art is a lizard/"bio-tech" plate (asset name `/hero/lizard-tech.png`).
- **UNKNOWN:** pixel appearance at 1440 px (no desktop screenshot captured); whether shader hover (A19) fires under the copy overlay; exact GSAP & Lenis package versions; whether `.noise-overlay` is applied on the home page.

---

## 23. Final animation completeness check

**Second pass performed:** yes — after the section-by-section read, the full client bundle list was re-scanned for every GSAP call (`to/from/fromTo/timeline/set`), every `requestAnimationFrame`, every `pointermove/pointerenter`, every CSS `@keyframes`, `animate-*` utility and `transition` utility, and the lazy WebGL chunk. That second pass added A11–A17, A19, A34, A40–A42 and A48–A50, which a visual-only pass would likely have missed or under-specified.

**ANIMATION AUDIT RESULT**
- Total animations identified: **50** (A01–A50)
- Scroll-linked animations: **14** (A01, A02, A03, A08, A09, A10, A16-scale, A21, A23, A25, A27, A28, A47, + native-sticky A07/A24 counted separately)
- Scroll-triggered (one-shot/threshold) animations: **7** (A05, A29, A35, A36, A37, A38, A39)
- Hover animations: **9** (A06, A19, A43, A44, A45, A48, A49, nav/link colour swaps, industry tab hover)
- Cursor animations: **2** (A18 liquid lens, A19 shader hover)
- Automatic animations: **14** (A11–A17, A22, A34, A40, A41, A42, A46, lens breathing)
- Text animations: **6** (A21, A23, A47, A30, A35, A44)
- Parallax animations: **4** (hero depth stack A08/A09/A10/A16, idle mesh sway A11)
- Sticky/pinned animations: **5** (A07, A24, A25, A26, A27)
- Micro-animations: **10** (A06, A31, A32, A33, A34, A42, A45, A48, A49, A50)
- Responsive-specific animations: **7** gated to ≥768 (A08–A10, A18, A25, A26–A28) + Lenis gated to ≥1024
- Unverified/uncertain behaviours: **3** (A19 firing under overlays; veil breakpoint; desktop pixel rendering)

**Did I perform a second animation-focused pass after completing the first analysis?** Yes — a code-level sweep of every shipped client chunk and the stylesheet, separate from the section read.

**Did I identify every observable animation I could verify?** Every animation defined in the home page's client code and CSS is listed. Subpages (/services, /work, /about, /ai-edge, 404 canvas) were not analysed.

**Which behaviours could not be verified?** Desktop-width visual rendering (not screenshotted), whether the shader hover (A19) actually triggers beneath the copy/veil overlays, and exactly which breakpoint swaps the hero veil gradient.
