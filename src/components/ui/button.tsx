import { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "accent";

const variantClasses: Record<Variant, string> = {
  primary: "bg-foreground text-background hover:opacity-85",
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
        "inline-flex items-center justify-center rounded-sm px-5 py-2.5 text-sm font-medium transition-colors disabled:opacity-50",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
