import { Metadata } from "next"
import { getOrderById } from "@/lib/actions/order.actions"
import { notFound } from "next/navigation"
import OrderDetailsTable from "./order-details-table"
import { ShippingAddress } from "@/types"
import { auth } from "@/auth"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Stripe from "stripe"

export const metadata: Metadata = {
  title: "Detail objednávky",
}

const OrderDetailsPage = async (props: {
  params: Promise<{
    id: string
  }>
}) => {
  const { id } = await props.params

  const order = await getOrderById(id)
  if (!order) notFound()

  const session = await auth()

  let client_secret = null

  // Check if is not paid and using stripe
  if (order.paymentMethod === "Stripe" && !order.isPaid) {
    // Init stripe instance
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(order.totalPrice) * 100),
      currency: "CZK",
      metadata: { orderId: order.id },
    })
    client_secret = paymentIntent.client_secret
  }

  return (
    <>
      {session?.user?.role === "admin" ? (
        <Button variant="link">
          <Link href="/admin/objednavky" className="flex">
            <ArrowLeft className="mt-[2px] mr-2" /> zpět na admin objednávky
          </Link>
        </Button>
      ) : (
        <Button variant="link">
          <Link href="/uzivatel/objednavky" className="flex">
            <ArrowLeft className="mt-[2px] mr-2" /> zpět na moje objednávky
          </Link>
        </Button>
      )}
      <OrderDetailsTable
        order={{
          ...order,
          shippingAddress: order.shippingAddress as ShippingAddress,
        }}
        stripeClientSecret={client_secret}
        paypalClientId={process.env.PAYPAL_CLIENT_ID || "sb"}
        isAdmin={session?.user?.role === "admin" || false}
        userEmail={session?.user?.email || ""}
      />
    </>
  )
}

export default OrderDetailsPage
