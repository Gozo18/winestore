import { Metadata } from "next"
import { redirect } from "next/navigation"
import PaymentMethodForm from "./payment-method-form"
import CheckoutSteps from "@/components/shared/checkout-steps"
import { getCurrentUser } from "@/lib/current-user"

export const metadata: Metadata = {
  title: "Platební metody",
}

const PaymentMethodPage = async () => {
  const user = await getCurrentUser()
  if (!user) redirect("/dodaci-adresa")

  return (
    <>
      <CheckoutSteps current={2} />
      <PaymentMethodForm
        preferredPaymentMethod={user.paymentMethod}
        preferredDeliveryMethod={user.deliveryMethod}
      />
    </>
  )
}

export default PaymentMethodPage
