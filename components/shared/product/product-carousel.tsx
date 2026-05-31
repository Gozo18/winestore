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
                <div className="relative mx-auto w-full aspect-[1240/500] bg-muted animate-pulse overflow-hidden">
                  <Image
                    src={product.banner!}
                    alt={product.name}
                    fill
                    sizes="(max-width: 1240px) 100vw, 1240px"
                    priority={index === 0}
                    className="object-cover"
                    onLoadingComplete={(img) => {
                      img.parentElement?.classList.remove("animate-pulse", "bg-muted")
                    }}
                  />
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
