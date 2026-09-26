import { Metadata } from "next";
import { InteriorPageLayout } from "@/components/interior/InteriorPageLayout";
import { PageHero } from "@/components/interior/PageHero";
import { CinematicSection } from "@/components/motion/CinematicSection";
import { ListVenueForm } from "@/components/leads/ListVenueForm";
import { VENUE_FORM } from "@/content/leadForms";

export const metadata: Metadata = {
  title: "List Your Venue | Clan B Services",
  description: VENUE_FORM.sub,
};

export default function ListVenuePage() {
  return (
    <InteriorPageLayout>
      <PageHero
        eyebrow={VENUE_FORM.eyebrow}
        title={VENUE_FORM.title}
        sub={VENUE_FORM.sub}
        breadcrumbs={[{ label: "Services", href: "/services" }, { label: "List Your Venue" }]}
      />
      <CinematicSection className="py-12 md:py-16">
        <div className="container mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <ListVenueForm />
        </div>
      </CinematicSection>
    </InteriorPageLayout>
  );
}
