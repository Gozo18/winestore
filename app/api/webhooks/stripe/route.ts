import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { updateOrderToPaid } from "@/lib/actions/order.actions"
import { prisma } from "@/db/prisma"

export async function POST(req: NextRequest) {
  // 1) Verify webhook signature.
  //    Neplatný podpis musí vrátit 400 — jinak Stripe považuje endpoint
  //    za rozbitý a začne retryovat 5xx donekonečna.
  let event: Stripe.Event
  try {
    event = await Stripe.webhooks.constructEvent(
      await req.text(),
      req.headers.get("stripe-signature") as string,
      process.env.STRIPE_WEBHOOK_SECRET as string,
    )
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Invalid signature"
    console.error("[stripe-webhook] signature verification failed:", msg)
    return NextResponse.json(
      { message: `Webhook signature verification failed: ${msg}` },
      { status: 400 },
    )
  }

  // 2) Process supported event types. Stripe doporučuje vracet 2xx i pro eventy,
  //    které neřešíme — jinak nás bude retryovat.
  if (event.type !== "charge.succeeded") {
    return NextResponse.json({ message: `Ignored event: ${event.type}` })
  }

  const charge = event.data.object
  const orderId = charge.metadata?.orderId

  if (!orderId) {
    // Bez orderId platba není dohledatelná — zalogovat a potvrdit 200, ať Stripe neretryuje.
    console.error("[stripe-webhook] charge.succeeded bez metadata.orderId", {
      chargeId: charge.id,
    })
    return NextResponse.json({ message: "Missing orderId in metadata" })
  }

  // 3) Idempotence: Stripe běžně doručí stejný event 2× (retry, replay).
  //    Když je objednávka už zaplacená, vrátíme 200 a nic neděláme.
  try {
    const existing = await prisma.order.findFirst({
      where: { id: orderId },
      select: { id: true, isPaid: true },
    })

    if (!existing) {
      // Order vymazán nebo nikdy neexistoval — 200, ať Stripe nezačne retryovat.
      console.warn("[stripe-webhook] objednávka neexistuje:", orderId)
      return NextResponse.json({ message: "Order not found" })
    }

    if (existing.isPaid) {
      return NextResponse.json({ message: "Order already paid (idempotent)" })
    }

    await updateOrderToPaid({
      orderId,
      paymentResult: {
        id: charge.id,
        status: "COMPLETED",
        email_address: charge.billing_details.email!,
        pricePaid: (charge.amount / 100).toFixed(),
      },
    })

    return NextResponse.json({ message: "updateOrderToPaid was successful" })
  } catch (err) {
    // Reálná chyba (DB výpadek apod.) — 500 dovolí Stripe retry.
    console.error("[stripe-webhook] zpracování selhalo:", err)
    return NextResponse.json(
      { message: "Internal error while processing webhook" },
      { status: 500 },
    )
  }
}
