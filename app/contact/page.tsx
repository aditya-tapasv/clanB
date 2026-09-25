import { Metadata } from "next";
import { InteriorPageLayout } from "@/components/interior/InteriorPageLayout";
import { PageHero } from "@/components/interior/PageHero";
import { CinematicSection } from "@/components/motion/CinematicSection";
import { ContactForm } from "@/components/leads/ContactForm";
import { CONTACT_FORM } from "@/content/leadForms";

export const metadata: Metadata = {
  title: "Contact Us | Clan B",
  description: CONTACT_FORM.sub,
};

export default function ContactPage() {
  return (
    <InteriorPageLayout>
      <PageHero eyebrow={CONTACT_FORM.eyebrow} title={CONTACT_FORM.title} sub={CONTACT_FORM.sub} breadcrumbs={[{ label: "Contact" }]} />
      <CinematicSection className="py-12 md:py-16">
        <div className="container mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <ContactForm />
        </div>
      </CinematicSection>
    </InteriorPageLayout>
  );
}
