"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SearchIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface ProductSearchProps {
  products: { name: string; slug: string; images: string[] }[]
}

const Search = ({ products }: ProductSearchProps) => {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<
    { name: string; slug: string; images: string[] }[]
  >([])
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Diacritics-insensitive search
  const normalizeText = (text: string) =>
    text
      .normalize("NFD") // Rozloží např. 'á' na 'a' + '´'
      .replace(/[\u0300-\u036f]/g, "") // Odstraní ty přidané akcenty
      .toLowerCase()

  // Reset when navigating to a different page
  useEffect(() => {
    setQuery("")
    setIsOpen(false)
  }, [pathname])

  useEffect(() => {
    if (query.length > 1) {
      const normalizedQuery = normalizeText(query)

      const filtered = products
        .filter((p) => normalizeText(p.name).includes(normalizedQuery))
        .slice(0, 5)

      setSuggestions(filtered)
      setIsOpen(true)
    } else {
      setSuggestions([])
      setIsOpen(false)
    }
  }, [query, products])

  // Closing the suggestions dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={wrapperRef}>
      <form action="/hledat" method="GET" onSubmit={() => setIsOpen(false)}>
        <div className="relative flex">
          <div>
            <Input
              name="q"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Hledat..."
              className="w-[130px] lg:w-[300px] xlg:w-[450px] text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
              autoComplete="off"
            />

            {/* Autocomplete suggestions */}
            {isOpen && suggestions.length > 0 && (
              <div className="absolute z-50 w-[250px] lg:w-full bg-white border rounded-md shadow-lg mt-[2px] overflow-hidden">
                {suggestions.map((product) => (
                  <Link
                    key={product.slug}
                    href={`/produkt/${product.slug}`}
                    className="flex px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                    onClick={() => {
                      setQuery(product.name)
                      setIsOpen(false)
                    }}
                  >
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      width={30}
                      height={30}
                      className="mr-2 inline-block"
                    />
                    {product.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Button type="submit">
            <SearchIcon />
          </Button>
        </div>
      </form>
    </div>
  )
}

export default Search
