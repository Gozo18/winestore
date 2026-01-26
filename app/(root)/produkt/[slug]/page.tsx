import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { getProductBySlug } from "@/lib/actions/product.actions"
import { notFound } from "next/navigation"
import ProductPrice from "@/components/shared/product/product-price"
import ProductImages from "@/components/shared/product/product-images"
import AddToCart from "@/components/shared/product/add-to-cart"
import { getMyCart } from "@/lib/actions/cart.actions"
import ReviewList from "./review-list"
import { auth } from "@/auth"
import Rating from "@/components/shared/product/rating"

const ProductDetailsPage = async (props: {
  params: Promise<{ slug: string }>
}) => {
  const { slug } = await props.params

  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const session = await auth()
  const userId = session?.user?.id

  const cart = await getMyCart()

  const alcohol = Number(product.alcohol)
  const sugar = Number(product.sugar)
  const acid = Number(product.acid)

  return (
    <>
      <section>
        <div className="grid grid-cols-1 md:grid-cols-5">
          {/* Images */}
          <div className="col-span-2">
            <ProductImages
              images={product.images}
              name={product.name}
              brand={product.brand}
            />
          </div>
          {/* Details */}
          <div className="col-span-2 p-5">
            <div className="flex flex-col gap-6">
              <p className="font-cairo">
                {product.brand} - {product.category}
              </p>
              <h1 className="h3-bold font-cairo">
                {product.sort} {product.year} <br />{" "}
                <span className="font-medium">
                  {product.attribute} {product.sweetCat}
                </span>
              </h1>
              <Rating value={Number(product.rating)} />
              <p>{product.numReviews} recenzí</p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <ProductPrice
                  value={Number(product.price)}
                  className="w-40 rounded-full bg-[#72bf80] text-white px-5 py-2 text-center"
                />
              </div>
            </div>
            <div className="mt-6">
              <p className="font-semibold">Popis</p>
              <p className="mt-4">
                Alkohol: <span className="font-semibold">{alcohol}%</span>
              </p>
              <p>
                Zbytkový cukr: <span className="font-semibold">{sugar}g</span>
              </p>
              <p>
                Kyselinky: <span className="font-semibold">{acid}g</span>
              </p>
              <p className="my-4">{product.description}</p>
            </div>
          </div>
          {/* Actions */}
          <div className="lg:mt-5">
            <Card>
              <CardContent className="p-4">
                <div className="mb-4 flex justify-between">
                  <div>Cena</div>
                  <div>
                    <ProductPrice value={Number(product.price)} />
                  </div>
                </div>
                <div className="mb-4 flex justify-between">
                  <div>Dostupnost</div>
                  {product.stock > 0 ? (
                    <Badge
                      variant="secondary"
                      className="bg-[#72bf80] text-white dark:bg-[#72bf80]"
                    >
                      Skladem
                    </Badge>
                  ) : (
                    <Badge variant="destructive">Není skladem</Badge>
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
          </div>
        </div>
      </section>
      <section className="mt-10">
        <h2 className="h2-bold mb-5">Zákaznické recenze</h2>
        <ReviewList
          userId={userId || ""}
          productId={product.id}
          productSlug={product.slug}
        />
      </section>
    </>
  )
}

export default ProductDetailsPage
