export interface LegalDoc {
  slug: string;
  title: string;
  summary: string;
  sections: { heading: string; body: string }[];
}

/** Every legal page is a placeholder until counsel signs off (MASTER_PROMPT §10). */
export const LEGAL_REVIEW_NOTE = "TODO legal review — placeholder text, not legal advice and not yet in force.";
export const LEGAL_LAST_UPDATED = "24 September 2026";

export const LEGAL_DOCS: LegalDoc[] = [
  {
    slug: "terms",
    title: "Terms of Service",
    summary: "The rules for using Clan B as a player, host, venue or organizer.",
    sections: [
      { heading: "Who we are", body: "Clan B is operated by CLANB TECH SOLUTIONS PRIVATE LIMITED, registered in Bengaluru, India. These terms apply to the Clan B website and apps." },
      { heading: "Using Clan B", body: "You can browse without an account. To book or host you need an account, must be at least 18 (or have a guardian's consent), and must give accurate information." },
      { heading: "Bookings", body: "A booking is a contract between you and the provider running the session. Clan B facilitates the booking and payment. Each listing's cancellation and refund policy forms part of that contract." },
      { heading: "Providers", body: "Hosts, venues and organizers are responsible for their listings, safety at their sessions and complying with local law. Verification badges reflect checks at a point in time." },
      { heading: "Acceptable use", body: "Don't misuse the platform, harass other people, list unsafe activities or try to take bookings off-platform to avoid policies." },
      { heading: "Liability", body: "To the extent permitted by law, Clan B is not liable for the conduct of providers or participants. Nothing in these terms limits liability that cannot be limited by law." },
      { heading: "Changes", body: "We'll notify you of material changes before they take effect." },
    ],
  },
  {
    slug: "privacy",
    title: "Privacy Policy",
    summary: "What we collect, why we collect it and the choices you have.",
    sections: [
      { heading: "What we collect", body: "Account details you give us, bookings and payments, messages with providers, and basic device and usage data." },
      { heading: "How we use it", body: "To run bookings, keep the platform safe, provide support, and improve recommendations. We don't sell personal data." },
      { heading: "Sharing", body: "Providers receive the details they need to run your booking. Payment processors handle card data; Clan B does not store full card numbers." },
      { heading: "Your rights", body: "You can access, correct, export or delete your data from Data Controls, subject to records we must keep by law." },
      { heading: "Retention", body: "We keep booking and payment records for as long as required by Indian tax and accounting law, and other data only as long as needed." },
    ],
  },
  {
    slug: "cookies",
    title: "Cookie Policy",
    summary: "The cookies and similar technologies Clan B uses.",
    sections: [
      { heading: "Essential cookies", body: "Keep you signed in, protect against fraud and remember your booking in progress. These can't be switched off." },
      { heading: "Analytics", body: "Help us understand which pages and features are used. We'll ask for your consent before setting them." },
      { heading: "Managing cookies", body: "You can change your choices at any time from Data Controls or in your browser settings." },
    ],
  },
  {
    slug: "accessibility",
    title: "Accessibility Statement",
    summary: "Our commitment to making Clan B usable by everyone.",
    sections: [
      { heading: "Our goal", body: "We aim to meet WCAG 2.2 AA across the public site and booking journey." },
      { heading: "What we do", body: "Keyboard navigation, visible focus, screen-reader labels, sufficient contrast, and a reduced-motion mode that turns off scroll animation when your device asks for it." },
      { heading: "Venue accessibility", body: "Venues list their access information on their profile. If something is missing, tell us and we'll ask the venue." },
      { heading: "Feedback", body: "If you hit a barrier, report it through the Help Centre and we'll respond within two working days." },
    ],
  },
  {
    slug: "data-controls",
    title: "Data Controls",
    summary: "Download, correct or delete your data and manage your consent.",
    sections: [
      { heading: "Download your data", body: "Request an export of your account, bookings and reviews. We'll email a download link when it's ready." },
      { heading: "Correct your data", body: "Update your profile at any time from My Clan B." },
      { heading: "Delete your account", body: "Deleting your account removes your profile and reviews. Booking and payment records we are legally required to keep are retained and then deleted." },
      { heading: "Consent", body: "Change analytics and marketing preferences at any time. Essential cookies stay on so the site works." },
    ],
  },
];
