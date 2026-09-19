import { z } from "zod";

export const destinationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only"),
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required"),
  thingsToDo: z.array(z.string().min(1)).default([]),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
});

export type DestinationInput = z.infer<typeof destinationSchema>;
