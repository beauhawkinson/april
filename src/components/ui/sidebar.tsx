"use client";

import clsx from "clsx";
import { PanelLeft } from "lucide-react";
import React from "react";
import { match } from "ts-pattern";

import Link from "@/components/core/link";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { COOKIES } from "@/lib/constants/cookies";
import { useIsMobile } from "@/lib/hooks/use-mobile";
import { useLayout } from "@/providers/layout-provider";

import type { CSSProperties } from "react";

const SIDEBAR_COOKIE_NAME = COOKIES.sidebar;
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

type SidebarContextProps = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextProps | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) throw new Error("useSidebar must be used within a SidebarProvider.");
  return context;
}

function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  style,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const isMobile = useIsMobile();
  const { layout } = useLayout();
  const [openMobile, setOpenMobile] = React.useState(false);
  const [_open, _setOpen] = React.useState(defaultOpen);
  const open = openProp ?? _open;

  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }
      // biome-ignore lint/suspicious/noDocumentCookie: persists sidebar state
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [setOpenProp, open],
  );

  const toggleSidebar = React.useCallback(() => {
    if (layout.sidebarCollapsible === "none" && !isMobile) return;
    return isMobile ? setOpenMobile((o) => !o) : setOpen((o) => !o);
  }, [isMobile, setOpen, layout.sidebarCollapsible]);

  const state = open ? "expanded" : "collapsed";

  const contextValue = React.useMemo<SidebarContextProps>(
    () => ({ state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar }),
    [state, open, setOpen, isMobile, openMobile, toggleSidebar],
  );

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "b") {
        e.preventDefault();
        toggleSidebar();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  return (
    <SidebarContext value={contextValue}>
      <div
        data-slot="sidebar-wrapper"
        style={
          {
            "--sidebar-width": "14rem",
            "--sidebar-collapsed-width": "3rem",
            ...style,
          } as CSSProperties
        }
        className={clsx(
          "group/sidebar-wrapper flex max-h-svh min-h-svh w-full overflow-hidden text-base",
          layout.sidebarVariant === "inset" ? "bg-sidebar" : "bg-content",
          layout.sidebarPosition === "right" && "flex-row-reverse",
        )}
        {...props}
      >
        {children}
      </div>
    </SidebarContext>
  );
}

function Sidebar({ children, ...props }: React.ComponentProps<"div">) {
  const { state } = useSidebar();
  const { layout } = useLayout();

  const {
    sidebarPosition: position,
    sidebarVariant: variant,
    sidebarCollapsible: collapsible,
  } = layout;
  const isLeft = position === "left";
  const isFloating = variant === "floating";
  const isInset = variant === "inset";

  // Border/outline for classic and floating only
  const innerDecoration = match({ variant, position })
    .with({ variant: "classic", position: "left" }, () =>
      collapsible === "offcanvas" && state === "collapsed"
        ? undefined
        : "shadow-[1px_0_0_0_var(--color-border)]",
    )
    .with({ variant: "classic", position: "right" }, () =>
      collapsible === "offcanvas" && state === "collapsed"
        ? undefined
        : "shadow-[-1px_0_0_0_var(--color-border)]",
    )
    .with({ variant: "floating" }, () => "rounded-lg outline outline-border")
    .otherwise(() => undefined);

  // Offcanvas translation direction
  const offcanvasTranslate = isLeft
    ? isFloating
      ? "group-data-[collapsible=offcanvas]:-translate-x-[calc(100%+1rem)]"
      : "group-data-[collapsible=offcanvas]:-translate-x-full"
    : isFloating
      ? "group-data-[collapsible=offcanvas]:translate-x-[calc(100%+1rem)]"
      : "group-data-[collapsible=offcanvas]:translate-x-full";

  return (
    <div
      className="group peer hidden md:block"
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-variant={variant}
      data-side={position}
      data-slot="sidebar"
    >
      <div
        data-slot="sidebar-gap"
        className="relative w-(--sidebar-width) transition-[transform,opacity] duration-300 ease-out-strong group-data-[collapsible=icon]:w-(--sidebar-collapsed-width) group-data-[collapsible=offcanvas]:w-0"
      />
      <div
        data-slot="sidebar-container"
        className={clsx(
          "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) md:flex",
          "transition-[transform,opacity] duration-300 ease-out-strong",
          "group-data-[collapsible=icon]:w-(--sidebar-collapsed-width)",
          isLeft ? "left-0" : "right-0 order-last",
          offcanvasTranslate,
          isInset ? "bg-transparent py-2" : "bg-content",
          isFloating && (isLeft ? "ml-2 py-2" : "mr-2 py-2"),
        )}
        {...props}
      >
        <div
          data-sidebar="sidebar"
          data-slot="sidebar-inner"
          className={clsx(
            "flex h-full w-full flex-col bg-sidebar text-sidebar-foreground",
            isInset && "rounded-lg",
            innerDecoration,
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function SidebarInset({ children, ...props }: React.ComponentProps<"main">) {
  const { layout } = useLayout();
  const { state, isMobile } = useSidebar();

  const isInset = layout.sidebarVariant === "inset";
  const isLeft = layout.sidebarPosition === "left";
  const isOffcanvasCollapsed = layout.sidebarCollapsible === "offcanvas" && state === "collapsed";

  return (
    <main
      data-slot="sidebar-inset"
      className={clsx(
        "relative grid min-h-0 w-full flex-1 grid-rows-[auto_1fr] overflow-hidden bg-content",
        isInset && !isMobile && "rounded-lg border",
        isInset && !isMobile && (isOffcanvasCollapsed ? "m-2" : isLeft ? "my-2 mr-2" : "my-2 ml-2"),
        isMobile && "m-0 rounded-none",
      )}
      {...props}
    >
      <div
        className={clsx(
          "flex items-center gap-2 p-2",
          layout.sidebarPosition === "right" && "ml-auto justify-end",
          layout.sidebarVariant === "floating" && "p-4",
          layout.sidebarCollapsible === "icon" && "invisible",
          state === "expanded" && "invisible",
        )}
      >
        <SidebarTrigger />
      </div>
      {children}
    </main>
  );
}

function SidebarContent(props: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-content"
      data-sidebar="content"
      className="flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden"
      {...props}
    />
  );
}

function SidebarGroup(props: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group"
      data-sidebar="group"
      className="relative flex w-full min-w-0 flex-col group-data-[collapsible=icon]:items-center"
      {...props}
    />
  );
}

function SidebarGroupLabel(props: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group-label"
      data-sidebar="group-label"
      className="mt-4 flex shrink-0 select-none items-center px-3 font-medium text-sidebar-foreground/70 text-sm outline-hidden group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:overflow-hidden group-data-[collapsible=icon]:px-0"
      {...props}
    />
  );
}

function SidebarMenu(props: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu"
      data-sidebar="menu"
      className="flex w-full min-w-0 flex-col gap-1 p-2"
      {...props}
    />
  );
}

