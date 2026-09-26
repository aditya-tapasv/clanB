import { Metadata } from "next";
import { InteriorPageLayout } from "@/components/interior/InteriorPageLayout";
import { PageHero } from "@/components/interior/PageHero";
import { CinematicSection } from "@/components/motion/CinematicSection";
import { BecomeVendorForm } from "@/components/leads/BecomeVendorForm";
import { VENDOR_FORM } from "@/content/leadForms";

export const metadata: Metadata = {
  title: "Become a Vendor | Clan B Services",
  description: VENDOR_FORM.sub,
};

export default function BecomeVendorPage() {
  return (
    <InteriorPageLayout>
      <PageHero
        eyebrow={VENDOR_FORM.eyebrow}
        title={VENDOR_FORM.title}
        sub={VENDOR_FORM.sub}
        breadcrumbs={[{ label: "Services", href: "/services" }, { label: "Become a Vendor" }]}
      />
      <CinematicSection className="py-12 md:py-16">
        <div className="container mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <BecomeVendorForm />
        </div>
      </CinematicSection>
    </InteriorPageLayout>
  );
}
