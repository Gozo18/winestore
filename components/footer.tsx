import Link from "next/link"
import Image from "next/image"
import { APP_NAME } from "@/lib/constants"
import CookieSettingsLink from "@/components/cookie-settings-link"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t">
      <div className="mb-16 md:mb-8 p-5 flex flex-col items-center gap-2">
        <div className="flex-center">
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
        <div className="text-sm text-muted-foreground flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <Link href="/kontakt" className="hover:underline hover:text-foreground transition-colors">
            Kontakt
          </Link>
          <Link href="/obchodni-podminky" className="hover:underline hover:text-foreground transition-colors">
            Obchodní podmínky
          </Link>
          <CookieSettingsLink />
        </div>
      </div>
    </footer>
  )
}

export default Footer
