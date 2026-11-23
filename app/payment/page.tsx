import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import Link from "next/link"
import React from "react"

const FREE_LIMIT = 2

type Plan = {
  id: "student" | "tutor"
  name: string
  price: number
  tagline: string
  features: string[]
  popular?: boolean
}

const plans: Plan[] = [
  {
    id: "student",
    name: "Student Plan",
    price: 10,
    tagline: "For students who want to apply to more tuitions",
    features: [
      "Unlimited tuition applications",
      "Save unlimited tuitions",
      "Track every application status",
      "Priority support",
    ],
  },
  {
    id: "tutor",
    name: "Tutor Plan",
    price: 15,
    tagline: "For tutors who want to reach more students",
    features: [
      "Unlimited tuition posts",
      "Manage student requests easily",
      "Highlighted tutor profile",
      "Priority support",
    ],
    popular: true,
  },
]

const CheckoutPaymentPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; canceled?: string }>
}) => {
  const { success, canceled } = await searchParams

  const session = await auth.api.getSession({
    headers: await headers(),
  })
  const user = session?.user
  const email = user?.email ?? ""

  return (
    <section className="min-h-screen bg-gray-50 px-4 py-16 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">Choose your plan</h1>
          <p className="mx-auto mt-3 max-w-xl text-gray-600 dark:text-gray-400">
            You can submit up to {FREE_LIMIT} applications for free. Upgrade to
            keep going without limits.
          </p>
        </div>

        {success && (
          <p className="mx-auto mt-6 max-w-md rounded-lg bg-green-100 px-4 py-2 text-center text-sm text-green-800 dark:bg-green-500/10 dark:text-green-300">
            Payment successful! Your plan will be active in a moment.
          </p>
        )}
        {canceled && (
          <p className="mx-auto mt-6 max-w-md rounded-lg bg-red-100 px-4 py-2 text-center text-sm text-red-800 dark:bg-red-500/10 dark:text-red-300">
            Payment canceled. You can try again when you&apos;re ready.
          </p>
        )}

        <div className="mx-auto mt-6 flex max-w-md items-center justify-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-300">
          <span aria-hidden>⚠️</span>
          Free plan limit: {FREE_LIMIT} applications
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {plans.map((plan) => {
            const buttonClass = `w-full rounded-lg px-4 py-3 text-center font-medium transition ${
              plan.popular
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-gray-900 text-white hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
            }`

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-2xl border p-8 shadow-sm transition hover:shadow-lg ${
                  plan.popular
                    ? "border-indigo-500 bg-white dark:border-indigo-400 dark:bg-gray-900"
                    : "border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">
                    Most popular
                  </span>
                )}

                <h2 className="text-xl font-semibold">{plan.name}</h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {plan.tagline}
                </p>

                <div className="mt-6 flex items-end gap-1">
                  <span className="text-5xl font-bold">${plan.price}</span>
                  <span className="mb-1 text-gray-500 dark:text-gray-400">
                    one-time
                  </span>
                </div>

                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <span className="mt-0.5 text-green-600 dark:text-green-400">
                        ✓
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {user ? (
                  <form
                    action="/api/checkout_sessions"
                    method="POST"
                    className="mt-8"
                  >
                    <input type="hidden" name="plan" value={plan.id} />
                    <input type="hidden" name="email" value={email} />
                    <button type="submit" className={buttonClass}>
                      Get {plan.name}
                    </button>
                  </form>
                ) : (
                  <Link
                    href="/sign-in?callbackURL=/checkout"
                    className={`mt-8 block ${buttonClass}`}
                  >
                    Sign in to get {plan.name}
                  </Link>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default CheckoutPaymentPage

// // "use client"

// import React from "react"

// const FREE_LIMIT = 2

// type Plan = {
//   id: "student" | "tutor"
//   name: string
//   price: number
//   tagline: string
//   features: string[]
//   popular?: boolean
// }

// const plans: Plan[] = [
//   {
//     id: "student",
//     name: "Student Plan",
//     price: 10,
//     tagline: "For students who want to apply to more tuitions",
//     features: [
//       "Unlimited tuition applications",
//       "Save unlimited tuitions",
//       "Track every application status",
//       "Priority support",
//     ],
//   },
//   {
//     id: "tutor",
//     name: "Tutor Plan",
//     price: 15,
//     tagline: "For tutors who want to reach more students",
//     features: [
//       "Unlimited tuition posts",
//       "Manage student requests easily",
//       "Highlighted tutor profile",
//       "Priority support",
//     ],
//     popular: true,
//   },
// ]

// const CheckoutPaymentPage = async({
//   searchParams,
// }: {
//   earchParams: Promise<{ plan?: string }>
// }) => {
//   const { canceled } = await searchParams

//   if (canceled) {
//     console.log(
//       "Order canceled -- continue to shop around and check out when you're ready."
//     )
//   }
//   const handleCheckout = (plan: Plan) => {
//     // TODO: connect your payment gateway (Stripe, SSLCommerz, bKash...)
//     console.log("Checkout:", plan.id, plan.price)
//   }

//   return (
//     <section className="min-h-screen bg-gray-50 px-4 py-16 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
//       <div className="mx-auto max-w-4xl">
//         <div className="text-center">
//           <h1 className="text-3xl font-bold sm:text-4xl">Choose your plan</h1>
//           <p className="mx-auto mt-3 max-w-xl text-gray-600 dark:text-gray-400">
//             You can submit up to {FREE_LIMIT} applications for free. Upgrade to
//             keep going without limits.
//           </p>
//         </div>

//         <div className="mx-auto mt-6 flex max-w-md items-center justify-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-300">
//           <span aria-hidden>⚠️</span>
//           Free plan limit: {FREE_LIMIT} applications
//         </div>

//         <div className="mt-12 grid gap-8 md:grid-cols-2">
//           {plans.map((plan) => (
//             <div
//               key={plan.id}
//               className={`relative flex flex-col rounded-2xl border p-8 shadow-sm transition hover:shadow-lg ${
//                 plan.popular
//                   ? "border-indigo-500 bg-white dark:border-indigo-400 dark:bg-gray-900"
//                   : "border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
//               }`}
//             >
//               {plan.popular && (
//                 <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">
//                   Most popular
//                 </span>
//               )}

//               <h2 className="text-xl font-semibold">{plan.name}</h2>
//               <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
//                 {plan.tagline}
//               </p>

//               <div className="mt-6 flex items-end gap-1">
//                 <span className="text-5xl font-bold">${plan.price}</span>
//                 <span className="mb-1 text-gray-500 dark:text-gray-400">
//                   / month
//                 </span>
//               </div>

//               <ul className="mt-6 flex-1 space-y-3">
//                 {plan.features.map((feature) => (
//                   <li key={feature} className="flex items-start gap-2 text-sm">
//                     <span className="mt-0.5 text-green-600 dark:text-green-400">
//                       ✓
//                     </span>
//                     <span>{feature}</span>
//                   </li>
//                 ))}
//               </ul>

//               <button
//                 onClick={() => handleCheckout(plan)}
//                 className={`mt-8 w-full rounded-lg px-4 py-3 font-medium transition ${
//                   plan.popular
//                     ? "bg-indigo-600 text-white hover:bg-indigo-700"
//                     : "bg-gray-900 text-white hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
//                 }`}
//               >
//                 Get {plan.name}
//               </button>

//               <form action="/api/checkout_sessions" method="POST">
//                 <section>
//                   <button
//                     onClick={() => handleCheckout(plan)}
//                     className={`mt-8 w-full rounded-lg px-4 py-3 font-medium transition ${
//                       plan.popular
//                         ? "bg-indigo-600 text-white hover:bg-indigo-700"
//                         : "bg-gray-900 text-white hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
//                     }`}
//                   >
//                     Get {plan.name}
//                   </button>
//                 </section>
//               </form>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   )
// }

// export default CheckoutPaymentPage
