import { Metadata } from "next"
import { getMyOrders } from "@/lib/actions/order.actions"
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils"
import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Pagination from "@/components/shared/pagination"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Moje objednávky",
}

const OrdersPage = async (props: {
  searchParams: Promise<{ page: string }>
}) => {
  const { page } = await props.searchParams

  const orders = await getMyOrders({
    page: Number(page) || 1,
  })

  return (
    <div className="space-y-2">
      <h2 className="h2-bold text-lg md:text-xl">Moje objednávky</h2>
      <div className="overflow-x-auto">
        <Table className="text-xs md:text-base">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>DATUM</TableHead>
              <TableHead>CELKEM</TableHead>
              <TableHead>ZAPLACENO</TableHead>
              <TableHead>DORUČENO</TableHead>
              <TableHead>MOŽNOSTI</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.data.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{formatId(order.id)}</TableCell>
                <TableCell>
                  {formatDateTime(order.createdAt).dateTime}
                </TableCell>
                <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                <TableCell>
                  {order.isPaid && order.paidAt ? (
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-secondary/80 bg-[#72bf80] text-white dark:bg-[#72bf80]">
                      {formatDateTime(order.paidAt).dateTime}
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-secondary/80 bg-[#ec4f4f] text-white dark:bg-[#ec4f4f]">
                      Nezaplaceno
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {order.isDelivered && order.deliveredAt ? (
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-secondary/80 bg-[#72bf80] text-white dark:bg-[#72bf80]">
                      {formatDateTime(order.deliveredAt).dateTime}
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-secondary/80 bg-[#ec4f4f] text-white dark:bg-[#ec4f4f]">
                      Nedoručeno
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <Button asChild>
                    <Link href={`/moje-objednavky/${order.id}`}>Detail</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {orders.totalPages > 1 && (
          <Pagination
            page={Number(page) || 1}
            totalPages={orders?.totalPages}
          />
        )}
      </div>
    </div>
  )
}

export default OrdersPage
