import Link from "next/link";
import type { ReactNode } from "react";

import { auth, signOut } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  return (
    <div className="flex min-h-screen flex-1 flex-col">
      {session ? (
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 px-6 py-3 dark:border-zinc-800">
          <nav className="flex flex-wrap gap-4 text-sm font-medium">
            <Link href="/admin/dashboard">Dashboard</Link>
            <Link href="/admin/destinations">Destinations</Link>
            <Link href="/admin/places">Places</Link>
            <Link href="/admin/tours">Tours</Link>
            <Link href="/admin/hotels">Hotels</Link>
            <Link href="/admin/enquiries">Enquiries</Link>
          </nav>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/admin/login" });
            }}
          >
            <button
              type="submit"
              className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50"
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
