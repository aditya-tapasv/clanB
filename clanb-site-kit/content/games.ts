import type { Activity } from "@/lib/data/types";
import { getGameMoods } from "@/lib/data/games";

export interface GameGuide {
  overview: string;
  howToPlay: string;
}

export interface GameCollection {
  id: string;
  title: string;
  description: string;
  matches: (game: Activity) => boolean;
}

export const GAMES_CONTENT = {
  index: {
    eyebrow: "GAMES",
    title: "Discover board games by group, time and mood",
    sub: "Tell us who's playing and how long you've got. We'll show games that fit — and the tables where they're being played.",
    collectionsHeading: "Collections",
    catalogHeading: "The catalog",
  },
  filters: {
    search: "Search games by name or category...",
    players: "Players",
    time: "Time",
    complexity: "Complexity",
    mood: "Mood",
    reset: "Reset filters",
    emptyTitle: "No games match those filters",
    emptyDescription: "Loosen a filter or two — or tell us what you want to play and we'll find a host.",
  },
  detail: {
    overviewHeading: "Overview",
    howToPlayHeading: "How to play",
    idealGroupHeading: "Ideal group",
    sessionsHeading: "Sessions to join",
    tablesHeading: "Tables where it's played",
    noSessionsTitle: "No tables scheduled yet",
    noSessionsDescription: "Request this game and we'll match you with a host or a venue that has it.",
  },
} as const;

export const GAME_COLLECTIONS: GameCollection[] = [
  {
    id: "four-players",
    title: "Best for 4 players",
    description: "Games that play their best with a table of four.",
    matches: (g) => g.playerMin <= 4 && g.playerMax >= 4 && g.playerMax <= 5,
  },
  {
    id: "under-60",
    title: "Under 60 minutes",
    description: "Full games that fit into a weeknight.",
    matches: (g) => g.durationMin < 60,
  },
  {
    id: "beginners",
    title: "Great first games",
    description: "Light rules and fast teach — ideal for new players.",
    matches: (g) => g.complexity === "light",
  },
  {
    id: "co-op",
    title: "Win together",
    description: "Co-operative games where the table plays as one team.",
    matches: (g) => getGameMoods(g).includes("Co-op"),
  },
];

