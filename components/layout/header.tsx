"use client"

import { Button } from "@/components/ui/button"

import React from "react"
import Link from "next/link"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { DnaIcon } from "@/components/icons/dna"
import { useTheme } from "next-themes"

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {}

export const Header = React.forwardRef<HTMLElement, HeaderProps>(({ className, ...props }, ref) => {
  const { setTheme } = useTheme()

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className,
      )}
      ref={ref}
      {...props}
    >
      <div className="container flex h-16 items-center justify-between py-4">
        <Link href="/" className="mr-auto flex items-center space-x-2">
          <DnaIcon className="h-6 w-6 text-primary" />
          <span className="hidden font-bold sm:inline-block">{siteConfig.name}</span>
        </Link>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => setTheme("light")}>
            Light
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setTheme("dark")}>
            Dark
          </Button>
        </div>
      </div>
    </header>
  )
})
Header.displayName = "Header"
