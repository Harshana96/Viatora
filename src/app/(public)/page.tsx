import Image from "next/image";
import Link from "next/link";

import { HeroJourneyCard } from "@/components/home/HeroJourneyCard";
import { IslandCartography } from "@/components/home/IslandCartography";
import { Stars } from "@/components/reviews/Stars";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";
import { monthOptions } from "@/lib/months";
import { listDestinations } from "@/server/destinations/actions";
import { listGroupSizeRanges } from "@/server/group-size-ranges/actions";
import { listFeaturedReviews } from "@/server/reviews/actions";
import { listPublishedPackages } from "@/server/tours/actions";

export const dynamic = "force-dynamic";

const distinctions = [
  {
    label: "01 / Curation",
    title: "Three Journeys, Not Three Hundred",
    description:
      "Every route is itineraried in detail rather than pulled from a generic catalogue — chosen for pace, not padded with filler days.",
  },
  {
    label: "02 / Pricing",
    title: "One Number, Shown Up Front",
    description:
      "Your group size and arrival month decide the price before you ever speak to us — never a stack of add-on line items to negotiate later.",
  },
  {
    label: "03 / Ground Team",
    title: "A Person Confirms Every Detail",
    description:
      "Hotels and logistics are checked and confirmed by our team after your enquiry, not auto-booked against unavailable rooms.",
  },
  {
    label: "04 / Pacing",
    title: "Built Around the Journey, Not a Bus Schedule",
    description:
      "Each itinerary is mapped day by day so you always know where you are headed next and why.",
  },
];

const featuredDestinationSlugs = ["sigiriya", "ella", "nuwara-eliya", "mirissa"];

// The MVP is explicitly three curated journeys -- pin the homepage to exactly these,
// rather than "whatever happens to be published" (which could include e2e fixtures,
// drafts, or future packages that don't yet have pricing/cover images set up).
const featuredPackageSlugs = ["sri-lanka-grand-journey", "sri-lanka-explorer", "sri-lanka-highlights"];

