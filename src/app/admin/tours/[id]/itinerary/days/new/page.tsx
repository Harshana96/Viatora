import { notFound } from "next/navigation";

import { DayForm } from "@/components/admin/DayForm";
import { listHotels } from "@/server/hotels/actions";
import { createDay, listDays } from "@/server/itinerary/actions";
import { getPackage } from "@/server/tours/actions";

export const dynamic = "force-dynamic";

export default async function NewDayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [tourPackage, days, hotels] = await Promise.all([getPackage(id), listDays(id), listHotels()]);

  if (!tourPackage) {
    notFound();
  }

  const nextDayNumber = days.length > 0 ? Math.max(...days.map((day) => day.dayNumber)) + 1 : 1;

  return (
    <main className="flex-1 px-6 py-16">
      <h1 className="mb-6 text-2xl font-semibold">Add Day — {tourPackage.name}</h1>
      <DayForm action={createDay} packageId={id} nextDayNumber={nextDayNumber} hotels={hotels} />
    </main>
  );
}
