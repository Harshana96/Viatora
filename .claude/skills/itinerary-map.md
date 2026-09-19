# Skill: Itinerary + Map

Use when working on the interactive journey map or day-by-day itinerary.

1. Read `knowledge/features/interactive-map.md` and
   `knowledge/architecture/map-architecture.md`.
2. Derive both the itinerary list and the map markers/route from
   `TourDay` -> `TourDayPlace` -> `Place` (with `latitude`/`longitude`).
3. Never hand-maintain a separate array of map coordinates.
4. Implement day <-> marker highlight interaction in both directions.
5. Verify mobile layout (map above itinerary) and desktop layout
   (side-by-side).
