"use client"

import type React from "react"

import { useState, useCallback, useRef, useEffect } from "react"

// Define terminal command types
export type CommandResult = {
  content: string | React.ReactNode
  type: "output" | "error" | "info" | "success" | "warning" | "component"
}

export type CommandHandler = (
  args: string[],
  flags: Record<string, boolean | string>,
  context: TerminalContext,
) => CommandResult | CommandResult[] | Promise<CommandResult | CommandResult[]>

export type CommandDefinition = {
  name: string
  description: string
  usage?: string
  examples?: string[]
  handler: CommandHandler
  aliases?: string[]
  flags?: {
    name: string
    description: string
    alias?: string
    requiresValue?: boolean
  }[]
}

export type TerminalContext = {
  env: Record<string, string>
  cwd: string
  user: {
    name: string
    role: string
    authenticated: boolean
  }
  history: string[]
  lastExitCode: number
  systemInfo: {
    version: string
    uptime: number
    startTime: number
  }
  variables: Record<string, any>
}

export type TerminalState = {
  history: {
    command?: string
    results: CommandResult[]
    timestamp: number
  }[]
  context: TerminalContext
  commandRegistry: Record<string, CommandDefinition>
  suggestions: string[]
  historyIndex: number
  isProcessing: boolean
}

// Parse command line with support for quotes and flags
export const parseCommandLine = (input: string) => {
  const regex = /(?:[^\s"']+|"([^"]*)"|'([^']*)')+/g
  const args: string[] = []
  const flags: Record<string, boolean | string> = {}

  let match: RegExpExecArray | null
  while ((match = regex.exec(input)) !== null) {
    const arg = match[1] || match[2] || match[0]

    // Handle flags (--flag, -f, --key=value)
    if (arg.startsWith("--")) {
      const equalPos = arg.indexOf("=")
      if (equalPos > 0) {
        // Handle --key=value
        const key = arg.substring(2, equalPos)
        const value = arg.substring(equalPos + 1)
        flags[key] = value
      } else {
        // Handle --flag
        flags[arg.substring(2)] = true
      }
    } else if (arg.startsWith("-") && arg.length > 1 && !arg.match(/^-\d+$/)) {
      // Handle -f (but not negative numbers like -42)
      for (let i = 1; i < arg.length; i++) {
        flags[arg[i]] = true
      }
    } else {
      args.push(arg)
    }
  }

  return { command: args[0], args: args.slice(1), flags }
}

// Hook for terminal state management
export function useTerminalEngine(initialCommands: Record<string, CommandDefinition> = {}) {
  // Initialize terminal state
  const [state, setState] = useState<TerminalState>({
    history: [],
    context: {
      env: {
        PATH: "/bin:/usr/bin",
        HOME: "/home/agent",
        USER: "agent",
        TERM: "aiden-terminal",
        SHELL: "/bin/aiden",
        LANG: "en_US.UTF-8",
        VERSION: "2.5.7",
      },
      cwd: "/home/agent",
      user: {
        name: "agent",
        role: "operator",
        authenticated: true,
      },
      history: [],
      lastExitCode: 0,
      systemInfo: {
        version: "2.5.7",
        uptime: 0,
        startTime: Date.now(),
      },
      variables: {},
    },
    commandRegistry: initialCommands,
    suggestions: [],
    historyIndex: -1,
    isProcessing: false,
  })

  // Refs for performance optimization
  const stateRef = useRef(state)
  useEffect(() => {
    stateRef.current = state
  }, [state])

  // Register a new command
  const registerCommand = useCallback((command: CommandDefinition) => {
    setState((prev) => ({
      ...prev,
      commandRegistry: {
        ...prev.commandRegistry,
        [command.name]: command,
      },
    }))
  }, [])

  // Register multiple commands
  const registerCommands = useCallback((commands: CommandDefinition[]) => {
    setState((prev) => {
      const newRegistry = { ...prev.commandRegistry }
      commands.forEach((cmd) => {
        newRegistry[cmd.name] = cmd
      })
      return {
        ...prev,
        commandRegistry: newRegistry,
      }
    })
  }, [])

  // Execute a command
  const executeCommand = useCallback(async (input: string): Promise<CommandResult[]> => {
    if (!input.trim()) {
      return []
    }

    // Update history
    setState((prev) => ({
      ...prev,
      context: {
        ...prev.context,
        history: [...prev.context.history, input],
      },
      historyIndex: -1,
      isProcessing: true,
    }))

    // Parse command
    const { command, args, flags } = parseCommandLine(input)

    // Find command in registry
    const commandDef = stateRef.current.commandRegistry[command]

    // Check for aliases
    const aliasMatch = Object.values(stateRef.current.commandRegistry).find(
      (cmd) => cmd.aliases && cmd.aliases.includes(command),
    )

    let results: CommandResult[] = []

    try {
      if (commandDef) {
        // Execute the command handler
        const result = await commandDef.handler(args, flags, stateRef.current.context)
        results = Array.isArray(result) ? result : [result]
      } else if (aliasMatch) {
        // Execute the aliased command
        const result = await aliasMatch.handler(args, flags, stateRef.current.context)
        results = Array.isArray(result) ? result : [result]
      } else {
        // Command not found
        results = [
          {
            content: `Command not found: ${command}. Type 'help' for available commands.`,
            type: "error",
          },
        ]
      }
    } catch (error) {
      // Handle errors
      results = [
        {
          content: `Error executing command: ${error instanceof Error ? error.message : String(error)}`,
          type: "error",
        },
      ]
    }

    // Update terminal state with results
    setState((prev) => ({
      ...prev,
      history: [
        ...prev.history,
        {
          command: input,
          results,
          timestamp: Date.now(),
        },
      ],
      isProcessing: false,
      context: {
        ...prev.context,
        lastExitCode: results.some((r) => r.type === "error") ? 1 : 0,
      },
    }))

    return results
  }, [])

  // Get command suggestions based on input
  const getSuggestions = useCallback((input: string): string[] => {
    if (!input) return []

    const { command } = parseCommandLine(input)
    const commandNames = Object.keys(stateRef.current.commandRegistry)

    // Get all command names and aliases
    const allCommands = commandNames.concat(
      commandNames.flatMap((name) => {
        const cmd = stateRef.current.commandRegistry[name]
        return cmd.aliases || []
      }),
    )

    // Filter commands that start with the input
    return allCommands.filter((cmd) => cmd.startsWith(command))
  }, [])

  // Navigate command history
  const navigateHistory = useCallback((direction: "up" | "down", currentInput: string): string => {
    const history = stateRef.current.context.history
    let newIndex = stateRef.current.historyIndex

    if (direction === "up") {
      // Navigate backwards in history
      if (newIndex < history.length - 1) {
        newIndex++
      }
    } else {
      // Navigate forwards in history
      if (newIndex > -1) {
        newIndex--
      }
    }

    setState((prev) => ({
      ...prev,
      historyIndex: newIndex,
    }))

    // Return the command from history or empty string if at the end
    return newIndex >= 0 ? history[history.length - 1 - newIndex] : currentInput
  }, [])

  // Clear terminal history
  const clearHistory = useCallback(() => {
    setState((prev) => ({
      ...prev,
      history: [],
    }))
  }, [])

  // Update terminal context
  const updateContext = useCallback((updater: (context: TerminalContext) => TerminalContext) => {
    setState((prev) => ({
      ...prev,
      context: updater(prev.context),
    }))
  }, [])

  // Calculate system uptime
  useEffect(() => {
    const interval = setInterval(() => {
      setState((prev) => ({
        ...prev,
        context: {
          ...prev.context,
          systemInfo: {
            ...prev.context.systemInfo,
            uptime: Math.floor((Date.now() - prev.context.systemInfo.startTime) / 1000),
          },
        },
      }))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return {
    state,
    executeCommand,
    registerCommand,
    registerCommands,
    getSuggestions,
    navigateHistory,
    clearHistory,
    updateContext,
  }
}
