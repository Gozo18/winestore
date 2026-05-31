"use client"

import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useTransition } from "react"
import {
  guestShippingAddressSchema,
  shippingAddressSchema,
} from "@/lib/validators"
import { ShippingAddress } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  ControllerRenderProps,
  Resolver,
  SubmitHandler,
  useForm,
} from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowRight, Loader } from "lucide-react"
import {
  createGuestUser,
  updateUserAddress,
} from "@/lib/actions/user.actions"
import { guestShippingAddressDefaultValues } from "@/lib/constants"
import { Card } from "@/components/ui/card"
import Link from "next/link"

// Typujeme přes guest variantu (superset s `email`). Pro přihlášené uživatele
// se pole `email` jen nerenderuje a do submitu jde prázdný string, který se
// před uložením odstraní. Validační schéma se přepíná dle `isGuest`, takže
// pro přihlášené je `email` nepovinné a nevaliduje se.
type FormValues = z.infer<typeof guestShippingAddressSchema>

const ShippingAddressForm = ({
  address,
  isGuest,
  guestEmail,
}: {
  address: ShippingAddress | null
  isGuest: boolean
  guestEmail: string
}) => {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()

  const schema = isGuest ? guestShippingAddressSchema : shippingAddressSchema

  const form = useForm<FormValues>({
    // shippingAddressSchema je podmnožinou guest schématu (chybí jen `email`),
    // takže Resolver<FormValues> přetypování je bezpečné.
    resolver: zodResolver(schema) as unknown as Resolver<FormValues>,
    defaultValues: {
      ...guestShippingAddressDefaultValues,
      ...(address ?? {}),
      email: guestEmail || "",
    },
  })

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    startTransition(async () => {
      if (isGuest) {
        const guestRes = await createGuestUser({
          email: values.email,
          name: values.fullName,
        })
        if (!guestRes.success) {
          toast({ description: guestRes.message, variant: "destructive" })
          return
        }
      }

      // Adresa se ukládá bez emailu — email patří k User záznamu, ne k adrese.
      const { email: _email, ...addressOnly } = values
      void _email

      const res = await updateUserAddress(addressOnly)
      if (!res.success) {
        toast({ description: res.message, variant: "destructive" })
        return
      }

      router.push("/platebni-metody")
    })
  }

  return (
    <div className="max-w-md mx-auto space-y-4">
      <Card className="p-8">
        <h1 className="h2-bold">Dodací adresa</h1>
        {isGuest ? (
          <>
            <p className="text-sm text-muted-foreground">
              Vyplňte údaje pro doručení. Účet u nás mít nemusíte.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Už máte účet?{" "}
              <Link href="/prihlaseni" className="underline">
                Přihlásit se
              </Link>
              .
            </p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            Prosím, zadejte dodací adresu.
          </p>
        )}

        <Form {...form}>
          <form
            method="post"
            className="space-y-4 mt-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {isGuest && (
              <FormField
                control={form.control}
                name="email"
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<FormValues, "email">
                }) => (
                  <FormItem className="w-full">
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="vas@email.cz"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="fullName"
              render={({
                field,
              }: {
                field: ControllerRenderProps<FormValues, "fullName">
              }) => (
                <FormItem className="w-full">
                  <FormLabel>Jméno a příjmení</FormLabel>
                  <FormControl>
                    <Input placeholder="Jméno a příjmení" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="streetAddress"
              render={({
                field,
              }: {
                field: ControllerRenderProps<FormValues, "streetAddress">
              }) => (
                <FormItem className="w-full">
                  <FormLabel>Ulice a číslo popisné</FormLabel>
                  <FormControl>
                    <Input placeholder="Ulice a číslo popisné" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({
                field,
              }: {
                field: ControllerRenderProps<FormValues, "city">
              }) => (
                <FormItem className="w-full">
                  <FormLabel>Město</FormLabel>
                  <FormControl>
                    <Input placeholder="Město" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="postalCode"
              render={({
                field,
              }: {
                field: ControllerRenderProps<FormValues, "postalCode">
              }) => (
                <FormItem className="w-full">
                  <FormLabel>PSČ</FormLabel>
                  <FormControl>
                    <Input placeholder="PSČ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({
                field,
              }: {
                field: ControllerRenderProps<FormValues, "country">
              }) => (
                <FormItem className="w-full">
                  <FormLabel>Stát</FormLabel>
                  <FormControl>
                    <Input placeholder="Stát" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({
                field,
              }: {
                field: ControllerRenderProps<FormValues, "phone">
              }) => (
                <FormItem className="w-full">
                  <FormLabel>Telefon</FormLabel>
                  <FormControl>
                    <Input placeholder="+420 123 456 789" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2">
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
                Pokračovat
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  )
}

export default ShippingAddressForm
