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
    label: "01 / Curation",
    title: "Curated, Not Endless",
    description:
      "Three journeys, chosen and itineraried in detail, rather than a directory of thousands of options to sort through.",
  },
  {
    label: "02 / Pricing",
    title: "One Clear Price",
    description:
      "Your group size and arrival month decide the price, up front — never a stack of add-on line items to negotiate later.",
  },
  {
    label: "03 / Ground Team",
    title: "A Real Team Behind It",
    description:
      "Every enquiry is reviewed by a person who confirms hotels and logistics before anything is finalised.",
  },
];

export default function AboutPage() {
  return (
    <main className="flex-1">
      <div className="mx-auto max-w-5xl px-4 pt-8 pb-24 sm:px-6 sm:pt-14 lg:px-8">
        <section className="max-w-2xl pb-4">
          <p className="text-[11px] tracking-[0.2em] text-accent uppercase">About Viatora</p>
          <h1 className="font-editorial mt-4 text-4xl leading-tight font-medium text-foreground md:text-5xl">
            Planning Sri Lanka shouldn&apos;t feel like a second job.
          </h1>
          <p className="mt-6 text-sm leading-relaxed font-light text-muted">
            Viatora exists because planning a trip to Sri Lanka usually means dozens of open tabs — blog posts,
            review sites, quotes from three different agents that don&apos;t quite line up. We wanted a
            simpler starting point: a handful of well-designed journeys, a route you can actually see, and one
            honest price before you ever have to talk to anyone.
          </p>
        </section>

        <section className="border-t border-parchment-300 py-14">
          <h2 className="font-editorial mb-8 text-2xl text-foreground">How We Think About It</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {values.map((value) => (
              <div key={value.label} className="border-t border-stone-400/70 pt-4">
                <div className="font-mono text-xs font-semibold tracking-wider text-muted uppercase">
                  {value.label}
                </div>
                <h3 className="font-editorial mt-1 text-xl font-bold text-foreground">{value.title}</h3>
                <p className="mt-1 text-xs leading-relaxed font-light text-muted">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-parchment-300 py-14">
          <p className="mb-6 text-[11px] tracking-[0.2em] text-accent uppercase">Centuries of Heritage</p>
          <div className="grid gap-6 sm:grid-cols-2">
            {heritagePhotos.map((photo) => (
              <Image
                key={photo.url}
                src={photo.url}
                alt={photo.alt}
                width={700}
                height={470}
                className="h-64 w-full object-cover sm:h-80"
              />
            ))}
          </div>
        </section>

        <section className="border-t border-parchment-300 py-14 text-center">
          <h2 className="font-editorial text-3xl text-foreground">Have a Question Before You Enquire?</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed font-light text-muted">
            We&apos;re happy to talk through a journey before you commit to anything.
          </p>
          <div className="mt-6">
            <Link href="/contact">
              <Button variant="secondary">Get in Touch</Button>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
