import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarClock, MapPin, Users } from "lucide-react";
import { InteriorPageLayout } from "@/components/interior/InteriorPageLayout";
import { PageHero } from "@/components/interior/PageHero";
import { CinematicSection } from "@/components/motion/CinematicSection";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CLUBS_CONTENT } from "@/content/clubs";
import { repo } from "@/lib/data/repo";

export const metadata: Metadata = {
  title: "Clubs & Communities in Bengaluru | Clan B",
  description:
    "Board game clubs, badminton groups, chess nights and futsal leagues meeting every week across Bengaluru.",
};

function ComingSoonRibbon() {
  return (
    <span className="absolute right-0 top-4 rounded-l-full bg-amber-400 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-black">
      {CLUBS_CONTENT.comingSoon}
    </span>
  );
}

export default async function ClubsPage() {
  const clubs = await repo.listClubs();
  const c = CLUBS_CONTENT;

  return (
    <InteriorPageLayout>
      <PageHero eyebrow={c.eyebrow} title={c.title} sub={c.sub} breadcrumbs={[{ label: "Clubs" }]} />

      <CinematicSection className="py-12 md:py-16">
        <div className="container mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
          {clubs.map((club) => {
            const href = `/${club.kind === "sport" ? "sports" : "games"}/${club.activitySlug}`;
            return (
              <article
                key={club.id}
                className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 transition-all duration-300 hover:border-signal/40"
              >
                <div className="space-y-3">
                  <Badge variant={club.kind === "sport" ? "cyan" : "signal"}>
                    {club.kind === "sport" ? "Sport" : "Board games"}
                  </Badge>
                  <h2 className="font-display text-xl font-semibold text-white">{club.name}</h2>
                  <p className="text-sm leading-relaxed text-mist">{club.description}</p>
                  <ul className="space-y-1.5 font-mono text-[11px] text-zinc-400">
                    <li className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> {club.neighbourhood}
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" /> {club.cadence}
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5" aria-hidden="true" /> {club.members} members
                    </li>
                  </ul>
                </div>
                <div className="mt-6 flex items-center justify-between gap-3 border-t border-white/[0.06] pt-4">
                  <button
                    type="button"
                    disabled
                    aria-describedby={`${club.id}-soon`}
                    className="cursor-not-allowed rounded-full border border-white/10 px-4 py-1.5 text-xs text-white/60"
                  >
                    {c.joinLabel}
                    <span id={`${club.id}-soon`} className="ml-1.5 text-amber-400">
                      · {c.comingSoon}
                    </span>
                  </button>
                  <Link
                    href={href}
                    className="inline-flex items-center gap-1 text-sm font-medium text-signal hover:underline"
                  >
                    {c.playLabel} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </CinematicSection>

      <CinematicSection className="py-12 md:py-20">
        <div className="container mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-semibold text-white md:text-3xl">{c.featuresHeading}</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {c.features.map((f) => (
              <div key={f.title} className="relative overflow-hidden rounded-2xl border border-white/10 bg-panel p-6">
                <ComingSoonRibbon />
                <h3 className="font-display text-lg font-semibold text-white">{f.title}</h3>
                <p className="mt-2 max-w-[85%] text-sm text-mist">{f.body}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-signal/20 bg-signal/5 p-6 md:flex-row md:items-center">
            <div>
              <h3 className="font-display text-lg font-semibold text-white">{c.startClub.heading}</h3>
              <p className="mt-1 text-sm text-mist">{c.startClub.body}</p>
            </div>
            <Button href={c.startClub.href} variant="primary" withArrow>
              {c.startClub.cta}
            </Button>
          </div>
        </div>
      </CinematicSection>
    </InteriorPageLayout>
  );
}
