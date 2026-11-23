import type { Metadata } from "next";
import type { ComponentType, ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Check,
  CreditCard,
  Hash,
  LayoutGrid,
  Mail,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  XCircle,
} from "lucide-react";
import type Stripe from "stripe";

import { checkoutVerify } from "@/components/api-update/payment";
import { stripe } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Checkout confirmation · MentorLagbe",
  description:
    "Your MentorLagbe Pro upgrade status and payment receipt.",
};

export const dynamic = "force-dynamic";

const primaryButtonClass =
  "inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#8a1f8a] to-[#4c0d52] px-5 py-3 text-sm font-bold text-white shadow-[0_10px_24px_-8px_rgba(138,31,138,0.55)] transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-600";

const secondaryButtonClass =
  "inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-muted";

function formatAmount(amount: number | null, currency: string | null) {
  if (typeof amount !== "number") return "—";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: (currency || "usd").toUpperCase(),
  }).format(amount / 100);
}

function formatDate(unixSeconds?: number | null) {
  if (!unixSeconds) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(unixSeconds * 1000));
}

function dashboardHref(role?: string | null) {
  if (role === "tutor" || role === "student" || role === "admin") {
    return `/dashboard/${role}`;
  }

  return "/dashboard";
}

function planName(description: string | null | undefined, role?: string | null) {
  // The checkout only sells the role's Pro plan, so prefer the name the app
  // uses everywhere else over Stripe's raw product label.
  if (role === "tutor") return "Pro Tutor Plan";
  if (role === "student") return "Pro Student Plan";

  return description || "Pro Plan";
}

