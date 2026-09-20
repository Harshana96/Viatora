# Development

```bash
npm install
cp .env.example .env   # fill in DATABASE_URL, Mapbox, Cloudinary keys, AUTH_SECRET
npx prisma migrate dev
npm run create-admin -- admin@example.com yourpassword "Your Name"
npm run dev
```

- Lint: `npm run lint`
- Type check: `npx tsc --noEmit`
- Unit tests: `npm run test` (Vitest, `tests/unit/`) — pure logic only
  (Zod validation schemas, `slugify`, haversine distance). No DB, no
  server, runs in milliseconds.
- E2E tests: `npm run test:e2e` (Playwright, `tests/e2e/`) — drives a real
  Chromium browser against the app (starts `npm run dev` itself if nothing
  is already listening on port 3000, per `playwright.config.ts`). Covers
  public pages, search/filters, the enquiry form, and the full admin
  login/logout flow. `tests/e2e/global-setup.ts` seeds its own admin user
  and a published destination/package before the run and
  `global-teardown.ts` deletes them after — the suite is hermetic and
  doesn't depend on or pollute whatever else is in your database.
- Create/reset an admin login: `npm run create-admin -- <email> <password> [name]`
  (upserts a `User` row with a bcrypt-hashed password — there is no public
  admin signup flow by design)

## Branching

- `main` — production, deploys to Vercel automatically.
- `feature/<name>` — one branch per feature; open a PR into `main`.
