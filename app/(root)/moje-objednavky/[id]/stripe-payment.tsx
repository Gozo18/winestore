import { FormEvent, useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import {
  Elements,
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { SERVER_URL } from "@/lib/constants"

const StripePayment = ({
  priceInCents,
  orderId,
  clientSecret,
  userEmail,
}: {
  priceInCents: number
  orderId: string
  clientSecret: string
  userEmail: string
}) => {
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string,
  )

  const { theme, systemTheme } = useTheme()

  // Stripe Form Component
  const StripeForm = () => {
    const stripe = useStripe()
    const elements = useElements()

    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [email, setEmail] = useState("")

    const handleSubmit = async (e: FormEvent) => {
      e.preventDefault()

      if (stripe == null || elements == null || email == null) return

      setIsLoading(true)

      stripe
        .confirmPayment({
          elements,
          confirmParams: {
            return_url: `${SERVER_URL}/moje-objednavky/${orderId}/stripe-payment-success`,
          },
        })
        .then(({ error }) => {
          if (
            error?.type === "card_error" ||
            error?.type === "validation_error"
          ) {
            setErrorMessage(error?.message ?? "Vyskytla se chyba při platbě")
          } else if (error) {
            setErrorMessage("Vyskytla se chyba při platbě")
          }
        })
        .finally(() => setIsLoading(false))
    }

    return (
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="text-xl">Platba kartou</div>
        {errorMessage && <div className="text-destructive">{errorMessage}</div>}
        <PaymentElement
          options={{
            layout: {
              type: "tabs",
              defaultCollapsed: false,
            },
            paymentMethodOrder: ["apple_pay", "google_pay", "card"],
          }}
        />
        <div>
          <LinkAuthenticationElement
            options={{ defaultValues: { email: userEmail } }}
            onChange={(e) => setEmail(e.value.email)}
          />
        </div>
        <Button
          className="w-full"
          size="lg"
          disabled={stripe == null || elements == null || isLoading}
        >
          {isLoading
            ? "Probíhá platba..."
            : `Zaplatit ${formatCurrency(priceInCents / 100)}`}
        </Button>
      </form>
    )
  }

  return (
    <Elements
      options={{
        clientSecret,
        appearance: {
          theme:
            theme === "dark"
              ? "night"
              : theme === "light"
                ? "stripe"
                : systemTheme === "light"
                  ? "stripe"
                  : "night",
        },
      }}
      stripe={stripePromise}
    >
      <StripeForm />
    </Elements>
  )
}

export default StripePayment
