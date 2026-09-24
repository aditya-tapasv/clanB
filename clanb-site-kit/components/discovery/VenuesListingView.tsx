"use client";

import React, { useState, useMemo } from "react";
import { Search, MapPin, X } from "lucide-react";
import { VenueCard } from "@/components/discovery/VenueCard";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Venue } from "@/lib/data/types";

export interface VenuesListingViewProps {
  initialVenues: Venue[];
}

const NEIGHBOURHOODS = [
  "All",
  "Koramangala",
  "Indiranagar",
  "HSR Layout",
  "Jayanagar",
  "Whitefield",
  "JP Nagar",
];

export function VenuesListingView({ initialVenues }: VenuesListingViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNeighbourhood, setSelectedNeighbourhood] = useState("All");

  const filteredVenues = useMemo(() => {
    return initialVenues.filter((v) => {
      if (selectedNeighbourhood !== "All") {
        if (v.address.neighbourhood.toLowerCase() !== selectedNeighbourhood.toLowerCase()) {
          return false;
        }
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = v.name.toLowerCase().includes(q);
        const matchesDesc = v.description.toLowerCase().includes(q);
        const matchesArea = v.address.neighbourhood.toLowerCase().includes(q);
        const matchesAmenity = v.amenities.some((a) => a.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesArea && !matchesAmenity) return false;
      }

      return true;
    });
  }, [initialVenues, searchQuery, selectedNeighbourhood]);

  return (
    <div className="space-y-8">
      {/* Search & Area Filter Bar */}
      <div className="rounded-2xl border border-white/10 bg-panel p-4 sm:p-6 space-y-4">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-mist" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search venue by name, area or amenity (e.g. Smash Hub, BWF Courts, WiFi)..."
            className="w-full rounded-full border border-white/10 bg-white/5 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/60 focus:border-signal focus:outline-none focus:ring-1 focus:ring-signal transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-mist hover:text-white"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Neighbourhood chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-white/[0.06]">
          <span className="text-xs uppercase tracking-wider text-mist font-mono mr-1.5 flex items-center gap-1">
            <MapPin className="h-3 w-3 text-signal" />
            Neighbourhood:
          </span>
          {NEIGHBOURHOODS.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setSelectedNeighbourhood(n)}
              className={`text-xs px-3 py-1 rounded-full transition-colors ${
                selectedNeighbourhood === n
                  ? "bg-signal text-black font-semibold"
                  : "bg-white/5 text-mist hover:text-white hover:bg-white/10 border border-white/10"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-mist">
        <p>
          Showing <span className="text-white font-semibold">{filteredVenues.length}</span> verified venues
        </p>
      </div>

      {/* Grid */}
      {filteredVenues.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVenues.map((v) => (
            <VenueCard key={v.id} venue={v} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No venues found matching your criteria"
          description="Try selecting a different neighbourhood or broadening your search terms."
          actionLabel="View All Venues"
          onAction={() => {
            setSearchQuery("");
            setSelectedNeighbourhood("All");
          }}
        />
      )}
    </div>
  );
}
