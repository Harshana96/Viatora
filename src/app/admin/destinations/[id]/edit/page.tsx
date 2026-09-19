import { notFound } from "next/navigation";

import { DestinationForm } from "@/components/admin/DestinationForm";
import { getDestination, updateDestination } from "@/server/destinations/actions";

export const dynamic = "force-dynamic";

export default async function EditDestinationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const destination = await getDestination(id);

  if (!destination) {
    notFound();
  }

  return (
    <main className="flex-1 px-6 py-16">
      <h1 className="mb-6 text-2xl font-semibold">Edit Destination</h1>
      <DestinationForm action={updateDestination} destination={destination} />
    </main>
  );
}
