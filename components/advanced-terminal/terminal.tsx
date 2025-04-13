"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { useVirtualizer } from "@tanstack/react-virtual"
import { useHotkeys } from "react-hotkeys-hook"
import { useCommandHistory } from "@/hooks/use-command-history"
import { useNetworkStatus } from "@/hooks/use-network-status"
import { useAIContext } from "@/hooks/use-ai-context"
import { useTerminalSession } from "@/hooks/use-terminal-session"
import { executeCommand } from "@/lib/command-executor"
import { formatOutput } from "@/lib/output-formatter"
import { getSuggestions } from "@/lib/suggestion-engine"
import { parseCommand } from "@/lib/command-parser"
import { TerminalHeader } from "./terminal-header"
import { TerminalPrompt } from "./terminal-prompt"
import { TerminalOutput } from "./terminal-output"
import { SuggestionBar } from "./suggestion-bar"
import { StatusBar } from "./status-bar"
import { ContextPanel } from "./context-panel"
import { NetworkPanel } from "./network-panel"
import { ToolsPanel } from "./tools-panel"
import { cn } from "@/lib/utils"

export interface TerminalProps {
  initialHistory?: HistoryItem[]
  hostname?: string
  username?: string
  workingDirectory?: string
  networkEnabled?: boolean
  aiEnabled?: boolean
  theme?: "dark" | "light" | "system"
  className?: string
  onCommand?: (command: string, output: string) => void
  onSessionChange?: (session: any) => void
}

export interface HistoryItem {
  id: string
  type: "command" | "output" | "error" | "warning" | "info" | "success" | "system"
  content: string
  timestamp: number
  metadata?: Record<string, any>
  enhanced?: boolean
}

