import { z } from "zod";

export const reviewSchema = z.object({
  packageId: z.string().min(1),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  rating: z.coerce.number().int().min(1, "Rating is required").max(5),
  comment: z.string().min(1, "Please share a few words about your trip"),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
