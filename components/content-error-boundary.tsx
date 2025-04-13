"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

interface ContentErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function ContentErrorBoundary({ children, fallback }: ContentErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // Add global error handler for content loading issues
    const handleError = (event: ErrorEvent) => {
      if (
        event.message.includes("vusercontent") ||
        event.message.includes("loading chunk") ||
        event.message.includes("Failed to fetch")
      ) {
        console.error("Content loading error:", event.error)
        setError(event.error)
        setHasError(true)

        // Prevent default error handling
        event.preventDefault()
      }
    }

    window.addEventListener("error", handleError)

    return () => {
      window.removeEventListener("error", handleError)
    }
  }, [])

  if (hasError) {
    return (
      fallback || (
        <div className="p-4 border border-red-200 bg-red-50 rounded-md">
          <h3 className="text-lg font-medium text-red-800">Content Loading Error</h3>
          <p className="text-red-600 mt-1">{error?.message || "Failed to load content from server"}</p>
          <div className="mt-4">
            <Button
              onClick={() => {
                setHasError(false)
                setError(null)
                window.location.reload()
              }}
            >
              Try Again
            </Button>
          </div>
        </div>
      )
    )
  }

  return <>{children}</>
}
