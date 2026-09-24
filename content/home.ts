export const HOME_CONTENT = {
  // S0 — ArenaHero (FRD 01)
  hero: {
    eyebrow: "GAME-TECH PLATFORM",
    h1: "Technology that makes games easier to play and easier to run",
    sub: "Board games and sports, discovered, booked and hosted in one place — for players who want a table tonight and for the vendors, venues and organizers who make it happen.",
    primaryCta: {
      label: "Explore Clan B",
      href: "/play",
    },
    secondaryCta: {
      label: "Host with Clan B",
      href: "/for-providers",
    },
    tagline: "PLAY · HOST · RUN",
  },

  // S1 — Intro
  intro: {
    eyebrow: "Where Play Gets Built",
    headline: "Play, with a system behind it",
    blurb:
      "From a Saturday strategy table to a city-wide badminton ladder — Clan B turns scattered chats, spreadsheets and phone calls into bookable, trackable, repeatable play.",
    link: {
      label: "How Clan B works →",
      href: "/about#how",
    },
  },

  // S2 — Games & sports marquee
  gamesMarquee: {
    label: "Games & Sports on Clan B",
    items: [
      "Chess",
      "Catan",
      "Codenames",
      "Ticket to Ride",
      "Azul",
      "Splendor",
      "Dixit",
      "Carrom",
      "Badminton",
      "Pickleball",
      "Futsal",
      "Box Cricket",
      "Table Tennis",
      "Snooker",
      "Basketball",
      "Football 5s",
      "Quiz Nights",
      "Deduction Games",
      "Co-op Campaigns",
      "Party Games",
    ],
  },

  // S3 — Mission
  mission: {
    label: "Mission",
    text: "We build the technology that makes games and sports easier to join and easier to run — real tables, real courts, real people, one connected platform.",
  },

  // S4 — Play: PlayRunway (FRD 02)
  playRunway: {
    eyebrow: "Play",
    h2: "Find something worth playing",
    link: {
      label: "Explore Play →",
      href: "/play",
    },
    note: "Scroll vertically — the runway moves through five ways to play.",
    cards: [
      {
        id: "board-games",
        category: "Board Games",
        index: "01 / 05",
        title: "Board-Game Nights",
        summary:
          "Hosted tables at cafés with a facilitator who teaches the rules and keeps the game moving.",
        chips: ["4–6 seats per table", "Beginner-friendly"],
        tone: "from-lime-400/30 via-transparent to-cyan-400/20",
        ctaLabel: "Find a Game",
        ctaHref: "/games",
      },
      {
        id: "open-sessions",
        category: "Drop-in",
        index: "02 / 05",
        title: "Open Sessions",
        summary:
          "Join an existing session instead of organising your own group. Book a seat, show up, play.",
        chips: ["Book a single seat", "Waitlist when full"],
        tone: "from-sky-400/30 via-transparent to-indigo-400/20",
        ctaLabel: "Browse Sessions",
        ctaHref: "/events?type=open-session",
      },
      {
        id: "venues",
        category: "Venues",
        index: "03 / 05",
        title: "Courts & Tables",
        summary:
          "Reserve a badminton court, a snooker table or a private game room — by the slot.",
        chips: ["Slot-based booking", "Clear house rules"],
        tone: "from-violet-400/30 via-transparent to-fuchsia-400/20",
        ctaLabel: "Find a Venue",
        ctaHref: "/venues",
      },
      {
        id: "tournaments",
        category: "Competition",
        index: "04 / 05",
        title: "Tournaments & Leagues",
        summary:
          "Register solo or as a team, then follow brackets, fixtures and standings.",
        chips: ["Brackets & standings", "Team entries"],
        tone: "from-amber-300/30 via-transparent to-orange-400/20",
        ctaLabel: "Explore Events",
        ctaHref: "/events?type=tournament",
      },
      {
        id: "groups",
        category: "Groups",
        index: "05 / 05",
        title: "Private Groups",
        summary:
          "Book a whole table, court or room for your crew, your office or a birthday.",
        chips: ["Group booking", "Invite your crew"],
        tone: "from-teal-300/30 via-transparent to-lime-300/20",
        ctaLabel: "Plan a Group",
        ctaHref: "/play?mode=group",
      },
    ],
  },

  // S5 — Host / Space / Events: HostStack (FRD 03, 04, 05, 10)
  hostStack: {
    eyebrow: "For Providers",
    headline: "Four ways to run it.",
    link: {
      label: "Partner with Clan B →",
      href: "/for-providers",
    },
    cards: [
      {
        id: "host",
        tag: "01 — Host",
        accent: "#5CF111",
        title: "Host a Session",
        description:
          "Launch board-game nights, coaching and open sessions with capacity, pricing, rules and a cancellation policy — without the group-chat chaos.",
        capabilities: [
          "Session builder",
          "Capacity & waitlist",
          "Participant messaging",
          "Payouts & reconciliation",
        ],
        ctaLabel: "Host a Session",
        ctaHref: "/for-providers/host",
        visualType: "console",
      },
      {
        id: "venues",
        tag: "02 — Space",
        accent: "#06B6D4",
        title: "List Your Space",
        description:
          "Turn empty tables, courts, rooms and pods into bookable inventory with opening hours, blackout windows and booking rules.",
        capabilities: [
          "Resource inventory",
          "Slots & blackout windows",
          "Auto-confirm rules",
          "Occupancy view",
        ],
        ctaLabel: "List Your Space",
        ctaHref: "/for-providers/venues",
        visualType: "slots",
      },
      {
        id: "organizers",
        tag: "03 — Compete",
        accent: "#D97706",
        title: "Run Tournaments",
        description:
          "Set up leagues and knockouts with registrations, brackets, scoring and standings — all from one organizer workspace.",
        capabilities: [
          "Registrations",
          "Brackets & seeding",
          "Score entry with audit trail",
          "Live standings",
        ],
        ctaLabel: "Organize a Tournament",
        ctaHref: "/for-providers/organizers",
        visualType: "metrics",
      },
      {
        id: "clanb-events",
        tag: "04 — Official",
        accent: "#34D399",
        title: "Clan B Events",
        description:
          "Clan B also hosts and operates official game nights, tournaments and corporate playdays — end to end, with verified hosts.",
        capabilities: [
          "Official events",
          "Corporate & group playdays",
          "Managed operations",
          "Verified hosts",
        ],
        ctaLabel: "See Clan B Events",
        ctaHref: "/events?host=clanb",
        visualType: "mobile",
      },
    ],
  },

  // S6 — Sports: SportsPulse (FRD 06)
  sportsPulse: {
    eyebrow: "Sports",
    headline: "Follow the sports you care about",
    sub: "Upcoming fixtures, recent results and where to play it near you — information that turns into participation.",
    link: {
      label: "Explore Sports →",
      href: "/sports",
    },
    panels: [
      {
        title: "Live now",
        isLive: true,
        source: "Sample data",
        updatedAt: "2 min ago",
        items: [
          {
            title: "BLR Badminton Super Ladder · QF",
            detail: "Court 3 · Set 2 (18-16)",
            comp: "Clan B City League",
            venueLink: "/sports/badminton#local-play",
          },
          {
            title: "Box Cricket 6s · Group Stage",
            detail: "HSR Turf · 42/2 (4.1 ov)",
            comp: "Weekend Cup",
            venueLink: "/sports/box-cricket#local-play",
          },
        ],
      },
      {
        title: "Upcoming",
        isLive: false,
        source: "Sample data",
        updatedAt: "10 min ago",
        items: [
          {
            title: "Futsal 5s Open Knockout",
            detail: "Today, 8:00 PM · 4 slots left",
            comp: "Indiranagar Arena",
            venueLink: "/sports/futsal-5s#local-play",
          },
          {
            title: "Table Tennis Masters — Round 1",
            detail: "Tomorrow, 10:00 AM · 8/16 seats",
            comp: "Jayanagar TTC",
            venueLink: "/sports/table-tennis#local-play",
          },
        ],
      },
      {
        title: "Recent results",
        isLive: false,
        source: "Sample data",
        updatedAt: "15 min ago",
        items: [
          {
            title: "Chess Rapid Ladder #12",
            detail: "Winner: A. Rao (5.5/6) · Verified",
            comp: "Church St Club",
            venueLink: "/sports/chess#local-play",
          },
          {
            title: "Pickleball Doubles Final",
            detail: "Team Smash won 21-19, 21-17",
            comp: "Whitefield Open",
            venueLink: "/sports/pickleball#local-play",
          },
        ],
      },
    ],
  },

  // S7 — Games: GamesMood (FRD 07)
  gamesMood: {
    eyebrow: "Games",
    headline: "Discover board games by group, time and mood",
    sub: "Tell us who's playing and how long you've got. We'll show games that fit — and the tables where they're being played.",
    tabs: [
      {
        id: "quick",
        name: "Quick",
        quote: "In and out in under 30 minutes",
        body: "Light rules, fast turns, instant rematches — perfect before dinner or between rounds.",
        bullets: [
          "Learn in 5 minutes",
          "Great for 2–6",
          "Easy rematches",
        ],
        accent: "#5CF111",
        metrics: [
          { label: "Players", value: "2–6", pct: 70 },
          { label: "Play time", value: "20 min", pct: 30 },
          { label: "Complexity", value: "Light", pct: 25 },
        ],
        feedRows: [
          "table.open — Indiranagar café, 7:30 PM",
          "seats.left 3 · host.verified",
          "game: Codenames / Sushi Go",
        ],
      },
      {
        id: "strategic",
        name: "Strategic",
        quote: "Plan deep, play long",
        body: "Engine-builders and area-control games for players who like to think three turns ahead.",
        bullets: [
          "Deep decisions",
          "Rewarding replays",
          "Facilitator on hand",
        ],
        accent: "#06B6D4",
        metrics: [
          { label: "Players", value: "2–4", pct: 45 },
          { label: "Play time", value: "90 min", pct: 85 },
          { label: "Complexity", value: "Heavy", pct: 88 },
        ],
        feedRows: [
          "table.open — Koramangala, 6 PM",
          "teach.included · seats.left 1",
          "game: Terraforming Mars / Catan",
        ],
      },
      {
        id: "social",
        name: "Social",
        quote: "Talk, laugh, bluff",
        body: "Games where the table conversation is the game — ideal for new groups and mixed crowds.",
        bullets: [
          "Icebreakers",
          "Low pressure",
          "Big groups welcome",
        ],
        accent: "#34D399",
        metrics: [
          { label: "Players", value: "4–10", pct: 90 },
          { label: "Play time", value: "30 min", pct: 40 },
          { label: "Complexity", value: "Light", pct: 22 },
        ],
        feedRows: [
          "table.open — HSR, 8 PM",
          "group.friendly · seats.left 6",
          "game: Secret Hitler / Dixit",
        ],
      },
      {
        id: "competitive",
        name: "Competitive",
        quote: "Bring your A-game",
        body: "Ranked nights, ladders and head-to-heads for players who keep score.",
        bullets: [
          "Ladders & ratings",
          "Tournament formats",
          "Verified results",
        ],
        accent: "#D97706",
        metrics: [
          { label: "Players", value: "2", pct: 35 },
          { label: "Play time", value: "45 min", pct: 55 },
          { label: "Complexity", value: "Medium", pct: 60 },
        ],
        feedRows: [
          "ladder.round 3 live",
          "bracket.updated · results.verified",
          "game: Chess / Hive / 7 Wonders Duel",
        ],
      },
      {
        id: "party",
        name: "Party",
        quote: "The louder the better",
        body: "Word, drawing and reaction games built for big tables and loud rooms.",
        bullets: [
          "6+ players",
          "Minimal setup",
          "Instant laughs",
        ],
        accent: "#FB7185",
        metrics: [
          { label: "Players", value: "6–12", pct: 95 },
          { label: "Play time", value: "25 min", pct: 35 },
          { label: "Complexity", value: "Light", pct: 18 },
        ],
        feedRows: [
          "party.night Friday",
          "seats.left 10 · host.verified",
          "game: Telestrations / Just One",
        ],
      },
      {
        id: "co-op",
        name: "Co-op",
        quote: "Win together or lose together",
        body: "Team up against the game — campaigns, puzzles and escape-room style adventures.",
        bullets: [
          "Teamwork first",
          "Great for couples & teams",
          "Campaign nights",
        ],
        accent: "#A78BFA",
        metrics: [
          { label: "Players", value: "1–4", pct: 55 },
          { label: "Play time", value: "60 min", pct: 70 },
          { label: "Complexity", value: "Medium", pct: 62 },
        ],
        feedRows: [
          "campaign.session 4",
          "seats.left 2 · teach.included",
          "game: Pandemic / The Crew",
        ],
      },
    ],
    ctaStrip: {
      headline: "Can't find your game? That's not a problem.",
      sub: "Tell us what you want to play and when. We'll let you know when a table opens.",
      buttonLabel: "Request a game",
      buttonHref: "/play/request",
    },
  },

  // S8 — Intelligence (FRD 08)
  intelligence: {
    eyebrow: "Intelligence",
    headline: "Smart where it matters. Never a chatbot.",
    sub: "Recommendations and helpers live inside the pages where you decide — ranked by real inventory, never invented.",
    counters: [
      { target: 9, suffix: "", label: "Bookable service types" },
      { target: 5, suffix: "", label: "Sides of one marketplace" },
      { target: 100, suffix: "%", label: "Server-verified bookings" },
      { target: 14, suffix: "", label: "Embedded AI helpers mapped" },
    ],
    chips: [
      "Smart discovery",
      "Contextual recommendations",
      "Event builder",
      "Schedule optimizer",
      "Player matching",
      "Fill-rate assistant",
    ],
    graphNodes: [
      {
        id: "engine",
        x: 50,
        y: 48,
        label: "Clan B Engine",
        kind: "core" as const,
        blurb: "One source of truth for activities, inventory, bookings and people.",
      },
      {
        id: "discovery",
        x: 78,
        y: 26,
        label: "Smart Discovery",
        kind: "edge" as const,
        blurb: "Ranked recommendations from real, bookable inventory only.",
      },
      {
        id: "builder",
        x: 82,
        y: 66,
        label: "Event Builder",
        kind: "edge" as const,
        blurb: "Drafts an event from a short brief — you review before publishing.",
      },
      {
        id: "matching",
        x: 66,
        y: 80,
        label: "Player Matching",
        kind: "edge" as const,
        blurb: "Opt-in matching for balanced groups and teams.",
      },
      {
        id: "inventory",
        x: 22,
        y: 30,
        label: "Inventory",
        kind: "data" as const,
        blurb: "Tables, courts, rooms and seats with live availability.",
      },
      {
        id: "bookings",
        x: 18,
        y: 68,
        label: "Bookings",
        kind: "data" as const,
        blurb: "Holds, confirmations and check-ins without double-booking.",
      },
      {
        id: "catalog",
        x: 36,
        y: 16,
        label: "Game Catalog",
        kind: "data" as const,
        blurb: "Player count, play time, complexity and mood for every game.",
      },
      {
        id: "venues",
        x: 48,
        y: 86,
        label: "Venues",
        kind: "data" as const,
        blurb: "Verified spaces, rules and opening hours.",
      },
    ],
    graphEdges: [
      ["engine", "inventory"],
      ["engine", "discovery"],
      ["engine", "bookings"],
      ["engine", "builder"],
      ["inventory", "catalog"],
      ["discovery", "builder"],
      ["bookings", "matching"],
      ["builder", "venues"],
      ["matching", "venues"],
      ["catalog", "discovery"],
    ] as [string, string][],
  },

  // S9 — Community (FRD 09)
  community: {
    eyebrow: "Community",
    headline: "Find your crowd. Keep playing.",
    pills: ["Clubs", "Teams", "Ladders", "Follows", "Reviews", "Rebooking"],
    marqueeClubs: [
      "Friday Strategy Club",
      "Koramangala Smashers",
      "Chess After Dark",
      "Weekend Futsal League",
      "Co-op Campaign Crew",
      "Pickleball Ladder",
      "Deduction Night",
      "And your clan",
    ],
  },

  // S10 — Trust (FRD 11)
  trust: {
    eyebrow: "Trust",
    headline: "Know who runs it — and what happens if plans change",
    sub: "Every listing shows who is hosting, the rules, and the cancellation policy before you pay.",
    steps: [
      {
        index: "01",
        title: "Verified providers",
        description:
          "Hosts and venues are verified before they go live, and their trust markers show on every page.",
        icon: "ShieldCheck",
      },
      {
        index: "02",
        title: "Clear policies",
        description:
          "Cancellation, refund and eligibility rules are visible before booking, and saved with your booking.",
        icon: "FileCheck",
      },
      {
        index: "03",
        title: "Check-in & receipts",
        description:
          "Show a QR code at the door, and get itemised receipts for every booking.",
        icon: "QrCode",
      },
      {
        index: "04",
        title: "Real support",
        description:
          "Report an issue, reach support and see what happens next — from the booking itself.",
        icon: "LifeBuoy",
      },
    ],
    link: {
      label: "How bookings work →",
      href: "/help/bookings",
    },
  },

  // S11 — Final CTA & Footer (FRD 12)
  finalCta: {
    eyebrow: "Ready when you are",
    headline: "Play. Host. Run it better.",
    sub: "Clan B is technology for playing, hosting and running games and sports — making it easier to join and easier to operate.",
    primaryBtn: {
      label: "Book a Game",
      href: "/play",
    },
    secondaryBtn: {
      label: "Become a Partner",
      href: "/for-providers",
    },
    contact: {
      email: "hello@clanb.in",
      locations: "Bengaluru · Chennai",
    },
  },

  footer: {
    brandQuote:
      "The future of games. Technology for playing, hosting and running games and sports.",
    columns: [
      {
        title: "Explore",
        links: [
          { label: "Sports", href: "/sports" },
          { label: "Games", href: "/games" },
          { label: "Events", href: "/events" },
          { label: "Venues", href: "/venues" },
          { label: "Clubs", href: "/clubs" },
        ],
      },
      {
        title: "For business",
        links: [
          { label: "Become a Vendor", href: "/for-providers/host" },
          { label: "List a Venue", href: "/for-providers/venues" },
          { label: "Organize a Tournament", href: "/for-providers/organizers" },
          { label: "Corporate & Group Events", href: "/for-providers/corporate" },
        ],
      },
      {
        title: "Company",
        links: [
          { label: "About", href: "/about" },
          { label: "Contact", href: "/about#contact" },
          { label: "Careers", href: "/about#careers" },
          { label: "Partner with Us", href: "/for-providers" },
        ],
      },
      {
        title: "Support",
        links: [
          { label: "Help Center", href: "/help" },
          { label: "Booking Policies", href: "/help/bookings" },
          { label: "Refunds", href: "/help/refunds" },
          { label: "Safety", href: "/help/safety" },
          { label: "Report an Issue", href: "/help/report" },
        ],
      },
      {
        title: "Legal",
        links: [
          { label: "Terms", href: "/legal/terms" },
          { label: "Privacy", href: "/legal/privacy" },
          { label: "Cookies", href: "/legal/cookies" },
          { label: "Accessibility", href: "/legal/accessibility" },
          { label: "Data Controls", href: "/legal/data-controls" },
        ],
      },
    ],
    chapters: [
      { label: "Play", href: "/#play" },
      { label: "Host", href: "/#host" },
      { label: "Sports", href: "/#sports" },
      { label: "Games", href: "/#games" },
      { label: "Community", href: "/#community" },
      { label: "Trust", href: "/#trust" },
    ],
    copyright: "© 2026 CLANB TECH SOLUTIONS PRIVATE LIMITED. All rights reserved.",
  },
};
