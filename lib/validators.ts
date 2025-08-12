import { z } from "zod"
import { formatNumberWithDecimal } from "./utils"
import { PAYMENT_METHODS } from "./constants"

const currency = z
  .string()
  .refine(
    (value) => /^\d+(\.\d{2})/.test(formatNumberWithDecimal(Number(value))),
    "Cena musí mít dvě desetinná místa."
  )

// Schema for inserting products
export const insertProductSchema = z.object({
  name: z.string().min(3, "Jméno musí mít více než 3 znaky."),
  slug: z.string().min(3, "Slug musí mít více než 3 znaky."),
  category: z.string().min(3, "Kategorie musí mít více než 3 znaky."),
  brand: z.string().min(3, "Značka musí mít více než 3 znaky."),
  description: z.string().min(3, "Popis musí mít více než 3 znaky."),
  price: currency,
  stock: z.coerce.number().min(0),
  images: z.array(z.string()).min(1, "Musíte vložit alespoň jednu fotku."),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
})

// Schema for signing users in
export const signInFormSchema = z.object({
  email: z.string().email("Musí být e-mailová adresa."),
  password: z.string().min(6, "Heslo musí mít více než 6 znaků."),
})

// Schema for signing users up
export const signUpFormSchema = z
  .object({
    name: z.string().min(3, "Jméno musí mít více než 3 znaky."),
    email: z.string().email("Musí být e-mailová adresa."),
    password: z.string().min(6, "Heslo musí mít více než 6 znaků."),
    confirmPassword: z.string().min(6, "Heslo musí mít více než 6 znaků."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Hesla se neshodují.",
    path: ["confirmPassword"],
  })

// Cart schema
export const cartItemSchema = z.object({
  productId: z.string().min(1, "Produkt je vyžadován."),
  name: z.string().min(1, "Jméno je vyžadováno."),
  slug: z.string().min(1, "Slug je vyžadován."),
  qty: z.number().int().nonnegative("Množství musí být kladné číslo."),
  image: z.string().min(1, "Obrázek je vyžadován."),
  price: currency,
})

export const insertCartSchema = z.object({
  items: z.array(cartItemSchema),
  itemsPrice: currency,
  totalPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  sessionCartId: z.string().min(1, "Session ID je vyžadováno."),
  userId: z.string().optional().nullable(),
})

// Schema for shipping address
export const shippingAddressSchema = z.object({
  fullName: z.string().min(3, "Jméno musí mít více než 3 znaky."),
  streetAddress: z.string().min(3, "Adresa musí mít více než 3 znaky."),
  city: z.string().min(2, "Město musí mít více než 2 znaky."),
  postalCode: z.string().length(5, "PSČ musí mít 5 znaků."),
  country: z.string().min(3, "Země musí mít více než 3 znaky."),
  lat: z.number().optional(),
  lng: z.number().optional(),
  phone: z.string().min(9, "Telefon musí mít minimálně 9 znaků."),
})

// Schema for payment method
export const paymentMethodSchema = z
  .object({
    type: z.string().min(1, "Způsob platby je vyžadován."),
  })
  .refine((data) => PAYMENT_METHODS.includes(data.type), {
    path: ["type"],
    message: `Způsob platby musí být jeden z následujících: ${PAYMENT_METHODS.join(
      ", "
    )}`,
  })

// Schema for inserting order
export const insertOrderSchema = z.object({
  userId: z.string().min(1, "Uživatel je vyžadován."),
  shippingAddress: shippingAddressSchema,
  itemsPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  totalPrice: currency,
  paymentMethod: z.string().refine((data) => PAYMENT_METHODS.includes(data), {
    message: "Neplatný způsob platby.",
  }),
})

// Schema for inserting an order item
export const insertOrderItemSchema = z.object({
  productId: z.string(),
  slug: z.string(),
  image: z.string(),
  name: z.string(),
  price: currency,
  qty: z.number(),
})
