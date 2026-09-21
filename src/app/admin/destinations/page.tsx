import Link from "next/link";

import { DeleteButton } from "@/components/admin/DeleteButton";
import { Button } from "@/components/ui/button";
import { deleteDestination, listDestinations } from "@/server/destinations/actions";

export const dynamic = "force-dynamic";

export default async function AdminDestinationsPage() {
  const destinations = await listDestinations();

  return (
    <main className="flex-1 px-6 py-16">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Destinations</h1>
        <Link href="/admin/destinations/new">
          <Button>New destination</Button>
        </Link>
      </div>
      {destinations.length === 0 ? (
        <p className="text-stone-600 dark:text-stone-400">No destinations yet.</p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-stone-200 dark:border-stone-800">
              <th className="py-2">Name</th>
              <th className="py-2">Location</th>
              <th className="py-2">Slug</th>
              <th className="py-2" />
            </tr>
          </thead>
          <tbody>
            {destinations.map((destination) => (
              <tr key={destination.id} className="border-b border-stone-100 dark:border-stone-900">
                <td className="py-2">{destination.name}</td>
                <td className="py-2">{destination.location}</td>
                <td className="py-2 text-stone-500">{destination.slug}</td>
                <td className="py-2">
                  <div className="flex items-center gap-4">
                    <Link
                      href={`/admin/destinations/${destination.id}/edit`}
                      className="text-sm font-medium text-stone-900 hover:underline dark:text-stone-50"
                    >
                      Edit
                    </Link>
                    <DeleteButton action={deleteDestination} id={destination.id} label={destination.name} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
