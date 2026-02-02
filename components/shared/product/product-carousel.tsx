"use client"

import { useState, useEffect } from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import { Product } from "@/types"
import Autoplay from "embla-carousel-autoplay"
import Link from "next/link"
import Image from "next/image"

const ProductCarousel = ({ data }: { data: Product[] }) => {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!api) return
    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())

    const handler = () => setCurrent(api.selectedScrollSnap())
    api.on("select", handler)

    return () => {
      api.off("select", handler)
    }
  }, [api])

  return (
    <>
      <Carousel
        className="w-full"
        setApi={setApi}
        opts={{
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 5000,
            stopOnInteraction: true,
            stopOnMouseEnter: true,
          }),
        ]}
      >
        <CarouselContent>
          {data.map((product: Product, index: number) => (
            <CarouselItem key={index}>
              <Link href={`/produkt/${product.slug}`}>
                <div className="relative mx-auto">
                  <Image
                    src={product.banner!}
                    alt={product.name}
                    height="0"
                    width="0"
                    sizes="100vw"
                    className="w-full h-auto"
                  />
                  {/* <div className="absolute inset-0 flex items-end justify-center">
                  <h2 className="bg-gray-900 bg-opacity-50 text-sm lg:text-2xl font-bold px-2 text-white">
                    {product.name}
                  </h2>
                </div> */}
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden xl:flex" />
        <CarouselNext className="hidden xl:flex" />
      </Carousel>
      {/* Dots */}
      {count > 0 && (
        <div className="flex items-center justify-center gap-2 py-2">
          {Array.from({ length: count }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => api?.scrollTo(idx)}
              className={`h-2 w-2 rounded-full transition-all ${
                current === idx ? "bg-primary w-4" : "bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>
      )}
    </>
  )
}

export default ProductCarousel
