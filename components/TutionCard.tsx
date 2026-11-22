import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  House,
  Laptop,
  MapPin,
  UserRound,
} from "lucide-react";

import { TuitionApplication } from "@/components/type/tution";

/* ---------- helpers ---------- */
function formatDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "Asia/Dhaka",
  });
}

// `mode` comes from TuitionMode ("Online" | "Offline"):
// Offline is shown as Home Tutoring.
function isOnline(mode: string) {
  return String(mode).toLowerCase() === "online";
}

function modeLabel(mode: string) {
  return isOnline(mode) ? "Online" : "Home";
}

/* ---------- card ---------- */
export default function TuitionCard({
  tuition,
}: {
  tuition: TuitionApplication;
}) {
  const jobId = tuition.tutionId ?? tuition._id.slice(-5);
  const online = isOnline(tuition.mode);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900">
      {/* banner */}
      <div className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-purple-700 via-purple-600 to-fuchsia-600">
        {tuition.bannerImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={tuition.bannerImage}
            alt={tuition.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <BookOpen className="size-10 text-white/70" />
          </div>
        )}

        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-purple-700 shadow-sm backdrop-blur">
          {online ? (
            <Laptop className="size-3.5" />
          ) : (
            <House className="size-3.5" />
          )}
          {modeLabel(tuition.mode)}
        </span>

        <span className="absolute right-3 top-3 rounded-full bg-slate-900/85 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm backdrop-blur">
          {tuition.monthlyFee.toLocaleString("en-US")} Tk/mo
        </span>
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
            {tuition.subject}
          </span>
          <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-purple-700 dark:bg-purple-500/15 dark:text-purple-300">
            {tuition.classLevel || "Any class"}
          </span>
        </div>

        <h3 className="mt-2 line-clamp-2 text-base font-extrabold leading-snug text-slate-900 dark:text-slate-50">
          {tuition.title}
        </h3>

        <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs text-slate-600 dark:text-slate-300">
          <span className="flex items-center gap-1.5 truncate">
            <UserRound className="size-3.5 shrink-0 text-slate-400" />
            <span className="truncate">{tuition.tutorName || "Tutor"}</span>
          </span>
          <span className="flex items-center gap-1.5 whitespace-nowrap">
            <CalendarDays className="size-3.5 shrink-0 text-slate-400" />
            {tuition.daysPerWeek || 0} days/week
          </span>
          <span className="col-span-2 flex items-center gap-1.5 truncate">
            <MapPin className="size-3.5 shrink-0 text-slate-400" />
            <span className="truncate">
              {online ? "Online classes" : tuition.location || "Location shared on request"}
            </span>
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            #{jobId} · {formatDate(tuition.createdAt)}
          </p>
          <Link
            href={`/browse-tution/${tuition._id}`}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-gradient-to-r from-fuchsia-700 to-purple-800 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:brightness-110"
          >
            View Details
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
