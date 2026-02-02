"use client"

import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useTransition } from "react"
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions"
import { ArrowRight, Loader, Minus, Plus, ShoppingCart } from "lucide-react"
import { Cart } from "@/types"
import Link from "next/link"
import Image from "next/image"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

const CartTable = ({ cart }: { cart?: Cart }) => {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()

  return (
    <>
      <h1 className="py-4 h2-bold text-center">Nákupní košík</h1>
      {!cart || cart.items.length === 0 ? (
        <div className="flex flex-col items-center gap-6">
          <ShoppingCart className="mt-6 w-10 h-10" />
          Košík je prázdný.{" "}
          <Link href="/hledat" className="underline">
            Pokračovat v nákupu.
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-4">
          <div className="overflow-x-auto lg:col-span-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produkt</TableHead>
                  <TableHead className="text-center">Množství</TableHead>
                  <TableHead className="text-right">Cena</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.items.map((item) => (
                  <TableRow key={item.slug}>
                    <TableCell className="p-1 md:p-4">
                      <Link
                        href={`/produkt/${item.slug}`}
                        className="flex items-center"
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={50}
                          height={50}
                          className="hidden md:block"
                        />
                        <span className="md:px-2 text-xs md:text-base">
                          {item.name}
                        </span>
                      </Link>
                    </TableCell>
                    <TableCell className="flex-center gap-1 md:gap-2 text-xs md:text-base items-center justify-center p-1 md:p-4">
                      <Button
                        disabled={isPending}
                        variant="outline"
                        type="button"
                        onClick={() =>
                          startTransition(async () => {
                            const res = await removeItemFromCart(item.productId)
                            if (!res.success) {
                              toast({
                                description: res.message,
                                variant: "destructive",
                              })
                            }
                          })
                        }
                        size="sm"
                      >
                        {isPending ? (
                          <Loader className="w-2 md:w-4 h-2 md:h-4 animate-spin" />
                        ) : (
                          <Minus className="w-2 md:w-4 h-2 md:h-4" />
                        )}
                      </Button>
                      <span>{item.qty}</span>
                      <Button
                        disabled={isPending}
                        variant="outline"
                        type="button"
                        onClick={() =>
                          startTransition(async () => {
                            const res = await addItemToCart(item)
                            if (!res.success) {
                              toast({
                                description: res.message,
                                variant: "destructive",
                              })
                            }
                          })
                        }
                        size="sm"
                      >
                        {isPending ? (
                          <Loader className="w-2 md:w-4 h-2 md:h-4 animate-spin" />
                        ) : (
                          <Plus className="w-2 md:w-4 h-2 md:h-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="text-right text-xs md:text-base p-1 md:p-4">
                      {item.price} Kč
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Card className="mt-8 lg:mt-0">
            <CardContent className="p-4 gap-4 space-y-4 text-sm">
              <p className="flex justify-between">
                <span>Počet kusů:</span>{" "}
                <span>{cart.items.reduce((a, b) => a + b.qty, 0)}</span>
              </p>
              <p className="flex justify-between">
                <span>Cena s DPH:</span>{" "}
                <span>{formatCurrency(cart.itemsPrice)}</span>
              </p>
              <p className="flex justify-between">
                <span>Cena bez DPH:</span>{" "}
                <span>{formatCurrency(cart.taxPrice)}</span>
              </p>
              <p className="flex justify-between">
                <span>Doprava:</span>{" "}
                <span>{formatCurrency(cart.shippingPrice)}</span>
              </p>
              <p>Při objednávce nad 2500 Kč je doprava zdarma.</p>
              <Separator />
              <p className="flex justify-between">
                <span className="flex items-end">Celková cena:</span>{" "}
                <span className="flex items-end font-medium">
                  {formatCurrency(cart.totalPrice)}
                </span>
              </p>
              <Button
                className="w-full"
                disabled={isPending}
                onClick={() =>
                  startTransition(() => router.push("/dodaci-adresa"))
                }
              >
                {isPending ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}{" "}
                Pokračovat k objednávce
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}

export default CartTable
