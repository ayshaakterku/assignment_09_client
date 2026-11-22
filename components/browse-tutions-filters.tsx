"use client";

import { useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Filter, Loader2, RotateCcw } from "lucide-react";

import { cn } from "@/lib/utils";

const selectClass =
  "h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-9 text-sm font-medium text-slate-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100";

export default function BrowseTutionsFilters({
  subjects,
  classLevels,
}: {
  subjects: string[];
  classLevels: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const subject = searchParams.get("subject") ?? "";
  const classLevel = searchParams.get("classLevel") ?? "";
  const hasFilters = Boolean(subject || classLevel);

  const apply = (key: "subject" | "classLevel", value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) params.set(key, value);
    else params.delete(key);

    // A new filter always starts from the first page.
    params.delete("page");

    const query = params.toString();

    startTransition(() => {
      router.push(query ? `${pathname}?${query}` : pathname);
    });
  };

  const reset = () => {
    startTransition(() => {
      router.push(pathname);
    });
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex items-center gap-2 sm:pb-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300">
            <Filter className="size-4" />
          </span>
          <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Filter
          </span>
        </div>

        <div className="grid flex-1 gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">
              Subject
            </span>
            <span className="relative block">
              <select
                value={subject}
                onChange={(event) => apply("subject", event.target.value)}
                className={selectClass}
                aria-label="Filter by subject"
              >
                <option value="">All subjects</option>
                {subjects.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <Chevron />
            </span>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">
              Class / level
            </span>
            <span className="relative block">
              <select
                value={classLevel}
                onChange={(event) => apply("classLevel", event.target.value)}
                className={selectClass}
                aria-label="Filter by class or level"
              >
                <option value="">All classes</option>
                {classLevels.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <Chevron />
            </span>
          </label>
        </div>

        <div className="flex items-center gap-2 sm:pb-0.5">
          {isPending ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
              <Loader2 className="size-3.5 animate-spin" />
              Updating
            </span>
          ) : null}

          <button
            type="button"
            onClick={reset}
            disabled={!hasFilters || isPending}
            className={cn(
              "inline-flex h-10 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800",
              hasFilters && "text-purple-700 dark:text-purple-300"
            )}
          >
            <RotateCcw className="size-3.5" />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

function Chevron() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
    >
      <path
        d="M6 8l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
