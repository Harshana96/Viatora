"use server";

import { revalidatePath } from "next/cache";

import { deleteImageFromCloudinary, uploadImageToCloudinary } from "@/lib/cloudinary";
import { db } from "@/lib/db";

export type ImageOwnerType = "destination" | "place" | "package";

const ownerFieldMap: Record<ImageOwnerType, "destinationId" | "placeId" | "packageId"> = {
  destination: "destinationId",
  place: "placeId",
  package: "packageId",
};

const ownerEditPathMap: Record<ImageOwnerType, (id: string) => string> = {
  destination: (id) => `/admin/destinations/${id}/edit`,
  place: (id) => `/admin/places/${id}/edit`,
  package: (id) => `/admin/tours/${id}/edit`,
};

function isImageOwnerType(value: string): value is ImageOwnerType {
  return value === "destination" || value === "place" || value === "package";
}

export async function uploadGalleryImage(formData: FormData) {
  const ownerType = String(formData.get("ownerType") ?? "");
  const ownerId = String(formData.get("ownerId") ?? "");
  const alt = String(formData.get("alt") ?? "").trim();
  const file = formData.get("file");

  if (!isImageOwnerType(ownerType) || !ownerId || !(file instanceof File) || file.size === 0) {
    return;
  }

  const uploaded = await uploadImageToCloudinary(file);

  await db.image.create({
    data: {
      url: uploaded.url,
      publicId: uploaded.publicId,
      alt: alt || null,
      [ownerFieldMap[ownerType]]: ownerId,
    },
  });

  revalidatePath(ownerEditPathMap[ownerType](ownerId));
}

export async function deleteGalleryImage(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const ownerType = String(formData.get("ownerType") ?? "");
  const ownerId = String(formData.get("ownerId") ?? "");

  const image = await db.image.findUnique({ where: { id } });
  if (!image) {
    return;
  }

  await deleteImageFromCloudinary(image.publicId);
  await db.image.delete({ where: { id } });

  if (isImageOwnerType(ownerType) && ownerId) {
    revalidatePath(ownerEditPathMap[ownerType](ownerId));
  }
}
