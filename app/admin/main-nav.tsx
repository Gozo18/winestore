"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import React from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

const links = [
  {
    title: "Přehled",
    href: "/admin/prehled",
  },
  {
    title: "Produkty",
    href: "/admin/produkty",
  },
  {
    title: "Objednávky",
    href: "/admin/objednavky",
  },
  {
    title: "Uživatelé",
    href: "/admin/uzivatele",
  },
]

const MainNav = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => {
  const pathname = usePathname()
  return (
    <>
      <nav
        className={cn(
          "items-center space-x-4 lg:space-x-6 hidden lg:flex",
          className
        )}
        {...props}
      >
        {links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname.includes(item.href) ? "" : "text-muted-foreground"
            )}
          >
            {item.title}
          </Link>
        ))}
      </nav>
      <nav
        className={cn(
          "items-center space-x-4 lg:space-x-6 lg:hidden flex",
          className
        )}
        {...props}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Admin menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {links.map((item) => (
              <DropdownMenuItem key={item.href} asChild>
                <Link
                  href={item.href}
                  className={cn(
                    "text-sm",
                    pathname.includes(item.href) ? "" : "text-muted-foreground"
                  )}
                >
                  {item.title}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </>
  )
}

export default MainNav
