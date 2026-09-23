import { SelectHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "w-full border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-foreground focus:outline-none",
        className,
      )}
      {...props}
    />
  );
}
