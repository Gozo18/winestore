import { getMyCart } from "@/lib/actions/cart.actions"
import { Metadata } from "next"
import { redirect } from "next/navigation"
import { ShippingAddress } from "@/types"
import ShippingAddressForm from "./shipping-address-form"
import CheckoutSteps from "@/components/shared/checkout-steps"
import { getCurrentUser } from "@/lib/current-user"

export const metadata: Metadata = {
  title: "Dodací adresa",
}

const ShippingAddressPage = async () => {
  const cart = await getMyCart()

  if (!cart || cart.items.length === 0) {
    redirect("/kosik")
  }

  const user = await getCurrentUser()
  const isGuest = !user || user.role === "guest"

  return (
    <>
      <CheckoutSteps current={1} />
      <ShippingAddressForm
        address={(user?.address as ShippingAddress) ?? null}
        isGuest={isGuest}
        guestEmail={isGuest ? user?.email ?? "" : ""}
      />
    </>
  )
}

export default ShippingAddressPage
