import { Metadata } from "next";
import { InteriorPageLayout } from "@/components/interior/InteriorPageLayout";
import { PageHero } from "@/components/interior/PageHero";
import { CinematicSection } from "@/components/motion/CinematicSection";
import { PartnerForm } from "@/components/leads/PartnerForm";
import { PARTNER_FORM } from "@/content/leadForms";

export const metadata: Metadata = {
  title: "Partner With Clan B | For Providers",
  description: PARTNER_FORM.sub,
};

export default function PartnerPage() {
  return (
    <InteriorPageLayout>
      <PageHero
        eyebrow={PARTNER_FORM.eyebrow}
        title={PARTNER_FORM.title}
        sub={PARTNER_FORM.sub}
        breadcrumbs={[{ label: "For Providers", href: "/for-providers" }, { label: "Partner With Clan B" }]}
      />
      <CinematicSection className="py-12 md:py-16">
        <div className="container mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <PartnerForm />
        </div>
      </CinematicSection>
    </InteriorPageLayout>
  );
}
