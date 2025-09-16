import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-[#fdfcff] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fe7244] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[#fe7244] text-[#ffffff] hover:bg-[#fe7244]/90",
        destructive: "bg-[#ef4444] text-[#fafafa] hover:bg-[#ef4444]/90",
        outline:
          "border border-[#e0e0e0] bg-white hover:bg-[#e0e0e0] hover:text-accent-foreground",
        secondary: "bg-[#f6f3f0] text-[#1c1f24] hover:bg-[#f6f3f0]/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-[#fe7244] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
