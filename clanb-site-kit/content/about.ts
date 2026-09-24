export const ABOUT_CONTENT = {
  eyebrow: "ABOUT CLAN B",
  title: "The future of games",
  sub: "Clan B is technology for playing, hosting and running games and sports — making it easier to join and easier to operate.",
  story: {
    heading: "Why we're building Clan B",
    paragraphs: [
      "Finding a game tonight shouldn't take six group chats. Running one shouldn't take a spreadsheet, a payment link and a prayer. Board game cafés, badminton courts, chess clubs and futsal turfs are full of people who want to play — and hosts who want to run great sessions — but the tools between them are scattered.",
      "We call our approach gamify tech: technology that makes play easy for players, and a proper home for the vendors, facilitators, venues and organizers who make it happen. Browse first, book with confidence, and see the policies, verification and reviews before you pay.",
      "We're starting in one city with a few categories and doing them well, then growing supply and recommendations together.",
    ],
  },
  how: {
    eyebrow: "HOW IT WORKS",
    heading: "One loop, both sides of the table",
    sub: "Every booking makes the next one easier — for players and for the people who host them.",
    steps: [
      { title: "Discover", body: "Browse sessions, events, games, sports and venues — no sign-in needed." },
      { title: "Decide", body: "See the host, venue, policies, seats left and why it fits your group." },
      { title: "Book", body: "Hold your seat, see the full price breakdown, and confirm in a few taps." },
      { title: "Attend", body: "Check in with your QR code; hosts see who's coming in real time." },
      { title: "Complete", body: "Results, reviews and receipts land in My Clan B after you play." },
      { title: "Rebook / Follow", body: "Follow hosts, venues and games so the next session finds you." },
      { title: "Host / Organize", body: "Players become hosts; venues and organizers list their inventory." },
      { title: "More supply", body: "More tables, courts and sessions across more neighbourhoods and times." },
      { title: "Better recommendations", body: "Every booking teaches Clan B what fits your group, time and mood." },
      { title: "More participation", body: "Easier to join, easier to run — so more people play, more often." },
    ],
  },
  offices: {
    eyebrow: "OFFICES",
    heading: "Where we are",
    company: "CLANB TECH SOLUTIONS PRIVATE LIMITED",
    list: [
      { city: "Bengaluru", role: "Registered office", note: "Karnataka, India" },
      { city: "Chennai", role: "Office", note: "Tamil Nadu, India" },
    ],
  },
  contact: {
    heading: "Contact",
    body: "Partnerships, press or a question about a booking — write to us and we'll get back within two working days.",
    // TODO(product owner): confirm the public contact address (PROJECT_TRACKER open questions).
    email: "hello@clanb.in",
  },
  careers: {
    heading: "Careers",
    body: "We're a small team and not running open roles yet. If you love games, sports and building products, send us a note anyway.",
  },
} as const;
