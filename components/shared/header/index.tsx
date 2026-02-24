import Link from "next/link"
import Image from "next/image"
import { APP_NAME } from "@/lib/constants"
import Menu from "./menu"
import Search from "./search"
import { getAllProductSlugs } from "@/lib/actions/product.actions"

const Header = async () => {
  const products = await getAllProductSlugs()

  return (
    <header className="w-full border-b">
      <div className="wrapper flex-between !px-2.5 sm:!px-5">
        <div className="flex-start">
          <Link href="/" className="flex-start">
            <Image
              src="/images/logo_only.png"
              alt={`${APP_NAME} logo`}
              width={30}
              height={30}
              priority={true}
            />
            <span className="hidden lg:block font-bold font-cairo text-xl ml-3">
              {APP_NAME}
            </span>
          </Link>
        </div>
        <Search products={products} />
        <Menu />
      </div>
    </header>
  )
}

export default Header
