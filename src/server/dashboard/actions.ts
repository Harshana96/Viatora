"use server";

import { db } from "@/lib/db";

export async function getDashboardStats() {
  const [totalPackages, totalDestinations, totalPlaces, totalEnquiries] = await Promise.all([
    db.tourPackage.count(),
    db.destination.count(),
    db.place.count(),
    db.enquiry.count(),
  ]);

  return { totalPackages, totalDestinations, totalPlaces, totalEnquiries };
}
