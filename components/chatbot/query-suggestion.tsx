"use client"

import { Button } from "@/components/ui/button"

interface QuerySuggestionProps {
  text: string
  onClick: () => void
}

export function QuerySuggestion({ text, onClick }: QuerySuggestionProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="bg-secondary/30 border-secondary hover:bg-secondary/50 text-xs h-8"
      onClick={onClick}
    >
      {text}
    </Button>
  )
}

