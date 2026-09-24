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
    <main className="flex-1">
      <div className="mx-auto max-w-7xl px-4 pt-8 pb-24 sm:px-6 sm:pt-14 lg:px-8">
        <div className="mb-10 border-b border-parchment-200 pb-4">
          <div className="mb-1 text-[11px] font-semibold tracking-[0.2em] text-accent uppercase">
            Handcrafted Itineraries
          </div>
          <h1 className="font-editorial text-4xl font-medium text-foreground sm:text-5xl">Curated Expeditions</h1>
        </div>

        <form className="mb-4 flex flex-wrap items-end gap-4 border border-parchment-300 bg-surface p-5">
          <div className="min-w-[180px] flex-1">
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
          <div className="min-w-[180px] flex-1">
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
            <Link href="/tours" className="text-xs font-medium tracking-wider text-muted uppercase hover:text-foreground">
              Clear
            </Link>
          ) : null}
        </form>

        {!canPrice ? (
          <p className="mb-8 text-xs font-light text-muted">
            Select a group size and arrival month above to see the estimated price for each journey.
          </p>
        ) : (
          <div className="mb-8" />
        )}

        {packages.length === 0 ? (
          <p className="text-muted">No tour packages available.</p>
        ) : (
          <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
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
      </div>
    </main>
  );
}
