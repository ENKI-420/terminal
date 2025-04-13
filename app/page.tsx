"use client"

import { useState, useCallback, useEffect } from "react"
import Header from "@/components/header"
import StableTerminal from "@/components/stable-terminal"
import RefinedMatrixRain from "@/components/refined-matrix-rain" // Import the refined matrix rain
import { Shield } from "lucide-react"

export default function Home() {
  const [dataPoints, setDataPoints] = useState(0)
  const [securityEvents, setSecurityEvents] = useState(0)
  const [isTerminalMaximized, setIsTerminalMaximized] = useState(false)
  const [isPageLoaded, setIsPageLoaded] = useState(false)

  // Handle data points from visualization
  const handleDataPoint = useCallback((x: number, y: number, value: number, type: string) => {
    setDataPoints((prev) => prev + 1)

    if (type === "critical") {
      setSecurityEvents((prev) => prev + 1)
    }
  }, [])

  // Handle terminal command
  const handleCommand = useCallback((command: string) => {
    console.log("Command executed:", command)

    // Update security events counter for demonstration
    if (command.toLowerCase().includes("scan") || command.toLowerCase().includes("security")) {
      setSecurityEvents((prev) => prev + 1)
    }
  }, [])

  // Handle matrix burn effect
  const handleMatrixBurn = useCallback((x: number, y: number) => {
    // Increment security events occasionally on matrix burn
    if (Math.random() > 0.8) {
      setSecurityEvents((prev) => prev + 1)
    }
  }, [])

  // Format number with commas
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  // Prevent FOUC (Flash of Unstyled Content)
  useEffect(() => {
    setIsPageLoaded(true)
  }, [])

  // Initial terminal history
  const initialHistory = [
    { type: "output" as const, content: "AIDEN Terminal v2.5.7", id: "init-1" },
    { type: "output" as const, content: "Adaptive Integrated Defense and Execution Node", id: "init-2" },
    { type: "info" as const, content: "Type 'help' for available commands.", id: "init-3" },
  ]

  return (
    <main className={`min-h-screen bg-neutral-950 text-white flex flex-col no-fouc ${isPageLoaded ? "loaded" : ""}`}>
      {/* Refined Matrix Rain with reduced opacity and enhanced logo visibility */}
      <RefinedMatrixRain
        text="AGILE DEFENSE SYSTEMS"
        onBurn={handleMatrixBurn}
        opacity={0.3} // Reduced opacity
        speed={0.8} // Slightly slower speed
        density={0.8} // Slightly reduced density
        highlightLogo={true} // Highlight logo area
      />

      {/* Header */}
      <Header username="Agent" notifications={securityEvents % 10} />

      {/* Main content */}
      <div
        className={`flex-1 container mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6 ${isTerminalMaximized ? "hidden" : ""}`}
      >
        {/* Status cards */}
        <div className="lg:w-64 space-y-4">
          <div className="bg-neutral-900/70 backdrop-blur-sm rounded-lg border border-primary-900/30 p-4 animate-fade-in">
            <div className="flex items-center mb-3">
              <Shield className="h-5 w-5 text-primary-500 mr-2" />
              <h3 className="text-sm font-medium text-neutral-200">Security Status</h3>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-400">Threat Level</span>
              <span
                className={`text-xs font-medium ${
                  securityEvents > 10 ? "text-red-500" : securityEvents > 5 ? "text-yellow-500" : "text-green-500"
                }`}
              >
                {securityEvents > 10 ? "High" : securityEvents > 5 ? "Medium" : "Low"}
              </span>
            </div>
            <div className="mt-1 h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  securityEvents > 10 ? "bg-red-500" : securityEvents > 5 ? "bg-yellow-500" : "bg-green-500"
                }`}
                style={{
                  width: `${Math.min(100, securityEvents * 5)}%`,
                  transition: "width 0.5s ease-out", // Smooth transition for width changes
                }}
              ></div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-neutral-400">Security Events</span>
              <span className="text-xs font-medium text-primary-400">{formatNumber(securityEvents)}</span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-neutral-400">Data Points</span>
              <span className="text-xs font-medium text-primary-400">{formatNumber(dataPoints)}</span>
            </div>
          </div>
        </div>

        {/* Terminal - using our stable terminal component */}
        <div className="flex-1 animate-fade-in content-visibility-auto" style={{ animationDelay: "0.2s" }}>
          <StableTerminal
            initialHistory={initialHistory}
            onMaximize={setIsTerminalMaximized}
            onCommand={handleCommand}
            fixedHeight={true}
            prompt="$"
          />
        </div>
      </div>

      {/* Footer */}
      <footer
        className={`bg-neutral-900/80 backdrop-blur-sm border-t border-primary-900/30 py-3 text-center text-xs text-neutral-500 ${isTerminalMaximized ? "hidden" : ""}`}
      >
        AIDEN v2.5.7 - Adaptive Integrated Defense and Execution Node - © 2025 AGILE DEFENSE SYSTEMS, LLC
      </footer>
    </main>
  )
}
