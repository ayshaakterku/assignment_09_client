import { BASE_URL } from "./tutions"

export interface IPaymented {
  _id: string
  sessionId: string
  status: string
  customer_email: string
  userId: string
  payment_intent: string
  payment_status: string
  payment_date: string
  amount_total?: number
  userRole?: string
}
/** Every completed checkout recorded on the server. */

export const getPaymentInfo = async (): Promise<IPaymented[]> => {
  const res = await fetch(`${BASE_URL}/payment`, { cache: "no-store" })
  if (!res.ok) {
    throw new Error(`Failed to load payment information (${res.status})`)
  }
  return res.json()
}
