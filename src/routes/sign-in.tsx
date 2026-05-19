import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Fingerprint } from "lucide-react";

import Link from "@/components/core/link";
import { ConnectWalletDialog } from "@/components/features/auth/siwe/connect-wallet-dialog";
import { EthereumIcon } from "@/components/icons/ethereum";
import { GitHubIcon } from "@/components/icons/github";
import { GoogleIcon } from "@/components/icons/google";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { authClient, signIn } from "@/lib/auth/auth-client";
import { app } from "@/lib/config/app.config";
import { getSession } from "@/server/functions/user/get-session";

export const Route = createFileRoute("/sign-in")({
  component: SignInPage,
  head: () => ({
    meta: [
      { title: "Sign in" },
      {
        name: "description",
        content: `Sign in to your account`,
      },
    ],
  }),
  loader: async () => {
    const session = await getSession();
    return { session };
  },
  beforeLoad: async () => {
    const session = await getSession();
    if (session) {
      throw redirect({ to: "/tasks", search: { archived: undefined, newTask: undefined } });
    }
  },
});

function SignInPage() {
  const navigate = useNavigate();

  const handlePasskeySignIn = async () => {
    const { error } = await authClient.signIn.passkey({
      fetchOptions: {
        onSuccess: () =>
          navigate({ to: "/tasks", search: { archived: undefined, newTask: undefined } }),
      },
    });

    if (error) {
      toast.error({
        title: "Sign in failed",
        description: "Could not sign in with passkey.",
      });
    }
  };

  return (
    <main className="flex min-h-dvh w-full flex-col items-center justify-center bg-background px-4 py-12">
      <div className="relative w-full max-w-sm">
        <Link variant="ghost" to="/" className="custom:hover:bg-surface">
          <ArrowLeft className="icon-sm" />
          Back
        </Link>

        <div className="mt-6 mb-8 flex flex-col items-center text-center">
          <div
            aria-hidden
            className="mb-4 flex size-12 items-center justify-center rounded-xl border bg-surface"
          >
            <span className="font-bold text-foreground text-lg">
              {app.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <h1 className="font-bold text-2xl text-foreground tracking-tight">Welcome back</h1>
          <p className="mt-1.5 text-muted-foreground text-sm">Sign in to continue to {app.name}</p>
        </div>

        <div className="rounded-xl border bg-surface p-6">
          <div className="grid gap-2">
            <Button
              variant="outline"
              size="lg"
              onClick={() => signIn("google")}
              className="justify-center"
            >
              <GoogleIcon />
              Continue with Google
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => signIn("github")}
              className="justify-center"
            >
              <GitHubIcon />
              Continue with GitHub
            </Button>

            <div className="flex w-full items-center gap-3 py-1 text-muted-foreground">
              <div className="h-px w-full bg-border" />
              <span className="shrink-0 text-xs">or</span>
              <div className="h-px w-full bg-border" />
            </div>

            <Button
              variant="outline"
              size="lg"
              onClick={handlePasskeySignIn}
              className="justify-center"
            >
              <Fingerprint className="icon-sm" />
              Sign in with Passkey
            </Button>

            <ConnectWalletDialog
              mode="sign-in"
              trigger={
                <Button variant="outline" size="lg" className="justify-center">
                  <EthereumIcon />
                  Sign In With Ethereum
                </Button>
              }
            />
          </div>
        </div>

        <p className="mt-6 text-center text-muted-foreground text-xs">
          By signing in you agree to our{" "}
          <a href="/terms" className="underline underline-offset-2 hover:text-foreground">
            Terms
          </a>{" "}
          and{" "}
          <a href="/privacy" className="underline underline-offset-2 hover:text-foreground">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </main>
  );
}
