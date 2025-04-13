"use client"

import { useState, useCallback, useEffect } from "react"

interface AIContextData {
  lastCommand?: string
  lastOutput?: string
  commandHistory?: string[]
  workingDirectory?: string
  environmentVariables?: Record<string, string>
  userPreferences?: Record<string, any>
  sessionData?: Record<string, any>
  [key: string]: any
}

export function useAIContext() {
  const [contextData, setContextData] = useState<AIContextData>({
    commandHistory: [],
    environmentVariables: {
      PATH: "/usr/local/bin:/usr/bin:/bin",
      HOME: "/home/operator",
      USER: "operator",
      SHELL: "/bin/bash",
    },
    userPreferences: {
      enhanceOutput: true,
      autoAdvance: false,
      theme: "dark",
    },
  })

  // Update context with new data
  const updateContext = useCallback((newData: Partial<AIContextData>) => {
    setContextData((prev) => {
      const updated = { ...prev, ...newData }

      // Special handling for command history
      if (newData.lastCommand) {
        const commandHistory = [...(prev.commandHistory || []), newData.lastCommand]
        // Limit history to last 20 commands
        updated.commandHistory = commandHistory.slice(-20)
      }

      return updated
    })
  }, [])

  // Get contextual suggestions based on current input and context
  const getContextualSuggestions = useCallback((input: string, context: AIContextData): string[] => {
    if (!input.trim()) return []

    const suggestions: string[] = []
    const commandHistory = context.commandHistory || []

    // Suggest commands from history that start with the input
    const historySuggestions = commandHistory
      .filter((cmd) => cmd.startsWith(input))
      .filter((cmd, index, self) => self.indexOf(cmd) === index) // Remove duplicates

    suggestions.push(...historySuggestions)

    // Add contextual suggestions based on current directory
    if (input.startsWith("cd ")) {
      const dirPrefix = input.slice(3)
      // Common directories to suggest
      const commonDirs = ["/", "/home", "/tmp", "/var", "/etc", "/opt"]
      suggestions.push(...commonDirs.filter((dir) => dir.startsWith(dirPrefix)).map((dir) => `cd ${dir}`))
    }

    // Add contextual suggestions for file operations
    if (input.startsWith("cat ") || input.startsWith("nano ") || input.startsWith("vim ")) {
      const cmdPrefix = input.split(" ")[0]
      const filePrefix = input.slice(cmdPrefix.length + 1)
      // Common files to suggest
      const commonFiles = ["/etc/passwd", "/etc/hosts", "/etc/resolv.conf", ".bashrc", "config.json"]
      suggestions.push(
        ...commonFiles.filter((file) => file.startsWith(filePrefix)).map((file) => `${cmdPrefix} ${file}`),
      )
    }

    // Add network-related suggestions
    if (input.startsWith("ssh ") || input.startsWith("nc ") || input.startsWith("telnet ")) {
      const cmdPrefix = input.split(" ")[0]
      // Common network targets
      suggestions.push(`${cmdPrefix} localhost`, `${cmdPrefix} 127.0.0.1`, `${cmdPrefix} 10.0.0.1`)
    }

    // Add penetration testing tool suggestions
    if (input.startsWith("nmap ")) {
      suggestions.push("nmap -sV -sC", "nmap -p- --min-rate 1000", "nmap -sU -sT")
    }

    return suggestions.slice(0, 5) // Limit to 5 suggestions
  }, [])

  // Simulate AI learning from user behavior
  useEffect(() => {
    const interval = setInterval(() => {
      // Update AI context based on user behavior (simulated)
      setContextData((prev) => {
        const userPreferences = { ...prev.userPreferences }

        // Simulate learning user preferences
        if (prev.commandHistory && prev.commandHistory.length > 10) {
          // Check if user frequently uses certain commands
          const commandFrequency: Record<string, number> = {}
          prev.commandHistory.forEach((cmd) => {
            const baseCmd = cmd.split(" ")[0]
            commandFrequency[baseCmd] = (commandFrequency[baseCmd] || 0) + 1
          })

          // Update preferences based on command frequency
          const favoriteCommands = Object.entries(commandFrequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([cmd]) => cmd)

          userPreferences.favoriteCommands = favoriteCommands
        }

        return { ...prev, userPreferences }
      })
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  return {
    contextData,
    updateContext,
    getContextualSuggestions,
  }
}
