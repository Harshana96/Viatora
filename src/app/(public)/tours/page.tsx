import { TravelType } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { travelTypeLabels } from "@/lib/travel-type";
import { listDestinationOptions } from "@/server/destinations/actions";
import type { BudgetBucket, DurationBucket } from "@/server/tours/actions";
import { listPublishedPackages } from "@/server/tours/actions";

export const dynamic = "force-dynamic";

const durationOptions: { value: DurationBucket; label: string }[] = [
  { value: "short", label: "1-3 days" },
  { value: "medium", label: "4-7 days" },
  { value: "long", label: "8+ days" },
];

const budgetOptions: { value: BudgetBucket; label: string }[] = [
  { value: "low", label: "Under $500" },
  { value: "mid", label: "$500 - $1,000" },
  { value: "high", label: "$1,000 - $2,000" },
  { value: "premium", label: "$2,000+" },
];

function isDurationBucket(value: string): value is DurationBucket {
  return value === "short" || value === "medium" || value === "long";
}

function isBudgetBucket(value: string): value is BudgetBucket {
  return value === "low" || value === "mid" || value === "high" || value === "premium";
}

function isTravelType(value: string): value is TravelType {
  return (Object.values(TravelType) as string[]).includes(value);
}

type SearchParams = {
  query?: string;
  destination?: string;
  travelType?: string;
  duration?: string;
  budget?: string;
};

export default async function ToursPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const destinations = await listDestinationOptions();

  const hasFilters = Boolean(
    params.query || params.destination || params.travelType || params.duration || params.budget,
  );

  const packages = await listPublishedPackages({
    query: params.query,
    destinationId: params.destination,
    travelType: params.travelType && isTravelType(params.travelType) ? params.travelType : undefined,
    duration: params.duration && isDurationBucket(params.duration) ? params.duration : undefined,
    budget: params.budget && isBudgetBucket(params.budget) ? params.budget : undefined,
  });

  return (
    <main className="flex-1 px-6 py-16">
      <h1 className="text-2xl font-semibold">Tour Packages</h1>

      <form className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Label htmlFor="query">Search</Label>
          <Input id="query" name="query" defaultValue={params.query ?? ""} placeholder="Search packages" />
        </div>
        <div>
          <Label htmlFor="destination">Destination</Label>
          <Select id="destination" name="destination" defaultValue={params.destination ?? ""}>
            <option value="">Any destination</option>
            {destinations.map((destination) => (
              <option key={destination.id} value={destination.id}>
                {destination.name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="duration">Duration</Label>
          <Select id="duration" name="duration" defaultValue={params.duration ?? ""}>
            <option value="">Any duration</option>
            {durationOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="travelType">Travel type</Label>
          <Select id="travelType" name="travelType" defaultValue={params.travelType ?? ""}>
            <option value="">Any type</option>
            {Object.entries(travelTypeLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="budget">Budget</Label>
          <Select id="budget" name="budget" defaultValue={params.budget ?? ""}>
            <option value="">Any budget</option>
            {budgetOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex items-end gap-4 lg:col-span-5">
          <Button type="submit">Apply filters</Button>
          {hasFilters ? (
            <Link href="/tours" className="text-sm font-medium text-zinc-500 hover:underline">
              Clear filters
            </Link>
          ) : null}
        </div>
      </form>

      {packages.length === 0 ? (
        <p className="mt-8 text-zinc-600 dark:text-zinc-400">No tour packages match your filters.</p>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((tourPackage) => (
            <li key={tourPackage.id}>
              <Link
                href={`/tours/${tourPackage.slug}`}
                className="block overflow-hidden rounded-lg border border-zinc-200 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
              >
                {tourPackage.coverImageUrl ? (
                  <Image
                    src={tourPackage.coverImageUrl}
                    alt={tourPackage.name}
                    width={400}
                    height={200}
                    className="h-36 w-full object-cover"
                  />
                ) : null}
                <div className="p-4">
                  <p className="text-sm text-zinc-500">
                    {tourPackage.durationDays} days
                    {tourPackage.destination ? ` · ${tourPackage.destination.name}` : ""}
                  </p>
                  <p className="mt-1 text-lg font-semibold">{tourPackage.name}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
