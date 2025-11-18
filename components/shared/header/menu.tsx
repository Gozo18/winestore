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

const Menu = async () => {
  const categories = await getAllCategories()

  return (
    <div className="flex justify-end gap-3">
      <nav className="hidden md:flex w-full max-w-xs gap-1">
        <div className="flex">
          {categories.map((x) => (
            <Button
              asChild
              variant="ghost"
              key={x.category}
              className="capitalize"
            >
              <Link href={`/search?category=${x}`}>{x.category}</Link>
            </Button>
          ))}
        </div>
        <ModeToggle />
        <Button asChild variant="ghost">
          <Link href="/kosik">
            <ShoppingCart /> Košík
          </Link>
        </Button>
        <UserButton />
      </nav>
      <nav className="md:hidden">
        <Sheet>
          <SheetTrigger className="align-middle">
            <EllipsisVertical />
          </SheetTrigger>
          <SheetContent className="flex flex-col items-start">
            <SheetTitle>Menu</SheetTitle>
            <ModeToggle />
            <Button asChild variant="ghost">
              <Link href="/kosik">
                <ShoppingCart /> Košík
              </Link>
            </Button>
            <UserButton />
            <SheetDescription></SheetDescription>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  )
}

export default Menu
