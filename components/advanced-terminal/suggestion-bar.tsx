"use client"
import { cn } from "@/lib/utils"

interface SuggestionBarProps {
  suggestions: string[]
  selectedIndex: number
  onSelect: (suggestion: string) => void
}

export function SuggestionBar({ suggestions, selectedIndex, onSelect }: SuggestionBarProps) {
  if (suggestions.length === 0) return null

  return (
    <div className="px-2 py-1 border-t border-neutral-800 bg-neutral-900 flex flex-wrap gap-1">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          className={cn(
            "px-2 py-0.5 text-xs rounded border border-neutral-700 hover:bg-neutral-800 transition-colors",
            index === selectedIndex
              ? "bg-primary-900/50 border-primary-700 text-primary-100"
              : "bg-neutral-900 text-neutral-300",
          )}
          onClick={() => onSelect(suggestion)}
        >
          {suggestion}
        </button>
      ))}
      <div className="text-xs text-neutral-500 ml-auto self-center">
        Press <kbd className="px-1 py-0.5 bg-neutral-800 rounded">Tab</kbd> to complete
      </div>
    </div>
  )
}
