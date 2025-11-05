import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { deleteOrder, getAllOrders } from "@/lib/actions/order.actions"
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils"
import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Pagination from "@/components/shared/pagination"
import DeleteDialog from "@/components/shared/delete-dialog"
import { requireAdmin } from "@/lib/auth-guard"

export const metadata: Metadata = {
  title: "Všechny objednávky - Admin",
}

const AdminOrdersPage = async (props: {
  searchParams: Promise<{ page: string; query: string }>
}) => {
  const { page = "1", query: searchText } = await props.searchParams

  await requireAdmin()

  const orders = await getAllOrders({
    page: Number(page),
    query: searchText,
  })

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <h1 className="h2-bold">Objednávky</h1>
        {searchText && (
          <div>
            Filtrováno <i>&quot;{searchText}&quot;</i>{" "}
            <Link href="/admin/objednavky">
              <Button variant="outline" size="sm">
                Zrušit filtr
              </Button>
            </Link>
          </div>
        )}
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>DATUM</TableHead>
              <TableHead>ZÁKAZNÍK</TableHead>
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
                <TableCell>{order.user.name}</TableCell>
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
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/moje-objednavky/${order.id}`}>Detail</Link>
                  </Button>
                  <DeleteDialog id={order.id} action={deleteOrder} />
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

export default AdminOrdersPage
