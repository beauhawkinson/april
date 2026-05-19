import { createFileRoute } from "@tanstack/react-router";

import { app } from "@/lib/config/app.config";

export const Route = createFileRoute("/(legal)/privacy")({
  component: PrivacyPage,
  head: () => ({
    meta: [{ title: `Privacy Policy — ${app.name}` }],
  }),
});

function PrivacyPage() {
  const effectiveDate = "May 4, 2025";

  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <div className="mb-10">
        <h1 className="font-semibold text-3xl text-primary">Privacy Policy</h1>
        <p className="mt-2 text-muted-foreground text-sm">Effective date: {effectiveDate}</p>
      </div>

      <div className="space-y-8 text-foreground/90 text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-medium text-base text-foreground">1. Introduction</h2>
          <p>
            {app.name} ("we", "us", or "our") is committed to protecting your personal information.
            This Privacy Policy explains what data we collect, how we use it, and the choices you
            have.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-medium text-base text-foreground">2. Information We Collect</h2>
          <p>We collect the following types of information:</p>
          <ul className="ml-4 list-inside list-disc space-y-1 text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">Account information</span> — name, email
              address, and profile picture provided when you sign in via Google, GitHub, or a
              passkey.
            </li>
            <li>
              <span className="font-medium text-foreground">Wallet information</span> — Ethereum
              wallet address if you choose to link one to your account.
            </li>
            <li>
              <span className="font-medium text-foreground">Usage data</span> — pages visited,
              features used, and interaction logs for improving the Service.
            </li>
            <li>
              <span className="font-medium text-foreground">Payment data</span> — billing details
              processed and stored securely by Stripe. We do not store raw card numbers.
            </li>
            <li>
              <span className="font-medium text-foreground">Preferences</span> — theme, appearance,
              and layout settings stored to provide a consistent experience across devices.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-medium text-base text-foreground">3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="ml-4 list-inside list-disc space-y-1 text-muted-foreground">
            <li>Provide, maintain, and improve the Service.</li>
            <li>Authenticate you and manage your account sessions.</li>
            <li>Process payments and send billing-related communications.</li>
            <li>Respond to support requests and inquiries.</li>
            <li>Detect and prevent fraudulent or unauthorized activity.</li>
            <li>Comply with legal obligations.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-medium text-base text-foreground">4. Data Sharing</h2>
          <p>
            We do not sell your personal information. We may share data with trusted third-party
            service providers who assist us in operating the Service, including:
          </p>
          <ul className="ml-4 list-inside list-disc space-y-1 text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">Stripe</span> — payment processing.
            </li>
            <li>
              <span className="font-medium text-foreground">Cloudflare R2</span> — file storage for
              avatars and uploads.
            </li>
            <li>
              <span className="font-medium text-foreground">Google / GitHub</span> — OAuth
              authentication providers.
            </li>
          </ul>
          <p>
            Each provider is contractually bound to handle your data in accordance with applicable
            privacy laws.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-medium text-base text-foreground">5. Cookies and Storage</h2>
          <p>
            We use cookies and local storage to maintain your session, store appearance preferences,
            and provide a seamless experience. You can configure your browser to refuse cookies, but
            some parts of the Service may not function properly as a result.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-medium text-base text-foreground">6. Data Retention</h2>
          <p>
            We retain your personal information for as long as your account is active or as needed
            to provide the Service. You may request deletion of your account and associated data at
            any time by contacting us.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-medium text-base text-foreground">7. Security</h2>
          <p>
            We implement industry-standard security measures including HTTPS, encrypted storage, and
            one-time-use nonce validation for wallet sign-in. No system is completely secure, and we
            cannot guarantee absolute security of your data.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-medium text-base text-foreground">8. Your Rights</h2>
          <p>Depending on your jurisdiction, you may have the right to:</p>
          <ul className="ml-4 list-inside list-disc space-y-1 text-muted-foreground">
            <li>Access the personal data we hold about you.</li>
            <li>Request correction of inaccurate data.</li>
            <li>Request deletion of your data.</li>
            <li>Object to or restrict certain processing activities.</li>
            <li>Data portability where technically feasible.</li>
          </ul>
          <p>To exercise any of these rights, please contact us at the address below.</p>
        </section>

        <section className="space-y-3">
          <h2 className="font-medium text-base text-foreground">9. Children's Privacy</h2>
          <p>
            The Service is not directed to children under the age of 13. We do not knowingly collect
            personal information from children. If you believe we have inadvertently collected such
            information, please contact us so we can delete it promptly.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-medium text-base text-foreground">10. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of significant
            changes by posting the new policy on this page and updating the effective date above.
            Your continued use of the Service after changes are posted constitutes your acceptance.
          </p>
        </section>

        {/* <section className="space-y-3">
          <h2 className="font-medium text-base text-foreground">11. Contact</h2>
          <p>
            If you have questions or concerns about this Privacy Policy, please reach out at{" "}
            <a
              href={`mailto:privacy@${new URL(app.url).hostname}`}
              className="text-primary underline-offset-4 hover:underline"
            >
              privacy@{new URL(app.url).hostname}
            </a>
            .
          </p>
        </section> */}
      </div>
    </main>
  );
}
