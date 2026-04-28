"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"

const STORAGE_KEY = "age_verified"

export default function AgeVerificationModal() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const verified = sessionStorage.getItem(STORAGE_KEY)
    if (!verified) setOpen(true)
  }, [])

  const handleConfirm = () => {
    sessionStorage.setItem(STORAGE_KEY, "true")
    setOpen(false)
  }

  const handleDeny = () => {
    history.back()
  }

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-md text-center bg-white border border-black/20 shadow-2xl [&>button]:hidden">
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/40 to-transparent rounded-t-lg" />

        <DialogHeader className="items-center gap-2">
          {/* Decorative */}
          <p className="text-black/20 text-xs tracking-[0.4em] select-none">
            ❧ ✦ ❧ ✦ ❧
          </p>

          <Image
            src="/images/logo_only.png"
            alt="logo"
            width={80}
            height={80}
            className="mx-auto mb-6"
          />

          <DialogTitle className="font-serif text-2xl font-normal text-black tracking-wide">
            Vítejte ve víno Iris
          </DialogTitle>

          <DialogDescription className="text-black/50 text-sm tracking-wide">
            Tento web obsahuje alkoholické nápoje.
          </DialogDescription>
        </DialogHeader>

        <Separator className="bg-black/10 my-1" />

        {/* Age box */}
        <div className="border border-black/15 bg-black/5 rounded-sm px-6 py-5 my-2">
          <span className="block font-serif text-4xl text-black leading-none mb-2">
            18+
          </span>
          <p className="text-black/60 text-sm tracking-wide">
            Je vám 18 let nebo více?
          </p>
        </div>

        <DialogFooter className="flex-col gap-3 sm:flex-col">
          <Button
            onClick={handleConfirm}
            className="w-full bg-black hover:bg-black/90
              text-white border uppercase text-sm"
          >
            Ano, je mi 18+
          </Button>
          <Button
            variant="ghost"
            onClick={handleDeny}
            className="w-full text-black/30 hover:text-black/60
              hover:bg-transparent border border-black/10 hover:border-black/20
              text-sm tracking-wide transition-all duration-200 cursor-pointer"
          >
            Ne, je mi méně než 18
          </Button>
        </DialogFooter>

        {/* Disclaimer */}
        <p className="text-black/20 text-xs leading-relaxed tracking-wide mt-1">
          Vstupem potvrzujete, že jste dosáhli zákonného věku pro konzumaci
          alkoholu ve vaší zemi. Alkohol škodí zdraví — pijte zodpovědně.
        </p>

        {/* Decorative */}
        <p className="text-black/20 text-xs tracking-[0.4em] select-none">
          ❧ ✦ ❧ ✦ ❧
        </p>
      </DialogContent>
    </Dialog>
  )
}
