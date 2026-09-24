import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { InteriorPageLayout } from "@/components/interior/InteriorPageLayout";
import { PageHero } from "@/components/interior/PageHero";
import { CinematicSection } from "@/components/motion/CinematicSection";
import { FaqList } from "@/components/interior/FaqList";
import { HelpTopicIcon } from "@/components/help/HelpTopicIcon";
import { Button } from "@/components/ui/Button";
import { HELP_CONTENT, HELP_TOPICS } from "@/content/help";

export const metadata: Metadata = {
  title: "Help Centre | Clan B",
  description: HELP_CONTENT.sub,
};

export default function HelpPage() {
  const h = HELP_CONTENT;

  return (
    <InteriorPageLayout>
      <PageHero eyebrow={h.eyebrow} title={h.title} sub={h.sub} breadcrumbs={[{ label: "Help" }]} />

      <CinematicSection className="py-12 md:py-16">
        <div className="container mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-semibold text-white">{h.topicsHeading}</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {HELP_TOPICS.map((t) => (
              <Link
                key={t.slug}
                href={`/help/${t.slug}`}
                className="group flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 transition-all duration-300 hover:border-signal/40 hover:bg-white/[0.04]"
              >
                <div>
                  <HelpTopicIcon icon={t.icon} className="h-6 w-6 text-signal" />
                  <h3 className="mt-4 font-display text-lg font-semibold text-white transition-colors group-hover:text-signal">
                    {t.title}
                  </h3>
                  <p className="mt-2 text-sm text-mist">{t.summary}</p>
                </div>
                <ArrowRight className="mt-6 h-4 w-4 text-signal transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </CinematicSection>

      <CinematicSection className="py-12 md:py-20">
        <div className="container mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <section className="lg:col-span-2">
            <h2 className="font-display text-2xl font-semibold text-white">{h.faqHeading}</h2>
            <div className="mt-6">
              <FaqList items={h.faqs} />
            </div>
          </section>
          <aside className="h-fit rounded-2xl border border-signal/20 bg-signal/5 p-6">
            <h2 className="font-display text-xl font-semibold text-white">{h.contact.heading}</h2>
            <p className="mt-2 text-sm text-mist">{h.contact.body}</p>
            <Button href={h.contact.href} variant="primary" withArrow className="mt-5">
              {h.contact.cta}
            </Button>
          </aside>
        </div>
      </CinematicSection>
    </InteriorPageLayout>
  );
}
