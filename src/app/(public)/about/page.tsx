import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export const metadata = {
  title: "About — Viatora",
};

// Editorial photos not tied to a seeded destination -- decorative only.
const heritagePhotos = [
  {
    url: "https://res.cloudinary.com/xtp3v13m/image/upload/v1790185191/viatora/timpcqddck7mwfqaqtjo.png",
    alt: "The Ruwanwelisaya stupa in Anuradhapura",
  },
  {
    url: "https://res.cloudinary.com/xtp3v13m/image/upload/v1790185193/viatora/d97g1p2pu3zpen58p1c6.png",
    alt: "The ancient ruins of Polonnaruwa",
  },
];

const values = [
  {
    title: "Curated, not endless",
    description:
      "Three journeys, chosen and itineraried in detail, rather than a directory of thousands of options to sort through.",
  },
  {
    title: "One clear price",
    description:
      "Your group size and arrival month decide the price, up front — never a stack of add-on line items to negotiate later.",
  },
  {
    title: "A real team behind it",
    description:
      "Every enquiry is reviewed by a person who confirms hotels and logistics before anything is finalised.",
  },
];

export default function AboutPage() {
  return (
    <main className="flex-1">
      <section className="mx-auto max-w-3xl px-6 pt-16 pb-12 md:pt-24">
        <p className="text-xs tracking-[0.2em] text-muted uppercase">About Viatora</p>
        <h1 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">
          Planning Sri Lanka shouldn&apos;t feel like a second job.
        </h1>
        <p className="mt-6 text-muted">
          Viatora exists because planning a trip to Sri Lanka usually means dozens of open tabs — blog posts,
          review sites, quotes from three different agents that don&apos;t quite line up. We wanted a
          simpler starting point: a handful of well-designed journeys, a route you can actually see, and one
          honest price before you ever have to talk to anyone.
        </p>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-3xl px-6 py-14">
          <h2 className="font-serif text-2xl">How we think about it</h2>
          <div className="mt-8 flex flex-col gap-8">
            {values.map((value) => (
              <div key={value.title} className="border-t border-border pt-6">
                <p className="font-medium">{value.title}</p>
                <p className="mt-1 text-sm text-muted">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <p className="mb-6 text-xs tracking-[0.14em] text-muted uppercase">Centuries of heritage</p>
          <div className="grid gap-6 sm:grid-cols-2">
            {heritagePhotos.map((photo) => (
              <Image
                key={photo.url}
                src={photo.url}
                alt={photo.alt}
                width={700}
                height={470}
                className="h-64 w-full rounded-sm object-cover sm:h-80"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-3xl px-6 py-14 text-center">
          <h2 className="font-serif text-2xl">Have a question before you enquire?</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">
            We&apos;re happy to talk through a journey before you commit to anything.
          </p>
          <div className="mt-6">
            <Link href="/contact">
              <Button variant="secondary">Get in touch</Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
