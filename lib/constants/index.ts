export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Víno Iris"
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION || "Nejlepší vína z Moravy"
export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000"
export const LATEST_PRODUCTS_LIMIT =
  Number(process.env.LATEST_PRODUCTS_LIMIT) || 4
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-Q1XH9M80QQ"

export const signInDefaultValues = {
  email: "",
  password: "",
}

export const signUpDefaultValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
}

export const shippingAddressDefaultValues = {
  fullName: "",
  streetAddress: "",
  city: "",
  postalCode: "",
  country: "Česká republika",
  phone: "",
}

export const guestShippingAddressDefaultValues = {
  ...shippingAddressDefaultValues,
  email: "",
}

export const PAYMENT_METHODS = process.env.PAYMENT_METHODS
  ? process.env.PAYMENT_METHODS.split(", ")
  : ["Převod", "Stripe", "Hotovost"]
export const DEFAULT_PAYMENT_METHOD =
  process.env.DEFAULT_PAYMENT_METHOD || "Převod"

export const DELIVERY_METHODS = ["Osobně na prodejně", "Messenger"] as const
export const DEFAULT_DELIVERY_METHOD = "Osobně na prodejně"
export const DELIVERY_PRICES: Record<string, number> = {
  "Osobně na prodejně": 0,
  Messenger: 200,
}

// Příplatek za dobírku (Hotovost) — neaplikuje se při osobním odběru.
// Musí být jediný zdroj pravdy, aby cena v UI a serverové validaci nedriftovala.
export const COD_SURCHARGE = 30

export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 12

export const productDefaultValues = {
  name: "",
  slug: "",
  category: "",
  images: [],
  brand: "",
  description: "",
  price: "0",
  stock: 0,
  rating: "0",
  numReviews: "0",
  isFeatured: false,
  banner: null,
}

export const USER_ROLES = process.env.USER_ROLES
  ? process.env.USER_ROLES.split(", ")
  : ["admin", "user", "b2b"]

export const reviewFormDefaultValues = {
  title: "",
  comment: "",
  rating: 0,
}

export const SENDER_EMAIL = process.env.SENDER_EMAIL || "info@vinoiris.cz"
