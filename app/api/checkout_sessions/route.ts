import { NextResponse } from "next/server"
import { headers } from "next/headers"

import { stripe } from "../../../lib/stripe"
import { auth } from "@/lib/auth"

export async function POST() {
  try {
    // Get logged-in user session
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      return NextResponse.json({ error: "Please login first" }, { status: 401 })
    }

    // Get user role
    const userRole = session.user.role

    // Select price based on role
    const priceId =
      userRole === "tutor"
        ? "price_1UeXF9J9Y6Wy4pHxTeqlWNDf"
        : userRole === "student"
          ? "price_1UeXG9J9Y6Wy4pHxibNKsTe2"
          : null

    // Validate role
    if (!priceId) {
      return NextResponse.json({ error: "Invalid user role" }, { status: 403 })
    }

    // Get origin
    const headersList = await headers()
    const origin = headersList.get("origin")

    if (!origin) {
      return NextResponse.json({ error: "Origin not found" }, { status: 400 })
    }

    // Create Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],

      mode: "payment",
      // Additional information send with transaction
      customer_email: session?.user.email,
      metadata: {
        userId: session.user.id,
        userRole: session.user.role,
      },
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing`,

      integration_identifier: "Mentor_Lagbe_001",
    })

    // Redirect to Stripe Checkout
    return NextResponse.redirect(checkoutSession.url!, 303)
  } catch (err) {
    const error = err instanceof Error ? err.message : "Something went wrong"

    return NextResponse.json({ error }, { status: 500 })
  }
}

// import { NextResponse } from 'next/server'
// import { headers } from 'next/headers'

// import { stripe } from '../../../lib/stripe'

// export async function POST() {

//   try {
//     const headersList = await headers()
//     const origin = headersList.get('origin')

//     // Create Checkout Sessions from body params.
//     const session = await stripe.checkout.sessions.create({

//       line_items: [
//         {
//           //Tutor: Provide the exact Price ID (for example, price_1234) of the product you want to sell of Tutor
//           price: 'price_1UeXF9J9Y6Wy4pHxTeqlWNDf',
//           quantity: 1,
//         },
//         {
//           //Student: Provide the exact Price ID (for example, price_1234) of the product you want to sell
//           price: 'price_1UeXG9J9Y6Wy4pHxibNKsTe2',
//           quantity: 1,
//         },
//       ],
//       mode: 'payment',
//       success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
//       // Provide a name (for example, hosted_web_0001) to label this Checkout integration and measure its conversion independently
//       integration_identifier: 'Mentor_Lagbe_001',
//     });
//     return NextResponse.redirect(session.url as string, 303)
//   } catch (err) {
//     const error = err instanceof Error ? err : new Error(String(err))
//     return NextResponse.json(
//       { error: error.message },
//       { status: 500 }
//     )
//   }
// }
