import { Metadata } from "next"
import ProductForm from "@/components/admin/product-form"
import { requireAdmin } from "@/lib/auth-guard"

export const metadata: Metadata = {
  title: "Nový produkt - Admin",
}

const CreateProductPage = async () => {
  await requireAdmin()
  return (
    <>
      <h1 className="h2-bold">Nový produkt</h1>
      <div className="my-8">
        <ProductForm type="Create" />
      </div>
    </>
  )
}

export default CreateProductPage
