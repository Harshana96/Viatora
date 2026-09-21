import Link from "next/link";
import type { ReactNode } from "react";

import { MobileNav } from "@/components/layout/MobileNav";
import { travelTypeLabels } from "@/lib/travel-type";
import { listDestinationOptions } from "@/server/destinations/actions";

const navLinks = [
  { href: "/tours", label: "Tours" },
  { href: "/destinations", label: "Destinations" },
  { href: "/enquiry", label: "Enquiry" },
];

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const destinations = await listDestinationOptions();

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-surface">
      <header className="sticky top-0 z-50 w-full border-b border-border-warm bg-surface shadow-sm">
        <div className="relative mx-auto flex h-20 max-w-7xl items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-8">
            <Link href="/" className="group flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-secondary-container to-secondary text-on-secondary shadow-md transition-transform duration-200 group-hover:scale-105">
                <span aria-hidden="true" className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  wb_sunny
                </span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-xl font-bold tracking-tight text-primary">Viatora</span>
                <span className="mt-0.5 text-[11px] font-bold tracking-widest text-secondary uppercase">Sri Lanka</span>
              </div>
            </Link>
            <nav className="hidden items-center gap-6 lg:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="pb-1 text-sm font-semibold text-on-surface-variant transition-colors duration-200 hover:text-secondary"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <form action="/tours" className="relative hidden items-center sm:flex">
              <span aria-hidden="true" className="material-symbols-outlined pointer-events-none absolute left-3 text-[18px] text-text-muted">search</span>
              <input
                name="query"
                type="text"
                placeholder="Search tours or temples..."
                className="w-52 rounded-full border border-border-warm bg-surface-container-low py-2 pl-10 pr-4 text-sm text-text-primary transition-all placeholder:text-text-muted focus:border-transparent focus:ring-2 focus:ring-primary focus:outline-none xl:w-64"
              />
            </form>
            <Link
              href="/enquiry"
              className="flex items-center gap-1.5 rounded-full bg-secondary-container px-5 py-2.5 text-sm font-semibold text-on-secondary shadow-sm transition-all duration-200 hover:bg-secondary hover:shadow-md active:scale-95"
            >
              <span>Enquire Now</span>
              <span aria-hidden="true" className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
            <MobileNav links={navLinks} />
          </div>
        </div>
      </header>

      {children}

      <footer className="w-full bg-surface-container-high px-4 py-12 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 border-b border-border-warm pb-10 md:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-4 lg:col-span-2">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary-container text-on-secondary shadow-sm">
                  <span aria-hidden="true" className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    wb_sunny
                  </span>
                </div>
                <span className="text-lg font-bold text-primary">Viatora</span>
              </div>
              <p className="max-w-sm text-sm text-on-surface-variant">
                Crafted for tropical wanderlust. Discover the jewel of the Indian Ocean through interactive
                day-by-day itineraries and a live route map.
              </p>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-bold text-primary">Destinations</h4>
              <ul className="space-y-2 text-sm text-on-surface-variant">
                {destinations.length === 0 ? (
                  <li className="text-text-muted">Coming soon</li>
                ) : (
                  destinations.slice(0, 6).map((destination) => (
                    <li key={destination.id}>
                      <Link href="/destinations" className="transition-colors duration-200 hover:text-secondary">
                        {destination.name}
                      </Link>
                    </li>
                  ))
                )}
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-bold text-primary">Categories</h4>
              <ul className="space-y-2 text-sm text-on-surface-variant">
                {Object.entries(travelTypeLabels).map(([value, label]) => (
                  <li key={value}>
                    <Link href={`/tours?travelType=${value}`} className="transition-colors duration-200 hover:text-secondary">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-bold text-primary">Support</h4>
              <ul className="space-y-2 text-sm text-on-surface-variant">
                <li>
                  <Link href="/enquiry" className="transition-colors duration-200 hover:text-secondary">
                    Contact us
                  </Link>
                </li>
                <li>
                  <Link href="/tours" className="transition-colors duration-200 hover:text-secondary">
                    Browse tours
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-4 pt-8 text-sm text-on-surface-variant sm:flex-row">
            <p>&copy; {new Date().getFullYear()} Viatora Sri Lanka Tourism. All rights reserved.</p>
            <span className="flex items-center gap-1 text-sm font-medium text-tertiary">
              <span aria-hidden="true" className="material-symbols-outlined text-[14px]">eco</span>
              <span>Responsible Tourism</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
