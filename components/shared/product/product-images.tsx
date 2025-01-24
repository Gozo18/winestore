"use client"
import { useState } from "react"
import { cn } from "@/lib/utils"
import Image from "next/image"

const ProductImages = ({
  images,
  name,
  brand,
}: {
  images: string[]
  name: string
  brand: string
}) => {
  const [current, setCurrent] = useState(0)

  return (
    <div className="space-y-4">
      <Image
        src={images[current]}
        width={1000}
        height={1000}
        className="min-h-[300px] object-cover object-center"
        alt={`${brand} - ${name}`}
      />
      <div className="flex">
        {images.map((image, index) => (
          <div
            key={index}
            onClick={() => setCurrent(index)}
            className={cn(
              "border mr-2 cursor-pointer hover:border-orange-600",
              current === index && "border-orange-500"
            )}
          >
            <Image
              key={index}
              src={image}
              width={100}
              height={100}
              alt={`${brand} - ${name}`}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductImages
