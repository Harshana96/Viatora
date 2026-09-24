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
    <main className="flex-1">
      <div className="mx-auto max-w-5xl space-y-16 px-4 pt-8 pb-24 sm:px-6 sm:pt-14 lg:px-8">
        {destination.images.length > 0 ? (
          <div className="relative h-72 w-full overflow-hidden bg-parchment-200 sm:h-96">
            <Image
              src={destination.images[0].url}
              alt={destination.images[0].alt ?? destination.name}
              width={1400}
              height={600}
              className="h-full w-full object-cover"
              priority
            />
          </div>
        ) : null}

        <header>
          <p className="text-[11px] tracking-[0.2em] text-ceylon-tea uppercase">{destination.location}</p>
          <h1 className="font-editorial mt-2 text-4xl font-medium text-foreground sm:text-5xl">
            {destination.name}
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed font-light text-muted">{destination.description}</p>
        </header>

        {destination.images.length > 1 ? (
          <section>
            <h2 className="font-editorial mb-4 text-2xl text-foreground">Gallery</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {destination.images.slice(1).map((image) => (
                <Image
                  key={image.id}
                  src={image.url}
                  alt={image.alt ?? destination.name}
                  width={300}
                  height={200}
                  className="h-32 w-full object-cover"
                />
              ))}
            </div>
          </section>
        ) : null}

        {destination.thingsToDo.length > 0 ? (
          <section>
            <h2 className="font-editorial mb-4 text-2xl text-foreground">Things to Do</h2>
            <div className="grid grid-cols-1 gap-2.5 text-sm text-foreground sm:grid-cols-2">
              {destination.thingsToDo.map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section>
          <h2 className="font-editorial mb-4 text-2xl text-foreground">Map</h2>
          <div className="h-[320px] overflow-hidden border border-parchment-300">
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
            <h2 className="font-editorial mb-4 text-2xl text-foreground">Places to Visit</h2>
            <ul className="grid gap-4 sm:grid-cols-2">
              {destination.places.map((place) => (
                <li key={place.id} className="border border-parchment-300 bg-surface p-5">
                  <p className="font-editorial text-lg font-semibold text-foreground">{place.name}</p>
                  <p className="mt-1 font-mono text-[10px] tracking-wider text-muted uppercase">{place.category}</p>
                  <p className="mt-2 text-sm leading-relaxed font-light text-muted">{place.description}</p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {destination.packages.length > 0 ? (
          <section>
            <h2 className="font-editorial mb-4 text-2xl text-foreground">Related Journeys</h2>
            <ul className="grid gap-4 sm:grid-cols-2">
              {destination.packages.map((tourPackage) => (
                <li key={tourPackage.id}>
                  <Link
                    href={`/tours/${tourPackage.slug}`}
                    className="group block border border-parchment-300 bg-surface p-5 transition-all hover:border-foreground"
                  >
                    <p className="font-mono text-[10px] tracking-wider text-muted uppercase">
                      {tourPackage.durationDays - 1} nights / {tourPackage.durationDays} days
                    </p>
                    <p className="font-editorial mt-1 text-xl font-semibold text-foreground transition-colors group-hover:text-accent">
                      {tourPackage.name}
                    </p>
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
