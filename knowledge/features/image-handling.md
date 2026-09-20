# Feature: Image Handling

## Purpose

Let admins attach real photos to destinations, places, and packages
(gallery images), plus a distinguished cover image for packages, instead
of manually pasting URLs.

## User Experience

Each of the three admin edit pages (`/admin/destinations/[id]/edit`,
`/admin/places/[id]/edit`, `/admin/tours/[id]/edit`) has an "Images"
section: existing images as thumbnails with a "Remove" button, and an
upload form below (file input + optional alt text). The package edit page
additionally has a "Cover image" section above the gallery, showing the
current cover (if any) and a one-file upload form that replaces it.

On the public side, `/tours/[slug]` shows the cover image at the top and
a gallery grid; `/tours` list cards show the cover thumbnail;
`/destinations/[slug]` shows the first uploaded image as a hero and any
remaining images as a gallery grid.

## Requirements

- Upload images for destinations, places, and packages (gallery).
- A distinct, replaceable cover image for packages.
- Deleting an image removes it from both the database and Cloudinary
  (no orphaned storage).
- Keep API keys server-side — uploads go through a Server Action, never
  directly from the browser to Cloudinary.

## Data

`Image` (`url`, `publicId`, `alt`, one of `destinationId`/`placeId`/
`packageId`). `TourPackage.coverImageUrl` / `coverImagePublicId` for the
package cover specifically (not part of the `Image` gallery table, since
it's a single distinguished slot, not a list item).

## Technical Implementation

- `src/lib/cloudinary.ts`: `uploadImageToCloudinary(file)` converts the
  uploaded `File` to a base64 data URI and calls the Cloudinary Node SDK's
  `uploader.upload` (folder `viatora`); `deleteImageFromCloudinary(publicId)`
  calls `uploader.destroy`. `isCloudinaryConfigured()` checks the three
  `CLOUDINARY_*` env vars are set; both functions throw/no-op gracefully
  when they aren't (see Edge Cases).
- `src/server/images/actions.ts`: `uploadGalleryImage`/`deleteGalleryImage`
  are generic over `ImageOwnerType` (`"destination" | "place" | "package"`),
  mapping to the right FK column and admin edit-page path to revalidate.
- `uploadPackageCoverImage` (`src/server/tours/actions.ts`) is separate
  from the gallery actions because it updates two columns on `TourPackage`
  directly (not an `Image` row), and deletes the *previous* Cloudinary
  asset after a successful re-upload so replacing a cover doesn't leak
  storage.
- `GalleryUploadForm`/`GalleryList` (`src/components/admin/`) are the
  shared UI, reused across all three edit pages.
- `next.config.ts` allows `res.cloudinary.com` via `images.remotePatterns`
  so `next/image` can optimize the uploaded URLs on public pages.
- `PackageForm`'s old free-text "Cover image URL" input was replaced with
  a hidden field carrying the existing value through, since the cover is
  now only ever set via the dedicated upload action — otherwise saving
  unrelated package fields would wipe it out.

## Dependencies

- `cloudinary` npm package
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

## Edge Cases

- Cloudinary not configured — `uploadImageToCloudinary` throws a clear
  error (surfaces as Next's default error boundary; no silent failure);
  `deleteImageFromCloudinary` is a safe no-op so deleting the DB `Image`
  row still works even without credentials.
- No file selected / empty file — both upload actions just return early,
  no DB write.
- Deleting an image whose Cloudinary asset was already removed — treated
  as success by Cloudinary's `destroy` API, not an error.
- Replacing a package's cover image — the old Cloudinary asset is deleted
  only after the new upload succeeds (avoids leaving the package with no
  cover if the new upload fails).

## Testing

Verified against the real database (not yet against live Cloudinary — no
credentials configured in this environment): confirmed `isCloudinaryConfigured()`
correctly reports `false` currently; inserted `Image` rows directly (using
`res.cloudinary.com` URLs) for the existing "Hill Country" destination and
"Colombo to Ella Explorer" package, confirmed the relations resolve via
`getDestination`/`getPackage`/`getDestinationBySlug`/`getPackageBySlug`,
and confirmed both public pages render the image through `next/image`
without a "host not configured" error (proving the `remotePatterns` setup
is correct) before cleaning the test rows up. Live upload/delete against
real Cloudinary still needs verification once credentials are added.

## Related Files

- `src/lib/cloudinary.ts`
- `src/server/images/actions.ts`
- `src/server/tours/actions.ts` — `uploadPackageCoverImage`
- `src/components/admin/GalleryUploadForm.tsx`, `GalleryList.tsx`
- `src/app/admin/destinations/[id]/edit/page.tsx`,
  `src/app/admin/places/[id]/edit/page.tsx`,
  `src/app/admin/tours/[id]/edit/page.tsx`
- `src/app/(public)/tours/page.tsx`, `src/app/(public)/tours/[slug]/page.tsx`,
  `src/app/(public)/destinations/[slug]/page.tsx`
- `next.config.ts` — `images.remotePatterns`

## Change History

- Initial implementation.
