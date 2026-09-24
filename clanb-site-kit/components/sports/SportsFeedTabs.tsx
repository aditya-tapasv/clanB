"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { gsap } from "@/lib/motion";
import { Tabs } from "@/components/ui/Tabs";
import { FreshnessStamp } from "@/components/sports/FreshnessStamp";
import { SPORTS_CONTENT, SPORTS_FEED_TABS } from "@/content/sports";
import type { SportsFeedItem, SportsFeedKind } from "@/lib/data/types";

export interface SportsFeedTabsProps {
  items: SportsFeedItem[];
  /** Event slugs keyed by session id, so rows can link to the bookable session. */
  sessionSlugs: Record<string, string>;
  /** Show the sport label and link on each row (index page). */
  showSport?: boolean;
  idPrefix: string;
}

const TAB_ACCENTS: Record<SportsFeedKind, string> = {
  live: "#5CF111",
  upcoming: "#06B6D4",
  result: "#D97706",
  news: "#A78BFA",
};

export function SportsFeedTabs({ items, sessionSlugs, showSport = false, idPrefix }: SportsFeedTabsProps) {
  const initialTab = SPORTS_FEED_TABS.find((t) => items.some((i) => i.kind === t.id))?.id ?? "live";
  const [activeTab, setActiveTab] = useState<SportsFeedKind>(initialTab);
  const panelRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  const rows = items.filter((i) => i.kind === activeTab);
  const accent = TAB_ACCENTS[activeTab];
  const { feed } = SPORTS_CONTENT;

  // Re-animate rows on tab change only; the first paint is covered by CinematicSection.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const panel = panelRef.current;
    if (!panel) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const feedRows = panel.querySelectorAll("[data-feed-row]");
    if (!feedRows.length) return;
    const tween = gsap.fromTo(
      feedRows,
      { x: -10, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.4, stagger: 0.08, delay: 0.2, ease: "power2.out" }
    );
    return () => {
      tween.kill();
    };
  }, [activeTab]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs
          idPrefix={idPrefix}
          tabs={SPORTS_FEED_TABS.map((t) => ({
            ...t,
            count: items.filter((i) => i.kind === t.id).length,
          }))}
          activeId={activeTab}
          onChange={(id) => setActiveTab(id as SportsFeedKind)}
        />
        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-zinc-400">
          {feed.sampleLabel}
        </span>
      </div>

      <div
        ref={panelRef}
        id={`${idPrefix}-panel`}
        role="tabpanel"
        aria-labelledby={`${idPrefix}-tab-${activeTab}`}
        className="relative min-h-[320px] overflow-hidden rounded-2xl border border-white/10 bg-panel p-5 md:min-h-[380px] md:p-6"
        style={{
          backgroundImage: `radial-gradient(ellipse at 20% 0%, ${accent}22, transparent 45%), radial-gradient(ellipse at 90% 80%, rgba(6,182,212,.1), transparent 40%)`,
        }}
      >
        <div className="flex items-center gap-2 border-b border-white/10 pb-4">
          {activeTab === "live" && (
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inset-0 animate-ping rounded-full opacity-70" style={{ backgroundColor: accent }} />
              <span className="relative inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: accent }} />
            </span>
          )}
          <h3 className="font-display text-lg font-semibold text-white">
            {SPORTS_FEED_TABS.find((t) => t.id === activeTab)?.label}
          </h3>
        </div>

        {rows.length > 0 ? (
          <ul className="mt-5 space-y-3">
            {rows.map((item) => {
              const eventSlug = item.sessionId ? sessionSlugs[item.sessionId] : undefined;
              return (
                <li
                  key={item.id}
                  data-feed-row
                  className="rounded-xl border border-white/5 bg-white/[0.02] p-4 transition hover:border-white/15"
                >
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    {showSport &&
                      (item.sportSlug ? (
                        <Link
                          href={`/sports/${item.sportSlug}`}
                          className="shrink-0 font-mono text-[11px] text-signal hover:underline"
                        >
                          {item.sport}
                        </Link>
                      ) : (
                        <span className="shrink-0 font-mono text-[11px] text-zinc-400">{item.sport}</span>
                      ))}
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-mist">{item.detail}</p>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-zinc-400">
                    <span>{item.competition}</span>
                    {eventSlug && (
                      <Link
                        href={`/events/${eventSlug}`}
                        className="inline-flex items-center gap-1 text-signal hover:underline"
                      >
                        View session <ArrowRight className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                  <p className="mt-2 font-mono text-[10px] text-zinc-500">
                    <FreshnessStamp updatedAt={item.updatedAt} /> · Source: {item.source}
                  </p>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="flex min-h-[240px] flex-col items-center justify-center text-center">
            <p className="font-display text-base font-semibold text-white">{feed.emptyTitle}</p>
            <p className="mt-1 max-w-sm text-sm text-mist">{feed.emptyDescription}</p>
            <Link href="/play" className="mt-4 text-sm font-medium text-signal hover:underline">
              Find a session →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
