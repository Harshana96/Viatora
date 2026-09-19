import { notFound } from "next/navigation";

import { DayForm } from "@/components/admin/DayForm";
import { listHotels } from "@/server/hotels/actions";
import { getDay, updateDay } from "@/server/itinerary/actions";
import { getPackage } from "@/server/tours/actions";

export const dynamic = "force-dynamic";

export default async function EditDayPage({
  params,
}: {
  params: Promise<{ id: string; dayId: string }>;
}) {
  const { id, dayId } = await params;
  const [tourPackage, day, hotels] = await Promise.all([getPackage(id), getDay(dayId), listHotels()]);

  if (!tourPackage || !day) {
    notFound();
  }

  return (
    <main className="flex-1 px-6 py-16">
      <h1 className="mb-6 text-2xl font-semibold">Edit Day — {tourPackage.name}</h1>
      <DayForm action={updateDay} packageId={id} day={day} nextDayNumber={day.dayNumber} hotels={hotels} />
    </main>
  );
}
