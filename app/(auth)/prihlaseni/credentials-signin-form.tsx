"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signInDefaultValues } from "@/lib/constants"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { signInWithCredentials } from "@/lib/actions/user.actions"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

const CredentialsSignInForm = () => {
  const [data, action] = useActionState(signInWithCredentials, {
    success: false,
    message: "",
  })

  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"

  const SignInButton = () => {
    const { pending } = useFormStatus()

    return (
      <Button className="w-full" variant="default" disabled={pending}>
        {pending ? "Přihlašuji..." : "Přihlásit se"}
      </Button>
    )
  }

  return (
    <form action={action}>
      <div className="space-y-6">
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            name="email"
            required
            autoComplete="email"
            defaultValue={signInDefaultValues.email}
          />
        </div>
        <div>
          <Label htmlFor="password">Heslo</Label>
          <Input
            id="password"
            type="password"
            name="password"
            required
            autoComplete="password"
            defaultValue={signInDefaultValues.password}
          />
          <div className="mt-2 text-right text-sm">
            <Link
              href="/zapomenute-heslo"
              className="underline text-muted-foreground hover:text-foreground"
            >
              Zapomenuté heslo?
            </Link>
          </div>
        </div>
        <div>
          <SignInButton />
        </div>

        {data && !data.success && (
          <div className="text-center text-destructive">{data.message}</div>
        )}
      </div>
    </form>
  )
}

export default CredentialsSignInForm