/** Shared frame: gradient header, card body and a footer note. */
function StatusCard({
  tone,
  title,
  description,
  badge,
  children,
}: {
  tone: "success" | "warning" | "error";
  title: string;
  description: string;
  badge?: ReactNode;
  children?: ReactNode;
}) {
  const tones = {
    success: {
      band: "from-[#8a1f8a] via-[#6b1470] to-[#4c0d52]",
      iconWrap: "bg-white/15 ring-white/30",
      icon: "bg-white text-[#8a1f8a]",
      glyph: Check,
    },
    warning: {
      band: "from-amber-500 via-orange-500 to-amber-600",
      iconWrap: "bg-white/15 ring-white/30",
      icon: "bg-white text-amber-600",
      glyph: AlertTriangle,
    },
    error: {
      band: "from-red-600 via-rose-600 to-red-500",
      iconWrap: "bg-white/15 ring-white/30",
      icon: "bg-white text-red-600",
      glyph: XCircle,
    },
  }[tone];

  const Glyph = tones.glyph;

  return (
    <section className="relative isolate overflow-hidden bg-muted/30">
      {/* Decorative glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 h-80 w-[46rem] -translate-x-1/2 rounded-full bg-purple-500/20 blur-3xl dark:bg-purple-500/10" />
        <div className="absolute -bottom-40 right-0 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl dark:bg-fuchsia-500/10" />
      </div>

      <div className="mx-auto flex min-h-[70svh] max-w-2xl flex-col justify-center px-4 py-16 sm:px-6">
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-xl shadow-purple-950/5">
          <div
            className={`relative bg-gradient-to-br px-6 py-10 text-center text-white sm:px-10 ${tones.band}`}
          >
            <span
              className={`mx-auto flex size-16 items-center justify-center rounded-full ring-1 backdrop-blur ${tones.iconWrap}`}
            >
              <span
                className={`flex size-11 items-center justify-center rounded-full shadow ${tones.icon}`}
              >
                <Glyph className="size-6" strokeWidth={3} />
              </span>
            </span>

            <h1 className="mt-5 text-2xl font-extrabold tracking-tight sm:text-3xl">
              {title}
            </h1>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/85">
              {description}
            </p>

            {badge ? (
              <div className="mt-4 flex justify-center">{badge}</div>
            ) : null}
          </div>

          <div className="px-6 py-7 sm:px-8">{children}</div>
        </div>
      </div>
    </section>
  );
}

function ReceiptRow({
  icon: Icon,
  label,
  value,
  mono,
  title,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: ReactNode;
  mono?: boolean;
  title?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <dt className="flex shrink-0 items-center gap-2 text-xs font-semibold text-muted-foreground">
        <Icon className="size-3.5" />
        {label}
      </dt>
      <dd
        title={title}
        className={`min-w-0 text-right text-sm font-semibold text-foreground ${
          mono ? "truncate font-mono text-[11px] font-medium" : ""
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string | string[] }>;
}) {
  const params = await searchParams;
  const rawSessionId = params.session_id;
  const sessionId = Array.isArray(rawSessionId)
    ? rawSessionId[0]
    : rawSessionId;

  if (!sessionId) {
    return (
      <StatusCard
        tone="error"
        title="No checkout session found"
        description="This page opens after a payment. The link is missing its session id, so there is nothing to confirm."
      >
        <Link href="/payment" className={primaryButtonClass}>
          <CreditCard className="size-4" />
          Go to plans
        </Link>
      </StatusCard>
    );
  }

  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "payment_intent"],
    });
  } catch {
    return (
      <StatusCard
        tone="error"
        title="We couldn't verify this payment"
        description="The checkout session is invalid or has expired. If money left your account, it will be recorded shortly — contact support if it doesn't show up."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/payment" className={primaryButtonClass}>
            <CreditCard className="size-4" />
            Back to plans
          </Link>
          <Link href="/dashboard" className={secondaryButtonClass}>
            <LayoutGrid className="size-4" />
            Go to dashboard
          </Link>
        </div>
      </StatusCard>
    );
  }

  if (session.status === "open") {
    redirect("/");
  }

  const role = session.metadata?.userRole ?? null;
  const email = session.customer_details?.email ?? session.customer_email;
  const lineItem = session.line_items?.data?.[0];
  const isPaid =
    session.status === "complete" && session.payment_status === "paid";

  if (!isPaid) {
    return (
      <StatusCard
        tone="warning"
        title="Payment is still processing"
        description="Stripe has not marked this checkout as paid yet. Refresh this page in a moment — your plan activates as soon as the payment settles."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/dashboard" className={primaryButtonClass}>
            <LayoutGrid className="size-4" />
            Go to dashboard
          </Link>
          <Link href="/payment" className={secondaryButtonClass}>
            <CreditCard className="size-4" />
            Back to plans
          </Link>
        </div>
      </StatusCard>
    );
  }

  // Record the payment on the server (idempotent: re-opening this page is safe).
  let alreadyRecorded = false;
  let syncFailed = false;

  try {
    const result = await checkoutVerify(sessionId);
    alreadyRecorded =
      result?.success === false &&
      typeof result?.message === "string" &&
      /already/i.test(result.message);
  } catch {
    syncFailed = true;
  }

  return (
    <StatusCard
      tone="success"
      title="Payment successful"
      description={`Thanks${email ? `, ${email.split("@")[0]}` : ""}! Your Pro upgrade is confirmed and your account is unlocked.`}
      badge={
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold tracking-wider uppercase ring-1 ring-white/25">
          <Sparkles className="size-3" />
          Pro active
        </span>
      }
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
          <ReceiptText className="size-4 text-purple-700 dark:text-purple-300" />
          Payment receipt
        </h2>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
          <BadgeCheck className="size-3.5" />
          Paid
        </span>
      </div>

      <dl className="mt-3 divide-y divide-border border-y border-border">
        <ReceiptRow
          icon={Sparkles}
          label="Plan"
          value={planName(lineItem?.description, role)}
        />
        <ReceiptRow
          icon={CreditCard}
          label="Amount paid"
          value={
            <span className="text-base font-extrabold">
              {formatAmount(session.amount_total, session.currency)}
            </span>
          }
        />
        <ReceiptRow icon={Mail} label="Billed to" value={email || "—"} />
        <ReceiptRow
          icon={CalendarDays}
          label="Date"
          value={formatDate(session.created)}
        />
        <ReceiptRow
          icon={Hash}
          label="Session"
          value={sessionId}
          title={sessionId}
          mono
        />
      </dl>

      {alreadyRecorded ? (
        <p className="mt-4 flex items-start gap-2 rounded-xl bg-muted/60 px-3.5 py-2.5 text-xs leading-5 text-muted-foreground">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          This payment was already recorded on your account — you were not
          charged twice.
        </p>
      ) : null}

      {syncFailed ? (
        <p className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 px-3.5 py-2.5 text-xs leading-5 text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          Your payment went through, but we could not sync it to our server just
          yet. It will appear on your account shortly.
        </p>
      ) : null}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link href={dashboardHref(role)} className={primaryButtonClass}>
          <LayoutGrid className="size-4" />
          Go to dashboard
          <ArrowRight className="size-4" />
        </Link>
        <Link href="/browse-tution" className={secondaryButtonClass}>
          Browse tuitions
        </Link>
      </div>

      <p className="mt-5 text-center text-[11px] leading-5 text-muted-foreground">
        Keep this page for your records. Questions about this payment?{" "}
        <a
          href="mailto:support@mentorlagbe.com"
          className="font-semibold text-purple-700 hover:underline dark:text-purple-300"
        >
          Contact support
        </a>
        .
      </p>
    </StatusCard>
  );
}
