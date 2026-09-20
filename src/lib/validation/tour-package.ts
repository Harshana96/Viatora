import { TravelType } from "@prisma/client";
import { z } from "zod";

export const tourPackageSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only"),
  coverImageUrl: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  durationDays: z.coerce.number().int().min(1, "Duration must be at least 1 day"),
  startingPrice: z.coerce.number().min(0).optional(),
  travelType: z.nativeEnum(TravelType).optional().or(z.literal("")),
  description: z.string().min(1, "Description is required"),
  highlights: z.array(z.string().min(1)).default([]),
  included: z.array(z.string().min(1)).default([]),
  excluded: z.array(z.string().min(1)).default([]),
  destinationId: z.string().optional().or(z.literal("")),
  published: z.boolean().default(false),
});

export type TourPackageInput = z.infer<typeof tourPackageSchema>;
