# Frontend Architecture

- Next.js App Router, TypeScript strict mode, Tailwind CSS, shadcn/ui.
- Route groups: `src/app/(public)/...` for the public site, `src/app/admin/
  ...` for the admin panel, `src/app/api/...` for any route handlers that
  can't be a server action (e.g. webhooks).
- Shared UI primitives in `src/components/ui/`; feature components grouped
  by domain (`map/`, `tours/`, `destinations/`, `itinerary/`, `admin/`).
- Forms use React Hook Form + Zod resolvers, with schemas shared from
  `src/lib/validation/`.
