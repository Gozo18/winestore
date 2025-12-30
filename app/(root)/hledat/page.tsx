import ProductCard from "@/components/shared/product/product-card"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getAllProducts, getAllCategories } from "@/lib/actions/product.actions"
import { DropdownMenu } from "@radix-ui/react-dropdown-menu"
import { ChevronDownIcon } from "lucide-react"
import Link from "next/link"

const prices = [
  {
    name: "100 - 150 Kč",
    value: "100-150",
  },
  {
    name: "151 - 200 Kč",
    value: "151-200",
  },
  {
    name: "201 - 250 Kč",
    value: "201-250",
  },
  {
    name: "251 - 500 Kč",
    value: "251-500",
  },
]

const ratings = [4, 3, 2, 1]

const sortOrders = [
  { value: "newest", name: "nejnovější" },
  { value: "sugar-low", name: "nejsušší" },
  { value: "sugar-high", name: "nejsladší" },
  { value: "lowest", name: "nejlevnější" },
  { value: "highest", name: "nejdražší" },
  { value: "rating", name: "hodnocení" },
]

export async function generateMetadata(props: {
  searchParams: Promise<{
    q: string
    category: string
    price: string
    rating: string
  }>
}) {
  const {
    q = "all",
    category = "all",
    price = "all",
    rating = "all",
  } = await props.searchParams

  const isQuerySet = q && q !== "all" && q.trim() !== ""
  const isCategorySet = category && category !== "all" && category.trim() !== ""
  const isPriceSet = price && price !== "all" && price.trim() !== ""
  const isRatingSet = rating && rating !== "all" && rating.trim() !== ""

  if (isQuerySet || isCategorySet || isPriceSet || isRatingSet) {
    return {
      title: `
      Hledat ${isQuerySet ? q : ""} 
      ${isCategorySet ? `: Kategorie ${category}` : ""}
      ${isPriceSet ? `: Cena ${price}` : ""}
      ${isRatingSet ? `: Hodnocení ${rating}` : ""}`,
    }
  } else {
    return {
      title: "Naše vína",
    }
  }
}

const SearchPage = async (props: {
  searchParams: Promise<{
    q?: string
    category?: string
    price?: string
    rating?: string
    sort?: string
    page?: string
  }>
}) => {
  const {
    q = "all",
    category = "all",
    price = "all",
    rating = "all",
    sort = "newest",
    page = "1",
  } = await props.searchParams

  // Construct filter url
  const getFilterUrl = ({
    c,
    p,
    s,
    r,
    pg,
  }: {
    c?: string
    p?: string
    s?: string
    r?: string
    pg?: string
  }) => {
    const params = { q, category, price, rating, sort, page }

    if (c) params.category = c
    if (p) params.price = p
    if (s) params.sort = s
    if (r) params.rating = r
    if (pg) params.page = pg

    return `/hledat?${new URLSearchParams(params).toString()}`
  }

  const products = await getAllProducts({
    query: q,
    category,
    price,
    rating,
    sort,
    page: Number(page),
  })

  const categories = await getAllCategories()

  return (
    <div className="grid lg:grid-cols-5 lg:gap-5">
      <div className="filter-links bg-gray-100 rounded-lg p-4">
        {/* Category Links */}
        <div className="mb-2">Kategorie</div>
        <div>
          <ul className="flex justify-between lg:block lg:space-y-1 text-sm flex-wrap">
            <li className="min-w-24 mb-4 lg:mb-0">
              <Link
                className={`${
                  (category === "all" || category === "") && "font-bold"
                }`}
                href={getFilterUrl({ c: "all" })}
              >
                Vše
              </Link>
            </li>
            {categories.map((x) => (
              <li key={x.category} className="min-w-24 mb-4 md:mb-0">
                <Link
                  className={`${category === x.category && "font-bold"}`}
                  href={getFilterUrl({ c: x.category })}
                >
                  {x.category}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* Price Links */}
        <div className="hidden lg:block mb-2 mt-8">Cena</div>
        <div className="hidden  lg:block">
          <ul className="space-y-1 text-sm">
            <li>
              <Link
                className={`${price === "all" && "font-bold"}`}
                href={getFilterUrl({ p: "all" })}
              >
                Vše
              </Link>
            </li>
            {prices.map((p) => (
              <li key={p.value}>
                <Link
                  className={`${price === p.value && "font-bold"}`}
                  href={getFilterUrl({ p: p.value })}
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* Rating Links */}
        <div className="hidden  lg:block mb-2 mt-8">Hodnocení zákazníků</div>
        <div className="hidden  lg:block">
          <ul className="space-y-1 text-sm">
            <li>
              <Link
                className={`${rating === "all" && "font-bold"}`}
                href={getFilterUrl({ r: "all" })}
              >
                Vše
              </Link>
            </li>
            {ratings.map((r) => (
              <li key={r}>
                <Link
                  className={`${rating === r.toString() && "font-bold"}`}
                  href={getFilterUrl({ r: `${r}` })}
                >
                  {`${r} hvězdy a více`}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="lg:col-span-4 space-y-4">
        <div className="flex-between my-4">
          <div className="flex items-center text-xs flex-wrap gap-1 mr-4">
            {q !== "all" && q !== "" && "Hledat: " + q}
            {category !== "all" && category !== "" && (
              <>
                kategorie: <span className="font-bold ml-1">{category}</span>
              </>
            )}
            {price !== "all" && (
              <>
                cena: <span className="font-bold ml-1">{price} Kč</span>
              </>
            )}
            {rating !== "all" && (
              <>
                hodnocení:{" "}
                <span className="font-bold ml-1">{rating} hvězd a více</span>
              </>
            )}
            &nbsp;
            {(q !== "all" && q !== "") ||
            (category !== "all" && category !== "") ||
            rating !== "all" ||
            price !== "all" ? (
              <Link href="/hledat" className="ml-4 underline font-normal">
                zrušit
              </Link>
            ) : null}
          </div>
          <div className="text-sm flex flex-wrap">
            <div className="hidden lg:block">
              <ButtonGroup>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs hover:bg-white cursor-default"
                >
                  Řadit podle:
                </Button>
                {sortOrders.map((s) => (
                  <Button variant="outline" size="sm" asChild key={s.value}>
                    <Link
                      className={`text-xs ${
                        sort == s.value &&
                        "font-bold bg-black text-white hover:bg-black hover:text-white"
                      }`}
                      href={getFilterUrl({ s: s.value })}
                    >
                      {s.name}
                    </Link>
                  </Button>
                ))}
              </ButtonGroup>
            </div>
            <div className="lg:hidden">
              <ButtonGroup>
                <Button variant="outline" size="sm">
                  Řadit podle:
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="!pl-2">
                      <ChevronDownIcon />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="[--radius:1rem]">
                    <DropdownMenuGroup>
                      {sortOrders.map((s) => (
                        <DropdownMenuItem asChild key={s.value}>
                          <Link
                            className={`text-xs ${
                              sort == s.value &&
                              "font-bold bg-black text-white hover:bg-black hover:text-white"
                            }`}
                            href={getFilterUrl({ s: s.value })}
                          >
                            {s.name}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </ButtonGroup>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {products.data.length === 0 && <div>Žádný produkt nenalezen.</div>}
          {products.data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default SearchPage
