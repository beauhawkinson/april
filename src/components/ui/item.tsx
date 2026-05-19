import { cva } from "class-variance-authority";
import clsx from "clsx";
import * as React from "react";
import { createContext } from "react";

import type { VariantProps } from "class-variance-authority";

const ItemGroupContext = createContext<"list" | "group">("group");

function ItemGroup({
  variant = "group",
  ref,
  ...props
}: Omit<React.HTMLAttributes<HTMLElement>, "ref"> & {
  variant?: "list" | "group";
  ref?: React.Ref<HTMLElement>;
}) {
  return (
    <ItemGroupContext.Provider value={variant}>
      {variant === "list" ? (
        <ul
          ref={ref as React.Ref<HTMLUListElement>}
          data-slot="item-group"
          className="group/item-group flex flex-col divide-y rounded-xl border bg-surface"
          {...props}
        />
      ) : (
        <div
          ref={ref as React.Ref<HTMLDivElement>}
          data-slot="item-group"
          className="group/item-group flex flex-col divide-y rounded-xl border bg-surface"
          {...props}
        />
      )}
    </ItemGroupContext.Provider>
  );
}

const itemVariants = cva(
  "group/item flex items-center bg-surface transition-none [a]:hover:bg-muted/50 flex-wrap outline-none focus-visible:border-primary focus-visible:ring-primary/50",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border border-border",
        destructive: "bg-destructive/5 border border-destructive/20",
      },
      size: {
        default: "p-4 gap-4 ",
        sm: "py-3 min-h-14 px-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  },
);

function Item({
  className,
  variant = "default",
  size = "sm",
  ref,
  ...props
}: Omit<React.HTMLAttributes<HTMLElement>, "ref"> &
  VariantProps<typeof itemVariants> & {
    ref?: React.Ref<HTMLElement>;
  }) {
  const groupVariant = React.useContext(ItemGroupContext);
  const classes = clsx(itemVariants({ variant, size }), className);

  return groupVariant === "list" ? (
    <li
      ref={ref as React.Ref<HTMLLIElement>}
      data-slot="item"
      data-variant={variant}
      data-size={size}
      className={classes}
      {...props}
    />
  ) : (
    <div
      ref={ref as React.Ref<HTMLDivElement>}
      data-slot="item"
      data-variant={variant}
      data-size={size}
      className={classes}
      {...props}
    />
  );
}

function ItemContent({ ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-content"
      className="flex flex-1 flex-col [&+[data-slot=item-content]]:flex-none"
      {...props}
    />
  );
}

function ItemTitle({ ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-title"
      className="flex w-fit items-center gap-2 font-medium text-base text-foreground leading-snug first-letter:uppercase group-data-[variant=destructive]/item:text-destructive"
      {...props}
    />
  );
}

function ItemDescription({ ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="item-description"
      className="line-clamp-2 text-balance font-normal text-secondary-foreground text-sm leading-normal group-data-[variant=destructive]/item:text-destructive/80 [&>a:hover]:cursor-pointer [&>a:hover]:text-primary [&>a:hover]:underline"
      {...props}
    />
  );
}

function ItemActions({ ...props }: React.ComponentProps<"div">) {
  return <div data-slot="item-actions" className="ml-auto flex items-center gap-2" {...props} />;
}

export { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemTitle };
