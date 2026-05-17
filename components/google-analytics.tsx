"use client"

import { useEffect, useState, Suspense } from "react"
import Script from "next/script"
import { usePathname, useSearchParams } from "next/navigation"
import { GA_MEASUREMENT_ID } from "@/lib/constants"
import {
  CONSENT_CHANGED_EVENT,
  getCookieConsent,
  type ConsentState,
} from "@/components/cookie-consent"

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
    dataLayer: unknown[]
    [key: `ga-disable-${string}`]: boolean
  }
}

function PageViewTracker({ enabled }: { enabled: boolean }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!enabled || typeof window.gtag !== "function") return
    const query = searchParams.toString()
    const url = pathname + (query ? `?${query}` : "")
    window.gtag("event", "page_view", {
      page_path: url,
      page_location: window.location.href,
      page_title: document.title,
    })
  }, [pathname, searchParams, enabled])

  return null
}

const GoogleAnalytics = () => {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const apply = (consent: ConsentState | null) => {
      const analytical = consent?.analytical === true
      setEnabled(analytical)
      window[`ga-disable-${GA_MEASUREMENT_ID}`] = !analytical
    }

    apply(getCookieConsent())

    const handler = (e: Event) => {
      const detail = (e as CustomEvent<ConsentState>).detail
      apply(detail ?? getCookieConsent())
    }

    window.addEventListener(CONSENT_CHANGED_EVENT, handler)
    return () => window.removeEventListener(CONSENT_CHANGED_EVENT, handler)
  }, [])

  if (!GA_MEASUREMENT_ID) return null

  return (
    <>
      {enabled && (
        <>
          <Script
            id="ga-script"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}', { anonymize_ip: true });
            `}
          </Script>
        </>
      )}
      <Suspense fallback={null}>
        <PageViewTracker enabled={enabled} />
      </Suspense>
    </>
  )
}

export default GoogleAnalytics
