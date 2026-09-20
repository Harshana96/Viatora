import Link from "next/link";

import { listDestinations } from "@/server/destinations/actions";

export const dynamic = "force-dynamic";

export default async function DestinationsPage() {
  const destinations = await listDestinations();

  return (
    <main className="flex-1 px-6 py-16">
      <h1 className="text-2xl font-semibold">Destinations</h1>
      {destinations.length === 0 ? (
        <p className="mt-4 text-zinc-600 dark:text-zinc-400">No destinations yet.</p>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((destination) => (
            <li key={destination.id}>
              <Link
                href={`/destinations/${destination.slug}`}
                className="block rounded-lg border border-zinc-200 p-4 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
              >
                <p className="text-sm text-zinc-500">{destination.location}</p>
                <p className="mt-1 text-lg font-semibold">{destination.name}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
