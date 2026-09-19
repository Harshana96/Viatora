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
