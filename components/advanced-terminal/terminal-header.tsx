"use client"
import { X, Terminal, Network, PenToolIcon as Tool, Brain, Play, Pause, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface TerminalHeaderProps {
  hostname: string
  username: string
  isConnected: boolean
  activeConnections: number
  autoAdvance: boolean
  enhanceOutput: boolean
  onClear: () => void
  onToggleContext: () => void
  onToggleNetwork: () => void
  onToggleTools: () => void
  onToggleAutoAdvance: () => void
  onToggleEnhanceOutput: () => void
}

export function TerminalHeader({
  hostname,
  username,
  isConnected,
  activeConnections,
  autoAdvance,
  enhanceOutput,
  onClear,
  onToggleContext,
  onToggleNetwork,
  onToggleTools,
  onToggleAutoAdvance,
  onToggleEnhanceOutput,
}: TerminalHeaderProps) {
  return (
    <TooltipProvider>
      <div className="flex items-center justify-between p-2 bg-neutral-900 border-b border-neutral-800">
        <div className="flex items-center space-x-2">
          <Terminal className="h-4 w-4 text-primary-500" />
          <span className="text-sm font-medium">
            {username}@{hostname}
          </span>
          {isConnected && (
            <span className="text-xs bg-primary-900/30 text-primary-400 px-1.5 py-0.5 rounded-full">
              {activeConnections} {activeConnections === 1 ? "connection" : "connections"}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-neutral-400 hover:text-neutral-100"
                onClick={onToggleContext}
              >
                <Brain className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle AI Context Panel (Ctrl+Shift+C)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-neutral-400 hover:text-neutral-100"
                onClick={onToggleNetwork}
              >
                <Network className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle Network Panel (Ctrl+Shift+N)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-neutral-400 hover:text-neutral-100"
                onClick={onToggleTools}
              >
                <Tool className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle Tools Panel (Ctrl+Shift+T)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`h-6 w-6 ${autoAdvance ? "text-green-500" : "text-neutral-400"} hover:text-neutral-100`}
                onClick={onToggleAutoAdvance}
              >
                {autoAdvance ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle Auto-Advance (Ctrl+Shift+A)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`h-6 w-6 ${enhanceOutput ? "text-primary-500" : "text-neutral-400"} hover:text-neutral-100`}
                onClick={onToggleEnhanceOutput}
              >
                <Zap className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle Output Enhancement (Ctrl+Shift+E)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-neutral-400 hover:text-neutral-100"
                onClick={onClear}
              >
                <X className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Clear Terminal (Ctrl+L)</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  )
}
