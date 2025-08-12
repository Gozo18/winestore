import CartTable from "./cart-table"
import { getMyCart } from "@/lib/actions/cart.actions"

export const metadata = {
  title: "Košík",
}

const CartPage = async () => {
  const cart = await getMyCart()
  if (!cart) return <div>Košík je prázdný</div>

  return (
    <>
      <CartTable cart={cart} />
    </>
  )
}

export default CartPage
