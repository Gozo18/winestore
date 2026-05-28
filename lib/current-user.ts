import { cookies } from "next/headers"
import { auth } from "@/auth"
import { prisma } from "@/db/prisma"

export const GUEST_USER_COOKIE = "guestUserId"
export const GUEST_COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

// Returns the id of the current "customer" — either an authenticated user
// (via NextAuth session) or a guest tracked through the guestUserId cookie.
export async function getCurrentUserId(): Promise<string | null> {
  const session = await auth()
  if (session?.user?.id) return session.user.id

  const guestId = (await cookies()).get(GUEST_USER_COOKIE)?.value
  if (!guestId) return null

  const exists = await prisma.user.findFirst({
    where: { id: guestId, role: "guest" },
    select: { id: true },
  })

  return exists?.id ?? null
}

export async function getCurrentUser() {
  const userId = await getCurrentUserId()
  if (!userId) return null
  return prisma.user.findFirst({ where: { id: userId } })
}
