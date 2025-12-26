import Link from "next/link"
import { auth } from "@/auth"
import { signOutUser } from "@/lib/actions/user.actions"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserIcon } from "lucide-react"
import { getAllCategories } from "@/lib/actions/product.actions"
import Search from "@/components/shared/header/search"

const UserButton = async () => {
  const session = await auth()
  const categories = await getAllCategories()

  if (!session) {
    return (
      <Button asChild>
        <Link href="/prihlaseni">
          <UserIcon /> Přihlásit
        </Link>
      </Button>
    )
  }

  const firstInitial = session.user?.name?.charAt(0).toUpperCase() ?? "U"

  return (
    <>
      <div className="hidden lg:flex md:gap-2 md:items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center">
              <Button
                variant="ghost"
                className="relative w-8 h-8 rounded-full ml-2 flex items-center justify-center bg-gray-200"
              >
                {firstInitial}
              </Button>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <div className="text-sm font-medium leading-none">
                  {session.user?.name}
                </div>
                <div className="text-sm text-muted-foreground leading-none">
                  {session.user?.email}
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuItem className="p-0 mb-1">
              <Link
                href="/uzivatel/profil"
                className="flex items-center w-full py-4 px-2 h-4"
              >
                Můj profil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-0 mb-1">
              <Link
                href="/uzivatel/objednavky"
                className="flex items-center w-full py-4 px-2 h-4"
              >
                Moje objednávky
              </Link>
            </DropdownMenuItem>

            {session?.user?.role === "admin" && (
              <DropdownMenuItem>
                <Link href="/admin/prehled" className="w-full">
                  Administrace
                </Link>
              </DropdownMenuItem>
            )}

            <DropdownMenuItem className="p-0 mb-1">
              <form action={signOutUser} className="w-full">
                <Button
                  className="w-full py-4 px-2 h-4 justify-start"
                  variant="ghost"
                >
                  Odhlásit
                </Button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex lg:hidden flex-col w-full">
        <div className="py-4">
          <Search />
        </div>
        <Link
          href={`/hledat`}
          className="w-full py-6 h-6 flex items-center capitalize"
        >
          vše
        </Link>
        {categories.map((x) => (
          <Link
            href={`/hledat?category=${x.category}`}
            key={x.category}
            className="w-full py-6 h-6 flex items-center capitalize"
          >
            {x.category}
          </Link>
        ))}
        <Link
          href="/uzivatel/profil"
          className="w-full py-6 h-6 flex items-center"
        >
          Můj profil
        </Link>
        <Link
          href="/uzivatel/objednavky"
          className="w-full py-6 h-6 flex items-center"
        >
          Moje objednávky
        </Link>
        {session?.user?.role === "admin" && (
          <Link
            href="/admin/prehled"
            className="w-full mb-4 py-6 h-6 flex items-center"
          >
            Administrace
          </Link>
        )}
        <form action={signOutUser} className="w-full">
          <Button className="w-full">Odhlásit</Button>
        </form>
      </div>
    </>
  )
}

export default UserButton
