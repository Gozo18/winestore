"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { resetPassword } from "@/lib/actions/user.actions"

const ResetPasswordForm = ({ token }: { token: string }) => {
  const [data, action] = useActionState(resetPassword, {
    success: false,
    message: "",
  })

  const SubmitButton = () => {
    const { pending } = useFormStatus()

    return (
      <Button className="w-full" variant="default" disabled={pending}>
        {pending ? "Ukládám..." : "Nastavit nové heslo"}
      </Button>
    )
  }

  if (data?.success) {
    return (
      <div className="rounded-md border border-[#72bf80] bg-[#72bf80]/15 px-4 py-3 text-center text-sm font-medium text-foreground">
        {data.message}
      </div>
    )
  }

  return (
    <form action={action}>
      <div className="space-y-6">
        <input type="hidden" name="token" value={token} />
        <div>
          <Label htmlFor="password">Nové heslo</Label>
          <Input
            id="password"
            type="password"
            name="password"
            required
            autoComplete="new-password"
            minLength={6}
          />
        </div>
        <div>
          <Label htmlFor="confirmPassword">Potvrzení nového hesla</Label>
          <Input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            required
            autoComplete="new-password"
            minLength={6}
          />
        </div>
        <div>
          <SubmitButton />
        </div>

        {data?.message && !data.success && (
          <div className="text-center text-destructive">{data.message}</div>
        )}
      </div>
    </form>
  )
}

export default ResetPasswordForm
