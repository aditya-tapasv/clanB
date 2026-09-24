import { Metadata } from "next";
import { notFound } from "next/navigation";
import { BadgeCheck, CalendarCheck, MapPin, Star } from "lucide-react";
import { InteriorPageLayout } from "@/components/interior/InteriorPageLayout";
import { PageHero } from "@/components/interior/PageHero";
import { CinematicSection } from "@/components/motion/CinematicSection";
import { EventCard } from "@/components/discovery/EventCard";
import { VenueCard } from "@/components/discovery/VenueCard";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/format";
import { repo } from "@/lib/data/repo";
import type { OrganizationType } from "@/lib/data/types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const TYPE_LABEL: Record<OrganizationType, string> = {
  vendor: "Vendor",
  facilitator: "Facilitator",
  venue: "Venue",
  organizer: "Organizer",
  corporate: "Corporate",
  clanb: "Clan B Official",
};

export async function generateStaticParams() {
  const orgs = await repo.listOrganizations();
  return orgs.map((o) => ({ slug: o.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const org = await repo.getOrganization(slug);
  return org ? { title: `${org.name} | Clan B`, description: org.description } : { title: "Provider not found | Clan B" };
}

export default async function ProviderProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const data = await repo.getProvider(slug);
  if (!data) notFound();

  const { organization: org, venues, upcomingEvents, reviews, stats } = data;
  const venueById = new Map(venues.map((v) => [v.id, v]));
  const allVenues = await repo.listVenues();
  const venueLookup = new Map(allVenues.map((v) => [v.id, v]));

  const indicators = [
    {
      icon: BadgeCheck,
      label: org.verified ? "Verified provider" : "Verification pending",
      detail: org.verified ? "ID and business documents checked by Clan B" : "Not yet verified",
    },
    {
      icon: Star,
      label: stats.averageRating ? `${stats.averageRating.toFixed(1)} average rating` : "No ratings yet",
      detail: `${stats.reviewCount} review${stats.reviewCount === 1 ? "" : "s"} from attendees`,
    },
    { icon: CalendarCheck, label: `${stats.sessionsHosted} sessions listed`, detail: "Published on Clan B" },
    { icon: MapPin, label: org.city, detail: venues.length ? `${venues.length} venue${venues.length === 1 ? "" : "s"} operated` : "Hosts at partner venues" },
  ];

  return (
    <InteriorPageLayout>
      <PageHero
        eyebrow={TYPE_LABEL[org.type].toUpperCase()}
        title={org.name}
        sub={org.description}
        breadcrumbs={[{ label: "Providers" }, { label: org.name }]}
        badge={
          org.verified ? (
            <Badge variant="signal">
              <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" /> Verified
            </Badge>
          ) : undefined
        }
      />

      <CinematicSection className="py-12 md:py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="sr-only">Trust indicators</h2>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {indicators.map(({ icon: Icon, label, detail }) => (
              <li key={label} className="rounded-2xl border border-white/10 bg-panel p-5">
                <Icon className="h-5 w-5 text-signal" aria-hidden="true" />
                <p className="mt-3 font-medium text-white">{label}</p>
                <p className="mt-1 text-xs text-mist">{detail}</p>
              </li>
            ))}
          </ul>
        </div>
      </CinematicSection>

      <CinematicSection className="py-12 md:py-16">
        <div className="container mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
          <section className="space-y-5">
            <h2 className="font-display text-2xl font-semibold text-white">Upcoming sessions</h2>
            {upcomingEvents.length ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {upcomingEvents.map((e) => (
                  <EventCard
                    key={e.id}
                    event={e}
                    venue={e.venueId ? venueById.get(e.venueId) ?? venueLookup.get(e.venueId) : undefined}
                    organization={org}
                  />
                ))}
              </div>
            ) : (
              <EmptyState title="Nothing scheduled right now" description="Follow this provider's venues and check back soon." />
            )}
          </section>

          {venues.length > 0 && (
            <section className="space-y-5">
              <h2 className="font-display text-2xl font-semibold text-white">Venues</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {venues.map((v) => (
                  <VenueCard key={v.id} venue={v} />
                ))}
              </div>
            </section>
          )}

          <section className="space-y-5">
            <h2 className="font-display text-2xl font-semibold text-white">Reviews</h2>
            {reviews.length ? (
              <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {reviews.map((r) => (
                  <li key={r.id} className="rounded-2xl border border-white/10 bg-panel p-5">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-amber-400" aria-label={`${r.rating} out of 5 stars`}>
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star key={i} className={i < r.rating ? "h-4 w-4 fill-amber-400" : "h-4 w-4 text-white/20"} aria-hidden="true" />
                        ))}
                      </span>
                      <span className="font-mono text-[11px] text-zinc-500">{formatDate(r.createdAt)}</span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-mist">{r.body}</p>
                    <p className="mt-3 font-mono text-[10px] text-zinc-500">Verified attendee</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-mist">No reviews yet — reviews come only from people who attended.</p>
            )}
          </section>
        </div>
      </CinematicSection>
    </InteriorPageLayout>
  );
}
