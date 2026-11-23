import Link from "next/link"
import {
  ArrowRight,
  Atom,
  BadgeCheck,
  BookOpen,
  Code2,
  GraduationCap,
  Languages,
  Quote,
  Sigma,
  Sparkles,
  Star,
  TrendingUp,
  Users,
} from "lucide-react"

const numberFormat = new Intl.NumberFormat("en-US")

// Sample figures — replace with real counts from your API / database.
const subjectCards = [
  {
    key: "Math",
    label: "Math",
    count: 3200,
    icon: Sigma,
    blurb: "Algebra, geometry, and higher math for school and admission prep.",
    iconClass:
      "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300",
    barClass: "from-blue-500 to-indigo-500",
  },
  {
    key: "Physics",
    label: "Physics",
    count: 2100,
    icon: Atom,
    blurb: "Mechanics, electricity, and exam-focused problem solving.",
    iconClass:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300",
    barClass: "from-emerald-500 to-teal-500",
  },
  {
    key: "Programming",
    label: "Programming",
    count: 1450,
    icon: Code2,
    blurb: "C, Python, web development, and ICT fundamentals.",
    iconClass:
      "bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300",
    barClass: "from-amber-500 to-orange-500",
  },
  {
    key: "IELTS",
    label: "IELTS",
    count: 980,
    icon: Languages,
    blurb: "Listening, reading, writing, and speaking practice with mentors.",
    iconClass:
      "bg-fuchsia-50 text-fuchsia-700 dark:bg-fuchsia-500/15 dark:text-pink-300",
    barClass: "from-fuchsia-500 to-pink-500",
  },
]

const testimonials = [
  {
    name: "Nusrat Jahan",
    role: "HSC student · Dhaka",
    quote:
      "I found a physics tutor near my home in two days. Comparing schedules and fees on one page made the choice so much easier.",
    avatarClass: "from-blue-500 to-indigo-600",
  },
  {
    name: "Tanvir Ahmed",
    role: "Physics tutor · Chattogram",
    quote:
      "Posting my batch took five minutes and I filled all six seats within a week. Reviewing applications from the dashboard is effortless.",
    avatarClass: "from-emerald-500 to-teal-600",
  },
  {
    name: "Farhana Akter",
    role: "Parent · Sylhet",
    quote:
      "I could see verified profiles, monthly fees, and class details before applying. That transparency is exactly what parents need.",
    avatarClass: "from-fuchsia-500 to-purple-600",
  },
]

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
}

