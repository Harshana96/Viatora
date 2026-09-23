import Link from "next/link";
import { notFound } from "next/navigation";

import { DayPlaceForm } from "@/components/admin/DayPlaceForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Button } from "@/components/ui/button";
import { addPlaceToDay, deleteDay, listDays, removeDayPlace } from "@/server/itinerary/actions";
import { listPlaces } from "@/server/places/actions";
import { getPackage } from "@/server/tours/actions";

export const dynamic = "force-dynamic";

export default async function ItineraryBuilderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [tourPackage, days, places] = await Promise.all([getPackage(id), listDays(id), listPlaces()]);

  if (!tourPackage) {
    notFound();
  }

  return (
    <main className="flex-1 px-6 py-16">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Itinerary: {tourPackage.name}</h1>
          <p className="text-sm text-zinc-500">{tourPackage.durationDays} day package</p>
        </div>
        <Link href={`/admin/tours/${id}/itinerary/days/new`}>
          <Button>Add day</Button>
        </Link>
      </div>

      {days.length === 0 ? (
        <p className="text-zinc-600 dark:text-zinc-400">No days added yet.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {days.map((day) => (
            <section key={day.id} className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold">
                    Day {day.dayNumber}
                    {day.title ? ` — ${day.title}` : ""}
                  </h2>
                  {day.description ? (
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{day.description}</p>
                  ) : null}
                  {day.hotel ? <p className="mt-1 text-sm text-zinc-500">Hotel: {day.hotel.name}</p> : null}
                </div>
                <div className="flex items-center gap-4">
                  <Link
                    href={`/admin/tours/${id}/itinerary/days/${day.id}/edit`}
                    className="text-sm font-medium text-zinc-900 hover:underline dark:text-zinc-50"
                  >
                    Edit
                  </Link>
                  <DeleteButton
                    action={deleteDay}
                    id={day.id}
                    label={`Day ${day.dayNumber}`}
                    extraFields={{ packageId: id }}
                  />
                </div>
              </div>

              {day.places.length > 0 ? (
                <ul className="mb-3 flex flex-col gap-2">
                  {day.places.map((dayPlace) => (
                    <li
                      key={dayPlace.id}
                      className="flex items-start justify-between gap-4 rounded-md bg-zinc-50 p-2 text-sm dark:bg-zinc-900"
                    >
                      <div>
                        <p className="font-medium">{dayPlace.place.name}</p>
                        {dayPlace.activities.length > 0 ? (
                          <ul className="list-disc pl-5 text-zinc-600 dark:text-zinc-400">
                            {dayPlace.activities.map((activity, index) => (
                              <li key={index}>{activity}</li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                      <form action={removeDayPlace}>
                        <input type="hidden" name="id" value={dayPlace.id} />
                        <input type="hidden" name="packageId" value={id} />
                        <button type="submit" className="text-xs font-medium text-red-600 hover:text-red-500">
                          Remove
                        </button>
                      </form>
                    </li>
                  ))}
                </ul>
              ) : null}

              <DayPlaceForm action={addPlaceToDay} packageId={id} tourDayId={day.id} places={places} />
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
