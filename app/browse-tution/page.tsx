import Link from "next/link";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  SearchX,
  SlidersHorizontal,
} from "lucide-react";

import { getBrowseTutions } from "@/components/api-access/tutions";
import BrowseTutionsFilters from "@/components/browse-tutions-filters";
import TuitionCard from "@/components/TutionCard";
import type { TuitionApplication } from "@/components/type/tution";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 6;

type SearchParams = {
  subject?: string;
  classLevel?: string;
  page?: string;
};

type Props = {
  searchParams: Promise<SearchParams>;
};

const BrowseTutionPage = async ({ searchParams }: Props) => {
  const params = await searchParams;

  const subject = params.subject?.trim() ?? "";
  const classLevel = params.classLevel?.trim() ?? "";
  const requestedPage = Number.parseInt(params.page ?? "1", 10);
  const page =
    Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  let tutions: TuitionApplication[] = [];
  let total = 0;
  let totalPages = 0;
  let subjects: string[] = [];
  let classLevels: string[] = [];
  let loadError: string | null = null;

  try {
    const result = await getBrowseTutions({
      page,
      limit: PAGE_SIZE,
      subject,
      classLevel,
    });

    tutions = result.data;
    total = result.total;
    totalPages = result.totalPages;
    subjects = result.subjects;
    classLevels = result.classLevels;
  } catch (error) {
    loadError =
      error instanceof Error
        ? error.message
        : "Could not load tuitions right now.";
  }

  const hasFilters = Boolean(subject || classLevel);
  const activePage = totalPages ? Math.min(page, totalPages) : 1;

  const buildHref = (targetPage: number) => {
    const query = new URLSearchParams();
    if (subject) query.set("subject", subject);
    if (classLevel) query.set("classLevel", classLevel);
    if (targetPage > 1) query.set("page", String(targetPage));

    const search = query.toString();
    return search ? `/browse-tution?${search}` : "/browse-tution";
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-purple-700 dark:bg-purple-500/15 dark:text-purple-300">
            <BookOpen className="size-3.5" />
            Find your tutor
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
            Browse Tuitions
          </h1>
          <p className="mt-2 max-w-xl text-sm text-slate-500 dark:text-slate-400">
            Approved and active tuitions from verified tutors. Filter by subject
            and class to find the right match.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
            {total} tuition{total === 1 ? "" : "s"}
          </span>
          {hasFilters ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-fuchsia-50 px-3 py-1.5 text-xs font-bold text-fuchsia-700 dark:bg-fuchsia-500/15 dark:text-fuchsia-300">
              <SlidersHorizontal className="size-3.5" />
              Filtered
            </span>
          ) : null}
        </div>
      </div>

      <div className="mt-6">
        <BrowseTutionsFilters
          subjects={subjects}
          classLevels={classLevels}
        />
      </div>

      {loadError ? (
        <div className="mt-10 rounded-xl border border-red-200 bg-red-50 p-10 text-center dark:border-red-500/30 dark:bg-red-500/10">
          <p className="text-sm font-bold text-red-700 dark:text-red-300">
            Could not load tuitions
          </p>
          <p className="mt-1 text-xs text-red-600/80 dark:text-red-300/80">
            {loadError}
          </p>
        </div>
      ) : tutions.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-900">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
            <SearchX className="size-5" />
          </span>
          <p className="mt-4 text-sm font-bold text-slate-900 dark:text-slate-100">
            No tuitions match your filters
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Try a different subject or class level.
          </p>
          {hasFilters ? (
            <Link
              href="/browse-tution"
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-purple-700 px-4 py-2 text-xs font-bold text-white transition hover:bg-purple-600"
            >
              Clear filters
            </Link>
          ) : null}
        </div>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {tutions.map((tution) => (
              <TuitionCard key={tution._id} tuition={tution} />
            ))}
          </div>

          {totalPages > 1 ? (
            <nav
              aria-label="Pagination"
              className="mt-10 flex items-center justify-center gap-1.5"
            >
              <Link
                href={buildHref(activePage - 1)}
                aria-disabled={activePage <= 1}
                className={
                  activePage <= 1
                    ? "pointer-events-none inline-flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-400 opacity-60 dark:border-slate-700"
                    : "inline-flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-purple-300 hover:text-purple-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-purple-500/50 dark:hover:text-purple-300"
                }
              >
                <ChevronLeft className="size-4" />
              </Link>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (pageNumber) => (
                  <Link
                    key={pageNumber}
                    href={buildHref(pageNumber)}
                    aria-current={
                      pageNumber === activePage ? "page" : undefined
                    }
                    className={
                      pageNumber === activePage
                        ? "inline-flex size-9 items-center justify-center rounded-lg bg-purple-700 text-sm font-bold text-white"
                        : "inline-flex size-9 items-center justify-center rounded-lg border border-slate-200 text-sm font-semibold text-slate-600 transition hover:border-purple-300 hover:text-purple-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-purple-500/50 dark:hover:text-purple-300"
                    }
                  >
                    {pageNumber}
                  </Link>
                )
              )}

              <Link
                href={buildHref(activePage + 1)}
                aria-disabled={activePage >= totalPages}
                className={
                  activePage >= totalPages
                    ? "pointer-events-none inline-flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-400 opacity-60 dark:border-slate-700"
                    : "inline-flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-purple-300 hover:text-purple-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-purple-500/50 dark:hover:text-purple-300"
                }
              >
                <ChevronRight className="size-4" />
              </Link>
            </nav>
          ) : null}
        </>
      )}
    </main>
  );
};

export default BrowseTutionPage;
