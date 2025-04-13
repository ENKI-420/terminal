"use client"

import type React from "react"

import { useEffect, useRef, useState, useCallback, useMemo } from "react"
import { Maximize2, Minimize2, TerminalIcon, HelpCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip"
import { useVirtualizer } from "@tanstack/react-virtual"
import { debounce } from "lodash"

interface HistoryItem {
  type: "command" | "output" | "error" | "info" | "success" | "warning"
  content: string
  id: string
}

interface StableTerminalProps {
  initialHistory?: HistoryItem[]
  onCommand?: (command: string) => void
  className?: string
  onMaximize?: (isMaximized: boolean) => void
  fixedHeight?: boolean
  prompt?: string
}

export default function StableTerminal({
  initialHistory = [],
  onCommand,
  className = "",
  onMaximize,
  fixedHeight = true,
  prompt = "$",
}: StableTerminalProps) {
  // State management
  const [input, setInput] = useState("")
  const [isMaximized, setIsMaximized] = useState(false)
  const [history, setHistory] = useState<HistoryItem[]>(initialHistory)
  const [isProcessing, setIsProcessing] = useState(false)

  // Refs for DOM elements
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)
  const scrollLockRef = useRef(true)
  const lastCommandRef = useRef("")

  // Generate stable IDs for history items
  const generateId = useCallback(() => `term-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, [])

  // Virtualized list for efficient rendering of large terminal output
  const rowVirtualizer = useVirtualizer({
    count: history.length,
    getScrollElement: () => outputRef.current,
    estimateSize: () => 24, // Estimated line height
    overscan: 10, // Number of items to render outside of the visible area
  })

  // Memoized command handler to prevent unnecessary re-renders
  const handleCommand = useCallback(
    async (cmd: string) => {
      if (!cmd.trim()) return

      lastCommandRef.current = cmd

      // Add command to history with a stable ID
      setHistory((prev) => [...prev, { type: "command", content: cmd, id: generateId() }])

      setIsProcessing(true)

      // Process command (simulate delay for demonstration)
      try {
        if (onCommand) {
          onCommand(cmd)
        }

        // Handle built-in commands
        if (cmd.toLowerCase() === "clear") {
          setHistory([])
          setIsProcessing(false)
          return
        }

        // Simulate command processing
        setTimeout(() => {
          let responseType: "output" | "error" | "info" | "success" | "warning" = "output"
          let response = `Executed command: ${cmd}`

          if (cmd.toLowerCase().includes("error")) {
            responseType = "error"
            response = "An error occurred while processing the command."
          } else if (cmd.toLowerCase().includes("warning")) {
            responseType = "warning"
            response = "Warning: This operation may have side effects."
          } else if (cmd.toLowerCase().includes("success")) {
            responseType = "success"
            response = "Operation completed successfully."
          } else if (cmd.toLowerCase().includes("info")) {
            responseType = "info"
            response = "Here is some information about the system."
          }

          setHistory((prev) => [...prev, { type: responseType, content: response, id: generateId() }])

          setIsProcessing(false)
        }, 300)
      } catch (error) {
        setHistory((prev) => [
          ...prev,
          {
            type: "error",
            content: `Error: ${error instanceof Error ? error.message : String(error)}`,
            id: generateId(),
          },
        ])
        setIsProcessing(false)
      }

      setInput("")
    },
    [onCommand, generateId],
  )

  // Debounced scroll handler to prevent too many updates
  const handleScroll = useMemo(
    () =>
      debounce(() => {
        if (!outputRef.current) return

        const { scrollTop, scrollHeight, clientHeight } = outputRef.current
        // Lock scroll to bottom if we're close to the bottom
        scrollLockRef.current = scrollHeight - scrollTop - clientHeight < 50
      }, 100),
    [],
  )

  // Auto-scroll to bottom when history changes if scroll is locked
  useEffect(() => {
    if (!outputRef.current || !scrollLockRef.current) return

    const scrollToBottom = () => {
      if (outputRef.current) {
        outputRef.current.scrollTop = outputRef.current.scrollHeight
      }
    }

    // Use requestAnimationFrame for smooth scrolling
    requestAnimationFrame(scrollToBottom)
  }, [history])

  // Focus input on mount and when clicking terminal
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleCommand(input)
  }

  // Handle terminal click to focus input
  const handleTerminalClick = useCallback((e: React.MouseEvent) => {
    // Don't focus if user is selecting text
    if (window.getSelection()?.toString()) return

    // Don't focus if clicking on a button or input
    if (
      e.target instanceof HTMLButtonElement ||
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLAnchorElement
    ) {
      return
    }

    inputRef.current?.focus()
  }, [])

  // Handle maximize/minimize
  const toggleMaximize = useCallback(() => {
    setIsMaximized((prev) => !prev)
    if (onMaximize) {
      onMaximize(!isMaximized)
    }
  }, [isMaximized, onMaximize])

  // Handle key navigation (up/down arrows for history)
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp" && lastCommandRef.current) {
      e.preventDefault()
      setInput(lastCommandRef.current)
    }
  }, [])

  // Render the terminal with optimized layout
  return (
    <TooltipProvider>
      <div
        className={`terminal-window ${
          isMaximized ? "fixed inset-0 z-50" : fixedHeight ? "w-full max-w-4xl h-[80vh]" : "w-full max-w-4xl"
        } ${className}`}
        onClick={handleTerminalClick}
        style={{
          // Prevent layout shifts with fixed dimensions
          contain: "strict",
          willChange: "transform",
        }}
      >
        {/* Terminal header - fixed height to prevent layout shifts */}
        <div className="terminal-header h-10 flex items-center justify-between px-4" style={{ willChange: "contents" }}>
          <div className="flex items-center">
            <TerminalIcon className="h-4 w-4 text-primary-400 mr-2" />
            <span className="text-white font-medium">AIDEN Terminal</span>
          </div>

          <div className="flex items-center space-x-2">
            <Tooltip content="Help">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-neutral-400 hover:text-white"
                onClick={() => handleCommand("help")}
              >
                <HelpCircle size={14} />
              </Button>
            </Tooltip>

            <Tooltip content="Clear">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-neutral-400 hover:text-white"
                onClick={() => handleCommand("clear")}
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

        {/* Terminal body - virtualized for performance */}
        <div
          ref={terminalRef}
          className="terminal-body relative"
          style={{
            height: fixedHeight ? "calc(100% - 80px)" : "400px",
            willChange: "contents",
            overflowY: "hidden", // Hide overflow to prevent double scrollbars
          }}
        >
          {/* Virtualized output container */}
          <div
            ref={outputRef}
            className="h-full overflow-y-auto px-4 py-2"
            onScroll={handleScroll}
            style={{
              willChange: "scroll-position",
              overscrollBehavior: "contain", // Prevent scroll chaining
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(24, 144, 255, 0.5) rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* Container for virtualized items with proper sizing */}
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
                    className={`absolute top-0 left-0 w-full ${
                      item.type === "command" ? "terminal-command" : `terminal-${item.type}`
                    }`}
                    style={{
                      height: `${virtualItem.size}px`,
                      transform: `translateY(${virtualItem.start}px)`,
                      willChange: "transform",
                      transition: "transform 0.1s ease-out",
                    }}
                  >
                    {item.type === "command" ? (
                      <div className="flex items-center">
                        <span className="terminal-prompt mr-1">{prompt}</span>
                        <span>{item.content}</span>
                      </div>
                    ) : (
                      <div>{item.content}</div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Processing indicator - absolute positioned to prevent layout shifts */}
          {isProcessing && (
            <div className="absolute bottom-14 left-4 flex items-center text-primary-400 animate-pulse">
              <span className="mr-2">●</span>
              Processing...
            </div>
          )}

          {/* Input form - fixed height to prevent layout shifts */}
          <form
            onSubmit={handleSubmit}
            className="absolute bottom-0 left-0 right-0 border-t border-primary-900/30 p-2 h-12 flex items-center bg-terminal-bg"
            style={{ willChange: "contents" }}
          >
            <span className="terminal-prompt mr-2">{prompt}</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="terminal-input flex-1 bg-transparent text-white outline-none"
              placeholder="Enter command..."
              disabled={isProcessing}
              autoFocus
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              style={{ willChange: "contents" }}
            />
          </form>
        </div>
      </div>
    </TooltipProvider>
  )
}
