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

WelcomeEmail.PreviewProps = {
  name: "John Doe",
} satisfies WelcomeEmailProps

type WelcomeEmailProps = {
  name: string
}

export default function WelcomeEmail({ name }: WelcomeEmailProps) {
  return (
    <Html>
      <Preview>Vítejte ve Víno Iris</Preview>
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
                Vítejte u nás, {name}!
              </Heading>
              <Text className="text-gray-500 text-sm mt-2 mb-0">
                Děkujeme za Vaši registraci. Váš účet byl úspěšně vytvořen.
              </Text>
            </Section>

            {/* Body */}
            <Section className="bg-white px-8 py-6 border-b border-gray-100">
              <Text className="text-sm text-gray-700 m-0 mb-3">
                Od této chvíle máte přístup ke svému uživatelskému účtu, kde si
                můžete prohlížet historii objednávek a spravovat dodací údaje.
              </Text>
              <Text className="text-sm text-gray-700 m-0">
                Těšíme se na Vás a přejeme příjemný výběr z našeho sortimentu.
              </Text>
            </Section>

            {/* CTA */}
            <Section className="bg-white px-8 pb-6 text-center rounded-b-lg">
              <a
                href={`${process.env.NEXT_PUBLIC_SERVER_URL}/hledat`}
                className="inline-block bg-rose-800 text-white text-sm font-semibold px-5 py-3 rounded-md no-underline"
              >
                Prohlédnout nabídku vín
              </a>
            </Section>

            {/* Footer */}
            <Section className="px-8 py-6 text-center">
              <Text className="text-xs text-gray-400 m-0">
                Pokud jste se neregistrovali Vy, prosím kontaktujte nás na
                info@vinoiris.cz.
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
