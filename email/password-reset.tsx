import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components"
import dotenv from "dotenv"
dotenv.config()

PasswordResetEmail.PreviewProps = {
  name: "John Doe",
  resetUrl: "https://example.com/obnova-hesla?token=preview-token",
} satisfies PasswordResetEmailProps

type PasswordResetEmailProps = {
  name: string
  resetUrl: string
}

export default function PasswordResetEmail({
  name,
  resetUrl,
}: PasswordResetEmailProps) {
  return (
    <Html>
      <Preview>Obnova hesla – Víno Iris</Preview>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-gray-50">
          <Container className="max-w-xl mx-auto">
            {/* Header */}
            <Section className="bg-gray-200 rounded-t-lg px-8 py-6 text-center">
              <Img
                src={`${process.env.NEXT_PUBLIC_SERVER_URL}/images/logo_only.png`}
                alt="Víno Iris"
                width="60"
                className="mx-auto mb-3"
              />
              <Text className="text-2xl font-bold m-0 tracking-wide">
                Víno Iris
              </Text>
              <Text className="text-sm m-0 mt-1">
                Vaše oblíbené vinařství z Pavlova
              </Text>
            </Section>

            {/* Title */}
            <Section className="bg-white px-8 py-6 text-center border-b border-gray-100">
              <Heading className="text-gray-800 text-xl m-0">
                Obnova hesla
              </Heading>
              <Text className="text-gray-500 text-sm mt-2 mb-0">
                Dobrý den {name}, obdrželi jsme žádost o obnovu hesla k Vašemu
                účtu.
              </Text>
            </Section>

            {/* Body */}
            <Section className="bg-white px-8 py-6 border-b border-gray-100">
              <Text className="text-sm text-gray-700 m-0 mb-3">
                Pro nastavení nového hesla klikněte na tlačítko níže. Odkaz je
                platný 1 hodinu.
              </Text>
              <Text className="text-sm text-gray-700 m-0">
                Pokud jste o obnovu hesla nežádali, tento e-mail prosím
                ignorujte – Vaše současné heslo zůstává v platnosti.
              </Text>
            </Section>

            {/* CTA */}
            <Section className="bg-white px-8 pb-6 text-center rounded-b-lg">
              <a
                href={resetUrl}
                className="inline-block bg-rose-800 text-white text-sm font-semibold px-5 py-3 rounded-md no-underline"
              >
                Nastavit nové heslo
              </a>
              <Text className="text-xs text-gray-400 mt-4 m-0">
                Pokud tlačítko nefunguje, zkopírujte do prohlížeče tento odkaz:
              </Text>
              <Text className="text-xs text-gray-500 mt-1 m-0 break-all">
                {resetUrl}
              </Text>
            </Section>

            {/* Footer */}
            <Section className="px-8 py-6 text-center">
              <Text className="text-xs text-gray-400 m-0">
                V případě dotazů nás neváhejte kontaktovat na info@vinoiris.cz.
              </Text>
              <Text className="text-xs text-gray-400 m-0 mt-1">
                © {new Date().getFullYear()} Víno Iris. Všechna práva vyhrazena.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
