import { cva } from "class-variance-authority";
import clsx from "clsx";

import type { VariantProps } from "class-variance-authority";
import type * as React from "react";

const buttonVariants = cva(
  [
    "rounded-lg border inline-flex items-center justify-center whitespace-nowrap",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 shrink-0",
    "disabled:pointer-events-none disabled:opacity-50",
    "select-none transition-none outline-none",
  ],
  {
    variants: {
      variant: {
        unstyled: "",
        primary:
          "border-0 bg-primary text-primary-foreground hover:bg-primary/80 focus-visible:ring focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        outline:
          "focus-visible:border-primary border-border bg-transparent text-secondary-foreground hover:bg-muted custom:hover:bg-content hover:text-foreground",
        ghost:
          "focus-visible:border-primary border-transparent text-secondary-foreground hover:bg-muted hover:text-foreground custom:hover:bg-content",
        destructive:
          "border-0 bg-red-500 text-destructive-foreground hover:bg-red-500/80 focus-visible:ring focus-visible:ring-destructive focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      },
      size: {
        xs: "h-6 gap-1 px-2",
        sm: "h-7 gap-1.5 px-2.5",
        md: "h-8 gap-2 px-2.5",
        lg: "h-9 gap-2 px-3",
        xl: "h-10 gap-2 px-3.5",
        "icon-xs": "size-6",
        "icon-sm": "size-7",
        "icon-md": "size-8",
        "icon-lg": "size-9",
        "icon-xl": "size-10",
      },
    },
    defaultVariants: {
      variant: "unstyled",
      size: "sm",
    },
  },
);

function Button({
  className,
  variant,
  size,
  inverseHover,
  withPress,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    withPress?: boolean;
    inverseHover?: boolean;
  }) {
  return (
    <button
      className={clsx(
        buttonVariants({ variant, size }),
        withPress && "active:scale-[0.97]",
        inverseHover !== undefined &&
          (inverseHover ? "custom:hover:bg-surface" : "custom:hover:bg-content"),
        className,
      )}
      {...props}
    />
  );
}

export { Button, buttonVariants };
