import { PrismaClient } from "@prisma/client";

import { E2E_ADMIN_EMAIL, E2E_DESTINATION_SLUG, E2E_PACKAGE_SLUG } from "./global-setup";

const db = new PrismaClient();

export default async function globalTeardown() {
  await db.enquiry.deleteMany({ where: { email: { contains: "e2e-" } } });
  await db.tourPackage.deleteMany({ where: { slug: E2E_PACKAGE_SLUG } });
  await db.destination.deleteMany({ where: { slug: E2E_DESTINATION_SLUG } });
  await db.user.deleteMany({ where: { email: E2E_ADMIN_EMAIL } });
  await db.$disconnect();
}
