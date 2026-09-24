import { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2, Clock, MapPin, Users } from "lucide-react";
import { SaveButton } from "@/components/account/SaveButton";
import { InteriorPageLayout } from "@/components/interior/InteriorPageLayout";
import { PageHero } from "@/components/interior/PageHero";
import { CinematicSection } from "@/components/motion/CinematicSection";
import { SportsFeedTabs } from "@/components/sports/SportsFeedTabs";
import { EventCard } from "@/components/discovery/EventCard";
import { VenueCard } from "@/components/discovery/VenueCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { SPORTS_CONTENT, getSportExplainer } from "@/content/sports";
import { repo } from "@/lib/data/repo";
import { isDiscoverable } from "@/lib/data/status";
import { formatPlayers } from "@/lib/data/games";

interface PageProps {
  params: Promise<{ sport: string }>;
}

export async function generateStaticParams() {
  const sports = await repo.listSports();
  return sports.map((s) => ({ sport: s.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { sport } = await params;
  const data = await repo.getSport(sport);
  if (!data) return { title: "Sport Not Found | Clan B" };

  const description =
    getSportExplainer(sport)?.tagline ?? `Fixtures, results and where to play ${data.activity.name} in Bengaluru.`;
  return {
    title: `${data.activity.name} in Bengaluru — Fixtures & Where to Play | Clan B`,
    description,
    openGraph: { title: `${data.activity.name} on Clan B`, description },
  };
}

export default async function SportDetailPage({ params }: PageProps) {
  const { sport } = await params;
  const [data, feed] = await Promise.all([repo.getSport(sport), repo.listSportsFeed(undefined, sport)]);

  if (!data) {
    notFound();
  }

  const { activity, events, venues } = data;
  const explainer = getSportExplainer(activity.slug);
  const { detail } = SPORTS_CONTENT;
  const sessionSlugs = Object.fromEntries(events.map((e) => [e.id, e.slug]));
  const sessions = events.filter(isDiscoverable);
  const venueById = new Map(venues.map((v) => [v.id, v]));
  const players = formatPlayers(activity);

  return (
    <InteriorPageLayout>
      <PageHero
        eyebrow={activity.category.toUpperCase()}
        title={activity.name}
        sub={explainer?.tagline}
        breadcrumbs={[{ label: "Sports", href: "/sports" }, { label: activity.name }]}
        badge={
          <>
            <SaveButton item={{ kind: "sport", slug: activity.slug, title: activity.name }} />
            {feed.some((f) => f.kind === "live") && (
              <Badge variant="signal" ping>
                Live now
              </Badge>
            )}
          </>
        }
      >
        <ul className="flex flex-wrap gap-2 font-mono text-[11px] text-zinc-300">
          <li className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1">
            <Users className="h-3.5 w-3.5" aria-hidden="true" /> {players} players
          </li>
          <li className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" /> {activity.durationMin} min
          </li>
          <li className="rounded-full border border-white/10 bg-white/5 px-3 py-1">{activity.format}</li>
          <li className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
            {activity.indoor ? "Indoor" : "Outdoor"}
          </li>
        </ul>
      </PageHero>

      <CinematicSection className="py-12 md:py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SportsFeedTabs items={feed} sessionSlugs={sessionSlugs} idPrefix={`${activity.slug}-feed`} />
        </div>
      </CinematicSection>

      {explainer && (
        <CinematicSection className="py-12 md:py-16">
          <div className="container mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
            <section className="rounded-2xl border border-white/10 bg-panel p-6 lg:col-span-1">
              <h2 className="font-display text-xl font-semibold text-white">{detail.explainerHeading}</h2>
              <p className="mt-3 text-sm leading-relaxed text-mist">{explainer.basics}</p>
            </section>
            <section className="rounded-2xl border border-white/10 bg-panel p-6">
              <h2 className="font-display text-xl font-semibold text-white">{detail.firstStepsHeading}</h2>
              <ol className="mt-4 space-y-3">
                {explainer.firstSteps.map((step, i) => (
                  <li key={step} className="flex gap-3 text-sm text-mist">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-signal/30 bg-signal/10 font-mono text-[11px] text-signal">
                      {i + 1}
                    </span>
                    <span className="pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </section>
            <section className="rounded-2xl border border-white/10 bg-panel p-6">
              <h2 className="font-display text-xl font-semibold text-white">{detail.bringHeading}</h2>
              <ul className="mt-4 space-y-2.5">
                {explainer.whatToBring.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-mist">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-signal" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </CinematicSection>
      )}

      <CinematicSection id="local-play" className="py-12 md:py-20">
        <div className="container mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.28em] text-signal">
              {detail.localPlayEyebrow}
            </span>
            <h2 className="mt-3 font-display text-2xl font-semibold text-white md:text-4xl">
              {detail.localPlayHeading}
            </h2>
            <p className="mt-3 max-w-2xl text-mist">{detail.localPlaySub}</p>
          </div>

          <div className="space-y-5">
            <h3 className="font-display text-lg font-semibold text-white">{detail.sessionsHeading}</h3>
            {sessions.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {sessions.map((e) => (
                  <EventCard key={e.id} event={e} venue={e.venueId ? venueById.get(e.venueId) : undefined} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={MapPin}
                title={detail.noSessionsTitle}
                description={detail.noSessionsDescription}
                actionLabel="Request a game"
                actionHref="/play/request"
              />
            )}
          </div>

          {venues.length > 0 && (
            <div className="space-y-5">
              <h3 className="font-display text-lg font-semibold text-white">{detail.venuesHeading}</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {venues.map((v) => (
                  <VenueCard key={v.id} venue={v} />
                ))}
              </div>
            </div>
          )}
        </div>
      </CinematicSection>
    </InteriorPageLayout>
  );
}
