import { Button } from "./ui/button"
import Link from "next/link"

const ViewAllProductsButton = () => {
  return (
    <div className="flex justify-center items-center my-8">
      <Button asChild className="px-8 py-4 text-sm sm:text-base font-semibold">
        <Link href="/hledat">Zobrazit všechny produkty</Link>
      </Button>
    </div>
  )
}

export default ViewAllProductsButton
