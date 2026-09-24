import React from "react";
import Link from "next/link";
import { ArrowRight, Clock, Users } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatPlayers } from "@/lib/data/games";
import type { Activity } from "@/lib/data/types";

export interface ActivityCardProps {
  activity: Activity;
  href: string;
  tagline?: string;
  openSessions: number;
  liveNow?: boolean;
  /** Small labels under the title, e.g. discovery moods. */
  chips?: string[];
}

/** Catalog card shared by /sports and /games. */
export function ActivityCard({ activity, href, tagline, openSessions, liveNow = false, chips }: ActivityCardProps) {
  const players = formatPlayers(activity);

  return (
    <article className="group relative flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 transition-all duration-300 hover:border-signal/40 hover:bg-white/[0.04]">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="default">{activity.category}</Badge>
          {liveNow && (
            <Badge variant="signal" ping>
              Live now
            </Badge>
          )}
        </div>
        <h3 className="font-display text-xl font-semibold text-white transition-colors duration-200 group-hover:text-signal">
          <Link href={href} className="after:absolute after:inset-0 after:rounded-2xl">
            {activity.name}
          </Link>
        </h3>
        {tagline && <p className="text-sm leading-relaxed text-mist">{tagline}</p>}
        {chips && chips.length > 0 && (
          <ul className="flex flex-wrap gap-1.5">
            {chips.map((chip) => (
              <li
                key={chip}
                className="rounded-full border border-signal/20 bg-signal/5 px-2 py-0.5 font-mono text-[10px] text-signal"
              >
                {chip}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-zinc-400">
          <span className="inline-flex items-center gap-1">
            <Users className="h-3.5 w-3.5" aria-hidden="true" /> {players} players
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" /> {activity.durationMin} min
          </span>
          {activity.kind === "sport" ? (
            <span>{activity.indoor ? "Indoor" : "Outdoor"}</span>
          ) : (
            activity.complexity && <span className="capitalize">{activity.complexity}</span>
          )}
        </div>
        <div className="flex items-center justify-between border-t border-white/[0.06] pt-4 text-xs">
          <span className="text-mist">
            <span className="font-semibold text-white">{openSessions}</span>{" "}
            {openSessions === 1 ? "session" : "sessions"} to book
          </span>
          <ArrowRight
            className="h-4 w-4 text-signal transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </div>
      </div>
    </article>
  );
}
