"use client"
import { X, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ContextPanelProps {
  contextData: Record<string, any>
  onClose: () => void
}

export function ContextPanel({ contextData, onClose }: ContextPanelProps) {
  return (
    <div className="w-64 border-r border-neutral-800 bg-neutral-900 flex flex-col">
      <div className="flex items-center justify-between p-2 border-b border-neutral-800">
        <h3 className="text-sm font-medium">AI Context</h3>
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon" className="h-6 w-6 text-neutral-400 hover:text-neutral-100">
            <RefreshCw className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-neutral-400 hover:text-neutral-100"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-3">
          {Object.entries(contextData).map(([key, value]) => (
            <div key={key} className="space-y-1">
              <h4 className="text-xs font-medium text-neutral-400">{key}</h4>
              <div className="text-xs bg-neutral-950 p-2 rounded border border-neutral-800 whitespace-pre-wrap break-all">
                {typeof value === "object" ? JSON.stringify(value, null, 2) : String(value)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
