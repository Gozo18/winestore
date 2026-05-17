"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Cookie } from "lucide-react"

const STORAGE_KEY = "cookie_consent"
const OPEN_SETTINGS_EVENT = "open-cookie-settings"
export const CONSENT_CHANGED_EVENT = "cookie-consent-changed"

export type ConsentState = {
  necessary: true
  analytical: boolean
  marketing: boolean
  timestamp: string
}

export function getCookieConsent(): ConsentState | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as ConsentState
  } catch {
    return null
  }
}

const acceptAllState = (): ConsentState => ({
  necessary: true,
  analytical: true,
  marketing: true,
  timestamp: new Date().toISOString(),
})

const rejectAllState = (): ConsentState => ({
  necessary: true,
  analytical: false,
  marketing: false,
  timestamp: new Date().toISOString(),
})

export function openCookieSettings() {
  window.dispatchEvent(new CustomEvent(OPEN_SETTINGS_EVENT))
}

const CookieConsent = () => {
  const [bannerOpen, setBannerOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [analytical, setAnalytical] = useState(false)
  const [marketing, setMarketing] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      setBannerOpen(true)
      return
    }
    try {
      const parsed: ConsentState = JSON.parse(stored)
      setAnalytical(parsed.analytical)
      setMarketing(parsed.marketing)
    } catch {
      setBannerOpen(true)
    }
  }, [])

  useEffect(() => {
    const handler = () => {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        try {
          const parsed: ConsentState = JSON.parse(stored)
          setAnalytical(parsed.analytical)
          setMarketing(parsed.marketing)
        } catch {
          /* ignore */
        }
      }
      setBannerOpen(false)
      setSettingsOpen(true)
    }
    window.addEventListener(OPEN_SETTINGS_EVENT, handler)
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, handler)
  }, [])

  const persist = useCallback((state: ConsentState) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    window.dispatchEvent(
      new CustomEvent(CONSENT_CHANGED_EVENT, { detail: state })
    )
  }, [])

  const handleAcceptAll = () => {
    persist(acceptAllState())
    setAnalytical(true)
    setMarketing(true)
    setBannerOpen(false)
    setSettingsOpen(false)
  }

  const handleRejectAll = () => {
    persist(rejectAllState())
    setAnalytical(false)
    setMarketing(false)
    setBannerOpen(false)
    setSettingsOpen(false)
  }

  const handleSaveSelection = () => {
    persist({
      necessary: true,
      analytical,
      marketing,
      timestamp: new Date().toISOString(),
    })
    setBannerOpen(false)
    setSettingsOpen(false)
  }

  const openSettings = () => {
    setBannerOpen(false)
    setSettingsOpen(true)
  }

  return (
    <>
      {bannerOpen && (
        <div
          role="dialog"
          aria-label="Souhlas s použitím cookies"
          className="fixed inset-x-0 bottom-0 z-50 border-t bg-background shadow-lg"
        >
          <div className="max-w-6xl mx-auto p-4 md:p-5 flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
            <div className="flex items-start gap-3 flex-1">
              <Cookie className="h-5 w-5 mt-0.5 shrink-0 text-primary" />
              <div className="text-sm">
                <p className="font-semibold mb-1">Používáme cookies</p>
                <p className="text-muted-foreground">
                  Tento web používá cookies k zajištění základní funkčnosti a –
                  s vaším souhlasem – k analýze návštěvnosti a personalizaci
                  reklamy. Více informací najdete v{" "}
                  <a
                    href="/obchodni-podminky"
                    className="underline hover:text-foreground"
                  >
                    obchodních podmínkách
                  </a>
                  .
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:items-center shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={openSettings}
                className="sm:order-1"
              >
                Nastavení
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRejectAll}
                className="sm:order-2"
              >
                Odmítnout vše
              </Button>
              <Button
                size="sm"
                onClick={handleAcceptAll}
                className="sm:order-3"
              >
                Přijmout vše
              </Button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Nastavení cookies</DialogTitle>
            <DialogDescription>
              Zde můžete povolit nebo zakázat jednotlivé kategorie cookies.
              Nezbytné cookies jsou potřebné k základní funkčnosti webu a nelze
              je vypnout.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="flex items-start gap-3">
              <Checkbox checked disabled id="cookies-necessary" />
              <div className="flex-1">
                <label
                  htmlFor="cookies-necessary"
                  className="font-medium text-sm cursor-not-allowed"
                >
                  Nezbytné cookies
                </label>
                <p className="text-xs text-muted-foreground mt-1">
                  Zajišťují základní funkčnost webu – přihlášení, košík,
                  zabezpečení. Bez nich web nemůže fungovat správně.
                </p>
              </div>
            </div>

            <Separator />

            <div className="flex items-start gap-3">
              <Checkbox
                id="cookies-analytical"
                checked={analytical}
                onCheckedChange={(v) => setAnalytical(v === true)}
              />
              <div className="flex-1">
                <label
                  htmlFor="cookies-analytical"
                  className="font-medium text-sm cursor-pointer"
                >
                  Analytické cookies
                </label>
                <p className="text-xs text-muted-foreground mt-1">
                  Pomáhají nám pochopit, jak návštěvníci web používají, abychom
                  ho mohli zlepšovat (např. Google Analytics).
                </p>
              </div>
            </div>

            <Separator />

            <div className="flex items-start gap-3">
              <Checkbox
                id="cookies-marketing"
                checked={marketing}
                onCheckedChange={(v) => setMarketing(v === true)}
              />
              <div className="flex-1">
                <label
                  htmlFor="cookies-marketing"
                  className="font-medium text-sm cursor-pointer"
                >
                  Marketingové cookies
                </label>
                <p className="text-xs text-muted-foreground mt-1">
                  Slouží k personalizaci reklam a měření jejich účinnosti
                  na partnerských platformách.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" onClick={handleRejectAll}>
              Odmítnout vše
            </Button>
            <Button variant="outline" onClick={handleSaveSelection}>
              Uložit výběr
            </Button>
            <Button onClick={handleAcceptAll}>Přijmout vše</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default CookieConsent
