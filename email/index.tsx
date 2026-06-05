import { Resend } from "resend"
import { SENDER_EMAIL, APP_NAME } from "@/lib/constants"
import { Order } from "@/types"
import dotenv from "dotenv"
dotenv.config()

import OrderReceivedEmail from "./order-received"
import PaymentReceiptEmail from "./payment-receipt"
import PurchaseReceiptEmail from "./purchase-receipt"
import WelcomeEmail from "./welcome"
import PasswordResetEmail from "./password-reset"

const resend = new Resend(process.env.RESEND_API_KEY as string)

export const sendPasswordResetEmail = async ({
  name,
  email,
  resetUrl,
}: {
  name: string
  email: string
  resetUrl: string
}) => {
  const { error } = await resend.emails.send({
    from: `${APP_NAME} <${SENDER_EMAIL}>`,
    to: email,
    subject: `Obnova hesla – Víno Iris`,
    react: <PasswordResetEmail name={name} resetUrl={resetUrl} />,
  })
  if (error) throw new Error(`Resend chyba: ${JSON.stringify(error)}`)
}

export const sendWelcomeEmail = async ({
  name,
  email,
}: {
  name: string
  email: string
}) => {
  const { error } = await resend.emails.send({
    from: `${APP_NAME} <${SENDER_EMAIL}>`,
    to: email,
    subject: `Vítejte ve Víno Iris`,
    react: <WelcomeEmail name={name} />,
  })
  if (error) throw new Error(`Resend chyba: ${JSON.stringify(error)}`)
}

export const sendOrderReceived = async ({ order }: { order: Order }) => {
  const { error } = await resend.emails.send({
    from: `${APP_NAME} <${SENDER_EMAIL}>`,
    to: order.user.email,
    bcc: "info@vinoiris.cz",
    subject: `Objednávka přijata – ${order.id.toString().slice(-6)}`,
    react: <OrderReceivedEmail order={order} />,
  })
  if (error) throw new Error(`Resend chyba: ${JSON.stringify(error)}`)
}

export const sendPaymentReceipt = async ({ order }: { order: Order }) => {
  const { error } = await resend.emails.send({
    from: `${APP_NAME} <${SENDER_EMAIL}>`,
    to: order.user.email,
    subject: `Platba přijata – objednávka ${order.id.toString().slice(-6)}`,
    react: <PaymentReceiptEmail order={order} />,
  })
  if (error) throw new Error(`Resend chyba: ${JSON.stringify(error)}`)
}

export const sendPurchaseReceipt = async ({ order }: { order: Order }) => {
  const { error } = await resend.emails.send({
    from: `${APP_NAME} <${SENDER_EMAIL}>`,
    to: order.user.email,
    subject: `Vaše objednávka byla odeslána – ${order.id.toString().slice(-6)}`,
    react: <PurchaseReceiptEmail order={order} />,
  })
  if (error) throw new Error(`Resend chyba: ${JSON.stringify(error)}`)
}
