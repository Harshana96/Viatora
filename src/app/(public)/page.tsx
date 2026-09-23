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
    description: "Beaches, hill country tea plantations, rainforest and ancient cities, all within a few hours' drive of each other.",
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
      {/* Hero */}
      <section className="flex flex-col items-center gap-4 px-6 py-24 text-center">
        <h1 className="text-4xl font-semibold tracking-tight">Viatora</h1>
        <p className="max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
          Discover Sri Lanka, understand the complete journey visually, and enquire about a tour.
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <Link href="/tours">
            <Button>Explore Tours</Button>
          </Link>
          <Link href="/destinations">
            <Button variant="secondary">Browse Destinations</Button>
          </Link>
        </div>
      </section>

      {/* Search / discover tours */}
      <section className="border-t border-zinc-200 px-6 py-12 dark:border-zinc-800">
        <div className="mx-auto max-w-xl">
          <h2 className="text-center text-lg font-semibold">Find your next trip</h2>
          <form action="/tours" className="mt-4 flex gap-2">
            <Input name="query" placeholder="Search tours, e.g. 'hill country'" className="flex-1" />
            <Button type="submit">Search</Button>
          </form>
        </div>
      </section>

      {/* Popular tour packages */}
      {popularPackages.length > 0 ? (
        <section className="border-t border-zinc-200 px-6 py-12 dark:border-zinc-800">
          <div className="mx-auto max-w-6xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Popular Tour Packages</h2>
              <Link href="/tours" className="text-sm font-medium text-zinc-500 hover:underline">
                View all
              </Link>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
        <section className="border-t border-zinc-200 px-6 py-12 dark:border-zinc-800">
          <div className="mx-auto max-w-6xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Popular Destinations</h2>
              <Link href="/destinations" className="text-sm font-medium text-zinc-500 hover:underline">
                View all
              </Link>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
      <section className="border-t border-zinc-200 px-6 py-12 dark:border-zinc-800">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-6 text-xl font-semibold">Travel Categories</h2>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Object.entries(travelTypeLabels).map(([value, label]) => (
              <li key={value}>
                <Link
                  href={`/tours?travelType=${value}`}
                  className="flex h-20 items-center justify-center rounded-lg border border-zinc-200 text-center text-sm font-medium transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Why Sri Lanka */}
      <section className="border-t border-zinc-200 px-6 py-12 dark:border-zinc-800">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-6 text-xl font-semibold">Why Sri Lanka</h2>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whySriLanka.map((item) => (
              <li key={item.title}>
                <p className="font-semibold">{item.title}</p>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{item.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Call to action */}
      <section className="border-t border-zinc-200 px-6 py-16 text-center dark:border-zinc-800">
        <h2 className="text-2xl font-semibold">Ready to plan your Sri Lanka trip?</h2>
        <p className="mx-auto mt-2 max-w-md text-zinc-600 dark:text-zinc-400">
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
      </section>
    </main>
  );
}
