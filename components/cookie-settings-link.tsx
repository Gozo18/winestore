"use client"

import { openCookieSettings } from "@/components/cookie-consent"

const CookieSettingsLink = () => {
  return (
    <button
      type="button"
      onClick={openCookieSettings}
      className="hover:underline hover:text-foreground transition-colors cursor-pointer"
    >
      Nastavení cookies
    </button>
  )
}

export default CookieSettingsLink
