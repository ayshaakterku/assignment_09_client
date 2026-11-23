import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | MentorLagbe",
  description: "The terms that apply when you use the MentorLagbe platform.",
};

export default function TermsOfServicePage() {
  return (
    <main className="bg-gray-50 px-4 py-16 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <article className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white p-8 shadow-sm sm:p-10 dark:border-gray-800 dark:bg-gray-900">
        <p className="text-sm font-semibold tracking-wide text-fuchsia-600 uppercase dark:text-pink-300">
          Legal
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Terms of Service
        </h1>
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          Last updated: {new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        <div className="mt-8 space-y-8 text-sm leading-7 text-gray-600 dark:text-gray-300">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Using MentorLagbe
            </h2>
            <p className="mt-2">
              By using MentorLagbe, you agree to provide accurate information
              and to use the platform only for finding or offering legitimate
              tutoring services. Accounts that post false or misleading
              information may be suspended.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Accounts and content
            </h2>
            <p className="mt-2">
              You are responsible for activity on your account and for the
              content you publish. Do not post abusive, discriminatory, or
              unlawful material. We may remove content that violates these
              terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Payments and plans
            </h2>
            <p className="mt-2">
              Paid plans are billed through Stripe using a debit or credit card.
              Prices are shown before checkout. Unless required by law, payments
              are non-refundable once a plan has been activated.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Limitation of liability
            </h2>
            <p className="mt-2">
              MentorLagbe is a connection platform. We do not guarantee the
              quality, safety, or outcome of any tutoring arrangement. Users
              should verify details and take reasonable precautions before
              sharing personal information or making payments outside the
              platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Questions
            </h2>
            <p className="mt-2">
              For questions about these terms, contact{" "}
              <a
                href="mailto:support@mentorlagbe.com"
                className="font-medium text-fuchsia-600 hover:underline dark:text-pink-300"
              >
                support@mentorlagbe.com
              </a>
              .
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
