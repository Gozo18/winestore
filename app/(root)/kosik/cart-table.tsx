"use client"

import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useTransition } from "react"
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions"
import { ArrowRight, Loader, Minus, Plus } from "lucide-react"
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

const CartTable = ({ cart }: { cart?: Cart }) => {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()

  return (
    <>
      <h1 className="py-4 h2-bold">Nákupní košík</h1>
      {!cart || cart.items.length === 0 ? (
        <div>
          Košík je prázdný. <Link href="/">Pokračovat v nákupu</Link>
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
            <CardContent className="p-4 gap-4">
              <div className="pb-3 lg:text-xl">
                Celkem ({cart.items.reduce((a, b) => a + b.qty, 0)} ks):{" "}
                <span className="font-bold">
                  {formatCurrency(cart.itemsPrice)}
                </span>
              </div>
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
