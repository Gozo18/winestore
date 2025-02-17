import { z } from "zod"
import { formatNumberWithDecimal } from "./utils"

const currency = z
  .string()
  .refine(
    (value) =>
      /^\d+(\.\d{1,2})?Kč/.test(formatNumberWithDecimal(Number(value))),
    "Musí být ve formátu čísla s Kč."
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