export const GAME_GUIDES: Record<string, GameGuide> = {
  catan: {
    overview: "Settle an island, gather resources and trade your way to ten victory points.",
    howToPlay: "Roll dice to produce resources from your settlements, trade with the table, and spend resources on roads, settlements, cities and development cards.",
  },
  wingspan: {
    overview: "A calm engine-builder about attracting birds to your wildlife preserves.",
    howToPlay: "Each turn you play a bird, gain food, lay eggs or draw cards. Birds chain powers together, so every round your actions grow stronger.",
  },
  "ticket-to-ride": {
    overview: "Claim railway routes across a map to connect the cities on your ticket cards.",
    howToPlay: "Collect coloured train cards, spend matching sets to claim routes, and complete your destination tickets before the game ends.",
  },
  "terraforming-mars": {
    overview: "Corporations compete to make Mars habitable by raising temperature, oxygen and oceans.",
    howToPlay: "Play project cards to build your economy and change the planet. Points come from terraforming, cities, forests and card goals.",
  },
  azul: {
    overview: "Draft coloured tiles to decorate a palace wall in the most elegant pattern.",
    howToPlay: "Take all tiles of one colour from a display, place them in your pattern lines, and score when a line fills. Wasted tiles cost points.",
  },
  carcassonne: {
    overview: "Build a medieval landscape one tile at a time and claim its cities, roads and fields.",
    howToPlay: "Draw and place a tile that matches the edges around it, then optionally place a follower on a feature to score it when complete.",
  },
  splendor: {
    overview: "A fast gem-trading game about building a jewellery business.",
    howToPlay: "Take gem tokens or buy development cards. Each card gives a permanent discount, so your purchases snowball towards 15 prestige.",
  },
  "dune-imperium": {
    overview: "Deck-building meets worker placement in a struggle for control of the desert planet.",
    howToPlay: "Play cards to send agents to board spaces, then reveal your hand to buy cards and fight for conflict rewards each round.",
  },
  "7-wonders": {
    overview: "Grow an ancient civilisation over three ages of simultaneous card drafting.",
    howToPlay: "Everyone picks one card from their hand and passes the rest. Build resources, science, military and your wonder — all at the same time.",
  },
  scythe: {
    overview: "An alternate-history engine and area-control game set in 1920s Europe.",
    howToPlay: "Choose one section of your player mat each turn to move, produce, trade or build. Combat is rare but decisive; stars end the game.",
  },
  pandemic: {
    overview: "A team of specialists races to cure four diseases spreading across the world.",
    howToPlay: "Take four actions to travel, treat and share cards, then draw infection cards. Collect sets of one colour to discover cures before outbreaks overwhelm you.",
  },
  cascadia: {
    overview: "A gentle puzzle about building a habitat for wildlife in the Pacific Northwest.",
    howToPlay: "Draft a habitat tile with its wildlife token, place both, and score animal patterns and the largest area of each habitat.",
  },
  root: {
    overview: "An asymmetric woodland war where every faction plays by different rules.",
    howToPlay: "Each player controls a faction with its own actions and win path. Move, battle and craft to reach 30 points — or a secret dominance goal.",
  },
  everdell: {
    overview: "Build a city of critters and constructions under the great Ever Tree.",
    howToPlay: "Place workers to gather resources, then play cards into your city. Seasons unlock more workers until your city is complete.",
  },
  clank: {
    overview: "A deck-building dungeon crawl — grab treasure and get out before the dragon notices.",
    howToPlay: "Play cards to move, fight and buy new cards. Noise adds cubes to the dragon bag, and every attack draws from it.",
  },
  concordia: {
    overview: "An economic game of Roman trade built on a simple hand of personality cards.",
    howToPlay: "Play one card per turn to move colonists, build houses, produce goods or buy cards. Final scoring depends on the gods on your cards.",
  },
  "blood-rage": {
    overview: "Viking clans draft cards and battle for glory before the world ends.",
    howToPlay: "Draft cards at the start of each age, then invade, pillage and quest. Dying in battle can still earn glory in Valhalla.",
  },
  "spirit-island": {
    overview: "Spirits defend their island together against colonising invaders.",
    howToPlay: "Choose fast or slow powers each round, grow your spirit, and generate fear to drive invaders off before the island is overrun.",
  },
  "ark-nova": {
    overview: "Plan and build a modern zoo that supports conservation projects.",
    howToPlay: "Use five action cards that grow stronger as you use them to build enclosures, add animals and fund projects, racing to meet in the middle of two tracks.",
  },
  "brass-birmingham": {
    overview: "An economic strategy game about the industrial revolution in the Midlands.",
    howToPlay: "Take two actions per turn to build industries, networks and loans. Industries score when their resources are consumed across two eras.",
  },
  decrypto: {
    overview: "Two teams pass coded messages while trying to intercept the other side's.",
    howToPlay: "Your encryptor gives clues for a three-digit code tied to secret words. Your team decodes it while opponents try to crack the pattern.",
  },
  codenames: {
    overview: "Two teams race to find their agents using one-word clues.",
    howToPlay: "Spymasters give a word and a number; teammates guess cards on the grid. Hit the assassin and your team loses instantly.",
  },
  "the-crew": {
    overview: "A co-operative trick-taking game played as a series of short missions.",
    howToPlay: "Win specific cards with specific players while communication is limited. Each mission adds a new twist.",
  },
  skull: {
    overview: "A bluffing game played with coasters, roses and one skull.",
    howToPlay: "Play discs face down, then bid on how many roses you can flip. Hit a skull and you lose a disc.",
  },
  "secret-hitler": {
    overview: "A social deduction game of liberals and fascists in 1930s Germany.",
    howToPlay: "Vote on governments that enact policies. Liberals must find the hidden fascists before too many fascist policies pass.",
  },
  "the-resistance-avalon": {
    overview: "Loyal knights try to complete quests while hidden minions sabotage them.",
    howToPlay: "Leaders propose teams, everyone votes, and team members secretly pass or fail the quest. Merlin knows the traitors but must stay hidden.",
  },
  "just-one": {
    overview: "A co-operative party game of one-word clues.",
    howToPlay: "Everyone writes a clue for the mystery word, but duplicate clues are cancelled before the guesser sees them.",
  },
  "love-letter": {
    overview: "A 16-card game of deduction and risk played in minutes.",
    howToPlay: "Draw one card, play one card. Each card's effect lets you guess, peek or knock players out of the round.",
  },
  "bang-the-dice-game": {
    overview: "A Wild West shoot-out with hidden roles and dice.",
    howToPlay: "Roll up to three times to shoot neighbours, drink beer or dodge arrows. The Sheriff is public — everyone else is hiding their side.",
  },
  dixit: {
    overview: "A storytelling game built around dreamlike illustrated cards.",
    howToPlay: "The storyteller gives a clue for their card; others add a matching card from their hand. Clues that are too obvious — or too obscure — score nothing.",
  },
};
