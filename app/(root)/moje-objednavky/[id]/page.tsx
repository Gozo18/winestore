import { Metadata } from "next"
import { getOrderById } from "@/lib/actions/order.actions"
import { notFound, redirect } from "next/navigation"
import OrderDetailsTable from "./order-details-table"
import { ShippingAddress } from "@/types"
import { auth } from "@/auth"
import { getCurrentUserId } from "@/lib/current-user"
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
  searchParams: Promise<{ token?: string }>
}) => {
  const { id } = await props.params
  const { token } = await props.searchParams

  const order = await getOrderById(id)
  if (!order) notFound()

  const session = await auth()
  const currentUserId = await getCurrentUserId()
  const isOwner = !!currentUserId && currentUserId === order.userId
  const isAdmin = session?.user?.role === "admin"
  const hasValidToken = !!token && !!order.accessToken && token === order.accessToken

  if (!isOwner && !isAdmin && !hasValidToken) {
    redirect("/prihlaseni")
  }

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

  const isGuestView = hasValidToken && !isOwner && !isAdmin

  return (
    <>
      {isAdmin ? (
        <Button variant="link">
          <Link href="/admin/objednavky" className="flex">
            <ArrowLeft className="mt-[2px] mr-2" /> zpět na admin objednávky
          </Link>
        </Button>
      ) : isGuestView ? null : (
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
        isAdmin={session?.user?.role === "admin" || false}
        userEmail={session?.user?.email || ""}
        viewerToken={hasValidToken ? token : undefined}
      />
    </>
  )
}

export default OrderDetailsPage
