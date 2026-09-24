import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  MapPin, Star, CheckCircle2, ShieldCheck,
  Calendar, ArrowRight, Award,
} from "lucide-react";
import { SaveButton } from "@/components/account/SaveButton";
import { InteriorPageLayout } from "@/components/interior/InteriorPageLayout";
import { PageHero } from "@/components/interior/PageHero";
import { CinematicSection } from "@/components/motion/CinematicSection";
import { VenueSlotPicker } from "@/components/discovery/VenueSlotPicker";
import { repo } from "@/lib/data/repo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const venues = await repo.listVenues();
  return venues.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await repo.getVenue(slug);
  if (!data) return { title: "Venue Not Found | Clan B" };

  return {
    title: `${data.venue.name} | Clan B`,
    description: data.venue.description,
  };
}

export default async function VenueDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await repo.getVenue(slug);

  if (!data) {
    notFound();
  }

  const { venue, organization, resources, upcomingEvents, reviews } = data;

  return (
    <InteriorPageLayout>
      <PageHero
        eyebrow="VERIFIED VENUE"
        title={venue.name}
        sub={venue.description}
        breadcrumbs={[
          { label: "Venues", href: "/venues" },
          { label: venue.name },
        ]}
        badge={
          <>
            <SaveButton item={{ kind: "venue", slug: venue.slug, title: venue.name }} />
            {venue.rating && (
            <div className="flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-mono text-amber-400">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-white">{venue.rating.toFixed(1)}</span>
              <span className="text-white/60">({venue.reviewCount} reviews)</span>
            </div>
            )}
          </>
        }
      />

      <CinematicSection className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl space-y-12">
          {/* Main Grid: Details + Slot Picker */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Column: Venue Profile & Info */}
            <div className="lg:col-span-6 space-y-8">
              {/* Address & Quick Info Box */}
              <div className="rounded-2xl border border-white/10 bg-panel p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-mono tracking-wider text-signal">
                    LOCATION & ACCESS
                  </span>
                  <span className="text-xs text-mist font-mono">
                    {venue.address.neighbourhood}
                  </span>
                </div>

                <div className="flex items-start gap-2.5 text-sm text-mist">
                  <MapPin className="h-4 w-4 text-signal shrink-0 mt-0.5" />
                  <div>
                    <div className="text-white font-medium">{venue.address.line1}</div>
                    <div>
                      {venue.address.neighbourhood}, {venue.address.city} – {venue.address.postalCode}
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                  <span className="text-xs text-white/50 block">Venue Amenities</span>
                  <div className="flex flex-wrap gap-1.5">
                    {venue.amenities.map((am) => (
                      <span
                        key={am}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-mist"
                      >
                        {am}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Host Info */}
                <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs text-mist">
                  <span>
                    Operated by:{" "}
                    <Link href={`/providers/${organization.slug}`} className="font-semibold text-white hover:text-signal">
                      {organization.name}
                    </Link>
                  </span>
                  {organization.verified && (
                    <span className="inline-flex items-center gap-1 text-signal font-mono">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Verified Provider
                    </span>
                  )}
                </div>
              </div>

              {/* Resource Units List */}
              <div className="rounded-2xl border border-white/10 bg-panel p-6 space-y-4">
                <h3 className="font-display text-lg font-semibold text-white">
                  Available Spaces & Units ({resources.length})
                </h3>
                <div className="space-y-2.5">
                  {resources.map((res) => (
                    <div
                      key={res.id}
                      className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="text-white font-medium">{res.name}</div>
                        <div className="text-mist capitalize">
                          {res.kind} • Max {res.capacity} players
                        </div>
                      </div>
                      <span className="font-mono text-signal text-[11px] bg-signal/10 px-2 py-0.5 rounded-full border border-signal/20">
                        {res.indoor ? "Indoor AC" : "Outdoor Turf"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* House Rules */}
              <div className="rounded-2xl border border-white/10 bg-panel p-6 space-y-3">
                <h3 className="font-display text-lg font-semibold text-white">House Rules</h3>
                <ul className="space-y-2 text-xs text-mist">
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="h-4 w-4 text-signal shrink-0 mt-0.5" />
                    <span>Non-marking badminton shoes strictly required for indoor synthetic courts.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="h-4 w-4 text-signal shrink-0 mt-0.5" />
                    <span>Food and beverages must remain in dedicated cafe and spectator seating areas.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="h-4 w-4 text-signal shrink-0 mt-0.5" />
                    <span>All game components and racquets to be checked back in at the front desk.</span>
                  </li>
                </ul>
              </div>

              {/* Community Reviews */}
              {reviews.length > 0 && (
                <div className="rounded-2xl border border-white/10 bg-panel p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-lg font-semibold text-white">Player Reviews</h3>
                    <span className="text-xs font-mono text-signal flex items-center gap-1">
                      <Award className="h-3.5 w-3.5" />
                      Verified Visits
                    </span>
                  </div>
                  <div className="space-y-3">
                    {reviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-xs space-y-2 text-mist"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-amber-400">
                            {Array.from({ length: rev.rating }).map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                          <span className="text-white/60 text-[11px] font-mono">
                            {new Date(rev.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                          </span>
                        </div>
                        <p className="text-white/90 leading-relaxed">&ldquo;{rev.body}&rdquo;</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Slot Picker */}
            <div className="lg:col-span-6">
              <div className="sticky top-28">
                <VenueSlotPicker venue={venue} resources={resources} />
              </div>
            </div>
          </div>

          {/* Upcoming Events at this Venue */}
          {upcomingEvents.length > 0 && (
            <div className="space-y-6 pt-8 border-t border-white/[0.08]">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase font-mono tracking-wider text-signal">
                    SCHEDULED SESSIONS
                  </span>
                  <h3 className="font-display text-2xl font-semibold text-white">
                    Upcoming Sessions at {venue.name}
                  </h3>
                </div>
                <Link
                  href="/events"
                  className="text-xs text-signal hover:underline flex items-center gap-1 font-mono"
                >
                  View All Events
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.slice(0, 3).map((ev) => (
                  <article
                    key={ev.id}
                    className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 hover:border-signal/40 transition-all space-y-3"
                  >
                    <div className="text-xs font-mono text-signal flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(ev.startsAt).toLocaleDateString("en-IN", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    <Link href={`/events/${ev.slug}`}>
                      <h4 className="font-display text-base font-semibold text-white hover:text-signal transition-colors">
                        {ev.title}
                      </h4>
                    </Link>
                    <p className="text-xs text-mist line-clamp-2">{ev.summary}</p>
                    <div className="pt-2 flex items-center justify-between border-t border-white/[0.06] text-xs">
                      <span className="font-mono text-white">₹{ev.price.amount / 100}</span>
                      <Link
                        href={`/events/${ev.slug}`}
                        className="text-signal hover:underline font-mono"
                      >
                        Book Seat →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </CinematicSection>
    </InteriorPageLayout>
  );
}
