"use client"

import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useTransition } from "react"
import { paymentMethodSchema } from "@/lib/validators"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { DEFAULT_PAYMENT_METHOD, PAYMENT_METHODS } from "@/lib/constants"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Loader,
  CreditCard,
  Banknote,
  HandCoins,
} from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { updateUserPaymentMethod } from "@/lib/actions/user.actions"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const PAYMENT_METHOD_META: Record<
  string,
  { icon: React.ReactNode; label: string; fee: string; description: string }
> = {
  Stripe: {
    icon: <CreditCard className="w-6 h-6" />,
    label: "Platba kartou",
    fee: "zdarma",
    description: "Visa, Mastercard",
  },
  PayPal: {
    icon: <Banknote className="w-6 h-6" />,
    label: "PayPal",
    fee: "zdarma",
    description: "Platba přes váš PayPal účet",
  },
  Hotovost: {
    icon: <HandCoins className="w-6 h-6" />,
    label: "Dobírka",
    fee: "+ 50 Kč",
    description: "Platba při převzetí zásilky",
  },
}

const PaymentMethodForm = ({
  preferredPaymentMethod,
}: {
  preferredPaymentMethod: string | null
}) => {
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof paymentMethodSchema>>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      type: preferredPaymentMethod || DEFAULT_PAYMENT_METHOD,
    },
  })

  const [isPending, startTransition] = useTransition()

  const onSubmit = async (values: z.infer<typeof paymentMethodSchema>) => {
    startTransition(async () => {
      const res = await updateUserPaymentMethod(values)

      if (!res.success) {
        toast({
          variant: "destructive",
          description: res.message,
        })
        return
      }

      router.push("/objednavka")
    })
  }

  return (
    <div className="max-w-md mx-auto space-y-4">
      <Card className="p-8">
        <div className="mb-6">
          <h1 className="h2-bold">Platební metody</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Vyberte preferovanou platební metodu pro vaši objednávku.
          </p>
        </div>

        <Form {...form}>
          <form
            method="post"
            className="space-y-6"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col gap-3"
                    >
                      {PAYMENT_METHODS.map((paymentMethod) => {
                        const meta = PAYMENT_METHOD_META[paymentMethod]
                        const isSelected = field.value === paymentMethod
                        return (
                          <label
                            key={paymentMethod}
                            htmlFor={`payment-${paymentMethod}`}
                            className={cn(
                              "flex items-center gap-4 rounded-lg border-2 p-4 cursor-pointer transition-colors",
                              isSelected
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/40 hover:bg-muted/40",
                            )}
                          >
                            <RadioGroupItem
                              value={paymentMethod}
                              id={`payment-${paymentMethod}`}
                              className="sr-only"
                            />
                            <div
                              className={cn(
                                "flex items-center justify-center w-10 h-10 rounded-full shrink-0",
                                isSelected
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-muted-foreground",
                              )}
                            >
                              {meta?.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm leading-none mb-1">
                                {meta?.label ?? paymentMethod}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {meta?.description}
                              </p>
                            </div>
                            <span
                              className={cn(
                                "text-xs font-semibold shrink-0",
                                meta?.fee === "zdarma"
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-muted-foreground",
                              )}
                            >
                              {meta?.fee}
                            </span>
                          </label>
                        )
                      })}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
              Pokračovat
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  )
}

export default PaymentMethodForm
