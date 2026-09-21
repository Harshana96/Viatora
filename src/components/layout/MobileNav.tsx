"use client";

import Link from "next/link";
import { useState } from "react";

type NavLink = { href: string; label: string };

export function MobileNav({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-surface-container"
      >
        <span aria-hidden="true" className="material-symbols-outlined">
          {open ? "close" : "menu"}
        </span>
      </button>
      {open ? (
        <div className="absolute inset-x-0 top-20 z-40 space-y-3 border-b border-border-warm bg-surface px-4 py-4 shadow-lg">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block py-2 font-semibold text-on-surface-variant hover:text-secondary"
            >
              {link.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
