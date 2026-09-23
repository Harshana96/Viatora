import Link from "next/link";
import type { Hotel, TourDay } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  action: (formData: FormData) => void;
  packageId: string;
  day?: TourDay;
  nextDayNumber: number;
  hotels: Pick<Hotel, "id" | "name">[];
};

export function DayForm({ action, packageId, day, nextDayNumber, hotels }: Props) {
  return (
    <form action={action} className="flex max-w-xl flex-col gap-4">
      <input type="hidden" name="packageId" defaultValue={packageId} />
      {day ? <input type="hidden" name="id" defaultValue={day.id} /> : null}
      <div>
        <Label htmlFor="dayNumber">Day number</Label>
        <Input
          id="dayNumber"
          name="dayNumber"
          type="number"
          min={1}
          defaultValue={day?.dayNumber ?? nextDayNumber}
          required
        />
      </div>
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" defaultValue={day?.title ?? ""} placeholder="e.g. Arrival in Colombo" />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={day?.description ?? ""} rows={4} />
      </div>
      <div>
        <div className="flex items-center justify-between">
          <Label htmlFor="hotelId">Hotel (primary option)</Label>
          <Link href="/admin/hotels/new" className="text-xs font-medium text-zinc-600 hover:underline dark:text-zinc-400">
            Manage hotels
          </Link>
        </div>
        <Select id="hotelId" name="hotelId" defaultValue={day?.hotelId ?? ""}>
          <option value="">No hotel</option>
          {hotels.map((hotel) => (
            <option key={hotel.id} value={hotel.id}>
              {hotel.name}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label>Alternative hotel options</Label>
        <p className="mb-2 text-xs text-zinc-500">
          Shown to travellers as other choices for this stay; availability is confirmed after enquiry.
        </p>
        <div className="flex flex-col gap-2">
          {hotels.map((hotel) => (
            <label key={hotel.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="alternativeHotelIds"
                value={hotel.id}
                defaultChecked={day?.alternativeHotelIds?.includes(hotel.id) ?? false}
              />
              {hotel.name}
            </label>
          ))}
        </div>
      </div>
      <div>
        <Label htmlFor="optionalActivities">Optional / available activities (one per line)</Label>
        <Textarea
          id="optionalActivities"
          name="optionalActivities"
          defaultValue={day?.optionalActivities?.join("\n") ?? ""}
          rows={3}
          placeholder="Whale watching&#10;Surfing lesson"
        />
      </div>
      <Button type="submit">{day ? "Save changes" : "Add day"}</Button>
    </form>
  );
}
