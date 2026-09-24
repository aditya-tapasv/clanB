"use client";

import React, { useState, useMemo } from "react";
import { Search, LayoutGrid, List, SlidersHorizontal, X } from "lucide-react";
import { EventCard } from "@/components/discovery/EventCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Chip } from "@/components/ui/Chip";
import { track } from "@/lib/analytics";
import type { Event, Venue, Organization } from "@/lib/data/types";

export interface PlayDiscoveryViewProps {
  initialEvents: Event[];
  venues: Venue[];
  organizations: Organization[];
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

const KINDS = [
  { label: "All Activities", value: "all" },
  { label: "Board Games", value: "board-game" },
  { label: "Sports", value: "sport" },
];

export function PlayDiscoveryView({
  initialEvents,
  venues,
  organizations,
}: PlayDiscoveryViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKind, setSelectedKind] = useState("all");
  const [selectedNeighbourhood, setSelectedNeighbourhood] = useState("All");
  const [selectedAvailability, setSelectedAvailability] = useState<"all" | "open" | "waitlist">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const venueMap = useMemo(() => {
    return new Map(venues.map((v) => [v.id, v]));
  }, [venues]);

  const orgMap = useMemo(() => {
    return new Map(organizations.map((o) => [o.id, o]));
  }, [organizations]);

  const filteredEvents = useMemo(() => {
    return initialEvents.filter((ev) => {
      // Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const v = ev.venueId ? venueMap.get(ev.venueId) : undefined;
        const matchesTitle = ev.title.toLowerCase().includes(q);
        const matchesSummary = ev.summary.toLowerCase().includes(q);
        const matchesVenue = v ? v.name.toLowerCase().includes(q) || v.address.neighbourhood.toLowerCase().includes(q) : false;
        if (!matchesTitle && !matchesSummary && !matchesVenue) return false;
      }

      // Kind filter
      if (selectedKind !== "all") {
        const isSport =
          ev.serviceId.includes("futsal") ||
          ev.serviceId.includes("badminton") ||
          ev.serviceId.includes("pickle") ||
          ev.serviceId.includes("chess") ||
          ev.slug.includes("futsal") ||
          ev.slug.includes("badminton") ||
          ev.slug.includes("pickleball") ||
          ev.slug.includes("chess") ||
          ev.slug.includes("squash") ||
          ev.slug.includes("table-tennis") ||
          ev.slug.includes("basketball");

        if (selectedKind === "board-game" && isSport) return false;
        if (selectedKind === "sport" && !isSport) return false;
      }

      // Neighbourhood filter
      if (selectedNeighbourhood !== "All") {
        const v = ev.venueId ? venueMap.get(ev.venueId) : undefined;
        if (!v || v.address.neighbourhood.toLowerCase() !== selectedNeighbourhood.toLowerCase()) {
          return false;
        }
      }

      // Availability filter
      if (selectedAvailability === "open" && ev.status !== "open") return false;
      if (selectedAvailability === "waitlist" && ev.status !== "waitlist") return false;

      return true;
    });
  }, [initialEvents, searchQuery, selectedKind, selectedNeighbourhood, selectedAvailability, venueMap]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value.length > 2) {
      track("search", { query: e.target.value });
    }
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedKind !== "all" ||
    selectedNeighbourhood !== "All" ||
    selectedAvailability !== "all";

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedKind("all");
    setSelectedNeighbourhood("All");
    setSelectedAvailability("all");
  };

  return (
    <div className="space-y-8">
      {/* Top Search & Filter Bar */}
      <div className="rounded-2xl border border-white/10 bg-panel p-4 sm:p-6 space-y-4">
        {/* Search input and view toggles */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-mist" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by game, sport, venue or keyword (e.g. Catan, Futsal, Koramangala)..."
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

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-2.5 rounded-lg border transition-colors ${
                viewMode === "grid"
                  ? "border-signal/40 bg-signal/10 text-signal"
                  : "border-white/10 text-mist hover:text-white"
              }`}
              aria-label="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`p-2.5 rounded-lg border transition-colors ${
                viewMode === "list"
                  ? "border-signal/40 bg-signal/10 text-signal"
                  : "border-white/10 text-mist hover:text-white"
              }`}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Category Pills & Neighbourhood Chips */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-white/[0.06]">
          {/* Activity Kind Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-mist flex items-center gap-1.5 mr-1 font-mono">
              <SlidersHorizontal className="h-3 w-3 text-signal" />
              Type:
            </span>
            {KINDS.map((k) => (
              <button
                key={k.value}
                type="button"
                onClick={() => setSelectedKind(k.value)}
              >
                <Chip active={selectedKind === k.value} className="cursor-pointer">
                  {k.label}
                </Chip>
              </button>
            ))}
          </div>

          {/* Availability Filter */}
          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => setSelectedAvailability(selectedAvailability === "open" ? "all" : "open")}
              className={`rounded-full px-3 py-1 border transition-colors ${
                selectedAvailability === "open"
                  ? "border-signal bg-signal/10 text-signal font-medium"
                  : "border-white/10 bg-white/5 text-mist hover:text-white"
              }`}
            >
              Available Only
            </button>
            <button
              type="button"
              onClick={() => setSelectedAvailability(selectedAvailability === "waitlist" ? "all" : "waitlist")}
              className={`rounded-full px-3 py-1 border transition-colors ${
                selectedAvailability === "waitlist"
                  ? "border-amber-400 bg-amber-400/10 text-amber-400 font-medium"
                  : "border-white/10 bg-white/5 text-mist hover:text-white"
              }`}
            >
              Waitlist
            </button>
          </div>
        </div>

        {/* Neighbourhood filter row */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2">
          <span className="text-xs uppercase tracking-wider text-mist font-mono mr-1.5">
            Area:
          </span>
          {NEIGHBOURHOODS.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setSelectedNeighbourhood(n)}
              className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                selectedNeighbourhood === n
                  ? "bg-white/15 text-white font-medium border border-white/20"
                  : "text-mist hover:text-white hover:bg-white/5"
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
          Showing <span className="text-white font-semibold">{filteredEvents.length}</span>{" "}
          sessions in Bengaluru
        </p>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-signal hover:underline flex items-center gap-1"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Results Listing or Empty State */}
      {filteredEvents.length > 0 ? (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "flex flex-col gap-4"
          }
        >
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              venue={event.venueId ? venueMap.get(event.venueId) : undefined}
              organization={orgMap.get(event.organizerId)}
              viewMode={viewMode}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No sessions found matching your filters"
          description="Try broadening your search or clear some filters to see upcoming sessions across Bengaluru."
          actionLabel="Request a Game / Session"
          actionHref="/play/request"
        />
      )}
    </div>
  );
}
