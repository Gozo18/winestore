import { Button } from "@/components/ui/button"
import ModeToggle from "./mode-toggle"
import Link from "next/link"
import { EllipsisVertical, ShoppingCart } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import UserButton from "./user-button"
import { getAllCategories } from "@/lib/actions/product.actions"
import { getMyCart } from "@/lib/actions/cart.actions"
import { Badge } from "@/components/ui/badge"

const Menu = async () => {
  const categories = await getAllCategories()
  const cart = await getMyCart()

  const totalItemsInCart =
    cart?.items.reduce((sum, item) => sum + item.qty, 0) ?? 0

  return (
    <div className="flex justify-end gap-3">
      <nav className="hidden lg:flex w-full gap-1">
        <div className="flex">
          <Button asChild variant="ghost">
            <Link href={`/hledat`}>vše</Link>
          </Button>
          {categories.map((x) => (
            <Button asChild variant="ghost" key={x.category}>
              <Link href={`/hledat?category=${x.category}`}>{x.category}</Link>
            </Button>
          ))}
        </div>
        <ModeToggle />
        <Button asChild variant="ghost">
          <Link href="/kosik">
            <ShoppingCart /> Košík
            {cart?.items && cart.items.length > 0 && (
              <Badge
                className="h-5 min-w-5 rounded-full px-[5px] font-mono tabular-nums"
                variant="destructive"
              >
                {totalItemsInCart}
              </Badge>
            )}
          </Link>
        </Button>
        <UserButton />
      </nav>
      <nav className="lg:hidden">
        <ModeToggle />
        <Button asChild variant="ghost" className="px-0 py-4 ml-4">
          <Link href="/kosik">
            <ShoppingCart /> Košík
            {cart?.items && cart.items.length > 0 && (
              <Badge
                className="h-5 min-w-5 rounded-full px-[5px] font-mono tabular-nums"
                variant="destructive"
              >
                {totalItemsInCart}
              </Badge>
            )}
          </Link>
        </Button>
        <Sheet>
          <SheetTrigger className="align-middle ml-4 mb-2">
            <EllipsisVertical />
          </SheetTrigger>
          <SheetContent className="flex flex-col items-start">
            <SheetTitle>Menu</SheetTitle>
            <UserButton />
            <SheetDescription></SheetDescription>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  )
}

export default Menu
