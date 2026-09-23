import Link from "next/link";

import { Button } from "@/components/ui/button";
import { listHotels } from "@/server/hotels/actions";

export const dynamic = "force-dynamic";

export default async function AdminHotelsPage() {
  const hotels = await listHotels();

  return (
    <main className="flex-1 px-6 py-16">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Hotels</h1>
        <Link href="/admin/hotels/new">
          <Button>New hotel</Button>
        </Link>
      </div>
      {hotels.length === 0 ? (
        <p className="text-zinc-600 dark:text-zinc-400">No hotels yet.</p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800">
              <th className="py-2">Name</th>
              <th className="py-2">Location</th>
              <th className="py-2">Rating</th>
            </tr>
          </thead>
          <tbody>
            {hotels.map((hotel) => (
              <tr key={hotel.id} className="border-b border-zinc-100 dark:border-zinc-900">
                <td className="py-2">{hotel.name}</td>
                <td className="py-2">{hotel.location}</td>
                <td className="py-2 text-zinc-500">{hotel.rating ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
