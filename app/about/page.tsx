import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  CheckCircle2,
  CreditCard,
  Handshake,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Wallet,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About | MentorLagbe",
  description:
    "MentorLagbe connects students, parents, and qualified tutors across Bangladesh for home and online tuitions.",
};

// Sample figures — replace with real counts from your API / database.
const stats = [
  { value: "12,000+", label: "Tuitions posted" },
  { value: "8,500+", label: "Registered tutors" },
  { value: "64", label: "Districts covered" },
  { value: "4.9/5", label: "Average tutor rating" },
];

const values = [
  {
    icon: ShieldCheck,
    title: "Trust first",
    description:
      "Profiles, contact details, and applications are handled with care so both sides can connect with confidence.",
  },
  {
    icon: Wallet,
    title: "Transparent pricing",
    description:
      "Clear tuition fees and simple plans. No surprise commissions and no hidden charges at checkout.",
  },
  {
    icon: MapPin,
    title: "Built for Bangladesh",
    description:
      "Home and online tuitions across all 64 districts — from Dhaka and Chattogram to Sylhet and Rangpur.",
  },
  {
    icon: CreditCard,
    title: "Secure by design",
    description:
      "Card payments run through Stripe. MentorLagbe never stores your card number or security code.",
  },
];

const studentPoints = [
  "Browse verified home and online tuitions",
  "Filter by subject, class, area, and schedule",
  "Apply in one click and track every application",
];

const tutorPoints = [
  "Post a tuition batch in a few minutes",
  "Review student applications in one dashboard",
  "Accept the best match and start teaching",
];

const HERO_IMG = "/tuition%20student%20training.png";
const STORY_IMG = "/summer%20vacation%20teache.png";

const primaryCta =
  "inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#8a1f8a] to-[#4c0d52] px-7 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white shadow-[0_10px_24px_-6px_rgba(138,31,138,0.55)] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#150a24]";

const secondaryCta =
  "inline-flex items-center gap-2 rounded-full border border-purple-300 bg-white px-7 py-3 text-xs font-bold uppercase tracking-[0.12em] text-purple-900 transition hover:bg-purple-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500 focus-visible:ring-offset-2 dark:border-white/30 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 dark:focus-visible:ring-offset-background";

function ArrowIcon() {
  return (
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
  );
}

