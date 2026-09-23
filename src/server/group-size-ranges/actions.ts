"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { groupSizeRangeSchema } from "@/lib/validation/group-size-range";

export async function listGroupSizeRanges() {
  return db.groupSizeRange.findMany({ orderBy: { order: "asc" } });
}

export async function createGroupSizeRange(formData: FormData) {
  const maxSizeRaw = String(formData.get("maxSize") ?? "").trim();

  const data = groupSizeRangeSchema.parse({
    label: String(formData.get("label") ?? ""),
    minSize: formData.get("minSize"),
    maxSize: maxSizeRaw || undefined,
    order: formData.get("order") || 0,
  });

  await db.groupSizeRange.create({ data: { ...data, maxSize: data.maxSize ?? null } });
  revalidatePath("/admin/group-sizes");
  redirect("/admin/group-sizes");
}

export async function deleteGroupSizeRange(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  await db.groupSizeRange.delete({ where: { id } });
  revalidatePath("/admin/group-sizes");
}
