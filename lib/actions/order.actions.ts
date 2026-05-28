"use server"

import { isRedirectError } from "next/dist/client/components/redirect-error"
import { convertToPlainObject, formatError } from "../utils"
import { auth } from "@/auth"
import { getMyCart } from "./cart.actions"
import { getUserById } from "./user.actions"
import { insertOrderSchema } from "../validators"
import { prisma } from "@/db/prisma"
import { CartItem, PaymentResult, ShippingAddress } from "@/types"
import { paypal } from "../paypal"
import { revalidatePath } from "next/cache"
import { PAGE_SIZE, DELIVERY_PRICES } from "../constants"
import { Prisma } from "@prisma/client"
import { sendOrderReceived, sendPaymentReceipt, sendPurchaseReceipt } from "@/email"
import { getCurrentUserId } from "../current-user"
import crypto from "crypto"

// Create order and create the order items
export async function createOrder() {
  try {
    const userId = await getCurrentUserId()
    if (!userId) throw new Error("Uživatel nenalezen.")

    const cart = await getMyCart()

    const user = await getUserById(userId)
    const isGuest = user.role === "guest"

    if (!cart || cart.items.length === 0) {
      return {
        success: false,
        message: "Košík je prázdný.",
        redirectTo: "/kosik",
      }
    }

    if (!user.address) {
      return {
        success: false,
        message: "Není dodací adresa.",
        redirectTo: "/dodaci-adresa",
      }
    }

    if (!user.paymentMethod) {
      return {
        success: false,
        message: "Není vybraná platební metoda.",
        redirectTo: "/platebni-metody",
      }
    }

    if (!user.deliveryMethod) {
      return {
        success: false,
        message: "Není vybraný způsob dopravy.",
        redirectTo: "/platebni-metody",
      }
    }

    const COD_SURCHARGE = 30
    const isPickup = user.deliveryMethod === "Osobně na prodejně"
    const isCOD = user.paymentMethod === "Hotovost"
    const codFee = isCOD && !isPickup ? COD_SURCHARGE : 0
    const deliveryFee = DELIVERY_PRICES[user.deliveryMethod] ?? 0
    const shippingPrice = (deliveryFee + codFee).toFixed(2)
    const totalPrice = (
      Number(cart.itemsPrice) +
      deliveryFee +
      codFee
    ).toFixed(2)

    // Create order object
    const order = insertOrderSchema.parse({
      userId: user.id,
      shippingAddress: user.address,
      paymentMethod: user.paymentMethod,
      deliveryMethod: user.deliveryMethod,
      itemsPrice: cart.itemsPrice,
      shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice,
    })

    const accessToken = crypto.randomBytes(24).toString("hex")

    // Create a transaction to create order and order items in database
    const insertedOrderId = await prisma.$transaction(async (tx) => {
      // Create order
      const insertedOrder = await tx.order.create({
        data: {
          ...order,
          accessToken,
          guestEmail: isGuest ? user.email : null,
        },
      })
      // Create order items from the cart items
      for (const item of cart.items as CartItem[]) {
        await tx.orderItem.create({
          data: {
            ...item,
            price: item.price,
            orderId: insertedOrder.id,
          },
        })
      }
      // Clear cart
      await tx.cart.update({
        where: { id: cart.id },
        data: {
          items: [],
          totalPrice: 0,
          taxPrice: 0,
          shippingPrice: 0,
          itemsPrice: 0,
        },
      })

      return insertedOrder.id
    })

    if (!insertedOrderId) throw new Error("Objednávku se nepodařilo vytvořit.")

    const newOrder = await prisma.order.findFirst({
      where: { id: insertedOrderId },
      include: {
        orderitems: true,
        user: { select: { name: true, email: true } },
      },
    })

    if (newOrder) {
      try {
        console.log("[email] Posílám potvrzení objednávky na:", newOrder.user?.email)
        await sendOrderReceived({
          order: {
            ...newOrder,
            shippingAddress: newOrder.shippingAddress as ShippingAddress,
            paymentResult: newOrder.paymentResult as PaymentResult,
          },
        })
        console.log("[email] Potvrzení odesláno.")
      } catch (emailError) {
        console.error("[email] Chyba při odesílání potvrzení:", emailError)
      }
    }

    const tokenSuffix = isGuest ? `?token=${accessToken}` : ""
    let redirectLink = ""

    if (user.paymentMethod === "Stripe" || user.paymentMethod === "Paypal") {
      redirectLink = `/moje-objednavky/${insertedOrderId}${tokenSuffix}#payment-section`
    } else {
      redirectLink = `/moje-objednavky/${insertedOrderId}${tokenSuffix}`
    }

    return {
      success: true,
      message: "Objednávka byla úspěšně vytvořena.",
      redirectTo: redirectLink,
    }
  } catch (error) {
    if (isRedirectError(error)) throw error
    return { success: false, message: formatError(error) }
  }
}

