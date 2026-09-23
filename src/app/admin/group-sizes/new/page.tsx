import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createGroupSizeRange } from "@/server/group-size-ranges/actions";

export default function NewGroupSizeRangePage() {
  return (
    <main className="flex-1 px-6 py-16">
      <h1 className="mb-6 text-2xl font-semibold">New Group Size Range</h1>
      <form action={createGroupSizeRange} className="flex max-w-xl flex-col gap-4">
        <div>
          <Label htmlFor="label">Label</Label>
          <Input id="label" name="label" placeholder="e.g. 2-5 Travelers" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="minSize">Minimum size</Label>
            <Input id="minSize" name="minSize" type="number" min={1} required />
          </div>
          <div>
            <Label htmlFor="maxSize">Maximum size (leave blank for &quot;+&quot;)</Label>
            <Input id="maxSize" name="maxSize" type="number" min={1} />
          </div>
        </div>
        <div>
          <Label htmlFor="order">Display order</Label>
          <Input id="order" name="order" type="number" defaultValue={0} />
        </div>
        <Button type="submit">Create range</Button>
      </form>
    </main>
  );
}
