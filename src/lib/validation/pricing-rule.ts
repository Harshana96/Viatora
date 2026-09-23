import { z } from "zod";

export const pricingRuleSchema = z.object({
  packageId: z.string().min(1),
  groupSizeRangeId: z.string().min(1, "Group size is required"),
  seasonId: z.string().min(1, "Season is required"),
  pricePerPerson: z.coerce.number().min(0, "Price must be 0 or more"),
});

export type PricingRuleInput = z.infer<typeof pricingRuleSchema>;
