import { cn } from "@/lib/utils"

const ProductPrice = ({
  value,
  className,
}: {
  value: number
  className?: string
}) => {
  const stringValue = value.toFixed(2)
  const [intValue, floatValue] = stringValue.split(".")

  return (
    <p className={cn("text-2xl", className)}>
      <span className="font-bold">{intValue}</span>
      <span className="text-sm">.{floatValue}</span>
      <span className="text-sm"> Kč</span>
    </p>
  )
}

export default ProductPrice
