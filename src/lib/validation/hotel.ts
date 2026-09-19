import { z } from "zod";

export const hotelSchema = z.object({
  name: z.string().min(1, "Name is required"),
  location: z.string().min(1, "Location is required"),
  rating: z.coerce.number().min(0).max(5).optional(),
});

export type HotelInput = z.infer<typeof hotelSchema>;
