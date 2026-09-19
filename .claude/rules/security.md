# Security Rules

- Admin routes require authentication; never expose admin mutations to
  unauthenticated requests.
- Keep Mapbox and Cloudinary/S3 secret keys server-side only; only the
  public Mapbox token may reach the client.
- Never commit secrets — use `.env` (gitignored) and document required
  variables in `.env.example` and
  `knowledge/operations/environment-variables.md`.
- Validate and sanitize all enquiry form input server-side, even though it
  is also validated client-side.
