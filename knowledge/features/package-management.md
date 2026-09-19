# Feature: Package Management

## Purpose

Let admins create and maintain tour packages that travellers browse and
enquire about.

## User Experience

Admin fills a package form (name, duration, price, highlights,
included/excluded, images) and manages publish state. Travellers see the
result on the public package listing and detail pages.

## Requirements

- Create/edit/publish/unpublish/delete or archive packages.
- Upload and reorder package images (gallery + cover).
- Duration, price, highlights, included/excluded items.

## Data

`TourPackage`, `Image`.

## Technical Implementation

Next.js Server Actions for mutations, Prisma for persistence, Cloudinary
(or S3-compatible storage) for images, Zod validation.

## Dependencies

- Destinations/Places (for related content)
- Image storage provider

## Edge Cases

- Package with no images
- Package unpublished while it has pending enquiries
- Duplicate package name

## Testing

Unit tests for validation schemas; e2e test for create -> publish -> view
on public site.

## Related Files

`src/app/admin/tours/`, `src/server/tours/`, `src/components/admin/`.

## Change History

- Initial creation.
