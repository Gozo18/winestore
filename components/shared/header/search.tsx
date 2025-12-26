import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getAllCategories } from "@/lib/actions/product.actions"
import { SearchIcon } from "lucide-react"

const Search = async () => {
  const categories = await getAllCategories()

  return (
    <form action="/hledat" method="GET">
      <div className="flex w-full max-w-sm items-center lg:space-x-2 flex-col lg:flex-row">
        <Select name="category">
          <SelectTrigger className="w-full lg:w-[180px] mb-2 lg:mb-0">
            <SelectValue placeholder="Všechny" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key="Všechny" value="all">
              Všechny
            </SelectItem>
            {categories.map((x) => (
              <SelectItem key={x.category} value={x.category}>
                {x.category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          name="q"
          type="text"
          placeholder="Hledat..."
          className="w-full lg:w-[150px] xlg:w-[300px] mb-2 lg:mb-0"
        />
        <Button className="w-full lg:w-auto">
          <SearchIcon />
        </Button>
      </div>
    </form>
  )
}

export default Search