// Get order by id
export async function getOrderById(orderId: string) {
  const data = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      orderitems: true,
      user: { select: { name: true, email: true } },
    },
  })

  return convertToPlainObject(data)
}

// Create new paypal order
export async function createPayPalOrder(orderId: string) {
  try {
    // Get order from database
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    })

    if (order) {
      // Create paypal order
      const paypalOrder = await paypal.createOrder(Number(order.totalPrice))

      // Update order with paypal order id
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentResult: {
            id: paypalOrder.id,
            email_address: "",
            status: "",
            pricePaid: 0,
          },
        },
      })

      return {
        success: true,
        message: "Objednávka vytvořena.",
        data: paypalOrder.id,
      }
    } else {
      throw new Error("Objednávka nenalezena.")
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

// Approve paypal order and update order to paid
export async function approvePayPalOrder(
  orderId: string,
  data: { orderID: string },
) {
  try {
    // Get order from database
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    })

    if (!order) throw new Error("Objednávka nenalezena.")

    const captureData = await paypal.capturePayment(data.orderID)

    if (
      !captureData ||
      captureData.id !== (order.paymentResult as PaymentResult)?.id ||
      captureData.status !== "COMPLETED"
    ) {
      throw new Error("Chyba při zpracování PayPal platby.")
    }

    // Update order to paid
    await updateOrderToPaid({
      orderId,
      paymentResult: {
        id: captureData.id,
        status: captureData.status,
        email_address: captureData.payer.email_address,
        pricePaid:
          captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value,
      },
    })

    revalidatePath(`/order/${orderId}`)

    return {
      success: true,
      message: "Vaše platba byla úspěšná.",
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

// Update order to paid
export async function updateOrderToPaid({
  orderId,
  paymentResult,
}: {
  orderId: string
  paymentResult?: PaymentResult
}) {
  // Get order from database
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      orderitems: true,
    },
  })

  if (!order) throw new Error("Objednávka nenalezena.")

  if (order.isPaid) throw new Error("Obednávka již byla zaplacena.")

  // Transaction to update order and account for product stock
  await prisma.$transaction(async (tx) => {
    // Iterate over products and update stock
    for (const item of order.orderitems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { increment: -item.qty } },
      })
    }

    // Set the order to paid
    await tx.order.update({
      where: { id: orderId },
      data: {
        isPaid: true,
        paidAt: new Date(),
        paymentResult,
      },
    })
  })

  // Get updated order after transaction
  const updatedOrder = await prisma.order.findFirst({
    where: { id: orderId },
    include: {
      orderitems: true,
      user: { select: { name: true, email: true } },
    },
  })

  if (!updatedOrder) throw new Error("Objednávka nenalezena.")

  sendPaymentReceipt({
    order: {
      ...updatedOrder,
      shippingAddress: updatedOrder.shippingAddress as ShippingAddress,
      paymentResult: updatedOrder.paymentResult as PaymentResult,
    },
  })
}

