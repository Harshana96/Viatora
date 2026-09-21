import Link from "next/link";
import type { ReactNode } from "react";

const navLinks = [
  { href: "/tours", label: "Tours" },
  { href: "/destinations", label: "Destinations" },
  { href: "/enquiry", label: "Enquiry" },
];

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-1 flex-col">
      <header className="sticky top-0 z-10 border-b border-stone-200/70 bg-background/80 backdrop-blur-sm dark:border-stone-800/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Viatora
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-stone-600 transition-colors hover:text-accent dark:text-stone-400">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {children}

      <footer className="mt-auto border-t border-stone-200 px-6 py-10 dark:border-stone-800">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-sm text-stone-500 sm:flex-row sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Viatora. Discover Sri Lanka.</p>
          <nav className="flex items-center gap-5">
            <Link href="/" className="transition-colors hover:text-accent">
              Home
            </Link>
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="transition-colors hover:text-accent">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
