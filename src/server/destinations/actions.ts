"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { destinationSchema } from "@/lib/validation/destination";
import { slugify } from "@/lib/utils/slug";

export async function listDestinations() {
  return db.destination.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getDestination(id: string) {
  return db.destination.findUnique({
    where: { id },
    include: { images: { orderBy: { createdAt: "asc" } } },
  });
}

export async function getDestinationBySlug(slug: string) {
  return db.destination.findUnique({
    where: { slug },
    include: {
      places: { orderBy: { name: "asc" } },
      images: { orderBy: { createdAt: "asc" } },
      packages: { where: { published: true }, orderBy: { createdAt: "desc" } },
    },
  });
}

export async function listDestinationOptions() {
  return db.destination.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
}

function parseThingsToDo(raw: string): string[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseDestinationForm(formData: FormData) {
  const name = String(formData.get("name") ?? "");
  const slug = String(formData.get("slug") ?? "").trim();

  return destinationSchema.parse({
    name,
    slug: slug || slugify(name),
    description: String(formData.get("description") ?? ""),
    location: String(formData.get("location") ?? ""),
    thingsToDo: parseThingsToDo(String(formData.get("thingsToDo") ?? "")),
    latitude: formData.get("latitude"),
    longitude: formData.get("longitude"),
  });
}

export async function createDestination(formData: FormData) {
  const data = parseDestinationForm(formData);
  await db.destination.create({ data });
  revalidatePath("/admin/destinations");
  redirect("/admin/destinations");
}

export async function updateDestination(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const data = parseDestinationForm(formData);
  await db.destination.update({ where: { id }, data });
  revalidatePath("/admin/destinations");
  redirect("/admin/destinations");
}

export async function deleteDestination(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  await db.destination.delete({ where: { id } });
  revalidatePath("/admin/destinations");
}
