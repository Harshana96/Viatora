"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { tourDayPlaceSchema } from "@/lib/validation/tour-day-place";
import { tourDaySchema } from "@/lib/validation/tour-day";

export async function listDays(packageId: string) {
  return db.tourDay.findMany({
    where: { packageId },
    orderBy: { dayNumber: "asc" },
    include: {
      hotel: true,
      places: {
        orderBy: { order: "asc" },
        include: { place: true },
      },
    },
  });
}

export async function getDay(id: string) {
  return db.tourDay.findUnique({ where: { id } });
}

function parseDayForm(formData: FormData) {
  const parsed = tourDaySchema.parse({
    packageId: String(formData.get("packageId") ?? ""),
    dayNumber: formData.get("dayNumber"),
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    hotelId: String(formData.get("hotelId") ?? "").trim(),
  });

  return {
    packageId: parsed.packageId,
    dayNumber: parsed.dayNumber,
    title: parsed.title || null,
    description: parsed.description || null,
    hotelId: parsed.hotelId || null,
  };
}

export async function createDay(formData: FormData) {
  const data = parseDayForm(formData);
  await db.tourDay.create({ data });
  revalidatePath(`/admin/tours/${data.packageId}/itinerary`);
  redirect(`/admin/tours/${data.packageId}/itinerary`);
}

export async function updateDay(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const data = parseDayForm(formData);
  await db.tourDay.update({ where: { id }, data });
  revalidatePath(`/admin/tours/${data.packageId}/itinerary`);
  redirect(`/admin/tours/${data.packageId}/itinerary`);
}

export async function deleteDay(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const packageId = String(formData.get("packageId") ?? "");
  await db.tourDay.delete({ where: { id } });
  revalidatePath(`/admin/tours/${packageId}/itinerary`);
  redirect(`/admin/tours/${packageId}/itinerary`);
}

function parseActivities(raw: string): string[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export async function addPlaceToDay(formData: FormData) {
  const packageId = String(formData.get("packageId") ?? "");
  const tourDayId = String(formData.get("tourDayId") ?? "");

  const data = tourDayPlaceSchema.parse({
    tourDayId,
    placeId: formData.get("placeId"),
    activities: parseActivities(String(formData.get("activities") ?? "")),
  });

  const existingCount = await db.tourDayPlace.count({ where: { tourDayId } });

  await db.tourDayPlace.create({
    data: { ...data, order: existingCount },
  });
  revalidatePath(`/admin/tours/${packageId}/itinerary`);
}

export async function removeDayPlace(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const packageId = String(formData.get("packageId") ?? "");
  await db.tourDayPlace.delete({ where: { id } });
  revalidatePath(`/admin/tours/${packageId}/itinerary`);
}
