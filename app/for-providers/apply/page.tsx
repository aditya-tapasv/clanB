import { Metadata } from "next";
import { InteriorPageLayout } from "@/components/interior/InteriorPageLayout";
import { PageHero } from "@/components/interior/PageHero";
import { ApplyWizardClient } from "@/components/providers/ApplyWizardClient";
import { APPLY_CONTENT, type ProviderTypeId } from "@/content/providers";

export const metadata: Metadata = {
  title: "Apply to host | Clan B for Providers",
  description: "Join Clan B as a vendor, venue, organizer or corporate event partner.",
};

interface PageProps {
  searchParams: Promise<{ type?: string | string[] }>;
}

export default async function ApplyPage({ searchParams }: PageProps) {
  const { type } = await searchParams;
  const t = Array.isArray(type) ? type[0] : type;
  const initialType = APPLY_CONTENT.providerTypes.find((p) => p.id === t)?.id as ProviderTypeId | undefined;

  return (
    <InteriorPageLayout>
      <PageHero
        eyebrow="APPLY TO HOST"
        title="Tell us about what you run"
        sub="Five short steps. Your progress saves as you go, so you can finish later."
        breadcrumbs={[{ label: "For Providers", href: "/for-providers" }, { label: "Apply" }]}
      />
      <div className="container mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <ApplyWizardClient initialType={initialType} />
      </div>
    </InteriorPageLayout>
  );
}
