import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium transition-colors duration-150 disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent select-none",
  {
    variants: {
      variant: {
        primary: "bg-fg text-accent-fg hover:bg-accent",
        secondary: "bg-bg-subtle text-fg border border-border hover:bg-bg-hover",
        ghost: "text-fg-muted hover:text-fg hover:bg-bg-subtle",
        danger: "bg-danger text-fg hover:opacity-90",
      },
      size: {
        sm: "h-9 px-3 text-sm rounded-[8px]",
        md: "h-11 px-4 text-sm rounded-[10px]",
        lg: "h-12 px-5 text-base rounded-[12px]",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export function Button({
  className,
  variant,
  size,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
