import { Resend } from "resend"
import { SENDER_EMAIL, APP_NAME } from "@/lib/constants"
import { Order } from "@/types"
import dotenv from "dotenv"
dotenv.config()

import OrderReceivedEmail from "./order-received"
import PaymentReceiptEmail from "./payment-receipt"
import PurchaseReceiptEmail from "./purchase-receipt"

const resend = new Resend(process.env.RESEND_API_KEY as string)

export const sendOrderReceived = async ({ order }: { order: Order }) => {
  await resend.emails.send({
    from: `${APP_NAME} <${SENDER_EMAIL}>`,
    to: order.user.email,
    subject: `Objednávka přijata – ${order.id.toString().slice(-6)}`,
    react: <OrderReceivedEmail order={order} />,
  })
}

export const sendPaymentReceipt = async ({ order }: { order: Order }) => {
  await resend.emails.send({
    from: `${APP_NAME} <${SENDER_EMAIL}>`,
    to: order.user.email,
    subject: `Platba přijata – objednávka ${order.id.toString().slice(-6)}`,
    react: <PaymentReceiptEmail order={order} />,
  })
}

export const sendPurchaseReceipt = async ({ order }: { order: Order }) => {
  await resend.emails.send({
    from: `${APP_NAME} <${SENDER_EMAIL}>`,
    to: order.user.email,
    subject: `Vaše objednávka byla odeslána – ${order.id.toString().slice(-6)}`,
    react: <PurchaseReceiptEmail order={order} />,
  })
}
