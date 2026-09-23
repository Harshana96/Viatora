"use client";

import Link from "next/link";
import { useState } from "react";

import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { siteConfig } from "@/config/site";

const navLinks = [
  { href: "/tours", label: "Tours" },
  { href: "/destinations", label: "Destinations" },
  { href: "/enquiry", label: "Enquiry" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="font-serif text-xl tracking-tight"
          onClick={() => setIsOpen(false)}
        >
          {siteConfig.name}
        </Link>

        <div className="flex items-center gap-6">
          <nav className="hidden items-center gap-8 text-sm sm:flex">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-muted transition-colors hover:text-foreground">
                {link.label}
              </Link>
            ))}
          </nav>

          <ThemeToggle />

          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            className="text-sm sm:hidden"
          >
            {isOpen ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {isOpen ? (
        <nav className="flex flex-col gap-1 border-t border-border px-6 py-3 text-sm sm:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="py-2 text-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
