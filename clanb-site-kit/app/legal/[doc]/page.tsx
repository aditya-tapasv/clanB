import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { InteriorPageLayout } from "@/components/interior/InteriorPageLayout";
import { PageHero } from "@/components/interior/PageHero";
import { CinematicSection } from "@/components/motion/CinematicSection";
import { cn } from "@/lib/cn";
import { LEGAL_DOCS, LEGAL_LAST_UPDATED, LEGAL_REVIEW_NOTE } from "@/content/legal";

interface PageProps {
  params: Promise<{ doc: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return LEGAL_DOCS.map((d) => ({ doc: d.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { doc } = await params;
  const d = LEGAL_DOCS.find((x) => x.slug === doc);
  return d ? { title: `${d.title} | Clan B`, description: d.summary } : { title: "Legal | Clan B" };
}

export default async function LegalPage({ params }: PageProps) {
  const { doc } = await params;
  const d = LEGAL_DOCS.find((x) => x.slug === doc);
  if (!d) notFound();

  return (
    <InteriorPageLayout>
      <PageHero eyebrow="LEGAL" title={d.title} sub={d.summary} breadcrumbs={[{ label: "Legal" }, { label: d.title }]} />

      <CinematicSection className="py-12 md:py-16">
        <div className="container mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
          <nav aria-label="Legal documents" className="lg:col-span-1">
            <ul className="space-y-1 lg:sticky lg:top-28">
              {LEGAL_DOCS.map((x) => (
                <li key={x.slug}>
                  <Link
                    href={`/legal/${x.slug}`}
                    aria-current={x.slug === d.slug ? "page" : undefined}
                    className={cn(
                      "block rounded-xl px-3 py-2 text-sm transition",
                      x.slug === d.slug ? "bg-signal/10 text-signal" : "text-mist hover:bg-white/5 hover:text-white"
                    )}
                  >
                    {x.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <article className="max-w-3xl space-y-8 lg:col-span-3">
            <p
              role="note"
              className="flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-300"
            >
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {LEGAL_REVIEW_NOTE}
            </p>
            <p className="font-mono text-xs text-zinc-500">Last updated {LEGAL_LAST_UPDATED}</p>
            {d.sections.map((s, i) => (
              <section key={s.heading}>
                <h2 className="font-display text-xl font-semibold text-white">
                  {i + 1}. {s.heading}
                </h2>
                <p className="mt-2 leading-relaxed text-mist">{s.body}</p>
              </section>
            ))}
          </article>
        </div>
      </CinematicSection>
    </InteriorPageLayout>
  );
}
