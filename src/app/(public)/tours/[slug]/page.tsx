import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JourneyExplorer } from "@/components/itinerary/JourneyExplorer";
import { fetchDrivingRoute } from "@/lib/mapbox";
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

  const dayPoints = journeyDays.map((day) => day.places[0]).filter((place) => Boolean(place)) as JourneyDay["places"];
  const route = await fetchDrivingRoute(dayPoints);

  return (
    <main className="flex-1 px-6 py-12">
      <div className="mx-auto flex max-w-5xl flex-col gap-10">
        {tourPackage.coverImageUrl ? (
          <Image
            src={tourPackage.coverImageUrl}
            alt={tourPackage.name}
            width={1200}
            height={480}
            className="h-64 w-full rounded-lg object-cover sm:h-80"
            priority
          />
        ) : null}
        <header>
          <p className="text-sm font-medium text-stone-500">
            {tourPackage.durationDays} days
            {tourPackage.destination ? ` · ${tourPackage.destination.name}` : ""}
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">{tourPackage.name}</h1>
          {tourPackage.startingPrice ? (
            <p className="mt-2 text-lg text-stone-700 dark:text-stone-300">
              From {formatCurrency(Number(tourPackage.startingPrice))}
            </p>
          ) : null}
          <p className="mt-4 max-w-2xl text-stone-600 dark:text-stone-400">{tourPackage.description}</p>
        </header>

        {tourPackage.highlights.length > 0 ? (
          <section>
            <h2 className="mb-2 text-lg font-semibold">Highlights</h2>
            <ul className="list-disc pl-5 text-stone-600 dark:text-stone-400">
              {tourPackage.highlights.map((highlight, index) => (
                <li key={`${index}-${highlight}`}>{highlight}</li>
              ))}
            </ul>
          </section>
        ) : null}

        <section>
          <h2 className="mb-4 text-lg font-semibold">Journey</h2>
          <JourneyExplorer days={journeyDays} route={route} />
        </section>

        {tourPackage.images.length > 0 ? (
          <section>
            <h2 className="mb-4 text-lg font-semibold">Gallery</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {tourPackage.images.map((image) => (
                <Image
                  key={image.id}
                  src={image.url}
                  alt={image.alt ?? tourPackage.name}
                  width={300}
                  height={200}
                  className="h-32 w-full rounded-md object-cover"
                />
              ))}
            </div>
          </section>
        ) : null}

        {tourPackage.included.length > 0 || tourPackage.excluded.length > 0 ? (
          <section className="grid gap-6 sm:grid-cols-2">
            {tourPackage.included.length > 0 ? (
              <div>
                <h2 className="mb-2 text-lg font-semibold">What&apos;s included</h2>
                <ul className="list-disc pl-5 text-stone-600 dark:text-stone-400">
                  {tourPackage.included.map((item, index) => (
                    <li key={`${index}-${item}`}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {tourPackage.excluded.length > 0 ? (
              <div>
                <h2 className="mb-2 text-lg font-semibold">Not included</h2>
                <ul className="list-disc pl-5 text-stone-600 dark:text-stone-400">
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
            className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground shadow-sm shadow-accent/20 transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0 active:scale-[0.98]"
          >
            Enquire about this tour
          </Link>
        </div>
      </div>
    </main>
  );
}
