// Server-only Cloudinary configuration placeholder. Fill in once the image
// upload flow is implemented (see knowledge/features/package-management.md).
export function getCloudinaryConfig() {
  return {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME ?? "",
    apiKey: process.env.CLOUDINARY_API_KEY ?? "",
    apiSecret: process.env.CLOUDINARY_API_SECRET ?? "",
  };
}
