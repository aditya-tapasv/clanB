export interface HelpSection {
  heading: string;
  body: string;
}

export interface HelpTopic {
  slug: string;
  title: string;
  summary: string;
  icon: "CalendarCheck" | "RotateCcw" | "ShieldCheck" | "Flag";
  sections: HelpSection[];
}

export const HELP_CONTENT = {
  eyebrow: "HELP CENTRE",
  title: "How can we help?",
  sub: "Booking policies, refunds, safety and support — and a direct line when something goes wrong.",
  topicsHeading: "Browse topics",
  faqHeading: "Common questions",
  faqs: [
    {
      q: "Do I need an account to browse?",
      a: "No. You can browse every session, venue, game and sport without signing in. We only ask you to sign in when you book.",
    },
    {
      q: "What does “held” mean during checkout?",
      a: "When you start a booking we hold your seats for 10 minutes so nobody else can take them while you review the price and policies.",
    },
    {
      q: "Where do I find my QR code?",
      a: "In My Clan B under your upcoming bookings, and in your confirmation email. Hosts scan it at check-in.",
    },
    {
      q: "How do I join a waitlist?",
      a: "When a session is full, the booking card shows “Join waitlist”. If a seat opens, we notify you and hold it for a limited time.",
    },
  ],
  contact: {
    heading: "Still stuck?",
    body: "Report an issue with a booking and we'll show you what happens next.",
    cta: "Report an issue",
    href: "/help/report",
  },
} as const;

export const HELP_TOPICS: HelpTopic[] = [
  {
    slug: "bookings",
    title: "Booking policies",
    summary: "How booking, holds, confirmation and cancellations work.",
    icon: "CalendarCheck",
    sections: [
      {
        heading: "Booking modes",
        body: "Most sessions confirm instantly. Some hosts approve each request first, and custom events use a request-for-quote. The booking card always tells you which one applies before you pay.",
      },
      {
        heading: "Seat holds",
        body: "Starting checkout places a 10-minute hold on your seats or slot. If the timer runs out, the seats are released and you can start again if they're still available.",
      },
      {
        heading: "Cancellation policies",
        body: "Every session shows its cancellation policy on the detail page and at checkout — flexible, moderate or strict. The policy in force when you booked is the one that applies.",
      },
      {
        heading: "Changes by the host",
        body: "If a host changes the time or venue, we notify you and you can cancel for a full refund. If they cancel, you're refunded automatically.",
      },
    ],
  },
  {
    slug: "refunds",
    title: "Refunds",
    summary: "When you get money back, how much, and how long it takes.",
    icon: "RotateCcw",
    sections: [
      {
        heading: "How much you get back",
        body: "Refunds follow the session's cancellation policy. Your receipt shows the base price, platform fee, taxes and any discount so you can see exactly what is refunded.",
      },
      {
        heading: "Host or Clan B cancellations",
        body: "If the session is cancelled by the host, the venue or Clan B, you receive a full refund including fees.",
      },
      {
        heading: "Timelines",
        body: "Refunds are issued to your original payment method. Banks usually take 5–7 working days to show them.",
      },
      {
        heading: "Disputes",
        body: "If something didn't match the listing, report an issue from the booking within 48 hours and our team will review it.",
      },
    ],
  },
  {
    slug: "safety",
    title: "Safety",
    summary: "Verified hosts, venue standards and what to do if you feel unsafe.",
    icon: "ShieldCheck",
    sections: [
      {
        heading: "Verified hosts and venues",
        body: "Providers with a verified badge have completed identity and business checks. Reviews come only from people who actually attended.",
      },
      {
        heading: "At the session",
        body: "Every event page lists an on-site contact. Venues display house rules, and hosts can remove anyone who breaks them.",
      },
      {
        heading: "Sports safety",
        body: "Warm up, wear the recommended footwear and tell the host about any injuries. Skill levels on listings help you find a game that suits you.",
      },
      {
        heading: "If something goes wrong",
        body: "In an emergency, contact local emergency services first (112 in India). Then report the issue so we can follow up with the provider.",
      },
    ],
  },
  {
    slug: "report",
    title: "Report an issue",
    summary: "Tell us about a problem with a booking, a session or a provider.",
    icon: "Flag",
    sections: [
      {
        heading: "What happens next",
        body: "You'll get a reference number straight away. Our team reviews every report within one working day and keeps you updated by email.",
      },
    ],
  },
];

export const REPORT_ISSUE_TYPES = [
  { value: "booking", label: "Problem with a booking or payment" },
  { value: "session", label: "Session didn't match the listing" },
  { value: "safety", label: "Safety or conduct concern" },
  { value: "venue", label: "Venue or facilities issue" },
  { value: "other", label: "Something else" },
] as const;
