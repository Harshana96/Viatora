import { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "accent";

const variantClasses: Record<Variant, string> = {
  primary: "bg-foreground text-background hover:bg-accent hover:text-accent-foreground",
  secondary: "border border-border text-foreground hover:border-foreground",
  accent: "bg-accent text-accent-foreground hover:opacity-90",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-medium tracking-[0.14em] uppercase transition-colors disabled:opacity-50",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
