"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { enquirySchema, enquiryUpdateSchema } from "@/lib/validation/enquiry";

export async function listEnquiries() {
  return db.enquiry.findMany({
    orderBy: { createdAt: "desc" },
    include: { package: true },
  });
}

export async function getEnquiry(id: string) {
  return db.enquiry.findUnique({
    where: { id },
    include: { package: true },
  });
}

export async function createEnquiry(formData: FormData) {
  const packageId = String(formData.get("packageId") ?? "").trim();
  const groupSizeRangeId = String(formData.get("groupSizeRangeId") ?? "").trim();
  const arrivalMonthRaw = String(formData.get("arrivalMonth") ?? "").trim();
  const estimatedTotalRaw = String(formData.get("estimatedTotal") ?? "").trim();
  const redirectTo = String(formData.get("redirectTo") ?? "").trim() || "/enquiry";

  const parsed = enquirySchema.parse({
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    preferredDate: String(formData.get("preferredDate") ?? "") || undefined,
    arrivalMonth: arrivalMonthRaw || undefined,
    travellersCount: formData.get("travellersCount"),
    groupSizeRangeId,
    packageId,
    estimatedTotal: estimatedTotalRaw || undefined,
    message: String(formData.get("message") ?? ""),
  });

  await db.enquiry.create({
    data: {
      name: parsed.name,
      email: parsed.email,
      phone: parsed.phone,
      preferredDate: parsed.preferredDate ?? null,
      arrivalMonth: parsed.arrivalMonth ?? null,
      travellersCount: parsed.travellersCount,
      groupSizeRangeId: parsed.groupSizeRangeId || null,
      packageId: parsed.packageId || null,
      estimatedTotal: parsed.estimatedTotal ?? null,
      message: parsed.message || null,
    },
  });

  redirect(`${redirectTo}?success=1`);
}

export async function updateEnquiry(formData: FormData) {
  const id = String(formData.get("id") ?? "");

  const parsed = enquiryUpdateSchema.parse({
    status: formData.get("status"),
    internalNotes: String(formData.get("internalNotes") ?? ""),
  });

  await db.enquiry.update({
    where: { id },
    data: {
      status: parsed.status,
      internalNotes: parsed.internalNotes || null,
    },
  });

  revalidatePath("/admin/enquiries");
  revalidatePath(`/admin/enquiries/${id}`);
}
