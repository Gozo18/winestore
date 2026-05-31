"use server"
import { prisma } from "@/db/prisma"
import { convertToPlainObject, formatError } from "../utils"
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from "../constants"
import { revalidatePath } from "next/cache"
import { insertProductSchema, updateProductSchema } from "../validators"
import { z } from "zod"
import { Prisma } from "@prisma/client"

// Get latest products
export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: "desc" },
  })
  return convertToPlainObject(data)
}

// Get single product by slug
export async function getProductBySlug(slug: string) {
  const data = await prisma.product.findFirst({
    where: { slug: slug },
  })
  // Konzistentní serializace s ostatními gettery — Prisma Decimal by jinak
  // putoval do RSC payloadu jako objekt s .toString() a klient by ho zpracoval
  // nesprávně (např. `Number(product.price)` na nepřevedených datech).
  return convertToPlainObject(data)
}

// Get single product by it's ID
export async function getProductById(productId: string) {
  const data = await prisma.product.findFirst({
    where: { id: productId },
  })

  return convertToPlainObject(data)
}

// Get all products
export async function getAllProducts({
  query,
  limit = PAGE_SIZE,
  page,
  category,
  price,
  rating,
  sort,
  sugar,
}: {
  query: string
  limit?: number
  page: number
  category?: string
  price?: string
  rating?: string
  sort?: string
  sugar?: string
}) {
  // Query filter
  const queryFilter: Prisma.ProductWhereInput =
    query && query !== "all"
      ? {
          name: {
            contains: query,
            mode: "insensitive",
          } as Prisma.StringFilter,
        }
      : {}

  // Category filter
  const categoryFilter = category && category !== "all" ? { category } : {}

  // Price filter
  const priceFilter: Prisma.ProductWhereInput =
    price && price !== "all"
      ? {
          price: {
            gte: Number(price.split("-")[0]),
            lte: Number(price.split("-")[1]),
          },
        }
      : {}

  // Rating filter
  const ratingFilter =
    rating && rating !== "all"
      ? {
          rating: {
            gte: Number(rating),
          },
        }
      : {}

  // Sugar filter
  const sugarFilter =
    sugar && sugar !== "all"
      ? {
          sugar: {
            gte: Number(sugar.split("-")[0]),
            lte: Number(sugar.split("-")[1]),
          },
        }
      : {}

  const where: Prisma.ProductWhereInput = {
    ...queryFilter,
    ...categoryFilter,
    ...priceFilter,
    ...ratingFilter,
    ...sugarFilter,
  }

  // Paralelizujeme findMany + count — jsou nezávislé, ale pro stejný where.
  // Count MUSÍ respektovat filtr, jinak paginace lže při aktivním vyhledávání
  // (stejný bug jako u admin getterů v sekci 3g).
  const [data, dataCount] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy:
        sort === "lowest"
          ? { price: "asc" }
          : sort === "highest"
            ? { price: "desc" }
            : sort === "rating"
              ? { rating: "desc" }
              : sort === "sugar-low"
                ? { sugar: "asc" }
                : sort === "sugar-high"
                  ? { sugar: "desc" }
                  : { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ])

  return {
    // Decimal `price`/`rating` musí přes serializaci, jinak v RSC payloadu
    // letí jako objekty a klient na nich nemůže dělat Number(product.price).
    data: convertToPlainObject(data),
    totalPages: Math.ceil(dataCount / limit),
  }
}

// Delete a product
export async function deleteProduct(id: string) {
  try {
    const productExists = await prisma.product.findFirst({
      where: { id },
    })

    if (!productExists) throw new Error("Produkt nenalezen")

    await prisma.product.delete({ where: { id } })

    revalidatePath("/admin/produkty")

    return {
      success: true,
      message: "Produkt byl úspěšně smazán",
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

// Create a product
export async function createProduct(data: z.infer<typeof insertProductSchema>) {
  try {
    const product = insertProductSchema.parse(data)
    await prisma.product.create({ data: product })

    revalidatePath("/admin/produkty")

    return {
      success: true,
      message: "Produkt byl úspěšně vytvořen",
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

// Update a product
export async function updateProduct(data: z.infer<typeof updateProductSchema>) {
  try {
    const product = updateProductSchema.parse(data)
    const productExists = await prisma.product.findFirst({
      where: { id: product.id },
    })

    if (!productExists) throw new Error("Produkt nenalezen")

    if (!product.isFeatured) {
      product.banner = null
    }

    await prisma.product.update({
      where: { id: product.id },
      data: product,
    })

    revalidatePath("/admin/produkty")

    return {
      success: true,
      message: "Produkt byl úspěšně aktualizován",
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

// Get all categories
export async function getAllCategories() {
  const data = await prisma.product.groupBy({
    by: ["category"],
    where: {
      category: {
        not: "",
      },
    },
    _count: true,
    orderBy: {
      category: "asc",
    },
  })

  return data
}

// Get featured products
export async function getFeaturedProducts() {
  const data = await prisma.product.findMany({
    where: { isFeatured: true },
    orderBy: { createdAt: "desc" },
    take: 4,
  })

  return convertToPlainObject(data)
}

// Get all product names and their slugs
export async function getAllProductSlugs() {
  const data = await prisma.product.findMany({
    select: {
      name: true,
      slug: true,
      images: true,
    },
    orderBy: {
      name: "asc",
    },
  })

  return data
}
