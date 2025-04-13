"use client"

import { useState, useCallback } from "react"

export function useCommandHistory(maxHistory = 100) {
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  const addToHistory = useCallback(
    (command: string) => {
      if (!command.trim()) return

      setHistory((prev) => {
        // Don't add duplicate consecutive commands
        if (prev.length > 0 && prev[prev.length - 1] === command) {
          return prev
        }

        // Add command to history, limiting to maxHistory items
        const newHistory = [...prev, command]
        if (newHistory.length > maxHistory) {
          return newHistory.slice(newHistory.length - maxHistory)
        }
        return newHistory
      })

      // Reset history index
      setHistoryIndex(-1)
    },
    [maxHistory],
  )

  const navigateHistory = useCallback(
    (direction: "up" | "down") => {
      if (history.length === 0) return undefined

      if (direction === "up") {
        if (historyIndex < history.length - 1) {
          const newIndex = historyIndex + 1
          setHistoryIndex(newIndex)
          return history[history.length - 1 - newIndex]
        }
        return history[0]
      } else {
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1
          setHistoryIndex(newIndex)
          return history[history.length - 1 - newIndex]
        }
        setHistoryIndex(-1)
        return ""
      }
    },
    [history, historyIndex],
  )

  const clearHistory = useCallback(() => {
    setHistory([])
    setHistoryIndex(-1)
  }, [])

  return {
    history,
    historyIndex,
    addToHistory,
    navigateHistory,
    clearHistory,
  }
}
