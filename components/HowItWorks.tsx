import Link from "next/link";
import {
  FilePlus2,
  GraduationCap,
  Send,
  Sparkles,
  UserPlus,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Create your free account",
    description:
      "Sign up in under a minute as a student or a tutor. Add your class, subjects, and area so we can match you faster.",
    roles: ["Student", "Tutor"],
  },
  {
    number: "02",
    icon: FilePlus2,
    title: "Post or find a tuition",
    description:
      "Tutors post their tuition batches with schedule and fee. Students browse and filter by subject, class, area, and online or home.",
    roles: ["Tutor posts", "Student browses"],
  },
  {
    number: "03",
    icon: Send,
    title: "Apply or choose a match",
    description:
      "Students send applications to the tuitions they like. Tutors review every applicant and accept the best fit for their batch.",
    roles: ["Student applies", "Tutor reviews"],
  },
  {
    number: "04",
    icon: GraduationCap,
    title: "Start learning",
    description:
      "Confirm the schedule, pay securely by card through Stripe, and begin classes online or at home — without any middleman hassle.",
    roles: ["Both roles"],
  },
];

const primaryCta =
  "inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#8a1f8a] to-[#4c0d52] px-7 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white shadow-[0_10px_24px_-6px_rgba(138,31,138,0.55)] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-background";

const secondaryCta =
  "inline-flex items-center gap-2 rounded-full border border-purple-300 bg-white px-7 py-3 text-xs font-bold uppercase tracking-[0.12em] text-purple-900 transition hover:bg-purple-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500 focus-visible:ring-offset-2 dark:border-white/30 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 dark:focus-visible:ring-offset-background";

export default function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-background py-16 sm:py-20">
      {/* soft decorative glows */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-10 size-72 rounded-full bg-fuchsia-100/70 blur-3xl dark:bg-fuchsia-900/10" />
        <div className="absolute -right-24 bottom-0 size-72 rounded-full bg-purple-100/70 blur-3xl dark:bg-purple-900/10" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-fuchsia-200 bg-fuchsia-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-fuchsia-700 dark:border-fuchsia-500/30 dark:bg-fuchsia-500/10 dark:text-pink-300">
            <Sparkles className="size-3.5" />
            How it works
          </span>

          <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-[#0f2747] sm:text-3xl dark:text-white">
            How Mentor<span className="text-fuchsia-700 dark:text-pink-300">Lagbe</span>{" "}
            Works
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base dark:text-slate-400">
            One platform, two journeys. Students find the right tutor, and
            tutors fill their batches faster — in four simple steps.
          </p>
        </div>

        <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === steps.length - 1;

            return (
              <li key={step.number} className="h-full">
                <article className="group relative flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-fuchsia-200 hover:shadow-xl hover:shadow-fuchsia-900/5 dark:border-white/10 dark:bg-white/5 dark:hover:border-pink-300/30">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8a1f8a] to-[#4c0d52] text-sm font-extrabold text-white shadow-[0_8px_20px_-6px_rgba(138,31,138,0.6)]">
                      {step.number}
                    </span>

                    {!isLast && (
                      <span
                        aria-hidden
                        className="hidden h-px flex-1 border-t border-dashed border-zinc-300 lg:block dark:border-white/20"
                      />
                    )}

                    <span className="ml-auto inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-fuchsia-50 text-fuchsia-700 transition group-hover:bg-fuchsia-100 dark:bg-fuchsia-500/15 dark:text-pink-300 dark:group-hover:bg-fuchsia-500/25">
                      <Icon className="size-5" />
                    </span>
                  </div>

                  <h3 className="mt-5 text-base font-extrabold leading-snug text-[#0f2747] dark:text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {step.description}
                  </p>

                  <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
                    {step.roles.map((role) => (
                      <span
                        key={role}
                        className="rounded-full bg-purple-50 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-purple-700 dark:bg-purple-500/15 dark:text-purple-200"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </article>
              </li>
            );
          })}
        </ol>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/browse-tution" className={primaryCta}>
            Find a tutor
            <svg
              className="size-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6l6 6-6 6" />
            </svg>
          </Link>
          <Link href="/dashboard/tutor" className={secondaryCta}>
            Post a tuition
            <svg
              className="size-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6l6 6-6 6" />
            </svg>
          </Link>
        </div>

        <p className="mt-5 text-center text-xs text-slate-400 dark:text-slate-500">
          Free to join · No hidden charges · Secure card payments via Stripe
        </p>
      </div>
    </section>
  );
}
