import type { HistoryItem } from "./terminal"
import { cn } from "@/lib/utils"

interface TerminalOutputProps {
  item: HistoryItem
  username: string
  hostname: string
  workingDirectory: string
}

export function TerminalOutput({ item, username, hostname, workingDirectory }: TerminalOutputProps) {
  // Determine the appropriate styling based on the item type
  const getTypeStyles = () => {
    switch (item.type) {
      case "command":
        return "text-neutral-100"
      case "output":
        return item.enhanced ? "text-neutral-100 enhanced-output" : "text-neutral-300"
      case "error":
        return "text-red-500"
      case "warning":
        return "text-yellow-500"
      case "info":
        return "text-blue-500"
      case "success":
        return "text-green-500"
      case "system":
        return "text-purple-500"
      default:
        return "text-neutral-300"
    }
  }

  return (
    <div className={cn("py-0.5", getTypeStyles())}>
      {item.type === "command" ? (
        <div className="flex">
          <span className="mr-2">
            <span className="text-green-500">{username}</span>
            <span className="text-neutral-400">@</span>
            <span className="text-primary-500">{hostname}</span>
            <span className="text-neutral-400">:</span>
            <span className="text-blue-500">{workingDirectory}</span>
            <span className="text-neutral-400 ml-1">$</span>
          </span>
          <span>{item.content}</span>
        </div>
      ) : (
        <div className="whitespace-pre-wrap break-all">{item.content}</div>
      )}
    </div>
  )
}
