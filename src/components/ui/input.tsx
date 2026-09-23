import { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-sm border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none",
        className,
      )}
      {...props}
    />
  );
}
