import type { TourPackage } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type DestinationOption = { id: string; name: string };

type Props = {
  action: (formData: FormData) => void;
  tourPackage?: TourPackage;
  destinations: DestinationOption[];
};

export function PackageForm({ action, tourPackage, destinations }: Props) {
  return (
    <form action={action} className="flex max-w-xl flex-col gap-4">
      {tourPackage ? <input type="hidden" name="id" defaultValue={tourPackage.id} /> : null}
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" defaultValue={tourPackage?.name} required />
      </div>
      <div>
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          name="slug"
          defaultValue={tourPackage?.slug}
          placeholder="auto-generated from name if left blank"
        />
      </div>
      <div>
        <Label htmlFor="coverImageUrl">Cover image URL</Label>
        <Input id="coverImageUrl" name="coverImageUrl" defaultValue={tourPackage?.coverImageUrl ?? ""} />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={tourPackage?.description} required rows={4} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="durationDays">Duration (days)</Label>
          <Input
            id="durationDays"
            name="durationDays"
            type="number"
            min={1}
            defaultValue={tourPackage?.durationDays}
            required
          />
        </div>
        <div>
          <Label htmlFor="startingPrice">Starting price (USD)</Label>
          <Input
            id="startingPrice"
            name="startingPrice"
            type="number"
            min={0}
            step="0.01"
            defaultValue={tourPackage?.startingPrice?.toString()}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="destinationId">Destination</Label>
        <Select id="destinationId" name="destinationId" defaultValue={tourPackage?.destinationId ?? ""}>
          <option value="">No specific destination</option>
          {destinations.map((destination) => (
            <option key={destination.id} value={destination.id}>
              {destination.name}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label htmlFor="highlights">Highlights (one per line)</Label>
        <Textarea id="highlights" name="highlights" rows={3} defaultValue={tourPackage?.highlights.join("\n")} />
      </div>
      <div>
        <Label htmlFor="included">What&apos;s included (one per line)</Label>
        <Textarea id="included" name="included" rows={3} defaultValue={tourPackage?.included.join("\n")} />
      </div>
      <div>
        <Label htmlFor="excluded">What&apos;s not included (one per line)</Label>
        <Textarea id="excluded" name="excluded" rows={3} defaultValue={tourPackage?.excluded.join("\n")} />
      </div>
      <div className="flex items-center gap-2">
        <input
          id="published"
          name="published"
          type="checkbox"
          defaultChecked={tourPackage?.published}
          className="h-4 w-4 rounded border-zinc-300"
        />
        <Label htmlFor="published" className="mb-0">
          Published
        </Label>
      </div>
      <Button type="submit">{tourPackage ? "Save changes" : "Create package"}</Button>
    </form>
  );
}
