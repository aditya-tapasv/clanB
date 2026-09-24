"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, MapPin, Calendar, Dices, Trophy, ArrowRight, X, Loader2, BadgeCheck } from "lucide-react";
import { cn } from "@/lib/cn";
import { Dialog } from "@/components/ui/Dialog";
import { repo } from "@/lib/data/repo";
import { track } from "@/lib/analytics";
import {
  SEARCH_SUGGESTIONS,
  toSearchGroups,
  type SearchCategory,
  type SearchGroup,
} from "@/lib/search";

const categoryIcons: Record<SearchCategory, typeof Calendar> = {
  Game: Dices,
  Venue: MapPin,
  Event: Calendar,
  Sport: Trophy,
  Provider: BadgeCheck,
};

const MAX_PER_GROUP = 3;

export function SearchCommandPalette({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ for: string; groups: SearchGroup[] }>({ for: "", groups: [] });
  const [activeIndex, setActiveIndex] = useState(0);

  const trimmed = query.trim();
  const loading = trimmed !== "" && results.for !== trimmed;

  // Debounced lookup; stale responses are ignored by comparing against the latest query.
  useEffect(() => {
    if (!trimmed) return;
    let cancelled = false;
    const id = window.setTimeout(() => {
      repo.search(trimmed).then((r) => {
        if (!cancelled) {
          setResults({ for: trimmed, groups: toSearchGroups(r) });
          setActiveIndex(0);
        }
      });
    }, 200);
    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, [trimmed]);

  const groups: SearchGroup[] = trimmed
    ? results.groups.map((g) => ({ ...g, items: g.items.slice(0, MAX_PER_GROUP) }))
    : [{ category: "Event", label: "Suggested", items: SEARCH_SUGGESTIONS }];
  const flat = groups.flatMap((g) => g.items);

  const handleClose = () => {
    setQuery("");
    setActiveIndex(0);
    onClose();
  };

  const goToAll = () => {
    if (!trimmed) return;
    track("search", { query: trimmed, source: "palette" });
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    handleClose();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" && flat.length) {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % flat.length);
    } else if (e.key === "ArrowUp" && flat.length) {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + flat.length) % flat.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = flat[activeIndex];
      if (item && (!trimmed || !loading)) {
        router.push(item.href);
        handleClose();
      } else {
        goToAll();
      }
    }
  };

  let runningIndex = -1;

  return (
    <Dialog open={open} onClose={handleClose} title="Search Clan B" hideTitle className="max-w-xl p-0 overflow-hidden">
      <div className="flex items-center border-b border-white/10 py-3 pl-4 pr-14">
        <Search className="h-5 w-5 shrink-0 text-signal" aria-hidden="true" />
        <input
          autoFocus
          role="combobox"
          aria-expanded="true"
          aria-controls="search-palette-list"
          aria-activedescendant={flat[activeIndex] ? `palette-${flat[activeIndex].id}` : undefined}
          aria-label="Search games, venues, events, sports"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIndex(0);
          }}
          onKeyDown={onKeyDown}
          placeholder="Search games, venues, events, sports..."
          className="ml-3 w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
        />
        {loading && <Loader2 className="h-4 w-4 shrink-0 animate-spin text-zinc-400" aria-hidden="true" />}
        {query && !loading && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="rounded p-1 text-zinc-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div id="search-palette-list" role="listbox" aria-label="Search results" className="max-h-[60vh] overflow-y-auto p-2">
        {trimmed && !loading && flat.length === 0 ? (
          <div className="py-8 text-center text-sm text-mist">
            No results found for &ldquo;{trimmed}&rdquo;
          </div>
        ) : (
          groups.map((group) => (
            <div key={group.label} role="group" aria-label={group.label} className="mb-2">
              <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                {group.label}
              </div>
              {group.items.map((item) => {
                runningIndex += 1;
                const index = runningIndex;
                const Icon = categoryIcons[item.category];
                return (
                  <Link
                    key={item.id}
                    id={`palette-${item.id}`}
                    role="option"
                    aria-selected={index === activeIndex}
                    href={item.href}
                    onClick={handleClose}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={cn(
                      "group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition",
                      index === activeIndex ? "bg-white/5" : "hover:bg-white/5"
                    )}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-signal">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-white transition-colors group-hover:text-signal">
                          {item.title}
                        </p>
                        <p className="truncate text-xs text-mist">{item.subtitle}</p>
                      </div>
                    </div>
                    <ArrowRight
                      className="ml-4 h-3.5 w-3.5 shrink-0 text-zinc-500 transition-transform group-hover:translate-x-0.5 group-hover:text-white"
                      aria-hidden="true"
                    />
                  </Link>
                );
              })}
            </div>
          ))
        )}
        {trimmed && !loading && flat.length > 0 && (
          <button
            type="button"
            onClick={goToAll}
            className="mt-1 w-full rounded-xl px-3 py-2.5 text-left text-sm text-signal transition hover:bg-white/5"
          >
            See all results for &ldquo;{trimmed}&rdquo; →
          </button>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-white/10 bg-black/40 px-4 py-2.5 text-[11px] text-zinc-500">
        <span>
          <kbd className="rounded border border-white/20 bg-white/5 px-1 py-0.5 font-mono text-[10px]">↑</kbd>{" "}
          <kbd className="rounded border border-white/20 bg-white/5 px-1 py-0.5 font-mono text-[10px]">↓</kbd> to navigate ·{" "}
          <kbd className="rounded border border-white/20 bg-white/5 px-1 py-0.5 font-mono text-[10px]">↵</kbd> to open
        </span>
        <span>
          <kbd className="rounded border border-white/20 bg-white/5 px-1 py-0.5 font-mono text-[10px]">ESC</kbd> to close
        </span>
      </div>
    </Dialog>
  );
}
