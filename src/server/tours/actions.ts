"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { deleteImageFromCloudinary, uploadImageToCloudinary } from "@/lib/cloudinary";
import { db } from "@/lib/db";
import { slugify } from "@/lib/utils/slug";
import { tourPackageSchema } from "@/lib/validation/tour-package";

export async function listPackages() {
  return db.tourPackage.findMany({
    orderBy: { createdAt: "desc" },
    include: { destination: true },
  });
}

export async function getPackage(id: string) {
  return db.tourPackage.findUnique({
    where: { id },
    include: { images: { orderBy: { createdAt: "asc" } } },
  });
}

export async function listPublishedPackages() {
  return db.tourPackage.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    include: { destination: true },
  });
}

export async function getPackageBySlug(slug: string) {
  return db.tourPackage.findFirst({
    where: { slug, published: true },
    include: {
      destination: true,
      images: { orderBy: { createdAt: "asc" } },
      days: {
        orderBy: { dayNumber: "asc" },
        include: {
          hotel: true,
          places: {
            orderBy: { order: "asc" },
            include: { place: true },
          },
        },
      },
    },
  });
}

function parseList(raw: string): string[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function parsePackageForm(formData: FormData) {
  const name = String(formData.get("name") ?? "");
  const slug = String(formData.get("slug") ?? "").trim();
  const startingPriceRaw = String(formData.get("startingPrice") ?? "").trim();
  const coverImageUrlRaw = String(formData.get("coverImageUrl") ?? "").trim();
  const destinationIdRaw = String(formData.get("destinationId") ?? "").trim();

  const parsed = tourPackageSchema.parse({
    name,
    slug: slug || slugify(name),
    coverImageUrl: coverImageUrlRaw,
    durationDays: formData.get("durationDays"),
    startingPrice: startingPriceRaw || undefined,
    description: String(formData.get("description") ?? ""),
    highlights: parseList(String(formData.get("highlights") ?? "")),
    included: parseList(String(formData.get("included") ?? "")),
    excluded: parseList(String(formData.get("excluded") ?? "")),
    destinationId: destinationIdRaw,
    published: formData.get("published") === "on",
  });

  return {
    ...parsed,
    coverImageUrl: parsed.coverImageUrl || null,
    destinationId: parsed.destinationId || null,
  };
}

export async function createPackage(formData: FormData) {
  const data = parsePackageForm(formData);
  await db.tourPackage.create({ data });
  revalidatePath("/admin/tours");
  redirect("/admin/tours");
}

export async function updatePackage(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const data = parsePackageForm(formData);
  await db.tourPackage.update({ where: { id }, data });
  revalidatePath("/admin/tours");
  redirect("/admin/tours");
}

export async function deletePackage(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  await db.tourPackage.delete({ where: { id } });
  revalidatePath("/admin/tours");
}

export async function uploadPackageCoverImage(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const file = formData.get("file");

  if (!id || !(file instanceof File) || file.size === 0) {
    return;
  }

  const existing = await db.tourPackage.findUnique({
    where: { id },
    select: { coverImagePublicId: true },
  });

  const uploaded = await uploadImageToCloudinary(file);

  await db.tourPackage.update({
    where: { id },
    data: { coverImageUrl: uploaded.url, coverImagePublicId: uploaded.publicId },
  });

  if (existing?.coverImagePublicId) {
    await deleteImageFromCloudinary(existing.coverImagePublicId);
  }

  revalidatePath(`/admin/tours/${id}/edit`);
  revalidatePath("/admin/tours");
}

export async function togglePublish(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const current = await db.tourPackage.findUnique({
    where: { id },
    select: { published: true },
  });

  if (!current) {
    return;
  }

  await db.tourPackage.update({
    where: { id },
    data: { published: !current.published },
  });
  revalidatePath("/admin/tours");
}
