import Image from "next/image";
import { notFound } from "next/navigation";

import { GalleryList } from "@/components/admin/GalleryList";
import { GalleryUploadForm } from "@/components/admin/GalleryUploadForm";
import { PackageForm } from "@/components/admin/PackageForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { listDestinationOptions } from "@/server/destinations/actions";
import { getPackage, updatePackage, uploadPackageCoverImage } from "@/server/tours/actions";

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

      <div className="mt-10 max-w-xl">
        <h2 className="mb-3 text-lg font-semibold">Cover image</h2>
        {tourPackage.coverImageUrl ? (
          <Image
            src={tourPackage.coverImageUrl}
            alt=""
            width={320}
            height={180}
            className="mb-3 h-40 w-full max-w-xs rounded-md object-cover"
          />
        ) : (
          <p className="mb-3 text-sm text-stone-500">No cover image yet.</p>
        )}
        <form action={uploadPackageCoverImage} encType="multipart/form-data" className="flex items-end gap-3">
          <input type="hidden" name="id" value={tourPackage.id} />
          <div className="flex-1">
            <Input name="file" type="file" accept="image/*" required />
          </div>
          <Button type="submit" variant="secondary">
            Upload
          </Button>
        </form>
      </div>

      <div className="mt-10 max-w-xl">
        <h2 className="mb-3 text-lg font-semibold">Gallery</h2>
        <div className="mb-4">
          <GalleryList images={tourPackage.images} ownerType="package" ownerId={tourPackage.id} />
        </div>
        <GalleryUploadForm ownerType="package" ownerId={tourPackage.id} />
      </div>
    </main>
  );
}
