"use client";

import React from "react";
import Link from "next/link";
import { Calendar, MapPin, Users, CheckCircle2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/Badge";
import type { Event, Venue, Organization } from "@/lib/data/types";

export interface EventCardProps {
  event: Event;
  venue?: Venue;
  organization?: Organization;
  viewMode?: "grid" | "list";
  reasonChip?: string;
}

export function EventCard({
  event,
  venue,
  organization,
  viewMode = "grid",
  reasonChip,
}: EventCardProps) {
  const seatsLeft = Math.max(0, event.capacity - event.booked);

  // Generate dynamic recommendation chip if not explicitly provided
  const chipText =
    reasonChip ||
    (event.status === "waitlist"
      ? "Waitlist open · Next batch"
      : event.status === "full"
      ? "Fully booked"
      : seatsLeft <= 3
      ? `High demand · ${seatsLeft} seats left`
      : venue?.address.neighbourhood
      ? `Trending in ${venue.address.neighbourhood}`
      : "Verified Clan B session");

  const formattedDate = new Date(event.startsAt).toLocaleDateString("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const priceFormatted = `₹${(event.price.amount / 100).toLocaleString("en-IN")}`;

  const statusVariant =
    event.status === "open"
      ? "signal"
      : event.status === "waitlist"
      ? "amber"
      : event.status === "full"
      ? "outline"
      : event.status === "live"
      ? "cyan"
      : "outline";

  if (viewMode === "list") {
    return (
      <article className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 hover:border-signal/40 hover:bg-white/[0.04] transition-all duration-300">
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-signal/30 bg-signal/10 px-2.5 py-0.5 text-[11px] font-mono font-medium text-signal">
              {chipText}
            </span>
            <Badge variant={statusVariant} className="capitalize">
              {event.status}
            </Badge>
          </div>

          <Link href={`/events/${event.slug}`} className="block">
            <h3 className="font-display text-xl font-semibold text-white group-hover:text-signal transition-colors duration-200">
              {event.title}
            </h3>
          </Link>

          <p className="line-clamp-1 text-sm text-mist">{event.summary}</p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-mist pt-1">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-signal" />
              {formattedDate}
            </span>
            {venue && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-signal" />
                {venue.name} ({venue.address.neighbourhood})
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-mist" />
              {event.booked}/{event.capacity} booked
            </span>
            {organization && (
              <span className="flex items-center gap-1 text-mist">
                by {organization.name}
                {organization.verified && <CheckCircle2 className="h-3 w-3 text-signal" />}
              </span>
            )}
          </div>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between border-t border-white/[0.06] pt-3 sm:border-t-0 sm:pt-0 gap-2 shrink-0">
          <div className="text-right">
            <span className="text-[10px] uppercase tracking-wider text-mist block">Entry</span>
            <span className="font-mono text-lg font-semibold text-white">{priceFormatted}</span>
          </div>
          <Link
            href={`/events/${event.slug}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white hover:border-signal hover:bg-signal hover:text-black transition-all duration-200"
          >
            {event.status === "waitlist" ? "Join Waitlist" : "View & Book"}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </article>
    );
  }

  // Grid view card
  return (
    <article className="group relative flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 hover:border-signal/40 hover:bg-white/[0.04] transition-all duration-300">
      <div>
        {/* Recommendation reason chip & Status badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center rounded-full border border-signal/25 bg-signal/10 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-mono font-medium text-signal truncate max-w-[200px]">
            {chipText}
          </span>
          <Badge variant={statusVariant} className="capitalize shrink-0">
            {event.status}
          </Badge>
        </div>

        {/* Title */}
        <Link href={`/events/${event.slug}`} className="block">
          <h3 className="font-display text-lg font-semibold text-white group-hover:text-signal transition-colors duration-200 line-clamp-2">
            {event.title}
          </h3>
        </Link>

        {/* Summary */}
        <p className="mt-2 text-xs sm:text-sm text-mist line-clamp-2 leading-relaxed">
          {event.summary}
        </p>

        {/* Details list */}
        <div className="mt-4 space-y-2 text-xs text-mist border-t border-white/[0.06] pt-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-signal shrink-0" />
            <span className="truncate">{formattedDate}</span>
          </div>
          {venue && (
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-signal shrink-0" />
              <span className="truncate">
                {venue.name} · {venue.address.neighbourhood}
              </span>
            </div>
          )}
          {organization && (
            <div className="flex items-center gap-1.5">
              <span className="text-white/60">Host:</span>
              <span className="text-white/80 font-medium truncate">{organization.name}</span>
              {organization.verified && <CheckCircle2 className="h-3 w-3 text-signal shrink-0" />}
            </div>
          )}
        </div>

        {/* Capacity bar */}
        <div className="mt-4">
          <div className="flex justify-between text-[11px] font-mono text-mist mb-1">
            <span>Seats filled</span>
            <span className={cn(seatsLeft <= 2 ? "text-amber-400 font-semibold" : "text-mist")}>
              {event.booked}/{event.capacity}
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                event.status === "full"
                  ? "bg-white/40"
                  : seatsLeft <= 2
                  ? "bg-amber-400"
                  : "bg-signal"
              )}
              style={{ width: `${Math.min(100, Math.round((event.booked / event.capacity) * 100))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer / Price & Action */}
      <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-mist block">Entry fee</span>
          <span className="font-mono text-lg font-semibold text-white">{priceFormatted}</span>
        </div>
        <Link
          href={`/events/${event.slug}`}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white hover:border-signal hover:bg-signal hover:text-black transition-all duration-200"
        >
          {event.status === "waitlist" ? "Join Waitlist" : "Book Slot"}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  );
}
