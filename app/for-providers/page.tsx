import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { InteriorPageLayout } from "@/components/interior/InteriorPageLayout";
import { PageHero } from "@/components/interior/PageHero";
import { StepGrid } from "@/components/interior/StepGrid";
import { FaqList } from "@/components/interior/FaqList";
import { CinematicSection } from "@/components/motion/CinematicSection";
import { HostStack } from "@/components/home/HostStack";
import { Intelligence } from "@/components/home/Intelligence";
import { Trust } from "@/components/home/Trust";
import { Button } from "@/components/ui/Button";
import { PROVIDERS_CONTENT, PROVIDER_HOST_STACK, PROVIDER_INTELLIGENCE, PROVIDER_TRUST } from "@/content/providers";

export const metadata: Metadata = {
  title: "For Providers — Host, List & Organize on Clan B",
  description: PROVIDERS_CONTENT.hero.sub,
};

export default function ForProvidersPage() {
  const p = PROVIDERS_CONTENT;

  return (
    <InteriorPageLayout>
      <PageHero
        eyebrow={p.hero.eyebrow}
        title={p.hero.title}
        sub={p.hero.sub}
        breadcrumbs={[{ label: "For Providers" }]}
        actions={
          <>
            <Button href={p.hero.primary.href} variant="primary" withArrow>
              {p.hero.primary.label}
            </Button>
            <Button href={p.hero.secondary.href} variant="ghost">
              {p.hero.secondary.label}
            </Button>
          </>
        }
      />

      <CinematicSection className="py-12 md:py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="font-mono text-xs uppercase tracking-[0.28em] text-signal">{p.types.eyebrow}</span>
          <h2 className="mt-3 font-display text-2xl font-semibold text-white md:text-4xl">{p.types.heading}</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {p.types.list.map((t) => (
              <Link
                key={t.id}
                href={t.href}
                className="group rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 transition-all duration-300 hover:border-signal/40 hover:bg-white/[0.04]"
              >
                <h3 className="font-display text-xl font-semibold text-white transition-colors group-hover:text-signal">
                  {t.title}
                </h3>
                <p className="mt-2 text-sm text-mist">{t.body}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-signal">
                  Learn more <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </CinematicSection>

      <HostStack content={PROVIDER_HOST_STACK} />
      <Intelligence content={PROVIDER_INTELLIGENCE} />

      <CinematicSection id="onboarding" className="scroll-mt-24 py-16 md:py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="font-mono text-xs uppercase tracking-[0.28em] text-signal">{p.onboarding.eyebrow}</span>
          <h2 className="mt-3 font-display text-2xl font-semibold text-white md:text-4xl">{p.onboarding.heading}</h2>
          <p className="mt-3 max-w-2xl text-mist">{p.onboarding.sub}</p>
          <StepGrid steps={[...p.onboarding.steps]} className="mt-12" />
        </div>
      </CinematicSection>

      <Trust content={PROVIDER_TRUST} />

      <CinematicSection className="py-16 md:py-24">
        <div className="container mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <section className="lg:col-span-2">
            <h2 className="font-display text-2xl font-semibold text-white md:text-3xl">{p.faq.heading}</h2>
            <div className="mt-6">
              <FaqList items={p.faq.items} />
            </div>
          </section>
          <aside className="h-fit rounded-2xl border border-signal/20 bg-signal/5 p-6">
            <h2 className="font-display text-xl font-semibold text-white">{p.finalCta.heading}</h2>
            <p className="mt-2 text-sm text-mist">{p.finalCta.sub}</p>
            <Button href={p.finalCta.href} variant="primary" withArrow className="mt-5">
              {p.finalCta.label}
            </Button>
          </aside>
        </div>
      </CinematicSection>
    </InteriorPageLayout>
  );
}
