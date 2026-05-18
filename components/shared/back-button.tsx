"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

const BackButton = ({ label = "Zpět" }: { label?: string }) => {
  const router = useRouter()

  return (
    <Button variant="link" onClick={() => router.back()} className="px-0">
      <ArrowLeft className="mt-[2px] mr-2" /> {label}
    </Button>
  )
}

export default BackButton
