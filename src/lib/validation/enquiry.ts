import { z } from "zod";

export const enquirySchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(6, "Enter a valid phone/WhatsApp number"),
  preferredDate: z.coerce.date().optional(),
  travellersCount: z.coerce.number().int().min(1),
  packageId: z.string().optional(),
  message: z.string().optional(),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;
