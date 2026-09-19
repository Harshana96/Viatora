# Development

```bash
npm install
cp .env.example .env   # fill in DATABASE_URL, Mapbox, Cloudinary keys
npx prisma migrate dev
npm run dev
```

- Lint: `npm run lint`
- Type check: `npx tsc --noEmit`
- Tests: `npm run test` (unit), `npm run test:e2e` (Playwright)

## Branching

- `main` — production, deploys to Vercel automatically.
- `feature/<name>` — one branch per feature; open a PR into `main`.
