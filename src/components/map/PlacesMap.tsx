"use client";

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef } from "react";

import { MAPBOX_PUBLIC_TOKEN } from "@/lib/mapbox";

type MapPlace = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
};

type Props = {
  places: MapPlace[];
};

/** Simple multi-marker map for a set of places, with no route line or
 * itinerary-day semantics — used on destination pages. See JourneyMap for
 * the day-by-day itinerary map used on package pages. */
export function PlacesMap({ places }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!MAPBOX_PUBLIC_TOKEN || !containerRef.current || places.length === 0) {
      return;
    }

    mapboxgl.accessToken = MAPBOX_PUBLIC_TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [places[0].longitude, places[0].latitude],
      zoom: 10,
    });

    const markers: mapboxgl.Marker[] = [];

    map.on("load", () => {
      places.forEach((place) => {
        const marker = new mapboxgl.Marker()
          .setLngLat([place.longitude, place.latitude])
          .setPopup(new mapboxgl.Popup({ offset: 12 }).setText(place.name))
          .addTo(map);
        markers.push(marker);
      });

      if (places.length > 1) {
        const bounds = new mapboxgl.LngLatBounds();
        places.forEach((place) => bounds.extend([place.longitude, place.latitude]));
        map.fitBounds(bounds, { padding: 60, maxZoom: 13 });
      }
    });

    return () => {
      markers.forEach((marker) => marker.remove());
      map.remove();
    };
  }, [places]);

  if (!MAPBOX_PUBLIC_TOKEN) {
    return (
      <div className="flex h-full min-h-[280px] flex-col items-center justify-center gap-2 border border-dashed border-parchment-300 bg-surface p-6 text-center text-sm text-muted">
        <p className="font-medium text-foreground">Map unavailable</p>
        <p>Set NEXT_PUBLIC_MAPBOX_TOKEN to enable the map.</p>
      </div>
    );
  }

  if (places.length === 0) {
    return (
      <div className="flex h-full min-h-[280px] items-center justify-center border border-dashed border-parchment-300 p-6 text-center text-sm text-muted">
        No places added to this destination yet.
      </div>
    );
  }

  return <div ref={containerRef} className="h-full min-h-[280px] w-full" />;
}
