import { PlaceForm } from "@/components/admin/PlaceForm";
import { listDestinationOptions } from "@/server/destinations/actions";
import { createPlace } from "@/server/places/actions";

export const dynamic = "force-dynamic";

export default async function NewPlacePage() {
  const destinations = await listDestinationOptions();

  return (
    <main className="flex-1 px-6 py-16">
      <h1 className="mb-6 text-2xl font-semibold">New Place</h1>
      <PlaceForm action={createPlace} destinations={destinations} />
    </main>
  );
}
