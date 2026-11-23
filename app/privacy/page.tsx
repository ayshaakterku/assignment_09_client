import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | MentorLagbe",
  description:
    "How MentorLagbe collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-gray-50 px-4 py-16 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <article className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white p-8 shadow-sm sm:p-10 dark:border-gray-800 dark:bg-gray-900">
        <p className="text-sm font-semibold tracking-wide text-fuchsia-600 uppercase dark:text-pink-300">
          Legal
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Privacy Policy
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
              Information we collect
            </h2>
            <p className="mt-2">
              When you create an account, post a tuition, or apply as a tutor,
              we collect the details you provide such as your name, email
              address, phone number, institution, subjects, and profile
              information.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              How we use your information
            </h2>
            <p className="mt-2">
              We use your information to connect students, parents, and tutors,
              manage applications, improve the platform, and send important
              service updates. We do not sell your personal data.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Payments
            </h2>
            <p className="mt-2">
              Card payments are processed by Stripe. MentorLagbe does not store
              your card number or security code. Stripe handles payment data
              according to its own privacy and security policies.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Your choices
            </h2>
            <p className="mt-2">
              You can update or delete your profile information from your
              dashboard at any time. To request account deletion or ask a
              privacy question, email{" "}
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
