import { PackageForm } from "@/components/admin/PackageForm";
import { listDestinationOptions } from "@/server/destinations/actions";
import { createPackage } from "@/server/tours/actions";

export const dynamic = "force-dynamic";

export default async function NewPackagePage() {
  const destinations = await listDestinationOptions();

  return (
    <main className="flex-1 px-6 py-16">
      <h1 className="mb-6 text-2xl font-semibold">New Tour Package</h1>
      <PackageForm action={createPackage} destinations={destinations} />
    </main>
  );
}
