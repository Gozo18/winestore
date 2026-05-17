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

OrderReceivedEmail.PreviewProps = {
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
    isPaid: false,
    paidAt: new Date(),
    paymentResult: {
      id: "123",
      status: "pending",
      pricePaid: "0",
      email_address: "test@test.com",
    },
  },
} satisfies OrderReceivedProps

const dateFormatter = new Intl.DateTimeFormat("cs", { dateStyle: "long" })

type OrderReceivedProps = {
  order: Order
}

export default function OrderReceivedEmail({ order }: OrderReceivedProps) {
  const isCOD = order.paymentMethod === "Hotovost"

  return (
    <Html>
      <Preview>Objednávka přijata – Víno Iris</Preview>
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
                Vaše objednávka byla přijata!
              </Heading>
              <Text className="text-gray-500 text-sm mt-2 mb-0">
                {isCOD
                  ? "Objednávku připravujeme. Platbu uhradíte při převzetí zásilky."
                  : "Objednávka čeká na zaplacení. Po přijetí platby ji začneme připravovat."}
              </Text>
            </Section>

            {/* Order meta */}
            <Section className="bg-white px-8 py-5 border-b border-gray-100">
              <Row>
                <Column>
                  <Text className="mb-0 text-xs text-gray-400 uppercase tracking-wide">
                    Číslo objednávky
                  </Text>
                  <Text className="mt-1 text-sm text-gray-700 font-medium">
                    {order.id.toString().slice(-6)}
                  </Text>
                </Column>
                <Column>
                  <Text className="mb-0 text-xs text-gray-400 uppercase tracking-wide">
                    Datum
                  </Text>
                  <Text className="mt-1 text-sm text-gray-700 font-medium">
                    {dateFormatter.format(order.createdAt)}
                  </Text>
                </Column>
                <Column>
                  <Text className="mb-0 text-xs text-gray-400 uppercase tracking-wide">
                    Způsob platby
                  </Text>
                  <Text className="mt-1 text-sm text-gray-700 font-medium">
                    {order.paymentMethod}
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* Products */}
            <Section className="bg-white px-8 pt-5 pb-3 border-b border-gray-100">
              <Text className="text-xs text-gray-400 uppercase tracking-wide mb-3 m-0">
                Objednané položky
              </Text>
              {order.orderitems.map((item) => (
                <Row key={item.productId} className="mb-4">
                  <Column className="w-16">
                    <Img
                      width="56"
                      alt={item.name}
                      className="rounded-md"
                      src={
                        item.image.startsWith("/")
                          ? `${process.env.NEXT_PUBLIC_SERVER_URL}${item.image}`
                          : item.image
                      }
                    />
                  </Column>
                  <Column className="align-middle pl-3">
                    <Text className="m-0 text-sm text-gray-800 font-medium">
                      {item.name}
                    </Text>
                    <Text className="m-0 text-xs text-gray-400">
                      Množství: {item.qty} ks
                    </Text>
                  </Column>
                  <Column align="right" className="align-middle">
                    <Text className="m-0 text-sm text-gray-700 font-semibold">
                      {formatCurrency(item.price)}
                    </Text>
                  </Column>
                </Row>
              ))}
            </Section>

            {/* Price summary */}
            <Section className="bg-white px-8 py-4 border-b border-gray-100">
              {[
                { name: "Položky celkem", price: order.itemsPrice },
                { name: "DPH", price: order.taxPrice },
                { name: "Doprava", price: order.shippingPrice },
              ].map(({ name, price }) => (
                <Row key={name} className="py-0.5">
                  <Column>
                    <Text className="m-0 text-sm text-gray-500">{name}</Text>
                  </Column>
                  <Column align="right">
                    <Text className="m-0 text-sm text-gray-600">
                      {formatCurrency(price)}
                    </Text>
                  </Column>
                </Row>
              ))}
              <Row className="border-t border-gray-200 mt-2 pt-2">
                <Column>
                  <Text className="m-0 text-sm font-bold text-gray-800">
                    Celkem k úhradě
                  </Text>
                </Column>
                <Column align="right">
                  <Text className="m-0 text-base font-bold text-rose-800">
                    {formatCurrency(order.totalPrice)}
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* Shipping address */}
            <Section className="bg-white px-8 py-5 rounded-b-lg">
              <Text className="text-xs text-gray-400 uppercase tracking-wide mb-2 m-0">
                Dodací adresa
              </Text>
              <Text className="m-0 text-sm text-gray-700 font-medium">
                {order.shippingAddress.fullName}
              </Text>
              <Text className="m-0 text-sm text-gray-600">
                {order.shippingAddress.streetAddress}
              </Text>
              <Text className="m-0 text-sm text-gray-600">
                {order.shippingAddress.postalCode} {order.shippingAddress.city}
              </Text>
            </Section>

            {/* Footer */}
            <Section className="px-8 py-6 text-center">
              <Text className="text-xs text-gray-400 m-0">
                O dalším stavu objednávky Vás budeme informovat e-mailem.
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
