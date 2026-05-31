import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import ProductPrice from "./product-price"
import { Cart, Product } from "@/types"
import AddToCart from "../product/add-to-cart"
import Rating from "./rating"
import ProductCardImage from "./product-card-image"

// Pozn.: Karta NEsmí volat getMyCart() interně. Když se v listu vyrenderuje
// 12 karet, dělalo to 12× DB query + 12× cookie read. Cart si vyzvedne
// rodičovský list (ProductList) jednou a předá ho přes props.
const ProductCard = ({ cart, product }: { cart?: Cart; product: Product }) => {
  return (
    <Card className="w-full">
      <CardHeader className="p-0 items-center">
        <Link href={`/produkt/${product.slug}`} className="mt-2">
          <ProductCardImage
            src={product.images[0]}
            alt={product.name}
            width={250}
            aspect="250 / 444"
            sizes="250px"
            className="hidden lg:block"
          />
          <ProductCardImage
            src={product.images[0]}
            alt={product.name}
            width={150}
            aspect="250 / 444"
            sizes="150px"
            className="lg:hidden"
          />
        </Link>
      </CardHeader>
      <CardContent className="p-1 sm:p-4 grid gap-4">
        <div className="text-sm text-center font-cairo">{product.brand}</div>
        <Link href={`/produkt/${product.slug}`} className="h-12 text-center">
          <h2 className="font-bold font-cairo text-sm sm:text-base">
            {product.sort} {product.year}
            <br />
            <span className="font-medium">
              {product.attribute} {product.sweetCat}
            </span>
          </h2>
        </Link>
        <div className="flex-center flex-wrap sm:flex-between sm:gap-4">
          <Rating value={Number(product.rating)} />
          {product.stock > 0 ? (
            <ProductPrice
              value={Number(product.price)}
              className="w-full sm:w-auto mt-4 sm:mt-0 text-center sm:text-left"
            />
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
