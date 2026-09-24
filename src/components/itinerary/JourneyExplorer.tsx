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
                "w-full border-l-4 border-t border-r border-b p-4 text-left transition-all duration-200 " +
                (isActive
                  ? "border-t-parchment-300 border-r-parchment-300 border-b-parchment-300 border-l-foreground bg-surface shadow-sm"
                  : "border-parchment-200 border-l-transparent bg-foreground/[0.02] hover:border-parchment-400")
              }
            >
              <p className="font-mono text-[11px] font-semibold tracking-wider text-accent uppercase">
                Day {String(day.dayNumber).padStart(2, "0")}
              </p>
              {day.title ? <p className="font-editorial mt-1 text-xl font-semibold text-foreground">{day.title}</p> : null}
              {day.description ? (
                <p className="mt-1 text-sm leading-relaxed font-light text-muted">{day.description}</p>
              ) : null}
              {day.places.length > 0 ? (
                <p className="mt-2 text-xs text-muted">{day.places.map((place) => place.name).join(", ")}</p>
              ) : null}
              {day.hotelName ? (
                <p className="mt-1 font-mono text-[10px] text-muted">Stay: {day.hotelName}</p>
              ) : null}
            </button>
          );
        })}
      </div>
      <div className="order-1 flex flex-col gap-2 lg:order-2 lg:sticky lg:top-24">
        <div className="h-[320px] overflow-hidden border border-parchment-300 lg:h-[480px]">
          <JourneyMap
            days={days}
            selectedDayId={selectedDayId}
            onSelectDay={setSelectedDayId}
            routeGeometry={route?.coordinates ?? null}
          />
        </div>
        {route ? (
          <p className="text-center font-mono text-[11px] tracking-wider text-muted uppercase">
            Road route: {Math.round(route.distanceKm)} km · ~{formatDuration(route.durationMinutes)} drive
          </p>
        ) : straightLineDistanceKm > 0 ? (
          <p className="text-center font-mono text-[11px] tracking-wider text-muted uppercase">
            Approximate straight-line distance: {Math.round(straightLineDistanceKm)} km
          </p>
        ) : null}
      </div>
    </div>
  );
}
