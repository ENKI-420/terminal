"use client"

import { useState, useCallback, useEffect } from "react"

interface TerminalSession {
  id: string
  startTime: number
  lastActivity: number
  workingDirectory: string
  username: string
  hostname: string
  lastCommand?: string
  lastOutput?: string
  lastExitCode: number
  environment: Record<string, string>
  history: string[]
}

export function useTerminalSession(initialSession?: Partial<TerminalSession>) {
  const [session, setSession] = useState<TerminalSession>(() => ({
    id: `session-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    startTime: Date.now(),
    lastActivity: Date.now(),
    workingDirectory: initialSession?.workingDirectory || "/home/operator",
    username: initialSession?.username || "operator",
    hostname: initialSession?.hostname || "pentest-system",
    lastExitCode: 0,
    environment: initialSession?.environment || {
      PATH: "/usr/local/bin:/usr/bin:/bin",
      HOME: "/home/operator",
      USER: "operator",
      SHELL: "/bin/bash",
      TERM: "xterm-256color",
    },
    history: initialSession?.history || [],
  }))

  // Update session data
  const updateSession = useCallback((updates: Partial<TerminalSession>) => {
    setSession((prev) => {
      const updated = { ...prev, ...updates, lastActivity: Date.now() }

      // Add command to history if provided
      if (updates.lastCommand) {
        updated.history = [...prev.history, updates.lastCommand].slice(-100) // Keep last 100 commands
      }

      return updated
    })
  }, [])

  // Update last activity time periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setSession((prev) => ({ ...prev, lastActivity: Date.now() }))
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  // Save session to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`terminal-session-${session.id}`, JSON.stringify(session))
    } catch (error) {
      console.error("Failed to save session to localStorage:", error)
    }
  }, [session])

  return {
    session,
    updateSession,
  }
}
