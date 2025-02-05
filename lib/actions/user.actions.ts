"use server"

import { signInFormSchema } from "../validators"
import { signIn, signOut } from "@/auth"
import { isRedirectError } from "next/dist/client/components/redirect-error"

// Sign in user with credentials
export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData
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
  await signOut()
}
