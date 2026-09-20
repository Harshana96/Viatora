import { notFound } from "next/navigation";

import { GalleryList } from "@/components/admin/GalleryList";
import { GalleryUploadForm } from "@/components/admin/GalleryUploadForm";
import { PlaceForm } from "@/components/admin/PlaceForm";
import { listDestinationOptions } from "@/server/destinations/actions";
import { getPlace, updatePlace } from "@/server/places/actions";

export const dynamic = "force-dynamic";

export default async function EditPlacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [place, destinations] = await Promise.all([getPlace(id), listDestinationOptions()]);

  if (!place) {
    notFound();
  }

  return (
    <main className="flex-1 px-6 py-16">
      <h1 className="mb-6 text-2xl font-semibold">Edit Place</h1>
      <PlaceForm action={updatePlace} place={place} destinations={destinations} />

      <div className="mt-10 max-w-xl">
        <h2 className="mb-3 text-lg font-semibold">Images</h2>
        <div className="mb-4">
          <GalleryList images={place.images} ownerType="place" ownerId={place.id} />
        </div>
        <GalleryUploadForm ownerType="place" ownerId={place.id} />
      </div>
    </main>
  );
}
