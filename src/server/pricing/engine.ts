import { db } from "@/lib/db";

export async function resolveSeasonForMonth(month: number) {
  const seasons = await db.season.findMany();
  return seasons.find((season) => season.months.includes(month)) ?? null;
}

export async function getEstimatedTotal({
  packageId,
  groupSizeRangeId,
  month,
}: {
  packageId: string;
  groupSizeRangeId: string;
  month: number;
}) {
  const season = await resolveSeasonForMonth(month);
  if (!season) {
    return null;
  }

  const rule = await db.pricingRule.findUnique({
    where: {
      packageId_groupSizeRangeId_seasonId: {
        packageId,
        groupSizeRangeId,
        seasonId: season.id,
      },
    },
  });

  if (!rule) {
    return null;
  }

  return { pricePerPerson: Number(rule.pricePerPerson), season };
}
