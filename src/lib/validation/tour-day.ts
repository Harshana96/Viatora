import { z } from "zod";

export const tourDaySchema = z.object({
  packageId: z.string().min(1),
  dayNumber: z.coerce.number().int().min(1, "Day number must be at least 1"),
  title: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  hotelId: z.string().optional().or(z.literal("")),
});

export type TourDayInput = z.infer<typeof tourDaySchema>;
