import { DestinationForm } from "@/components/admin/DestinationForm";
import { createDestination } from "@/server/destinations/actions";

export default function NewDestinationPage() {
  return (
    <main className="flex-1 px-6 py-16">
      <h1 className="mb-6 text-2xl font-semibold">New Destination</h1>
      <DestinationForm action={createDestination} />
    </main>
  );
}