// Get user's orders
export async function getMyOrders({
  limit = PAGE_SIZE,
  page,
}: {
  limit?: number
  page: number
}) {
  const session = await auth()
  if (!session) throw new Error("Uživatel neautorizován.")

  const data = await prisma.order.findMany({
    where: { userId: session?.user?.id },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: (page - 1) * limit,
  })

  const dataCount = await prisma.order.count({
    where: { userId: session?.user?.id },
  })

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  }
}

type SalesDataType = {
  month: string
  totalSales: number
}[]

// Get sales data and order summary
export async function getOrderSummary() {
  // Get counts for each resource
  const ordersCount = await prisma.order.count()
  const productsCount = await prisma.product.count()
  const usersCount = await prisma.user.count()

  // Calculate the total sales
  const totalSales = await prisma.order.aggregate({
    _sum: { totalPrice: true },
  })

  // Get monthly sales
  const salesDataRaw = await prisma.$queryRaw<
    Array<{ month: string; totalSales: Prisma.Decimal }>
  >`SELECT to_char("createdAt", 'MM/YY') as "month", sum("totalPrice") as "totalSales" FROM "Order" GROUP BY to_char("createdAt", 'MM/YY')`

  const salesData: SalesDataType = salesDataRaw.map((entry) => ({
    month: entry.month,
    totalSales: Number(entry.totalSales),
  }))

  // Get latest sales
  const latestSales = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true } },
    },
    take: 6,
  })

  return {
    ordersCount,
    productsCount,
    usersCount,
    totalSales,
    latestSales,
    salesData,
  }
}

// Get all orders
export async function getAllOrders({
  limit = PAGE_SIZE,
  page,
  query,
}: {
  limit?: number
  page: number
  query: string
}) {
  const queryFilter: Prisma.OrderWhereInput =
    query && query !== "all"
      ? {
          user: {
            name: {
              contains: query,
              mode: "insensitive",
            } as Prisma.StringFilter,
          },
        }
      : {}

  const data = await prisma.order.findMany({
    where: {
      ...queryFilter,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: (page - 1) * limit,
    include: { user: { select: { name: true } } },
  })

  const dataCount = await prisma.order.count()

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  }
}

// Delete an order
export async function deleteOrder(id: string) {
  try {
    await prisma.order.delete({ where: { id } })

    revalidatePath("/admin/objednavky")

    return {
      success: true,
      message: "Objednávka byla úspěšně smazána.",
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

// Update COD order to paid
export async function updateOrderToPaidCOD(orderId: string) {
  try {
    await updateOrderToPaid({ orderId })

    revalidatePath(`/moje-objednavky/${orderId}`)

    return { success: true, message: "Objednávka byla označena jako zaplacená" }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

// Update COD order to delivered
export async function deliverOrder(orderId: string) {
  try {
    const order = await prisma.order.findFirst({
      where: { id: orderId },
    })

    if (!order) throw new Error("Objednávka nenalezena")
    if (!order.isPaid && order.paymentMethod !== "Hotovost")
      throw new Error("Objednávka není zaplacena")

    await prisma.order.update({
      where: { id: orderId },
      data: {
        isDelivered: true,
        deliveredAt: new Date(),
      },
    })

    const updatedOrder = await prisma.order.findFirst({
      where: { id: orderId },
      include: {
        orderitems: true,
        user: { select: { name: true, email: true } },
      },
    })

    if (updatedOrder) {
      sendPurchaseReceipt({
        order: {
          ...updatedOrder,
          shippingAddress: updatedOrder.shippingAddress as ShippingAddress,
          paymentResult: updatedOrder.paymentResult as PaymentResult,
        },
      })
    }

    revalidatePath(`/moje-objednavky/${orderId}`)

    return {
      success: true,
      message: "Objednávka byla označena jako doručená",
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}
