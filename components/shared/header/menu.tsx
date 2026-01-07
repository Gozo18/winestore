import { Button } from "@/components/ui/button"
import { auth } from "@/auth"
import Link from "next/link"
import { ShoppingCart, House, UserIcon, CircleUser, Grape } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import UserButton from "./user-button"
import { getMyCart } from "@/lib/actions/cart.actions"
import { Badge } from "@/components/ui/badge"
import UserButtonMobile from "./user-button-mobile"

const Menu = async () => {
  const session = await auth()
  const cart = await getMyCart()

  const totalItemsInCart =
    cart?.items.reduce((sum, item) => sum + item.qty, 0) ?? 0

  return (
    <div className="flex justify-end gap-3">
      <nav className="hidden lg:flex w-full gap-1">
        <div className="flex">
          <Button asChild variant="ghost">
            <Link href={`/hledat`} className="font-normal">
              <Grape /> naše vína
            </Link>
          </Button>
        </div>
        <Button asChild variant="ghost">
          <Link href="/kosik" className="font-normal">
            <ShoppingCart /> košík
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
        <div className="fixed bottom-0 right-0 flex items-center justify-between w-full h-16 px-3 bg-black text-white z-10">
          <div>
            <Button asChild variant="ghost">
              <Link href={`/`} className="font-normal">
                <House />
                domů
              </Link>
            </Button>
          </div>
          <div className="flex">
            <Button asChild variant="ghost">
              <Link href={`/hledat`} className="font-normal">
                <Grape /> naše vína
              </Link>
            </Button>
            <Button asChild variant="ghost" className="ml-2">
              <Link href="/kosik" className="font-normal">
                <ShoppingCart /> košík
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
          </div>
        </div>
        {!session ? (
          <Button asChild>
            <Link href="/prihlaseni">
              <UserIcon /> Přihlásit
            </Link>
          </Button>
        ) : (
          <Sheet>
            <SheetTrigger className="align-middle" asChild>
              <Button aria-label="Uživatelské menu" size="sm">
                <CircleUser /> menu
              </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col items-start">
              <SheetTitle>Menu</SheetTitle>
              <UserButtonMobile />
              <SheetDescription></SheetDescription>
            </SheetContent>
          </Sheet>
        )}
      </nav>
    </div>
  )
}

export default Menu
