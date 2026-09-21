# Feature: Homepage

## Purpose

Landing page that surfaces real content (not marketing copy alone) and
routes visitors into the two main public flows: browsing packages and
browsing destinations.

## User Experience

Server-rendered sections in order, per the spec: Hero → Search/discover →
Popular tour packages → Popular destinations → Travel categories → Why
Sri Lanka → Call to action. Sections backed by empty data (no published
packages/destinations yet) are simply omitted rather than showing an
empty state — a homepage with zero content sections is still a coherent
page (hero + search + categories + why Sri Lanka + CTA all remain static).

## Requirements

- Hero section.
- Search / discover tours.
- Popular tour packages.
- Popular destinations.
- Travel categories.
- Why Sri Lanka.
- Call to action.

## Data

`TourPackage` (published, newest 6) and `Destination` (newest 6, with
first gallery image) — same models as `/tours` and `/destinations`, no
new fields. "Popular" is approximated as "most recently created" since
there's no view/booking metric to rank by yet; revisit if a real
popularity signal is added later.

## Technical Implementation

- Plain Server Component (`src/app/(public)/page.tsx`), `force-dynamic`,
  fetches `listPublishedPackages({ take: 6 })` and
  `listPopularDestinations(6)` (new function in
  `src/server/destinations/actions.ts`) in parallel.
- Search box is a plain `<form action="/tours">` (GET, no JS) — same
  progressive-enhancement pattern as the `/tours` filter bar.
- Travel category tiles link to `/tours?travelType=<value>`, reusing
  `travelTypeLabels` (`src/lib/travel-type.ts`) — the same source `/tours`
  and `PackageForm` use, so the list can't drift.
- "Why Sri Lanka" is static, hand-written copy (no DB dependency) —
  deliberately generic/evergreen content, not specific claims that could
  go stale or be wrong.
- Extracted `PackageCard` (`src/components/tours/PackageCard.tsx`) and
  `DestinationCard` (`src/components/destinations/DestinationCard.tsx`)
  from what was previously inline JSX duplicated between `/tours` and
  `/destinations`; both listing pages and the homepage now share them —
  filling the `src/components/tours/` and `src/components/destinations/`
  folders that existed from the initial scaffold but were unused until
  now.

## Dependencies

- Tour package and destination data
- `travelTypeLabels`

## Edge Cases

- No published packages — "Popular Tour Packages" section omitted
  entirely (not an empty-state message; the rest of the homepage still
  makes sense without it).
- No destinations — "Popular Destinations" section omitted.
- Destination with no images — its card just shows no image (same
  fallback as `DestinationCard` everywhere else).

## Testing

Verified against real data: locally, the existing "Colombo to Ella
Explorer" package and "Hill Country" destination render correctly in
their respective sections. Added 3 new e2e tests (in
`tests/e2e/public-pages.spec.ts`, using the existing hermetic seed data)
covering the popular-packages/destinations/travel-categories sections
rendering, the search box navigating to a filtered `/tours` URL, and a
travel-category tile linking to the correct filtered URL. Full suite
(42 unit + 15 e2e, up from 12) passes.

## Related Files

- `src/app/(public)/page.tsx`
- `src/components/tours/PackageCard.tsx`, `src/components/destinations/DestinationCard.tsx`
- `src/server/destinations/actions.ts` — `listPopularDestinations`
- `src/server/tours/actions.ts` — `listPublishedPackages` (`take` option)
- `tests/e2e/public-pages.spec.ts`

## Change History

- Initial implementation.
