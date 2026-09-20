# Feature: Destination Pages

## Purpose

Let travellers browse a destination and see what's there — description,
things to do, the places within it, a map, and any published tour
packages that visit it.

## User Experience

`/destinations` lists all destinations with location and a link to each.
`/destinations/[slug]` shows the destination image (not yet — see Known
Gaps), description, location, "things to do", a map of its places,
a "places to visit" grid, and a "related tour packages" grid linking to
`/tours/[slug]`.

## Requirements

- Destination image
- Description
- Location
- Things to do
- Places to visit
- Related tour packages
- Map

## Data

`Destination` with its `places` (all `Place`s where `destinationId`
matches) and `packages` (published `TourPackage`s where `destinationId`
matches).

## Technical Implementation

`getDestinationBySlug` (`src/server/destinations/actions.ts`) fetches the
destination with `places` (alphabetical) and `packages` (published only,
newest first). The page renders `PlacesMap`
(`src/components/map/PlacesMap.tsx`) — a simpler sibling of `JourneyMap`
with no route line or day-click sync, just markers + `fitBounds`, since a
destination isn't an ordered itinerary. Same token-less/empty-state
fallback pattern as `JourneyMap`.

## Dependencies

- Mapbox (`NEXT_PUBLIC_MAPBOX_TOKEN`)
- Places and (optionally) packages linked to the destination

## Known Gaps

- No destination cover image field/upload yet — `Destination` has no
  image relation wired into this page (Image handling is a separate,
  not-yet-built feature).
- No pagination on `/destinations` — fine at MVP scale.

## Edge Cases

- Destination with no places — map renders "No places added to this
  destination yet."; "Places to visit" section is omitted.
- Destination with no published packages — "Related tour packages"
  section is omitted.
- No Mapbox token — map renders the fallback message.

## Testing

Verified against the real database: the existing "Hill Country" test
destination (with 3 places and 1 published package) renders correctly at
`/destinations/[slug]` — all three places listed, the related package
linked, and the map container rendering (not the fallback, since a real
token is configured).

## Related Files

- `src/server/destinations/actions.ts` — `getDestinationBySlug`
- `src/components/map/PlacesMap.tsx`
- `src/app/(public)/destinations/page.tsx`, `src/app/(public)/destinations/[slug]/page.tsx`

## Change History

- Initial implementation.
