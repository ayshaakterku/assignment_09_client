import Link from "next/link"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import {
  ArrowRight,
  CircleAlert,
  CircleCheck,
  Clock,
  CreditCard,
  Mail,
  ReceiptText,
  ShieldCheck,
} from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { checkoutVerify } from "@/lib/actions/payments"
import { auth } from "@/lib/auth"
import { stripe } from "@/lib/stripe"
import { cn } from "@/lib/utils"

import { CopyButton } from "./copy-button"

const PRIMARY_ACTION = cn(
  buttonVariants({ size: "lg" }),
  "h-10 flex-1 rounded-xl bg-brand font-semibold text-brand-foreground shadow-lg shadow-brand/20 hover:bg-brand/90"
)

const SECONDARY_ACTION = cn(
  buttonVariants({ variant: "outline" }),
  "h-10 flex-1 rounded-xl"
)

function formatAmount(
  amount: number | null | undefined,
  currency: string | null | undefined
) {
  if (amount == null || !currency) return "—"

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100)
}

function formatDate(unixSeconds: number) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(unixSeconds * 1000))
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-16 -top-10 h-32 rounded-full bg-brand/15 blur-3xl"
        />
        <div className="relative">{children}</div>
      </div>
    </main>
  )
}

function DetailRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start justify-between gap-4 px-5 py-3">
      <dt className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
        {icon}
        {label}
      </dt>
      <dd className="min-w-0 text-right text-sm font-medium break-words">
        {children}
      </dd>
    </div>
  )
}

