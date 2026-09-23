import Link from "next/link";

import { DeleteButton } from "@/components/admin/DeleteButton";
import { Button } from "@/components/ui/button";
import { deleteGroupSizeRange, listGroupSizeRanges } from "@/server/group-size-ranges/actions";

export const dynamic = "force-dynamic";

export default async function AdminGroupSizesPage() {
  const groupSizeRanges = await listGroupSizeRanges();

  return (
    <main className="flex-1 px-6 py-16">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Group Size Ranges</h1>
          <p className="text-sm text-zinc-500">
            Used on the home page and in pricing rules. Not tied to frontend code — add or remove ranges here.
          </p>
        </div>
        <Link href="/admin/group-sizes/new">
          <Button>New range</Button>
        </Link>
      </div>
      {groupSizeRanges.length === 0 ? (
        <p className="text-zinc-600 dark:text-zinc-400">No group size ranges yet.</p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800">
              <th className="py-2">Label</th>
              <th className="py-2">Range</th>
              <th className="py-2">Order</th>
              <th className="py-2" />
            </tr>
          </thead>
          <tbody>
            {groupSizeRanges.map((range) => (
              <tr key={range.id} className="border-b border-zinc-100 dark:border-zinc-900">
                <td className="py-2">{range.label}</td>
                <td className="py-2 text-zinc-500">
                  {range.minSize}
                  {range.maxSize ? `–${range.maxSize}` : "+"}
                </td>
                <td className="py-2 text-zinc-500">{range.order}</td>
                <td className="py-2 text-right">
                  <DeleteButton action={deleteGroupSizeRange} id={range.id} label={range.label} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
