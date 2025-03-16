"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

type AuthContextType = {
  user: User | null
  supabase: SupabaseClient | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  supabase: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
  signUp: async () => {},
  resetPassword: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.warn("Missing Supabase credentials")
      setLoading(false)
      return
    }

    try {
      // Create Supabase client without URL validation
      const supabaseClient = createClient(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      })
      setSupabase(supabaseClient)

      // Check for active session
      const checkUser = async () => {
        try {
          const { data, error } = await supabaseClient.auth.getSession()
          if (error) {
            console.error("Error checking auth session:", error)
          }

          if (data?.session) {
            setUser(data.session.user)
          }
        } catch (error) {
          console.error("Error checking auth:", error)
        } finally {
          setLoading(false)
        }
      }

      checkUser()

      // Set up auth state listener
      const { data: authListener } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          setUser(session.user)
        } else {
          setUser(null)
          // Redirect to login if not on auth pages
          if (!router.pathname?.includes("/auth/")) {
            router.push("/auth/login")
          }
        }
      })

      return () => {
        authListener?.subscription.unsubscribe()
      }
    } catch (error) {
      console.error("Error initializing Supabase client:", error)
      setLoading(false)
    }
  }, [router])

  const signIn = async (email: string, password: string) => {
    if (!supabase) return

    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      toast({
        title: "Signed in successfully",
        description: "Welcome back to AGENT 2.0",
      })

      router.push("/chat")
    } catch (error: any) {
      toast({
        title: "Authentication error",
        description: error.message || "Failed to sign in",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string) => {
    if (!supabase) return

    try {
      setLoading(true)
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error

      toast({
        title: "Verification email sent",
        description: "Please check your email to verify your account",
      })
    } catch (error: any) {
      toast({
        title: "Registration error",
        description: error.message || "Failed to sign up",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    if (!supabase) return

    try {
      await supabase.auth.signOut()
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      })
      router.push("/auth/login")
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      })
    }
  }

  const resetPassword = async (email: string) => {
    if (!supabase) return

    try {
      setLoading(true)
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) throw error

      toast({
        title: "Password reset email sent",
        description: "Please check your email for the reset link",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send reset email",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        supabase,
        loading,
        signIn,
        signOut,
        signUp,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