export default async function HomePage() {
  const [allPackages, destinations, groupSizeRanges, featuredReviews] = await Promise.all([
    listPublishedPackages(),
    listDestinations(),
    listGroupSizeRanges(),
    listFeaturedReviews(6),
  ]);

  const packages = featuredPackageSlugs
    .map((slug) => allPackages.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const heroSlides = packages.map((tourPackage) => ({
    slug: tourPackage.slug,
    name: tourPackage.name,
    durationDays: tourPackage.durationDays,
    description: tourPackage.description,
    highlights: tourPackage.highlights,
    startingPrice: tourPackage.startingPrice != null ? Number(tourPackage.startingPrice) : null,
  }));

  const dominantTour = packages.find((p) => p.slug === "sri-lanka-grand-journey") ?? packages[0];
  const sideTours = packages.filter((p) => p.id !== dominantTour?.id).slice(0, 2);

  const waypoints = featuredDestinationSlugs
    .map((slug) => destinations.find((d) => d.slug === slug))
    .filter((d): d is NonNullable<typeof d> => Boolean(d))
    .map((destination) => ({
      slug: destination.slug,
      name: destination.name,
      location: destination.location,
      description: destination.description,
      highlight: destination.thingsToDo[0] ?? null,
    }));

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-7xl space-y-28 px-4 pt-8 pb-24 sm:space-y-36 sm:px-6 sm:pt-14 lg:px-8">
        {/* Hero */}
        <section className="relative">
          <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="space-y-7 lg:col-span-7">
              <div className="flex items-center gap-3 text-xs tracking-[0.2em] text-muted uppercase">
                <span className="h-px w-7 bg-accent" />
                <span>Curated Journeys, Planned Simply</span>
              </div>

              <h1 className="font-editorial text-5xl leading-[1.03] font-light tracking-[-0.03em] text-foreground sm:text-6xl xl:text-7xl">
                Unscripted Ceylon. <br />
                <span className="font-editorial font-normal text-ceylon-tea italic">Mist-veiled peaks</span> &amp;
                warm southern seas.
              </h1>

              <p className="max-w-xl text-base leading-relaxed font-light text-muted sm:text-lg">
                Three handcrafted routes through tea country, ancient citadels and the coast. Tell us your group
                size and when you&apos;re arriving — see one clear price before you talk to anyone.
              </p>

              <form action="/tours" className="flex flex-col gap-4 border-y border-border py-6 sm:flex-row sm:items-end">
                <div className="flex-1">
                  <Label htmlFor="groupSize">Group size</Label>
                  <Select id="groupSize" name="groupSize" defaultValue="">
                    <option value="">Any group size</option>
                    {groupSizeRanges.map((range) => (
                      <option key={range.id} value={range.id}>
                        {range.label}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="flex-1">
                  <Label htmlFor="month">Arrival month</Label>
                  <Select id="month" name="month" defaultValue="">
                    <option value="">Any month</option>
                    {monthOptions.map((month) => (
                      <option key={month.value} value={month.value}>
                        {month.label}
                      </option>
                    ))}
                  </Select>
                </div>
                <Button type="submit" variant="accent">
                  Explore Journeys
                </Button>
              </form>

              <Link href="/destinations" className="font-editorial inline-block text-sm text-foreground italic hover:text-accent">
                View Island Waypoints →
              </Link>
            </div>

            <div className="lg:col-span-5">
              <HeroJourneyCard slides={heroSlides} />
            </div>
          </div>
        </section>

        {/* Curated Expeditions */}
        {dominantTour ? (
          <section className="space-y-8" id="journeys">
            <div className="flex flex-col gap-4 border-b border-parchment-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="mb-1 text-[11px] font-semibold tracking-[0.2em] text-accent uppercase">
                  Handcrafted Itineraries
                </div>
                <h2 className="font-editorial text-3xl font-medium text-foreground sm:text-4xl">Curated Expeditions</h2>
              </div>
              <Link href="/tours" className="group flex items-center gap-1 text-xs font-semibold tracking-wider text-foreground uppercase hover:text-accent">
                <span>View all journeys</span>
                <span className="font-editorial text-sm transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
              <article className="group flex flex-col justify-between border border-parchment-300 bg-surface p-6 sm:p-8 lg:col-span-7">
                <div className="space-y-5">
                  <div className="relative h-80 w-full overflow-hidden bg-parchment-200 sm:h-96">
                    {dominantTour.coverImageUrl ? (
                      <Image
                        src={dominantTour.coverImageUrl}
                        alt={dominantTour.name}
                        width={900}
                        height={600}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      />
                    ) : null}
                    <div className="absolute top-4 left-4 bg-foreground/90 px-3 py-1 font-mono text-[11px] tracking-wider text-background uppercase">
                      {dominantTour.durationDays - 1} nights / {dominantTour.durationDays} days
                    </div>
                  </div>

                  <div className="space-y-2">
                    {dominantTour.destination ? (
                      <div className="font-sans text-[10px] tracking-[0.2em] text-muted uppercase">
                        {dominantTour.destination.name}
                      </div>
                    ) : null}
                    <h3 className="font-editorial text-2xl font-semibold text-foreground transition-colors group-hover:text-accent sm:text-3xl">
                      {dominantTour.name}
                    </h3>
                    <p className="text-sm leading-relaxed font-light text-muted">{dominantTour.description}</p>
                  </div>

                  {dominantTour.included.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2 border-t border-parchment-200 pt-2 text-xs text-muted sm:grid-cols-3">
                      {dominantTour.included.slice(0, 6).map((item) => (
                        <div key={item}>✓ {item}</div>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-parchment-200 pt-5">
                  <div>
                    {dominantTour.startingPrice != null ? (
                      <>
                        <span className="block font-sans text-[10px] tracking-widest text-muted uppercase">From</span>
                        <span className="font-editorial text-2xl font-bold text-foreground">
                          {formatCurrency(Number(dominantTour.startingPrice))}
                        </span>
                        <span className="text-xs font-light text-muted"> / person</span>
                      </>
                    ) : null}
                  </div>
                  <Link
                    href={`/tours/${dominantTour.slug}`}
                    className="inline-flex items-center gap-2 bg-foreground px-5 py-2.5 text-xs font-medium tracking-wider text-background uppercase transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <span>Inspect Day Details</span>
                    <span className="font-editorial text-sm">→</span>
                  </Link>
                </div>
              </article>

              <div className="space-y-8 lg:col-span-5">
                {sideTours.map((tour) => (
                  <article
                    key={tour.id}
                    className="group border border-parchment-300 bg-surface p-5 transition-all hover:border-foreground"
                  >
                    <div className="relative mb-4 h-48 w-full overflow-hidden bg-parchment-200">
                      {tour.coverImageUrl ? (
                        <Image
                          src={tour.coverImageUrl}
                          alt={tour.name}
                          width={600}
                          height={400}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : null}
                      <span className="absolute top-3 left-3 bg-foreground/90 px-2.5 py-0.5 font-mono text-[10px] text-background uppercase">
                        {tour.durationDays - 1} nights / {tour.durationDays} days
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {tour.destination ? (
                        <div className="text-[10px] font-medium tracking-wider text-ceylon-tea uppercase">
                          {tour.destination.name}
                        </div>
                      ) : null}
                      <h4 className="font-editorial text-xl font-semibold text-foreground transition-colors group-hover:text-accent">
                        {tour.name}
                      </h4>
                      <p className="line-clamp-2 text-xs leading-relaxed font-light text-muted">{tour.description}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-parchment-200 pt-3 text-xs">
                      <div>
                        {tour.startingPrice != null ? (
                          <>
                            <span className="block text-[10px] text-muted uppercase">From</span>
                            <span className="font-editorial text-xl font-bold text-foreground">
                              {formatCurrency(Number(tour.startingPrice))}
                            </span>
                          </>
                        ) : null}
                      </div>
                      <Link
                        href={`/tours/${tour.slug}`}
                        className="font-editorial flex items-center gap-1 text-foreground italic transition hover:text-accent"
                      >
                        <span>View Route</span>
                        <span>→</span>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {/* Island Cartography */}
        {waypoints.length > 0 ? (
          <section className="space-y-8" id="cartography">
            <div className="flex flex-col gap-4 border-b border-parchment-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="mb-1 text-[11px] font-semibold tracking-[0.2em] text-accent uppercase">
                  Geographic Journal
                </div>
                <h2 className="font-editorial text-3xl font-medium text-foreground sm:text-4xl">
                  The Island Cartography &amp; Waypoints
                </h2>
              </div>
              <p className="max-w-sm text-xs leading-relaxed font-light text-muted">
                An illustrative overview of the regions our journeys pass through — each itinerary page has the
                real, day-by-day route map.
              </p>
            </div>
            <IslandCartography waypoints={waypoints} />
          </section>
        ) : null}

        {/* Philosophy */}
        <section className="border-t border-b border-parchment-300 py-16 sm:py-20">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-6">
              <div className="text-[11px] font-semibold tracking-[0.25em] text-accent uppercase">
                The Craft of Slow Travel
              </div>
              <blockquote className="font-editorial text-3xl leading-[1.18] font-light text-foreground sm:text-4xl">
                &ldquo;We don&apos;t build rushed bus-tour schedules. Every itinerary is mapped day by day, so you
                always know where you&apos;re headed and why.&rdquo;
              </blockquote>
              <p className="text-sm leading-relaxed font-light text-muted">
                Viatora exists because planning a trip to Sri Lanka usually means dozens of open tabs and quotes
                from three agents that don&apos;t line up. We wanted a simpler starting point: a handful of
                well-designed journeys, a route you can actually see, and one honest price before you ever have
                to talk to anyone.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-6">
              {distinctions.map((item) => (
                <div key={item.label} className="space-y-2 border-t border-stone-400/70 pt-4">
                  <div className="font-mono text-xs font-semibold tracking-wider text-muted uppercase">
                    {item.label}
                  </div>
                  <h4 className="font-editorial text-xl font-bold text-foreground">{item.title}</h4>
                  <p className="text-xs leading-relaxed font-light text-muted">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Reviews */}
        {featuredReviews.length > 0 ? (
          <section className="space-y-10">
            <div className="flex flex-col gap-4 border-b border-parchment-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-1.5">
                <div className="text-[11px] font-semibold tracking-[0.25em] text-accent uppercase">
                  Guest Dispatches
                </div>
                <h2 className="font-editorial text-3xl leading-tight font-normal text-foreground sm:text-4xl">
                  Words from the Unhurried Island.
                </h2>
              </div>
              <p className="max-w-sm text-xs leading-relaxed font-light text-muted">
                Unedited thoughts from travellers who trusted us with their days across tea country, wild coasts
                and ancient citadels.
              </p>
            </div>

            <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-3">
              {featuredReviews.map((review) => (
                <article
                  key={review.id}
                  className="flex flex-col justify-between border border-parchment-300 bg-surface p-6 shadow-sm transition-all hover:border-foreground sm:p-8"
                >
                  <div className="space-y-4">
                    <Stars rating={review.rating} />
                    <p className="border-l-2 border-accent/40 pl-4 text-sm leading-relaxed font-light text-foreground italic">
                      &ldquo;{review.comment}&rdquo;
                    </p>
                  </div>
                  <div className="mt-6 border-t border-parchment-200 pt-5">
                    <h4 className="font-editorial text-lg font-semibold text-foreground">{review.name}</h4>
                    <p className="text-[11px] font-light text-muted">{review.package.name}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {/* Closing CTA */}
        <section className="border border-parchment-300 bg-parchment-100 p-8 text-center sm:p-14 lg:p-16 dark:bg-jungle-800">
          <div className="mx-auto max-w-2xl space-y-5">
            <div className="text-[11px] font-semibold tracking-[0.25em] text-accent uppercase">
              Begin Your Journey
            </div>
            <h2 className="font-editorial text-4xl font-normal tracking-tight text-foreground sm:text-5xl">
              Speak with our travel curators
            </h2>
            <p className="mx-auto max-w-lg text-sm leading-relaxed font-light text-muted">
              Tell us where you wish to explore and your desired dates. We&apos;ll confirm hotels and logistics
              and send a tailored proposal.
            </p>
            <div className="pt-2">
              <Link href="/enquiry">
                <Button variant="accent">Submit an Itinerary Request</Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
