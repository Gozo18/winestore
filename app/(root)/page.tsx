import ProductList from "@/components/shared/product/product-list"
import {
  getLatestProducts,
  getFeaturedProducts,
} from "@/lib/actions/product.actions"
import ProductCarousel from "@/components/shared/product/product-carousel"
import ViewAllProductsButton from "@/components/view-all-products-button"
import HomepageLinks from "@/components/shared/homepage-links"
import { APP_NAME } from "@/lib/constants"

const Homepage = async () => {
  const latestProducts = await getLatestProducts()
  const featuredProducts = await getFeaturedProducts()

  return (
    <>
      {featuredProducts.length > 0 && (
        <ProductCarousel data={featuredProducts} />
      )}
      <h1 className="mt-4 md:mt-10 text-center">
        <span className="font-bold font-cairo text-xl lg:text-2xl">
          {APP_NAME}
        </span>{" "}
        - rodinné vinařství z Pavlova
      </h1>
      <HomepageLinks />
      <ProductList
        data={latestProducts}
        title="Nejnovější produkty"
        limit={4}
      />
      <ViewAllProductsButton />
    </>
  )
}

export default Homepage
