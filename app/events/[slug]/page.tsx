import { Metadata } from "next";
import { notFound } from "next/navigation";
import { SaveButton } from "@/components/account/SaveButton";
import { InteriorPageLayout } from "@/components/interior/InteriorPageLayout";
import { PageHero } from "@/components/interior/PageHero";
import { CinematicSection } from "@/components/motion/CinematicSection";
import { EventDetailView } from "@/components/discovery/EventDetailView";
import { repo } from "@/lib/data/repo";
import { eventJsonLd, jsonLd } from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const events = await repo.listEvents();
  return events.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await repo.getEvent(slug);
  if (!data) return { title: "Event Not Found | Clan B" };

  return {
    title: `${data.event.title} | Clan B`,
    description: data.event.summary,
    openGraph: {
      title: `${data.event.title} | Clan B`,
      description: data.event.summary,
    },
  };
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await repo.getEvent(slug);

  if (!data) {
    notFound();
  }

  return (
    <InteriorPageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(eventJsonLd(data.event, data.organization, data.venue)) }}
      />
      <PageHero
        eyebrow="EVENT DETAILS"
        title={data.event.title}
        sub={data.event.summary}
        breadcrumbs={[
          { label: "Events", href: "/events" },
          { label: data.event.title },
        ]}
        badge={<SaveButton item={{ kind: "event", slug: data.event.slug, title: data.event.title }} />}
      />

      <CinematicSection className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <EventDetailView data={data} />
        </div>
      </CinematicSection>
    </InteriorPageLayout>
  );
}
