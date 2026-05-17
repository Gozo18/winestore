import { CreditCard, Phone, Truck, Wine } from "lucide-react"
import { Card, CardContent } from "./ui/card"

const boxes = [
  {
    icon: Truck,
    title: "Doprava zdarma",
    description: "Doprava zdarma pro objednávky nad 2500,- Kč",
  },
  {
    icon: Wine,
    title: "Široký výběr vína",
    description: "Pro každého milovníka vína máme něco v nabídce",
  },
  {
    icon: CreditCard,
    title: "Flexibilní platba",
    description: "Platba kartou, PayPal nebo dobírkou",
  },
  {
    icon: Phone,
    title: "Potřebujete poradit?",
    description: "Neváhejte nás kontaktovat, rádi vám pomůžeme",
  },
]

const IconBoxes = () => {
  return (
    <div>
      <Card>
        <CardContent className="grid md:grid-cols-4 gap-6 p-6">
          {boxes.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex flex-col items-center text-center gap-3"
            >
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-rose-50 text-rose-700">
                <Icon size={28} strokeWidth={1.5} />
              </div>
              <div className="text-sm font-bold">{title}</div>
              <div className="text-sm text-muted-foreground">{description}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

export default IconBoxes
