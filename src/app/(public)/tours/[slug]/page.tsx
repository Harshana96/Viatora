import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JourneyExplorer } from "@/components/itinerary/JourneyExplorer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { listHotelsByIds } from "@/server/hotels/actions";
import { fetchDrivingRoute } from "@/lib/mapbox";
import { formatCurrency } from "@/lib/utils";
import { monthName, monthOptions } from "@/lib/months";
import { listGroupSizeRanges } from "@/server/group-size-ranges/actions";
import { getEstimatedTotal } from "@/server/pricing/engine";
import { getPackageBySlug } from "@/server/tours/actions";
import type { JourneyDay } from "@/types";

export const dynamic = "force-dynamic";

export default async function TourPackagePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ groupSize?: string; month?: string }>;
}) {
  const { slug } = await params;
  const { groupSize, month } = await searchParams;
  const tourPackage = await getPackageBySlug(slug);

  if (!tourPackage) {
    notFound();
  }

  const groupSizeRanges = await listGroupSizeRanges();

  const monthNumber = month ? Number(month) : undefined;
  const estimate =
    groupSize && monthNumber
      ? await getEstimatedTotal({ packageId: tourPackage.id, groupSizeRangeId: groupSize, month: monthNumber })
      : null;

  const hotelIds = Array.from(
    new Set(
      tourPackage.days.flatMap((day) => [day.hotelId, ...day.alternativeHotelIds].filter((id): id is string => Boolean(id))),
    ),
  );
  const hotels = await listHotelsByIds(hotelIds);
  const hotelMap = new Map(hotels.map((hotel) => [hotel.id, hotel]));

  const journeyDays: JourneyDay[] = tourPackage.days.map((day) => ({
    id: day.id,
    dayNumber: day.dayNumber,
    title: day.title,
    description: day.description,
    hotelName: day.hotel?.name ?? null,
    hotelOptions: [day.hotelId, ...day.alternativeHotelIds]
      .filter((id): id is string => Boolean(id))
      .map((id) => hotelMap.get(id))
      .filter((hotel): hotel is NonNullable<typeof hotel> => Boolean(hotel))
      .map((hotel) => ({ id: hotel.id, name: hotel.name, location: hotel.location, rating: hotel.rating })),
    optionalActivities: day.optionalActivities,
    places: day.places.map((dayPlace) => ({
      id: dayPlace.place.id,
      name: dayPlace.place.name,
      latitude: dayPlace.place.latitude,
      longitude: dayPlace.place.longitude,
      activities: dayPlace.activities,
    })),
  }));

  const dayPoints = journeyDays.map((day) => day.places[0]).filter((place) => Boolean(place)) as JourneyDay["places"];
  const route = await fetchDrivingRoute(dayPoints);

  const uniqueDestinations = new Set(
    tourPackage.days.flatMap((day) => day.places.map((dayPlace) => dayPlace.place.name)),
  );
  const includedActivities = Array.from(new Set(tourPackage.days.flatMap((day) => day.places.flatMap((p) => p.activities))));
  const optionalActivities = Array.from(new Set(tourPackage.days.flatMap((day) => day.optionalActivities)));

  const enquiryParams = new URLSearchParams({ package: tourPackage.id });
  if (groupSize) enquiryParams.set("groupSize", groupSize);
  if (month) enquiryParams.set("month", month);
  if (estimate) enquiryParams.set("estimatedTotal", String(estimate.pricePerPerson));

  return (
    <main className="flex-1 px-6 py-12">
      <div className="mx-auto flex max-w-5xl flex-col gap-10">
        {tourPackage.coverImageUrl ? (
          <Image
            src={tourPackage.coverImageUrl}
            alt={tourPackage.name}
            width={1200}
            height={480}
            className="h-64 w-full rounded-lg object-cover sm:h-80"
            priority
          />
        ) : null}

        {/* Hero */}
        <header>
          <p className="text-sm font-medium text-zinc-500">
            {tourPackage.durationDays - 1} nights / {tourPackage.durationDays} days
            {" · "}
            {uniqueDestinations.size} destinations
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">{tourPackage.name}</h1>
          <p className="mt-4 max-w-2xl text-zinc-600 dark:text-zinc-400">{tourPackage.description}</p>
        </header>

        {tourPackage.highlights.length > 0 ? (
          <section>
            <h2 className="mb-2 text-lg font-semibold">Highlights</h2>
            <ul className="list-disc pl-5 text-zinc-600 dark:text-zinc-400">
              {tourPackage.highlights.map((highlight, index) => (
                <li key={`${index}-${highlight}`}>{highlight}</li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* Journey exploration: map + day-by-day */}
        <section>
          <h2 className="mb-4 text-lg font-semibold">Explore the Journey</h2>
          <JourneyExplorer days={journeyDays} route={route} />
        </section>

        {tourPackage.images.length > 0 ? (
          <section>
            <h2 className="mb-4 text-lg font-semibold">Gallery</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {tourPackage.images.map((image) => (
                <Image
                  key={image.id}
                  src={image.url}
                  alt={image.alt ?? tourPackage.name}
                  width={300}
                  height={200}
                  className="h-32 w-full rounded-md object-cover"
                />
              ))}
            </div>
          </section>
        ) : null}

        {/* Full tour package */}
        <section className="border-t border-zinc-200 pt-8 dark:border-zinc-800">
          <h2 className="mb-6 text-2xl font-semibold">Full Tour Package</h2>

          {/* Hotels */}
          {journeyDays.some((day) => day.hotelOptions.length > 0) ? (
            <div className="mb-8">
              <h3 className="mb-1 text-lg font-semibold">Your Accommodation Options</h3>
              <p className="mb-4 text-sm text-zinc-500">
                Hotel selection does not guarantee live availability. Final availability is confirmed by our
                team after your enquiry — if your preferred hotel isn&apos;t available, we&apos;ll arrange a
                listed alternative.
              </p>
              <div className="flex flex-col gap-4">
                {journeyDays
                  .filter((day) => day.hotelOptions.length > 0)
                  .map((day) => (
                    <div key={day.id}>
                      <p className="text-sm font-medium text-zinc-500">
                        Day {day.dayNumber}
                        {day.places[0] ? ` · ${day.places[0].name}` : ""}
                      </p>
                      <div className="mt-1 flex flex-col gap-1">
                        {day.hotelOptions.map((hotel, index) => (
                          <label key={hotel.id} className="flex items-center gap-2 text-sm">
                            <input type="radio" name={`hotel-${day.id}`} defaultChecked={index === 0} />
                            {hotel.name}
                            {hotel.rating ? <span className="text-zinc-400">· {hotel.rating}★</span> : null}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ) : null}

          {/* Activities */}
          {includedActivities.length > 0 || optionalActivities.length > 0 ? (
            <div className="mb-8 grid gap-6 sm:grid-cols-2">
              {includedActivities.length > 0 ? (
                <div>
                  <h3 className="mb-2 text-lg font-semibold">Included Activities</h3>
                  <ul className="flex flex-col gap-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {includedActivities.map((activity, index) => (
                      <li key={index}>✓ {activity}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {optionalActivities.length > 0 ? (
                <div>
                  <h3 className="mb-2 text-lg font-semibold">Optional / Available</h3>
                  <ul className="flex flex-col gap-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {optionalActivities.map((activity, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <input type="checkbox" /> {activity}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : null}

          {/* Includes / excludes */}
          {tourPackage.included.length > 0 || tourPackage.excluded.length > 0 ? (
            <div className="mb-8 grid gap-6 sm:grid-cols-2">
              {tourPackage.included.length > 0 ? (
                <div>
                  <h3 className="mb-2 text-lg font-semibold">What&apos;s included</h3>
                  <ul className="list-disc pl-5 text-zinc-600 dark:text-zinc-400">
                    {tourPackage.included.map((item, index) => (
                      <li key={`${index}-${item}`}>{item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {tourPackage.excluded.length > 0 ? (
                <div>
                  <h3 className="mb-2 text-lg font-semibold">Not included</h3>
                  <ul className="list-disc pl-5 text-zinc-600 dark:text-zinc-400">
                    {tourPackage.excluded.map((item, index) => (
                      <li key={`${index}-${item}`}>{item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : null}

          {tourPackage.importantInfo.length > 0 ? (
            <div className="mb-8">
              <h3 className="mb-2 text-lg font-semibold">Important Information</h3>
              <ul className="list-disc pl-5 text-sm text-zinc-600 dark:text-zinc-400">
                {tourPackage.importantInfo.map((item, index) => (
                  <li key={`${index}-${item}`}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* Estimated total */}
          <div className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
            <h3 className="mb-3 text-lg font-semibold">Your Estimated Total</h3>
            <form className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="flex-1">
                <Label htmlFor="groupSize">Group size</Label>
                <Select id="groupSize" name="groupSize" defaultValue={groupSize ?? ""}>
                  <option value="">Select group size</option>
                  {groupSizeRanges.map((range) => (
                    <option key={range.id} value={range.id}>
                      {range.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="flex-1">
                <Label htmlFor="month">Arrival month</Label>
                <Select id="month" name="month" defaultValue={month ?? ""}>
                  <option value="">Select month</option>
                  {monthOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>
              <Button type="submit" variant="secondary">
                Update estimate
              </Button>
            </form>

            <div className="mt-4 border-t border-zinc-200 pt-4 text-center dark:border-zinc-800">
              {estimate ? (
                <>
                  <p className="text-sm text-zinc-500">
                    Estimated Total · {monthName(monthNumber ?? 0)}
                  </p>
                  <p className="text-3xl font-semibold">{formatCurrency(estimate.pricePerPerson)} / person</p>
                </>
              ) : groupSize || month ? (
                <p className="text-sm text-zinc-500">
                  Pricing isn&apos;t configured yet for that combination — select a different group size or
                  month, or send an enquiry and we&apos;ll quote you directly.
                </p>
              ) : (
                <p className="text-sm text-zinc-500">
                  Select your group size and arrival month above to see your estimated total per person.
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link
              href={`/enquiry?${enquiryParams.toString()}`}
              className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Request This Trip
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
