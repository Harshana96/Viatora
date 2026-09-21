import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getEnquiry, updateEnquiry } from "@/server/enquiries/actions";

export const dynamic = "force-dynamic";

const statusOptions = ["NEW", "CONTACTED", "IN_PROGRESS", "COMPLETED", "CANCELLED"] as const;

export default async function AdminEnquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const enquiry = await getEnquiry(id);

  if (!enquiry) {
    notFound();
  }

  return (
    <main className="flex-1 px-6 py-16">
      <h1 className="mb-6 text-2xl font-semibold">Enquiry from {enquiry.name}</h1>

      <dl className="mb-8 grid max-w-xl grid-cols-2 gap-x-6 gap-y-3 text-sm">
        <dt className="text-stone-500">Email</dt>
        <dd>{enquiry.email}</dd>
        <dt className="text-stone-500">WhatsApp / phone</dt>
        <dd>{enquiry.phone}</dd>
        <dt className="text-stone-500">Package</dt>
        <dd>{enquiry.package?.name ?? "General enquiry"}</dd>
        <dt className="text-stone-500">Preferred travel date</dt>
        <dd>{enquiry.preferredDate ? enquiry.preferredDate.toLocaleDateString() : "—"}</dd>
        <dt className="text-stone-500">Number of travellers</dt>
        <dd>{enquiry.travellersCount}</dd>
        <dt className="text-stone-500">Received</dt>
        <dd>{enquiry.createdAt.toLocaleString()}</dd>
        {enquiry.message ? (
          <>
            <dt className="text-stone-500">Message</dt>
            <dd className="whitespace-pre-wrap">{enquiry.message}</dd>
          </>
        ) : null}
      </dl>

      <form action={updateEnquiry} className="flex max-w-xl flex-col gap-4">
        <input type="hidden" name="id" defaultValue={enquiry.id} />
        <div>
          <Label htmlFor="status">Status</Label>
          <Select id="status" name="status" defaultValue={enquiry.status}>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="internalNotes">Internal notes</Label>
          <Textarea
            id="internalNotes"
            name="internalNotes"
            rows={4}
            defaultValue={enquiry.internalNotes ?? ""}
            placeholder="Not visible to the traveller"
          />
        </div>
        <Button type="submit" className="self-start">
          Save
        </Button>
      </form>
    </main>
  );
}
