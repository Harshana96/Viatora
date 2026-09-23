import Link from "next/link";

import { DeleteButton } from "@/components/admin/DeleteButton";
import { Button } from "@/components/ui/button";
import { deleteSeason, listSeasons } from "@/server/seasons/actions";

export const dynamic = "force-dynamic";

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export default async function AdminSeasonsPage() {
  const seasons = await listSeasons();

  return (
    <main className="flex-1 px-6 py-16">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Seasons</h1>
          <p className="text-sm text-zinc-500">
            The arrival month a traveller picks is matched against these months to determine pricing.
          </p>
        </div>
        <Link href="/admin/seasons/new">
          <Button>New season</Button>
        </Link>
      </div>
      {seasons.length === 0 ? (
        <p className="text-zinc-600 dark:text-zinc-400">No seasons yet.</p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800">
              <th className="py-2">Name</th>
              <th className="py-2">Months</th>
              <th className="py-2" />
            </tr>
          </thead>
          <tbody>
            {seasons.map((season) => (
              <tr key={season.id} className="border-b border-zinc-100 dark:border-zinc-900">
                <td className="py-2">{season.name}</td>
                <td className="py-2 text-zinc-500">
                  {season.months
                    .slice()
                    .sort((a, b) => a - b)
                    .map((month) => monthNames[month - 1])
                    .join(", ")}
                </td>
                <td className="py-2 text-right">
                  <DeleteButton action={deleteSeason} id={season.id} label={season.name} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
