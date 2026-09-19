# Feature: Itinerary Builder

## Purpose

Let admins build a package's day-by-day itinerary, which drives both the
public itinerary view and the interactive map.

## User Experience

Admin adds days to a package; each day gets one or more places (with
activities, description, optional hotel).

## Requirements

- Add/reorder/remove days.
- Assign one or more places per day.
- Add activities, description, hotel per day-place.

## Data

`TourDay`, `TourDayPlace`, `Place`, `Hotel`.

## Technical Implementation

Server Actions backed by Prisma; itinerary order stored explicitly (e.g. an
`order` integer) so reordering doesn't rely on array index.

## Dependencies

- Places module (places must exist before being assigned)

## Edge Cases

- Day with no places assigned
- Place missing coordinates
- Reordering days with existing enquiries referencing the package

## Testing

Unit test day/place ordering logic; e2e test for building a 3-day
itinerary and viewing it on the public package page.

## Related Files

`src/app/admin/tours/`, `src/server/tours/`, `src/components/itinerary/`.

## Change History

- Initial creation.