export function AdvancedTerminal({
  initialHistory = [],
  hostname = "pentest-system",
  username = "operator",
  workingDirectory = "/home/operator",
  networkEnabled = true,
  aiEnabled = true,
  theme = "dark",
  className,
  onCommand,
  onSessionChange,
}: TerminalProps) {
  // State management
  const [history, setHistory] = useState<HistoryItem[]>(initialHistory)
  const [input, setInput] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showContextPanel, setShowContextPanel] = useState(false)
  const [showNetworkPanel, setShowNetworkPanel] = useState(false)
  const [showToolsPanel, setShowToolsPanel] = useState(false)
  const [currentSequence, setCurrentSequence] = useState<string[]>([])
  const [sequenceIndex, setSequenceIndex] = useState(0)
  const [autoAdvance, setAutoAdvance] = useState(false)
  const [enhanceOutput, setEnhanceOutput] = useState(true)

  // Refs
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)
  const autoScrollRef = useRef(true)

  // Custom hooks
  const { history: commandHistory, addToHistory: addToCommandHistory, navigateHistory } = useCommandHistory()
  const { isConnected, activeConnections, connectTo, disconnect } = useNetworkStatus()
  const { contextData, updateContext, getContextualSuggestions } = useAIContext()
  const { session, updateSession } = useTerminalSession()

  // Virtualized list for efficient rendering
  const rowVirtualizer = useVirtualizer({
    count: history.length,
    getScrollElement: () => outputRef.current,
    estimateSize: () => 24,
    overscan: 20,
  })

  // Generate unique ID for history items
  const generateId = useCallback(() => `term-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`, [])

  // Add item to terminal history
  const addToHistory = useCallback(
    (type: HistoryItem["type"], content: string, metadata?: Record<string, any>) => {
      const newItem: HistoryItem = {
        id: generateId(),
        type,
        content,
        timestamp: Date.now(),
        metadata,
        enhanced: type === "output" && enhanceOutput,
      }

      setHistory((prev) => [...prev, newItem])

      // Update context with new history item
      if (aiEnabled) {
        updateContext({
          lastCommand: type === "command" ? content : undefined,
          lastOutput: type === "output" ? content : undefined,
        })
      }
    },
    [generateId, enhanceOutput, aiEnabled, updateContext],
  )

  // Execute command
  const handleExecuteCommand = useCallback(
    async (cmd: string, isSequence = false) => {
      if (!cmd.trim()) return

      // Add command to history
      addToHistory("command", cmd)

      // Add to command history for up/down navigation
      if (!isSequence) {
        addToCommandHistory(cmd)
      }

      // Notify parent component
      if (onCommand) {
        onCommand(cmd, "")
      }

      setIsProcessing(true)

      try {
        // Parse command for special handling
        const parsedCommand = parseCommand(cmd)

        // Handle built-in commands
        if (parsedCommand.command === "clear") {
          setHistory([])
          setIsProcessing(false)
          return
        }

        // Handle sequence commands
        if (parsedCommand.command === "sequence" && parsedCommand.args.length > 0) {
          const sequenceCommands = parsedCommand.args
          setCurrentSequence(sequenceCommands)
          setSequenceIndex(0)
          setAutoAdvance(true)

          // Execute first command in sequence
          if (sequenceCommands.length > 0) {
            handleExecuteCommand(sequenceCommands[0], true)
          }

          setIsProcessing(false)
          return
        }

        // Execute the command
        const result = await executeCommand(cmd, {
          workingDirectory,
          username,
          hostname,
          networkEnabled,
          activeConnections,
          contextData,
        })

        // Format and enhance output if enabled
        const formattedOutput = enhanceOutput ? formatOutput(result.output, result.type || "output") : result.output

        // Add output to history
        addToHistory(result.type || "output", formattedOutput, result.metadata)

        // Update session data
        updateSession({
          lastCommand: cmd,
          lastOutput: formattedOutput,
          workingDirectory: result.newWorkingDirectory || workingDirectory,
          lastExitCode: result.exitCode || 0,
        })

        // Handle sequence auto-advancing
        if (autoAdvance && currentSequence.length > 0 && sequenceIndex < currentSequence.length - 1) {
          const nextIndex = sequenceIndex + 1
          setSequenceIndex(nextIndex)

          // Add a small delay before executing the next command
          setTimeout(() => {
            handleExecuteCommand(currentSequence[nextIndex], true)
          }, 500)
        } else if (sequenceIndex === currentSequence.length - 1 && currentSequence.length > 0) {
          // End of sequence
          addToHistory("system", "Sequence completed successfully")
          setCurrentSequence([])
          setSequenceIndex(0)
          setAutoAdvance(false)
        }
      } catch (error) {
        console.error("Command execution error:", error)
        addToHistory("error", `Error executing command: ${error instanceof Error ? error.message : String(error)}`)
      } finally {
        setIsProcessing(false)
        setInput("")
      }
    },
    [
      addToHistory,
      addToCommandHistory,
      onCommand,
      workingDirectory,
      username,
      hostname,
      networkEnabled,
      activeConnections,
      contextData,
      enhanceOutput,
      updateSession,
      autoAdvance,
      currentSequence,
      sequenceIndex,
    ],
  )

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleExecuteCommand(input)
  }

  // Update suggestions based on input
  useEffect(() => {
    if (!input.trim()) {
      setSuggestions([])
      setSelectedSuggestion(-1)
      return
    }

    // Get suggestions from AI context and command history
    const commandSuggestions = getSuggestions(input, commandHistory)

    // Get contextual suggestions if AI is enabled
    const contextSuggestions = aiEnabled ? getContextualSuggestions(input, contextData) : []

    // Combine and deduplicate suggestions
    const allSuggestions = [...new Set([...commandSuggestions, ...contextSuggestions])]

    setSuggestions(allSuggestions.slice(0, 5)) // Limit to 5 suggestions
    setSelectedSuggestion(allSuggestions.length > 0 ? 0 : -1)
  }, [input, commandHistory, aiEnabled, contextData, getContextualSuggestions])

  // Auto-scroll to bottom when history changes
  useEffect(() => {
    if (outputRef.current && autoScrollRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [history])

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Handle keyboard shortcuts
  useHotkeys("ctrl+l", () => setHistory([]), { enableOnFormTags: true })
  useHotkeys(
    "ctrl+c",
    () => {
      if (isProcessing) {
        addToHistory("system", "^C")
        setIsProcessing(false)
      } else {
        setInput("")
      }
    },
    { enableOnFormTags: true },
  )

  useHotkeys(
    "tab",
    (e) => {
      e.preventDefault()
      if (selectedSuggestion >= 0 && suggestions.length > 0) {
        setInput(suggestions[selectedSuggestion])
        setSuggestions([])
      }
    },
    { enableOnFormTags: true },
  )

  useHotkeys(
    "up",
    (e) => {
      e.preventDefault()
      if (suggestions.length > 0) {
        setSelectedSuggestion((prev) => (prev - 1 + suggestions.length) % suggestions.length)
      } else {
        const prevCommand = navigateHistory("up")
        if (prevCommand) setInput(prevCommand)
      }
    },
    { enableOnFormTags: true },
  )

  useHotkeys(
    "down",
    (e) => {
      e.preventDefault()
      if (suggestions.length > 0) {
        setSelectedSuggestion((prev) => (prev + 1) % suggestions.length)
      } else {
        const nextCommand = navigateHistory("down")
        if (nextCommand !== undefined) setInput(nextCommand)
      }
    },
    { enableOnFormTags: true },
  )

  useHotkeys("ctrl+shift+c", () => setShowContextPanel((prev) => !prev), { enableOnFormTags: true })
  useHotkeys("ctrl+shift+n", () => setShowNetworkPanel((prev) => !prev), { enableOnFormTags: true })
  useHotkeys("ctrl+shift+t", () => setShowToolsPanel((prev) => !prev), { enableOnFormTags: true })
  useHotkeys("ctrl+shift+a", () => setAutoAdvance((prev) => !prev), { enableOnFormTags: true })
  useHotkeys("ctrl+shift+e", () => setEnhanceOutput((prev) => !prev), { enableOnFormTags: true })

  // Handle scroll to track if user has scrolled up
  const handleScroll = useCallback(() => {
    if (!outputRef.current) return

    const { scrollTop, scrollHeight, clientHeight } = outputRef.current
    autoScrollRef.current = scrollHeight - scrollTop - clientHeight < 50
  }, [])

  return (
    <div
      className={cn(
        "flex flex-col h-full w-full rounded-md overflow-hidden border border-neutral-800 bg-neutral-950 text-neutral-100",
        className,
      )}
    >
      {/* Terminal header with controls */}
      <TerminalHeader
        hostname={hostname}
        username={username}
        isConnected={isConnected}
        activeConnections={activeConnections.length}
        onClear={() => setHistory([])}
        onToggleContext={() => setShowContextPanel((prev) => !prev)}
        onToggleNetwork={() => setShowNetworkPanel((prev) => !prev)}
        onToggleTools={() => setShowToolsPanel((prev) => !prev)}
        autoAdvance={autoAdvance}
        enhanceOutput={enhanceOutput}
        onToggleAutoAdvance={() => setAutoAdvance((prev) => !prev)}
        onToggleEnhanceOutput={() => setEnhanceOutput((prev) => !prev)}
      />

      {/* Main terminal area with side panels */}
      <div className="flex flex-1 overflow-hidden">
        {/* Context panel */}
        {showContextPanel && <ContextPanel contextData={contextData} onClose={() => setShowContextPanel(false)} />}

        {/* Main terminal output */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Terminal output area */}
          <div ref={outputRef} className="flex-1 overflow-y-auto p-2 font-mono text-sm" onScroll={handleScroll}>
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: "100%",
                position: "relative",
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualItem) => {
                const item = history[virtualItem.index]
                return (
                  <div
                    key={item.id}
                    data-index={virtualItem.index}
                    className="absolute top-0 left-0 w-full"
                    style={{
                      height: `${virtualItem.size}px`,
                      transform: `translateY(${virtualItem.start}px)`,
                    }}
                  >
                    <TerminalOutput
                      item={item}
                      username={username}
                      hostname={hostname}
                      workingDirectory={workingDirectory}
                    />
                  </div>
                )
              })}
            </div>
          </div>

          {/* Suggestion bar */}
          {suggestions.length > 0 && (
            <SuggestionBar
              suggestions={suggestions}
              selectedIndex={selectedSuggestion}
              onSelect={(suggestion) => {
                setInput(suggestion)
                setSuggestions([])
                inputRef.current?.focus()
              }}
            />
          )}

          {/* Command input */}
          <form onSubmit={handleSubmit} className="flex items-center p-2 border-t border-neutral-800">
            <TerminalPrompt
              username={username}
              hostname={hostname}
              workingDirectory={workingDirectory}
              isProcessing={isProcessing}
            />
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-neutral-100 font-mono"
              disabled={isProcessing}
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
            />
          </form>

          {/* Status bar */}
          <StatusBar
            exitCode={session.lastExitCode}
            networkStatus={isConnected ? "connected" : "disconnected"}
            activeConnections={activeConnections.length}
            sequenceStatus={currentSequence.length > 0 ? `${sequenceIndex + 1}/${currentSequence.length}` : undefined}
            autoAdvance={autoAdvance}
            enhanceOutput={enhanceOutput}
          />
        </div>

        {/* Network panel */}
        {showNetworkPanel && (
          <NetworkPanel
            isConnected={isConnected}
            activeConnections={activeConnections}
            onConnect={connectTo}
            onDisconnect={disconnect}
            onClose={() => setShowNetworkPanel(false)}
          />
        )}

        {/* Tools panel */}
        {showToolsPanel && <ToolsPanel onExecute={handleExecuteCommand} onClose={() => setShowToolsPanel(false)} />}
      </div>
    </div>
  )
}
