import { v2 as cloudinary } from "cloudinary";

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET,
  );
}

function configureCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export type UploadedImage = {
  url: string;
  publicId: string;
};

/**
 * Uploads an image file to Cloudinary. Throws if Cloudinary isn't
 * configured or the upload fails — callers should surface that as a form
 * error rather than silently dropping the image.
 */
export async function uploadImageToCloudinary(file: File): Promise<UploadedImage> {
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary is not configured (missing CLOUDINARY_* environment variables)");
  }

  configureCloudinary();

  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

  const result = await cloudinary.uploader.upload(base64, {
    folder: "viatora",
  });

  return { url: result.secure_url, publicId: result.public_id };
}

/** Deletes an image from Cloudinary. Safe to call even if the asset was
 * already removed — Cloudinary treats that as a no-op, not an error. */
export async function deleteImageFromCloudinary(publicId: string): Promise<void> {
  if (!isCloudinaryConfigured()) {
    return;
  }

  configureCloudinary();
  await cloudinary.uploader.destroy(publicId);
}
