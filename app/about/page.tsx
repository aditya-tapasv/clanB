import { Metadata } from "next";
import { Briefcase, Building2, Mail } from "lucide-react";
import { InteriorPageLayout } from "@/components/interior/InteriorPageLayout";
import { PageHero } from "@/components/interior/PageHero";
import { StepGrid } from "@/components/interior/StepGrid";
import { CinematicSection } from "@/components/motion/CinematicSection";
import { Button } from "@/components/ui/Button";
import { ABOUT_CONTENT } from "@/content/about";

export const metadata: Metadata = {
  title: "About Clan B — Technology for Games & Sports",
  description: ABOUT_CONTENT.sub,
};

export default function AboutPage() {
  const a = ABOUT_CONTENT;

  return (
    <InteriorPageLayout>
      <PageHero
        eyebrow={a.eyebrow}
        title={a.title}
        sub={a.sub}
        breadcrumbs={[{ label: "About" }]}
        actions={
          <>
            <Button href="/play" variant="primary" withArrow>
              Book a Game
            </Button>
            <Button href="/for-providers" variant="ghost">
              Become a Partner
            </Button>
          </>
        }
      />

      <CinematicSection className="py-12 md:py-20">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-semibold text-white md:text-4xl">{a.story.heading}</h2>
          <div className="mt-6 space-y-5 text-base leading-relaxed text-mist md:text-lg">
            {a.story.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </CinematicSection>

      <CinematicSection id="how" className="scroll-mt-24 bg-ink-soft py-16 md:py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="font-mono text-xs uppercase tracking-[0.28em] text-signal">{a.how.eyebrow}</span>
          <h2 className="mt-3 font-display text-2xl font-semibold text-white md:text-4xl">{a.how.heading}</h2>
          <p className="mt-3 max-w-2xl text-mist">{a.how.sub}</p>
          <StepGrid steps={[...a.how.steps]} className="mt-12 lg:grid-cols-5" />
        </div>
      </CinematicSection>

      <CinematicSection className="py-16 md:py-24">
        <div className="container mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <section className="rounded-2xl border border-white/10 bg-panel p-6">
            <span className="font-mono text-xs uppercase tracking-[0.28em] text-signal">{a.offices.eyebrow}</span>
            <h2 className="mt-3 font-display text-xl font-semibold text-white">{a.offices.heading}</h2>
            <ul className="mt-5 space-y-4">
              {a.offices.list.map((o) => (
                <li key={o.city} className="flex items-start gap-3">
                  <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-signal" aria-hidden="true" />
                  <div>
                    <p className="font-medium text-white">{o.city}</p>
                    <p className="text-sm text-mist">
                      {o.role} · {o.note}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-5 font-mono text-[10px] text-zinc-500">{a.offices.company}</p>
          </section>

          <section id="contact" className="scroll-mt-24 rounded-2xl border border-white/10 bg-panel p-6">
            <Mail className="h-5 w-5 text-signal" aria-hidden="true" />
            <h2 className="mt-3 font-display text-xl font-semibold text-white">{a.contact.heading}</h2>
            <p className="mt-2 text-sm leading-relaxed text-mist">{a.contact.body}</p>
            <a href={`mailto:${a.contact.email}`} className="mt-4 inline-block text-sm font-medium text-signal hover:underline">
              {a.contact.email}
            </a>
          </section>

          <section id="careers" className="scroll-mt-24 rounded-2xl border border-white/10 bg-panel p-6">
            <Briefcase className="h-5 w-5 text-signal" aria-hidden="true" />
            <h2 className="mt-3 font-display text-xl font-semibold text-white">{a.careers.heading}</h2>
            <p className="mt-2 text-sm leading-relaxed text-mist">{a.careers.body}</p>
            <a href={`mailto:${a.contact.email}?subject=Careers`} className="mt-4 inline-block text-sm font-medium text-signal hover:underline">
              Say hello →
            </a>
          </section>
        </div>
      </CinematicSection>
    </InteriorPageLayout>
  );
}
