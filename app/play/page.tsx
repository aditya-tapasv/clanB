import { Metadata } from "next";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { InteriorPageLayout } from "@/components/interior/InteriorPageLayout";
import { PageHero } from "@/components/interior/PageHero";
import { CinematicSection } from "@/components/motion/CinematicSection";
import { PlayDiscoveryView } from "@/components/discovery/PlayDiscoveryView";
import { repo } from "@/lib/data/repo";

export const metadata: Metadata = {
  title: "Play & Discover | Clan B",
  description:
    "Explore open board game tables, futsal matches, pickleball rallies, and rated chess sessions across Bengaluru.",
  openGraph: {
    title: "Discover Play in Bengaluru | Clan B",
    description: "Find open tables, verified venues, and active game communities across Bengaluru.",
  },
};

export default async function PlayPage() {
  const [events, venues, organizations] = await Promise.all([
    repo.listEvents(),
    repo.listVenues(),
    repo.listOrganizations(),
  ]);

  return (
    <InteriorPageLayout>
      <PageHero
        eyebrow="DISCOVER PLAY"
        title="Find Your Table. Rally Your Squad."
        sub="Join open board game tables, casual futsal matches, pickleball rallies, and rated chess ladders across Bengaluru."
        breadcrumbs={[{ label: "Play" }]}
        actions={
          <Link
            href="/play/request"
            className="inline-flex items-center gap-2 rounded-full border border-signal/40 bg-signal/10 px-5 py-2.5 text-xs font-mono font-medium text-signal hover:bg-signal hover:text-black transition-all duration-200"
          >
            <PlusCircle className="h-4 w-4" />
            Can&apos;t find a game? Request one
          </Link>
        }
      />

      <CinematicSection className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <PlayDiscoveryView
            initialEvents={events}
            venues={venues}
            organizations={organizations}
          />
        </div>
      </CinematicSection>
    </InteriorPageLayout>
  );
}
