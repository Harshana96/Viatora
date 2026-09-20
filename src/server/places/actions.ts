"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { placeSchema } from "@/lib/validation/place";
import { slugify } from "@/lib/utils/slug";

export async function listPlaces() {
  return db.place.findMany({
    orderBy: { createdAt: "desc" },
    include: { destination: true },
  });
}

export async function getPlace(id: string) {
  return db.place.findUnique({
    where: { id },
    include: { images: { orderBy: { createdAt: "asc" } } },
  });
}

function parsePlaceForm(formData: FormData) {
  const name = String(formData.get("name") ?? "");
  const slug = String(formData.get("slug") ?? "").trim();

  return placeSchema.parse({
    name,
    slug: slug || slugify(name),
    description: String(formData.get("description") ?? ""),
    category: formData.get("category"),
    latitude: formData.get("latitude"),
    longitude: formData.get("longitude"),
    destinationId: formData.get("destinationId"),
  });
}

export async function createPlace(formData: FormData) {
  const data = parsePlaceForm(formData);
  await db.place.create({ data });
  revalidatePath("/admin/places");
  redirect("/admin/places");
}

export async function updatePlace(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const data = parsePlaceForm(formData);
  await db.place.update({ where: { id }, data });
  revalidatePath("/admin/places");
  redirect("/admin/places");
}

export async function deletePlace(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  await db.place.delete({ where: { id } });
  revalidatePath("/admin/places");
}
