import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  ChevronDown,
  FileBracesCorner,
  Monitor,
  Moon,
  Palette,
  Sun,
} from "lucide-react";
import { useEffect, useState } from "react";
import { match } from "ts-pattern";

import Link from "@/components/core/link";
import ImportThemeDialog from "@/components/features/settings/import-theme-dialog";
import ThemeChanger from "@/components/features/settings/theme-changer";
import { Button } from "@/components/ui/button";
import { Diamond } from "@/components/ui/diamond";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { app } from "@/lib/config/app.config";
import useDialogStore, { DialogType } from "@/lib/hooks/use-dialog-store";
import { applyCustomTheme } from "@/lib/utils/theme";
import { useTheme } from "@/providers/theme-provider";
import { getSession } from "@/server/functions/user/get-session";
import { trackView } from "@/server/functions/views/track-view";

import type { CustomTheme } from "@/server/functions/preferences/theme";

const THEME_OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
  { value: "custom", label: "Custom", icon: Palette },
] as const;

const initialTheme: CustomTheme = { contrast: 100, sidebar: { contrast: 50 } };

export const Route = createFileRoute("/")({
  component: LandingPage,
  loader: async () => {
    const [session, { count }] = await Promise.all([getSession(), trackView()]);
    return { session, views: count };
  },
});

// ── Component ─────────────────────────────────────────────────────────────────

function LandingPage() {
  const { session, views } = Route.useLoaderData();
  const { theme, setTheme, customTheme: savedTheme, setCustomTheme: setProviderTheme } = useTheme();
  const [customTheme, setCustomTheme] = useState<CustomTheme>(savedTheme ?? initialTheme);
  const { setIsOpen: setIsImportThemeOpen } = useDialogStore({ type: DialogType.ImportTheme });

  useEffect(() => {
    if (views != null)
      // biome-ignore lint/suspicious/noConsole: intentional page view log
      console.log(`👀 ${views} people have viewed this page`);
  }, [views]);

  const save = (next: CustomTheme) => {
    applyCustomTheme(document.documentElement, next);
    setCustomTheme(next);
    setProviderTheme(next);
    if (next.base && theme !== "custom") setTheme("custom");
  };

  return (
    <div className="relative mx-auto flex min-h-dvh w-full flex-col overflow-hidden bg-background px-4 text-foreground sm:px-6">
      <main className="mx-auto w-full max-w-5xl">
        {/* Hero */}
        <div className="mx-auto mt-24 w-full max-w-5xl">
          <div className="flex justify-between">
            <div>
              <div className="mb-3 flex select-none gap-2.5">
                <img src="/favicon.svg" alt="" className="size-12" draggable={false} aria-hidden />
                <span className="font-semibold text-5xl text-foreground">{app.name}</span>
              </div>

              <p className="mb-7 select-none text-muted-foreground text-xl leading-relaxed">
                Auth, billing, theming, and the boring parts — done.
              </p>

              {session ? (
                <Link
                  to="/tasks"
                  variant="primary"
                  search={{ archived: undefined, newTask: undefined }}
                  className="w-fit px-8 py-4 text-lg"
                >
                  Open App <ArrowRight className="icon-md ml-2" />
                </Link>
              ) : (
                <Link to="/sign-in" variant="primary" className="w-fit">
                  Get started free <ArrowRight className="icon-sm" />
                </Link>
              )}
            </div>

            <div className="-mt-32 hidden opacity-50 sm:block">
              <Diamond size={600} speed={0.003} />
            </div>
          </div>
        </div>

        {/* Theme showcase */}
        <section className="mt-20 bg-content pb-16">
          <div className="rounded-xl border bg-surface">
            <div className="flex items-center justify-between border-b p-4">
              <div>
                <p className="font-semibold text-foreground text-sm">Interface theme</p>
                <p className="text-muted-foreground text-xs">Try it live</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsImportThemeOpen(true)}>
                  <FileBracesCorner className="icon-sm" />
                  Import
                </Button>
                <Select value={theme} onValueChange={(v) => setTheme(v as typeof theme)}>
                  <SelectTrigger asChild>
                    <Button variant="outline" aria-label="Select interface theme">
                      {match(theme)
                        .with("light", () => <Sun className="icon-sm" />)
                        .with("dark", () => <Moon className="icon-sm" />)
                        .with("system", () => <Monitor className="icon-sm" />)
                        .with("custom", () => <Palette className="icon-sm" />)
                        .exhaustive()}
                      <SelectValue />
                      <ChevronDown className="icon-xs" />
                    </Button>
                  </SelectTrigger>
                  <SelectContent align="end">
                    <SelectGroup>
                      {THEME_OPTIONS.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                          icon={<option.icon className="icon-sm" />}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <ThemeChanger theme={customTheme} onChange={save} />
          </div>

          <ImportThemeDialog onChange={save} />
        </section>
      </main>

      <footer className="px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-muted-foreground text-xs">
            Built with TanStack Start · Deployed on Vercel
          </p>
        </div>
      </footer>
    </div>
  );
}
