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

Server Action validates with Zod and writes to `Enquiry` via Prisma. Admin
status changes are also Server Actions, behind admin auth.

## Dependencies

- Tour package data (for the selected package reference)

## Edge Cases

- Enquiry submitted for an unpublished/deleted package
- Invalid email/phone format
- Duplicate rapid submissions

## Testing

Unit test for the Zod schema; e2e test for submit -> appears in admin list.

## Related Files

`src/app/(public)/enquiry/`, `src/app/admin/enquiries/`,
`src/server/enquiries/`.

## Change History

- Initial creation.
