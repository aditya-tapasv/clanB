import { HOME_CONTENT } from "@/content/home";

export type ProviderIcon =
  | "CalendarPlus" | "Users" | "Wallet" | "MessageSquare" | "LayoutGrid" | "Clock" | "ShieldCheck" | "BarChart3"
  | "Trophy" | "ListOrdered" | "ClipboardCheck" | "Building2" | "PartyPopper" | "Handshake" | "Sparkles" | "QrCode";

export interface SubLanding {
  slug: "host" | "venues" | "organizers" | "corporate";
  eyebrow: string;
  title: string;
  sub: string;
  providerType: ProviderTypeId;
  benefits: { title: string; body: string; icon: ProviderIcon }[];
  included: string[];
  cta: string;
}

export type ProviderTypeId = "vendor" | "venue" | "organizer" | "corporate";

export const PROVIDERS_CONTENT = {
  hero: {
    eyebrow: "FOR PROVIDERS",
    title: "Run great games without the chaos",
    sub: "Clan B gives vendors, facilitators, venues and organizers one place to list, book, check in and get paid — and puts your sessions in front of players who are looking for them.",
    primary: { label: "Apply to host", href: "/for-providers/apply" },
    secondary: { label: "See how it works", href: "#onboarding" },
  },
  types: {
    eyebrow: "WHO IT'S FOR",
    heading: "Built for every side of the table",
    list: [
      {
        id: "vendor" as const,
        title: "Vendor / Facilitator",
        body: "Game masters, coaches and community hosts running sessions, classes and nights.",
        href: "/for-providers/host",
      },
      {
        id: "venue" as const,
        title: "Venue / Café",
        body: "Board game cafés, courts, turfs and rooms with space and time to fill.",
        href: "/for-providers/venues",
      },
      {
        id: "organizer" as const,
        title: "Organizer",
        body: "Tournament and league runners who need registrations, brackets and standings.",
        href: "/for-providers/organizers",
      },
    ],
  },
  onboarding: {
    eyebrow: "ONBOARDING",
    heading: "Live in four steps",
    sub: "Most providers go from application to first booking in under a week.",
    steps: [
      { title: "Apply", body: "Tell us about your organisation, what you run and where." },
      { title: "Get verified", body: "Upload ID and business documents. We review within two working days." },
      { title: "Set up", body: "Add sessions or inventory, pricing, capacity and your cancellation policy." },
      { title: "Go live", body: "Publish, take bookings, check players in with QR and get paid out weekly." },
    ],
  },
  faq: {
    heading: "Questions providers ask",
    items: [
      {
        q: "What does Clan B cost?",
        a: "Listing is free. Clan B charges players a small platform fee at checkout; commercial terms for providers are shared during onboarding.",
      },
      {
        q: "Who sets prices and policies?",
        a: "You do. Choose your price, capacity and cancellation policy per session or resource. Players see them before they pay.",
      },
      {
        q: "How do payouts work?",
        a: "Confirmed bookings are reconciled automatically and paid out weekly to your bank account, with an itemised statement.",
      },
      {
        q: "Can I keep my existing regulars?",
        a: "Yes. Share your Clan B link with your community — bookings, waitlists and reminders run in one place.",
      },
      {
        q: "Do you use AI to write my listings?",
        a: "Only if you ask. “Draft with AI” suggests a listing from a short brief, and nothing is published until you review it.",
      },
    ],
  },
  finalCta: {
    heading: "Ready to host with Clan B?",
    sub: "Apply in about five minutes. You can save and finish later.",
    label: "Apply to host",
    href: "/for-providers/apply",
  },
} as const;

type Home = typeof HOME_CONTENT;

export const PROVIDER_HOST_STACK: Home["hostStack"] = {
  ...HOME_CONTENT.hostStack,
  eyebrow: "What you can run",
  link: { label: "Apply to host →", href: "/for-providers/apply" },
};

export const PROVIDER_INTELLIGENCE: Home["intelligence"] = {
  ...HOME_CONTENT.intelligence,
  eyebrow: "Provider tools",
  headline: "Helpers that fill your sessions — you stay in control",
  sub: "Clan B suggests schedules, drafts listings and flags low fill early. Every suggestion is reviewed by you before anything goes live.",
  chips: [
    "Draft with AI",
    "Schedule optimizer",
    "Fill-rate assistant",
    "Waitlist auto-fill",
    "Demand signals",
    "Payout reconciliation",
  ],
};

export const PROVIDER_TRUST: Home["trust"] = {
  ...HOME_CONTENT.trust,
  headline: "Players book with confidence — so they book more",
  sub: "Verification, clear policies and QR check-in make your listings the safe choice.",
  link: { label: "Read our booking policies →", href: "/help/bookings" },
};

