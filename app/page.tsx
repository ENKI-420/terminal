"use client"

import { useState, useCallback } from "react"
import Header from "@/components/header"
import ModernTerminal from "@/components/modern-terminal"
import DataVisualization from "@/components/data-visualization"
import { Shield, Server, Database, Lock } from "lucide-react"

export default function Home() {
  const [dataPoints, setDataPoints] = useState(0)
  const [securityEvents, setSecurityEvents] = useState(0)

  // Handle data points from visualization
  const handleDataPoint = useCallback((x: number, y: number, value: number) => {
    setDataPoints((prev) => prev + 1)
    if (value > 0.8) {
      setSecurityEvents((prev) => prev + 1)
    }
  }, [])

  // Initial terminal history
  const initialHistory = [
    "AIDEN Terminal v2.5.7",
    "Adaptive Integrated Defense and Execution Node",
    "Type 'help' for available commands.",
    "",
  ]

  return (
    <main className="min-h-screen bg-neutral-950 text-white flex flex-col">
      {/* Background data visualization */}
      <DataVisualization
        intensity={0.6}
        primaryColor="#1890ff"
        secondaryColor="#f5222d"
        speed={3}
        onDataPoint={handleDataPoint}
      />

      {/* Header */}
      <Header username="Agent" notifications={securityEvents % 10} />

      {/* Main content */}
      <div className="flex-1 container mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        {/* Status cards */}
        <div className="lg:w-64 space-y-4">
          <div className="bg-neutral-900/70 backdrop-blur-sm rounded-lg border border-primary-900/30 p-4 animate-fade-in">
            <div className="flex items-center mb-3">
              <Shield className="h-5 w-5 text-primary-500 mr-2" />
              <h3 className="text-sm font-medium text-neutral-200">Security Status</h3>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-400">Threat Level</span>
              <span className="text-xs font-medium text-green-500">Low</span>
            </div>
            <div className="mt-1 h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: "15%" }}></div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-neutral-400">Security Events</span>
              <span className="text-xs font-medium text-primary-400">{securityEvents}</span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-neutral-400">Last Scan</span>
              <span className="text-xs font-medium text-neutral-300">2 hours ago</span>
            </div>
          </div>

          <div
            className="bg-neutral-900/70 backdrop-blur-sm rounded-lg border border-primary-900/30 p-4 animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="flex items-center mb-3">
              <Server className="h-5 w-5 text-primary-500 mr-2" />
              <h3 className="text-sm font-medium text-neutral-200">System Status</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400">CPU Usage</span>
                <span className="text-xs font-medium text-neutral-300">32%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400">Memory</span>
                <span className="text-xs font-medium text-neutral-300">2.4 GB / 8 GB</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400">Uptime</span>
                <span className="text-xs font-medium text-neutral-300">47d 12h 33m</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400">Data Points</span>
                <span className="text-xs font-medium text-primary-400">{dataPoints}</span>
              </div>
            </div>
          </div>

          <div
            className="bg-neutral-900/70 backdrop-blur-sm rounded-lg border border-primary-900/30 p-4 animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="flex items-center mb-3">
              <Database className="h-5 w-5 text-primary-500 mr-2" />
              <h3 className="text-sm font-medium text-neutral-200">Storage</h3>
            </div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-neutral-400">Usage</span>
              <span className="text-xs font-medium text-neutral-300">42%</span>
            </div>
            <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
              <div className="h-full bg-primary-600 rounded-full" style={{ width: "42%" }}></div>
            </div>
            <div className="mt-3 text-xs text-neutral-500">427.8 GB free of 1 TB</div>
          </div>

          <div
            className="bg-neutral-900/70 backdrop-blur-sm rounded-lg border border-primary-900/30 p-4 animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="flex items-center mb-3">
              <Lock className="h-5 w-5 text-primary-500 mr-2" />
              <h3 className="text-sm font-medium text-neutral-200">Access Control</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                <span className="text-xs text-neutral-300">Authentication: Active</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                <span className="text-xs text-neutral-300">Encryption: Enabled</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                <span className="text-xs text-neutral-300">Firewall: Active</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                <span className="text-xs text-neutral-300">Updates: Available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Terminal */}
        <div className="flex-1 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <ModernTerminal initialHistory={initialHistory} />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-neutral-900/80 backdrop-blur-sm border-t border-primary-900/30 py-3 text-center text-xs text-neutral-500">
        AIDEN v2.5.7 - Adaptive Integrated Defense and Execution Node - © 2025 AGILE DEFENSE SYSTEMS, LLC
      </footer>
    </main>
  )
}
