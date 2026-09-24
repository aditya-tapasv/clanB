"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Star, CheckCircle2, ArrowRight } from "lucide-react";
import type { Venue } from "@/lib/data/types";

export interface VenueCardProps {
  venue: Venue;
}

export function VenueCard({ venue }: VenueCardProps) {
  return (
    <article className="group relative flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 hover:border-signal/40 hover:bg-white/[0.04] transition-all duration-300">
      <div className="space-y-4">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-signal bg-signal/10 border border-signal/20 px-2.5 py-0.5 rounded-full">
            <CheckCircle2 className="h-3 w-3" />
            Verified Partner
          </span>
          {venue.rating && (
            <div className="flex items-center gap-1 text-xs text-amber-400 font-mono">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-white">{venue.rating.toFixed(1)}</span>
              <span className="text-mist">({venue.reviewCount})</span>
            </div>
          )}
        </div>

        {/* Title & Description */}
        <div>
          <Link href={`/venues/${venue.slug}`} className="block">
            <h3 className="font-display text-xl font-semibold text-white group-hover:text-signal transition-colors duration-200">
              {venue.name}
            </h3>
          </Link>
          <p className="mt-2 text-xs sm:text-sm text-mist line-clamp-2 leading-relaxed">
            {venue.description}
          </p>
        </div>

        {/* Location & Address */}
        <div className="flex items-center gap-2 text-xs text-mist border-t border-white/[0.06] pt-3">
          <MapPin className="h-3.5 w-3.5 text-signal shrink-0" />
          <span className="truncate">
            {venue.address.line1}, {venue.address.neighbourhood}
          </span>
        </div>

        {/* Amenities Chips */}
        {venue.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {venue.amenities.slice(0, 3).map((amenity) => (
              <span
                key={amenity}
                className="rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 text-[11px] text-mist/90"
              >
                {amenity}
              </span>
            ))}
            {venue.amenities.length > 3 && (
              <span className="text-[11px] text-mist px-1 py-0.5 font-mono">
                +{venue.amenities.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Action CTA */}
      <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between">
        <span className="text-xs font-mono text-mist">
          Instant Slot Booking
        </span>
        <Link
          href={`/venues/${venue.slug}`}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white hover:border-signal hover:bg-signal hover:text-black transition-all duration-200"
        >
          <span>View Slots</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  );
}
