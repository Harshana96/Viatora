import Link from "next/link";

import { DeleteButton } from "@/components/admin/DeleteButton";
import { Button } from "@/components/ui/button";
import { deletePackage, listPackages, togglePublish } from "@/server/tours/actions";

export const dynamic = "force-dynamic";

export default async function AdminToursPage() {
  const packages = await listPackages();

  return (
    <main className="flex-1 px-6 py-16">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Tour Packages</h1>
        <Link href="/admin/tours/new">
          <Button>New package</Button>
        </Link>
      </div>
      {packages.length === 0 ? (
        <p className="text-stone-600 dark:text-stone-400">No tour packages yet.</p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-stone-200 dark:border-stone-800">
              <th className="py-2">Name</th>
              <th className="py-2">Duration</th>
              <th className="py-2">Destination</th>
              <th className="py-2">Status</th>
              <th className="py-2" />
            </tr>
          </thead>
          <tbody>
            {packages.map((tourPackage) => (
              <tr key={tourPackage.id} className="border-b border-stone-100 dark:border-stone-900">
                <td className="py-2">{tourPackage.name}</td>
                <td className="py-2">{tourPackage.durationDays} days</td>
                <td className="py-2">{tourPackage.destination?.name ?? "—"}</td>
                <td className="py-2">
                  <form action={togglePublish}>
                    <input type="hidden" name="id" value={tourPackage.id} />
                    <button
                      type="submit"
                      className={
                        tourPackage.published
                          ? "rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "rounded-full bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-600 dark:bg-stone-800 dark:text-stone-400"
                      }
                    >
                      {tourPackage.published ? "Published" : "Draft"}
                    </button>
                  </form>
                </td>
                <td className="py-2">
                  <div className="flex items-center gap-4">
                    <Link
                      href={`/admin/tours/${tourPackage.id}/itinerary`}
                      className="text-sm font-medium text-stone-900 hover:underline dark:text-stone-50"
                    >
                      Itinerary
                    </Link>
                    <Link
                      href={`/admin/tours/${tourPackage.id}/edit`}
                      className="text-sm font-medium text-stone-900 hover:underline dark:text-stone-50"
                    >
                      Edit
                    </Link>
                    <DeleteButton action={deletePackage} id={tourPackage.id} label={tourPackage.name} />
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
