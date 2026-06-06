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
  updateOrderToPaidCOD,
  deliverOrder,
} from "@/lib/actions/order.actions"
import StripePayment from "./stripe-payment"
import { Separator } from "@/components/ui/separator"
import {
  BANK_ACCOUNT,
  getQrPaymentUrl,
  getVariableSymbol,
} from "@/lib/bank-transfer"

const OrderDetailsTable = ({
  order,
  isAdmin,
  stripeClientSecret,
  userEmail,
  viewerToken,
}: {
  order: Omit<Order, "paymentResult">
  isAdmin: boolean
  stripeClientSecret: string | null
  userEmail: string
  viewerToken?: string
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
    deliveryMethod,
    isDelivered,
    isPaid,
    paidAt,
    deliveredAt,
    createdAt,
    user,
    guestEmail,
  } = order

  const contactEmail = user?.email || guestEmail || ""
  const isBankTransfer = paymentMethod === "Převod"
  const variableSymbol = getVariableSymbol(id)
  const qrPaymentUrl =
    isBankTransfer && !isPaid
      ? getQrPaymentUrl({ amount: totalPrice, variableSymbol })
      : ""

  const { toast } = useToast()

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
                  : paymentMethod === "Převod"
                    ? "Platba převodem"
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
              {contactEmail && (
                <p className="mb-1 text-sm md:text-base">
                  <span className="text-muted-foreground">E-mail: </span>
                  {contactEmail}
                </p>
              )}
              {shippingAddress.phone && (
                <p className="mb-2 text-sm md:text-base">
                  <span className="text-muted-foreground">Telefon: </span>
                  {shippingAddress.phone}
                </p>
              )}
              {deliveryMethod && (
                <p className="mb-2 text-sm md:text-base">
                  <span className="text-muted-foreground">Doprava: </span>
                  {deliveryMethod}
                </p>
              )}
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
          {!isPaid && paymentMethod === "Stripe" && (
            <Card className="w-full md:w-auto" id="payment-section">
              <CardContent className="p-4 gap-4 space-y-4 text-sm md:text-base">
                {stripeClientSecret && (
                  <StripePayment
                    priceInCents={Number(order.totalPrice) * 100}
                    orderId={order.id}
                    clientSecret={stripeClientSecret}
                    userEmail={userEmail}
                    accessToken={viewerToken}
                  />
                )}
              </CardContent>
            </Card>
          )}

          {/* Platební instrukce pro bankovní převod */}
          {!isPaid && isBankTransfer && (
            <Card
              className="w-full md:w-auto bg-amber-50 dark:bg-amber-950/30"
              id="payment-section"
            >
              <CardContent className="p-4 gap-3 space-y-3 text-sm md:text-base">
                <h2 className="text-lg md:text-xl font-semibold">
                  Platební instrukce
                </h2>
                <p className="text-sm text-muted-foreground">
                  Uhraďte objednávku převodem na náš účet. Po připsání platby
                  ji začneme připravovat.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between gap-3">
                    <span className="text-muted-foreground">Číslo účtu</span>
                    <span className="font-semibold">{BANK_ACCOUNT}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-muted-foreground">
                      Variabilní symbol
                    </span>
                    <span className="font-semibold">{variableSymbol}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-muted-foreground">Částka</span>
                    <span className="font-semibold">
                      {formatCurrency(totalPrice)}
                    </span>
                  </div>
                </div>
                <Separator />
                <div className="flex flex-col items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrPaymentUrl}
                    alt="QR platba"
                    width={200}
                    height={200}
                    className="rounded-md bg-white p-2"
                  />
                  <p className="text-xs text-muted-foreground text-center">
                    Naskenujte QR kód v mobilním bankovnictví pro rychlou
                    platbu.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Manuální platby (dobírka, převod) – admin označuje stav ručně */}
          {isAdmin &&
            (paymentMethod === "Hotovost" || paymentMethod === "Převod") &&
            (!isPaid || !isDelivered) && (
              <Card className="w-full md:w-auto">
                <CardContent className="p-4 flex flex-wrap gap-3 text-sm md:text-base">
                  {!isPaid && <MarkAsPaidButton />}
                  {!isDelivered && <MarkAsDeliveredButton />}
                </CardContent>
              </Card>
            )}
          {/* Delivery button for online-paid orders (Stripe) */}
          {isAdmin &&
            isPaid &&
            !isDelivered &&
            paymentMethod !== "Hotovost" &&
            paymentMethod !== "Převod" && (
              <Card className="w-full md:w-auto">
                <CardContent className="p-4 gap-4 space-y-4 text-sm md:text-base">
                  <MarkAsDeliveredButton />
                </CardContent>
              </Card>
            )}
        </div>
      </div>
    </>
  )
}

export default OrderDetailsTable
