"use client"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils"
import { Order } from "@/types"
import Link from "next/link"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { useTransition } from "react"
import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js"
import {
  createPayPalOrder,
  approvePayPalOrder,
  updateOrderToPaidCOD,
  deliverOrder,
} from "@/lib/actions/order.actions"
import StripePayment from "./stripe-payment"
import { Separator } from "@/components/ui/separator"

const OrderDetailsTable = ({
  order,
  paypalClientId,
  isAdmin,
  stripeClientSecret,
  userEmail,
}: {
  order: Order
  paypalClientId: string
  isAdmin: boolean
  stripeClientSecret: string | null
  userEmail: string
}) => {
  const {
    id,
    shippingAddress,
    orderitems,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    paymentMethod,
    isDelivered,
    isPaid,
    paidAt,
    deliveredAt,
    createdAt,
  } = order

  const { toast } = useToast()

  const PrintLoadingState = () => {
    const [{ isPending, isRejected }] = usePayPalScriptReducer()

    let status = ""

    if (isPending) {
      status = "Načítám PayPal..."
    } else if (isRejected) {
      status = "Chyba při načítání PayPal"
    }

    return status
  }

  const handleCreatePayPalOrder = async () => {
    const res = await createPayPalOrder(order.id)

    if (!res.success) {
      toast({
        variant: "destructive",
        description: res.message,
      })
    }

    return res.data
  }

  const handleApprovePayPalOrder = async (data: { orderID: string }) => {
    const res = await approvePayPalOrder(order.id, data)

    toast({
      variant: res.success ? "default" : "destructive",
      description: res.message,
    })
  }

  // Button to mark order as paid
  const MarkAsPaidButton = () => {
    const [isPending, startTransition] = useTransition()
    const { toast } = useToast()

    return (
      <Button
        type="button"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            const res = await updateOrderToPaidCOD(order.id)
            toast({
              variant: res.success ? "default" : "destructive",
              description: res.message,
            })
          })
        }
      >
        {isPending ? "upravuji..." : "Označ jako zaplacené"}
      </Button>
    )
  }

  // Button to mark order as delivered
  const MarkAsDeliveredButton = () => {
    const [isPending, startTransition] = useTransition()
    const { toast } = useToast()

    return (
      <Button
        type="button"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            const res = await deliverOrder(order.id)
            toast({
              variant: res.success ? "default" : "destructive",
              description: res.message,
            })
          })
        }
      >
        {isPending ? "upravuji..." : "Označ jako doručené"}
      </Button>
    )
  }

  return (
    <>
      <h1 className="py-4 text-lg md:text-2xl font-semibold">
        Objednávka {formatId(id)} <br /> ze dne{" "}
        {formatDateTime(createdAt!).dateTime}
      </h1>
      <div className="grid md:grid-cols-3 md:gap-5">
        <div className="md:col-span-2 space-y-4 overflow-x-auto">
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-lg md:text-xl pb-4">Platební metoda</h2>
              <p className="mb-2 text-sm md:text-base">
                {paymentMethod === "Stripe"
                  ? "Platba kartou"
                  : paymentMethod === "PayPal"
                    ? "Platba přes PayPal"
                    : "Dobírka"}
              </p>
              {isPaid ? (
                <Badge
                  variant="secondary"
                  className="bg-[#72bf80] text-white dark:bg-[#72bf80]"
                >
                  Zaplaceno dne {formatDateTime(paidAt!).dateTime}
                </Badge>
              ) : (
                <Badge variant="destructive">Nezaplaceno</Badge>
              )}
            </CardContent>
          </Card>
          <Card className="my-2">
            <CardContent className="p-4 gap-4">
              <h2 className="text-lg md:text-xl pb-4">Dodací adresa</h2>
              <p className="text-sm md:text-base">{shippingAddress.fullName}</p>
              <p className="mb-2 text-sm md:text-base">
                {shippingAddress.streetAddress}, {shippingAddress.city}{" "}
                {shippingAddress.postalCode}, {shippingAddress.country}
              </p>
              {isDelivered ? (
                <Badge
                  variant="secondary"
                  className="bg-[#72bf80] text-white dark:bg-[#72bf80]"
                >
                  Doručeno dne {formatDateTime(deliveredAt!).dateTime}
                </Badge>
              ) : (
                <Badge variant="destructive">Nedoručeno</Badge>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-lg md:text-xl pb-4">Objednané položky</h2>
              <Table className="text-xs md:text-base">
                <TableHeader>
                  <TableRow>
                    <TableHead>Položka</TableHead>
                    <TableHead>Množství</TableHead>
                    <TableHead>Cena</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderitems.map((item) => (
                    <TableRow key={item.slug}>
                      <TableCell>
                        <Link
                          href={`/produkt/${item.slug}`}
                          className="flex items-center"
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                          />
                          <span className="px-2">{item.name}</span>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <span className="px-2">{item.qty}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        {item.price} Kč
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div className="mt-2 md:mt-0 w-full md:w-auto space-y-4">
          <Card className="w-full md:w-auto">
            <CardContent className="p-4 gap-4 space-y-4 text-sm md:text-base">
              <div className="flex justify-between">
                <div>Položky</div>
                <div>{formatCurrency(itemsPrice)}</div>
              </div>
              <div className="flex justify-between">
                <div>DPH</div>
                <div>{formatCurrency(taxPrice)}</div>
              </div>
              <div className="flex justify-between">
                <div>Doprava</div>
                <div>{formatCurrency(shippingPrice)}</div>
              </div>
              <Separator />
              <div className="flex justify-between">
                <div>Celkem</div>
                <div className="font-semibold">
                  {formatCurrency(totalPrice)}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="w-full md:w-auto" id="payment-section">
            <CardContent className="p-4 gap-4 space-y-4 text-sm md:text-base">
              {/* PayPal Payment */}
              {!isPaid && paymentMethod === "Paypal" && (
                <div>
                  <PayPalScriptProvider
                    options={{
                      clientId: paypalClientId,
                    }}
                  >
                    <PrintLoadingState />
                    <PayPalButtons
                      createOrder={handleCreatePayPalOrder}
                      onApprove={handleApprovePayPalOrder}
                    />
                  </PayPalScriptProvider>
                </div>
              )}
              {/* Stripe Payment */}
              {!isPaid && paymentMethod === "Stripe" && stripeClientSecret && (
                <StripePayment
                  priceInCents={Number(order.totalPrice) * 100}
                  orderId={order.id}
                  clientSecret={stripeClientSecret}
                  userEmail={userEmail}
                />
              )}
              {/* Cash On Delivery Payment */}
              {isAdmin && !isPaid && paymentMethod === "Hotovost" && (
                <MarkAsPaidButton />
              )}
              {isAdmin && isPaid && !isDelivered && <MarkAsDeliveredButton />}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

export default OrderDetailsTable
