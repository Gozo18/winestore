"use client"
import { APP_NAME } from "@/lib/constants"
import Image from "next/image"
import { Button } from "@/components/ui/button"

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Image
        src="/images/logo_only.png"
        width={100}
        height={100}
        alt={`${APP_NAME} logo`}
        priority={true}
        className="mb-8"
      />
      <div className="p-6 w-3/4 md:w-1/3 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold mb-4">Nenalezeno...</h1>
        <p className="text-destructive">
          Stránka, kterou hledáte, nebyla nalezena.
        </p>
        <Button
          variant="outline"
          className="mt-4 ml-2"
          onClick={() => (window.location.href = "/")}
        >
          Zpět na úvodní stránku
        </Button>
      </div>
    </div>
  )
}

export default NotFoundPage
