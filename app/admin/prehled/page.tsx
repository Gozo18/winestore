import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getOrderSummary } from "@/lib/actions/order.actions"
import { formatCurrency, formatDateTime, formatNumber } from "@/lib/utils"
import { BadgeDollarSign, Barcode, CreditCard, Users } from "lucide-react"
import { Metadata } from "next"
import Link from "next/link"
import Charts from "./charts"
import { requireAdmin } from "@/lib/auth-guard"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Přehled - Admin",
}

const AdminOverviewPage = async () => {
  await requireAdmin()

  const summary = await getOrderSummary()

  return (
    <div className="space-y-2">
      <h1 className="h2-bold">Přehled</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm md:text-lg font-medium">
              Celkový obrat
            </CardTitle>
            <BadgeDollarSign />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold">
              {formatCurrency(
                summary.totalSales._sum.totalPrice?.toString() || 0
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm md:text-lg font-medium">
              Prodeje
            </CardTitle>
            <CreditCard />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold">
              {formatNumber(summary.ordersCount)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm md:text-lg font-medium">
              Zákazníci
            </CardTitle>
            <Users />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold">
              {formatNumber(summary.usersCount)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm md:text-lg font-medium">
              Produkty
            </CardTitle>
            <Barcode />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold">
              {formatNumber(summary.productsCount)}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="md:grid md:gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="w-full md:w-auto md:col-span-4 my-4 md:my-0">
          <CardHeader>
            <CardTitle className="text-sm md:text-lg font-medium">
              Přehled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Charts
              data={{
                salesData: summary.salesData,
              }}
            />
          </CardContent>
        </Card>
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle className="text-sm md:text-lg font-medium">
              Poslední objednávky
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader className="text-xs md:text-base">
                <TableRow>
                  <TableHead>ZÁKAZNÍK</TableHead>
                  <TableHead>DATUM</TableHead>
                  <TableHead>CELKEM</TableHead>
                  <TableHead>MOŽNOSTI</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-xs md:text-base">
                {summary.latestSales.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      {order?.user?.name ? order.user.name : "Smazaný uživatel"}
                    </TableCell>
                    <TableCell>
                      {formatDateTime(order.createdAt).dateOnly}
                    </TableCell>
                    <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                    <TableCell>
                      <Button asChild>
                        <Link href={`/moje-objednavky/${order.id}`}>
                          Detail
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminOverviewPage
