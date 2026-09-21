import Link from "next/link";

import { DeleteButton } from "@/components/admin/DeleteButton";
import { Button } from "@/components/ui/button";
import { deletePlace, listPlaces } from "@/server/places/actions";

export const dynamic = "force-dynamic";

export default async function AdminPlacesPage() {
  const places = await listPlaces();

  return (
    <main className="flex-1 px-6 py-16">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Places</h1>
        <Link href="/admin/places/new">
          <Button>New place</Button>
        </Link>
      </div>
      {places.length === 0 ? (
        <p className="text-stone-600 dark:text-stone-400">No places yet.</p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-stone-200 dark:border-stone-800">
              <th className="py-2">Name</th>
              <th className="py-2">Category</th>
              <th className="py-2">Destination</th>
              <th className="py-2" />
            </tr>
          </thead>
          <tbody>
            {places.map((place) => (
              <tr key={place.id} className="border-b border-stone-100 dark:border-stone-900">
                <td className="py-2">{place.name}</td>
                <td className="py-2 text-stone-500">{place.category}</td>
                <td className="py-2">{place.destination.name}</td>
                <td className="py-2">
                  <div className="flex items-center gap-4">
                    <Link
                      href={`/admin/places/${place.id}/edit`}
                      className="text-sm font-medium text-stone-900 hover:underline dark:text-stone-50"
                    >
                      Edit
                    </Link>
                    <DeleteButton action={deletePlace} id={place.id} label={place.name} />
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
