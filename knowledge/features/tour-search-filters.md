# Feature: Tour Search & Filters

## Purpose

Let travellers narrow the `/tours` listing by keyword, destination,
duration, travel type, and approximate budget, per the spec's "Tour
Packages" feature list.

## User Experience

`/tours` has a filter bar above the results: a search box, and dropdowns
for destination, duration, travel type, and budget. It's a plain GET
form — submitting re-navigates to `/tours?query=...&destination=...&...`,
so it works without JavaScript and filters are shareable/bookmarkable
URLs. A "Clear filters" link appears once any filter is active.

## Requirements

- Search by name/description keyword.
- Filter by destination.
- Filter by duration (bucketed: 1-3 / 4-7 / 8+ days).
- Filter by travel type.
- Filter by approximate budget (bucketed: <$500 / $500-1000 / $1000-2000 /
  $2000+).
- Invalid/garbage filter values must not crash the page.

## Data

`TourPackage.travelType` (new `TravelType` enum: `ADVENTURE`, `CULTURAL`,
`BEACH`, `WILDLIFE`, `HONEYMOON`, `FAMILY`, `WELLNESS`) — the spec calls
for a "travel type" filter but the schema had no field for it, so this was
added. It's optional on `TourPackage` and editable via `PackageForm`.

## Technical Implementation

- `listPublishedPackages(filters)` (`src/server/tours/actions.ts`) builds
  a `Prisma.TourPackageWhereInput` from the given filters: `query` does a
  case-insensitive `contains` on `name` OR `description`; `duration`/
  `budget` are named buckets (`DurationBucket`/`BudgetBucket` types) mapped
  to `gte`/`lte` ranges on `durationDays`/`startingPrice`; `destinationId`/
  `travelType` are direct equality. All filters are optional and combine
  with AND.
- `/tours` (`src/app/(public)/tours/page.tsx`) reads `searchParams`,
  narrows each raw string to its valid type with a guard function
  (`isDurationBucket`, `isBudgetBucket`, `isTravelType`) before passing it
  to `listPublishedPackages` — an invalid/garbage value is silently
  treated as "no filter" rather than throwing.
- `travelTypeLabels` (`src/lib/travel-type.ts`) is the single source for
  the enum's display labels, shared between `PackageForm` (admin) and the
  `/tours` filter bar (public) so they can't drift.

## Dependencies

- None beyond existing Prisma models; `listDestinationOptions` for the
  destination dropdown.

## Edge Cases

- No packages match the combined filters — "No tour packages match your
  filters." message, no crash.
- Invalid enum/bucket value in the URL (e.g. hand-edited
  `?travelType=NOT_REAL`) — handled: guard functions fall through to
  "no filter" instead of passing an invalid value to Prisma.
- Package with no `startingPrice` — excluded from any budget filter (a
  `null` doesn't satisfy `gte`/`lt`), included when no budget filter is
  applied.

## Testing

Verified against the real database: set `travelType: ADVENTURE` on the
existing "Colombo to Ella Explorer" test package (3 days, $899) and ran
12 filter combinations against the live `/tours` endpoint — matching
travel type/duration/budget/destination/query all correctly included it,
non-matching values correctly excluded it, and combined filters worked
both when they agreed and when they conflicted. Also confirmed garbage
values for `travelType`/`duration`/`budget` return 200 without crashing.

## Related Files

- `src/server/tours/actions.ts` — `listPublishedPackages`, `PackageFilters`
- `src/app/(public)/tours/page.tsx`
- `src/lib/travel-type.ts`
- `src/components/admin/PackageForm.tsx` — travel type field
- `prisma/schema.prisma` — `TravelType` enum, `TourPackage.travelType`

## Change History

- Initial implementation.
