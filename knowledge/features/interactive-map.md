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
list and passes `days`/`selectedDayId`/`onSelectDay`/`route` straight
through to `JourneyMap` (`src/components/map/JourneyMap.tsx`), which owns
the actual Mapbox GL instance: one marker per day (using that day's first
place), a GeoJSON `LineString` route layer when there are 2+ points,
`fitBounds` on load, and `flyTo` + marker highlight when `selectedDayId`
changes.

The route line and distance/duration come from the Mapbox **Directions
API**, fetched server-side in the page component via
`fetchDrivingRoute()` (`src/lib/mapbox.ts`) — one call per page load,
passing every day's first place in order and using the `driving` profile
with `overview=full` for detailed road geometry. It uses
`MAPBOX_SECRET_TOKEN` if set, otherwise falls back to
`NEXT_PUBLIC_MAPBOX_TOKEN` (the Directions API works with a public token,
so a secret token is an optional upgrade, not a requirement). If the API
call fails or returns nothing (`route === null`), `JourneyMap` falls back
to a straight dashed line between day points and `JourneyExplorer` falls
back to the haversine-based approximate distance (`src/lib/geo.ts`) — the
degradation path described in the original edge cases is now implemented,
not just planned.

If `NEXT_PUBLIC_MAPBOX_TOKEN` is unset, `JourneyMap` renders a static
fallback message instead of attempting to initialize Mapbox (and the
Directions call is skipped too, since `fetchDrivingRoute` also needs a
token).

## Dependencies

- Mapbox (`NEXT_PUBLIC_MAPBOX_TOKEN`, optionally `MAPBOX_SECRET_TOKEN`)
- Tour package data (published `TourPackage` with `days`)
- Places

## Edge Cases

- Package has one location (no route line to draw) — handled, line only
  added when there are 2+ points.
- Day has no assigned place — handled, day is excluded from map points but
  still shown in the itinerary list.
- No Mapbox token configured — handled, fallback message shown, no
  Directions call attempted.
- Package has zero days with locations — handled, "No locations added to
  this itinerary yet" message shown.
- Directions API fails (network error, rate limit, no route found) —
  handled: `fetchDrivingRoute` catches and returns `null`, map draws a
  straight line instead and distance falls back to haversine.
- Invalid/missing coordinates from bad admin input — not validated beyond
  the Zod lat/lng range checks on Place; a wildly wrong coordinate would
  still produce a straight line or a nonsensical route rather than an
  error.

## Testing

Verified against a real Postgres database and the live Mapbox API (not
mocked): created a published package with a 3-day itinerary (Colombo →
Kandy → Ella) and one place per day, confirmed:
- the token-less fallback renders correctly before a token was configured;
- after adding a real `NEXT_PUBLIC_MAPBOX_TOKEN`, the map container renders
  (fallback gone) and the Directions API returns a real route (~7,254
  geometry points, 279.9 km, ~529 min), matching what the page displays
  ("Road route: 280 km · ~8 h 49 min drive").
No automated test yet — add a component test for marker/day highlight sync
and a mocked-fetch test for the Directions fallback path when the test
setup exists.

## Related Files

- `src/components/map/JourneyMap.tsx` — Mapbox rendering, markers, route line
- `src/components/itinerary/JourneyExplorer.tsx` — shared state, itinerary list, distance display
- `src/lib/mapbox.ts` — token access, `fetchDrivingRoute` (Directions API)
- `src/lib/geo.ts` — haversine distance fallback calculation
- `src/server/tours/actions.ts` — `getPackageBySlug`, `listPublishedPackages`
- `src/app/(public)/tours/[slug]/page.tsx`, `src/app/(public)/tours/page.tsx`

## Change History

- Initial creation.
- Implemented: Mapbox-based JourneyMap + JourneyExplorer, public package
  detail page, haversine-based approximate distance, token-less fallback.
- Implemented road-following routes via the Mapbox Directions API
  (`fetchDrivingRoute`), with automatic fallback to the straight-line
  haversine estimate when the API call fails or no token is configured.
