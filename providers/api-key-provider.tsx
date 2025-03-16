"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface ApiKeyContextType {
  apiKey: string | null
  setApiKey: (key: string) => void
  clearApiKey: () => void
}

const ApiKeyContext = createContext<ApiKeyContextType>({
  apiKey: null,
  setApiKey: () => {},
  clearApiKey: () => {},
})

export function ApiKeyProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKeyState] = useState<string | null>(null)

  useEffect(() => {
    // Load API key from environment variable or local storage
    const key = process.env.NEXT_PUBLIC_AI_API_KEY || localStorage.getItem("AGENT_2_API_KEY")
    if (key) {
      setApiKeyState(key)
    }
  }, [])

  const setApiKey = (key: string) => {
    localStorage.setItem("AGENT_2_API_KEY", key)
    setApiKeyState(key)
  }

  const clearApiKey = () => {
    localStorage.removeItem("AGENT_2_API_KEY")
    setApiKeyState(null)
  }

  return <ApiKeyContext.Provider value={{ apiKey, setApiKey, clearApiKey }}>{children}</ApiKeyContext.Provider>
}

export const useApiKey = () => useContext(ApiKeyContext)

