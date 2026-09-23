import { z } from "zod";

export const seasonSchema = z.object({
  name: z.string().min(1, "Name is required"),
  months: z
    .array(z.coerce.number().int().min(1).max(12))
    .min(1, "Select at least one month"),
  order: z.coerce.number().int().default(0),
});

export type SeasonInput = z.infer<typeof seasonSchema>;
