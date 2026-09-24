# Deployment

- **Live production URL:** https://viatora-x6of.vercel.app/
- Hosting: Vercel, deploying the `main` branch to production. Project
  imported from GitHub (`Harshana96/Viatora`); every merge to `main`
  auto-deploys.
- Database: Neon (serverless Postgres), reachable via `DATABASE_URL` using
  the **pooled** connection string (hostname has a `-pooler` suffix) —
  required for Vercel's serverless functions to avoid exhausting Postgres
  connections under concurrent requests.
- Environment variables set in Vercel project settings: `DATABASE_URL`,
  `NEXT_PUBLIC_MAPBOX_TOKEN`, `CLOUDINARY_CLOUD_NAME`,
  `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `AUTH_SECRET` (a
  **different** secret from the local `.env`'s — never reuse a dev secret
  in production). `MAPBOX_SECRET_TOKEN` is not set (Directions API works
  fine with the public token).
- Before the first deploy: ran `prisma migrate deploy` against the
  production `DATABASE_URL` from a local machine (Neon is reachable from
  anywhere, no VPC restrictions) to create the schema, then ran
  `npm run create-admin -- <email> <password> [name]` against the same
  `DATABASE_URL` to provision the first real admin login.
- `package.json`'s `build` script is `prisma migrate deploy && prisma
  generate && next build`, so every Vercel build (production **and**
  preview deployments) applies any pending migrations to whatever
  `DATABASE_URL` is configured for that environment before building.
  This was **not** the case initially — the build script was plain `next
  build`, relying on someone remembering to run `prisma migrate deploy`
  against production manually before merging. That step was missed
  across several PRs, so the production database silently drifted out of
  sync with the schema (missing columns/tables) until a build finally
  failed trying to statically prerender a page whose data fetch hit the
  missing column. Fixed by automating it instead of relying on memory.
  Caveat: if preview deployments ever point at a different/staging
  `DATABASE_URL` than production, this applies pending migrations there
  automatically too, which is intended — just be aware an open PR's
  migration lands on first build/preview, not at merge time.
- Feature branches get Vercel preview deployments; merge to `main` only
  after review.

## Known deployment issue (fixed)

The first deploy attempt failed with `The Edge Function "_middleware" size
is 1.03 MB and your plan size limit is 1 MB.` Cause and fix documented in
`knowledge/features/admin-authentication.md` ("Fixed Issue: Edge Function
size on Vercel") — `src/middleware.ts` was pulling bcrypt + Prisma into
the Edge bundle via the full Auth.js config; fixed by splitting into an
edge-safe `auth.config.ts` (no providers) used only by middleware.
