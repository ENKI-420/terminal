"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Maximize2, Minimize2, TerminalIcon, HelpCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip"
import QuantumCircuit from "./quantum-circuit"

interface TerminalProps {
  initialHistory?: string[]
  onCommand?: (command: string) => void
  className?: string
}

const COMMANDS = {
  HELP: "help",
  CLEAR: "clear",
  SYSTEM: "system",
  QUANTUM: "quantum",
  RUN: "run",
  EXIT: "exit",
  STATUS: "status",
}

export default function ModernTerminal({ initialHistory = [], onCommand, className = "" }: TerminalProps) {
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<{ type: string; content: string }[]>(
    initialHistory.map((line) => ({ type: "output", content: line })),
  )
  const [isMaximized, setIsMaximized] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showCircuit, setShowCircuit] = useState(false)
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when history changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  // Focus input on mount and when clicking terminal
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const addToHistory = (content: string, type = "output") => {
    setHistory((prev) => [...prev, { type, content }])
  }

  const handleCommand = (cmd: string) => {
    // Add command to history
    addToHistory(cmd, "command")

    // External command handler
    if (onCommand) {
      onCommand(cmd)
    }

    const command = cmd.trim().toLowerCase()

    if (command === "") {
      return
    }

    if (command === COMMANDS.HELP) {
      addToHistory("Available commands:")
      addToHistory(`  ${COMMANDS.HELP}    - Show this help message`)
      addToHistory(`  ${COMMANDS.CLEAR}   - Clear terminal`)
      addToHistory(`  ${COMMANDS.SYSTEM}  - Show system information`)
      addToHistory(`  ${COMMANDS.QUANTUM} - Show quantum circuit`)
      addToHistory(`  ${COMMANDS.RUN}     - Run quantum simulation`)
      addToHistory(`  ${COMMANDS.STATUS}  - Check system status`)
      addToHistory(`  ${COMMANDS.EXIT}    - Exit terminal`)
    } else if (command === COMMANDS.CLEAR) {
      setHistory([])
    } else if (command === COMMANDS.SYSTEM) {
      addToHistory("AIDEN System Information:", "info")
      addToHistory("Version: 2.5.7")
      addToHistory("Core: Quantum-enhanced neural network")
      addToHistory("Security Level: Maximum")
      addToHistory("Uptime: 47 days, 12 hours, 33 minutes")
      addToHistory("Status: Operational")
      addToHistory("Environment: Production")
    } else if (command === COMMANDS.QUANTUM) {
      setShowCircuit(true)
      addToHistory("Quantum circuit initialized", "info")
    } else if (command === COMMANDS.RUN) {
      runQuantumSimulation()
    } else if (command === COMMANDS.STATUS) {
      addToHistory("System Status:", "info")
      addToHistory("Core Systems: Online", "success")
      addToHistory("Quantum Processor: Operational", "success")
      addToHistory("Security Protocols: Active", "success")
      addToHistory("Network Status: Connected", "success")
      addToHistory("Last Security Scan: 2 hours ago", "info")
      addToHistory("Threat Level: Low", "info")
    } else if (command === COMMANDS.EXIT) {
      addToHistory("Terminal session ended.", "info")
      // In a real app, you might close the terminal or redirect
    } else {
      addToHistory(`Command not recognized: ${command}. Type 'help' for available commands.`, "error")
    }
  }

  const runQuantumSimulation = () => {
    setLoading(true)
    addToHistory("Initializing quantum simulation...", "info")

    // Simulate quantum computation with delay
    setTimeout(() => {
      addToHistory("Preparing qubits...", "info")
    }, 800)

    setTimeout(() => {
      addToHistory("Applying quantum gates...", "info")
    }, 1600)

    setTimeout(() => {
      addToHistory("Entangling quantum states...", "info")
    }, 2400)

    setTimeout(() => {
      const states = ["|0⟩", "|1⟩", "|+⟩", "|-⟩", "|Ψ⟩", "1/√2(|00⟩ + |11⟩)"]
      const randomState = states[Math.floor(Math.random() * states.length)]
      addToHistory(`Quantum state collapsed to: ${randomState}`, "success")
      addToHistory("Simulation complete.", "success")
      setLoading(false)
    }, 3200)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      handleCommand(input)
      setInput("")
    }
  }

  const handleTerminalClick = () => {
    inputRef.current?.focus()
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
                onClick={() => setIsMaximized(!isMaximized)}
              >
                {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              </Button>
            </Tooltip>
          </div>
        </div>

        <div ref={terminalRef} className="terminal-body">
          {history.map((item, i) => (
            <div key={i} className={`mb-1 ${item.type === "command" ? "terminal-command" : `terminal-${item.type}`}`}>
              {item.type === "command" ? (
                <div className="flex">
                  <span className="terminal-prompt">$</span>
                  <span>{item.content}</span>
                </div>
              ) : (
                <div>{item.content}</div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center text-primary-400 mt-2 animate-pulse">
              <span className="mr-2">●</span>
              Processing quantum data...
            </div>
          )}

          {showCircuit && (
            <div className="my-4 circuit-diagram animate-fade-in">
              <QuantumCircuit />
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-2 flex items-center">
            <span className="terminal-prompt">$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="terminal-input"
              placeholder="Enter command..."
              disabled={loading}
              autoFocus
            />
          </form>
        </div>
      </div>
    </TooltipProvider>
  )
}
