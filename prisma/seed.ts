import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // TODO: seed initial destinations, places and a sample package once the
  // admin CRUD and Prisma client are in place. Kept empty intentionally so
  // this scaffold doesn't reference a client that hasn't been generated yet.
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
