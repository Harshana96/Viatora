import type { Destination } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  action: (formData: FormData) => void;
  destination?: Destination;
};

export function DestinationForm({ action, destination }: Props) {
  return (
    <form action={action} className="flex max-w-xl flex-col gap-4">
      {destination ? <input type="hidden" name="id" defaultValue={destination.id} /> : null}
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" defaultValue={destination?.name} required />
      </div>
      <div>
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          name="slug"
          defaultValue={destination?.slug}
          placeholder="auto-generated from name if left blank"
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={destination?.description} required rows={4} />
      </div>
      <div>
        <Label htmlFor="location">Location</Label>
        <Input id="location" name="location" defaultValue={destination?.location} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="latitude">Latitude</Label>
          <Input
            id="latitude"
            name="latitude"
            type="number"
            step="any"
            defaultValue={destination?.latitude}
            required
          />
        </div>
        <div>
          <Label htmlFor="longitude">Longitude</Label>
          <Input
            id="longitude"
            name="longitude"
            type="number"
            step="any"
            defaultValue={destination?.longitude}
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="thingsToDo">Things to do (one per line)</Label>
        <Textarea
          id="thingsToDo"
          name="thingsToDo"
          rows={4}
          defaultValue={destination?.thingsToDo.join("\n")}
        />
      </div>
      <Button type="submit">{destination ? "Save changes" : "Create destination"}</Button>
    </form>
  );
}
