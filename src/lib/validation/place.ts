import { PlaceCategory } from "@prisma/client";
import { z } from "zod";

export const placeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only"),
  description: z.string().min(1, "Description is required"),
  category: z.nativeEnum(PlaceCategory),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  destinationId: z.string().min(1, "Destination is required"),
});

export type PlaceInput = z.infer<typeof placeSchema>;
