import { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-foreground focus:outline-none",
        className,
      )}
      {...props}
    />
  );
}
