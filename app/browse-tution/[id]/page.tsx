import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Banknote,
  BookOpen,
  CalendarDays,
  GraduationCap,
  House,
  Laptop,
  Mail,
  MapPin,
  UserRound,
} from "lucide-react";

import { getTutionById } from "@/components/api-access/tutions";

// Next.js 16: params is a Promise
type Props = { params: Promise<{ id: string }> };

const formatDate = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Dhaka",
  });
};

const isOnline = (mode: string) => String(mode).toLowerCase() === "online";

function Info({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        <span className="text-purple-600 dark:text-purple-300">{icon}</span>
        {label}
      </p>
      <div className="mt-1.5 text-sm font-bold text-slate-900 dark:text-slate-100">
        {children}
      </div>
    </div>
  );
}

const TutionDetailPage = async ({ params }: Props) => {
  const { id } = await params;

  const tuition = await getTutionById(id);

  if (!tuition) notFound();

  const online = isOnline(tuition.mode);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/browse-tution"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-700 hover:underline dark:text-purple-300"
      >
        <ArrowLeft className="size-4" />
        Back to Browse Tuitions
      </Link>

      <article className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-md dark:border-slate-700 dark:bg-slate-900">
        {/* banner */}
        <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-purple-700 via-purple-600 to-fuchsia-600 sm:h-72">
          {tuition.bannerImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={tuition.bannerImage}
              alt={tuition.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <BookOpen className="size-14 text-white/70" />
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center gap-2 bg-gradient-to-t from-black/60 to-transparent p-4 sm:p-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-purple-700 shadow-sm">
              {online ? (
                <Laptop className="size-3.5" />
              ) : (
                <House className="size-3.5" />
              )}
              {online ? "Online Tutoring" : "Home Tutoring"}
            </span>
            <span className="rounded-full bg-slate-900/85 px-3 py-1.5 text-xs font-bold text-white">
              #{tuition.tutionId ?? tuition._id.slice(-5)}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/95 px-3 py-1.5 text-xs font-bold text-white">
              {tuition.isActive ? "Active" : "Closed"}
            </span>
          </div>
        </div>

        <div className="p-5 sm:p-7">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
              {tuition.subject}
            </span>
            <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-purple-700 dark:bg-purple-500/15 dark:text-purple-300">
              {tuition.classLevel || "Any class"}
            </span>
          </div>

          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">
            {tuition.title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4 text-slate-400" />
              {online ? "Online classes" : tuition.location || "—"}
            </span>
            <span className="flex items-center gap-1.5">
              <UserRound className="size-4 text-slate-400" />
              {tuition.tutorName || "Tutor"}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-4 text-slate-400" />
              Posted {formatDate(tuition.createdAt)}
            </span>
          </div>

          {/* details */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Info icon={<Banknote className="size-4" />} label="Monthly Fee">
              <span className="text-xl font-extrabold text-purple-700 dark:text-purple-300">
                {tuition.monthlyFee.toLocaleString("en-US")} Tk
              </span>
              <span className="text-xs font-normal text-slate-500">/Month</span>
            </Info>
            <Info icon={<CalendarDays className="size-4" />} label="Tutoring Days">
              {tuition.daysPerWeek || 0} Days/Week
            </Info>
            <Info icon={<GraduationCap className="size-4" />} label="Subject">
              {tuition.subject}
            </Info>
            <Info icon={<BookOpen className="size-4" />} label="Class / Level">
              {tuition.classLevel || "Any class"}
            </Info>
            <Info icon={<MapPin className="size-4" />} label="Mode & Location">
              {online ? "Online" : tuition.location || "Offline"}
            </Info>
            <Info icon={<UserRound className="size-4" />} label="Tutor">
              {tuition.tutorName || "—"}
            </Info>
          </div>

          {/* description */}
          <section className="mt-8">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
              Description
            </h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-600 dark:text-slate-300">
              {tuition.description || "No description provided for this tuition."}
            </p>
          </section>

          {/* contact */}
          <section className="mt-8 flex flex-col gap-3 rounded-xl border border-purple-100 bg-purple-50/60 p-5 dark:border-purple-500/25 dark:bg-purple-500/10 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Interested in this tuition?
              </p>
              <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">
                Contact {tuition.tutorName || "the tutor"} to discuss schedule and
                enrollment.
              </p>
            </div>
            <a
              href={`mailto:${tuition.tutorEmail}`}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-fuchsia-700 to-purple-800 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:brightness-110"
            >
              <Mail className="size-4" />
              Contact Tutor
            </a>
          </section>
        </div>
      </article>
    </main>
  );
};

export default TutionDetailPage;