export default async function CheckOutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id } = await searchParams

  if (!session_id) {
    return (
      <PageShell>
        <header className="text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 ring-1 ring-amber-500/20 dark:text-amber-400">
            <CircleAlert className="size-7" />
          </span>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">
            We couldn&apos;t find this payment
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            This page needs a valid checkout session. If you were sent here
            after paying, check your email for the receipt or contact support.
          </p>
        </header>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Link href="/payment" className={PRIMARY_ACTION}>
            Go to checkout
            <ArrowRight />
          </Link>
          <Link href="/" className={SECONDARY_ACTION}>
            Back to home
          </Link>
        </div>
      </PageShell>
    )
  }

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent"],
  })

  if (session.status === "open") {
    redirect("/")
  }

  const email =
    session.customer_details?.email ?? session.customer_email ?? null

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : (session.payment_intent?.id ?? null)

  const total = formatAmount(session.amount_total, session.currency)
  const paid =
    session.status === "complete" && session.payment_status === "paid"

  if (!paid) {
    return (
      <PageShell>
        <header className="text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 ring-1 ring-amber-500/20 dark:text-amber-400">
            <Clock className="size-7" />
          </span>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">
            Payment not completed
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            We haven&apos;t received a confirmed payment for this checkout. If
            you were charged, it can take a few minutes to appear — otherwise
            you can try again.
          </p>
        </header>

        <section className="mt-8 overflow-hidden rounded-2xl border bg-card shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-border/60 bg-muted/20 px-5 py-4">
            <div className="flex items-center gap-2">
              <ReceiptText className="size-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold">Payment details</h2>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-amber-600 uppercase dark:text-amber-400">
              {session.payment_status.replace(/_/g, " ")}
            </span>
          </div>

          <dl className="divide-y divide-border/60">
            <DetailRow icon={<Mail className="size-3.5" />} label="Email">
              {email ?? "—"}
            </DetailRow>
            <DetailRow
              icon={<ReceiptText className="size-3.5" />}
              label="Transaction ID"
            >
              <span className="font-mono text-xs">
                {paymentIntentId ?? "—"}
              </span>
            </DetailRow>
            <DetailRow icon={<Clock className="size-3.5" />} label="Created">
              {formatDate(session.created)}
            </DetailRow>
            <DetailRow
              icon={<CreditCard className="size-3.5" />}
              label="Amount"
            >
              {total}
            </DetailRow>
          </dl>
        </section>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Link href="/payment" className={PRIMARY_ACTION}>
            Try again
            <ArrowRight />
          </Link>
          <Link href="/" className={SECONDARY_ACTION}>
            Back to home
          </Link>
        </div>
      </PageShell>
    )
  }

  let activationFailed = false
  try {
    await checkoutVerify(session_id)
  } catch {
    activationFailed = true
  }

  const authSession = await auth.api.getSession({ headers: await headers() })
  const dashboardHref = `/dashboard/${authSession?.user?.role ?? "seeker"}`

  const lineItems = session.line_items?.data ?? []
  const paymentMethod =
    session.payment_method_types.length > 0
      ? session.payment_method_types
          .map((type) => type.charAt(0).toUpperCase() + type.slice(1))
          .join(", ")
      : "—"

  return (
    <PageShell>
      <header className="text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20 dark:text-emerald-400">
          <CircleCheck className="size-7" />
        </span>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">
          Payment successful
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Thank you for your purchase! Your plan is active and a confirmation
          email is on its way to{" "}
          {email ? (
            <span className="font-medium text-foreground">{email}</span>
          ) : (
            "your inbox"
          )}
          .
        </p>
      </header>

      {activationFailed && (
        <div
          role="status"
          className="mt-6 flex items-start gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-600 dark:text-amber-400"
        >
          <CircleAlert className="mt-0.5 size-4 shrink-0" />
          <p>
            Your payment was received, but your plan is still being activated.
            It can take a minute — refresh this page to check.
          </p>
        </div>
      )}

      <section
        aria-labelledby="receipt-heading"
        className="mt-8 overflow-hidden rounded-2xl border bg-card shadow-sm"
      >
        <div className="flex items-center justify-between gap-3 border-b border-border/60 bg-muted/20 px-5 py-4">
          <div className="flex items-center gap-2">
            <ReceiptText className="size-4 text-muted-foreground" />
            <h2 id="receipt-heading" className="text-sm font-semibold">
              Payment receipt
            </h2>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-emerald-600 uppercase dark:text-emerald-400">
            Paid
          </span>
        </div>

        <div className="px-5 py-4">
          {lineItems.length > 0 && (
            <ul className="space-y-3">
              {lineItems.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start justify-between gap-4"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {item.description ?? "Hireloop Pro Plan"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Qty {item.quantity ?? 1}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-medium whitespace-nowrap">
                    {formatAmount(
                      item.amount_total ?? item.amount_subtotal,
                      session.currency
                    )}
                  </p>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-4">
            <p className="text-sm text-muted-foreground">Total paid</p>
            <p className="text-lg font-semibold tracking-tight">{total}</p>
          </div>
        </div>

        <div className="border-t border-border/60 bg-muted/10 px-5 py-4">
          <div className="rounded-xl border border-brand/20 bg-brand/5 p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                Transaction ID
              </p>
              {paymentIntentId && (
                <CopyButton
                  value={paymentIntentId}
                  label="Copy transaction ID"
                />
              )}
            </div>
            <p className="mt-1 font-mono text-sm font-medium break-all">
              {paymentIntentId ?? "Not available yet"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Share this ID with support if you have a question about this
              payment.
            </p>
          </div>

          <dl className="mt-2 divide-y divide-border/60">
            <DetailRow icon={<Mail className="size-3.5" />} label="Email">
              {email ?? "—"}
            </DetailRow>
            <DetailRow
              icon={<CreditCard className="size-3.5" />}
              label="Payment method"
            >
              {paymentMethod}
            </DetailRow>
            <DetailRow icon={<Clock className="size-3.5" />} label="Date">
              {formatDate(session.created)}
            </DetailRow>
            <DetailRow
              icon={<ReceiptText className="size-3.5" />}
              label="Checkout ref"
            >
              <span className="font-mono text-xs">{session.id}</span>
            </DetailRow>
          </dl>
        </div>
      </section>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <Link href={dashboardHref} className={PRIMARY_ACTION}>
          Go to dashboard
          <ArrowRight />
        </Link>
        <Link href="/browse-jobs" className={SECONDARY_ACTION}>
          Browse jobs
        </Link>
      </div>

      <p className="mt-5 flex flex-wrap items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
        <ShieldCheck className="size-3.5 shrink-0" />
        Payments are processed securely by Stripe. Questions? Email{" "}
        <a
          href="mailto:orders@example.com"
          className="font-medium text-foreground underline underline-offset-4 hover:text-brand"
        >
          orders@example.com
        </a>
      </p>
    </PageShell>
  )
}
