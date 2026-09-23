import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { monthOptions } from "@/lib/months";
import { formatCurrency } from "@/lib/utils";
import { createEnquiry } from "@/server/enquiries/actions";
import { listGroupSizeRanges } from "@/server/group-size-ranges/actions";
import { listPublishedPackages } from "@/server/tours/actions";

export const dynamic = "force-dynamic";

export default async function EnquiryPage({
  searchParams,
}: {
  searchParams: Promise<{
    package?: string;
    groupSize?: string;
    month?: string;
    estimatedTotal?: string;
    success?: string;
  }>;
}) {
  const {
    package: preselectedPackageId,
    groupSize: preselectedGroupSize,
    month: preselectedMonth,
    estimatedTotal,
    success,
  } = await searchParams;
  const [packages, groupSizeRanges] = await Promise.all([listPublishedPackages(), listGroupSizeRanges()]);

  if (success) {
    return (
      <main className="flex-1 px-6 py-16">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="text-2xl font-semibold">Thank you!</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            We&apos;ve received your enquiry and will get back to you shortly.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 px-6 py-16">
      <div className="mx-auto max-w-lg">
        <h1 className="text-2xl font-semibold">Request This Trip</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Tell us a bit about your trip and we&apos;ll be in touch with a confirmed quotation. No payment
          required.
        </p>
        {estimatedTotal ? (
          <p className="mt-4 rounded-md border border-zinc-200 p-3 text-sm dark:border-zinc-800">
            Estimated Total: <span className="font-semibold">{formatCurrency(Number(estimatedTotal))} / person</span>
          </p>
        ) : null}
        <form action={createEnquiry} className="mt-6 flex flex-col gap-4">
          {estimatedTotal ? <input type="hidden" name="estimatedTotal" value={estimatedTotal} /> : null}
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div>
            <Label htmlFor="phone">WhatsApp / phone</Label>
            <Input id="phone" name="phone" type="tel" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="groupSizeRangeId">Group size</Label>
              <Select id="groupSizeRangeId" name="groupSizeRangeId" defaultValue={preselectedGroupSize ?? ""}>
                <option value="">Not sure yet</option>
                {groupSizeRanges.map((range) => (
                  <option key={range.id} value={range.id}>
                    {range.label}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="travellersCount">Number of travellers</Label>
              <Input id="travellersCount" name="travellersCount" type="number" min={1} defaultValue={1} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="arrivalMonth">Arrival month</Label>
              <Select id="arrivalMonth" name="arrivalMonth" defaultValue={preselectedMonth ?? ""}>
                <option value="">Not sure yet</option>
                {monthOptions.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="preferredDate">Preferred travel date</Label>
              <Input id="preferredDate" name="preferredDate" type="date" />
            </div>
          </div>
          <div>
            <Label htmlFor="packageId">Package</Label>
            <Select id="packageId" name="packageId" defaultValue={preselectedPackageId ?? ""}>
              <option value="">Not sure yet / general enquiry</option>
              {packages.map((tourPackage) => (
                <option key={tourPackage.id} value={tourPackage.id}>
                  {tourPackage.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" name="message" rows={4} />
          </div>
          <Button type="submit">Send enquiry</Button>
        </form>
      </div>
    </main>
  );
}
