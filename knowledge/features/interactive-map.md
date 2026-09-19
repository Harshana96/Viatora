# Feature: Interactive Journey Map

## Purpose

Visually connect a package's day-by-day itinerary with the physical
journey across Sri Lanka. This is the MVP's main differentiator.

## User Experience

On a package page, the map shows numbered markers and a route line for
every day. Clicking a day in the itinerary focuses the map on that day's
location; clicking a marker highlights the corresponding itinerary item.
The map auto-fits the whole journey on load.

## Requirements

- Mapbox GL JS map with numbered markers per day.
- Route line connecting locations in day order.
- Bidirectional itinerary <-> marker interaction.
- Auto-fit bounds to the full journey.
- Approximate route distance shown where practical.
- Mobile-friendly (map above itinerary on small screens).

## Data

`TourDay`, `TourDayPlace`, `Place` (`latitude`, `longitude`).

## Technical Implementation

`getPackageBySlug` (`src/server/tours/actions.ts`) fetches a published
package with `days -> places -> place` in order, and the public page
(`src/app/(public)/tours/[slug]/page.tsx`) maps that into a plain
`JourneyDay[]` (see `src/types/index.ts`) — the single shape both the
itinerary list and the map read from; no separate map data file.

`JourneyExplorer` (`src/components/itinerary/JourneyExplorer.tsx`) is a
client component holding the selected-day state; it renders the itinerary
list and passes `days`/`selectedDayId`/`onSelectDay` straight through to
`JourneyMap` (`src/components/map/JourneyMap.tsx`), which owns the actual
Mapbox GL instance: one marker per day (using that day's first place),
route line via a GeoJSON `LineString` source when there are 2+ points,
`fitBounds` on load, and `flyTo` + marker highlight when `selectedDayId`
changes. Approximate distance is computed client-side with the haversine
formula (`src/lib/geo.ts`) over the same day points — no Directions API
call yet.

If `NEXT_PUBLIC_MAPBOX_TOKEN` is unset, `JourneyMap` renders a static
fallback message instead of attempting to initialize Mapbox.

## Dependencies

- Mapbox (`NEXT_PUBLIC_MAPBOX_TOKEN`)
- Tour package data (published `TourPackage` with `days`)
- Places

## Edge Cases

- Package has one location (no route line to draw) — handled, line only
  added when there are 2+ points.
- Day has no assigned place — handled, day is excluded from map points but
  still shown in the itinerary list.
- No Mapbox token configured — handled, fallback message shown.
- Package has zero days with locations — handled, "No locations added to
  this itinerary yet" message shown.
- Route API fails / invalid coordinates from bad admin input — not yet
  handled; no Directions API call is made (distance is haversine-only).

## Testing

Verified manually against a real Postgres database: created a published
package with a 3-day itinerary and one place per day, confirmed the
itinerary list and (token-less) map fallback both render correctly from
the same data on `/tours/[slug]`. No automated test yet — add a component
test for marker/day highlight sync when the test setup exists.

## Related Files

- `src/components/map/JourneyMap.tsx` — Mapbox rendering, markers, route
- `src/components/itinerary/JourneyExplorer.tsx` — shared state, itinerary list
- `src/lib/mapbox.ts` — token access
- `src/lib/geo.ts` — haversine distance calculation
- `src/server/tours/actions.ts` — `getPackageBySlug`, `listPublishedPackages`
- `src/app/(public)/tours/[slug]/page.tsx`, `src/app/(public)/tours/page.tsx`

## Change History

- Initial creation.
- Implemented: Mapbox-based JourneyMap + JourneyExplorer, public package
  detail page, haversine-based approximate distance, token-less fallback.
