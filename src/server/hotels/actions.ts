"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { hotelSchema } from "@/lib/validation/hotel";

export async function listHotels() {
  return db.hotel.findMany({ orderBy: { name: "asc" } });
}

export async function listHotelsByIds(ids: string[]) {
  if (ids.length === 0) {
    return [];
  }
  return db.hotel.findMany({ where: { id: { in: ids } } });
}

export async function createHotel(formData: FormData) {
  const ratingRaw = String(formData.get("rating") ?? "").trim();

  const data = hotelSchema.parse({
    name: String(formData.get("name") ?? ""),
    location: String(formData.get("location") ?? ""),
    rating: ratingRaw || undefined,
  });

  await db.hotel.create({ data });
  revalidatePath("/admin/hotels");
  redirect("/admin/hotels");
}
