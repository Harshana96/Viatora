import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createEnquiry } from "@/server/enquiries/actions";
import { listPublishedPackages } from "@/server/tours/actions";

export const dynamic = "force-dynamic";

export default async function EnquiryPage({
  searchParams,
}: {
  searchParams: Promise<{ package?: string; success?: string }>;
}) {
  const { package: preselectedPackageId, success } = await searchParams;
  const packages = await listPublishedPackages();

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
        <h1 className="text-2xl font-semibold">Enquire about a tour</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Tell us a bit about your trip and we&apos;ll be in touch. No payment required.
        </p>
        <form action={createEnquiry} className="mt-6 flex flex-col gap-4">
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
              <Label htmlFor="preferredDate">Preferred travel date</Label>
              <Input id="preferredDate" name="preferredDate" type="date" />
            </div>
            <div>
              <Label htmlFor="travellersCount">Number of travellers</Label>
              <Input id="travellersCount" name="travellersCount" type="number" min={1} defaultValue={1} required />
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
