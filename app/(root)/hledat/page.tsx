import ProductCard from "@/components/shared/product/product-card"
import { Button } from "@/components/ui/button"
import { getAllProducts, getAllCategories } from "@/lib/actions/product.actions"
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
    <div className="grid md:grid-cols-5 md:gap-5">
      <div className="filter-links">
        {/* Category Links */}
        <div className="text-xl mb-2 mt-3">Kategorie</div>
        <div>
          <ul className="space-y-1">
            <li>
              <Link
                className={`${
                  (category === "all" || category === "") && "font-bold"
                }`}
                href={getFilterUrl({ c: "all" })}
              >
                Všechny
              </Link>
            </li>
            {categories.map((x) => (
              <li key={x.category}>
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
        <div className="text-xl mb-2 mt-8">Cena</div>
        <div>
          <ul className="space-y-1">
            <li>
              <Link
                className={`${price === "all" && "font-bold"}`}
                href={getFilterUrl({ p: "all" })}
              >
                Všechny
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
        <div className="text-xl mb-2 mt-8">Hodnocení zákazníků</div>
        <div>
          <ul className="space-y-1">
            <li>
              <Link
                className={`${rating === "all" && "font-bold"}`}
                href={getFilterUrl({ r: "all" })}
              >
                Všechny
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
      <div className="md:col-span-4 space-y-4">
        <div className="flex-between flex-col md:flex-row my-4">
          <div className="flex items-center">
            {q !== "all" && q !== "" && "Hledat: " + q}
            {category !== "all" && category !== "" && " kategorie: " + category}
            {price !== "all" && " cena: " + price}
            {rating !== "all" && " hodnocení: " + rating + " hvězd a více"}
            &nbsp;
            {(q !== "all" && q !== "") ||
            (category !== "all" && category !== "") ||
            rating !== "all" ||
            price !== "all" ? (
              <Button variant={"outline"} asChild>
                <Link href="/hledat">Zrušit</Link>
              </Button>
            ) : null}
          </div>
          <div>
            Řadil podle{" "}
            {sortOrders.map((s) => (
              <Link
                key={s.value}
                className={`mx-2 ${sort == s.value && "font-bold"}`}
                href={getFilterUrl({ s: s.value })}
              >
                {s.name}
              </Link>
            ))}
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
