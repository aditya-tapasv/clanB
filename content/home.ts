export const HOME_CONTENT = {
  // S0 — ArenaHero (FRD 01)
  hero: {
    eyebrow: "GAME-TECH PLATFORM",
    h1: "Technology that makes games easier to play and easier to run",
    sub: "Board games and sports, discovered, booked and hosted in one place — for players who want a table tonight and for the vendors, venues and organizers who make it happen.",
    primaryCta: {
      label: "Explore Clan B",
      href: "/venues",
    },
    secondaryCta: {
      label: "Become a Vendor",
      href: "/services/vendor",
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

  // S4 — Services stack (HostStack)
  hostStack: {
    eyebrow: "Services",
    headline: "Four ways to work with Clan B.",
    link: {
      label: "All services →",
      href: "/services",
    },
    cards: [
      {
        id: "vendor",
        tag: "01 — Vendor",
        accent: "#5CF111",
        title: "Become a Vendor",
        description:
          "Run board-game nights, coaching and open sessions with capacity, pricing, rules and a cancellation policy — without the group-chat chaos.",
        capabilities: [
          "Session builder",
          "Capacity & waitlist",
          "Participant messaging",
          "Payouts & reconciliation",
        ],
        ctaLabel: "Become a Vendor",
        ctaHref: "/services/vendor",
        visualType: "console",
      },
      {
        id: "partner",
        tag: "02 — Partner",
        accent: "#34D399",
        title: "Partner with Clan B",
        description:
          "Vendors, organizers, corporates and academies — bring your business onto Clan B and run official game nights, playdays and leagues with us.",
        capabilities: [
          "Co-hosted events",
          "Corporate & group playdays",
          "Managed operations",
          "Verified partner badge",
        ],
        ctaLabel: "Partner with Clan B",
        ctaHref: "/services/partner",
        visualType: "mobile",
      },
      {
        id: "venues",
        tag: "03 — Space",
        accent: "#06B6D4",
        title: "List Your Venue",
        description:
          "Turn empty tables, courts, rooms and pods into bookable inventory with opening hours, blackout windows and booking rules.",
        capabilities: [
          "Resource inventory",
          "Slots & blackout windows",
          "Auto-confirm rules",
          "Occupancy view",
        ],
        ctaLabel: "List Your Venue",
        ctaHref: "/services/list-venue",
        visualType: "slots",
      },
      {
        id: "organizers",
        tag: "04 — Compete",
        accent: "#D97706",
        title: "Organize a Tournament",
        description:
          "Set up leagues and knockouts with registrations, brackets, scoring and standings — tell us what you want to run and we'll set it up with you.",
        capabilities: [
          "Registrations",
          "Brackets & seeding",
          "Score entry with audit trail",
          "Live standings",
        ],
        ctaLabel: "Organize a Tournament",
        ctaHref: "/services/partner?type=Organizer",
        visualType: "metrics",
      },
    ],
  },

  // S5 — Trust
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

  // Final CTA & Footer
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
      href: "/services/partner",
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
          { label: "Become a Vendor", href: "/services/vendor" },
          { label: "Partner with Clan B", href: "/services/partner" },
          { label: "List Your Venue", href: "/services/list-venue" },
          { label: "Organize a Tournament", href: "/services/partner?type=Organizer" },
        ],
      },
      {
        title: "Company",
        links: [
          { label: "About", href: "/about" },
          { label: "Contact", href: "/contact" },
          { label: "Careers", href: "/about#careers" },
          { label: "Services", href: "/services" },
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
      { label: "Services", href: "/#host" },
      { label: "Trust", href: "/#trust" },
    ],
    copyright: "© 2026 CLANB TECH SOLUTIONS PRIVATE LIMITED. All rights reserved.",
  },
};
