"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, Search, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { VenueCard } from "@/components/discovery/VenueCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { getVenues, VENUES_PAGE_SIZE } from "@/lib/api/venues";
import type { Paginated } from "@/lib/api/types";
import type { Venue } from "@/lib/data/types";

export interface VenuesListingViewProps {
  /** First page, fetched on the server so the page renders without a loading state. */
  initialPage: Paginated<Venue>;
}

const NEIGHBOURHOODS = ["All", "Koramangala", "Indiranagar", "HSR Layout", "Jayanagar", "Whitefield", "JP Nagar"];

interface Filters {
  page: number;
  query: string;
  neighbourhood: string;
}

const keyOf = (f: Filters) => `${f.page}|${f.query}|${f.neighbourhood}`;
const INITIAL: Filters = { page: 1, query: "", neighbourhood: "All" };

export function VenuesListingView({ initialPage }: VenuesListingViewProps) {
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState<Filters>(INITIAL);
  const [result, setResult] = useState<{ key: string; data: Paginated<Venue> }>({ key: keyOf(INITIAL), data: initialPage });
  const [error, setError] = useState<string | null>(null);
  const listTopRef = useRef<HTMLDivElement>(null);

  const key = keyOf(filters);
  const loading = result.key !== key;

  // Debounce the search box into the filters (and back to page 1).
  useEffect(() => {
    const id = window.setTimeout(() => {
      setFilters((f) => (f.query === searchInput.trim() ? f : { ...f, query: searchInput.trim(), page: 1 }));
    }, 300);
    return () => window.clearTimeout(id);
  }, [searchInput]);

  useEffect(() => {
    if (result.key === key) return;
    let cancelled = false;
    getVenues({
      page: filters.page,
      pageSize: VENUES_PAGE_SIZE,
      query: filters.query,
      neighbourhood: filters.neighbourhood === "All" ? "" : filters.neighbourhood,
    }).then(
      (data) => {
        if (!cancelled) {
          setError(null);
          setResult({ key, data });
        }
      },
      () => {
        if (!cancelled) setError("Couldn't load venues. Please try again.");
      }
    );
    return () => {
      cancelled = true;
    };
  }, [key, filters, result.key]);

  const goToPage = (page: number) => {
    setFilters((f) => ({ ...f, page }));
    listTopRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  };

  const data = result.data;
  const pages = Array.from({ length: data.totalPages }, (_, i) => i + 1);

  return (
    <div className="space-y-8">
      {/* Search & Area Filter Bar */}
      <div className="rounded-2xl border border-white/10 bg-panel p-4 sm:p-6 space-y-4">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-mist" aria-hidden="true" />
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            aria-label="Search venues"
            placeholder="Search venue by name, area or amenity (e.g. Smash Hub, BWF Courts, WiFi)..."
            className="w-full rounded-full border border-white/10 bg-white/5 pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-white/60 focus:border-signal focus:outline-none focus:ring-1 focus:ring-signal transition-colors"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => setSearchInput("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-mist hover:text-white"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-white/[0.06]">
          <span className="text-xs uppercase tracking-wider text-mist font-mono mr-1.5 flex items-center gap-1">
            <MapPin className="h-3 w-3 text-signal" aria-hidden="true" />
            Neighbourhood:
          </span>
          {NEIGHBOURHOODS.map((n) => (
            <button
              key={n}
              type="button"
              aria-pressed={filters.neighbourhood === n}
              onClick={() => setFilters((f) => ({ ...f, neighbourhood: n, page: 1 }))}
              className={cn(
                "text-xs px-3 py-1 rounded-full transition-colors",
                filters.neighbourhood === n
                  ? "bg-signal text-black font-semibold"
                  : "bg-white/5 text-mist hover:text-white hover:bg-white/10 border border-white/10"
              )}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div ref={listTopRef} className="scroll-mt-28 flex items-center justify-between text-xs text-mist" aria-live="polite">
        <p>
          {data.total === 0 ? (
            "No venues"
          ) : (
            <>
              Showing{" "}
              <span className="text-white font-semibold">
                {(data.page - 1) * data.pageSize + 1}–{Math.min(data.page * data.pageSize, data.total)}
              </span>{" "}
              of <span className="text-white font-semibold">{data.total}</span> verified venues
            </>
          )}
        </p>
        {loading && <span className="font-mono">Loading…</span>}
      </div>

      {error && (
        <p role="alert" className="text-sm text-rose-400">
          {error}
        </p>
      )}

      {/* Grid */}
      {data.items.length > 0 ? (
        <div
          className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity", loading && "opacity-50")}
          aria-busy={loading}
        >
          {data.items.map((v) => (
            <VenueCard key={v.id} venue={v} />
          ))}
        </div>
      ) : (
        !loading && (
          <EmptyState
            title="No venues found matching your criteria"
            description="Try selecting a different neighbourhood or broadening your search terms."
            actionLabel="View All Venues"
            onAction={() => {
              setSearchInput("");
              setFilters(INITIAL);
            }}
          />
        )
      )}

      {/* Pagination */}
      {data.totalPages > 1 && (
        <nav aria-label="Venue pages" className="flex items-center justify-center gap-2 pt-2">
          <button
            type="button"
            onClick={() => goToPage(data.page - 1)}
            disabled={data.page <= 1 || loading}
            aria-label="Previous page"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white transition hover:border-signal disabled:opacity-30 disabled:hover:border-white/15"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {pages.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => goToPage(p)}
              disabled={loading}
              aria-label={`Page ${p}`}
              aria-current={p === data.page ? "page" : undefined}
              className={cn(
                "h-9 min-w-9 rounded-full px-3 text-sm font-mono transition",
                p === data.page
                  ? "bg-signal text-black font-semibold"
                  : "border border-white/15 text-mist hover:border-white/30 hover:text-white"
              )}
            >
              {p}
            </button>
          ))}
          <button
            type="button"
            onClick={() => goToPage(data.page + 1)}
            disabled={data.page >= data.totalPages || loading}
            aria-label="Next page"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white transition hover:border-signal disabled:opacity-30 disabled:hover:border-white/15"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </nav>
      )}
    </div>
  );
}
