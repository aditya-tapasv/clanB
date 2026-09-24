import type { Activity } from "./types";

export const GAME_MOODS = ["Quick", "Strategic", "Social", "Competitive", "Party", "Co-op"] as const;
export type GameMood = (typeof GAME_MOODS)[number];

const SOCIAL_TAGS = ["social", "party", "laughter", "bluffing", "debate", "lively", "family", "lighthearted"];

/** Maps a game's catalog data onto the six discovery moods used across the site (§9 S7). */
export function getGameMoods(game: Activity): GameMood[] {
  const tags = game.moods.map((m) => m.toLowerCase());
  const format = game.format.toLowerCase();
  const moods: GameMood[] = [];

  if (game.durationMin <= 30 || tags.includes("quick")) moods.push("Quick");
  if (game.complexity === "heavy" || tags.includes("strategic")) moods.push("Strategic");
  if (tags.some((t) => SOCIAL_TAGS.includes(t)) || format.includes("hidden role") || format.startsWith("team")) {
    moods.push("Social");
  }
  if (format === "competitive" || format.includes("vs")) moods.push("Competitive");
  if (game.playerMax >= 6 && game.complexity !== "heavy" && game.durationMin <= 45) moods.push("Party");
  if (format === "co-op") moods.push("Co-op");

  return moods;
}

export function formatPlayers(game: Activity): string {
  return game.playerMin === game.playerMax ? `${game.playerMin}` : `${game.playerMin}–${game.playerMax}`;
}
