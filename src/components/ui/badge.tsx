import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#fe7244] focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#fe7244] text-[#ffffff] hover:bg-[#fe7244]/80",
        secondary:
          "border-transparent bg-[#fef4ec] text-orange-500 hover:bg-[#f6f3f0]/80",
        destructive:
          "border-transparent bg-[#ef4444] text-[#fafafa] hover:bg-[#ef4444]/80",
        outline: "text-[#0a0a0a]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
