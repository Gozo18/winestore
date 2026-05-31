import { getMyCart } from "@/lib/actions/cart.actions"
import { getCurrentUser } from "@/lib/current-user"
import { ShippingAddress } from "@/types"
import { Metadata } from "next"
import { redirect } from "next/navigation"
import CheckoutSteps from "@/components/shared/checkout-steps"
import { Card, CardContent } from "@/components/ui/card"
import { COD_SURCHARGE } from "@/lib/constants"
import { calcOrderTotals } from "@/lib/pricing"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Image from "next/image"
import { formatCurrency } from "@/lib/utils"
import PlaceOrderForm from "./place-order-form"
import { Separator } from "@/components/ui/separator"
import ShippingNotice from "@/components/shared/shipping-notice"

export const metadata: Metadata = {
  title: "Odeslat objednávku",
}

const PlaceOrderPage = async () => {
  const cart = await getMyCart()
  const user = await getCurrentUser()
  if (!user) redirect("/dodaci-adresa")

  if (!cart || cart.items.length === 0) redirect("/kosik")
  if (!user.address) redirect("/dodaci-adresa")
  if (!user.paymentMethod) redirect("/platebni-metody")
  if (!user.deliveryMethod) redirect("/platebni-metody")

  const userAddress = user.address as ShippingAddress

  const {
    codFee,
    shippingPrice: displayShippingPrice,
    totalPrice: displayTotalPrice,
  } = calcOrderTotals({
    itemsPrice: cart.itemsPrice,
    deliveryMethod: user.deliveryMethod,
    paymentMethod: user.paymentMethod,
  })

  return (
    <>
      <CheckoutSteps current={3} />
      <h1 className="py-4 text-2xl">Odeslat objednávku</h1>
      <div className="grid md:grid-cols-3 md:gap-5">
        <div className="md:col-span-2 overflow-x-auto space-y-4">
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Dodací adresa</h2>
              <p>{userAddress.fullName}</p>
              <p>
                {userAddress.streetAddress}, {userAddress.city}{" "}
                {userAddress.postalCode}, {userAddress.country}{" "}
              </p>
              <div className="mt-3">
                <Link href="/dodaci-adresa">
                  <Button variant="outline">Upravit</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Doprava</h2>
              <p>{user.deliveryMethod}</p>
              <div className="mt-3">
                <Link href="/platebni-metody">
                  <Button variant="outline">Upravit</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Platba</h2>
              <p>{user.paymentMethod}</p>
              <div className="mt-3">
                <Link href="/platebni-metody">
                  <Button variant="outline">Upravit</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Objednané položky</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Položka</TableHead>
                    <TableHead>Množství</TableHead>
                    <TableHead>Cena</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cart.items.map((item) => (
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
        <div>
          <Card>
            <CardContent className="p-4 gap-4 space-y-4">
              <div className="flex justify-between">
                <div>Cena s DPH</div>
                <div>{formatCurrency(cart.itemsPrice)}</div>
              </div>
              <div className="flex justify-between">
                <div>Cena bez DPH</div>
                <div>{formatCurrency(cart.taxPrice)}</div>
              </div>
              <div className="flex justify-between">
                <div>
                  Doprava &nbsp;
                  {codFee > 0 && (
                    <span className="text-black/50 text-sm">
                      (včetně dobírky {COD_SURCHARGE} Kč)
                    </span>
                  )}
                </div>
                <div>{formatCurrency(displayShippingPrice)}</div>
              </div>
              <Separator />
              <div className="flex justify-between">
                <div>Celkem</div>
                <div>{formatCurrency(displayTotalPrice)}</div>
              </div>
              <PlaceOrderForm />
            </CardContent>
          </Card>

          <div className="mt-4">
            <ShippingNotice />
          </div>
        </div>
      </div>
    </>
  )
}

export default PlaceOrderPage
