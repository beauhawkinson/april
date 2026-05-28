import {
  HeadContent,
  Outlet,
  ScriptOnce,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";

import { Toaster } from "@/components/ui/toast";
import { app } from "@/lib/config/app.config";
import { AppearanceProvider } from "@/providers/appearance-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { getAppearance } from "@/server/functions/preferences/appearance";
import { getThemePreferences } from "@/server/functions/preferences/theme";
import appCss from "../styles.css?url";

import type { QueryClient } from "@tanstack/react-query";
import type { Session, User } from "better-auth";
import type { PropsWithChildren } from "react";

interface RouterContext {
  queryClient: QueryClient;
  session: Session | null;
  user: User | undefined;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  loader: async () => {
    const [themePreferences, appearance] = await Promise.all([
      getThemePreferences(),
      getAppearance(),
    ]);
    return { themePreferences, appearance };
  },
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: app.name },
      {
        name: "description",
        content: app.description,
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/site.webmanifest" },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: PropsWithChildren) {
  const { themePreferences, appearance } = Route.useLoaderData();
  const { theme, customTheme, css } = themePreferences;

  // theme + optional pointer cursor preference
  const htmlClass = [theme, appearance.usePointerCursor && "pointer-cursor"]
    .filter(Boolean)
    .join(" ");

  // Inline script that applies before first paint
  const themeScript =
    theme === "custom" && css ? (
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){var r=document.documentElement.style;${Object.entries(css)
            .filter(([, v]) => v)
            .map(([k, v]) => `r.setProperty("--${k}","${v}")`)
            .join(";")}})()`,
        }}
      />
    ) : null;

  return (
    <html lang="en" className={htmlClass} suppressHydrationWarning>
      <head>
        <ScriptOnce
          // biome-ignore lint/correctness/noChildrenProp: expected
          children={`
      try {
        const size = localStorage.getItem('font-size-base') || '12px';
        document.documentElement.style.setProperty('--font-size-base', size);
      } catch (e) {}
    `}
        />
        <HeadContent />
        {themeScript}
      </head>
      <body className="flex min-h-dvh w-full">
        <ThemeProvider theme={theme} customTheme={customTheme}>
          <AppearanceProvider initial={appearance}>
            {children}

            <Toaster richColors />
          </AppearanceProvider>
        </ThemeProvider>

        <Scripts />
      </body>
    </html>
  );
}
