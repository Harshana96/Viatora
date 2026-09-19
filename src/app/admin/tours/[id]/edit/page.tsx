import { notFound } from "next/navigation";

import { PackageForm } from "@/components/admin/PackageForm";
import { listDestinationOptions } from "@/server/destinations/actions";
import { getPackage, updatePackage } from "@/server/tours/actions";

export const dynamic = "force-dynamic";

export default async function EditPackagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [tourPackage, destinations] = await Promise.all([getPackage(id), listDestinationOptions()]);

  if (!tourPackage) {
    notFound();
  }

  return (
    <main className="flex-1 px-6 py-16">
      <h1 className="mb-6 text-2xl font-semibold">Edit Tour Package</h1>
      <PackageForm action={updatePackage} tourPackage={tourPackage} destinations={destinations} />
    </main>
  );
}
