import { Metadata } from "next";
import { InteriorPageLayout } from "@/components/interior/InteriorPageLayout";
import { PageHero } from "@/components/interior/PageHero";
import { CinematicSection } from "@/components/motion/CinematicSection";
import { VenuesListingView } from "@/components/discovery/VenuesListingView";
import { repo } from "@/lib/data/repo";

export const metadata: Metadata = {
  title: "Verified Venues & Play Spaces | Clan B",
  description:
    "Explore 12 verified board game cafes, synthetic badminton courts, futsal turfs and chess lounges across Bengaluru.",
  openGraph: {
    title: "Verified Venues & Turfs in Bengaluru | Clan B",
    description: "Browse acoustic game lounges, BWF badminton facilities, and FIFA-grade turf arenas.",
  },
};

export default async function VenuesPage() {
  const venues = await repo.listVenues();

  return (
    <InteriorPageLayout>
      <PageHero
        eyebrow="VERIFIED VENUES"
        title="Bengaluru’s Premier Gaming Hubs & Turfs"
        sub="Discover soundproof board game lounges, tournament-grade racquet courts, floodlit futsal turfs, and dedicated chess rooms across Bengaluru."
        breadcrumbs={[{ label: "Venues" }]}
      />

      <CinematicSection className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <VenuesListingView initialVenues={venues} />
        </div>
      </CinematicSection>
    </InteriorPageLayout>
  );
}
