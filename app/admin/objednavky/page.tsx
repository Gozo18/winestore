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
          <TableHeader className="text-xs md:text-base">
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
          <TableBody className="text-xs md:text-base">
            {orders.data.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{formatId(order.id)}</TableCell>
                <TableCell>
                  {formatDateTime(order.createdAt).dateTime}
                </TableCell>
                <TableCell>{order.user.name}</TableCell>
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
                <TableCell className="flex">
                  <Button asChild size="sm">
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
