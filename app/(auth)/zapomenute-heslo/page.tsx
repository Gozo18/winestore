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
import ForgotPasswordForm from "./forgot-password-form"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Zapomenuté heslo",
}

const ForgotPasswordPage = async () => {
  const session = await auth()

  if (session) {
    redirect("/")
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
          <CardTitle className="text-center">Zapomenuté heslo</CardTitle>
          <CardDescription className="text-center">
            Zadejte e-mail spojený s Vaším účtem a my Vám pošleme odkaz pro
            nastavení nového hesla.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ForgotPasswordForm />
          <div className="mt-6 pt-4 text-center text-sm text-muted-foreground">
            <p>
              <Link
                href="/prihlaseni"
                className="underline text-foreground"
              >
                Zpět na přihlášení
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ForgotPasswordPage
