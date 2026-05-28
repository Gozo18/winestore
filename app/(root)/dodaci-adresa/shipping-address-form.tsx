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
import { ControllerRenderProps, SubmitHandler, useForm } from "react-hook-form"
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
import {
  guestShippingAddressDefaultValues,
  shippingAddressDefaultValues,
} from "@/lib/constants"
import { Card } from "@/components/ui/card"
import Link from "next/link"

type GuestFormValues = z.infer<typeof guestShippingAddressSchema>
type UserFormValues = z.infer<typeof shippingAddressSchema>

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

  const guestForm = useForm<GuestFormValues>({
    resolver: zodResolver(guestShippingAddressSchema),
    defaultValues: {
      ...guestShippingAddressDefaultValues,
      ...(address ?? {}),
      email: guestEmail || "",
    },
  })

  const userForm = useForm<UserFormValues>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: address ?? shippingAddressDefaultValues,
  })

  const onSubmitGuest: SubmitHandler<GuestFormValues> = (values) => {
    startTransition(async () => {
      const guestRes = await createGuestUser({
        email: values.email,
        name: values.fullName,
      })

      if (!guestRes.success) {
        toast({ description: guestRes.message, variant: "destructive" })
        return
      }

      const { email: _email, ...address } = values
      void _email
      const res = await updateUserAddress(address)

      if (!res.success) {
        toast({ description: res.message, variant: "destructive" })
        return
      }

      router.push("/platebni-metody")
    })
  }

  const onSubmitUser: SubmitHandler<UserFormValues> = (values) => {
    startTransition(async () => {
      const res = await updateUserAddress(values)

      if (!res.success) {
        toast({ description: res.message, variant: "destructive" })
        return
      }

      router.push("/platebni-metody")
    })
  }

  if (isGuest) {
    return (
      <div className="max-w-md mx-auto space-y-4">
        <Card className="p-8">
          <h1 className="h2-bold">Dodací adresa</h1>
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
          <Form {...guestForm}>
            <form
              method="post"
              className="space-y-4 mt-4"
              onSubmit={guestForm.handleSubmit(onSubmitGuest)}
            >
              <FormField
                control={guestForm.control}
                name="email"
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<GuestFormValues, "email">
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
              <FormField
                control={guestForm.control}
                name="fullName"
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<GuestFormValues, "fullName">
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
                control={guestForm.control}
                name="streetAddress"
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<GuestFormValues, "streetAddress">
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
                control={guestForm.control}
                name="city"
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<GuestFormValues, "city">
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
                control={guestForm.control}
                name="postalCode"
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<GuestFormValues, "postalCode">
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
                control={guestForm.control}
                name="country"
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<GuestFormValues, "country">
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
                control={guestForm.control}
                name="phone"
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<GuestFormValues, "phone">
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

  return (
    <div className="max-w-md mx-auto space-y-4">
      <Card className="p-8">
        <h1 className="h2-bold">Dodací adresa</h1>
        <p className="text-sm text-muted-foreground">
          Prosím, zadejte dodací adresu.
        </p>
        <Form {...userForm}>
          <form
            method="post"
            className="space-y-4"
            onSubmit={userForm.handleSubmit(onSubmitUser)}
          >
            <FormField
              control={userForm.control}
              name="fullName"
              render={({
                field,
              }: {
                field: ControllerRenderProps<UserFormValues, "fullName">
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
              control={userForm.control}
              name="streetAddress"
              render={({
                field,
              }: {
                field: ControllerRenderProps<UserFormValues, "streetAddress">
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
              control={userForm.control}
              name="city"
              render={({
                field,
              }: {
                field: ControllerRenderProps<UserFormValues, "city">
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
              control={userForm.control}
              name="postalCode"
              render={({
                field,
              }: {
                field: ControllerRenderProps<UserFormValues, "postalCode">
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
              control={userForm.control}
              name="country"
              render={({
                field,
              }: {
                field: ControllerRenderProps<UserFormValues, "country">
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
              control={userForm.control}
              name="phone"
              render={({
                field,
              }: {
                field: ControllerRenderProps<UserFormValues, "phone">
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
