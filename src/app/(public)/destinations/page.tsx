import { DestinationCard } from "@/components/destinations/DestinationCard";
import { listDestinations } from "@/server/destinations/actions";

export const dynamic = "force-dynamic";

export default async function DestinationsPage() {
  const destinations = await listDestinations();

  return (
    <main className="flex-1 px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">Explore</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Destinations</h1>
        {destinations.length === 0 ? (
          <p className="mt-8 text-stone-600 dark:text-stone-400">No destinations yet.</p>
        ) : (
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {destinations.map((destination) => (
              <li key={destination.id}>
                <DestinationCard slug={destination.slug} name={destination.name} location={destination.location} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
