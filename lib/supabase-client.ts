import { createClient } from "@supabase/supabase-js"
import { apiConfig } from "./api-config"

// Create a singleton Supabase client
let supabaseClient: ReturnType<typeof createClient> | null = null

// Initialize the Supabase client only if the required environment variables are available
export function getSupabaseClient() {
  if (!supabaseClient && apiConfig.supabase.url && apiConfig.supabase.anonKey) {
    supabaseClient = createClient(apiConfig.supabase.url, apiConfig.supabase.anonKey)
  }
  return supabaseClient
}

// Check if Supabase is properly configured
export function isSupabaseConfigured() {
  return Boolean(apiConfig.supabase.url && apiConfig.supabase.anonKey)
}

// Safely perform Supabase operations with fallbacks
export async function safeSupabaseOperation<T>(
  operation: (client: ReturnType<typeof createClient>) => Promise<T>,
  fallback: T,
): Promise<T> {
  const client = getSupabaseClient()
  if (!client) {
    console.warn("Supabase client not initialized. Using fallback data.")
    return fallback
  }

  try {
    return await operation(client)
  } catch (error) {
    console.error("Supabase operation failed:", error)
    return fallback
  }
}

