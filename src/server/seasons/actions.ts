"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { seasonSchema } from "@/lib/validation/season";

export async function listSeasons() {
  return db.season.findMany({ orderBy: { order: "asc" } });
}

export async function createSeason(formData: FormData) {
  const months = formData
    .getAll("months")
    .map((value) => Number(value))
    .filter((value) => !Number.isNaN(value));

  const data = seasonSchema.parse({
    name: String(formData.get("name") ?? ""),
    months,
    order: formData.get("order") || 0,
  });

  await db.season.create({ data });
  revalidatePath("/admin/seasons");
  redirect("/admin/seasons");
}

export async function deleteSeason(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  await db.season.delete({ where: { id } });
  revalidatePath("/admin/seasons");
}
