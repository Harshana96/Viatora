import Link from "next/link";
import { notFound } from "next/navigation";

import { JourneyExplorer } from "@/components/itinerary/JourneyExplorer";
import { formatCurrency } from "@/lib/utils";
import { getPackageBySlug } from "@/server/tours/actions";
import type { JourneyDay } from "@/types";

export const dynamic = "force-dynamic";

export default async function TourPackagePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tourPackage = await getPackageBySlug(slug);

  if (!tourPackage) {
    notFound();
  }

  const journeyDays: JourneyDay[] = tourPackage.days.map((day) => ({
    id: day.id,
    dayNumber: day.dayNumber,
    title: day.title,
    description: day.description,
    hotelName: day.hotel?.name ?? null,
    places: day.places.map((dayPlace) => ({
      id: dayPlace.place.id,
      name: dayPlace.place.name,
      latitude: dayPlace.place.latitude,
      longitude: dayPlace.place.longitude,
      activities: dayPlace.activities,
    })),
  }));

  return (
    <main className="flex-1 px-6 py-12">
      <div className="mx-auto flex max-w-5xl flex-col gap-10">
        <header>
          <p className="text-sm font-medium text-zinc-500">
            {tourPackage.durationDays} days
            {tourPackage.destination ? ` · ${tourPackage.destination.name}` : ""}
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">{tourPackage.name}</h1>
          {tourPackage.startingPrice ? (
            <p className="mt-2 text-lg text-zinc-700 dark:text-zinc-300">
              From {formatCurrency(Number(tourPackage.startingPrice))}
            </p>
          ) : null}
          <p className="mt-4 max-w-2xl text-zinc-600 dark:text-zinc-400">{tourPackage.description}</p>
        </header>

        {tourPackage.highlights.length > 0 ? (
          <section>
            <h2 className="mb-2 text-lg font-semibold">Highlights</h2>
            <ul className="list-disc pl-5 text-zinc-600 dark:text-zinc-400">
              {tourPackage.highlights.map((highlight, index) => (
                <li key={`${index}-${highlight}`}>{highlight}</li>
              ))}
            </ul>
          </section>
        ) : null}

        <section>
          <h2 className="mb-4 text-lg font-semibold">Journey</h2>
          <JourneyExplorer days={journeyDays} />
        </section>

        {tourPackage.included.length > 0 || tourPackage.excluded.length > 0 ? (
          <section className="grid gap-6 sm:grid-cols-2">
            {tourPackage.included.length > 0 ? (
              <div>
                <h2 className="mb-2 text-lg font-semibold">What&apos;s included</h2>
                <ul className="list-disc pl-5 text-zinc-600 dark:text-zinc-400">
                  {tourPackage.included.map((item, index) => (
                    <li key={`${index}-${item}`}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {tourPackage.excluded.length > 0 ? (
              <div>
                <h2 className="mb-2 text-lg font-semibold">Not included</h2>
                <ul className="list-disc pl-5 text-zinc-600 dark:text-zinc-400">
                  {tourPackage.excluded.map((item, index) => (
                    <li key={`${index}-${item}`}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </section>
        ) : null}

        <div>
          <Link
            href={`/enquiry?package=${tourPackage.id}`}
            className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Enquire about this tour
          </Link>
        </div>
      </div>
    </main>
  );
}
