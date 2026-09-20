import { notFound } from "next/navigation";

import { DestinationForm } from "@/components/admin/DestinationForm";
import { GalleryList } from "@/components/admin/GalleryList";
import { GalleryUploadForm } from "@/components/admin/GalleryUploadForm";
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

      <div className="mt-10 max-w-xl">
        <h2 className="mb-3 text-lg font-semibold">Images</h2>
        <div className="mb-4">
          <GalleryList images={destination.images} ownerType="destination" ownerId={destination.id} />
        </div>
        <GalleryUploadForm ownerType="destination" ownerId={destination.id} />
      </div>
    </main>
  );
}
