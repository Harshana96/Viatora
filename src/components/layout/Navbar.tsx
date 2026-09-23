"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { siteConfig } from "@/config/site";

const navLinks = [
  { href: "/tours", label: "Tours" },
  { href: "/destinations", label: "Destinations" },
  { href: "/about", label: "Why Sri Lanka" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 pt-4 px-4 pointer-events-none">
      <div className="pointer-events-auto mx-auto flex max-w-6xl items-center justify-between rounded-lg border border-border bg-background/95 px-6 py-3 shadow-md backdrop-blur-md transition-all">
        <Link href="/" className="group flex items-baseline gap-2" onClick={() => setIsOpen(false)}>
          <span className="font-editorial text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {siteConfig.name}
          </span>
          <span className="font-editorial text-base text-ceylon-gold italic">Ceylon</span>
        </Link>

        <nav className="hidden items-center gap-7 text-xs font-medium tracking-[0.16em] text-muted uppercase md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="py-1 transition-colors hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/enquiry"
            className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-5 py-2 text-xs font-semibold tracking-wide text-background shadow-sm transition-all hover:bg-accent hover:text-accent-foreground"
          >
            <span>Plan a Trip</span>
            <span className="font-editorial text-sm">→</span>
          </Link>

          <button
            type="button"
            className="p-1.5 text-muted transition-colors hover:text-foreground md:hidden"
            onClick={() => setIsOpen((open) => !open)}
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {isOpen ? (
        <div className="pointer-events-auto mx-auto mt-2 flex max-w-6xl flex-col gap-1 rounded-lg border border-border bg-background p-5 text-xs font-medium tracking-[0.16em] text-muted uppercase shadow-xl md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="border-b border-parchment-200 py-2 hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </div>
      ) : null}
    </header>
  );
}
