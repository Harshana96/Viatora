import Link from "next/link";

import { PackageCard } from "@/components/tours/PackageCard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { monthOptions } from "@/lib/months";
import { listGroupSizeRanges } from "@/server/group-size-ranges/actions";
import { getEstimatedTotal } from "@/server/pricing/engine";
import { listPublishedPackages } from "@/server/tours/actions";

export const dynamic = "force-dynamic";

type SearchParams = {
  groupSize?: string;
  month?: string;
};

export default async function ToursPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const [packages, groupSizeRanges] = await Promise.all([listPublishedPackages(), listGroupSizeRanges()]);

  const hasFilters = Boolean(params.groupSize || params.month);

  const journeyParams = new URLSearchParams();
  if (params.groupSize) journeyParams.set("groupSize", params.groupSize);
  if (params.month) journeyParams.set("month", params.month);
  const journeyQuery = journeyParams.toString();

  const monthNumber = params.month ? Number(params.month) : undefined;
  const canPrice = Boolean(params.groupSize && monthNumber);

  const packagesWithPrice = await Promise.all(
    packages.map(async (tourPackage) => {
      const estimate = canPrice
        ? await getEstimatedTotal({ packageId: tourPackage.id, groupSizeRangeId: params.groupSize!, month: monthNumber! })
        : null;
      return { tourPackage, pricePerPerson: estimate?.pricePerPerson ?? null };
    }),
  );

  return (
    <main className="flex-1 px-6 py-16">
      <h1 className="text-2xl font-semibold">Tour Packages</h1>

      <form className="mt-6 flex flex-wrap items-end gap-4">
        <div>
          <Label htmlFor="groupSize">Group size</Label>
          <Select id="groupSize" name="groupSize" defaultValue={params.groupSize ?? ""}>
            <option value="">Any group size</option>
            {groupSizeRanges.map((range) => (
              <option key={range.id} value={range.id}>
                {range.label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="month">Arrival month</Label>
          <Select id="month" name="month" defaultValue={params.month ?? ""}>
            <option value="">Any month</option>
            {monthOptions.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </Select>
        </div>
        <Button type="submit">Apply</Button>
        {hasFilters ? (
          <Link href="/tours" className="text-sm font-medium text-zinc-500 hover:underline">
            Clear
          </Link>
        ) : null}
      </form>

      {!canPrice ? (
        <p className="mt-4 text-sm text-zinc-500">
          Select a group size and arrival month above to see the estimated price for each journey.
        </p>
      ) : null}

      {packages.length === 0 ? (
        <p className="mt-8 text-zinc-600 dark:text-zinc-400">No tour packages available.</p>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {packagesWithPrice.map(({ tourPackage, pricePerPerson }) => (
            <li key={tourPackage.id}>
              <PackageCard
                slug={tourPackage.slug}
                name={tourPackage.name}
                durationDays={tourPackage.durationDays}
                destinationName={tourPackage.destination?.name}
                coverImageUrl={tourPackage.coverImageUrl}
                pricePerPerson={pricePerPerson}
                query={journeyQuery}
              />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
