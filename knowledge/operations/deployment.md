# Deployment

- Hosting: Vercel, deploying the `main` branch to production.
- Database: managed PostgreSQL (e.g. Neon/Supabase/RDS) reachable via
  `DATABASE_URL`.
- Run `npx prisma migrate deploy` as part of the deployment pipeline before
  the app serves traffic on a new schema version.
- Feature branches get Vercel preview deployments; merge to `main` only
  after review.
