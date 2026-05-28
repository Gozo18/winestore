import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { APP_NAME } from "@/lib/constants"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import CredentialsSignInForm from "./credentials-signin-form"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Přihlášení",
}

const SignInPage = async (props: {
  searchParams: Promise<{
    callbackUrl: string
  }>
}) => {
  const { callbackUrl } = await props.searchParams

  const session = await auth()

  if (session) {
    redirect(callbackUrl || "/")
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="space-y-4">
          <Link href="/" className="flex-center">
            <Image
              src="/images/logo_only.png"
              width={100}
              height={100}
              alt={`${APP_NAME} logo`}
              priority={true}
            />
          </Link>
          <CardTitle className="text-center">Přihlášení</CardTitle>
          <CardDescription className="text-center">
            Přihlašte se do vašeho účtu.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CredentialsSignInForm />
          <div className="mt-6 pt-4 text-center text-sm text-muted-foreground">
            <p className="mb-2">Nemáte u nás účet?</p>
            <p className="mb-2">
              <Link
                href="/registrace"
                target="_self"
                className="underline text-foreground"
              >
                Zaregistrujte se.
              </Link>
            </p>
            <p className="mb-2">nebo</p>
            <p>
              <Link href="/dodaci-adresa" className="underline text-foreground">
                Pokračujte k objednávce bez registrace
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SignInPage
