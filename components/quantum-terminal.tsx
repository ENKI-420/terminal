"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, TerminalIcon, Zap } from "lucide-react"
import MatrixRain from "./matrix-rain"
import QuantumCircuit from "./quantum-circuit"

const COMMANDS = {
  HELP: "help",
  CLEAR: "clear",
  MATRIX: "matrix",
  QUANTUM: "quantum",
  RUN: "run",
  EXIT: "exit",
}

const QUANTUM_STATES = ["|0⟩", "|1⟩", "|+⟩", "|-⟩", "|Ψ⟩", "1/√2(|00⟩ + |11⟩)"]

export default function QuantumTerminal() {
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<string[]>([
    "MATRIX QUANTUM TERMINAL v1.0",
    "Type 'help' for available commands.",
    "",
  ])
  const [loading, setLoading] = useState(false)
  const [showRain, setShowRain] = useState(false) // Initialize with false
  const [showCircuit, setShowCircuit] = useState(false)
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const addToHistory = (text: string) => {
    setHistory((prev) => [...prev, text])
  }

  const handleCommand = (cmd: string) => {
    addToHistory(`> ${cmd}`)

    const command = cmd.trim().toLowerCase()

    if (command === COMMANDS.HELP) {
      addToHistory("Available commands:")
      addToHistory(`  ${COMMANDS.HELP}    - Show this help message`)
      addToHistory(`  ${COMMANDS.CLEAR}   - Clear terminal`)
      addToHistory(`  ${COMMANDS.MATRIX}  - Toggle Matrix code rain`)
      addToHistory(`  ${COMMANDS.QUANTUM} - Show quantum circuit`)
      addToHistory(`  ${COMMANDS.RUN}     - Run quantum simulation`)
      addToHistory(`  ${COMMANDS.EXIT}    - Exit terminal`)
    } else if (command === COMMANDS.CLEAR) {
      setHistory(["MATRIX QUANTUM TERMINAL v1.0", ""])
    } else if (command === COMMANDS.MATRIX) {
      setShowRain(!showRain)
      addToHistory(`Matrix code rain ${!showRain ? "activated" : "deactivated"}`)
    } else if (command === COMMANDS.QUANTUM) {
      setShowCircuit(true)
      addToHistory("Quantum circuit initialized")
    } else if (command === COMMANDS.RUN) {
      runQuantumSimulation()
    } else if (command === COMMANDS.EXIT) {
      addToHistory("Cannot exit the Matrix. You are already too deep.")
    } else if (command) {
      addToHistory(`Command not recognized: ${cmd}`)
    }
  }

  const runQuantumSimulation = () => {
    setLoading(true)
    addToHistory("Initializing quantum simulation...")

    // Simulate quantum computation with delay
    setTimeout(() => {
      addToHistory("Preparing qubits...")
    }, 800)

    setTimeout(() => {
      addToHistory("Applying quantum gates...")
    }, 1600)

    setTimeout(() => {
      addToHistory("Entangling quantum states...")
    }, 2400)

    setTimeout(() => {
      const randomState = QUANTUM_STATES[Math.floor(Math.random() * QUANTUM_STATES.length)]
      addToHistory(`Quantum state collapsed to: ${randomState}`)
      addToHistory("Simulation complete.")
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

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
    inputRef.current?.focus()
  }, [history])

  return (
    <div className="w-full max-w-4xl h-[80vh] bg-black border border-green-500 rounded-md overflow-hidden relative">
      {showRain && <MatrixRain />}

      <div className="flex items-center justify-between bg-black p-2 border-b border-green-500">
        <div className="flex items-center">
          <TerminalIcon className="h-5 w-5 text-green-500 mr-2" />
          <span className="text-green-500 font-mono">MATRIX QUANTUM TERMINAL</span>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="h-7 border-green-500 text-green-500 hover:bg-green-900 hover:text-green-400"
            onClick={() => setShowRain(!showRain)}
          >
            <Zap className="h-4 w-4 mr-1" />
            {showRain ? "Disable" : "Enable"} Matrix
          </Button>
        </div>
      </div>

      <div ref={terminalRef} className="h-[calc(100%-80px)] overflow-y-auto p-4 font-mono text-green-500 relative">
        {history.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap mb-1">
            {line}
          </div>
        ))}

        {loading && (
          <div className="flex items-center text-green-500 mt-2">
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Processing quantum data...
          </div>
        )}

        {showCircuit && (
          <div className="my-4 border border-green-500 p-2 bg-black/50">
            <QuantumCircuit />
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="border-t border-green-500 p-2">
        <div className="flex items-center">
          <span className="text-green-500 mr-2 font-mono">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent text-green-500 outline-none font-mono"
            placeholder="Enter command..."
            disabled={loading}
            autoFocus
          />
        </div>
      </form>
    </div>
  )
}
