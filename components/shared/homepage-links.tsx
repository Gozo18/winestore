import Link from "next/link"
import { Card } from "../ui/card"

const HomepageLinks = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
      <Link href="/hledat">
        <Card className="p-4 text-center">Všechna vína</Card>
      </Link>
      <Link href="/hledat?category=bílé+víno">
        <Card className="p-4 text-center">Bílá vína</Card>
      </Link>
      <Link href="/hledat?category=červené+víno">
        <Card className="p-4 text-center">Červená vína</Card>
      </Link>
      <Link href="/hledat?category=růžové+víno">
        <Card className="p-4 text-center">Růžová vína</Card>
      </Link>
    </div>
  )
}

export default HomepageLinks