export default function TopSubjects() {
  const maxSubjectCount = Math.max(
    ...subjectCards.map((subject) => subject.count),
    1
  )

  const counters = [
    {
      icon: BadgeCheck,
      value: numberFormat.format(8500),
      label: "Verified tutors",
      iconClass:
        "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300",
    },
    {
      icon: Users,
      value: numberFormat.format(15000),
      label: "Active students",
      iconClass:
        "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300",
    },
    {
      icon: BookOpen,
      value: numberFormat.format(12000),
      label: "Tuitions posted",
      iconClass:
        "bg-fuchsia-50 text-fuchsia-700 dark:bg-fuchsia-500/15 dark:text-pink-300",
    },
    {
      icon: Star,
      value: "4.9/5",
      label: "Average rating",
      iconClass:
        "bg-amber-50 text-amber-500 dark:bg-amber-500/15 dark:text-amber-300",
    },
  ]

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-purple-50/50 to-background py-16 sm:py-20 dark:via-purple-950/10">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute top-16 -left-24 size-72 rounded-full bg-fuchsia-100/70 blur-3xl dark:bg-fuchsia-900/10" />
        <div className="absolute -right-24 bottom-10 size-72 rounded-full bg-blue-100/60 blur-3xl dark:bg-blue-900/10" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-fuchsia-200 bg-fuchsia-50 px-3 py-1 text-[11px] font-bold tracking-[0.14em] text-fuchsia-700 uppercase dark:border-fuchsia-500/30 dark:bg-fuchsia-500/10 dark:text-pink-300">
            <TrendingUp className="size-3.5" />
            Top subjects &amp; community
          </span>

          <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-[#0f2747] sm:text-3xl dark:text-white">
            Popular subjects, trusted{" "}
            <span className="text-fuchsia-700 dark:text-pink-300">people</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base dark:text-slate-400">
            Thousands of students and verified tutors meet here every month.
            Explore the busiest subjects or read what our community says.
          </p>
        </div>

        {/* platform counters */}
        <dl className="mt-10 grid grid-cols-2 gap-4 rounded-3xl border border-zinc-200 bg-white p-5 shadow-lg shadow-purple-900/5 sm:grid-cols-4 sm:p-6 dark:border-white/10 dark:bg-white/5 dark:shadow-black/20">
          {counters.map((counter) => {
            const Icon = counter.icon
            return (
              <div
                key={counter.label}
                className="flex flex-col items-center rounded-2xl px-2 py-2 text-center"
              >
                <span
                  className={`inline-flex size-10 items-center justify-center rounded-xl ${counter.iconClass}`}
                >
                  <Icon className="size-5" />
                </span>
                <dt className="order-3 mt-1 text-[11px] font-semibold tracking-wide text-zinc-500 uppercase sm:text-xs dark:text-zinc-400">
                  {counter.label}
                </dt>
                <dd className="order-2 mt-3 text-2xl font-extrabold tracking-tight text-purple-900 sm:text-[27px] dark:text-white">
                  {counter.value}
                </dd>
              </div>
            )
          })}
        </dl>

        {/* subject categories */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {subjectCards.map((subject) => {
            const Icon = subject.icon
            const width = Math.max(
              Math.round((subject.count / maxSubjectCount) * 100),
              8
            )

            return (
              <Link
                key={subject.key}
                href={`/browse-tution?subject=${encodeURIComponent(subject.label)}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-fuchsia-200 hover:shadow-xl hover:shadow-fuchsia-900/5 dark:border-white/10 dark:bg-white/5 dark:hover:border-pink-300/30"
              >
                <span
                  aria-hidden
                  className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${subject.barClass}`}
                />

                <div className="flex items-center justify-between gap-3">
                  <span
                    className={`inline-flex size-11 items-center justify-center rounded-xl ${subject.iconClass}`}
                  >
                    <Icon className="size-5" />
                  </span>
                  <ArrowRight className="size-4 text-zinc-300 transition group-hover:translate-x-0.5 group-hover:text-fuchsia-600 dark:text-zinc-600 dark:group-hover:text-pink-300" />
                </div>

                <h3 className="mt-4 text-base font-extrabold text-[#0f2747] dark:text-white">
                  {subject.label}
                </h3>
                <p className="mt-1.5 text-xs leading-5 text-slate-500 dark:text-slate-400">
                  {subject.blurb}
                </p>

                <div className="mt-auto pt-5">
                  <div
                    aria-hidden
                    className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-white/10"
                  >
                    <span
                      className={`block h-full rounded-full bg-gradient-to-r ${subject.barClass}`}
                      style={{ width: `${width}%` }}
                    />
                  </div>
                  <p className="mt-2.5 text-[11px] font-bold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
                    {numberFormat.format(subject.count)} tuitions available
                  </p>
                </div>
              </Link>
            )
          })}
        </div>

        {/* testimonials */}
        <div className="mt-14">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.14em] text-fuchsia-700 uppercase dark:text-pink-300">
                <Sparkles className="size-3.5" />
                Community feedback
              </span>
              <h3 className="mt-2 text-xl font-extrabold tracking-tight text-[#0f2747] sm:text-2xl dark:text-white">
                Loved by students, parents &amp; tutors
              </h3>
            </div>

            <Link
              href="/browse-tution"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-fuchsia-700 transition hover:text-fuchsia-800 dark:text-pink-300 dark:hover:text-pink-200"
            >
              Browse tuitions
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <figure
                key={testimonial.name}
                className="flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-fuchsia-200 hover:shadow-xl hover:shadow-fuchsia-900/5 dark:border-white/10 dark:bg-white/5 dark:hover:border-pink-300/30"
              >
                <div className="flex items-center justify-between">
                  <Quote className="size-6 text-fuchsia-200 dark:text-fuchsia-500/40" />
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        className="size-3.5 fill-current"
                        aria-hidden
                      />
                    ))}
                    <span className="sr-only">Rated 5 out of 5</span>
                  </div>
                </div>

                <blockquote className="mt-3 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>

                <figcaption className="mt-5 flex items-center gap-3 border-t border-zinc-100 pt-4 dark:border-white/10">
                  <span
                    aria-hidden
                    className={`inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${testimonial.avatarClass} text-xs font-extrabold text-white`}
                  >
                    {initialsOf(testimonial.name)}
                  </span>
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 text-sm font-bold text-[#0f2747] dark:text-white">
                      {testimonial.name}
                      <BadgeCheck
                        className="size-4 shrink-0 text-emerald-500"
                        role="img"
                        aria-label="Verified member"
                      />
                    </p>
                    <p className="truncate text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                      {testimonial.role}
                    </p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        <p className="mt-8 flex items-center justify-center gap-1.5 text-center text-xs text-zinc-400 dark:text-zinc-500">
          <GraduationCap className="size-3.5" />
          Figures refresh regularly from platform activity
        </p>
      </div>
    </section>
  )
}
