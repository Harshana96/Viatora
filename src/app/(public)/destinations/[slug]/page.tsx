import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PlacesMap } from "@/components/map/PlacesMap";
import { getDestinationBySlug } from "@/server/destinations/actions";

export const dynamic = "force-dynamic";

export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);

  if (!destination) {
    notFound();
  }

  return (
    <main className="flex-1 px-6 py-12">
      <div className="mx-auto flex max-w-5xl flex-col gap-10">
        {destination.images.length > 0 ? (
          <Image
            src={destination.images[0].url}
            alt={destination.images[0].alt ?? destination.name}
            width={1200}
            height={480}
            className="h-64 w-full rounded-lg object-cover sm:h-80"
            priority
          />
        ) : null}
        <header>
          <h1 className="text-3xl font-semibold tracking-tight">{destination.name}</h1>
          <p className="mt-1 text-sm font-medium text-stone-500">{destination.location}</p>
          <p className="mt-4 max-w-2xl text-stone-600 dark:text-stone-400">{destination.description}</p>
        </header>

        {destination.images.length > 1 ? (
          <section>
            <h2 className="mb-4 text-lg font-semibold">Gallery</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {destination.images.slice(1).map((image) => (
                <Image
                  key={image.id}
                  src={image.url}
                  alt={image.alt ?? destination.name}
                  width={300}
                  height={200}
                  className="h-32 w-full rounded-md object-cover"
                />
              ))}
            </div>
          </section>
        ) : null}

        {destination.thingsToDo.length > 0 ? (
          <section>
            <h2 className="mb-2 text-lg font-semibold">Things to do</h2>
            <ul className="list-disc pl-5 text-stone-600 dark:text-stone-400">
              {destination.thingsToDo.map((item, index) => (
                <li key={`${index}-${item}`}>{item}</li>
              ))}
            </ul>
          </section>
        ) : null}

        <section>
          <h2 className="mb-4 text-lg font-semibold">Map</h2>
          <div className="h-[320px] overflow-hidden rounded-lg">
            <PlacesMap
              places={destination.places.map((place) => ({
                id: place.id,
                name: place.name,
                latitude: place.latitude,
                longitude: place.longitude,
              }))}
            />
          </div>
        </section>

        {destination.places.length > 0 ? (
          <section>
            <h2 className="mb-4 text-lg font-semibold">Places to visit</h2>
            <ul className="grid gap-4 sm:grid-cols-2">
              {destination.places.map((place) => (
                <li key={place.id} className="rounded-lg border border-stone-200 p-4 dark:border-stone-800">
                  <p className="font-medium">{place.name}</p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-stone-500">{place.category}</p>
                  <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">{place.description}</p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {destination.packages.length > 0 ? (
          <section>
            <h2 className="mb-4 text-lg font-semibold">Related tour packages</h2>
            <ul className="grid gap-4 sm:grid-cols-2">
              {destination.packages.map((tourPackage) => (
                <li key={tourPackage.id}>
                  <Link
                    href={`/tours/${tourPackage.slug}`}
                    className="block rounded-lg border border-stone-200 p-4 transition-colors hover:border-stone-400 dark:border-stone-800 dark:hover:border-stone-600"
                  >
                    <p className="text-sm text-stone-500">{tourPackage.durationDays} days</p>
                    <p className="mt-1 text-lg font-semibold">{tourPackage.name}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </main>
  );
}
