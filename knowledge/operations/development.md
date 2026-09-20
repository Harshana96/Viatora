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
- Tests: `npm run test` (unit), `npm run test:e2e` (Playwright)
- Create/reset an admin login: `npm run create-admin -- <email> <password> [name]`
  (upserts a `User` row with a bcrypt-hashed password — there is no public
  admin signup flow by design)

## Branching

- `main` — production, deploys to Vercel automatically.
- `feature/<name>` — one branch per feature; open a PR into `main`.
