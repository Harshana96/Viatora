import Link from "next/link";

import { DestinationCard } from "@/components/destinations/DestinationCard";
import { PackageCard } from "@/components/tours/PackageCard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { monthOptions } from "@/lib/months";
import { listPopularDestinations } from "@/server/destinations/actions";
import { listGroupSizeRanges } from "@/server/group-size-ranges/actions";
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
  const [popularPackages, popularDestinations, groupSizeRanges] = await Promise.all([
    listPublishedPackages({ take: 6 }),
    listPopularDestinations(6),
    listGroupSizeRanges(),
  ]);

  const routeStops = popularDestinations.slice(0, 5).map((destination) => destination.name);

  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="grid gap-16 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div>
            <p className="text-xs tracking-[0.2em] text-muted uppercase">Sri Lanka, planned simply</p>
            <h1 className="mt-4 font-serif text-5xl leading-[1.05] tracking-tight md:text-6xl">
              Your journey, without the guesswork.
            </h1>
            <p className="mt-5 max-w-md text-muted">
              Three curated routes through tea country, ancient cities and the coast. Tell us your group size
              and when you&apos;re arriving — see one clear price, never a stack of hidden line items.
            </p>

            <form
              action="/tours"
              className="mt-8 flex flex-col gap-4 border-y border-border py-6 sm:flex-row sm:items-end"
            >
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
                Explore my journey
              </Button>
            </form>

            <Link href="/destinations" className="mt-4 inline-block text-sm text-muted hover:text-foreground">
              or browse every destination →
            </Link>
          </div>

          {routeStops.length > 0 ? (
            <div className="hidden md:block">
              <p className="mb-6 text-xs tracking-[0.2em] text-muted uppercase">A sample route</p>
              <div className="flex flex-col gap-7 border-l border-dashed border-border pl-6">
                {routeStops.map((stop, index) => (
                  <div key={stop} className="relative">
                    <span className="absolute top-1.5 -left-[29px] h-2 w-2 rounded-full bg-accent" />
                    <p className="text-xs text-muted">{index === 0 ? "Day 1" : `Day ${index * 2}`}</p>
                    <p className="font-serif text-xl">{stop}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* Popular tour packages */}
      {popularPackages.length > 0 ? (
        <section className="border-t border-border">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="mb-10 flex items-end justify-between">
              <h2 className="font-serif text-3xl">Curated journeys</h2>
              <Link href="/tours" className="text-sm text-muted hover:text-foreground">
                View all →
              </Link>
            </div>
            <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
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
        <section className="border-t border-border">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="mb-10 flex items-end justify-between">
              <h2 className="font-serif text-3xl">Along the way</h2>
              <Link href="/destinations" className="text-sm text-muted hover:text-foreground">
                View all →
              </Link>
            </div>
            <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
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

      {/* Why Sri Lanka */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="mb-10 font-serif text-3xl">Why Sri Lanka</h2>
          <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
            {whySriLanka.map((item, index) => (
              <div key={item.title} className="flex gap-5">
                <span className="font-serif text-2xl text-accent">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="mt-1 text-sm text-muted">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <h2 className="font-serif text-3xl">Ready to plan your trip?</h2>
          <p className="mx-auto mt-3 max-w-md text-muted">
            Browse our curated journeys or send us an enquiry and we&apos;ll help you plan the rest.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/tours">
              <Button>Explore tours</Button>
            </Link>
            <Link href="/enquiry">
              <Button variant="secondary">Send an enquiry</Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
