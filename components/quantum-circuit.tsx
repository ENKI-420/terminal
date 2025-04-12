"use client"

import { useEffect, useState } from "react"

type Gate = {
  type: "H" | "X" | "Y" | "Z" | "CNOT" | "SWAP"
  position: number
  control?: number
}

export default function QuantumCircuit() {
  const [qubits] = useState(3)
  const [gates, setGates] = useState<Gate[]>([])
  const [step, setStep] = useState(0)
  const [quantumState, setQuantumState] = useState("|000⟩")

  useEffect(() => {
    // Initialize with some gates for demonstration
    const initialGates: Gate[] = [
      { type: "H", position: 0 },
      { type: "CNOT", position: 1, control: 0 },
      { type: "H", position: 2 },
      { type: "X", position: 0 },
      { type: "CNOT", position: 2, control: 1 },
    ]

    const timer = setInterval(() => {
      setStep((prev) => {
        if (prev >= initialGates.length) {
          clearInterval(timer)
          return prev
        }
        setGates((g) => [...g, initialGates[prev]])

        // Update quantum state based on step
        if (prev === 0) {
          setQuantumState("1/√2(|0⟩ + |1⟩)|00⟩")
        } else if (prev === 1) {
          setQuantumState("1/√2(|00⟩ + |11⟩)|0⟩")
        } else if (prev === 2) {
          setQuantumState("1/√2(|00⟩ + |11⟩)1/√2(|0⟩ + |1⟩)")
        } else if (prev === 3) {
          setQuantumState("1/√2(|10⟩ + |01⟩)1/√2(|0⟩ + |1⟩)")
        } else if (prev === 4) {
          setQuantumState("1/√2(|000⟩ + |111⟩)")
        }

        return prev + 1
      })
    }, 800)

    return () => clearInterval(timer)
  }, [])

  const renderGate = (gate: Gate) => {
    switch (gate.type) {
      case "H":
        return (
          <div className="circuit-gate w-8 h-8 rounded flex items-center justify-center text-primary-400 border border-primary-500">
            H
          </div>
        )
      case "X":
        return (
          <div className="circuit-gate w-8 h-8 rounded flex items-center justify-center text-primary-400 border border-primary-500">
            X
          </div>
        )
      case "Y":
        return (
          <div className="circuit-gate w-8 h-8 rounded flex items-center justify-center text-primary-400 border border-primary-500">
            Y
          </div>
        )
      case "Z":
        return (
          <div className="circuit-gate w-8 h-8 rounded flex items-center justify-center text-primary-400 border border-primary-500">
            Z
          </div>
        )
      case "CNOT":
        return (
          <div className="circuit-gate w-8 h-8 rounded flex items-center justify-center text-primary-400 border border-primary-500">
            ⊕
          </div>
        )
      case "SWAP":
        return (
          <div className="circuit-gate w-8 h-8 rounded flex items-center justify-center text-primary-400 border border-primary-500">
            ⨯
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="font-mono text-neutral-300">
      <div className="mb-3 text-primary-400 font-medium">Quantum Circuit Simulation</div>
      <div className="grid gap-6">
        {Array.from({ length: qubits }).map((_, i) => (
          <div key={i} className="flex items-center">
            <div className="w-8 mr-3 text-right text-primary-300">q{i}:</div>
            <div className="flex-1 h-0.5 bg-primary-700/50 relative flex items-center">
              {gates
                .filter((gate) => gate.position === i || gate.control === i)
                .map((gate, j) => {
                  const isControl = gate.control === i

                  return (
                    <div key={j} className="absolute" style={{ left: `${(j + 1) * 60}px` }}>
                      {isControl ? (
                        <div className="w-8 h-8 flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-primary-500"></div>
                          {gate.position !== undefined && gate.control !== undefined && (
                            <div
                              className="absolute w-0.5 bg-primary-500"
                              style={{
                                height: `${Math.abs(gate.position - gate.control) * 48}px`,
                                top: gate.position > gate.control ? "50%" : "auto",
                                bottom: gate.position < gate.control ? "50%" : "auto",
                              }}
                            ></div>
                          )}
                        </div>
                      ) : (
                        renderGate(gate)
                      )}
                    </div>
                  )
                })}
            </div>
            <div className="ml-3 w-16 text-primary-300">|{i === 0 ? "0" : i === 1 ? "+" : "Ψ"}⟩</div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-3 bg-neutral-800/50 rounded border border-primary-700/30">
        <div className="text-sm text-neutral-400">
          Quantum State:
          <span className="ml-2 font-bold text-primary-400">{quantumState}</span>
        </div>
        <div className="mt-2 text-xs text-neutral-500">
          Step {step} of 5 - {step >= 5 ? "Complete" : "Processing..."}
        </div>
      </div>
    </div>
  )
}
