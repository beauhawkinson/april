import clsx from "clsx";
import { X } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";

import { Button } from "@/components/ui/button";

import type * as React from "react";

function Dialog(props: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger(props: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal(props: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return (
    <DialogPrimitive.Close data-slot="dialog-close" {...props} asChild>
      <Button variant="ghost" size="icon-xs">
        <span>
          <X className="icon-sm" />
          <span className="sr-only">Close</span>
        </span>
      </Button>
    </DialogPrimitive.Close>
  );
}

function DialogCancel(props: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return (
    <DialogPrimitive.Close data-slot="dialog-cancel" {...props} asChild>
      <Button variant="outline">Cancel</Button>
    </DialogPrimitive.Close>
  );
}

function DialogOverlay(props: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className="fixed inset-0 z-50 bg-black/20"
      {...props}
    />
  );
}

function DialogContent({
  children,
  side = "center",
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  side?: "center" | "top" | "bottom" | "left" | "right";
}) {
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={clsx(
          "fixed z-50 grid gap-4 bg-background custom:bg-surface shadow-2xl outline-none",
          "data-[state=closed]:ease-out-strong data-[state=open]:ease-in-out-strong",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "transition-[transform,opacity] duration-150",
          side === "center" &&
            "top-[50%] left-[50%] w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] rounded-3xl p-4 sm:top-[25%] sm:max-w-lg",
          side === "top" &&
            "inset-x-0 top-[1rem] mx-auto h-auto w-full max-w-[calc(100%-2rem)] rounded-3xl p-4 sm:max-w-lg",
          side === "bottom" && "inset-x-0 bottom-0 h-auto rounded-t-xl p-6",
          side === "left" && "inset-y-0 left-0 h-full w-3/4 rounded-r-xl p-6 sm:max-w-sm",
          side === "right" && "inset-y-0 right-0 h-full w-3/4 rounded-l-xl p-6 sm:max-w-sm",
          className,
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

function DialogHeader(props: React.ComponentProps<"div">) {
  return <div data-slot="dialog-header" className="flex flex-col gap-2 text-left" {...props} />;
}

function DialogFooter(props: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"
      {...props}
    />
  );
}

function DialogTitle(props: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className="select-none font-semibold text-foreground text-lg leading-none"
      {...props}
    />
  );
}

function DialogDescription(props: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className="select-none text-secondary-foreground"
      {...props}
    />
  );
}

export {
  Dialog,
  DialogCancel,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
