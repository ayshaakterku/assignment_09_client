"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Check,
  CircleAlert,
  CreditCard,
  Lock,
  ShieldCheck,
} from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/toast"

const PLAN = {
  name: "Hireloop Pro Plan",
  description: "Access to all features",
  priceUsd: 20,
  bdtRate: 127.6665,
}

const CURRENCIES = [
  { code: "BDT", country: "BD", label: "Bangladeshi Taka" },
  { code: "USD", country: "US", label: "US Dollar" },
] as const

const BENEFITS = [
  "Unlimited job applications",
  "Priority review of your applications",
  "Early access to new job posts",
  "Cancel anytime",
]

const COUNTRIES = [
  "Bangladesh",
  "United States",
  "United Kingdom",
  "Canada",
  "India",
  "Germany",
  "Australia",
  "Other",
]

type CurrencyCode = (typeof CURRENCIES)[number]["code"]

type PaymentViewProps = {
  defaultEmail?: string
  canceled?: boolean
}

function formatPrice(currency: CurrencyCode) {
  const amount =
    currency === "BDT" ? PLAN.priceUsd * PLAN.bdtRate : PLAN.priceUsd

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function PaymentView({ defaultEmail = "", canceled }: PaymentViewProps) {
  const router = useRouter()
  const [currency, setCurrency] = React.useState<CurrencyCode>("BDT")
  const [email, setEmail] = React.useState(defaultEmail)
  const [saveCard, setSaveCard] = React.useState(false)

  const price = formatPrice(currency)

  // The form posts to the Stripe checkout route, which creates a Checkout
  // Session and redirects the browser to Stripe. Only block submission when
  // the email is missing.
  const handlePay = (event: React.FormEvent<HTMLFormElement>) => {
    if (!email.trim()) {
      event.preventDefault()
      toast.add({
        type: "warning",
        title: "Email required",
        description: "Enter an email address so we can send your receipt.",
      })
    }
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon-lg"
            aria-label="Go back"
            onClick={() => router.back()}
            className="text-muted-foreground"
          >
            <ArrowLeft />
          </Button>
          <span className="flex size-8 items-center justify-center rounded-lg border bg-card text-muted-foreground">
            <Lock className="size-4" />
          </span>
          <span className="hidden text-sm font-medium sm:inline">
            Secure checkout
          </span>
        </div>

        <span className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
          Hireloop
        </span>
      </header>

      {canceled && (
        <div
          role="status"
          className="mt-6 flex items-start gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-sm text-amber-600 dark:text-amber-400"
        >
          <CircleAlert className="mt-0.5 size-4 shrink-0" />
          <p>
            Your payment was canceled. Review your plan and try again whenever
            you are ready.
          </p>
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <section
          aria-labelledby="plan-heading"
          className="h-fit rounded-2xl border bg-card p-5 shadow-sm sm:p-6"
        >
          <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
            Choose a currency
          </p>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {CURRENCIES.map((option) => (
              <button
                key={option.code}
                type="button"
                aria-pressed={currency === option.code}
                onClick={() => setCurrency(option.code)}
                className={cn(
                  "flex items-center gap-3 rounded-xl border p-3 text-left transition-colors",
                  currency === option.code
                    ? "border-brand/60 bg-brand/5 ring-1 ring-brand/30"
                    : "border-border bg-background/40 hover:bg-muted/40"
                )}
              >
                <span
                  aria-hidden="true"
                  className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-semibold tracking-wide text-muted-foreground uppercase"
                >
                  {option.country}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">
                    {option.code} {formatPrice(option.code)}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {option.label}
                  </span>
                </span>
              </button>
            ))}
          </div>

          <p className="mt-2 text-xs text-muted-foreground">
            1 USD = {PLAN.bdtRate} BDT
          </p>

          <div className="my-5 border-t border-border/60" />

          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 id="plan-heading" className="text-base font-semibold">
                {PLAN.name}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {PLAN.description}
              </p>
            </div>
            <p className="shrink-0 text-sm font-semibold whitespace-nowrap">
              {currency} {price}
            </p>
          </div>

          <ul className="mt-5 space-y-3">
            {BENEFITS.map((benefit) => (
              <li
                key={benefit}
                className="flex items-center gap-2.5 text-sm text-muted-foreground"
              >
                <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-brand/15 text-brand">
                  <Check className="size-2.5" strokeWidth={3} />
                </span>
                {benefit}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-border/60 bg-muted/20 p-3 text-xs text-muted-foreground">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-brand" />
            <p>
              Your plan starts right after payment. You can cancel anytime from
              your dashboard settings.
            </p>
          </div>
        </section>

        <form
          action="/api/checkout_sessions"
          method="POST"
          onSubmit={handlePay}
          className="space-y-4"
        >
          <input type="hidden" name="currency" value={currency} />

          <section className="rounded-2xl border bg-card p-5 shadow-sm">
            <h2 className="text-sm font-semibold">Contact information</h2>

            <div className="mt-3 space-y-1.5">
              <Label
                htmlFor="payment-email"
                className="text-xs text-muted-foreground"
              >
                Email
              </Label>
              <Input
                id="payment-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="email@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-10"
              />
            </div>
          </section>

          <section className="rounded-2xl border bg-card p-5 shadow-sm">
            <h2 className="text-sm font-semibold">Payment method</h2>

            <div className="mt-3 rounded-xl border bg-muted/20 p-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <CreditCard className="size-4 text-muted-foreground" />
                Card
              </div>

              <div className="mt-3 space-y-3">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="card-number"
                    className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase"
                  >
                    Card information
                  </Label>
                  <Input
                    id="card-number"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    placeholder="1234 1234 1234 1234"
                    className="h-10 bg-background"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      aria-label="Expiry date"
                      inputMode="numeric"
                      autoComplete="cc-exp"
                      placeholder="MM / YY"
                      className="h-10 bg-background"
                    />
                    <Input
                      aria-label="Card security code"
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      placeholder="CVC"
                      className="h-10 bg-background"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="cardholder-name"
                    className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase"
                  >
                    Cardholder name
                  </Label>
                  <Input
                    id="cardholder-name"
                    autoComplete="cc-name"
                    placeholder="Full name on card"
                    className="h-10 bg-background"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="card-country"
                    className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase"
                  >
                    Country or region
                  </Label>
                  <select
                    id="card-country"
                    defaultValue="Bangladesh"
                    autoComplete="country-name"
                    className="h-10 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                  >
                    {COUNTRIES.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-3 rounded-xl border bg-muted/20 p-3">
              <Checkbox
                id="save-card"
                checked={saveCard}
                onCheckedChange={(checked) => setSaveCard(Boolean(checked))}
                className="mt-0.5"
              />
              <div className="min-w-0">
                <Label
                  htmlFor="save-card"
                  className="cursor-pointer text-sm font-medium"
                >
                  Save my information for faster checkout
                </Label>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Pay securely on this site and anywhere Stripe is accepted.
                </p>
              </div>
            </div>
          </section>

          {/* <Button
            type="submit"
            className="h-11 w-full rounded-xl bg-brand font-semibold text-brand-foreground shadow-lg shadow-brand/20 hover:bg-brand/90"
          >
            Pay {currency} {price}
          </Button> */}
          {/* this form related with payment */}
          <form action="/api/checkout_sessions" method="POST">
            <section>
              <Button
                type="submit"
                role="link"
                className="h-11 w-full rounded-xl bg-brand font-semibold text-brand-foreground shadow-lg shadow-brand/20 hover:bg-brand/90"
              >
                Checkout {currency} {price}
              </Button>
            </section>
          </form>
          <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
            <ShieldCheck className="size-3.5 shrink-0" />
            Payments are processed securely by Stripe. You will be redirected to
            Stripe Checkout.
          </p>
        </form>
      </div>
    </main>
  )
}
