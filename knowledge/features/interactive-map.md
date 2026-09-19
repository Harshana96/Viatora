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

Client component reads the same day/place data used to render the
itinerary list; no separate map data file. Optionally call Mapbox
Directions API for route distance/geometry.

## Dependencies

- Mapbox
- Tour package data
- Places

## Edge Cases

- Package has one location (no route line to draw)
- Location has missing coordinates
- Route API fails
- Invalid coordinates

## Testing

Component test for marker/day highlight sync; manual/e2e check on mobile
viewport.

## Related Files

`src/components/map/`, `src/components/itinerary/`, `src/lib/mapbox.ts`.

## Change History

- Initial creation.
