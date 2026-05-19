import { createFileRoute } from "@tanstack/react-router";

import { getAccounts } from "@/server/functions/user/get-accounts";
import { getPasskeys } from "@/server/functions/user/get-passkeys";
import { getWallets } from "@/server/functions/user/get-wallets";

export const Route = createFileRoute("/_authenticated/accounts/")({
  head: () => ({
    meta: [
      { title: "Accounts" },
      {
        name: "description",
        content: `Manage your accounts`,
      },
    ],
  }),
  loader: async () => {
    const [accounts, passkeys, wallets] = await Promise.all([
      getAccounts(),
      getPasskeys(),
      getWallets(),
    ]);
    return { accounts, passkeys, wallets };
  },
});