export default function AboutPage() {
  return (
    <>
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#f3f6fd] via-[#eef2fb] to-[#e8eefb] dark:from-[#1a0f2e] dark:via-[#150a24] dark:to-[#12081f]">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -right-32 -top-40 size-[520px] rounded-full bg-[#dfe8fb] dark:bg-fuchsia-800/15" />
          <div className="absolute -left-32 bottom-4 size-80 rounded-full bg-[#e3eafa] dark:bg-purple-900/15" />
        </div>

        <svg
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 w-full text-background sm:h-32"
          viewBox="0 0 1440 160"
          preserveAspectRatio="none"
        >
          <path fill="currentColor" d="M0 160C480 150 960 90 1440 24V160H0Z" />
        </svg>

        <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 px-4 pt-12 pb-24 sm:px-6 sm:pt-16 md:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-fuchsia-200 bg-white/80 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-fuchsia-700 backdrop-blur dark:border-fuchsia-500/30 dark:bg-white/10 dark:text-pink-300">
              <Sparkles className="size-3.5" />
              About MentorLagbe
            </span>

            <h1 className="mt-4 text-3xl font-extrabold leading-[1.15] tracking-tight sm:text-4xl lg:text-[42px]">
              <span className="text-purple-800 dark:text-purple-300">
                The right tutor.
              </span>{" "}
              <span className="text-blue-600 dark:text-blue-400">
                The right batch.
              </span>
              <br />
              <span className="text-fuchsia-800 dark:text-fuchsia-400">
                One trusted platform.
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-600 sm:text-base dark:text-zinc-400">
              MentorLagbe is a Bangladeshi tutoring marketplace built to make
              finding a tutor — or filling a tuition batch — simple,
              transparent, and safe for students, parents, and tutors.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/browse-tution" className={primaryCta}>
                <BookOpenCheck className="size-4" />
                Browse tuitions
                <ArrowIcon />
              </Link>
              <Link href="/sign-up" className={secondaryCta}>
                Join free
                <ArrowIcon />
              </Link>
            </div>

            <ul className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
              <li className="flex items-center gap-1.5">
                <MapPin className="size-3.5 text-fuchsia-600 dark:text-pink-300" />
                Home &amp; online tuitions
              </li>
              <li className="flex items-center gap-1.5">
                <Users className="size-3.5 text-fuchsia-600 dark:text-pink-300" />
                Students, parents &amp; tutors
              </li>
              <li className="flex items-center gap-1.5">
                <CreditCard className="size-3.5 text-fuchsia-600 dark:text-pink-300" />
                Secure Stripe payments
              </li>
            </ul>
          </div>

          {/* visual */}
          <div className="relative mx-auto w-full max-w-sm md:max-w-md md:justify-self-end">
            <div
              aria-hidden
              className="absolute inset-6 rounded-full bg-gradient-to-br from-fuchsia-200 via-purple-200 to-blue-200 opacity-70 blur-2xl dark:from-fuchsia-800/40 dark:via-purple-800/40 dark:to-blue-900/30"
            />

            <div className="relative h-56 w-full sm:h-72">
              <Image
                src={HERO_IMG}
                alt="Student and tutor working together"
                fill
                preload
                sizes="(min-width: 768px) 40vw, 90vw"
                className="object-contain"
              />
            </div>

            <div className="absolute left-0 top-2 flex items-center gap-2 rounded-2xl border border-white/70 bg-white/95 px-3 py-2.5 shadow-lg shadow-purple-900/10 backdrop-blur dark:border-white/15 dark:bg-[#1d1130]/95">
              <span className="inline-flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300">
                <BadgeCheck className="size-5" />
              </span>
              <div>
                <p className="text-xs font-bold text-[#0f2747] dark:text-white">
                  Verified tutors
                </p>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                  Profiles &amp; details checked
                </p>
              </div>
            </div>

            <div className="absolute right-0 bottom-2 flex items-center gap-2 rounded-2xl border border-white/70 bg-white/95 px-3 py-2.5 shadow-lg shadow-purple-900/10 backdrop-blur dark:border-white/15 dark:bg-[#1d1130]/95">
              <span className="inline-flex size-9 items-center justify-center rounded-xl bg-amber-50 text-amber-500 dark:bg-amber-500/15 dark:text-amber-300">
                <Star className="size-5 fill-current" />
              </span>
              <div>
                <p className="text-xs font-bold text-[#0f2747] dark:text-white">
                  4.9 / 5
                </p>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                  Rated by students
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="relative z-10 bg-background">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <dl className="-mt-10 grid grid-cols-2 gap-3 rounded-3xl border border-zinc-200 bg-white p-5 shadow-xl shadow-purple-900/5 sm:grid-cols-4 sm:p-6 dark:border-white/10 dark:bg-[#1a1028] dark:shadow-black/30">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl px-2 py-2 text-center sm:px-3"
              >
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <p className="text-2xl font-extrabold tracking-tight text-purple-900 sm:text-3xl dark:text-white">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-zinc-500 sm:text-xs dark:text-zinc-400">
                    {stat.label}
                  </p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ================= MISSION ================= */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
          {/* image card */}
          <div className="relative order-last md:order-first">
            <div
              aria-hidden
              className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-fuchsia-200 via-purple-200 to-transparent opacity-70 blur-xl dark:from-fuchsia-900/40 dark:via-purple-900/40"
            />
            <div className="relative overflow-hidden rounded-3xl border border-white/70 bg-white p-4 shadow-xl shadow-purple-900/10 dark:border-white/10 dark:bg-white/5">
              <div className="relative h-64 w-full sm:h-80">
                <Image
                  src={STORY_IMG}
                  alt="Tutor teaching a student"
                  fill
                  sizes="(min-width: 768px) 45vw, 90vw"
                  className="object-contain"
                />
              </div>

              <div className="mt-3 flex items-start gap-3 rounded-2xl bg-gradient-to-r from-[#8a1f8a] to-[#4c0d52] p-4 text-white">
                <Handshake className="mt-0.5 size-5 shrink-0 text-pink-200" />
                <p className="text-xs leading-5 sm:text-sm">
                  <span className="font-bold">Our promise:</span> no middleman,
                  no hidden fees — just a direct, trusted connection between
                  students and tutors.
                </p>
              </div>
            </div>
          </div>

          {/* copy */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-fuchsia-700 dark:text-pink-300">
              Our mission
            </span>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#0f2747] sm:text-3xl dark:text-white">
              Tuition hunting shouldn&apos;t feel like a full-time job.
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base dark:text-slate-400">
              We started MentorLagbe after watching families call around for
              weeks and talented tutors miss out on batches simply because the
              right people never found each other. The process was slow,
              scattered, and full of guesswork.
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base dark:text-slate-400">
              Today, one platform brings both sides together. Students and
              parents discover tuitions that fit their needs, while tutors post
              their batches, review applications, and start teaching — all in
              one place.
            </p>

            <ul className="mt-6 space-y-3">
              {[
                "One place for home and online tuitions",
                "Verified tutor and student profiles",
                "Transparent fees and secure card payments",
                "Support for every district of Bangladesh",
              ].map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300"
                >
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  {point}
                </li>
              ))}
            </ul>

            <Link
              href="/browse-tution"
              className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-fuchsia-700 transition hover:text-fuchsia-800 dark:text-pink-300 dark:hover:text-pink-200"
            >
              Explore tuitions
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= VALUES ================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-purple-50/50 py-16 sm:py-20 dark:to-purple-950/20">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -right-24 top-10 size-72 rounded-full bg-fuchsia-100/70 blur-3xl dark:bg-fuchsia-900/10" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-fuchsia-700 dark:text-pink-300">
              What we stand for
            </span>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#0f2747] sm:text-3xl dark:text-white">
              Built on trust, transparency, and local roots
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base dark:text-slate-400">
              Every decision we make comes back to one question: does this make
              the tuition connection safer and simpler for both sides?
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <article
                  key={value.title}
                  className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-fuchsia-200 hover:shadow-xl hover:shadow-fuchsia-900/5 dark:border-white/10 dark:bg-white/5 dark:hover:border-pink-300/30"
                >
                  <span className="inline-flex size-11 items-center justify-center rounded-xl bg-fuchsia-50 text-fuchsia-700 transition group-hover:bg-fuchsia-100 dark:bg-fuchsia-500/15 dark:text-pink-300 dark:group-hover:bg-fuchsia-500/25">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-4 text-base font-extrabold text-[#0f2747] dark:text-white">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {value.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= WHO IT'S FOR ================= */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-fuchsia-700 dark:text-pink-300">
              Made for both sides
            </span>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#0f2747] sm:text-3xl dark:text-white">
              One platform, two journeys
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {/* students */}
            <article className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-7 shadow-sm sm:p-8 dark:border-white/10 dark:bg-white/5">
              <div
                aria-hidden
                className="absolute -right-10 -top-10 size-40 rounded-full bg-blue-100/70 blur-2xl dark:bg-blue-900/20"
              />
              <div className="relative">
                <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300">
                  <BookOpenCheck className="size-6" />
                </span>
                <h3 className="mt-4 text-xl font-extrabold text-[#0f2747] dark:text-white">
                  For students &amp; parents
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Find a qualified tutor for your class, subject, and area —
                  then apply and track everything from your dashboard.
                </p>

                <ul className="mt-5 space-y-3">
                  {studentPoints.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300"
                    >
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      {point}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/browse-tution"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#8a1f8a] to-[#4c0d52] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-white shadow-sm transition hover:brightness-110"
                >
                  Find a tutor
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </article>

            {/* tutors */}
            <article className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-7 shadow-sm sm:p-8 dark:border-white/10 dark:bg-white/5">
              <div
                aria-hidden
                className="absolute -right-10 -top-10 size-40 rounded-full bg-fuchsia-100/70 blur-2xl dark:bg-fuchsia-900/20"
              />
              <div className="relative">
                <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-fuchsia-50 text-fuchsia-700 dark:bg-fuchsia-500/15 dark:text-pink-300">
                  <Users className="size-6" />
                </span>
                <h3 className="mt-4 text-xl font-extrabold text-[#0f2747] dark:text-white">
                  For tutors
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Post your tuition batches, reach serious students, and manage
                  applications without chasing leads.
                </p>

                <ul className="mt-5 space-y-3">
                  {tutorPoints.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300"
                    >
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      {point}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/dashboard/tutor"
                  className="mt-6 inline-flex items-center gap-2 rounded-full border border-purple-300 bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-purple-900 transition hover:bg-purple-50 dark:border-white/30 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                >
                  Post a tuition
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="bg-background pb-16 sm:pb-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#6d1670] via-[#8a1f8a] to-[#3d0a45] px-6 py-12 text-center text-white shadow-2xl shadow-purple-900/25 sm:px-12">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
            >
              <div className="absolute -right-16 -top-16 size-56 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute -bottom-20 -left-10 size-56 rounded-full bg-pink-400/20 blur-2xl" />
            </div>

            <div className="relative">
              <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                Ready to make the right connection?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/85 sm:text-base">
                Join thousands of students and tutors already using
                MentorLagbe. Creating an account is free — you only pay when
                you&apos;re ready to upgrade.
              </p>

              <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/sign-up"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-7 py-3 text-xs font-bold uppercase tracking-[0.12em] text-purple-950 shadow-lg transition hover:bg-pink-50 sm:w-auto"
                >
                  Create free account
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/payment"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/40 px-7 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:bg-white/10 sm:w-auto"
                >
                  See pricing
                </Link>
              </div>

              <p className="mt-5 flex items-center justify-center gap-1.5 text-[11px] font-medium text-white/70">
                <ShieldCheck className="size-3.5" />
                Secure card payments powered by Stripe
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
