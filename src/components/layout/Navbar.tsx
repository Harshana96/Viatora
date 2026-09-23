"use client";

import Link from "next/link";
import { useState } from "react";

import { siteConfig } from "@/config/site";

const navLinks = [
  { href: "/tours", label: "Tours" },
  { href: "/destinations", label: "Destinations" },
  { href: "/enquiry", label: "Enquiry" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight" onClick={() => setIsOpen(false)}>
          {siteConfig.name}
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium sm:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
          className="text-sm font-medium sm:hidden"
        >
          {isOpen ? "Close" : "Menu"}
        </button>
      </div>

      {isOpen ? (
        <nav className="flex flex-col gap-1 border-t border-zinc-200 px-6 py-3 text-sm font-medium sm:hidden dark:border-zinc-800">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="py-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
