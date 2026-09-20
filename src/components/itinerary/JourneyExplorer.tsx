"use client";

import { useState } from "react";

import { JourneyMap } from "@/components/map/JourneyMap";
import { totalRouteDistanceKm } from "@/lib/geo";
import type { DirectionsRoute } from "@/lib/mapbox";
import type { JourneyDay } from "@/types";

type Props = {
  days: JourneyDay[];
  route: DirectionsRoute | null;
};

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.round(minutes % 60);
  if (hours === 0) {
    return `${remainingMinutes} min`;
  }
  return `${hours} h ${remainingMinutes} min`;
}

export function JourneyExplorer({ days, route }: Props) {
  const [selectedDayId, setSelectedDayId] = useState<string | null>(days[0]?.id ?? null);

  const routePoints = days.map((day) => day.places[0]).filter((place) => Boolean(place)) as JourneyDay["places"];
  const straightLineDistanceKm = totalRouteDistanceKm(routePoints);

  return (
    <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:items-start lg:gap-6">
      <div className="order-2 flex flex-col gap-3 lg:order-1">
        {days.map((day) => {
          const isActive = day.id === selectedDayId;
          return (
            <button
              key={day.id}
              type="button"
              onClick={() => setSelectedDayId(day.id)}
              className={
                "w-full rounded-lg border p-4 text-left transition-colors " +
                (isActive
                  ? "border-zinc-900 bg-zinc-50 dark:border-zinc-50 dark:bg-zinc-900"
                  : "border-zinc-200 hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600")
              }
            >
              <p className="text-sm font-semibold text-zinc-500">Day {day.dayNumber}</p>
              {day.title ? <p className="text-lg font-semibold">{day.title}</p> : null}
              {day.description ? (
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{day.description}</p>
              ) : null}
              {day.places.length > 0 ? (
                <p className="mt-2 text-sm text-zinc-500">{day.places.map((place) => place.name).join(", ")}</p>
              ) : null}
              {day.hotelName ? <p className="mt-1 text-xs text-zinc-400">Stay: {day.hotelName}</p> : null}
            </button>
          );
        })}
      </div>
      <div className="order-1 flex flex-col gap-2 lg:order-2 lg:sticky lg:top-6">
        <div className="h-[320px] overflow-hidden rounded-lg lg:h-[480px]">
          <JourneyMap
            days={days}
            selectedDayId={selectedDayId}
            onSelectDay={setSelectedDayId}
            routeGeometry={route?.coordinates ?? null}
          />
        </div>
        {route ? (
          <p className="text-center text-xs text-zinc-500">
            Road route: {Math.round(route.distanceKm)} km · ~{formatDuration(route.durationMinutes)} drive
          </p>
        ) : straightLineDistanceKm > 0 ? (
          <p className="text-center text-xs text-zinc-500">
            Approximate straight-line distance: {Math.round(straightLineDistanceKm)} km
          </p>
        ) : null}
      </div>
    </div>
  );
}
