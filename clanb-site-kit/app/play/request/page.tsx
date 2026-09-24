import { Metadata } from "next";
import { InteriorPageLayout } from "@/components/interior/InteriorPageLayout";
import { PageHero } from "@/components/interior/PageHero";
import { CinematicSection } from "@/components/motion/CinematicSection";
import { DemandRequestForm } from "@/components/discovery/DemandRequestForm";

export const metadata: Metadata = {
  title: "Request a Game or Session | Clan B",
  description:
    "Can't find a table or slot for your favourite game? Submit a demand request to notify verified Bengaluru hosts.",
};

export default function PlayRequestPage() {
  return (
    <InteriorPageLayout>
      <PageHero
        eyebrow="DEMAND REQUEST · USR-14"
        title="Can't Find Your Game? We'll Spin It Up."
        sub="Tell us what you want to play, your area in Bengaluru, and your preferred dates. Our partner cafes, venues and game masters organize tables based on demand signals."
        breadcrumbs={[
          { label: "Play", href: "/play" },
          { label: "Request a Game" },
        ]}
      />

      <CinematicSection className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <DemandRequestForm />
        </div>
      </CinematicSection>
    </InteriorPageLayout>
  );
}
