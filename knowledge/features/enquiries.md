# Feature: Enquiries

## Purpose

Let travellers express interest in a package without an online payment
flow, and let admins follow up.

## User Experience

Visitor submits name, email, WhatsApp/phone, preferred travel date, number
of travellers, selected package, and a message. Admin sees enquiries in a
list, opens details, changes status, and adds internal notes.

## Requirements

- Public enquiry form with validation.
- Admin list + detail view.
- Status: NEW, CONTACTED, IN_PROGRESS, COMPLETED, CANCELLED.
- Internal notes (not visible to the traveller).

## Data

`Enquiry` (references `TourPackage`).

## Technical Implementation

- `enquirySchema` / `enquiryUpdateSchema` (`src/lib/validation/enquiry.ts`)
  validate the public submission and the admin status/notes update
  respectively; `enquiryUpdateSchema.status` uses `z.nativeEnum(EnquiryStatus)`
  from the generated Prisma client so it can't drift from the DB enum.
- `createEnquiry` (`src/server/enquiries/actions.ts`) is a public Server
  Action (no auth) invoked directly from the `/enquiry` form; on success it
  redirects to `/enquiry?success=1`, which the same page reads to show a
  thank-you message instead of the form.
- The enquiry form pre-selects a package via `?package=<id>` in the URL —
  the "Enquire about this tour" link on `/tours/[slug]` sets this.
- `updateEnquiry` is behind `/admin/*` (protected by the existing
  middleware) and updates `status` + `internalNotes` together from one
  form on the enquiry detail page; it does not touch traveller-supplied
  fields.
- `listEnquiries`/`getEnquiry` include the related `package` so the admin
  list/detail views can show the package name without a second query.

## Dependencies

- Tour package data (for the selected package reference)
- Admin authentication (protects the update path)

## Edge Cases

- Enquiry submitted for an unpublished/deleted package — handled:
  `packageId` is optional and nullable, so a general enquiry (no package)
  or a package that's later deleted (FK would block the package's own
  deletion first, per existing Restrict behavior) doesn't break the
  enquiry record.
- Invalid email/phone format — handled by `enquirySchema` (email format,
  minimum phone length); Zod throws and the Server Action surfaces Next's
  default error boundary rather than a friendly inline message (no custom
  error UI yet).
- Duplicate rapid submissions — not handled; no dedupe/rate-limit.

## Testing

Verified against the real Postgres database: created an `Enquiry` row with
the same shape `createEnquiry` produces, confirmed `listEnquiries` and the
status/notes update both work, and validated `enquirySchema`/
`enquiryUpdateSchema` against representative valid and invalid input.
Confirmed `/admin/enquiries` and `/admin/enquiries/[id]` are protected by
the existing auth middleware (307 redirect when signed out) and that
`/enquiry` renders all expected form fields. No automated test yet.

## Related Files

`src/app/(public)/enquiry/`, `src/app/admin/enquiries/`,
`src/server/enquiries/`.

## Change History

- Initial creation.
- Implemented: public enquiry form with package pre-select and thank-you
  state, admin list + detail/status/notes update, both wired to the real
  `Enquiry` model.
