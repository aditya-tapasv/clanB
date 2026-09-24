import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { InteriorPageLayout } from "@/components/interior/InteriorPageLayout";
import { PageHero } from "@/components/interior/PageHero";
import { CinematicSection } from "@/components/motion/CinematicSection";
import { HelpTopicIcon } from "@/components/help/HelpTopicIcon";
import { ReportIssueForm } from "@/components/help/ReportIssueForm";
import { HELP_CONTENT, HELP_TOPICS } from "@/content/help";

interface PageProps {
  params: Promise<{ topic: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return HELP_TOPICS.map((t) => ({ topic: t.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { topic } = await params;
  const t = HELP_TOPICS.find((x) => x.slug === topic);
  return t ? { title: `${t.title} — Help | Clan B`, description: t.summary } : { title: "Help | Clan B" };
}

export default async function HelpTopicPage({ params }: PageProps) {
  const { topic } = await params;
  const t = HELP_TOPICS.find((x) => x.slug === topic);
  if (!t) notFound();

  const others = HELP_TOPICS.filter((x) => x.slug !== t.slug);

  return (
    <InteriorPageLayout>
      <PageHero
        eyebrow={HELP_CONTENT.eyebrow}
        title={t.title}
        sub={t.summary}
        breadcrumbs={[{ label: "Help", href: "/help" }, { label: t.title }]}
      />

      <CinematicSection className="py-12 md:py-16">
        <div className="container mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div className="space-y-8 lg:col-span-2">
            {t.sections.map((s) => (
              <section key={s.heading}>
                <h2 className="font-display text-xl font-semibold text-white">{s.heading}</h2>
                <p className="mt-2 leading-relaxed text-mist">{s.body}</p>
              </section>
            ))}
            {t.slug === "report" && <ReportIssueForm />}
          </div>

          <aside className="h-fit space-y-3 rounded-2xl border border-white/10 bg-panel p-6">
            <h2 className="font-mono text-xs uppercase tracking-[0.28em] text-mist">Other topics</h2>
            <ul className="space-y-1">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link
                    href={`/help/${o.slug}`}
                    className="flex items-center gap-3 rounded-xl px-2 py-2 text-sm text-white transition hover:bg-white/5 hover:text-signal"
                  >
                    <HelpTopicIcon icon={o.icon} className="h-4 w-4 text-signal" />
                    {o.title}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </CinematicSection>
    </InteriorPageLayout>
  );
}
