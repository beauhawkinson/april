import { createFileRoute } from "@tanstack/react-router";

import { app } from "@/lib/config/app.config";

export const Route = createFileRoute("/(legal)/terms")({
  component: TermsPage,
  head: () => ({
    meta: [{ title: "Terms of Service" }],
  }),
});

function TermsPage() {
  const effectiveDate = "May 4, 2025";

  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <div className="mb-10">
        <h1 className="font-semibold text-3xl text-primary">Terms of Service</h1>
        <p className="mt-2 text-muted-foreground text-sm">Effective date: {effectiveDate}</p>
      </div>

      <div className="space-y-8 text-foreground/90 text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-medium text-base text-foreground">1. Acceptance of Terms</h2>
          <p>
            By accessing or using {app.name} ("the Service"), you agree to be bound by these Terms
            of Service. If you do not agree to these terms, please do not use the Service.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-medium text-base text-foreground">2. Use of the Service</h2>
          <p>
            You may use the Service only for lawful purposes and in accordance with these Terms. You
            agree not to use the Service:
          </p>
          <ul className="ml-4 list-inside list-disc space-y-1 text-muted-foreground">
            <li>In any way that violates applicable laws or regulations.</li>
            <li>To transmit unsolicited or unauthorized advertising or promotional material.</li>
            <li>
              To impersonate any person or entity or misrepresent your affiliation with anyone.
            </li>
            <li>
              To engage in any conduct that restricts or inhibits anyone's use or enjoyment of the
              Service.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-medium text-base text-foreground">3. Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials and
            for all activity that occurs under your account. You must notify us immediately of any
            unauthorized use of your account. We reserve the right to terminate accounts at our sole
            discretion.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-medium text-base text-foreground">4. Intellectual Property</h2>
          <p>
            The Service and its original content, features, and functionality are owned by{" "}
            {app.name} and are protected by applicable intellectual property laws. You may not copy,
            modify, distribute, or create derivative works without our prior written consent.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-medium text-base text-foreground">5. User Content</h2>
          <p>
            You retain ownership of any content you submit through the Service. By submitting
            content, you grant us a non-exclusive, worldwide, royalty-free license to use, store,
            and display that content solely for the purpose of providing the Service to you.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-medium text-base text-foreground">6. Payments and Billing</h2>
          <p>
            Certain features of the Service may require payment. All fees are stated in US dollars
            and are non-refundable unless otherwise specified. We reserve the right to change our
            pricing at any time with reasonable notice.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-medium text-base text-foreground">7. Disclaimers</h2>
          <p>
            The Service is provided "as is" and "as available" without warranties of any kind,
            either express or implied. We do not warrant that the Service will be uninterrupted,
            error-free, or free of harmful components.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-medium text-base text-foreground">8. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, {app.name} shall not be liable for any indirect,
            incidental, special, consequential, or punitive damages arising from your use of the
            Service.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-medium text-base text-foreground">9. Changes to Terms</h2>
          <p>
            We may update these Terms at any time. Continued use of the Service after changes are
            posted constitutes your acceptance of the revised Terms. We will make reasonable efforts
            to notify you of material changes.
          </p>
        </section>

        {/* <section className="space-y-3">
          <h2 className="font-medium text-base text-foreground">10. Contact</h2>
          <p>
            For billing and subscription management, please use the customer portal linked in your
            account settings. For all other inquiries, please message us at{" "}
            <a
              href={`mailto:${app.supportEmail}`}
              className="text-primary underline-offset-2 hover:underline"
            >
              {app.supportEmail}
            </a>
            .
          </p>
        </section> */}
      </div>
    </main>
  );
}
