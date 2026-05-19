import { Link as RouterLink, useMatchRoute } from "@tanstack/react-router";
import { MoreHorizontal, Plus, Search, X } from "lucide-react";
import { useState } from "react";

import Link from "@/components/core/link";
import { Collapsible } from "@/components/ui/collapsible";
import { navLinks } from "@/lib/constants/nav-links";
import useDialogStore, { DialogType } from "@/lib/hooks/use-dialog-store";

const PINNED_COUNT = 2;
const pinnedLinks = navLinks.slice(0, PINNED_COUNT);

const MobileBottomNav = () => {
  const [open, setOpen] = useState(false);
  const matchRoute = useMatchRoute();
  const isTasksPage = !!matchRoute({ to: "/tasks" });

  const { setIsOpen: setIsSearchTaskOpen } = useDialogStore({
    type: DialogType.SearchTask,
  });

  const mobileNavClass =
    "rounded-full! active:bg-muted h-9 gap-2 flex items-center px-2.5 border-transparent transition-colors duration-150 hover:bg-muted ease-out-strong custom:hover:bg-surface";

  return (
    <>
      <button
        type="button"
        tabIndex={-1}
        className="fixed inset-0 z-50 bg-black/50 md:hidden"
        style={{
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.3s var(--ease-in-out-strong)",
        }}
        onClick={() => setOpen(false)}
        aria-label="Close navigation menu"
      />

      <nav className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 md:hidden">
        <div className="flex flex-col overflow-hidden rounded-2xl border bg-content shadow-lg">
          <Collapsible open={open}>
            <div className="flex flex-col gap-0.5 p-2 text-left">
              {navLinks.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  variant="ghost"
                  size="lg"
                  className="justify-start"
                  activeProps={{
                    className: "text-foreground bg-muted custom:bg-surface border-border",
                  }}
                  aria-label={item.label}
                >
                  <item.icon className="size-4 shrink-0" />
                  {item.label}
                </Link>
              ))}
            </div>
          </Collapsible>

          <div className="flex w-full items-center justify-between px-3 py-2">
            {open ? (
              <>
                <RouterLink
                  to="/tasks"
                  search={{ newTask: true, archived: undefined }}
                  className={mobileNavClass}
                  onClick={() => setOpen(false)}
                  aria-label="New Task"
                >
                  <Plus className="size-4" />
                </RouterLink>

                <button type="button" className={mobileNavClass} onClick={() => setOpen(false)}>
                  <X className="size-4" />
                </button>
              </>
            ) : isTasksPage ? (
              <>
                <button
                  type="button"
                  className={mobileNavClass}
                  onClick={() => setIsSearchTaskOpen(true)}
                  aria-label="Search tasks"
                >
                  <Search className="size-4" />
                </button>

                <RouterLink
                  to="/tasks"
                  search={{ newTask: true, archived: undefined }}
                  className={mobileNavClass}
                  aria-label="New Task"
                >
                  <Plus className="size-4" />
                </RouterLink>

                <button
                  type="button"
                  className={mobileNavClass}
                  onClick={() => setOpen((v) => !v)}
                  aria-label="Open navigation menu"
                >
                  <MoreHorizontal className="size-4" />
                </button>
              </>
            ) : (
              <>
                {pinnedLinks.map((item) => (
                  <RouterLink
                    key={item.to}
                    to={item.to}
                    className={mobileNavClass}
                    activeProps={{ className: "text-foreground bg-muted custom:bg-surface" }}
                    aria-label={item.label}
                  >
                    <item.icon className="size-4" />
                  </RouterLink>
                ))}

                <button
                  type="button"
                  className={mobileNavClass}
                  onClick={() => setOpen((v) => !v)}
                  aria-label="Open navigation menu"
                >
                  <MoreHorizontal className="size-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default MobileBottomNav;
