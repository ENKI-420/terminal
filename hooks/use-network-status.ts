"use client"

import { useState, useCallback } from "react"

interface NetworkConnection {
  id: string
  host: string
  port: number
  type: string
  status: "connected" | "disconnected" | "error"
  error?: string
}

export function useNetworkStatus() {
  const [isConnected, setIsConnected] = useState(false)
  const [activeConnections, setActiveConnections] = useState<NetworkConnection[]>([])

  const connectTo = useCallback((host: string, port: number, type: string) => {
    // Generate a unique ID for the connection
    const id = `${type}-${host}-${port}-${Date.now()}`

    // Simulate connection attempt
    const newConnection: NetworkConnection = {
      id,
      host,
      port,
      type,
      status: "connected",
    }

    setActiveConnections((prev) => [...prev, newConnection])
    setIsConnected(true)

    return id
  }, [])

  const disconnect = useCallback((id: string) => {
    setActiveConnections((prev) => {
      const newConnections = prev.filter((conn) => conn.id !== id)
      if (newConnections.length === 0) {
        setIsConnected(false)
      }
      return newConnections
    })
  }, [])

  const disconnectAll = useCallback(() => {
    setActiveConnections([])
    setIsConnected(false)
  }, [])

  return {
    isConnected,
    activeConnections,
    connectTo,
    disconnect,
    disconnectAll,
  }
}
