"use client"

import { useToast } from "@/hooks/use-toast"
import { productDefaultValues } from "@/lib/constants"
import { insertProductSchema, updateProductSchema } from "@/lib/validators"
import { Product } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { ControllerRenderProps, SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"
import slugify from "slugify"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { createProduct, updateProduct } from "@/lib/actions/product.actions"
import { UploadButton } from "@/lib/uploadthing"
import { Card, CardContent } from "../ui/card"
import Image from "next/image"
import { Checkbox } from "../ui/checkbox"

const ProductForm = ({
  type,
  product,
  productId,
}: {
  type: "Create" | "Update"
  product?: Product
  productId?: string
}) => {
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof insertProductSchema>>({
    resolver: zodResolver(
      type === "Create" ? insertProductSchema : updateProductSchema,
    ),
    defaultValues:
      product && type === "Update" ? product : productDefaultValues,
  })

  const onSubmit: SubmitHandler<z.infer<typeof insertProductSchema>> = async (
    values,
  ) => {
    // On Create
    if (type === "Create") {
      const res = await createProduct(values)

      if (!res.success) {
        toast({
          variant: "destructive",
          description: res.message,
        })
      } else {
        toast({
          description: res.message,
        })
        router.push("/admin/produkty")
      }
    }

    // On Update
    if (type === "Update") {
      if (!productId) {
        router.push("/admin/produkty")
        return
      }

      const res = await updateProduct({ ...values, id: productId })

      if (!res.success) {
        toast({
          variant: "destructive",
          description: res.message,
        })
      } else {
        toast({
          description: res.message,
        })
        router.push("/admin/produkty")
      }
    }
  }

  const images = form.watch("images")
  const isFeatured = form.watch("isFeatured")
  const banner = form.watch("banner")

  return (
    <Form {...form}>
      <form
        method="POST"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <div className="flex flex-col md:flex-row gap-5">
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductSchema>,
                "name"
              >
            }) => (
              <FormItem className="w-full">
                <FormLabel>Název</FormLabel>
                <FormControl>
                  <Input placeholder="Zadejte název produktu" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Slug */}
          <FormField
            control={form.control}
            name="slug"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductSchema>,
                "slug"
              >
            }) => (
              <FormItem className="w-full">
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input placeholder="Zadejte slug produktu" {...field} />
                    <Button
                      type="button"
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 mt-2"
                      onClick={() => {
                        form.setValue(
                          "slug",
                          slugify(form.getValues("name"), { lower: true }),
                        )
                      }}
                    >
                      Vygenerovat slug
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col md:flex-row gap-5">
          {/* Category */}
          <FormField
            control={form.control}
            name="category"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductSchema>,
                "category"
              >
            }) => (
              <FormItem className="w-full">
                <FormLabel>Kategorie</FormLabel>
                <FormControl>
                  <Input placeholder="Zadejte kategorii produktu" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Brand */}
          <FormField
            control={form.control}
            name="brand"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductSchema>,
                "brand"
              >
            }) => (
              <FormItem className="w-full">
                <FormLabel>Značka</FormLabel>
                <FormControl>
                  <Input placeholder="Zadejte značku produktu" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col md:flex-row gap-5">
          {/* Sort */}
          <FormField
            control={form.control}
            name="sort"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductSchema>,
                "sort"
              >
            }) => (
              <FormItem className="w-full">
                <FormLabel>Odrůda</FormLabel>
                <FormControl>
                  <Input placeholder="Zadejte odrůdu produktu" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Year */}
          <FormField
            control={form.control}
            name="year"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductSchema>,
                "year"
              >
            }) => (
              <FormItem className="w-full">
                <FormLabel>Rok</FormLabel>
                <FormControl>
                  <Input placeholder="Zadejte rok produktu" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col md:flex-row gap-5">
          {/* Attribute */}
          <FormField
            control={form.control}
            name="attribute"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductSchema>,
                "attribute"
              >
            }) => (
              <FormItem className="w-full">
                <FormLabel>Přívlastek</FormLabel>
                <FormControl>
                  <Input placeholder="Zadejte přívlastek produktu" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* SweetCat */}
          <FormField
            control={form.control}
            name="sweetCat"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductSchema>,
                "sweetCat"
              >
            }) => (
              <FormItem className="w-full">
                <FormLabel>Sladkost</FormLabel>
                <FormControl>
                  <Input placeholder="Zadejte sladkost produktu" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col md:flex-row gap-5">
          {/* Alcohol */}
          <FormField
            control={form.control}
            name="alcohol"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductSchema>,
                "alcohol"
              >
            }) => (
              <FormItem className="w-full">
                <FormLabel>Alkohol</FormLabel>
                <FormControl>
                  <Input placeholder="Zadejte alkohol produktu" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Sugar */}
          <FormField
            control={form.control}
            name="sugar"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductSchema>,
                "sugar"
              >
            }) => (
              <FormItem className="w-full">
                <FormLabel>Zbytkový cukr</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Zadejte zbytkový cukr produktu"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col md:flex-row gap-5">
          {/* Acid */}
          <FormField
            control={form.control}
            name="acid"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductSchema>,
                "acid"
              >
            }) => (
              <FormItem className="w-full">
                <FormLabel>Kyselina</FormLabel>
                <FormControl>
                  <Input placeholder="Zadejte kyselinu produktu" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col md:flex-row gap-5">
          {/* Price */}
          <FormField
            control={form.control}
            name="price"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductSchema>,
                "price"
              >
            }) => (
              <FormItem className="w-full">
                <FormLabel>Cena</FormLabel>
                <FormControl>
                  <Input placeholder="Zadejte cenu produktu" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Stock */}
          <FormField
            control={form.control}
            name="stock"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductSchema>,
                "stock"
              >
            }) => (
              <FormItem className="w-full">
                <FormLabel>Na skladě</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Zadejte počet kusů na skladě"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="upload-field flex flex-col md:flex-row gap-5">
          {/* Images */}
          <FormField
            control={form.control}
            name="images"
            render={() => (
              <FormItem className="w-full">
                <FormLabel>Obrázky</FormLabel>
                <Card>
                  <CardContent className="space-y-2 mt-2 min-h-48">
                    <div className="flex-start space-x-2">
                      {images.map((image: string) => (
                        <div key={image} className="relative group w-20 h-20">
                          <Image
                            src={image}
                            alt="produktový obrázek"
                            className="w-20 h-20 object-cover object-center rounded-sm"
                            width={100}
                            height={100}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              form.setValue(
                                "images",
                                images.filter((img: string) => img !== image),
                              )
                            }
                            className="absolute top-0 right-0 bg-red-600 !text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                      <FormControl>
                        <UploadButton
                          endpoint="imageUploader"
                          content={{
                            button({ ready }) {
                              return ready
                                ? "📁 Vyber soubor"
                                : "⏳ Načítání..."
                            },
                            allowedContent() {
                              return "Podporované formáty: PNG, JPG, max. velikost: 4MB"
                            },
                          }}
                          onClientUploadComplete={(res: { url: string }[]) => {
                            form.setValue("images", [...images, res[0].url])
                          }}
                          onUploadError={(error: Error) => {
                            toast({
                              variant: "destructive",
                              description: `ERROR! ${error.message}`,
                            })
                          }}
                        />
                      </FormControl>
                    </div>
                  </CardContent>
                </Card>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="upload-field">
          {/* isFeatured */}
          Propagovaný produkt
          <Card>
            <CardContent className="space-y-2 mt-2">
              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex space-x-2 items-center">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Propagovat?</FormLabel>
                  </FormItem>
                )}
              />
              {isFeatured && banner && (
                <Image
                  src={banner}
                  alt="banner image"
                  className="w-full object-cover object-center rounded-sm"
                  width={1920}
                  height={680}
                />
              )}

              {isFeatured && !banner && (
                <UploadButton
                  endpoint="imageUploader"
                  content={{
                    button({ ready }) {
                      return ready ? "📁 Vyber soubor" : "⏳ Načítání..."
                    },
                    allowedContent() {
                      return "Podporované formáty: PNG, JPG, max. velikost: 4MB"
                    },
                  }}
                  onClientUploadComplete={(res: { url: string }[]) => {
                    form.setValue("banner", res[0].url)
                  }}
                  onUploadError={(error: Error) => {
                    toast({
                      variant: "destructive",
                      description: `ERROR! ${error.message}`,
                    })
                  }}
                />
              )}
            </CardContent>
          </Card>
        </div>
        <div>
          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductSchema>,
                "description"
              >
            }) => (
              <FormItem className="w-full">
                <FormLabel>Popis produktu</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Zadejte popis produktu"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <Button
            type="submit"
            size="lg"
            disabled={form.formState.isSubmitting}
            className="button col-span-2 w-full"
          >
            {form.formState.isSubmitting
              ? "Odesílám..."
              : type === "Create"
                ? "Vytvoř produkt"
                : "Uprav produkt"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default ProductForm
