import { Metadata } from "next"
import { getAllUsers, deleteUser } from "@/lib/actions/user.actions"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatId } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Pagination from "@/components/shared/pagination"
import { Badge } from "@/components/ui/badge"
import DeleteDialog from "@/components/shared/delete-dialog"
import { requireAdmin } from "@/lib/auth-guard"

export const metadata: Metadata = {
  title: "Uživatelé - Admin",
}

const AdminUserPage = async (props: {
  searchParams: Promise<{
    page: string
    query: string
  }>
}) => {
  await requireAdmin()

  const { page = "1", query: searchText } = await props.searchParams

  const users = await getAllUsers({ page: Number(page), query: searchText })

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <h1 className="h2-bold">Uživatelé</h1>
        {searchText && (
          <div>
            Filtrováno <i>&quot;{searchText}&quot;</i>{" "}
            <Link href="/admin/uzivatele">
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
              <TableHead>JMÉNO</TableHead>
              <TableHead>E-MAIL</TableHead>
              <TableHead>ROLE</TableHead>
              <TableHead>MOŽNOSTI</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.data.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{formatId(user.id)}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.role === "user" ? (
                    <Badge variant="secondary">User</Badge>
                  ) : null}
                  {user.role === "b2b" ? (
                    <Badge variant="default">B2B</Badge>
                  ) : null}
                  {user.role === "admin" ? (
                    <Badge
                      variant="secondary"
                      className="bg-blue-500 text-white dark:bg-blue-600"
                    >
                      Admin
                    </Badge>
                  ) : null}
                </TableCell>
                <TableCell>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/uzivatele/${user.id}`}>Upravit</Link>
                  </Button>
                  <DeleteDialog id={user.id} action={deleteUser} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {users.totalPages > 1 && (
          <Pagination page={Number(page) || 1} totalPages={users?.totalPages} />
        )}
      </div>
    </div>
  )
}

export default AdminUserPage
