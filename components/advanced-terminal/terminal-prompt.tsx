import { Loader2 } from "lucide-react"

interface TerminalPromptProps {
  username: string
  hostname: string
  workingDirectory: string
  isProcessing: boolean
}

export function TerminalPrompt({ username, hostname, workingDirectory, isProcessing }: TerminalPromptProps) {
  return (
    <div className="flex items-center mr-2 text-sm font-mono">
      {isProcessing ? (
        <Loader2 className="h-4 w-4 text-primary-500 animate-spin mr-2" />
      ) : (
        <>
          <span className="text-green-500">{username}</span>
          <span className="text-neutral-400">@</span>
          <span className="text-primary-500">{hostname}</span>
          <span className="text-neutral-400">:</span>
          <span className="text-blue-500">{workingDirectory}</span>
          <span className="text-neutral-400 ml-1">$</span>
        </>
      )}
    </div>
  )
}
