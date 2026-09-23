import { TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full rounded-sm border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none",
        className,
      )}
      {...props}
    />
  );
}
