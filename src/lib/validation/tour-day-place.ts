import { z } from "zod";

export const tourDayPlaceSchema = z.object({
  tourDayId: z.string().min(1),
  placeId: z.string().min(1, "Place is required"),
  activities: z.array(z.string().min(1)).default([]),
});

export type TourDayPlaceInput = z.infer<typeof tourDayPlaceSchema>;
