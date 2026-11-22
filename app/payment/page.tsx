import { headers } from "next/headers"

import { auth } from "@/lib/auth"
import { PaymentView } from "./payment-view"

type PaymentPageProps = {
  searchParams: Promise<{ canceled?: string }>
}

const PaymentPage = async ({ searchParams }: PaymentPageProps) => {
  const session = await auth.api.getSession({ headers: await headers() })
  const { canceled } = await searchParams
  if (canceled) {
    console.log(
      "Order canceled -- continue to shop around and check out when you're ready."
    )
  }

  return (
    <PaymentView
      defaultEmail={session?.user?.email ?? ""}
      canceled={Boolean(canceled)}
    />
  )
}

export default PaymentPage
