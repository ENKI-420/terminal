import { Wifi, WifiOff, Play, Zap } from "lucide-react"

interface StatusBarProps {
  exitCode: number
  networkStatus: "connected" | "disconnected"
  activeConnections: number
  sequenceStatus?: string
  autoAdvance: boolean
  enhanceOutput: boolean
}

export function StatusBar({
  exitCode,
  networkStatus,
  activeConnections,
  sequenceStatus,
  autoAdvance,
  enhanceOutput,
}: StatusBarProps) {
  return (
    <div className="flex items-center justify-between px-2 py-1 text-xs border-t border-neutral-800 bg-neutral-900 text-neutral-400">
      <div className="flex items-center space-x-2">
        <div className="flex items-center">
          <span className={exitCode === 0 ? "text-green-500" : "text-red-500"}>●</span>
          <span className="ml-1">Exit: {exitCode}</span>
        </div>

        {sequenceStatus && (
          <div className="flex items-center">
            <span className="text-primary-500">●</span>
            <span className="ml-1">Sequence: {sequenceStatus}</span>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-3">
        {autoAdvance && (
          <div className="flex items-center">
            <Play className="h-3 w-3 text-green-500 mr-1" />
            <span>Auto</span>
          </div>
        )}

        {enhanceOutput && (
          <div className="flex items-center">
            <Zap className="h-3 w-3 text-primary-500 mr-1" />
            <span>Enhanced</span>
          </div>
        )}

        <div className="flex items-center">
          {networkStatus === "connected" ? (
            <>
              <Wifi className="h-3 w-3 text-green-500 mr-1" />
              <span>
                {activeConnections} {activeConnections === 1 ? "connection" : "connections"}
              </span>
            </>
          ) : (
            <>
              <WifiOff className="h-3 w-3 text-neutral-500 mr-1" />
              <span>Offline</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
