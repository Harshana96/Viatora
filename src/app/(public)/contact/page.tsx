import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { siteConfig } from "@/config/site";
import { createEnquiry } from "@/server/enquiries/actions";

export const metadata = {
  title: "Contact — Viatora",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const { success } = await searchParams;

  return (
    <main className="flex-1 px-4 py-16 sm:px-6 md:py-24 lg:px-8">
      <div className="mx-auto grid max-w-4xl gap-12 md:grid-cols-2">
        <div>
          <p className="text-[11px] tracking-[0.2em] text-accent uppercase">Get in Touch</p>
          <h1 className="font-editorial mt-4 text-4xl leading-tight font-medium text-foreground">
            Questions Before You Plan?
          </h1>
          <p className="mt-5 text-sm leading-relaxed font-light text-muted">
            Send us a message and we&apos;ll get back to you directly — no need to have your trip details
            figured out yet.
          </p>

          <div className="mt-8 flex flex-col gap-2 border-t border-parchment-300 pt-6 text-sm">
            <a href={`mailto:${siteConfig.contactEmail}`} className="font-medium text-foreground hover:text-accent">
              {siteConfig.contactEmail}
            </a>
            <a href={`tel:${siteConfig.contactPhone}`} className="text-muted hover:text-foreground">
              {siteConfig.contactPhone}
            </a>
          </div>
        </div>

        <div>
          {success ? (
            <div className="border border-parchment-300 bg-surface p-8 text-center">
              <div className="mb-2 text-[11px] font-semibold tracking-[0.2em] text-accent uppercase">
                Message Received
              </div>
              <p className="font-editorial text-2xl text-foreground">Thank you!</p>
              <p className="mt-2 text-sm leading-relaxed font-light text-muted">
                We&apos;ve received your message and will reply shortly.
              </p>
            </div>
          ) : (
            <form action={createEnquiry} className="flex flex-col gap-5 border border-parchment-300 bg-surface p-6 sm:p-8">
              <input type="hidden" name="travellersCount" value="1" />
              <input type="hidden" name="redirectTo" value="/contact" />
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
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" name="message" rows={5} required />
              </div>
              <Button type="submit" variant="accent">
                Send Message
              </Button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
