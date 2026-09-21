import type { Place } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  action: (formData: FormData) => void;
  packageId: string;
  tourDayId: string;
  places: Pick<Place, "id" | "name">[];
};

export function DayPlaceForm({ action, packageId, tourDayId, places }: Props) {
  return (
    <form
      action={action}
      className="flex flex-col gap-2 rounded-md border border-dashed border-stone-300 p-3 dark:border-stone-700"
    >
      <input type="hidden" name="packageId" defaultValue={packageId} />
      <input type="hidden" name="tourDayId" defaultValue={tourDayId} />
      <div>
        <Label htmlFor={`place-${tourDayId}`}>Add place</Label>
        <Select id={`place-${tourDayId}`} name="placeId" defaultValue="" required>
          <option value="" disabled>
            Select a place
          </option>
          {places.map((place) => (
            <option key={place.id} value={place.id}>
              {place.name}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label htmlFor={`activities-${tourDayId}`}>Activities (one per line)</Label>
        <Textarea id={`activities-${tourDayId}`} name="activities" rows={2} />
      </div>
      <Button type="submit" variant="secondary" className="self-start">
        Add place to this day
      </Button>
    </form>
  );
}
