import { Metadata } from "next";
import { InteriorPageLayout } from "@/components/interior/InteriorPageLayout";
import { PageHero } from "@/components/interior/PageHero";
import { CinematicSection } from "@/components/motion/CinematicSection";
import { GamesCatalogView } from "@/components/discovery/GamesCatalogView";
import { GAMES_CONTENT } from "@/content/games";
import { GAME_MOODS } from "@/lib/data/games";
import { repo } from "@/lib/data/repo";
import { isDiscoverable } from "@/lib/data/status";

export const metadata: Metadata = {
  title: "Board Games — Find Games by Group, Time & Mood | Clan B",
  description:
    "Browse 30 board games by player count, play time, complexity and mood — then join a table in Bengaluru where they're being played.",
  openGraph: {
    title: "Board Games on Clan B",
    description: "Discover board games by group, time and mood.",
  },
};

interface PageProps {
  searchParams: Promise<{ mood?: string }>;
}

export default async function GamesPage({ searchParams }: PageProps) {
  const [{ mood }, games, events] = await Promise.all([searchParams, repo.listGames(), repo.listEvents()]);
  const { index } = GAMES_CONTENT;

  const initialMood = GAME_MOODS.find((m) => m.toLowerCase() === mood?.toLowerCase());
  const sessionCounts: Record<string, number> = {};
  for (const e of events) {
    if (e.activityId && isDiscoverable(e)) sessionCounts[e.activityId] = (sessionCounts[e.activityId] ?? 0) + 1;
  }

  return (
    <InteriorPageLayout>
      <PageHero eyebrow={index.eyebrow} title={index.title} sub={index.sub} breadcrumbs={[{ label: "Games" }]} />

      <CinematicSection className="py-12 md:py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* key remounts the filters when navigating between ?mood= links */}
          <GamesCatalogView
            key={initialMood ?? "all"}
            games={games}
            sessionCounts={sessionCounts}
            initialMood={initialMood}
          />
        </div>
      </CinematicSection>
    </InteriorPageLayout>
  );
}
