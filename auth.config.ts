import type { NextAuthConfig } from "next-auth"
import { NextResponse } from "next/server"

export const authConfig = {
  providers: [], // Required by NextAuthConfig type
  callbacks: {
    authorized({ request, auth }) {
      // Array of regex patterns of paths we want to protect.
      // Checkout pages (/dodaci-adresa, /platebni-metody, /objednavka, /moje-objednavky)
      // are intentionally left open so guests can buy without registering;
      // those pages enforce their own access via getCurrentUserId / order accessToken.
      const protectedPaths = [
        /\/profil/,
        /\/uzivatel\/(.*)/,
        /\/admin/,
      ]

      // Get pathname from the req URL object
      const { pathname } = request.nextUrl
      // Check if user is not authenticated and accessing a protected path
      if (!auth && protectedPaths.some((p) => p.test(pathname))) return false

      // Check for session cart cookie
      if (!request.cookies.get("sessionCartId")) {
        // Generate new session cart id cookie
        const sessionCartId = crypto.randomUUID()

        // Create new response and add the new headers
        const response = NextResponse.next({
          request: {
            headers: new Headers(request.headers),
          },
        })

        // Set newly generated sessionCartId in the response cookies
        response.cookies.set("sessionCartId", sessionCartId)

        return response
      }

      return true
    },
  },
} satisfies NextAuthConfig
