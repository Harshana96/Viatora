# Database Architecture

PostgreSQL + Prisma. See `prisma/schema.prisma` for the authoritative
schema.

```text
Destination
    |
    +---- Place
    |
    +---- TourPackage
              |
              +---- TourDay
                       |
                       +---- TourDayPlace
                                  |
                                  +---- Place
```

`Place` holds `latitude`/`longitude` and is the single source of truth for
location data, reused by destination pages, package itineraries, map
markers and route generation. Never duplicate coordinates elsewhere.

Pricing (`GroupSizeRange`, `Season`, `PricingRule`) hangs off
`TourPackage` the same way: a `PricingRule` is a
`(package, groupSizeRange, season) -> pricePerPerson` row, resolved by
`src/server/pricing/engine.ts` and never exposed to the customer as
individual line items — only the single resulting total.

`Review` also belongs to `TourPackage`. Anyone can submit one (no login),
but it's created with `approved: false` and stays invisible on the public
package page until an admin approves it from `/admin/reviews` — the same
draft/publish pattern as `TourPackage.published`.

## Delete behavior

`TourPackage` owns `TourDay` (-> `TourDayPlace`), `Image`, `PricingRule`,
and `Review` — deleting a package cascades and deletes all of them
(`onDelete: Cascade`). `Enquiry.packageId` is the one exception: deleting
a package sets it to `null` on any existing enquiries instead of deleting
them, since an enquiry is a business record that should survive its
package being removed (`onDelete: SetNull`, Prisma's implicit default for
an optional relation — not explicit in the migration SQL for that reason).

Every other relation in the schema (e.g. `Place.destinationId`,
`TourDay.hotelId`, `PricingRule.groupSizeRangeId`/`seasonId`) is left at
Prisma's default (`Restrict` for required relations): deleting a
`Destination`, `Hotel`, `GroupSizeRange` or `Season` still in use will
fail with a foreign key error rather than silently orphaning data.
