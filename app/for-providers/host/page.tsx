import { Metadata } from "next";
import { InteriorPageLayout } from "@/components/interior/InteriorPageLayout";
import { PageHero } from "@/components/interior/PageHero";
import { CinematicSection } from "@/components/motion/CinematicSection";
import { BecomeHostForm } from "@/components/leads/BecomeHostForm";
import { HOST_FORM } from "@/content/leadForms";

export const metadata: Metadata = {
  title: "Become a Host | Clan B for Providers",
  description: HOST_FORM.sub,
};

export default function BecomeHostPage() {
  return (
    <InteriorPageLayout>
      <PageHero
        eyebrow={HOST_FORM.eyebrow}
        title={HOST_FORM.title}
        sub={HOST_FORM.sub}
        breadcrumbs={[{ label: "For Providers", href: "/for-providers" }, { label: "Become a Host" }]}
      />
      <CinematicSection className="py-12 md:py-16">
        <div className="container mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <BecomeHostForm />
        </div>
      </CinematicSection>
    </InteriorPageLayout>
  );
}
