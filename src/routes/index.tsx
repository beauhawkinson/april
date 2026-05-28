import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, CheckSquare, CreditCard, Palette, Shield, Wallet, Zap } from "lucide-react";

import Link from "@/components/core/link";
import { app } from "@/lib/config/app.config";
import { getSession } from "@/server/functions/user/get-session";

export const Route = createFileRoute("/")({
  component: LandingPage,
  loader: async () => {
    const session = await getSession();
    return { session };
  },
});

const features = [
  {
    icon: Shield,
    title: "Multi-Provider Auth",
    description:
      "Google, GitHub, Passkeys, Ethereum. Yes, Ethereum. Switch accounts without logging out like an animal.",
  },
  {
    icon: Palette,
    title: "Fully Themeable",
    description:
      "Light, dark, custom. OKLCH colors that actually make sense. Font sizes, sidebar layouts, all persisted. You're welcome.",
  },
  {
    icon: CreditCard,
    title: "Stripe Billing",
    description:
      "Plans, trials, invoices, cancellations. The whole uncomfortable conversation, handled gracefully.",
  },
  {
    icon: CheckSquare,
    title: "Task Management",
    description:
      "A fully functional task management module. Create, edit, delete, archive. Here's the todo app.",
  },
  {
    icon: Wallet,
    title: "Web3 Ready",
    description:
      "SIWE with nonce validation, wallet linking, WalletConnect. For when your users are built different.",
  },
  {
    icon: Zap,
    title: "Modern Stack",
    description:
      "TanStack Start, React 19, Drizzle, Tailwind v4, Bun. No legacy guilt. No webpack.",
  },
];

const stack = [
  "TanStack Start",
  "React 19",
  "Drizzle ORM",
  "Tailwind v4",
  "better-auth",
  "Stripe",
  "Wagmi",
  "Bun",
];

function LandingPage() {
  const { session } = Route.useLoaderData();

  return (
    <div className="mx-auto flex min-h-dvh w-full flex-col bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-12 max-w-5xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <img src="/favicon.svg" alt={`${app.name} Logo`} className="size-5" />
            <span className="font-semibold text-lg">{app.name}</span>
          </div>
          <nav className="flex items-center gap-1 sm:gap-2">
            {session ? (
              <Link
                to="/tasks"
                variant="primary"
                size="sm"
                search={{ archived: undefined, newTask: undefined }}
              >
                Open App <ArrowRight className="icon-xs" />
              </Link>
            ) : (
              <Link to="/sign-in" variant="primary" size="sm">
                Sign in
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-12 py-10 sm:gap-16 sm:py-14">
        {/* Hero */}
        <section id="hero">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <h1 className="mb-4 font-bold text-3xl leading-[1.1] tracking-tight sm:text-4xl md:text-5xl">
              Skip the setup.
              <br />
              <span style={{ color: "var(--primary)" }}>Ship the thing.</span>
            </h1>

            <p className="mb-6 max-w-xl text-muted-foreground text-sm leading-relaxed sm:text-base">
              A TanStack Start boilerplate with auth, billing, theming, and the boring parts done.
              Clone it, rename it, ship it.
            </p>

            <div className="mb-6 flex flex-wrap items-center gap-3">
              {session ? (
                <Link
                  to="/tasks"
                  variant="primary"
                  search={{ archived: undefined, newTask: undefined }}
                >
                  Open App <ArrowRight className="icon-sm" />
                </Link>
              ) : (
                <Link to="/sign-in" variant="primary">
                  Get started free <ArrowRight className="icon-sm" />
                </Link>
              )}
            </div>

            <div className="flex flex-wrap gap-x-3 gap-y-1 divide-x border-t pt-4">
              {stack.map((tech) => (
                <span key={tech} className="pr-2 font-mono text-muted-foreground text-xs">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Terminal */}
        <section id="terminal">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="overflow-hidden rounded-lg border bg-muted/30 font-mono text-xs sm:text-sm">
              <div className="flex items-center gap-1.5 border-b bg-muted/50 px-3 py-2">
                <span className="size-2.5 rounded-full bg-muted-foreground/30" />
                <span className="size-2.5 rounded-full bg-muted-foreground/30" />
                <span className="size-2.5 rounded-full bg-muted-foreground/30" />
                <span className="ml-2 text-muted-foreground text-xs">~/your-next-thing</span>
              </div>
              <div className="space-y-1.5 p-4 leading-relaxed sm:p-5">
                <div>
                  <span className="text-muted-foreground">$</span>{" "}
                  <span>bun create ./your-next-thing</span>
                </div>
                <div className="text-muted-foreground">
                  <span style={{ color: "var(--primary)" }}>✓</span> auth, billing, theming wired up
                </div>
                <div className="text-muted-foreground">
                  <span style={{ color: "var(--primary)" }}>✓</span> database migrations ready
                </div>
                <div>
                  <span className="text-muted-foreground">$</span> <span>bun dev</span>
                </div>
                <div className="text-muted-foreground">
                  ready on <span style={{ color: "var(--primary)" }}>http://localhost:3000</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="mb-8 sm:mb-10">
              <h2 className="font-bold text-2xl tracking-tight sm:text-3xl">
                Everything you were going to build anyway.
              </h2>
              <p className="mt-2 text-muted-foreground text-sm">
                Six things you'd spend a weekend on. Already done.
              </p>
            </div>
            <div className="grid gap-6">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="flex gap-3 bg-background">
                    <Icon
                      className="icon-sm mt-0.5 shrink-0 text-primary"
                      style={{ color: "var(--primary)" }}
                    />
                    <div>
                      <h3 className="mb-1 font-semibold text-sm">{feature.title}</h3>
                      <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section id="cta">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="flex flex-col items-start gap-4 rounded-lg border bg-muted/30 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div>
                <h2 className="font-bold text-lg tracking-tight sm:text-xl">
                  Still reading? Just clone it.
                </h2>
                <p className="mt-1 text-muted-foreground text-sm">
                  You'll be running in under a minute.
                </p>
              </div>
              {session ? (
                <Link
                  to="/tasks"
                  variant="primary"
                  search={{ archived: undefined, newTask: undefined }}
                >
                  Open App <ArrowRight className="icon-sm" />
                </Link>
              ) : (
                <Link to="/sign-in" variant="primary">
                  Get started free <ArrowRight className="icon-sm" />
                </Link>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-semibold text-sm">{app.name}</span>
          <p className="text-muted-foreground text-xs">
            Built with TanStack Start · Deployed on Vercel
          </p>
        </div>
      </footer>
    </div>
  );
}
