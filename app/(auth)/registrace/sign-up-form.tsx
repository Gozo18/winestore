"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signUpDefaultValues } from "@/lib/constants"
import Link from "next/link"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { signUpUser } from "@/lib/actions/user.actions"
import { useSearchParams } from "next/navigation"

const SignUpForm = () => {
  const [data, action] = useActionState(signUpUser, {
    success: false,
    message: "",
  })

  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"

  const SignUpButton = () => {
    const { pending } = useFormStatus()

    return (
      <Button className="w-full" variant="default" disabled={pending}>
        {pending ? "Registruji..." : "Zaregistrovat se"}
      </Button>
    )
  }

  return (
    <form action={action}>
      <div className="space-y-6">
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <div>
          <Label htmlFor="name">Jméno</Label>
          <Input
            id="name"
            type="text"
            name="name"
            autoComplete="name"
            defaultValue={signUpDefaultValues.name}
          />
        </div>
        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            name="email"
            autoComplete="email"
            defaultValue={signUpDefaultValues.email}
          />
        </div>
        <div>
          <Label htmlFor="password">Heslo</Label>
          <Input
            id="password"
            type="password"
            name="password"
            autoComplete="password"
            defaultValue={signUpDefaultValues.password}
          />
        </div>
        <div>
          <Label htmlFor="confirmPassword">Potvrdit heslo</Label>
          <Input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            autoComplete="confirmPassword"
            defaultValue={signUpDefaultValues.confirmPassword}
          />
        </div>
        <div>
          <SignUpButton />
        </div>

        {data && !data.success && (
          <div className="text-center text-destructive">{data.message}</div>
        )}
        <div className="text-sm text-center text-muted-foreground">
          Už máte účet?{" "}
          <Link href="/prihlaseni" target="_self" className="link">
            Přihlaste se.
          </Link>
        </div>
      </div>
    </form>
  )
}

export default SignUpForm
