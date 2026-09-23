import Link from "next/link";

import { DestinationCard } from "@/components/destinations/DestinationCard";
import { PackageCard } from "@/components/tours/PackageCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { travelTypeLabels } from "@/lib/travel-type";
import { listPopularDestinations } from "@/server/destinations/actions";
import { listPublishedPackages } from "@/server/tours/actions";

export const dynamic = "force-dynamic";

const whySriLanka = [
  {
    title: "Diverse landscapes",
    description:
      "Beaches, hill country tea plantations, rainforest and ancient cities, all within a few hours' drive of each other.",
  },
  {
    title: "Rich culture and heritage",
    description: "Centuries-old temples, colonial towns and UNESCO World Heritage sites across the island.",
  },
  {
    title: "Wildlife and nature",
    description: "National parks home to elephants, leopards and whales, alongside lush botanical gardens.",
  },
  {
    title: "Warm hospitality",
    description: "A small, easy-to-navigate island known for welcoming visitors and unhurried travel.",
  },
];

export default async function HomePage() {
  const [popularPackages, popularDestinations] = await Promise.all([
    listPublishedPackages({ take: 6 }),
    listPopularDestinations(6),
  ]);

  return (
    <main className="flex-1">
      {/* Hero + search */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/15 via-background to-amber-100/40 dark:from-accent/10 dark:via-background dark:to-accent/5" />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 py-28 text-center sm:py-36">
          <span className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">Sri Lanka, planned visually</span>
          <h1 className="text-5xl font-semibold tracking-tight text-balance sm:text-6xl">Viatora</h1>
          <p className="max-w-xl text-lg text-stone-600 dark:text-stone-400">
            Discover Sri Lanka, understand the complete journey visually, and enquire about a tour.
          </p>
          <form action="/tours" className="mt-2 flex w-full max-w-md gap-2">
            <Input name="query" placeholder="Search tours, e.g. 'hill country'" className="flex-1 bg-white/90 dark:bg-stone-900/80" />
            <Button type="submit">Search</Button>
          </form>
          <div className="mt-1 flex flex-wrap items-center justify-center gap-3">
            <Link href="/tours">
              <Button>Explore Tours</Button>
            </Link>
            <Link href="/destinations">
              <Button variant="secondary">Browse Destinations</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Popular tour packages */}
      {popularPackages.length > 0 ? (
        <section className="px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">Curated for you</p>
                <h2 className="mt-1 text-2xl font-semibold">Popular Tour Packages</h2>
              </div>
              <Link href="/tours" className="text-sm font-medium text-stone-500 hover:text-accent hover:underline">
                View all
              </Link>
            </div>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {popularPackages.map((tourPackage) => (
                <li key={tourPackage.id}>
                  <PackageCard
                    slug={tourPackage.slug}
                    name={tourPackage.name}
                    durationDays={tourPackage.durationDays}
                    destinationName={tourPackage.destination?.name}
                    coverImageUrl={tourPackage.coverImageUrl}
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* Popular destinations */}
      {popularDestinations.length > 0 ? (
        <section className="bg-stone-50 px-6 py-16 sm:py-20 dark:bg-stone-950/40">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">Where to go</p>
                <h2 className="mt-1 text-2xl font-semibold">Popular Destinations</h2>
              </div>
              <Link href="/destinations" className="text-sm font-medium text-stone-500 hover:text-accent hover:underline">
                View all
              </Link>
            </div>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {popularDestinations.map((destination) => (
                <li key={destination.id}>
                  <DestinationCard
                    slug={destination.slug}
                    name={destination.name}
                    location={destination.location}
                    imageUrl={destination.images[0]?.url}
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* Travel categories */}
      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">Browse by interest</p>
          <h2 className="mt-1 mb-8 text-2xl font-semibold">Travel Categories</h2>
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {Object.entries(travelTypeLabels).map(([value, label]) => (
              <li key={value}>
                <Link
                  href={`/tours?travelType=${value}`}
                  className="group flex h-24 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/10 to-amber-100/40 text-center text-sm font-semibold text-stone-800 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:from-accent/10 dark:to-stone-800 dark:text-stone-100"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Why Sri Lanka */}
      <section className="bg-stone-50 px-6 py-16 sm:py-20 dark:bg-stone-950/40">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">The island</p>
          <h2 className="mt-1 mb-10 text-2xl font-semibold">Why Sri Lanka</h2>
          <ul className="grid gap-8 sm:grid-cols-2">
            {whySriLanka.map((item, index) => (
              <li key={item.title} className="flex gap-4 border-l-2 border-accent/40 pl-5">
                <span className="text-3xl font-semibold text-accent/30 tabular-nums">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="mt-1 max-w-sm text-sm text-stone-600 dark:text-stone-400">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Call to action */}
      <section className="relative overflow-hidden px-6 py-20 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/15 via-background to-amber-100/30 dark:from-accent/10 dark:via-background dark:to-accent/5" />
        <div className="relative mx-auto max-w-md">
          <h2 className="text-2xl font-semibold text-balance sm:text-3xl">Ready to plan your Sri Lanka trip?</h2>
          <p className="mt-3 text-stone-600 dark:text-stone-400">
            Browse our curated tours or send us an enquiry and we&apos;ll help you plan the journey.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href="/tours">
              <Button>Explore Tours</Button>
            </Link>
            <Link href="/enquiry">
              <Button variant="secondary">Send an Enquiry</Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
