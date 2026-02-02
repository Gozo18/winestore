import Link from "next/link"
import { Card } from "../ui/card"
import Image from "next/image"

const links = [
  { href: "/hledat", label: "všechna vína", image: "/images/miniatura.png" },
  {
    href: "/hledat?category=bílé+víno",
    label: "bílá vína",
    image: "/images/miniatura.png",
  },
  {
    href: "/hledat?category=červené+víno",
    label: "červená vína",
    image: "/images/miniatura.png",
  },
  {
    href: "/hledat?category=růžové+víno",
    label: "růžová vína",
    image: "/images/miniatura.png",
  },
]

const HomepageLinks = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4 md:mt-10">
      {links.map((link) => (
        <Link key={link.href} href={link.href}>
          <Card className="flex flex-col md:flex-row justify-center items-center p-2 md:p-4 hover:bg-gray-100">
            <Image
              src={link.image}
              alt={link.label}
              width={64}
              height={64}
              className="mb-1 md:mb-0 md:mr-2"
            />
            {link.label}
          </Card>
        </Link>
      ))}
    </div>
  )
}

export default HomepageLinks
