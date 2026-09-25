/** Copy and field options for the vendor/host lead-capture hub (`/for-providers`, `/contact`). */

export interface HubCard {
  slug: "host" | "partner" | "venues";
  icon: "Dices" | "Handshake" | "Building2";
  title: string;
  description: string;
}

export const HUB_CONTENT = {
  eyebrow: "FOR PROVIDERS",
  title: "Bring your games, courts and venues to Clan B",
  sub: "Tell us a bit about what you run. A real person on the Clan B team reads every submission and gets back to you.",
  cards: [
    {
      slug: "host",
      icon: "Dices",
      title: "Become a Host",
      description: "Run board-game nights, coaching or open sessions for players in your city.",
    },
    {
      slug: "partner",
      icon: "Handshake",
      title: "Partner With Clan B",
      description: "Vendors, organizers and corporates — bring your business onto the platform.",
    },
    {
      slug: "venues",
      icon: "Building2",
      title: "List Your Venue",
      description: "Turn your tables, courts or rooms into bookable space.",
    },
  ] as HubCard[],
  contactCard: {
    title: "Contact Us",
    description: "A general question, feedback, or press enquiry? Reach the team directly.",
    href: "/contact",
  },
  faq: {
    heading: "What happens after you submit?",
    items: [
      {
        q: "How soon will I hear back?",
        a: "Our team reviews every submission and typically replies within 2 working days.",
      },
      {
        q: "Is there a cost to apply?",
        a: "No — submitting a form is free. We'll walk you through pricing and terms once we're in touch.",
      },
      {
        q: "I'm not sure which form fits. What do I pick?",
        a: "Pick the closest one — a single host, a business or organizer, or a venue with space to fill. We'll redirect you if another path fits better.",
      },
    ],
  },
} as const;

export const HOST_FORM = {
  eyebrow: "BECOME A HOST",
  title: "Run games people show up for",
  sub: "Tell us about you and what you'd like to host — we'll follow up with next steps.",
  successHeading: "Thanks — we've got your application",
  successBody: "Our team reviews every host application and will email you within 2 working days.",
  gameTypes: ["Board Games", "Sports", "Both Board Games & Sports"],
  experience: ["First-time host", "Less than 1 year", "1–3 years", "3+ years"],
  venueAvailable: ["Yes, I have a venue", "No, I need one", "Not sure yet"],
} as const;

export const PARTNER_FORM = {
  eyebrow: "PARTNER WITH CLAN B",
  title: "Bring your business onto Clan B",
  sub: "For vendors, organizers, corporates and studios who want to run at scale.",
  successHeading: "Thanks — your enquiry is in",
  successBody: "A member of our partnerships team will reach out within 2 working days.",
  businessTypes: ["Vendor / Facilitator", "Organizer", "Corporate", "Sports Club / Academy", "Other"],
  services: ["Game Nights", "Tournaments", "Coaching", "Corporate Events", "Venue Rental", "Other"],
} as const;

export const VENUE_FORM = {
  eyebrow: "LIST YOUR VENUE",
  title: "Turn empty tables and courts into bookings",
  sub: "Cafés, courts, turfs and private rooms — tell us what you've got.",
  successHeading: "Thanks — we've received your venue details",
  successBody: "Our venues team will review and follow up within 2 working days.",
  facilities: [
    "Parking",
    "WiFi",
    "Air Conditioning",
    "Seating / Tables",
    "Washrooms",
    "Refreshments / Café",
    "Changing Rooms",
    "Equipment Rental",
  ],
} as const;

export const CONTACT_FORM = {
  eyebrow: "CONTACT US",
  title: "Get in touch",
  sub: "Questions, feedback or press — write to us and we'll reply within 2 working days.",
  successHeading: "Message sent",
  successBody: "Thanks for writing in. We'll get back to you at the email you gave us.",
} as const;
