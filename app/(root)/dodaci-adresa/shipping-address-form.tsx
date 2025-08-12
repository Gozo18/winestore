"use client"

import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useTransition } from "react"
import { shippingAddressSchema } from "@/lib/validators"
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
import { updateUserAddress } from "@/lib/actions/user.actions"
import { shippingAddressDefaultValues } from "@/lib/constants"

const ShippingAddressForm = ({ address }: { address: ShippingAddress }) => {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof shippingAddressSchema>>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: address || shippingAddressDefaultValues,
  })

  const onSubmit: SubmitHandler<z.infer<typeof shippingAddressSchema>> = async (
    values
  ) => {
    startTransition(async () => {
      const res = await updateUserAddress(values)

      if (!res.success) {
        toast({
          description: res.message,
          variant: "destructive",
        })
        return
      }

      router.push("/platebni-metody")
    })
  }

  return (
    <>
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="h2-bold mt-4">Dodací adresa</h1>
        <p className="text-sm text-muted-foreground">
          Prosím, zadejte dodací adresu.
        </p>
        <Form {...form}>
          <form
            method="post"
            className="space-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="flex flex-col md:flex-row gap-5">
              <FormField
                control={form.control}
                name="fullName"
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<
                    z.infer<typeof shippingAddressSchema>,
                    "fullName"
                  >
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
            </div>
            <div className="flex flex-col md:flex-row gap-5">
              <FormField
                control={form.control}
                name="streetAddress"
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<
                    z.infer<typeof shippingAddressSchema>,
                    "streetAddress"
                  >
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
            </div>
            <div className="flex flex-col md:flex-row gap-5">
              <FormField
                control={form.control}
                name="city"
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<
                    z.infer<typeof shippingAddressSchema>,
                    "city"
                  >
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
            </div>
            <div className="flex flex-col md:flex-row gap-5">
              <FormField
                control={form.control}
                name="postalCode"
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<
                    z.infer<typeof shippingAddressSchema>,
                    "postalCode"
                  >
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
            </div>
            <div className="flex flex-col md:flex-row gap-5">
              <FormField
                control={form.control}
                name="country"
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<
                    z.infer<typeof shippingAddressSchema>,
                    "country"
                  >
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
            </div>
            <div className="flex flex-col md:flex-row gap-5">
              <FormField
                control={form.control}
                name="phone"
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<
                    z.infer<typeof shippingAddressSchema>,
                    "phone"
                  >
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
            </div>
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
      </div>
    </>
  )
}

export default ShippingAddressForm
