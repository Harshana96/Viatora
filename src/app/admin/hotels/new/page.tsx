import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createHotel } from "@/server/hotels/actions";

export default function NewHotelPage() {
  return (
    <main className="flex-1 px-6 py-16">
      <h1 className="mb-6 text-2xl font-semibold">New Hotel</h1>
      <form action={createHotel} className="flex max-w-xl flex-col gap-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required />
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" required />
        </div>
        <div>
          <Label htmlFor="rating">Rating (0–5)</Label>
          <Input id="rating" name="rating" type="number" min={0} max={5} step="0.1" />
        </div>
        <Button type="submit">Create hotel</Button>
      </form>
    </main>
  );
}
