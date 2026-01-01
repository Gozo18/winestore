import { Metadata } from "next"
import { getOrderById } from "@/lib/actions/order.actions"
import { notFound } from "next/navigation"
import OrderDetailsTable from "./order-details-table"
import { ShippingAddress } from "@/types"
import { auth } from "@/auth"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

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

  return (
    <>
      <Button variant="link">
        <Link href="/uzivatel/objednavky" className="flex">
          <ArrowLeft className="mt-[2px] mr-2" /> zpět na moje objednávky
        </Link>
      </Button>
      <OrderDetailsTable
        order={{
          ...order,
          shippingAddress: order.shippingAddress as ShippingAddress,
        }}
        paypalClientId={process.env.PAYPAL_CLIENT_ID || "sb"}
        isAdmin={session?.user?.role === "admin" || false}
      />
    </>
  )
}

export default OrderDetailsPage
