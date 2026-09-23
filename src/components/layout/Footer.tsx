import Link from "next/link";

import { siteConfig } from "@/config/site";
import { listPopularDestinations } from "@/server/destinations/actions";
import { listPublishedPackages } from "@/server/tours/actions";

export async function Footer() {
  const [packages, destinations] = await Promise.all([
    listPublishedPackages({ take: 5 }),
    listPopularDestinations(5),
  ]);

  return (
    <footer className="border-t border-border bg-foreground/[0.02]">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="space-y-4 md:col-span-5">
            <Link href="/" className="flex items-baseline gap-2.5">
              <span className="font-editorial text-3xl font-semibold tracking-tight text-foreground">
                {siteConfig.name}
              </span>
              <span className="font-editorial text-lg text-ceylon-gold italic">Ceylon</span>
            </Link>
            <p className="max-w-sm text-xs leading-relaxed font-light text-muted sm:text-sm">
              {siteConfig.description}
            </p>
          </div>

          <div className="space-y-3 md:col-span-3">
            <p className="font-mono text-[11px] font-semibold tracking-wider text-foreground uppercase">
              Curated Journeys
            </p>
            <ul className="space-y-2 text-xs font-light text-muted">
              {packages.map((tourPackage) => (
                <li key={tourPackage.id}>
                  <Link href={`/tours/${tourPackage.slug}`} className="transition hover:text-accent">
                    {tourPackage.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3 md:col-span-2">
            <p className="font-mono text-[11px] font-semibold tracking-wider text-foreground uppercase">
              Waypoints
            </p>
            <ul className="space-y-2 text-xs font-light text-muted">
              {destinations.map((destination) => (
                <li key={destination.id}>
                  <Link href={`/destinations/${destination.slug}`} className="transition hover:text-accent">
                    {destination.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3 md:col-span-2">
            <p className="font-mono text-[11px] font-semibold tracking-wider text-foreground uppercase">
              Direct Contact
            </p>
            <p className="text-xs leading-relaxed font-light text-muted">
              <a href={`mailto:${siteConfig.contactEmail}`} className="font-medium text-foreground transition hover:text-accent">
                {siteConfig.contactEmail}
              </a>
            </p>
            <p className="text-xs leading-relaxed font-light text-muted">
              <a href={`tel:${siteConfig.contactPhone}`} className="font-medium text-foreground transition hover:text-accent">
                {siteConfig.contactPhone}
              </a>
            </p>
            <div className="pt-1">
              <Link
                href="/about"
                className="inline-block border border-border bg-background px-3 py-1 font-mono text-[10px] text-muted"
              >
                Why Sri Lanka →
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-parchment-200 pt-6 text-xs font-light text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} {siteConfig.name}. Handcrafted journeys across Sri Lanka.</p>
          <div className="flex gap-6">
            <Link href="/about" className="hover:underline">
              About
            </Link>
            <Link href="/contact" className="hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
