import { Metadata } from "next";
import Link from "next/link";
import { X } from "lucide-react";
import { InteriorPageLayout } from "@/components/interior/InteriorPageLayout";
import { PageHero } from "@/components/interior/PageHero";
import { CinematicSection } from "@/components/motion/CinematicSection";
import { PlayDiscoveryView } from "@/components/discovery/PlayDiscoveryView";
import { repo } from "@/lib/data/repo";

export const metadata: Metadata = {
  title: "Events Calendar | Clan B",
  description:
    "Upcoming board game tournaments, futsal super cups, rapid chess ladders and social game sessions across Bengaluru.",
  openGraph: {
    title: "Bengaluru Events & Game Nights | Clan B",
    description: "Browse 40+ curated community sessions, tournaments, and open tables.",
  },
};

interface PageProps {
  searchParams: Promise<{ host?: string | string[] }>;
}

export default async function EventsPage({ searchParams }: PageProps) {
  const [{ host }, allEvents, venues, organizations] = await Promise.all([
    searchParams,
    repo.listEvents(),
    repo.listVenues(),
    repo.listOrganizations(),
  ]);

  // ?host= accepts an organization slug, or "clanb" for Clan B's own events (§9 S5 CTA).
  const hostParam = Array.isArray(host) ? host[0] : host;
  const hostOrg = hostParam
    ? organizations.find((o) => o.slug === hostParam || (hostParam === "clanb" && o.type === "clanb"))
    : undefined;
  const events = hostOrg ? allEvents.filter((e) => e.organizerId === hostOrg.id) : allEvents;

  return (
    <InteriorPageLayout>
      <PageHero
        eyebrow="EVENTS CALENDAR"
        title="Scheduled Sessions Across Bengaluru"
        sub="Reserve your seat at scheduled board game tables, futsal knockouts, pickleball doubles and competitive ladders."
        breadcrumbs={[{ label: "Events" }]}
      />

      <CinematicSection className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {hostOrg && (
            <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-mist">
              <span>
                Hosted by{" "}
                <Link href={`/providers/${hostOrg.slug}`} className="font-medium text-signal hover:underline">
                  {hostOrg.name}
                </Link>
              </span>
              <Link
                href="/events"
                className="inline-flex items-center gap-1 rounded-full border border-white/15 px-3 py-1 text-xs text-white hover:border-white/30"
              >
                <X className="h-3 w-3" aria-hidden="true" /> Show all events
              </Link>
            </div>
          )}
          <PlayDiscoveryView
            key={hostOrg?.id ?? "all"}
            initialEvents={events}
            venues={venues}
            organizations={organizations}
          />
        </div>
      </CinematicSection>
    </InteriorPageLayout>
  );
}
