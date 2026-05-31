"use server"

import {
  shippingAddressSchema,
  signInFormSchema,
  signUpFormSchema,
  paymentMethodSchema,
  checkoutMethodsSchema,
  updateUserSchema,
} from "../validators"
import { auth, signIn, signOut } from "@/auth"
import { isRedirectError } from "next/dist/client/components/redirect-error"
import { hashSync } from "bcrypt-ts-edge"
import { prisma } from "@/db/prisma"
import { formatError } from "../utils"
import { ShippingAddress } from "@/types"
import { z } from "zod"
import { PAGE_SIZE } from "../constants"
import { Prisma } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { getMyCart } from "./cart.actions"
import { cookies } from "next/headers"
import {
  GUEST_USER_COOKIE,
  GUEST_COOKIE_MAX_AGE,
  getCurrentUserId,
} from "../current-user"

// Sign in user with credentials
export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData,
) {
  try {
    // Validate form data
    const user = signInFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    })

    // Sign in user
    await signIn("credentials", user)

    return { success: true, message: "Přihlášení proběhlo úspěšně." }
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }

    return { success: false, message: "Nesprávný e-mail nebo heslo." }
  }
}

// Sign user out
export async function signOutUser() {
  const currentCart = await getMyCart()
  if (currentCart?.id) {
    await prisma.cart.delete({ where: { id: currentCart.id } })
  }
  await signOut()
}

// Sign up user
export async function signUpUser(prevState: unknown, formData: FormData) {
  try {
    const user = signUpFormSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    })

    const plainPassword = user.password

    user.password = hashSync(user.password, 10)

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    })

    await signIn("credentials", { email: user.email, password: plainPassword })

    return { success: true, message: "Registrace proběhla úspěšně." }
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }

    return { success: false, message: formatError(error) }
  }
}

// Get user by ID
export async function getUserById(userId: string) {
  const user = await prisma.user.findFirst({
    where: { id: userId },
  })
  if (!user) {
    throw new Error("Uživatel nenalezen.")
  }
  return user
}

// Update the user´s address (works for both authenticated users and guests)
export async function updateUserAddress(data: ShippingAddress) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) throw new Error("Uživatel nenalezen.")

    const address = shippingAddressSchema.parse(data)

    await prisma.user.update({
      where: { id: userId },
      data: { address },
    })

    return { success: true, message: "Adresa byla úspěšně aktualizována." }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

// Create a guest user record (no password) so a customer can check out without
// registering. Sets an HTTP-only cookie that subsequent server actions read
// through getCurrentUserId. If a registered user already owns the email the
// caller is asked to log in instead.
export async function createGuestUser({
  email,
  name,
}: {
  email: string
  name: string
}) {
  try {
    const normalizedEmail = email.trim().toLowerCase()
    const existing = await prisma.user.findFirst({
      where: { email: normalizedEmail },
    })

    if (existing) {
      if (existing.role === "guest") {
        // Re-use the existing guest record for the same email
        await setGuestUserCookie(existing.id)
        await attachSessionCartToUser(existing.id)
        return { success: true, userId: existing.id, message: "" }
      }
      return {
        success: false,
        userId: null,
        message:
          "Tento e-mail už má účet. Přihlaste se, prosím, nebo zvolte jiný e-mail.",
      }
    }

    const created = await prisma.user.create({
      data: {
        email: normalizedEmail,
        name: name || normalizedEmail.split("@")[0],
        role: "guest",
      },
    })

    await setGuestUserCookie(created.id)
    await attachSessionCartToUser(created.id)

    return { success: true, userId: created.id, message: "" }
  } catch (error) {
    return { success: false, userId: null, message: formatError(error) }
  }
}

async function setGuestUserCookie(userId: string) {
  ;(await cookies()).set(GUEST_USER_COOKIE, userId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: GUEST_COOKIE_MAX_AGE,
    path: "/",
  })
}

async function attachSessionCartToUser(userId: string) {
  const sessionCartId = (await cookies()).get("sessionCartId")?.value
  if (!sessionCartId) return
  const cart = await prisma.cart.findFirst({ where: { sessionCartId } })
  if (cart && !cart.userId) {
    await prisma.cart.update({
      where: { id: cart.id },
      data: { userId },
    })
  }
}

// Update user´s payment method
export async function updateUserPaymentMethod(
  data: z.infer<typeof paymentMethodSchema>,
) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) throw new Error("Uživatel nenalezen.")

    const paymentMethod = paymentMethodSchema.parse(data)

    await prisma.user.update({
      where: { id: userId },
      data: { paymentMethod: paymentMethod.type },
    })

    return {
      success: true,
      message: "Platební metoda byla úspěšně aktualizována.",
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

// Update user´s payment and delivery method together
export async function updateUserCheckoutMethods(
  data: z.infer<typeof checkoutMethodsSchema>,
) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) throw new Error("Uživatel nenalezen.")

    const parsed = checkoutMethodsSchema.parse(data)

    await prisma.user.update({
      where: { id: userId },
      data: {
        paymentMethod: parsed.paymentMethod,
        deliveryMethod: parsed.deliveryMethod,
      },
    })

    return {
      success: true,
      message: "Platba a doprava byly úspěšně uloženy.",
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

// Update the user profile
export async function updateProfile(user: { name: string; email: string }) {
  try {
    const session = await auth()

    const currentUser = await prisma.user.findFirst({
      where: {
        id: session?.user?.id,
      },
    })

    if (!currentUser) throw new Error("Uživatel nenalezen.")

    await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        name: user.name,
      },
    })

    return {
      success: true,
      message: "Profil byl úspěšně aktualizován.",
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

// Get all the users
export async function getAllUsers({
  limit = PAGE_SIZE,
  page,
  query,
}: {
  limit?: number
  page: number
  query: string
}) {
  const queryFilter: Prisma.UserWhereInput =
    query && query !== "all"
      ? {
          name: {
            contains: query,
            mode: "insensitive",
          } as Prisma.StringFilter,
        }
      : {}

  const data = await prisma.user.findMany({
    where: {
      ...queryFilter,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: (page - 1) * limit,
  })

  // Count musí respektovat stejný filtr jako findMany — jinak při aktivním
  // vyhledávání paginace ukazuje stránky, které neexistují.
  const dataCount = await prisma.user.count({
    where: { ...queryFilter },
  })

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  }
}

// Delete a user
export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({ where: { id } })

    revalidatePath("/admin/uzivatele")

    return {
      success: true,
      message: "Uživatel byl úspěšně smazán.",
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    }
  }
}

// Update a user
export async function updateUser(user: z.infer<typeof updateUserSchema>) {
  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        role: user.role,
      },
    })

    revalidatePath("/admin/users")

    return {
      success: true,
      message: "User updated successfully",
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}
