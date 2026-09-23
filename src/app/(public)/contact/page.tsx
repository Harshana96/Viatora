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
    <main className="flex-1 px-6 py-16 md:py-24">
      <div className="mx-auto grid max-w-4xl gap-12 md:grid-cols-2">
        <div>
          <p className="text-xs tracking-[0.2em] text-muted uppercase">Get in touch</p>
          <h1 className="mt-4 font-serif text-4xl leading-tight">Questions before you plan?</h1>
          <p className="mt-5 text-muted">
            Send us a message and we&apos;ll get back to you directly — no need to have your trip details
            figured out yet.
          </p>

          <div className="mt-8 flex flex-col gap-2 border-t border-border pt-6 text-sm">
            <a href={`mailto:${siteConfig.contactEmail}`} className="text-foreground hover:text-accent">
              {siteConfig.contactEmail}
            </a>
            <a href={`tel:${siteConfig.contactPhone}`} className="text-muted hover:text-foreground">
              {siteConfig.contactPhone}
            </a>
          </div>
        </div>

        <div>
          {success ? (
            <div className="rounded-sm border border-border p-6 text-center">
              <p className="font-serif text-xl">Thank you!</p>
              <p className="mt-2 text-sm text-muted">We&apos;ve received your message and will reply shortly.</p>
            </div>
          ) : (
            <form action={createEnquiry} className="flex flex-col gap-4">
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
              <Button type="submit">Send message</Button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
