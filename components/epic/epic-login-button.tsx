"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { IconLoader2, IconBuildingHospital } from "@tabler/icons-react"

interface EpicLoginButtonProps {
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
}

export function EpicLoginButton({ className, variant = "default" }: EpicLoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleEpicLogin = async () => {
    try {
      setIsLoading(true)

      // Redirect to the Epic FHIR authentication endpoint
      window.location.href = "/api/epic/auth"
    } catch (error) {
      console.error("Error initiating Epic login:", error)
      toast({
        title: "Authentication Error",
        description: "Failed to initiate Epic login. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <Button variant={variant} className={className} onClick={handleEpicLogin} disabled={isLoading}>
      {isLoading ? (
        <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <IconBuildingHospital className="mr-2 h-4 w-4" />
      )}
      {isLoading ? "Connecting..." : "Connect with Epic"}
    </Button>
  )
}

