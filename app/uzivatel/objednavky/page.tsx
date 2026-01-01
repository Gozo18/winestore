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
                  {order.isPaid && order.paidAt
                    ? formatDateTime(order.paidAt).dateTime
                    : "Nezaplaceno"}
                </TableCell>
                <TableCell>
                  {order.isDelivered && order.deliveredAt
                    ? formatDateTime(order.deliveredAt).dateTime
                    : "Nedoručeno"}
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
