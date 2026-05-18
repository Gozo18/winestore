"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

const BackButton = ({ label = "Zpět" }: { label?: string }) => {
  const router = useRouter()

  return (
    <Button variant="link" onClick={() => router.back()} className="p-0">
      <ArrowLeft /> {label}
    </Button>
  )
}

export default BackButton
