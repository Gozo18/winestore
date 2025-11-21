/* export { auth as middleware } from "@/auth" */

import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: Request) {
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  })

  if (!token) {
    return NextResponse.redirect(new URL("/unauthorized", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
