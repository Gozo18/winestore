"use client"

import Image from "next/image"

type Props = {
  src: string
  alt: string
  width: number
  aspect: string
  sizes: string
  className?: string
}

const ProductCardImage = ({ src, alt, width, aspect, sizes, className }: Props) => {
  return (
    <div
      className={`relative bg-muted animate-pulse overflow-hidden ${className ?? ""}`}
      style={{ width, aspectRatio: aspect }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority
        className="object-cover"
        onLoadingComplete={(img) => {
          img.parentElement?.classList.remove("animate-pulse", "bg-muted")
        }}
      />
    </div>
  )
}

export default ProductCardImage
