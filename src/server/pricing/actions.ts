"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { pricingRuleSchema } from "@/lib/validation/pricing-rule";

export async function listPricingRules(packageId: string) {
  return db.pricingRule.findMany({
    where: { packageId },
    orderBy: [{ season: { order: "asc" } }, { groupSizeRange: { order: "asc" } }],
    include: { groupSizeRange: true, season: true },
  });
}

export async function createPricingRule(formData: FormData) {
  const packageId = String(formData.get("packageId") ?? "");

  const data = pricingRuleSchema.parse({
    packageId,
    groupSizeRangeId: String(formData.get("groupSizeRangeId") ?? ""),
    seasonId: String(formData.get("seasonId") ?? ""),
    pricePerPerson: formData.get("pricePerPerson"),
  });

  await db.pricingRule.upsert({
    where: {
      packageId_groupSizeRangeId_seasonId: {
        packageId: data.packageId,
        groupSizeRangeId: data.groupSizeRangeId,
        seasonId: data.seasonId,
      },
    },
    update: { pricePerPerson: data.pricePerPerson },
    create: data,
  });

  revalidatePath(`/admin/tours/${packageId}/pricing`);
}

export async function deletePricingRule(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const packageId = String(formData.get("packageId") ?? "");
  await db.pricingRule.delete({ where: { id } });
  revalidatePath(`/admin/tours/${packageId}/pricing`);
}