function SidebarMenuItem(props: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-item"
      data-sidebar="menu-item"
      className="group/menu-item relative"
      {...props}
    />
  );
}

function SidebarFooter({ ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-footer"
      data-sidebar="footer"
      className="mt-auto flex flex-col gap-2 p-2"
      {...props}
    />
  );
}

const sidebarItemClass =
  "peer/menu-button group/menu-button w-full gap-1.5 px-[0.625rem] text-sm font-medium leading-snug border-transparent text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground focus-visible:border-primary data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-foreground justify-start group-data-[collapsible=icon]:[&>span]:hidden [&>span:last-child]:truncate overflow-hidden";

function SidebarTrigger({ className, ...props }: React.ComponentProps<"button">) {
  const { state, toggleSidebar } = useSidebar();
  const { layout } = useLayout();

  if (layout.sidebarCollapsible === "none") return null;

  return (
    <Tooltip delayDuration={500}>
      <TooltipTrigger asChild>
        <Button
          onClick={toggleSidebar}
          size="icon-md"
          className={clsx(
            sidebarItemClass,
            "w-fit!",
            state === "collapsed" ? "hover:cursor-e-resize" : "hover:cursor-w-resize",
            className,
          )}
          {...props}
        >
          <PanelLeft className="icon-sm" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side={layout.sidebarPosition === "right" ? "left" : "right"} sideOffset={16}>
        {state === "collapsed" ? "Expand sidebar" : "Collapse sidebar"}
        <Kbd>B</Kbd>
      </TooltipContent>
    </Tooltip>
  );
}

function SidebarMenuButton({
  className,
  tooltip,
  ...props
}: React.ComponentProps<typeof Button> & { tooltip?: string }) {
  const { state, isMobile } = useSidebar();

  return (
    <Tooltip delayDuration={500}>
      <TooltipTrigger asChild>
        <Button size="icon-md" className={clsx(sidebarItemClass, className)} {...props} />
      </TooltipTrigger>
      {tooltip && (
        <TooltipContent
          side="right"
          align="center"
          sideOffset={16}
          hidden={state !== "collapsed" || isMobile}
        >
          {tooltip}
        </TooltipContent>
      )}
    </Tooltip>
  );
}

function SidebarMenuLink({
  className,
  tooltip,
  ...props
}: React.ComponentProps<typeof Link> & { tooltip?: string }) {
  const { state, isMobile } = useSidebar();

  return (
    <Tooltip delayDuration={500}>
      <TooltipTrigger asChild>
        <Link size="icon-md" className={clsx(sidebarItemClass, className)} {...props} />
      </TooltipTrigger>
      {tooltip && (
        <TooltipContent
          side="right"
          align="center"
          sideOffset={16}
          hidden={state !== "collapsed" || isMobile}
        >
          {tooltip}
        </TooltipContent>
      )}
    </Tooltip>
  );
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuLink,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
};
