import { z } from "zod";

export const groupSizeRangeSchema = z.object({
  label: z.string().min(1, "Label is required"),
  minSize: z.coerce.number().int().min(1, "Minimum size must be at least 1"),
  maxSize: z.coerce.number().int().min(1).optional(),
  order: z.coerce.number().int().default(0),
});

export type GroupSizeRangeInput = z.infer<typeof groupSizeRangeSchema>;
