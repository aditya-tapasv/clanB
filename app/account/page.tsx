import type { Metadata } from "next";
import { InteriorPageLayout } from "@/components/interior/InteriorPageLayout";
import { PageHero } from "@/components/interior/PageHero";
import { CinematicSection } from "@/components/motion/CinematicSection";
import { AccountView } from "@/components/account/AccountView";

export const metadata: Metadata = { title: "My account | Clan B", robots: { index: false, follow: false } };

export default function AccountPage() {
  return (
    <InteriorPageLayout>
      <PageHero
        eyebrow="MY ACCOUNT"
        title="Your Clan B"
        sub="Your profile and every game you&apos;ve booked."
        breadcrumbs={[{ label: "My account" }]}
      />
      <CinematicSection className="py-12 md:py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AccountView />
        </div>
      </CinematicSection>
    </InteriorPageLayout>
  );
}
