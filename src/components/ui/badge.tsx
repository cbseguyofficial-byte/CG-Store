import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-foreground border-border",
        success: "border-transparent bg-emerald-500 text-white",
        warning: "border-transparent bg-amber-500 text-white",
        accent: "border-transparent bg-accent text-accent-foreground",
        bestseller: "border-transparent bg-gradient-to-r from-turquoise-surf to-sky-aqua text-deep-twilight font-bold",
        new: "border-transparent bg-gradient-to-r from-french-blue to-bright-teal-blue text-white font-bold",
        limited: "border-transparent bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold",
        glass: "border-light-cyan/30 bg-light-cyan/20 text-deep-twilight backdrop-blur-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
