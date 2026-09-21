import { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";

const variantClasses: Record<Variant, string> = {
  primary: "bg-accent text-accent-foreground hover:brightness-110 shadow-sm shadow-accent/20",
  secondary:
    "border border-stone-300 text-stone-900 hover:border-stone-400 hover:bg-stone-50 dark:border-stone-700 dark:text-stone-50 dark:hover:bg-stone-900",
  ghost: "text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-50",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium",
        "transition-all duration-200 ease-out",
        "hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:pointer-events-none disabled:opacity-50 disabled:hover:translate-y-0",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
