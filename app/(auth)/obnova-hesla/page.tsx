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
import ResetPasswordForm from "./reset-password-form"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Nastavení nového hesla",
}

const ResetPasswordPage = async (props: {
  searchParams: Promise<{ token?: string }>
}) => {
  const session = await auth()

  if (session) {
    redirect("/")
  }

  const { token } = await props.searchParams

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
          <CardTitle className="text-center">Nastavení nového hesla</CardTitle>
          <CardDescription className="text-center">
            {token
              ? "Zadejte prosím Vaše nové heslo."
              : "Odkaz pro obnovu hesla je neplatný."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {token ? (
            <ResetPasswordForm token={token} />
          ) : (
            <div className="text-center text-sm text-muted-foreground">
              <p className="mb-4">
                V URL adrese chybí platný token. Vyžádejte si prosím nový odkaz.
              </p>
              <Link
                href="/zapomenute-heslo"
                className="underline text-foreground"
              >
                Požádat o nový odkaz
              </Link>
            </div>
          )}
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

export default ResetPasswordPage
