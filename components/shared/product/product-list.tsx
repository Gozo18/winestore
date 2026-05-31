import ProductCard from "./product-card"
import { Product } from "@/types"
import { getMyCart } from "@/lib/actions/cart.actions"

// Cart načítáme JEDNOU pro celý list a předáváme do karet přes props.
// Před refaktorem si každá ProductCard volala getMyCart() sama → na 12-položkové
// stránce to znamenalo 12× cookie read + 12× DB query místo jednoho.
const ProductList = async ({
  data,
  title,
  limit,
}: {
  data: Product[]
  title?: string
  limit?: number
}) => {
  const limitedData = limit ? data.slice(0, limit) : data
  const cart = await getMyCart()

  return (
    <div className="my-4 md:my-10">
      <h2 className="font-bold font-cairo text-xl lg:text-2xl mb-4 text-center">
        {title}
      </h2>
      {data.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
          {limitedData.map((product: Product) => (
            <ProductCard key={product.slug} cart={cart} product={product} />
          ))}
        </div>
      ) : (
        <div>
          <p>Žádné produkty</p>
        </div>
      )}
    </div>
  )
}

export default ProductList
