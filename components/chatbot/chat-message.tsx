import { IconUser, IconRobot, IconExternalLink } from "@tabler/icons-react"
import { SecurityBadge } from "@/components/ui/security-badge"
import { Button } from "@/components/ui/button"

interface Citation {
  source: string
  id: string
}

interface ChatMessageProps {
  message: {
    id: string
    content: string
    role: "user" | "agent"
    timestamp: Date
    citations?: Citation[]
  }
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAgent = message.role === "agent"

  return (
    <div className={`chat-message ${isAgent ? "agent-message" : "user-message"}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          {isAgent ? (
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <IconRobot className="h-5 w-5 text-primary" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center">
              <IconUser className="h-5 w-5" />
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center mb-1">
            <span className="text-sm font-semibold">{isAgent ? "AGENT 2.0" : "You"}</span>
            <span className="text-xs text-muted-foreground ml-2">
              {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
            {isAgent && <SecurityBadge type="audit" className="ml-2" />}
          </div>

          <div className="text-sm whitespace-pre-wrap">{message.content}</div>

          {message.citations && message.citations.length > 0 && (
            <div className="mt-2 text-xs text-muted-foreground">
              <span className="font-semibold">Sources:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {message.citations.map((citation, index) => (
                  <Button key={index} variant="outline" size="sm" className="h-6 px-2 text-xs" asChild>
                    <a
                      href={`https://pubmed.ncbi.nlm.nih.gov/${citation.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>
                        {citation.source}: {citation.id}
                      </span>
                      <IconExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

