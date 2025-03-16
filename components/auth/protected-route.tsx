"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "./auth-provider"
import { Skeleton } from "@/components/ui/skeleton"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  // For development purposes, we'll bypass authentication if Supabase isn't configured
  const [bypassAuth, setBypassAuth] = useState(false)

  useEffect(() => {
    setIsClient(true)

    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.warn("Supabase not configured, bypassing authentication for development")
      setBypassAuth(true)
    }
  }, [])

  useEffect(() => {
    if (isClient && !loading && !user && !bypassAuth) {
      router.push("/auth/login")
    }
  }, [isClient, loading, user, router, bypassAuth])

  if (loading || !isClient) {
    return (
      <div className="container mx-auto p-4 space-y-4">
        <Skeleton className="h-12 w-[200px]" />
        <Skeleton className="h-[500px] w-full" />
      </div>
    )
  }

  if (!user && !bypassAuth) {
    return null
  }

  return <>{children}</>
}

