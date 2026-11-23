"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { toast } from "react-toastify";

const ctaClass =
  "mt-6 inline-flex items-center gap-2 rounded-full border border-purple-300 bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-purple-900 transition hover:bg-purple-50 dark:border-white/30 dark:bg-white/5 dark:text-white dark:hover:bg-white/10";

/**
 * Client-only CTA for the tutor panel on the About page.
 * Tutors go straight to their dashboard; everyone else gets a nudge to
 * create a tutor account instead of a broken dashboard link.
 */
export default function AboutTutorCta({
  userRole,
}: {
  userRole?: string | null;
}) {
  if (userRole === "tutor") {
    return (
      <Link href="/dashboard/tutor" className={ctaClass}>
        Post a tuition
        <ArrowRight className="size-3.5" />
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() =>
        toast.info(
          "You need a tutor account to post a tuition. Please sign in or register as a tutor.",
        )
      }
      className={ctaClass}
    >
      Post a tuition
      <ArrowRight className="size-3.5" />
    </button>
  );
}
