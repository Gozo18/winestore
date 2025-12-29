import Link from "next/link"
import Image from "next/image"
import { APP_NAME } from "@/lib/constants"
import Menu from "./menu"
import Search from "./search"

const Header = () => {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex-between">
        <div className="flex-start">
          <Link href="/" className="flex-start">
            <Image
              src="/images/logo_only.png"
              alt={`${APP_NAME} logo`}
              width={30}
              height={30}
              priority={true}
            />
            <span className="font-bold font-cairo text-xl ml-3">
              {APP_NAME}
            </span>
          </Link>
        </div>
        <div className="hidden lg:block">
          <Search />
        </div>
        <Menu />
      </div>
    </header>
  )
}

export default Header
