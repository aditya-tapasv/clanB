import { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { InteriorPageLayout } from "@/components/interior/InteriorPageLayout";
import { PageHero } from "@/components/interior/PageHero";
import { StepGrid } from "@/components/interior/StepGrid";
import { CinematicSection } from "@/components/motion/CinematicSection";
import { ProviderIconView } from "@/components/providers/ProviderIconView";
import { Button } from "@/components/ui/Button";
import { PROVIDERS_CONTENT, SUB_LANDINGS } from "@/content/providers";

interface PageProps {
  params: Promise<{ type: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return SUB_LANDINGS.map((l) => ({ type: l.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { type } = await params;
  const l = SUB_LANDINGS.find((x) => x.slug === type);
  return l ? { title: `${l.title} | Clan B for Providers`, description: l.sub } : {};
}

export default async function ProviderSubLandingPage({ params }: PageProps) {
  const { type } = await params;
  const l = SUB_LANDINGS.find((x) => x.slug === type);
  if (!l) notFound();

  const applyHref = `/for-providers/apply?type=${l.providerType}`;

  return (
    <InteriorPageLayout>
      <PageHero
        eyebrow={l.eyebrow}
        title={l.title}
        sub={l.sub}
        breadcrumbs={[{ label: "For Providers", href: "/for-providers" }, { label: l.eyebrow.toLowerCase().replace(/^\w/, (c) => c.toUpperCase()) }]}
        actions={
          <Button href={applyHref} variant="primary" withArrow>
            {l.cta}
          </Button>
        }
      />

      <CinematicSection className="py-12 md:py-16">
        <div className="container mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {l.benefits.map((b) => (
            <div key={b.title} className="rounded-2xl border border-white/10 bg-panel p-6">
              <ProviderIconView icon={b.icon} className="h-6 w-6 text-signal" />
              <h2 className="mt-4 font-display text-lg font-semibold text-white">{b.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-mist">{b.body}</p>
            </div>
          ))}
        </div>
      </CinematicSection>

      <CinematicSection className="py-12 md:py-16">
        <div className="container mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <section>
            <h2 className="font-display text-2xl font-semibold text-white md:text-3xl">What&apos;s included</h2>
            <ul className="mt-6 space-y-3">
              {l.included.map((item) => (
                <li key={item} className="flex items-start gap-3 text-mist">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-signal" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </section>
          <section className="rounded-2xl border border-signal/20 bg-signal/5 p-6 md:p-8">
            <h2 className="font-display text-xl font-semibold text-white">{PROVIDERS_CONTENT.finalCta.heading}</h2>
            <p className="mt-2 text-sm text-mist">{PROVIDERS_CONTENT.finalCta.sub}</p>
            <Button href={applyHref} variant="primary" withArrow className="mt-5">
              {l.cta}
            </Button>
          </section>
        </div>
      </CinematicSection>

      <CinematicSection className="py-12 md:py-20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-semibold text-white md:text-3xl">{PROVIDERS_CONTENT.onboarding.heading}</h2>
          <StepGrid steps={[...PROVIDERS_CONTENT.onboarding.steps]} className="mt-10" />
        </div>
      </CinematicSection>
    </InteriorPageLayout>
  );
}
