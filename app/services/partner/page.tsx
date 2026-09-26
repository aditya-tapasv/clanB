import { Metadata } from "next";
import { InteriorPageLayout } from "@/components/interior/InteriorPageLayout";
import { PageHero } from "@/components/interior/PageHero";
import { CinematicSection } from "@/components/motion/CinematicSection";
import { PartnerForm } from "@/components/leads/PartnerForm";
import { PARTNER_FORM } from "@/content/leadForms";

export const metadata: Metadata = {
  title: "Partner With Clan B | Clan B Services",
  description: PARTNER_FORM.sub,
};

interface PageProps {
  searchParams: Promise<{ type?: string | string[] }>;
}

export default async function PartnerPage({ searchParams }: PageProps) {
  const { type } = await searchParams;
  const requested = Array.isArray(type) ? type[0] : type;
  // e.g. "Organize a Tournament" on the homepage links here with ?type=Organizer.
  const initialBusinessType = PARTNER_FORM.businessTypes.find((t) => t === requested) ?? "";

  return (
    <InteriorPageLayout>
      <PageHero
        eyebrow={PARTNER_FORM.eyebrow}
        title={PARTNER_FORM.title}
        sub={PARTNER_FORM.sub}
        breadcrumbs={[{ label: "Services", href: "/services" }, { label: "Partner With Clan B" }]}
      />
      <CinematicSection className="py-12 md:py-16">
        <div className="container mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <PartnerForm key={initialBusinessType} initialBusinessType={initialBusinessType} />
        </div>
      </CinematicSection>
    </InteriorPageLayout>
  );
}
