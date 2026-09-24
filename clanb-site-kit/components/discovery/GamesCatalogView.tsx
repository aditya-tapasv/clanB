"use client";

import React, { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { ActivityCard } from "@/components/discovery/ActivityCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { GAMES_CONTENT, GAME_COLLECTIONS, GAME_GUIDES } from "@/content/games";
import { GAME_MOODS, getGameMoods, type GameMood } from "@/lib/data/games";
import type { Activity, Complexity } from "@/lib/data/types";

export interface GamesCatalogViewProps {
  games: Activity[];
  /** Bookable session count per activity id. */
  sessionCounts: Record<string, number>;
  initialMood?: GameMood;
}

const PLAYER_OPTIONS = ["Any", "1", "2", "3", "4", "5", "6", "8+"] as const;
const TIME_OPTIONS = [
  { id: "any", label: "Any", min: 0, max: Infinity },
  { id: "30", label: "≤ 30 min", min: 0, max: 30 },
  { id: "60", label: "31–60 min", min: 31, max: 60 },
  { id: "90", label: "61–90 min", min: 61, max: 90 },
  { id: "long", label: "90+ min", min: 91, max: Infinity },
] as const;
const COMPLEXITY_OPTIONS: ("any" | Complexity)[] = ["any", "light", "medium", "heavy"];

type TimeId = (typeof TIME_OPTIONS)[number]["id"];

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="mr-1.5 w-24 font-mono text-xs uppercase tracking-wider text-mist">{label}</span>
      {children}
    </div>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "rounded-full px-3 py-1 text-xs capitalize transition-colors",
        active
          ? "bg-signal font-semibold text-black"
          : "border border-white/10 bg-white/5 text-mist hover:bg-white/10 hover:text-white"
      )}
    >
      {children}
    </button>
  );
}

export function GamesCatalogView({ games, sessionCounts, initialMood }: GamesCatalogViewProps) {
  const [query, setQuery] = useState("");
  const [players, setPlayers] = useState<(typeof PLAYER_OPTIONS)[number]>("Any");
  const [time, setTime] = useState<TimeId>("any");
  const [complexity, setComplexity] = useState<"any" | Complexity>("any");
  const [mood, setMood] = useState<GameMood | "Any">(initialMood ?? "Any");
  const [collectionId, setCollectionId] = useState<string | null>(null);
  const { filters, index } = GAMES_CONTENT;

  const reset = () => {
    setQuery("");
    setPlayers("Any");
    setTime("any");
    setComplexity("any");
    setMood("Any");
    setCollectionId(null);
  };

  const filtered = useMemo(() => {
    const timeRange = TIME_OPTIONS.find((t) => t.id === time) ?? TIME_OPTIONS[0];
    const collection = GAME_COLLECTIONS.find((c) => c.id === collectionId);
    const q = query.toLowerCase().trim();

    return games.filter((g) => {
      if (collection && !collection.matches(g)) return false;
      if (players !== "Any") {
        const n = players === "8+" ? 8 : Number(players);
        if (players === "8+" ? g.playerMax < n : g.playerMin > n || g.playerMax < n) return false;
      }
      if (g.durationMin < timeRange.min || g.durationMin > timeRange.max) return false;
      if (complexity !== "any" && g.complexity !== complexity) return false;
      if (mood !== "Any" && !getGameMoods(g).includes(mood)) return false;
      if (q && !g.name.toLowerCase().includes(q) && !g.category.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [games, query, players, time, complexity, mood, collectionId]);

  const hasFilters =
    query !== "" || players !== "Any" || time !== "any" || complexity !== "any" || mood !== "Any" || collectionId !== null;

  return (
    <div className="space-y-10">
      {/* Collections */}
      <section aria-labelledby="collections-heading" className="space-y-4">
        <h2 id="collections-heading" className="font-display text-2xl font-semibold text-white">
          {index.collectionsHeading}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {GAME_COLLECTIONS.map((c) => {
            const active = collectionId === c.id;
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={active}
                onClick={() => setCollectionId(active ? null : c.id)}
                className={cn(
                  "rounded-2xl border p-5 text-left transition-all duration-300",
                  active
                    ? "border-signal bg-signal/10"
                    : "border-white/[0.08] bg-white/[0.02] hover:border-signal/40 hover:bg-white/[0.04]"
                )}
              >
                <span className="block font-display text-lg font-semibold text-white">{c.title}</span>
                <span className="mt-1 block text-sm text-mist">{c.description}</span>
                <span className="mt-3 block font-mono text-[11px] text-signal">
                  {games.filter(c.matches).length} games
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Filters */}
      <section aria-label="Filters" className="space-y-4 rounded-2xl border border-white/10 bg-panel p-4 sm:p-6">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mist" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={filters.search}
            aria-label={filters.search}
            className="w-full rounded-full border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white transition-colors placeholder:text-white/60 focus:border-signal focus:outline-none focus:ring-1 focus:ring-signal"
          />
        </div>
        <div className="space-y-3 border-t border-white/[0.06] pt-4">
          <FilterRow label={filters.mood}>
            {(["Any", ...GAME_MOODS] as const).map((m) => (
              <FilterChip key={m} active={mood === m} onClick={() => setMood(m)}>
                {m}
              </FilterChip>
            ))}
          </FilterRow>
          <FilterRow label={filters.players}>
            {PLAYER_OPTIONS.map((p) => (
              <FilterChip key={p} active={players === p} onClick={() => setPlayers(p)}>
                {p}
              </FilterChip>
            ))}
          </FilterRow>
          <FilterRow label={filters.time}>
            {TIME_OPTIONS.map((t) => (
              <FilterChip key={t.id} active={time === t.id} onClick={() => setTime(t.id)}>
                {t.label}
              </FilterChip>
            ))}
          </FilterRow>
          <FilterRow label={filters.complexity}>
            {COMPLEXITY_OPTIONS.map((c) => (
              <FilterChip key={c} active={complexity === c} onClick={() => setComplexity(c)}>
                {c}
              </FilterChip>
            ))}
          </FilterRow>
        </div>
      </section>

      {/* Results */}
      <section aria-labelledby="catalog-heading" className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="catalog-heading" className="font-display text-2xl font-semibold text-white">
            {index.catalogHeading}{" "}
            <span className="font-mono text-sm font-normal text-mist" aria-live="polite">
              ({filtered.length})
            </span>
          </h2>
          {hasFilters && (
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1 text-xs text-mist transition-colors hover:text-white"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" /> {filters.reset}
            </button>
          )}
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((g) => (
              <ActivityCard
                key={g.id}
                activity={g}
                href={`/games/${g.slug}`}
                tagline={GAME_GUIDES[g.slug]?.overview}
                openSessions={sessionCounts[g.id] ?? 0}
                chips={getGameMoods(g)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title={filters.emptyTitle}
            description={filters.emptyDescription}
            actionLabel="Request a game"
            actionHref="/play/request"
          />
        )}
      </section>
    </div>
  );
}
