import Link from "next/link";

import { siteConfig } from "@/config/site";

const exploreLinks = [
  { href: "/tours", label: "Tours" },
  { href: "/destinations", label: "Destinations" },
  { href: "/enquiry", label: "Request a trip" },
];

const companyLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <p className="font-serif text-xl">{siteConfig.name}</p>
            <p className="mt-3 max-w-xs text-sm text-muted">{siteConfig.description}</p>
          </div>

          <div>
            <p className="text-xs tracking-[0.14em] text-muted uppercase">Explore</p>
            <ul className="mt-4 flex flex-col gap-2 text-sm">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-muted transition-colors hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs tracking-[0.14em] text-muted uppercase">Company</p>
            <ul className="mt-4 flex flex-col gap-2 text-sm">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-muted transition-colors hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a href={`mailto:${siteConfig.contactEmail}`} className="text-muted transition-colors hover:text-foreground">
                  {siteConfig.contactEmail}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-12 border-t border-border pt-6 text-xs text-muted">
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
