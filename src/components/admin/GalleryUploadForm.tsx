import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ImageOwnerType } from "@/server/images/actions";
import { uploadGalleryImage } from "@/server/images/actions";

type Props = {
  ownerType: ImageOwnerType;
  ownerId: string;
};

export function GalleryUploadForm({ ownerType, ownerId }: Props) {
  return (
    <form
      action={uploadGalleryImage}
      encType="multipart/form-data"
      className="flex flex-col gap-3 rounded-md border border-dashed border-stone-300 p-3 dark:border-stone-700"
    >
      <input type="hidden" name="ownerType" value={ownerType} />
      <input type="hidden" name="ownerId" value={ownerId} />
      <div>
        <Label htmlFor={`file-${ownerId}`}>Add image</Label>
        <Input id={`file-${ownerId}`} name="file" type="file" accept="image/*" required />
      </div>
      <div>
        <Label htmlFor={`alt-${ownerId}`}>Alt text (optional)</Label>
        <Input id={`alt-${ownerId}`} name="alt" />
      </div>
      <Button type="submit" variant="secondary" className="self-start">
        Upload
      </Button>
    </form>
  );
}
