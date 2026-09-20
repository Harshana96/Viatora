import type { TravelType } from "@prisma/client";

export const travelTypeLabels: Record<TravelType, string> = {
  ADVENTURE: "Adventure",
  CULTURAL: "Cultural",
  BEACH: "Beach",
  WILDLIFE: "Wildlife",
  HONEYMOON: "Honeymoon",
  FAMILY: "Family",
  WELLNESS: "Wellness",
};
