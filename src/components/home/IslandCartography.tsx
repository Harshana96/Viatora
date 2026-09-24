"use client";

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useMemo, useRef, useState } from "react";

import { MAPBOX_PUBLIC_TOKEN } from "@/lib/mapbox";

type Waypoint = {
  slug: string;
  name: string;
  location: string;
  description: string;
  highlight: string | null;
  latitude: number;
  longitude: number;
};

function IslandMap({
  waypoints,
  selectedSlug,
  onSelect,
}: {
  waypoints: Waypoint[];
  selectedSlug: string | null;
  onSelect: (slug: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map());
  const [markersReady, setMarkersReady] = useState(0);

  const points = useMemo(() => waypoints, [waypoints]);

  useEffect(() => {
    if (!MAPBOX_PUBLIC_TOKEN || !containerRef.current || points.length === 0) {
      return;
    }

    mapboxgl.accessToken = MAPBOX_PUBLIC_TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [points[0].longitude, points[0].latitude],
      zoom: 6.5,
    });
    mapRef.current = map;

    const markers = new Map<string, mapboxgl.Marker>();
    markersRef.current = markers;

    map.on("load", () => {
      points.forEach((point) => {
        const el = document.createElement("button");
        el.type = "button";
        el.setAttribute("aria-label", point.name);
        el.className =
          "flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-jungle-900 text-[10px] font-semibold text-white shadow-md transition-transform";
        el.addEventListener("click", () => onSelect(point.slug));

        const marker = new mapboxgl.Marker({ element: el }).setLngLat([point.longitude, point.latitude]).addTo(map);
        markers.set(point.slug, marker);
      });

      const bounds = new mapboxgl.LngLatBounds();
      points.forEach((point) => bounds.extend([point.longitude, point.latitude]));
      map.fitBounds(bounds, { padding: 70, maxZoom: 9 });

      // Markers now exist -- let the highlight effect below re-run to style the initial selection.
      setMarkersReady((count) => count + 1);
    });

    return () => {
      markers.forEach((marker) => marker.remove());
      markers.clear();
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points]);

  // Styles the active marker -- also re-runs once markers finish being created
  // (markersReady) so the initial default selection gets highlighted too.
  useEffect(() => {
    markersRef.current.forEach((marker, slug) => {
      const el = marker.getElement();
      const isActive = slug === selectedSlug;
      el.classList.toggle("bg-accent", isActive);
      el.classList.toggle("bg-jungle-900", !isActive);
      el.classList.toggle("ring-4", isActive);
      el.classList.toggle("ring-ceylon-gold", isActive);
      el.style.transform = isActive ? "scale(1.2)" : "scale(1)";
    });
  }, [selectedSlug, markersReady]);

  // Flies the camera to the selection -- skipped on the initial mount/load
  // so it doesn't fight with fitBounds' initial framing.
  const hasFlownRef = useRef(false);
  useEffect(() => {
    if (!hasFlownRef.current) {
      hasFlownRef.current = true;
      return;
    }
    if (selectedSlug && mapRef.current) {
      const point = points.find((candidate) => candidate.slug === selectedSlug);
      if (point) {
        mapRef.current.flyTo({ center: [point.longitude, point.latitude], zoom: 9 });
      }
    }
  }, [selectedSlug, points]);

  if (!MAPBOX_PUBLIC_TOKEN) {
    return (
      <div className="flex h-full min-h-[340px] flex-col items-center justify-center gap-2 border border-dashed border-parchment-300 bg-surface p-6 text-center text-sm text-muted">
        <p className="font-medium text-foreground">Interactive map unavailable</p>
        <p>Set NEXT_PUBLIC_MAPBOX_TOKEN to enable the island map.</p>
      </div>
    );
  }

  return <div ref={containerRef} className="h-full min-h-[340px] w-full" />;
}

export function IslandCartography({ waypoints }: { waypoints: Waypoint[] }) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(waypoints[0]?.slug ?? null);
  const active = waypoints.find((waypoint) => waypoint.slug === selectedSlug) ?? waypoints[0];

  return (
    <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
      <div className="flex flex-col space-y-3 lg:col-span-5">
        {waypoints.map((waypoint, index) => {
          const isActive = waypoint.slug === selectedSlug;
          return (
            <button
              key={waypoint.slug}
              type="button"
              onClick={() => setSelectedSlug(waypoint.slug)}
              className={`p-5 text-left transition-all duration-200 ${
                isActive
                  ? "border-t border-r border-b border-l-4 border-parchment-300 border-l-foreground bg-surface shadow-sm"
                  : "border-t border-r border-b border-l-4 border-parchment-200 border-l-transparent bg-foreground/[0.03] hover:border-parchment-400"
              }`}
            >
              <div className="flex items-center justify-between text-[11px]">
                <span
                  className={`font-mono font-semibold tracking-wider uppercase ${
                    isActive ? "text-accent" : "text-muted"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")} · {waypoint.location}
                </span>
              </div>
              <h4 className="font-editorial mt-1 text-2xl font-bold text-foreground">{waypoint.name}</h4>
              <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed font-light text-muted">
                {waypoint.description}
              </p>
              <div className="mt-3 flex items-center justify-between border-t border-parchment-100 pt-2 text-[11px] text-muted">
                <span className="font-editorial text-xs text-foreground italic">View destination →</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="relative flex min-h-[420px] flex-col justify-between overflow-hidden border border-parchment-300 bg-[#FAF4EA] p-4 shadow-inner lg:col-span-7 dark:bg-[#0f2019]">
        <div className="mb-3 flex items-center justify-between font-mono text-[10px] tracking-[0.2em] text-muted uppercase">
          <span>Island Overview</span>
          <span className="font-editorial text-stone-700 italic capitalize dark:text-stone-300">Indian Ocean</span>
        </div>

        <div className="min-h-[280px] flex-1 border border-parchment-300">
          <IslandMap waypoints={waypoints} selectedSlug={selectedSlug} onSelect={setSelectedSlug} />
        </div>

        {active ? (
          <div className="relative z-10 mt-4 border border-parchment-300 bg-surface p-5 shadow-md">
            <div className="flex items-center justify-between border-b border-parchment-200 pb-2">
              <span className="font-mono text-[10px] font-semibold tracking-widest text-accent uppercase">
                {active.location}
              </span>
            </div>
            <div className="mt-2.5 space-y-1">
              <h5 className="font-editorial text-2xl font-bold text-foreground">{active.name}</h5>
              <p className="text-xs leading-relaxed font-light text-muted">{active.description}</p>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-parchment-100 pt-3 text-xs">
              {active.highlight ? <span className="font-mono text-[11px] text-muted">{active.highlight}</span> : <span />}
              <a
                href={`/destinations/${active.slug}`}
                className="font-editorial text-sm text-foreground italic underline transition-colors hover:text-accent"
              >
                Explore this waypoint →
              </a>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
