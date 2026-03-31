import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive motion-reduce:transition-none active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-[linear-gradient(135deg,#0F3D2E_0%,#2F8F6B_100%)] text-white shadow-[0_4px_16px_rgba(47,143,107,0.35)] hover:shadow-[0_6px_20px_rgba(47,143,107,0.45)] hover:-translate-y-0.5",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/30",
        outline:
          "border-2 border-[#0F3D2E] bg-transparent text-[#0F3D2E] hover:bg-[#E6F4EE] dark:border-[#6DD4A8] dark:text-[#BEEBD7] dark:hover:bg-white/10",
        secondary:
          "bg-[#E6F4EE] text-[#0F3D2E] hover:bg-[#D1FAE5] dark:bg-[#1E3B34] dark:text-[#BEEBD7] dark:hover:bg-[#2F5249]",
        ghost:
          "text-[#0F3D2E] hover:bg-[#E6F4EE] dark:text-[#BEEBD7] dark:hover:bg-white/10",
        link: "text-[#2F8F6B] underline-offset-4 hover:underline dark:text-[#6DD4A8]",
      },
      size: {
        default: "min-h-[44px] px-5 py-2.5",
        sm: "min-h-[36px] rounded-lg gap-1.5 px-3 text-xs",
        lg: "min-h-[52px] rounded-xl px-7 text-base",
        icon: "min-h-[44px] min-w-[44px] rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
