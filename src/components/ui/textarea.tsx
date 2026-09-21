import { TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 shadow-sm transition-all duration-200 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-50",
        className,
      )}
      {...props}
    />
  );
}
