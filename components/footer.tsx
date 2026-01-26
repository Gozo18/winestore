import Link from "next/link"
import Image from "next/image"
import { APP_NAME } from "@/lib/constants"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t">
      <div className="mb-16 md:mb-8 p-5 flex-center">
        <Link href="/" className="flex-start">
          <Image
            src="/images/logo_only.png"
            alt={`${APP_NAME} logo`}
            width={30}
            height={30}
            priority={true}
          />
          <span className="font-bold font-cairo text-xl mx-3">{APP_NAME}</span>
        </Link>
        &copy; {currentYear}
      </div>
    </footer>
  )
}

export default Footer
