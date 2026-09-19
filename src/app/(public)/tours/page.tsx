import Link from "next/link";

import { listPublishedPackages } from "@/server/tours/actions";

export const dynamic = "force-dynamic";

export default async function ToursPage() {
  const packages = await listPublishedPackages();

  return (
    <main className="flex-1 px-6 py-16">
      <h1 className="text-2xl font-semibold">Tour Packages</h1>
      {packages.length === 0 ? (
        <p className="mt-4 text-zinc-600 dark:text-zinc-400">No tour packages published yet.</p>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((tourPackage) => (
            <li key={tourPackage.id}>
              <Link
                href={`/tours/${tourPackage.slug}`}
                className="block rounded-lg border border-zinc-200 p-4 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
              >
                <p className="text-sm text-zinc-500">
                  {tourPackage.durationDays} days
                  {tourPackage.destination ? ` · ${tourPackage.destination.name}` : ""}
                </p>
                <p className="mt-1 text-lg font-semibold">{tourPackage.name}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
