# Architecture Rules

- Single Next.js application (App Router) serving both the public site and
  the admin panel. No separate backend service or microservices for the MVP.
- Data flow: Browser -> Next.js (Public + Admin) -> Application/Server layer
  -> Prisma ORM -> PostgreSQL.
- External services: Mapbox (maps), Cloudinary or S3-compatible storage
  (images).
- Server Actions / Route Handlers are the default way to mutate data; avoid
  introducing a separate API framework.
- All map and itinerary UI must be generated from `Place` / `TourDay` data —
  never hard-code coordinates or itinerary text in components.
