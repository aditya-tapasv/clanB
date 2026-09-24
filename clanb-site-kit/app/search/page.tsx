import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { InteriorPageLayout } from "@/components/interior/InteriorPageLayout";
import { PageHero } from "@/components/interior/PageHero";
import { CinematicSection } from "@/components/motion/CinematicSection";
import { EmptyState } from "@/components/ui/EmptyState";
import { repo } from "@/lib/data/repo";
import { SEARCH_SUGGESTIONS, toSearchGroups } from "@/lib/search";

interface PageProps {
  searchParams: Promise<{ q?: string | string[] }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { q } = await searchParams;
  const query = (Array.isArray(q) ? q[0] : q)?.trim();
  return {
    title: query ? `“${query}” — Search | Clan B` : "Search | Clan B",
    robots: { index: false },
  };
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const query = (Array.isArray(q) ? q[0] : q)?.trim() ?? "";
  const groups = query ? toSearchGroups(await repo.search(query)) : [];
  const total = groups.reduce((n, g) => n + g.items.length, 0);

  return (
    <InteriorPageLayout>
      <PageHero
        eyebrow="SEARCH"
        title={query ? `Results for “${query}”` : "Search Clan B"}
        sub={query ? `${total} ${total === 1 ? "result" : "results"} across events, games, sports and venues.` : "Find events, games, sports and venues across Bengaluru."}
        breadcrumbs={[{ label: "Search" }]}
      >
        <form action="/search" method="get" role="search" className="relative max-w-xl">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-mist" aria-hidden="true" />
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Try “catan”, “badminton” or “Koramangala”"
            aria-label="Search Clan B"
            className="w-full rounded-full border border-white/10 bg-white/5 py-3 pl-11 pr-28 text-sm text-white placeholder:text-white/60 focus:border-signal focus:outline-none focus:ring-1 focus:ring-signal"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-signal px-4 py-2 text-xs font-semibold text-ink transition hover:bg-white"
          >
            Search
          </button>
        </form>
      </PageHero>

      <CinematicSection className="py-12 md:py-16">
        <div className="container mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
          {query && groups.length === 0 && (
            <EmptyState
              title={`Nothing matched “${query}”`}
              description="Check the spelling, try a broader term — or tell us what you want to play and we'll find a host."
              actionLabel="Request a game"
              actionHref="/play/request"
            />
          )}

          {(query ? groups : [{ category: "Event", label: "Start exploring", items: SEARCH_SUGGESTIONS }]).map((group) => (
            <section key={group.label} aria-labelledby={`group-${group.category}-${group.label}`} className="space-y-4">
              <h2
                id={`group-${group.category}-${group.label}`}
                className="flex items-baseline gap-2 font-display text-xl font-semibold text-white"
              >
                {group.label}
                {query && <span className="font-mono text-sm font-normal text-mist">({group.items.length})</span>}
              </h2>
              <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {group.items.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className="group flex h-full items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 transition-all duration-300 hover:border-signal/40 hover:bg-white/[0.04]"
                    >
                      <span className="min-w-0">
                        <span className="block truncate font-medium text-white transition-colors group-hover:text-signal">
                          {item.title}
                        </span>
                        <span className="mt-0.5 block line-clamp-1 text-sm text-mist">{item.subtitle}</span>
                      </span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-zinc-500 transition-transform group-hover:translate-x-0.5 group-hover:text-signal" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </CinematicSection>
    </InteriorPageLayout>
  );
}
