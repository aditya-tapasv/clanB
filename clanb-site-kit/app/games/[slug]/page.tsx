import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock, Gauge, MapPin, Users } from "lucide-react";
import { SaveButton } from "@/components/account/SaveButton";
import { InteriorPageLayout } from "@/components/interior/InteriorPageLayout";
import { PageHero } from "@/components/interior/PageHero";
import { CinematicSection } from "@/components/motion/CinematicSection";
import { EventCard } from "@/components/discovery/EventCard";
import { VenueCard } from "@/components/discovery/VenueCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { GAMES_CONTENT, GAME_GUIDES } from "@/content/games";
import { formatPlayers, getGameMoods } from "@/lib/data/games";
import { repo } from "@/lib/data/repo";
import { isDiscoverable } from "@/lib/data/status";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const games = await repo.listGames();
  return games.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await repo.getGame(slug);
  if (!data) return { title: "Game Not Found | Clan B" };

  const description = GAME_GUIDES[slug]?.overview ?? `Play ${data.activity.name} at a table in Bengaluru.`;
  return {
    title: `${data.activity.name} — How to Play & Where to Play | Clan B`,
    description,
    openGraph: { title: `${data.activity.name} on Clan B`, description },
  };
}

export default async function GameDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await repo.getGame(slug);

  if (!data) {
    notFound();
  }

  const { activity, events, venues } = data;
  const guide = GAME_GUIDES[activity.slug];
  const { detail } = GAMES_CONTENT;
  const sessions = events.filter(isDiscoverable);
  const venueById = new Map(venues.map((v) => [v.id, v]));
  const moods = getGameMoods(activity);

  const facts = [
    { icon: Users, label: "Players", value: formatPlayers(activity) },
    { icon: Clock, label: "Play time", value: `${activity.durationMin} min` },
    { icon: Gauge, label: "Complexity", value: activity.complexity ?? "—" },
  ];

  return (
    <InteriorPageLayout>
      <PageHero
        eyebrow={activity.category.toUpperCase()}
        title={activity.name}
        sub={guide?.overview}
        breadcrumbs={[{ label: "Games", href: "/games" }, { label: activity.name }]}
        badge={<SaveButton item={{ kind: "game", slug: activity.slug, title: activity.name }} />}
      >
        {moods.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {moods.map((m) => (
              <li
                key={m}
                className="rounded-full border border-signal/20 bg-signal/5 px-3 py-1 font-mono text-[11px] text-signal"
              >
                {m}
              </li>
            ))}
          </ul>
        )}
      </PageHero>

      <CinematicSection className="py-12 md:py-16">
        <div className="container mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <section className="space-y-6 rounded-2xl border border-white/10 bg-panel p-6 lg:col-span-2">
            {guide && (
              <>
                <div>
                  <h2 className="font-display text-xl font-semibold text-white">{detail.overviewHeading}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-mist">{guide.overview}</p>
                </div>
                <div>
                  <h2 className="font-display text-xl font-semibold text-white">{detail.howToPlayHeading}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-mist">{guide.howToPlay}</p>
                </div>
              </>
            )}
            <p className="font-mono text-[11px] text-zinc-400">
              Format: {activity.format} · Skill: {activity.skill.replace("-", " ")}
            </p>
          </section>

          <section className="rounded-2xl border border-white/10 bg-panel p-6">
            <h2 className="font-display text-xl font-semibold text-white">{detail.idealGroupHeading}</h2>
            <dl className="mt-4 space-y-3">
              {facts.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center justify-between border-b border-white/[0.06] pb-3 text-sm">
                  <dt className="inline-flex items-center gap-2 text-mist">
                    <Icon className="h-4 w-4 text-signal" aria-hidden="true" /> {label}
                  </dt>
                  <dd className="font-mono capitalize text-white">{value}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </CinematicSection>

      <CinematicSection className="py-12 md:py-20">
        <div className="container mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
          <div className="space-y-5">
            <h2 className="font-display text-2xl font-semibold text-white">{detail.sessionsHeading}</h2>
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
              <h2 className="font-display text-2xl font-semibold text-white">{detail.tablesHeading}</h2>
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
