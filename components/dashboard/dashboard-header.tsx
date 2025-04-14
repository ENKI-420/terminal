import type React from "react"
import { cn } from "@/lib/utils"

interface DashboardHeaderProps {
  heading: string
  text?: string
  children?: React.ReactNode
  className?: string
}

export function DashboardHeader({ heading, text, children, className }: DashboardHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center justify-between">
        <div className="grid gap-1">
          <h1 className="font-heading text-3xl md:text-4xl font-bold">{heading}</h1>
          {text && <p className="text-muted-foreground">{text}</p>}
        </div>
        {children}
      </div>
    </div>
  )
}
