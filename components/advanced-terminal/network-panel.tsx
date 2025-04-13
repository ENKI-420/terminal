"use client"

import { useState } from "react"
import { X, Plus, Trash2, Wifi, WifiOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface NetworkConnection {
  id: string
  host: string
  port: number
  type: "ssh" | "http" | "https" | "ftp" | "custom"
  status: "connected" | "disconnected" | "error"
  error?: string
}

interface NetworkPanelProps {
  isConnected: boolean
  activeConnections: NetworkConnection[]
  onConnect: (host: string, port: number, type: string) => void
  onDisconnect: (id: string) => void
  onClose: () => void
}

export function NetworkPanel({ isConnected, activeConnections, onConnect, onDisconnect, onClose }: NetworkPanelProps) {
  const [host, setHost] = useState("")
  const [port, setPort] = useState("22")
  const [type, setType] = useState<string>("ssh")

  const handleConnect = () => {
    if (!host || !port) return
    onConnect(host, Number.parseInt(port), type)
    setHost("")
    setPort("22")
  }

  return (
    <div className="w-64 border-r border-neutral-800 bg-neutral-900 flex flex-col">
      <div className="flex items-center justify-between p-2 border-b border-neutral-800">
        <h3 className="text-sm font-medium">Network</h3>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-neutral-400 hover:text-neutral-100"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-2 border-b border-neutral-800">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Input value={host} onChange={(e) => setHost(e.target.value)} placeholder="Host" className="h-7 text-xs" />
            <Input
              value={port}
              onChange={(e) => setPort(e.target.value.replace(/[^0-9]/g, ""))}
              placeholder="Port"
              className="h-7 text-xs w-16"
            />
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="h-7 text-xs bg-neutral-950 border border-neutral-800 rounded px-2 py-1 w-full"
            >
              <option value="ssh">SSH</option>
              <option value="http">HTTP</option>
              <option value="https">HTTPS</option>
              <option value="ftp">FTP</option>
              <option value="custom">Custom</option>
            </select>

            <Button size="sm" className="h-7 text-xs" onClick={handleConnect}>
              <Plus className="h-3 w-3 mr-1" />
              Connect
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          <h4 className="text-xs font-medium text-neutral-400 mb-2">Active Connections</h4>

          {activeConnections.length === 0 ? (
            <div className="text-xs text-neutral-500 italic">No active connections</div>
          ) : (
            <div className="space-y-2">
              {activeConnections.map((connection) => (
                <div
                  key={connection.id}
                  className="text-xs bg-neutral-950 p-2 rounded border border-neutral-800 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center">
                      {connection.status === "connected" ? (
                        <Wifi className="h-3 w-3 text-green-500 mr-1" />
                      ) : connection.status === "error" ? (
                        <WifiOff className="h-3 w-3 text-red-500 mr-1" />
                      ) : (
                        <WifiOff className="h-3 w-3 text-neutral-500 mr-1" />
                      )}
                      <span className="font-medium">
                        {connection.host}:{connection.port}
                      </span>
                    </div>
                    <div className="text-neutral-500">{connection.type.toUpperCase()}</div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-neutral-400 hover:text-red-500"
                    onClick={() => onDisconnect(connection.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="p-2 border-t border-neutral-800 flex items-center">
        <div className="flex items-center text-xs">
          <div className={`h-2 w-2 rounded-full mr-2 ${isConnected ? "bg-green-500" : "bg-neutral-500"}`}></div>
          <span>{isConnected ? "Connected" : "Disconnected"}</span>
        </div>
      </div>
    </div>
  )
}
