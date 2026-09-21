import type { ReactNode } from "react";

import { AdminNavLink } from "@/components/admin/AdminNavLink";
import { auth, signOut } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  return (
    <div className="flex min-h-screen flex-1 flex-col">
      {session ? (
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 bg-white px-6 py-3 dark:border-stone-800 dark:bg-stone-950">
          <nav className="flex flex-wrap gap-5 text-sm font-medium">
            <AdminNavLink href="/admin/dashboard">Dashboard</AdminNavLink>
            <AdminNavLink href="/admin/destinations">Destinations</AdminNavLink>
            <AdminNavLink href="/admin/places">Places</AdminNavLink>
            <AdminNavLink href="/admin/tours">Tours</AdminNavLink>
            <AdminNavLink href="/admin/hotels">Hotels</AdminNavLink>
            <AdminNavLink href="/admin/enquiries">Enquiries</AdminNavLink>
          </nav>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/admin/login" });
            }}
          >
            <button
              type="submit"
              className="text-sm font-medium text-stone-500 transition-colors hover:text-stone-900 dark:hover:text-stone-50"
            >
              Sign out
            </button>
          </form>
        </header>
      ) : null}
      {children}
    </div>
  );
}
