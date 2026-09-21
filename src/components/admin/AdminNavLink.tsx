"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

type Props = ComponentProps<typeof Link>;

export function AdminNavLink({ href, className, ...props }: Props) {
  const pathname = usePathname();
  const isActive = pathname === href || (typeof href === "string" && pathname.startsWith(`${href}/`));

  return (
    <Link
      href={href}
      className={cn(
        "border-b-2 pb-0.5 transition-colors",
        isActive ? "border-accent text-accent" : "border-transparent text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-50",
        className,
      )}
      {...props}
    />
  );
}
