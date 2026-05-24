import { Info } from "lucide-react"
import { Card } from "@/components/ui/card"

const ShippingNotice = () => {
  return (
    <Card className="p-4 bg-muted/40 border-dashed">
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground leading-relaxed">
          Po odeslání objednávky vás budeme kontaktovat pro domluvení
          individuální dopravy a následně její ceny.
        </p>
      </div>
    </Card>
  )
}

export default ShippingNotice
