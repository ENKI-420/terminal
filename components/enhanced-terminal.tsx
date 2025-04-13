"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { Maximize2, Minimize2, TerminalIcon, HelpCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip"
import { useTerminalEngine, builtInCommands } from "@/lib/terminal-commands"

interface EnhancedTerminalProps {
  initialHistory?: string[]
  onCommand?: (command: string) => void
  className?: string
  onMaximize?: (isMaximized: boolean) => void
}

export default function EnhancedTerminal({
  initialHistory = [],
  onCommand,
  className = "",
  onMaximize,
}: EnhancedTerminalProps) {
  const [input, setInput] = useState("")
  const [isMaximized, setIsMaximized] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1)
  const [historyNavIndex, setHistoryNavIndex] = useState(-1)
  const [cursorPosition, setCursorPosition] = useState(0)
  const [showSettings, setShowSettings] = useState(false)

  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Initialize terminal engine with built-in commands
  const terminal = useTerminalEngine()

  // Register built-in commands on mount
  useEffect(() => {
    // Add terminal engine to context variables for command access
    terminal.updateContext((ctx) => ({
      ...ctx,
      variables: {
        ...ctx.variables,
        commandRegistry: builtInCommands.reduce(
          (acc, cmd) => {
            acc[cmd.name] = cmd
            return acc
          },
          {} as Record<string, any>,
        ),
        updateContext: terminal.updateContext,
      },
    }))

    terminal.registerCommands(builtInCommands)

    // Add initial history messages
    if (initialHistory.length > 0) {
      initialHistory.forEach((line) => {
        terminal.executeCommand(`echo "${line}"`)
      })
    }
  }, [terminal, initialHistory])

  // Auto-scroll to bottom when history changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [terminal.state.history])

  // Focus input on mount and when clicking terminal
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Handle command submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim()) return

    // Clear suggestions
    setSuggestions([])
    setSelectedSuggestion(-1)

    // Reset history navigation
    setHistoryNavIndex(-1)

    // Special handling for clear command
    if (input.trim().toLowerCase() === "clear") {
      terminal.clearHistory()
      setInput("")
      return
    }

    // Execute command
    await terminal.executeCommand(input)

    // External command handler
    if (onCommand) {
      onCommand(input)
    }

    setInput("")
  }

  // Handle input changes and generate suggestions
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInput = e.target.value
    setInput(newInput)
    setCursorPosition(e.target.selectionStart || 0)

    // Generate suggestions
    if (newInput.trim()) {
      const newSuggestions = terminal.getSuggestions(newInput.trim())
      setSuggestions(newSuggestions)
      setSelectedSuggestion(newSuggestions.length > 0 ? 0 : -1)
    } else {
      setSuggestions([])
      setSelectedSuggestion(-1)
    }
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Tab completion
    if (e.key === "Tab") {
      e.preventDefault()

      if (selectedSuggestion >= 0 && suggestions.length > 0) {
        setInput(suggestions[selectedSuggestion])
        setSuggestions([])
        setSelectedSuggestion(-1)
      }
      return
    }

    // Navigate suggestions
    if (suggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedSuggestion((prev) => (prev + 1) % suggestions.length)
        return
      }

      if (e.key === "ArrowUp" && e.ctrlKey) {
        e.preventDefault()
        setSelectedSuggestion((prev) => (prev - 1 + suggestions.length) % suggestions.length)
        return
      }
    }

    // Command history navigation
    if (e.key === "ArrowUp" && !e.ctrlKey) {
      e.preventDefault()
      const newInput = terminal.navigateHistory("up", input)
      setInput(newInput)
      setSuggestions([])
      return
    }

    if (e.key === "ArrowDown" && !e.ctrlKey && historyNavIndex >= 0) {
      e.preventDefault()
      const newInput = terminal.navigateHistory("down", input)
      setInput(newInput)
      setSuggestions([])
      return
    }

    // Escape key closes suggestions
    if (e.key === "Escape") {
      setSuggestions([])
      setSelectedSuggestion(-1)
    }
  }

  // Handle terminal click
  const handleTerminalClick = () => {
    inputRef.current?.focus()
  }

  // Handle maximize/minimize
  const toggleMaximize = () => {
    setIsMaximized(!isMaximized)
    if (onMaximize) {
      onMaximize(!isMaximized)
    }
  }

  // Format uptime
  const formatUptime = (seconds: number): string => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return `${days}d ${hours}h ${minutes}m ${secs}s`
  }

  return (
    <TooltipProvider>
      <div
        className={`terminal-window ${isMaximized ? "fixed inset-0 z-50" : "w-full max-w-4xl h-[80vh]"} ${className}`}
        onClick={handleTerminalClick}
      >
        <div className="terminal-header">
          <div className="flex items-center">
            <TerminalIcon className="h-4 w-4 text-primary-400 mr-2" />
            <span className="text-white font-medium">AIDEN Terminal</span>
            <span className="text-primary-400 text-xs ml-2">v{terminal.state.context.systemInfo.version}</span>
            <span className="text-neutral-500 text-xs ml-2">
              Uptime: {formatUptime(terminal.state.context.systemInfo.uptime)}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Tooltip content="Help">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-neutral-400 hover:text-white"
                onClick={() => terminal.executeCommand("help")}
              >
                <HelpCircle size={14} />
              </Button>
            </Tooltip>

            <Tooltip content="Clear">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-neutral-400 hover:text-white"
                onClick={() => terminal.clearHistory()}
              >
                <RefreshCw size={14} />
              </Button>
            </Tooltip>

            <Tooltip content={isMaximized ? "Minimize" : "Maximize"}>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-neutral-400 hover:text-white"
                onClick={toggleMaximize}
              >
                {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              </Button>
            </Tooltip>
          </div>
        </div>

        <div ref={terminalRef} className="terminal-body">
          {terminal.state.history.map((item, i) => (
            <div key={i} className="mb-2">
              {item.command && (
                <div className="flex mb-1">
                  <span className="terminal-prompt">$</span>
                  <span className="terminal-command">{item.command}</span>
                </div>
              )}

              {item.results.map((result, j) => (
                <div key={j} className={`terminal-${result.type} ${j > 0 ? "mt-1" : ""}`}>
                  {typeof result.content === "string" ? result.content : <div className="my-2">{result.content}</div>}
                </div>
              ))}
            </div>
          ))}

          {terminal.state.isProcessing && (
            <div className="flex items-center text-primary-400 mt-2 animate-pulse">
              <span className="mr-2">●</span>
              Processing...
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-2 flex items-center relative">
            <span className="terminal-prompt">$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="terminal-input"
              placeholder="Enter command..."
              disabled={terminal.state.isProcessing}
              autoFocus
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
            />

            {/* Command suggestions */}
            {suggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                className="absolute left-0 bottom-full mb-1 bg-neutral-900 border border-primary-900/30 rounded-md overflow-hidden shadow-lg z-10 w-64 max-h-48 overflow-y-auto"
              >
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className={`px-3 py-1.5 text-sm cursor-pointer ${
                      index === selectedSuggestion
                        ? "bg-primary-900/30 text-white"
                        : "text-neutral-300 hover:bg-neutral-800"
                    }`}
                    onClick={() => {
                      setInput(suggestion)
                      setSuggestions([])
                      inputRef.current?.focus()
                    }}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </form>
        </div>

        <div className="border-t border-primary-900/30 p-2 flex justify-between items-center text-xs text-neutral-500">
          <div className="flex items-center">
            <span className="mr-2">{terminal.state.context.user.name}@aiden</span>
            <span>{terminal.state.context.cwd}</span>
          </div>

          <div className="flex items-center">
            {terminal.state.context.lastExitCode === 0 ? (
              <span className="text-green-500 mr-2">●</span>
            ) : (
              <span className="text-red-500 mr-2">●</span>
            )}
            <span>Exit: {terminal.state.context.lastExitCode}</span>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
