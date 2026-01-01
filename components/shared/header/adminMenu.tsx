import { EllipsisVertical } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import UserButton from "./user-button"
import UserButtonMobile from "./user-button-mobile"

const AdminMenu = async () => {
  return (
    <div className="flex justify-end gap-3">
      <nav className="hidden lg:flex w-full gap-1">
        <UserButton />
      </nav>
      <nav className="lg:hidden">
        <Sheet>
          <SheetTrigger className="align-middle ml-4 mb-2">
            <EllipsisVertical />
          </SheetTrigger>
          <SheetContent className="flex flex-col items-start">
            <SheetTitle>Menu</SheetTitle>
            <UserButtonMobile />
            <SheetDescription></SheetDescription>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  )
}

export default AdminMenu
