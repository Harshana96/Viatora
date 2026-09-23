import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSeason } from "@/server/seasons/actions";

const monthOptions = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

export default function NewSeasonPage() {
  return (
    <main className="flex-1 px-6 py-16">
      <h1 className="mb-6 text-2xl font-semibold">New Season</h1>
      <form action={createSeason} className="flex max-w-xl flex-col gap-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" placeholder="e.g. Peak Season" required />
        </div>
        <div>
          <Label>Months</Label>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {monthOptions.map((month) => (
              <label key={month.value} className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="months" value={month.value} />
                {month.label}
              </label>
            ))}
          </div>
        </div>
        <div>
          <Label htmlFor="order">Display order</Label>
          <Input id="order" name="order" type="number" defaultValue={0} />
        </div>
        <Button type="submit">Create season</Button>
      </form>
    </main>
  );
}
