"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

type Theme = "dark" | "light" | "system"

type ThemeContextType = {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  isDyslexiaMode: boolean
  toggleDyslexiaMode: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "system",
  setTheme: () => null,
  toggleTheme: () => null,
  isDyslexiaMode: false,
  toggleDyslexiaMode: () => null,
})

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false)
  const [isDyslexiaMode, setIsDyslexiaMode] = useState(false)

  // Ensure we're only rendering theme components on the client
  useEffect(() => {
    setMounted(true)

    // Check if dyslexia mode was previously enabled
    const dyslexiaMode = localStorage.getItem("dyslexiaMode") === "true"
    setIsDyslexiaMode(dyslexiaMode)

    // Apply dyslexia font if enabled
    if (dyslexiaMode) {
      document.documentElement.classList.add("dyslexia-mode")
    }
  }, [])

  const toggleDyslexiaMode = () => {
    const newMode = !isDyslexiaMode
    setIsDyslexiaMode(newMode)
    localStorage.setItem("dyslexiaMode", String(newMode))

    if (newMode) {
      document.documentElement.classList.add("dyslexia-mode")
    } else {
      document.documentElement.classList.remove("dyslexia-mode")
    }
  }

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <NextThemesProvider {...props}>
      <ThemeContext.Provider
        value={{
          theme: "dark",
          setTheme: () => {},
          toggleTheme: () => {},
          isDyslexiaMode,
          toggleDyslexiaMode,
        }}
      >
        {children}
      </ThemeContext.Provider>
    </NextThemesProvider>
  )
}

export const useThemeContext = () => useContext(ThemeContext)

