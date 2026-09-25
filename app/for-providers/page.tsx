import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, Dices, Handshake, Mail } from "lucide-react";
import { InteriorPageLayout } from "@/components/interior/InteriorPageLayout";
import { PageHero } from "@/components/interior/PageHero";
import { FaqList } from "@/components/interior/FaqList";
import { CinematicSection } from "@/components/motion/CinematicSection";
import { HUB_CONTENT, type HubCard } from "@/content/leadForms";

export const metadata: Metadata = {
  title: "For Providers — Host, Partner or List a Venue",
  description: HUB_CONTENT.sub,
};

const ICONS: Record<HubCard["icon"], typeof Dices> = { Dices, Handshake, Building2 };

export default function ForProvidersPage() {
  const h = HUB_CONTENT;

  return (
    <InteriorPageLayout>
      <PageHero eyebrow={h.eyebrow} title={h.title} sub={h.sub} breadcrumbs={[{ label: "For Providers" }]} />

      <CinematicSection className="py-12 md:py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {h.cards.map((card) => {
              const Icon = ICONS[card.icon];
              return (
                <Link
                  key={card.slug}
                  href={`/for-providers/${card.slug}`}
                  className="group relative flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 transition-all duration-300 hover:border-signal/40 hover:bg-white/[0.04]"
                >
                  <div>
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-signal/25 bg-signal/10 text-signal">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h2 className="mt-4 font-display text-xl font-semibold text-white transition-colors group-hover:text-signal">
                      {card.title}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-mist">{card.description}</p>
                  </div>
                  <ArrowRight className="mt-6 h-4 w-4 text-signal transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
              );
            })}

            <Link
              href={h.contactCard.href}
              className="group relative flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 transition-all duration-300 hover:border-signal/40 hover:bg-white/[0.04]"
            >
              <div>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-signal/25 bg-signal/10 text-signal">
                  <Mail className="h-5 w-5" aria-hidden="true" />
                </span>
                <h2 className="mt-4 font-display text-xl font-semibold text-white transition-colors group-hover:text-signal">
                  {h.contactCard.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-mist">{h.contactCard.description}</p>
              </div>
              <ArrowRight className="mt-6 h-4 w-4 text-signal transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </CinematicSection>

      <CinematicSection className="py-12 md:py-20">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-semibold text-white md:text-3xl">{h.faq.heading}</h2>
          <div className="mt-6">
            <FaqList items={h.faq.items} />
          </div>
        </div>
      </CinematicSection>
    </InteriorPageLayout>
  );
}
