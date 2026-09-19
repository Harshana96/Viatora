# Database Rules

- PostgreSQL via Prisma ORM. Schema lives in `prisma/schema.prisma`.
- Core entities: User, Destination, Place, TourPackage, TourDay,
  TourDayPlace, Hotel, Image, Enquiry.
- `Place` is the single source of truth for coordinates (`latitude`,
  `longitude`). Destination pages, itinerary, map markers and route
  generation must all read from `Place`, never from a duplicated copy.
- Any schema change requires a Prisma migration committed alongside the
  change, and an update to `knowledge/architecture/database.md` if the
  change affects relationships.
