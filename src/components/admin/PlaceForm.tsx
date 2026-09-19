import type { Place, PlaceCategory } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type DestinationOption = { id: string; name: string };

type Props = {
  action: (formData: FormData) => void;
  place?: Place;
  destinations: DestinationOption[];
};

const categoryLabels: Record<PlaceCategory, string> = {
  TEMPLE: "Temple",
  WATERFALL: "Waterfall",
  BEACH: "Beach",
  WILDLIFE: "Wildlife",
  MOUNTAIN: "Mountain",
  HISTORICAL_SITE: "Historical site",
  TEA_PLANTATION: "Tea plantation",
  ADVENTURE: "Adventure",
};

export function PlaceForm({ action, place, destinations }: Props) {
  return (
    <form action={action} className="flex max-w-xl flex-col gap-4">
      {place ? <input type="hidden" name="id" defaultValue={place.id} /> : null}
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" defaultValue={place?.name} required />
      </div>
      <div>
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          name="slug"
          defaultValue={place?.slug}
          placeholder="auto-generated from name if left blank"
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={place?.description} required rows={4} />
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Select id="category" name="category" defaultValue={place?.category ?? ""} required>
          <option value="" disabled>
            Select a category
          </option>
          {Object.entries(categoryLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label htmlFor="destinationId">Destination</Label>
        <Select id="destinationId" name="destinationId" defaultValue={place?.destinationId ?? ""} required>
          <option value="" disabled>
            Select a destination
          </option>
          {destinations.map((destination) => (
            <option key={destination.id} value={destination.id}>
              {destination.name}
            </option>
          ))}
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="latitude">Latitude</Label>
          <Input id="latitude" name="latitude" type="number" step="any" defaultValue={place?.latitude} required />
        </div>
        <div>
          <Label htmlFor="longitude">Longitude</Label>
          <Input id="longitude" name="longitude" type="number" step="any" defaultValue={place?.longitude} required />
        </div>
      </div>
      <Button type="submit">{place ? "Save changes" : "Create place"}</Button>
    </form>
  );
}
