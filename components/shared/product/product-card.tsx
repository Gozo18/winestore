import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import ProductPrice from "./product-price"
import { Product } from "@/types"
import AddToCart from "../product/add-to-cart"
import { getMyCart } from "@/lib/actions/cart.actions"
import Rating from "./rating"

const ProductCard = async ({ product }: { product: Product }) => {
  const cart = await getMyCart()

  return (
    <Card className="w-full">
      <CardHeader className="p-0 items-center">
        <Link href={`/produkt/${product.slug}`} className="mt-2">
          <Image
            src={product.images[0]}
            alt={product.name}
            width={300}
            height={300}
            priority={true}
            className="hidden lg:block"
          />
          <Image
            src={product.images[0]}
            alt={product.name}
            width={150}
            height={150}
            priority={true}
            className="lg:hidden"
          />
        </Link>
      </CardHeader>
      <CardContent className="p-4 grid gap-4">
        <div className="text-sm text-center font-cairo">{product.brand}</div>
        <Link href={`/product/${product.slug}`} className="h-12 text-center">
          <h2 className="font-bold font-cairo">
            {product.sort} {product.year}
            <br />
            <span className="font-medium">
              {product.attribute} {product.sweetCat}
            </span>
          </h2>
        </Link>
        <div className="flex-between gap-4">
          <Rating value={Number(product.rating)} />
          {product.stock > 0 ? (
            <ProductPrice value={Number(product.price)} />
          ) : (
            <p className="text-destructive">Vyprodáno</p>
          )}
        </div>
        {product.stock > 0 && (
          <div className="flex-center">
            <AddToCart
              cart={cart}
              item={{
                productId: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                qty: 1,
                image: product.images![0],
              }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default ProductCard
