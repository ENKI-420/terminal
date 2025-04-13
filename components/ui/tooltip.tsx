"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

const TooltipProvider = TooltipPrimitive.Provider
const TooltipRoot = TooltipPrimitive.Root
const TooltipTrigger = TooltipPrimitive.Trigger
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={`z-50 overflow-hidden rounded-md bg-neutral-900 px-3 py-1.5 text-xs text-neutral-50 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ${className}`}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

// Create a composite Tooltip component for easier use
interface TooltipProps {
  children: React.ReactNode
  content: React.ReactNode
  className?: string
  contentClassName?: string
}

const Tooltip = ({ children, content, className, contentClassName }: TooltipProps) => (
  <TooltipRoot>
    <TooltipTrigger asChild className={className}>
      {children}
    </TooltipTrigger>
    <TooltipContent className={contentClassName}>{content}</TooltipContent>
  </TooltipRoot>
)

export { TooltipRoot, TooltipTrigger, TooltipContent, TooltipProvider, Tooltip }
