import { createFileRoute } from "@tanstack/react-router";
import { boolean, object, optional } from "valibot";

import { getPlans } from "@/server/functions/subscriptions/get-plans";
import { getSubscriptions } from "@/server/functions/subscriptions/get-subscriptions";

export const Route = createFileRoute("/_authenticated/billing/")({
  head: () => ({
    meta: [
      { title: "Billing" },
      {
        name: "description",
        content: `Manage your subscriptions and billing information`,
      },
    ],
  }),
  validateSearch: object({
    upgraded: optional(boolean()),
  }),
  loader: async () => {
    const [subscriptions, plans] = await Promise.all([getSubscriptions(), getPlans()]);

    return { subscriptions, plans };
  },
});
