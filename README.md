# April

A TanStack Start template with multi-provider auth, layout and theme customization, file storage, Stripe billing, and a demo task manager built in.

## What's included

**Authentication** — Google, GitHub, passkey, and Sign In With Ethereum (SIWE) via better-auth. Multi-session support lets users switch between accounts without signing out.

**Layout & theming** — Configurable sidebar (position, variant, collapsible mode) persisted in the database for cross-device sync, custom color themes with live preview, font size scaling, and pointer cursor preferences. Theme and appearance settings persist in cookies for instant SSR.

**Design system** — A minimal, intentional token system built on oklch. Four-tier text hierarchy (foreground, secondary, muted, faded) inspired by Linear. Font sizes scale globally via a single `--font-size-base` variable with user preference support (smaller → larger). No unused shadcn defaults — every token is actively consumed.

**Wallet linking** — Link an Ethereum wallet to an existing account with full SIWE nonce validation, domain/address/chainId verification, and one-time-use nonce consumption.

**Billing** — Stripe subscriptions with invoice history and cursor-based pagination.

**Tasks** — A demo CRUD module with inline editing, bulk actions, keyboard shortcuts, and virtualized rendering.

## Stack

- **Framework** — [TanStack Start](https://tanstack.com/start) + [React 19](https://react.dev) + [Vite](https://vite.dev)
- **Auth** — [better-auth](https://better-auth.com) (Google, GitHub, passkey, SIWE, multi-session)
- **Database** — PostgreSQL + [Drizzle ORM](https://orm.drizzle.team)
- **Styling** — [Tailwind CSS v4](https://tailwindcss.com) + [Radix UI](https://radix-ui.com)
- **Payments** — [Stripe](https://stripe.com)
- **Storage** — [Cloudflare R2](https://developers.cloudflare.com/r2) (avatar uploads)
- **Wallet** — [viem](https://viem.sh) + EIP-6963 injected provider discovery (no external wallet SDK)
- **Validation** — [Valibot](https://valibot.dev)
- **Linting** — [Biome](https://biomejs.dev)

## Getting started

```bash
bun install
cp .env.local.template .env.local
```

Fill in your `.env.local` with credentials for the services above, then:

```bash
bun db:migrate
bun dev
```

The app runs at `http://localhost:3000`.

## Scripts

| Command | Description |
|---|---|
| `bun dev` | Start dev server on port 3000 |
| `bun build` | Production build |
| `bun start` | Preview production build |
| `bunx biome check` | Biome lint + format check |
| `bun knip` | Find unused exports and dependencies |
| `bun generate` | Generate Drizzle migrations |
| `bun migrate` | Run migrations |
| `bun studio` | Open Drizzle Studio |

## Environment variables

Server-side variables are validated at startup via `@t3-oss/env-core`. See `src/lib/config/t3.config.ts` for the full schema. Required:

- `DATABASE_URL` — PostgreSQL connection string
- `BETTER_AUTH_SECRET` / `BETTER_AUTH_URL` — Auth config
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — Google OAuth
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` — GitHub OAuth
- `R2_ACCOUNT_ID` / `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` / `R2_BUCKET_NAME` / `R2_PUBLIC_URL` — Cloudflare R2
- `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` — Stripe

## License

MIT