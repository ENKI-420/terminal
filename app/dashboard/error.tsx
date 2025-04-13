"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Dashboard error:", error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
      <div className="max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Dashboard Error</h2>
        <p className="text-muted-foreground mb-6">{error.message || "An error occurred while loading the dashboard"}</p>
        {error.digest && <p className="text-sm text-muted-foreground mb-4">Error ID: {error.digest}</p>}
        <div className="flex gap-4 justify-center">
          <Button onClick={() => reset()}>Retry</Button>
          <Button variant="outline" onClick={() => (window.location.href = "/")}>
            Go to homepage
          </Button>
        </div>
      </div>
    </div>
  )
}
