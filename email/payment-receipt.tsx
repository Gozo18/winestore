import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components"
import { Order } from "@/types"
import { formatCurrency } from "@/lib/utils"
import sampleData from "@/db/sample-data"
import dotenv from "dotenv"
dotenv.config()
import crypto from "crypto"

PaymentReceiptEmail.PreviewProps = {
  order: {
    id: crypto.randomUUID(),
    userId: "123",
    user: {
      name: "John Doe",
      email: "test@test.com",
    },
    paymentMethod: "Stripe",
    shippingAddress: {
      fullName: "John Doe",
      streetAddress: "123 Main st",
      city: "New York",
      postalCode: "10001",
      country: "US",
      phone: "1234567890",
    },
    createdAt: new Date(),
    totalPrice: "100",
    taxPrice: "10",
    shippingPrice: "10",
    itemsPrice: "80",
    orderitems: sampleData.products.map((x) => ({
      name: x.name,
      orderId: "123",
      productId: "123",
      slug: x.slug,
      qty: x.stock,
      image: x.images[0],
      price: x.price.toString(),
    })),
    isDelivered: false,
    deliveredAt: new Date(),
    isPaid: true,
    paidAt: new Date(),
    paymentResult: {
      id: "123",
      status: "succeeded",
      pricePaid: "100",
      email_address: "test@test.com",
    },
  },
} satisfies PaymentReceiptProps

const dateFormatter = new Intl.DateTimeFormat("cs", {
  dateStyle: "medium",
  timeStyle: "short",
})

type PaymentReceiptProps = {
  order: Order
}

export default function PaymentReceiptEmail({ order }: PaymentReceiptProps) {
  return (
    <Html>
      <Preview>Platba přijata – Víno Iris</Preview>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-gray-50">
          <Container className="max-w-xl mx-auto">
            {/* Header */}
            <Section className="bg-rose-800 rounded-t-lg px-8 py-6 text-center">
              <Img
                src={`${process.env.NEXT_PUBLIC_SERVER_URL}/images/logo_only.png`}
                alt="Víno Iris"
                width="60"
                className="mx-auto mb-3"
              />
              <Text className="text-white text-2xl font-bold m-0 tracking-wide">
                Víno Iris
              </Text>
              <Text className="text-rose-200 text-sm m-0 mt-1">
                Váš oblíbený vinný obchod
              </Text>
            </Section>

            {/* Title */}
            <Section className="bg-white px-8 py-6 text-center border-b border-gray-100">
              <Heading className="text-gray-800 text-xl m-0">
                Platba byla úspěšně přijata
              </Heading>
              <Text className="text-gray-500 text-sm mt-2 mb-0">
                Obdrželi jsme Vaši platbu. Objednávku nyní připravujeme k
                odeslání.
              </Text>
            </Section>

            {/* Payment details */}
            <Section className="bg-white px-8 py-5 border-b border-gray-100">
              <Text className="text-xs text-gray-400 uppercase tracking-wide mb-3 m-0">
                Detaily platby
              </Text>
              <Row className="mb-2">
                <Column>
                  <Text className="m-0 text-sm text-gray-500">
                    ID objednávky
                  </Text>
                </Column>
                <Column align="right">
                  <Text className="m-0 text-sm text-gray-700 font-medium">
                    {order.id.toString().slice(-6)}
                  </Text>
                </Column>
              </Row>
              <Row className="mb-2">
                <Column>
                  <Text className="m-0 text-sm text-gray-500">
                    Datum platby
                  </Text>
                </Column>
                <Column align="right">
                  <Text className="m-0 text-sm text-gray-700 font-medium">
                    {order.paidAt ? dateFormatter.format(order.paidAt) : "–"}
                  </Text>
                </Column>
              </Row>
              <Row className="mb-2">
                <Column>
                  <Text className="m-0 text-sm text-gray-500">
                    Způsob platby
                  </Text>
                </Column>
                <Column align="right">
                  <Text className="m-0 text-sm text-gray-700 font-medium">
                    {order.paymentMethod}
                  </Text>
                </Column>
              </Row>
              <Row className="border-t border-gray-100 pt-2 mt-1">
                <Column>
                  <Text className="m-0 text-sm font-bold text-gray-800">
                    Zaplacená částka
                  </Text>
                </Column>
                <Column align="right">
                  <Text className="m-0 text-base font-bold text-rose-800">
                    {formatCurrency(order.totalPrice)}
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* Items summary */}
            <Section className="bg-white px-8 py-4 rounded-b-lg">
              <Text className="text-xs text-gray-400 uppercase tracking-wide mb-3 m-0">
                Přehled položek
              </Text>
              {order.orderitems.map((item) => (
                <Row key={item.productId} className="mb-2">
                  <Column>
                    <Text className="m-0 text-sm text-gray-700">
                      {item.name}
                    </Text>
                  </Column>
                  <Column align="right">
                    <Text className="m-0 text-sm text-gray-500">
                      {item.qty} ks × {formatCurrency(item.price)}
                    </Text>
                  </Column>
                </Row>
              ))}
            </Section>

            {/* Footer */}
            <Section className="px-8 py-6 text-center">
              <Text className="text-xs text-gray-400 m-0">
                O odeslání objednávky Vás budeme informovat zvláštním e-mailem.
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
