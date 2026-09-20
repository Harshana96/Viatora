# Feature: Admin Dashboard Stats

## Purpose

Give admins a quick at-a-glance view of content volume when they land on
`/admin/dashboard`.

## User Experience

Four stat cards: total packages, destinations, places, and enquiries.

## Requirements

- Total packages
- Total destinations
- Total places
- Total enquiries

## Data

Simple `count()` queries against `TourPackage`, `Destination`, `Place`,
`Enquiry` — no new fields or relations.

## Technical Implementation

`getDashboardStats()` (`src/server/dashboard/actions.ts`) runs the four
counts in parallel via `Promise.all` and returns a plain object; the
dashboard page (`src/app/admin/dashboard/page.tsx`) renders one
`StatCard` (`src/components/admin/StatCard.tsx`) per value. No caching —
counts are always current since the page is `force-dynamic`.

## Dependencies

- None beyond the existing Prisma models.

## Edge Cases

- Empty database — counts just render as `0`, no special-casing needed.

## Testing

Verified against the real database: confirmed the four `count()` queries
return the same numbers as manually counting the rows, and that
`/admin/dashboard` is still protected by the existing auth middleware.

## Related Files

- `src/server/dashboard/actions.ts`
- `src/components/admin/StatCard.tsx`
- `src/app/admin/dashboard/page.tsx`

## Change History

- Initial implementation.
