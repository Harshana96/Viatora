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
          <Label htmlFor="hotelId">Hotel</Label>
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
      <Button type="submit">{day ? "Save changes" : "Add day"}</Button>
    </form>
  );
}
