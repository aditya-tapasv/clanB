import type { SportsFeedKind } from "@/lib/data/types";

export interface SportExplainer {
  /** One-line hook shown on cards and the detail hero. */
  tagline: string;
  /** Short plain-language explainer of how the sport is played. */
  basics: string;
  /** Three steps from "curious" to "playing". */
  firstSteps: string[];
  whatToBring: string[];
}

export const SPORTS_FEED_TABS: { id: SportsFeedKind; label: string }[] = [
  { id: "live", label: "Live" },
  { id: "upcoming", label: "Upcoming" },
  { id: "result", label: "Recent" },
  { id: "news", label: "News" },
];

export const SPORTS_CONTENT = {
  index: {
    eyebrow: "SPORTS",
    title: "Follow the sports you care about",
    sub: "Upcoming fixtures, recent results and where to play it near you — information that turns into participation.",
    feedHeading: "Across Bengaluru",
    catalogEyebrow: "PLAY IT YOURSELF",
    catalogHeading: "Eight sports, all bookable on Clan B",
    catalogSub: "Pick a sport to see its fixtures, how to get started and the courts, turfs and boards near you.",
  },
  feed: {
    sampleLabel: "Sample data",
    emptyTitle: "Nothing here right now",
    emptyDescription: "Check another tab, or find a session and make some news of your own.",
  },
  detail: {
    explainerHeading: "How it works",
    firstStepsHeading: "Your first game",
    bringHeading: "What to bring",
    localPlayEyebrow: "LOCAL PLAY",
    localPlayHeading: "Where to play nearby",
    localPlaySub: "Sessions and venues in Bengaluru where this sport is running on Clan B.",
    sessionsHeading: "Upcoming sessions",
    venuesHeading: "Venues",
    noSessionsTitle: "No open sessions yet",
    noSessionsDescription: "Tell us when and where you want to play and we'll match you with a host.",
  },
  explainers: {
    badminton: {
      tagline: "Fast rallies, indoor courts, easy to pick up.",
      basics:
        "Singles or doubles on a netted court. Rallies are played to 21 points, best of three games, and a point is scored on every rally.",
      firstSteps: [
        "Book an open court slot or a social doubles session.",
        "Warm up with clears and drops before you start keeping score.",
        "Rotate partners — hosts pair players of similar level.",
      ],
      whatToBring: ["Non-marking indoor shoes", "Racquet (rentals at most venues)", "Water bottle"],
    },
    pickleball: {
      tagline: "The social racquet sport anyone can play in ten minutes.",
      basics:
        "Doubles on a small court with paddles and a plastic ball. Serves are underhand, and the no-volley 'kitchen' near the net keeps rallies friendly.",
      firstSteps: [
        "Join a starter clinic — paddles and balls are provided.",
        "Learn the two-bounce rule and the kitchen line.",
        "Move on to open play once you can hold a rally.",
      ],
      whatToBring: ["Court shoes", "Paddle (optional)", "Cap and water for outdoor courts"],
    },
    "futsal-5s": {
      tagline: "Five-a-side on turf — short games, constant touches.",
      basics:
        "Two teams of five on a small-sided turf. Games run in short halves with rolling substitutions, so everyone gets plenty of the ball.",
      firstSteps: [
        "Join an open game as a solo player or bring a full squad.",
        "Hosts balance teams before kick-off.",
        "Graduate to a league season when your team is ready.",
      ],
      whatToBring: ["Turf or futsal shoes", "Light and dark T-shirts", "Shin guards"],
    },
    "box-cricket": {
      tagline: "Short-format cricket in a netted box.",
      basics:
        "Six-a-side cricket inside a netted turf. Matches are usually ten overs a side, and the nets bring their own rules for runs and catches.",
      firstSteps: [
        "Book a box for your group or join a league fixture.",
        "Agree on the house rules for nets and boundaries before the toss.",
        "Rotate bowlers — most leagues cap overs per player.",
      ],
      whatToBring: ["Turf shoes", "Bat and gloves (venues provide basics)", "Water"],
    },
    chess: {
      tagline: "Rapid and blitz over the board, with rated ladders.",
      basics:
        "Classic 1v1 chess played to a clock. Clan B events use rapid and blitz time controls with Swiss pairings, so you play every round.",
      firstSteps: [
        "Pick a section that matches your rating, or the open section if you're unrated.",
        "Arrive ten minutes early for pairings.",
        "Record your games — many events use electronic boards.",
      ],
      whatToBring: ["Nothing — boards and clocks are provided", "A notebook if you record moves"],
    },
    "table-tennis": {
      tagline: "Quick reflexes, small space, big rallies.",
      basics:
        "Singles or doubles across a table. Games run to 11 points and serve alternates every two points.",
      firstSteps: [
        "Book a table for an hour with a friend, or join a ladder night.",
        "Practise short serves and push returns.",
        "Enter a ladder to find opponents at your level.",
      ],
      whatToBring: ["Indoor shoes", "Bat (rentals available)", "Towel"],
    },
    "basketball-3x3": {
      tagline: "Half-court, three-a-side, fast games to 21.",
      basics:
        "Three players a side on a half court with a single hoop. Games go to 21 points or ten minutes, whichever comes first.",
      firstSteps: [
        "Show up to a pick-up run — teams are formed on the spot.",
        "Learn the check-ball and clear-the-arc rules.",
        "Enter a 3x3 league with your crew.",
      ],
      whatToBring: ["Basketball shoes", "Your own ball (optional)", "Water"],
    },
    squash: {
      tagline: "An intense workout in a four-walled court.",
      basics:
        "Singles in an enclosed court. Players take turns striking the ball against the front wall, and games run to 11 points.",
      firstSteps: [
        "Book a coaching slot to learn movement and safety.",
        "Rally with a partner before playing scored games.",
        "Join a ladder once you're comfortable with the basics.",
      ],
      whatToBring: ["Non-marking shoes", "Protective eyewear", "Racquet (rentals available)"],
    },
  } satisfies Record<string, SportExplainer>,
} as const;

export function getSportExplainer(slug: string): SportExplainer | undefined {
  return (SPORTS_CONTENT.explainers as Record<string, SportExplainer>)[slug];
}
