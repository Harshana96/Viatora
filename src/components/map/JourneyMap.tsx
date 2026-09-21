"use client";

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useMemo, useRef } from "react";

import { MAPBOX_PUBLIC_TOKEN } from "@/lib/mapbox";
import type { JourneyDay } from "@/types";

type MapPoint = {
  dayId: string;
  dayNumber: number;
  latitude: number;
  longitude: number;
  label: string;
};

type Props = {
  days: JourneyDay[];
  selectedDayId: string | null;
  onSelectDay: (dayId: string) => void;
  /** Road-following route coordinates ([lng, lat] pairs) from the Directions
   * API. Falls back to a straight line between day points when null. */
  routeGeometry: [number, number][] | null;
};

function getDayPoint(day: JourneyDay): MapPoint | null {
  const place = day.places[0];
  if (!place) {
    return null;
  }
  return {
    dayId: day.id,
    dayNumber: day.dayNumber,
    latitude: place.latitude,
    longitude: place.longitude,
    label: place.name,
  };
}

export function JourneyMap({ days, selectedDayId, onSelectDay, routeGeometry }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map());

  const points = useMemo(
    () => days.map(getDayPoint).filter((point): point is MapPoint => point !== null),
    [days],
  );

  useEffect(() => {
    if (!MAPBOX_PUBLIC_TOKEN || !containerRef.current || points.length === 0) {
      return;
    }

    mapboxgl.accessToken = MAPBOX_PUBLIC_TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [points[0].longitude, points[0].latitude],
      zoom: 7,
    });
    mapRef.current = map;

    const markers = new Map<string, mapboxgl.Marker>();
    markersRef.current = markers;

    map.on("load", () => {
      if (points.length > 1) {
        const isRoadRoute = routeGeometry !== null && routeGeometry.length > 1;
        const lineCoordinates = isRoadRoute
          ? routeGeometry
          : points.map((point): [number, number] => [point.longitude, point.latitude]);

        map.addSource("journey-route", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: lineCoordinates,
            },
          },
        });
        map.addLayer({
          id: "journey-route-line",
          type: "line",
          source: "journey-route",
          layout: { "line-join": "round", "line-cap": "round" },
          paint: isRoadRoute
            ? { "line-color": "#0f172a", "line-width": 4 }
            : { "line-color": "#0f172a", "line-width": 3, "line-dasharray": [0.5, 1.5] },
        });
      }

      points.forEach((point) => {
        const el = document.createElement("button");
        el.type = "button";
        el.setAttribute("aria-label", `Day ${point.dayNumber}: ${point.label}`);
        el.className =
          "flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-stone-900 text-xs font-semibold text-white shadow-md transition-transform dark:bg-stone-50 dark:text-stone-900";
        el.textContent = String(point.dayNumber);
        el.addEventListener("click", () => onSelectDay(point.dayId));

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([point.longitude, point.latitude])
          .addTo(map);

        markers.set(point.dayId, marker);
      });

      const bounds = new mapboxgl.LngLatBounds();
      points.forEach((point) => bounds.extend([point.longitude, point.latitude]));
      map.fitBounds(bounds, { padding: 60, maxZoom: 12 });
    });

    return () => {
      markers.forEach((marker) => marker.remove());
      markers.clear();
      map.remove();
      mapRef.current = null;
    };
  }, [points, onSelectDay, routeGeometry]);

  useEffect(() => {
    markersRef.current.forEach((marker, dayId) => {
      const el = marker.getElement();
      const isActive = dayId === selectedDayId;
      el.classList.toggle("ring-4", isActive);
      el.classList.toggle("ring-amber-400", isActive);
      el.style.transform = isActive ? "scale(1.15)" : "scale(1)";
    });

    if (selectedDayId && mapRef.current) {
      const point = points.find((candidate) => candidate.dayId === selectedDayId);
      if (point) {
        mapRef.current.flyTo({ center: [point.longitude, point.latitude], zoom: 11 });
      }
    }
  }, [selectedDayId, points]);

  if (!MAPBOX_PUBLIC_TOKEN) {
    return (
      <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-stone-300 bg-stone-50 p-6 text-center text-sm text-stone-500 dark:border-stone-700 dark:bg-stone-900">
        <p className="font-medium">Interactive map unavailable</p>
        <p>Set NEXT_PUBLIC_MAPBOX_TOKEN to enable the journey map.</p>
      </div>
    );
  }

  if (points.length === 0) {
    return (
      <div className="flex h-full min-h-[320px] items-center justify-center rounded-lg border border-dashed border-stone-300 p-6 text-center text-sm text-stone-500 dark:border-stone-700">
        No locations added to this itinerary yet.
      </div>
    );
  }

  return <div ref={containerRef} className="h-full min-h-[320px] w-full rounded-lg" />;
}
