import { TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-foreground focus:outline-none",
        className,
      )}
      {...props}
    />
  );
}
