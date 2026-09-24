import { DestinationCard } from "@/components/destinations/DestinationCard";
import { listDestinations } from "@/server/destinations/actions";

export const dynamic = "force-dynamic";

export default async function DestinationsPage() {
  const destinations = await listDestinations();

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-7xl px-4 pt-8 pb-24 sm:px-6 sm:pt-14 lg:px-8">
        <div className="mb-10 border-b border-parchment-200 pb-4">
          <div className="mb-1 text-[11px] font-semibold tracking-[0.2em] text-accent uppercase">
            Geographic Journal
          </div>
          <h1 className="font-editorial text-4xl font-medium text-foreground sm:text-5xl">Island Waypoints</h1>
        </div>

        {destinations.length === 0 ? (
          <p className="text-muted">No destinations yet.</p>
        ) : (
          <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {destinations.map((destination) => (
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
        )}
      </div>
    </main>
  );
}
