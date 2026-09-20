import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

export const E2E_ADMIN_EMAIL = "e2e-admin@viatora.test";
export const E2E_ADMIN_PASSWORD = "e2e-test-password-123";
export const E2E_DESTINATION_SLUG = "e2e-test-destination";
export const E2E_PACKAGE_SLUG = "e2e-test-package";

export default async function globalSetup() {
  const passwordHash = await bcrypt.hash(E2E_ADMIN_PASSWORD, 10);
  await db.user.upsert({
    where: { email: E2E_ADMIN_EMAIL },
    update: { passwordHash, name: "E2E Test Admin" },
    create: { email: E2E_ADMIN_EMAIL, name: "E2E Test Admin", passwordHash },
  });

  const destination = await db.destination.upsert({
    where: { slug: E2E_DESTINATION_SLUG },
    update: {},
    create: {
      name: "E2E Test Destination",
      slug: E2E_DESTINATION_SLUG,
      description: "Seeded for automated e2e tests.",
      location: "Test Province",
      thingsToDo: ["Test activity"],
      latitude: 6.9271,
      longitude: 79.8612,
    },
  });

  await db.tourPackage.upsert({
    where: { slug: E2E_PACKAGE_SLUG },
    update: { published: true, destinationId: destination.id },
    create: {
      name: "E2E Test Package",
      slug: E2E_PACKAGE_SLUG,
      durationDays: 2,
      startingPrice: 500,
      description: "Seeded package for automated e2e tests.",
      highlights: [],
      included: [],
      excluded: [],
      destinationId: destination.id,
      published: true,
    },
  });

  await db.$disconnect();
}
