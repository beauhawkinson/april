# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun dev              # Dev server on port 3000
bun build            # Production build
bun start            # Preview production build
bunx biome check     # Lint + format check
bunx biome check --write  # Lint + format check with auto-fix
bunx tsc --noEmit    # Type check
bun knip             # Find unused exports and dependencies
bun generate         # Generate Drizzle migrations (requires .env.local)
bun migrate          # Run migrations (requires .env.local)
bun studio           # Open Drizzle Studio (requires .env.local)
```

Pre-push hooks run typecheck, biome check --write, and knip automatically via lefthook.

## Architecture

**Framework**: TanStack Start (SSR React router) + Vite + Nitro (deployed to Vercel). No test suite.

**Routing** (`src/routes/`): File-based via TanStack Router. Routes are split into two files per route:
- `index.tsx` — loader, head meta, search param validation (runs on server)
- `index.lazy.tsx` — component (lazy-loaded on client)

The `_authenticated` layout route (`src/routes/_authenticated.tsx`) guards all authenticated pages, fetches session/layout in `beforeLoad`, and renders either a desktop sidebar layout or a mobile bottom-nav layout.

**Server functions** (`src/server/functions/`): All data fetching and mutations use `createServerFn` from `@tanstack/react-start`. These run server-side and are called directly from loaders and components. Auth is verified inside each function by calling `auth.api.getSession({ headers: getRequestHeaders() })`.

**Auth** (`src/lib/config/auth.config.ts`): better-auth with Google, GitHub, passkey, SIWE (Sign In With Ethereum), and Stripe plugins. The auth client (`src/lib/auth/auth-client.ts`) is used client-side. `tanstackStartCookies()` must remain the last plugin.

**Database** (`src/lib/db/`): PostgreSQL via Drizzle ORM. Schema is in `schema.ts`. Generated migrations live in `src/generated/drizzle/`. The `db` instance is in `db.ts`.

**Environment** (`src/lib/config/t3.config.ts`): Server env vars are validated at startup via `@t3-oss/env-core` using Valibot. All server vars must be declared here to be accessible. Copy `.env.local.template` → `.env.local` to get started.

**Styling**: Tailwind CSS v4 with a custom oklch-based token system defined in `src/styles.css`. Four text tiers: `foreground`, `secondary-foreground`, `muted-foreground`, `faded-foreground`. Background tiers: `background`, `content`, `surface`, `muted`. Custom themes are applied via CSS custom properties on `document.documentElement`. Font size scales globally via `--font-size-base`.

**Providers** (`src/providers/`): Three context providers wrap the app:
- `ThemeProvider` — manages theme state and persists via debounced server function calls
- `AppearanceProvider` — pointer cursor and other appearance preferences
- `LayoutProvider` — sidebar position/variant/collapsible settings (authenticated routes only)

**Dialog state** (`src/lib/hooks/use-dialog-store.ts`): Zustand stores keyed by `DialogType` enum. Use `useDialogStore({ type: DialogType.X })` to control any dialog's open state.

**Import alias**: `@/` maps to `src/`.

## Code style

Enforced by Biome (`biome.json`):
- Double quotes, space indentation, 100 char line width, trailing commas
- Type imports must be separated: `import type { Foo } from "..."` on its own line
- Tailwind classes must be sorted (enforced via `useSortedClasses` with `cn`, `cva`, `tv`)
- No unused imports (auto-fixed)
- No `console.log` — only `console.error` and `console.warn` are allowed
- Imports ordered: Node built-ins → blank → packages → blank → local → blank → types

Input validation uses Valibot throughout (not Zod).
