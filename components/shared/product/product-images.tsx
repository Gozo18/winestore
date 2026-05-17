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
      <div className="flex justify-center">
        <Image
          src={images[current]}
          width={400}
          height={400}
          className="hidden md:block min-h-[300px] object-cover object-center"
          alt={`${brand} - ${name}`}
        />
        <Image
          src={images[current]}
          width={200}
          height={200}
          className="md:hidden min-h-[300px] object-cover object-center"
          alt={`${brand} - ${name}`}
        />
      </div>
      <div className="flex justify-center md:justify-start">
        {images.map((image, index) => (
          <div
            key={index}
            onClick={() => setCurrent(index)}
            className={cn(
              "border mr-2 cursor-pointer hover:border-orange-600",
              current === index && "border-orange-500",
            )}
          >
            <div key={index}>
              <Image
                src={image}
                width={100}
                height={100}
                alt={`${brand} - ${name}`}
                className="hidden md:block"
              />
              <Image
                src={image}
                width={60}
                height={60}
                alt={`${brand} - ${name}`}
                className="md:hidden"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductImages
