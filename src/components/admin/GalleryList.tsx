import Image from "next/image";

import type { ImageOwnerType } from "@/server/images/actions";
import { deleteGalleryImage } from "@/server/images/actions";

type GalleryImage = {
  id: string;
  url: string;
  alt: string | null;
};

type Props = {
  images: GalleryImage[];
  ownerType: ImageOwnerType;
  ownerId: string;
};

export function GalleryList({ images, ownerType, ownerId }: Props) {
  if (images.length === 0) {
    return <p className="text-sm text-stone-500">No images yet.</p>;
  }

  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {images.map((image) => (
        <li
          key={image.id}
          className="relative overflow-hidden rounded-md border border-stone-200 dark:border-stone-800"
        >
          <Image
            src={image.url}
            alt={image.alt ?? ""}
            width={200}
            height={150}
            className="h-24 w-full object-cover"
          />
          <form action={deleteGalleryImage} className="absolute right-1 top-1">
            <input type="hidden" name="id" value={image.id} />
            <input type="hidden" name="ownerType" value={ownerType} />
            <input type="hidden" name="ownerId" value={ownerId} />
            <button type="submit" className="rounded-full bg-black/60 px-2 py-0.5 text-xs text-white hover:bg-black/80">
              Remove
            </button>
          </form>
        </li>
      ))}
    </ul>
  );
}
