import Link from "next/link"
import { getAllProducts, deleteProduct } from "@/lib/actions/product.actions"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Pagination from "@/components/shared/pagination"
import DeleteDialog from "@/components/shared/delete-dialog"
import { requireAdmin } from "@/lib/auth-guard"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Produkty - Admin",
}

const AdminProductsPage = async (props: {
  searchParams: Promise<{
    page: string
    query: string
    category: string
  }>
}) => {
  await requireAdmin()

  const searchParams = await props.searchParams

  const page = Number(searchParams.page) || 1
  const searchText = searchParams.query || ""
  const category = searchParams.category || ""

  const products = await getAllProducts({
    query: searchText,
    page,
    category,
  })

  return (
    <div className="space-y-2">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <h1 className="h2-bold">Produkty</h1>
          {searchText && (
            <div>
              Filtrováno <i>&quot;{searchText}&quot;</i>{" "}
              <Link href="/admin/produkty">
                <Button variant="outline" size="sm">
                  Zrušit filtr
                </Button>
              </Link>
            </div>
          )}
        </div>
        <Button asChild variant="default">
          <Link href="/admin/produkty/novy">Nový produkt</Link>
        </Button>
      </div>

      <Table>
        <TableHeader className="text-xs md:text-base">
          <TableRow>
            <TableHead>NÁZEV</TableHead>
            <TableHead className="text-right">CENA</TableHead>
            <TableHead>KATEGORIE</TableHead>
            <TableHead>SKLADEM</TableHead>
            <TableHead>HODNOCENÍ</TableHead>
            <TableHead className="w-[100px]">MOŽNOSTI</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-xs md:text-base">
          {products.data.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell className="text-right">
                {formatCurrency(product.price)}
              </TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>{product.rating}</TableCell>
              <TableCell className="flex gap-1">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/produkty/${product.id}`}>Upravit</Link>
                </Button>
                <DeleteDialog id={product.id} action={deleteProduct} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {products.totalPages > 1 && (
        <Pagination page={page} totalPages={products.totalPages} />
      )}
    </div>
  )
}

export default AdminProductsPage
