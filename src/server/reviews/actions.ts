"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { reviewSchema } from "@/lib/validation/review";

export async function listApprovedReviews(packageId: string) {
  return db.review.findMany({
    where: { packageId, approved: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function listPendingReviews() {
  return db.review.findMany({
    where: { approved: false },
    orderBy: { createdAt: "asc" },
    include: { package: true },
  });
}

export async function createReview(formData: FormData) {
  const packageId = String(formData.get("packageId") ?? "");
  const packageSlug = String(formData.get("packageSlug") ?? "");

  const data = reviewSchema.parse({
    packageId,
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    rating: formData.get("rating"),
    comment: String(formData.get("comment") ?? ""),
  });

  await db.review.create({ data });

  if (packageSlug) {
    revalidatePath(`/tours/${packageSlug}`);
    redirect(`/tours/${packageSlug}?reviewed=1`);
  }
}

export async function approveReview(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const review = await db.review.update({
    where: { id },
    data: { approved: true },
    include: { package: true },
  });

  revalidatePath("/admin/reviews");
  revalidatePath(`/tours/${review.package.slug}`);
}

export async function deleteReview(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const review = await db.review.delete({ where: { id }, include: { package: true } });

  revalidatePath("/admin/reviews");
  revalidatePath(`/tours/${review.package.slug}`);
}
