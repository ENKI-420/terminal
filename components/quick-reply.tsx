"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface QuickReply {
  id: string
  title: string
  content: string
}

interface QuickReplyProps {
  onSelect: (content: string) => void
}

export function QuickReply({ onSelect }: QuickReplyProps) {
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchQuickReplies = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/content?type=quick-replies")

        if (!response.ok) {
          throw new Error("Failed to fetch quick replies")
        }

        const data = await response.json()
        setQuickReplies(data)
      } catch (err) {
        console.error("Error fetching quick replies:", err)
        setError("Failed to load quick replies")
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuickReplies()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center py-2">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return null // Don't show anything if there's an error
  }

  if (quickReplies.length === 0) {
    return null // Don't show anything if there are no quick replies
  }

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {quickReplies.map((reply) => (
        <Button key={reply.id} variant="outline" size="sm" className="text-xs" onClick={() => onSelect(reply.content)}>
          {reply.title}
        </Button>
      ))}
    </div>
  )
}

