import Link from "next/link"
import { auth } from "@/auth"
import { signOutUser } from "@/lib/actions/user.actions"
import { Button } from "@/components/ui/button"
import { UserIcon } from "lucide-react"
import { getAllCategories } from "@/lib/actions/product.actions"
import Search from "@/components/shared/header/search"
import { SheetClose } from "@/components/ui/sheet"

const UserButtonMobile = async () => {
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

  return (
    <div className="flex lg:hidden flex-col w-full">
      <div className="py-4 w-full">
        <Search />
      </div>
      <div className="filter-links bg-gray-100 rounded-lg p-4">
        <span className="py-6 h-6 flex items-center">Kategorie</span>
        <SheetClose asChild>
          <Link
            href={`/hledat`}
            className="w-full py-6 h-6 flex items-center capitalize underline"
          >
            vše
          </Link>
        </SheetClose>
        {categories.map((x) => (
          <SheetClose asChild key={x.category}>
            <Link
              href={`/hledat?category=${x.category}`}
              className="w-full py-6 h-6 flex items-center capitalize underline"
            >
              {x.category}
            </Link>
          </SheetClose>
        ))}
      </div>
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
  )
}

export default UserButtonMobile
