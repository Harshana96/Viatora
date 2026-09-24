import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JourneyExplorer } from "@/components/itinerary/JourneyExplorer";
import { ReviewsSection } from "@/components/reviews/ReviewsSection";
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
  searchParams: Promise<{ groupSize?: string; month?: string; reviewed?: string }>;
}) {
  const { slug } = await params;
  const { groupSize, month, reviewed } = await searchParams;
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
    <main className="flex-1">
      <div className="mx-auto max-w-5xl space-y-16 px-4 pt-8 pb-24 sm:px-6 sm:pt-14 lg:px-8">
        {tourPackage.coverImageUrl ? (
          <div className="relative h-72 w-full overflow-hidden bg-parchment-200 sm:h-96">
            <Image
              src={tourPackage.coverImageUrl}
              alt={tourPackage.name}
              width={1400}
              height={600}
              className="h-full w-full object-cover"
              priority
            />
          </div>
        ) : null}

        {/* Hero */}
        <header>
          <p className="font-mono text-[11px] tracking-wider text-accent uppercase">
            {tourPackage.durationDays - 1} nights / {tourPackage.durationDays} days · {uniqueDestinations.size}{" "}
            destinations
          </p>
          <h1 className="font-editorial mt-2 text-4xl font-medium text-foreground sm:text-5xl">{tourPackage.name}</h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed font-light text-muted">{tourPackage.description}</p>
        </header>

        {tourPackage.highlights.length > 0 ? (
          <section>
            <h2 className="font-editorial mb-4 text-2xl text-foreground">Highlights</h2>
            <div className="grid grid-cols-1 gap-2.5 text-sm text-foreground sm:grid-cols-2">
              {tourPackage.highlights.map((highlight) => (
                <div key={highlight} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {/* Journey exploration: map + day-by-day */}
        <section>
          <div className="mb-6 text-[11px] font-semibold tracking-[0.2em] text-accent uppercase">
            Geographic Journal
          </div>
          <h2 className="font-editorial mb-6 text-2xl text-foreground sm:text-3xl">Explore the Journey</h2>
          <JourneyExplorer days={journeyDays} route={route} />
        </section>

        {tourPackage.images.length > 0 ? (
          <section>
            <h2 className="font-editorial mb-4 text-2xl text-foreground">Gallery</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {tourPackage.images.map((image) => (
                <Image
                  key={image.id}
                  src={image.url}
                  alt={image.alt ?? tourPackage.name}
                  width={300}
                  height={200}
                  className="h-32 w-full object-cover"
                />
              ))}
            </div>
          </section>
        ) : null}

        {/* Full tour package */}
        <section className="border-t border-parchment-300 pt-10">
          <div className="mb-8 text-[11px] font-semibold tracking-[0.2em] text-accent uppercase">
            The Full Itinerary
          </div>
          <h2 className="font-editorial mb-10 text-3xl text-foreground">Full Tour Package</h2>

          {/* Hotels */}
          {journeyDays.some((day) => day.hotelOptions.length > 0) ? (
            <div className="mb-10">
              <h3 className="font-editorial mb-1 text-xl font-semibold text-foreground">
                Your Accommodation Options
              </h3>
              <p className="mb-4 text-xs leading-relaxed font-light text-muted">
                Hotel selection does not guarantee live availability. Final availability is confirmed by our
                team after your enquiry — if your preferred hotel isn&apos;t available, we&apos;ll arrange a
                listed alternative.
              </p>
              <div className="flex flex-col gap-4">
                {journeyDays
                  .filter((day) => day.hotelOptions.length > 0)
                  .map((day) => (
                    <div key={day.id} className="border border-parchment-300 bg-surface p-4">
                      <p className="font-mono text-[11px] tracking-wider text-muted uppercase">
                        Day {String(day.dayNumber).padStart(2, "0")}
                        {day.places[0] ? ` · ${day.places[0].name}` : ""}
                      </p>
                      <div className="mt-2 flex flex-col gap-1.5">
                        {day.hotelOptions.map((hotel, index) => (
                          <label key={hotel.id} className="flex items-center gap-2 text-sm text-foreground">
                            <input type="radio" name={`hotel-${day.id}`} defaultChecked={index === 0} />
                            {hotel.name}
                            {hotel.rating ? <span className="text-muted">· {hotel.rating}★</span> : null}
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
            <div className="mb-10 grid gap-8 sm:grid-cols-2">
              {includedActivities.length > 0 ? (
                <div>
                  <h3 className="font-editorial mb-2 text-xl font-semibold text-foreground">Included Activities</h3>
                  <ul className="flex flex-col gap-1.5 text-sm text-foreground">
                    {includedActivities.map((activity) => (
                      <li key={activity}>✓ {activity}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {optionalActivities.length > 0 ? (
                <div>
                  <h3 className="font-editorial mb-2 text-xl font-semibold text-foreground">Optional / Available</h3>
                  <ul className="flex flex-col gap-1.5 text-sm text-muted">
                    {optionalActivities.map((activity) => (
                      <li key={activity} className="flex items-center gap-2">
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
            <div className="mb-10 grid gap-8 sm:grid-cols-2">
              {tourPackage.included.length > 0 ? (
                <div>
                  <h3 className="font-editorial mb-2 text-xl font-semibold text-foreground">What&apos;s Included</h3>
                  <ul className="flex flex-col gap-1.5 text-sm text-muted">
                    {tourPackage.included.map((item) => (
                      <li key={item}>✓ {item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {tourPackage.excluded.length > 0 ? (
                <div>
                  <h3 className="font-editorial mb-2 text-xl font-semibold text-foreground">Not Included</h3>
                  <ul className="flex flex-col gap-1.5 text-sm text-muted">
                    {tourPackage.excluded.map((item) => (
                      <li key={item}>· {item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : null}

          {tourPackage.importantInfo.length > 0 ? (
            <div className="mb-10">
              <h3 className="font-editorial mb-2 text-xl font-semibold text-foreground">Important Information</h3>
              <ul className="flex flex-col gap-1.5 text-xs leading-relaxed font-light text-muted">
                {tourPackage.importantInfo.map((item) => (
                  <li key={item}>· {item}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* Estimated total */}
          <div className="border border-parchment-300 bg-parchment-100 p-6 sm:p-8 dark:bg-jungle-800">
            <div className="mb-1 text-[11px] font-semibold tracking-[0.2em] text-accent uppercase">
              Your Estimate
            </div>
            <h3 className="font-editorial mb-5 text-2xl text-foreground">What This Journey Costs</h3>
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
                Update Estimate
              </Button>
            </form>

            <div className="mt-6 border-t border-parchment-200 pt-6 text-center">
              {estimate ? (
                <>
                  <p className="font-mono text-[11px] tracking-wider text-muted uppercase">
                    Estimated Total · {monthName(monthNumber ?? 0)}
                  </p>
                  <p className="font-editorial mt-1 text-4xl font-bold text-foreground">
                    {formatCurrency(estimate.pricePerPerson)}
                    <span className="text-lg font-normal text-muted"> / person</span>
                  </p>
                </>
              ) : groupSize || month ? (
                <p className="text-sm text-muted">
                  Pricing isn&apos;t configured yet for that combination — select a different group size or
                  month, or send an enquiry and we&apos;ll quote you directly.
                </p>
              ) : (
                <p className="text-sm text-muted">
                  Select your group size and arrival month above to see your estimated total per person.
                </p>
              )}
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href={`/enquiry?${enquiryParams.toString()}`}
              className="inline-flex items-center gap-2 bg-foreground px-8 py-3.5 text-xs font-medium tracking-[0.16em] text-background uppercase transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <span>Request This Trip</span>
              <span className="font-editorial text-sm">→</span>
            </Link>
          </div>
        </section>

        <ReviewsSection packageId={tourPackage.id} packageSlug={tourPackage.slug} justSubmitted={reviewed === "1"} />
      </div>
    </main>
  );
}
