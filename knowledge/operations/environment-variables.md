# Environment Variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string (Prisma) |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Public Mapbox GL JS token (client-side) |
| `MAPBOX_SECRET_TOKEN` | Server-side Mapbox token, e.g. for Directions API |
| `CLOUDINARY_URL` or `CLOUDINARY_CLOUD_NAME`/`CLOUDINARY_API_KEY`/`CLOUDINARY_API_SECRET` | Image storage |
| `NEXTAUTH_SECRET` / auth provider keys | Admin authentication |

See `.env.example` for the current template. Never commit real values.
