import { Metadata } from "next";
import { InteriorPageLayout } from "@/components/interior/InteriorPageLayout";
import { PageHero } from "@/components/interior/PageHero";
import { CinematicSection } from "@/components/motion/CinematicSection";
import { SportsFeedTabs } from "@/components/sports/SportsFeedTabs";
import { ActivityCard } from "@/components/discovery/ActivityCard";
import { SPORTS_CONTENT, getSportExplainer } from "@/content/sports";
import { repo } from "@/lib/data/repo";
import { isDiscoverable } from "@/lib/data/status";

export const metadata: Metadata = {
  title: "Sports in Bengaluru — Fixtures, Results & Where to Play | Clan B",
  description:
    "Follow live scores, upcoming fixtures and recent results for badminton, football 5s, box cricket, chess and more — then book a court or session near you.",
  openGraph: {
    title: "Sports on Clan B",
    description: "Fixtures, results and where to play it near you.",
  },
};

export default async function SportsPage() {
  const [sports, feed, events] = await Promise.all([
    repo.listSports(),
    repo.listSportsFeed(),
    repo.listEvents(),
  ]);

  const { index } = SPORTS_CONTENT;
  const sessionSlugs = Object.fromEntries(events.map((e) => [e.id, e.slug]));
  const liveSportSlugs = new Set(feed.filter((f) => f.kind === "live").map((f) => f.sportSlug));

  return (
    <InteriorPageLayout>
      <PageHero
        eyebrow={index.eyebrow}
        title={index.title}
        sub={index.sub}
        breadcrumbs={[{ label: "Sports" }]}
      />

      <CinematicSection className="py-12 md:py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-6 font-display text-2xl font-semibold text-white md:text-3xl">
            {index.feedHeading}
          </h2>
          <SportsFeedTabs items={feed} sessionSlugs={sessionSlugs} showSport idPrefix="sports-feed" />
        </div>
      </CinematicSection>

      <CinematicSection className="py-12 md:py-20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="font-mono text-xs uppercase tracking-[0.28em] text-signal">
            {index.catalogEyebrow}
          </span>
          <h2 className="mt-3 font-display text-2xl font-semibold text-white md:text-4xl">
            {index.catalogHeading}
          </h2>
          <p className="mt-3 max-w-2xl text-mist">{index.catalogSub}</p>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {sports.map((sport) => (
              <ActivityCard
                key={sport.id}
                activity={sport}
                href={`/sports/${sport.slug}`}
                tagline={getSportExplainer(sport.slug)?.tagline}
                openSessions={events.filter((e) => e.activityId === sport.id && isDiscoverable(e)).length}
                liveNow={liveSportSlugs.has(sport.slug)}
              />
            ))}
          </div>
        </div>
      </CinematicSection>
    </InteriorPageLayout>
  );
}
