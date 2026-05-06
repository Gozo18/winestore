import { BottleWine, Headset, Van, WalletCards } from "lucide-react"
import { Card, CardContent } from "./ui/card"

const IconBoxes = () => {
  return (
    <div>
      <Card>
        <CardContent className="grid md:grid-cols-4 gap-4 p-4">
          <div className="space-y-2 flex flex-col items-center text-center">
            <Van />
            <div className="text-sm font-bold">Doprava zdarma</div>
            <div className="text-sm text-muted-foreground">
              Doprava zdarma pro objednávky nad 2500,- Kč
            </div>
          </div>
          <div className="space-y-2 flex flex-col items-center text-center">
            <BottleWine />
            <div className="text-sm font-bold">Široký výběr vína</div>
            <div className="text-sm text-muted-foreground">
              Pro každého milovníka vína máme něco v nabídce
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
            <div className="text-sm font-bold">Potřebujete poradit?</div>
            <div className="text-sm text-muted-foreground">
              Neváhejte nás kontaktovat, rádi vám pomůžeme
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default IconBoxes
