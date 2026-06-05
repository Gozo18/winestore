"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { requestPasswordReset } from "@/lib/actions/user.actions"

const ForgotPasswordForm = () => {
  const [data, action] = useActionState(requestPasswordReset, {
    success: false,
    message: "",
  })

  const SubmitButton = () => {
    const { pending } = useFormStatus()

    return (
      <Button className="w-full" variant="default" disabled={pending}>
        {pending ? "Odesílám..." : "Odeslat odkaz"}
      </Button>
    )
  }

  return (
    <form action={action}>
      <div className="space-y-6">
        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            name="email"
            required
            autoComplete="email"
          />
        </div>
        <div>
          <SubmitButton />
        </div>

        {data?.message &&
          (data.success ? (
            <div className="rounded-md border border-[#72bf80] bg-[#72bf80]/15 px-4 py-3 text-center text-sm font-medium text-foreground">
              {data.message}
            </div>
          ) : (
            <div className="text-center text-destructive">{data.message}</div>
          ))}
      </div>
    </form>
  )
}

export default ForgotPasswordForm
