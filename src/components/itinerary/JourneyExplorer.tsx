"use client";

import { ChevronDown } from "lucide-react";
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
  const [expandedDayIds, setExpandedDayIds] = useState<Set<string>>(new Set());

  const routePoints = days.map((day) => day.places[0]).filter((place) => Boolean(place)) as JourneyDay["places"];
  const straightLineDistanceKm = totalRouteDistanceKm(routePoints);

  const toggleExpanded = (dayId: string) => {
    setExpandedDayIds((current) => {
      const next = new Set(current);
      if (next.has(dayId)) {
        next.delete(dayId);
      } else {
        next.add(dayId);
      }
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:items-start lg:gap-6">
      <div className="order-2 flex flex-col gap-3 lg:order-1">
        {days.map((day) => {
          const isActive = day.id === selectedDayId;
          const isExpanded = expandedDayIds.has(day.id);
          const placesWithActivities = day.places.filter((place) => place.activities.length > 0);
          const hasExpandableContent = placesWithActivities.length > 0;

          return (
            <div
              key={day.id}
              className={
                "w-full border-l-4 border-t border-r border-b transition-all duration-200 " +
                (isActive
                  ? "border-t-parchment-300 border-r-parchment-300 border-b-parchment-300 border-l-foreground bg-surface shadow-sm"
                  : "border-parchment-200 border-l-transparent bg-foreground/[0.02] hover:border-parchment-400")
              }
            >
              <button type="button" onClick={() => setSelectedDayId(day.id)} className="w-full p-4 text-left">
                <p className="font-mono text-[11px] font-semibold tracking-wider text-accent uppercase">
                  Day {String(day.dayNumber).padStart(2, "0")}
                </p>
                {day.title ? (
                  <p className="font-editorial mt-1 text-xl font-semibold text-foreground">{day.title}</p>
                ) : null}
                {day.description ? (
                  <p className="mt-1 text-sm leading-relaxed font-light text-muted">{day.description}</p>
                ) : null}
                {day.places.length > 0 ? (
                  <p className="mt-2 text-xs text-muted">{day.places.map((place) => place.name).join(" → ")}</p>
                ) : null}
                {day.hotelName ? (
                  <p className="mt-1 font-mono text-[10px] text-muted">Stay: {day.hotelName}</p>
                ) : null}
              </button>

              {hasExpandableContent ? (
                <>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleExpanded(day.id);
                    }}
                    aria-expanded={isExpanded}
                    className="flex w-full items-center justify-center gap-1.5 border-t border-parchment-200 py-2 text-[11px] font-medium tracking-wider text-muted uppercase hover:text-foreground"
                  >
                    {isExpanded ? "Hide activities" : "View activities"}
                    <ChevronDown size={13} className={`transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                  </button>
                  {isExpanded ? (
                    <div className="flex flex-col gap-3 border-t border-parchment-200 bg-foreground/[0.015] px-4 py-3">
                      {placesWithActivities.map((place) => (
                        <div key={place.id}>
                          <p className="text-[11px] font-semibold text-foreground uppercase">{place.name}</p>
                          <ul className="mt-1 flex flex-col gap-1">
                            {place.activities.map((activity) => (
                              <li key={activity} className="text-sm text-muted">
                                · {activity}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </>
              ) : null}
            </div>
          );
        })}
      </div>
      <div className="order-1 flex flex-col gap-2 lg:order-2 lg:sticky lg:top-24">
        <div className="h-[380px] overflow-hidden border border-parchment-300 lg:h-[620px]">
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