export const SUB_LANDINGS: SubLanding[] = [
  {
    slug: "host",
    eyebrow: "BECOME A VENDOR",
    title: "Host sessions people come back to",
    sub: "Launch board-game nights, coaching and open sessions with capacity, pricing, rules and a cancellation policy — without the group-chat chaos.",
    providerType: "vendor",
    benefits: [
      { title: "Session builder", body: "Create one-off or recurring sessions in minutes, or let “Draft with AI” start one for you.", icon: "CalendarPlus" },
      { title: "Capacity & waitlists", body: "Seats fill automatically and the waitlist backfills cancellations.", icon: "Users" },
      { title: "Participant messaging", body: "Send updates and reminders to everyone booked — from one place.", icon: "MessageSquare" },
      { title: "Weekly payouts", body: "Itemised statements and automatic reconciliation.", icon: "Wallet" },
    ],
    included: ["Public host profile with verification badge", "QR check-in", "Reviews from attendees only", "Insights on fill rate and repeat players"],
    cta: "Apply as a vendor",
  },
  {
    slug: "venues",
    eyebrow: "LIST A VENUE",
    title: "Turn empty tables and courts into bookings",
    sub: "Publish your tables, courts, turfs and rooms as bookable slots with opening hours, blackout windows and booking rules.",
    providerType: "venue",
    benefits: [
      { title: "Resource inventory", body: "Model every table, court or room with its capacity and pricing.", icon: "LayoutGrid" },
      { title: "Hours & blackouts", body: "Set opening hours and block time for maintenance or private events.", icon: "Clock" },
      { title: "Auto-confirm rules", body: "Instant booking for regulars, approval for large groups — your call.", icon: "ShieldCheck" },
      { title: "Occupancy view", body: "See utilisation by hour and day to price your quiet times.", icon: "BarChart3" },
    ],
    included: ["Venue profile with amenities and house rules", "Host sessions from other providers in your space", "Real-time slot picker for players", "Weekly payouts"],
    cta: "List your venue",
  },
  {
    slug: "organizers",
    eyebrow: "ORGANIZE A TOURNAMENT",
    title: "Run leagues and tournaments from one workspace",
    sub: "Registrations, brackets, scoring and live standings — for board games, chess and sports.",
    providerType: "organizer",
    benefits: [
      { title: "Registrations", body: "Individual or team entries with eligibility checks and entry fees.", icon: "ClipboardCheck" },
      { title: "Brackets & seeding", body: "Knockouts, Swiss and round-robin formats with seeding.", icon: "ListOrdered" },
      { title: "Score entry", body: "Enter results with an audit trail; players see verified scores.", icon: "Trophy" },
      { title: "Check-in", body: "QR check-in per round and no-show handling.", icon: "QrCode" },
    ],
    included: ["Public competition page with standings", "Participant communications", "Venue booking for match days", "Results feed on Clan B Sports"],
    cta: "Apply as an organizer",
  },
  {
    slug: "corporate",
    eyebrow: "CORPORATE & GROUP EVENTS",
    title: "Playdays your team will actually enjoy",
    sub: "Clan B plans and runs board-game afternoons, mini-tournaments and sports days for offices and groups — end to end, with verified hosts.",
    providerType: "corporate",
    benefits: [
      { title: "Managed end to end", body: "Venue, games, hosts and scheduling handled by the Clan B team.", icon: "Handshake" },
      { title: "Formats for any group", body: "From 10-person socials to 200-person tournaments.", icon: "PartyPopper" },
      { title: "Verified hosts", body: "Facilitators who keep everyone playing, including first-timers.", icon: "ShieldCheck" },
      { title: "One invoice", body: "GST invoice and a single point of contact.", icon: "Building2" },
    ],
    included: ["Custom quote within one working day", "On-site or at partner venues", "Team leaderboards and photos", "Post-event report"],
    cta: "Request a corporate event",
  },
];

export const APPLY_CONTENT = {
  steps: ["Organisation", "Contact", "What you run", "Verification", "Review"] as const,
  providerTypes: [
    { id: "vendor", label: "Vendor / Facilitator" },
    { id: "venue", label: "Venue / Café" },
    { id: "organizer", label: "Organizer" },
    { id: "corporate", label: "Corporate & group events" },
  ] as { id: ProviderTypeId; label: string }[],
  activities: [
    "Board games", "Social deduction", "Strategy nights", "Chess", "Badminton", "Pickleball",
    "Football 5s", "Box cricket", "Table tennis", "Basketball 3x3", "Squash", "Coaching",
  ],
  neighbourhoods: ["Koramangala", "Indiranagar", "HSR Layout", "Jayanagar", "Whitefield", "JP Nagar", "Other"],
  documents: [
    { id: "id", label: "Government ID of the owner", hint: "Aadhaar, PAN or passport" },
    { id: "business", label: "Business registration", hint: "GST certificate, shop licence or incorporation" },
    { id: "bank", label: "Bank proof for payouts", hint: "Cancelled cheque or bank statement" },
  ],
};
