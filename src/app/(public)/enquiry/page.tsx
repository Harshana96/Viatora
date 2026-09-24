import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { monthOptions } from "@/lib/months";
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
    success?: string;
  }>;
}) {
  const {
    package: preselectedPackageId,
    groupSize: preselectedGroupSize,
    month: preselectedMonth,
    success,
  } = await searchParams;
  const [packages, groupSizeRanges] = await Promise.all([listPublishedPackages(), listGroupSizeRanges()]);

  if (success) {
    return (
      <main className="flex-1 px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg border border-parchment-300 bg-surface p-10 text-center">
          <div className="mb-2 text-[11px] font-semibold tracking-[0.2em] text-accent uppercase">
            Dispatch Received
          </div>
          <h1 className="font-editorial text-3xl text-foreground">Thank you!</h1>
          <p className="mt-3 text-sm leading-relaxed font-light text-muted">
            We&apos;ve received your enquiry and will get back to you shortly.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-2 text-center text-[11px] font-semibold tracking-[0.25em] text-accent uppercase">
          Begin Your Journey
        </div>
        <h1 className="font-editorial text-center text-4xl text-foreground sm:text-5xl">Request This Trip</h1>
        <p className="mx-auto mt-4 max-w-lg text-center text-sm leading-relaxed font-light text-muted">
          Tell us a bit about your trip and we&apos;ll be in touch with a confirmed quotation. No payment
          required.
        </p>

        <form action={createEnquiry} className="mt-8 flex flex-col gap-5 border border-parchment-300 bg-surface p-6 sm:p-10">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">
                Full name <span className="text-accent">*</span>
              </Label>
              <Input id="name" name="name" required />
            </div>
            <div>
              <Label htmlFor="email">
                Email <span className="text-accent">*</span>
              </Label>
              <Input id="email" name="email" type="email" required />
            </div>
          </div>
          <div>
            <Label htmlFor="phone">
              WhatsApp / phone <span className="text-accent">*</span>
            </Label>
            <Input id="phone" name="phone" type="tel" required />
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
            <Label htmlFor="packageId">Journey</Label>
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
            <Textarea id="message" name="message" rows={4} placeholder="Anything else we should know?" />
          </div>
          <div className="border-t border-parchment-200 pt-5">
            <Button type="submit" variant="accent" className="w-full justify-center">
              Submit Itinerary Request
            </Button>
            <p className="mt-4 text-center text-[11px] font-light text-muted">
              Zero obligation · A person reviews every enquiry within 24 hours.
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
