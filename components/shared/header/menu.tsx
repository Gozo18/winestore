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
                className="flex justify-center items-center h-5 min-w-5 rounded-full px-[5px] font-mono tabular-nums"
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
        <div className="fixed bottom-0 left-0 flex items-stretch w-full h-16 bg-black text-white z-10 border-t border-white/10">
          <Button
            asChild
            variant="ghost"
            className="flex-1 flex flex-col gap-0.5 h-full rounded-none font-normal text-white/80 hover:text-white hover:bg-white/10"
          >
            <Link href="/">
              <House className="h-5 w-5 shrink-0" />
              <span className="text-[11px]">domů</span>
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="flex-1 flex flex-col gap-0.5 h-full rounded-none font-normal text-white/80 hover:text-white hover:bg-white/10"
          >
            <Link href="/hledat">
              <Grape className="h-5 w-5 shrink-0" />
              <span className="text-[11px]">naše vína</span>
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="flex-1 flex flex-col gap-0.5 h-full rounded-none font-normal text-white/80 hover:text-white hover:bg-white/10"
          >
            <Link href="/kosik">
              <div className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cart?.items && cart.items.length > 0 && (
                  <Badge
                    className="absolute -top-2 -right-2.5 flex justify-center items-center h-4 min-w-4 rounded-full px-[3px] font-mono tabular-nums text-[10px]"
                    variant="destructive"
                  >
                    {totalItemsInCart}
                  </Badge>
                )}
              </div>
              <span className="text-[11px]">košík</span>
            </Link>
          </Button>
          {!session ? (
            <Button
              asChild
              variant="ghost"
              className="flex-1 flex flex-col gap-0.5 h-full rounded-none font-normal text-white/80 hover:text-white hover:bg-white/10"
            >
              <Link href="/prihlaseni">
                <UserIcon className="h-5 w-5 shrink-0" />
                <span className="text-[11px]">přihlásit</span>
              </Link>
            </Button>
          ) : (
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex-1 flex flex-col gap-0.5 h-full rounded-none font-normal text-white/80 hover:text-white hover:bg-white/10"
                  aria-label="Uživatelské menu"
                >
                  <CircleUser className="h-5 w-5 shrink-0" />
                  <span className="text-[11px]">menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent className="flex flex-col items-start">
                <SheetTitle>Menu</SheetTitle>
                <UserButtonMobile />
                <SheetDescription></SheetDescription>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </nav>
    </div>
  )
}

export default Menu
