import { DollarSign, Headset, ShoppingBag, WalletCards } from "lucide-react"
import { Card, CardContent } from "./ui/card"

const IconBoxes = () => {
  return (
    <div>
      <Card>
        <CardContent className="grid md:grid-cols-4 gap-4 p-4">
          <div className="space-y-2 flex flex-col items-center text-center">
            <ShoppingBag />
            <div className="text-sm font-bold">Doprava zdarma</div>
            <div className="text-sm text-muted-foreground">
              Doprava zdarma pro objednávky nad 2000,- Kč
            </div>
          </div>
          <div className="space-y-2 flex flex-col items-center text-center">
            <DollarSign />
            <div className="text-sm font-bold">Garance vracení peněz</div>
            <div className="text-sm text-muted-foreground">
              30 dní po nákupu
            </div>
          </div>
          <div className="space-y-2 flex flex-col items-center text-center">
            <WalletCards />
            <div className="text-sm font-bold">Flexibilní platba</div>
            <div className="text-sm text-muted-foreground">
              Platba kartou, PayPal nebo dobírkou
            </div>
          </div>
          <div className="space-y-2 flex flex-col items-center text-center">
            <Headset />
            <div className="text-sm font-bold">24/7 podpora</div>
            <div className="text-sm text-muted-foreground">
              Získejte podporu kdykoli potřebujete
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default IconBoxes
