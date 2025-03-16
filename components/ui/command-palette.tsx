"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { IconSearch, IconCommand, IconGene, IconPill, IconMicroscope } from "@tabler/icons-react"

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (command: string) => void
}

export function CommandPalette({ isOpen, onClose, onSelect }: CommandPaletteProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState<string[]>([])

  // Mock command suggestions
  const commands = [
    { id: "egfr", label: "EGFR mutations", icon: <IconGene className="w-4 h-4 mr-2" /> },
    { id: "brca", label: "BRCA1/2 analysis", icon: <IconGene className="w-4 h-4 mr-2" /> },
    { id: "osimertinib", label: "Osimertinib resistance", icon: <IconPill className="w-4 h-4 mr-2" /> },
    { id: "tmb", label: "Tumor Mutational Burden", icon: <IconMicroscope className="w-4 h-4 mr-2" /> },
    { id: "msi", label: "Microsatellite Instability", icon: <IconMicroscope className="w-4 h-4 mr-2" /> },
  ]

  useEffect(() => {
    if (searchQuery) {
      const filtered = commands
        .filter((cmd) => cmd.label.toLowerCase().includes(searchQuery.toLowerCase()))
        .map((cmd) => cmd.id)
      setResults(filtered)
    } else {
      setResults(commands.map((cmd) => cmd.id))
    }
  }, [searchQuery])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown)
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="command-palette" onClick={onClose}>
      <div className="command-palette-content" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center p-4 border-b border-border">
          <IconSearch className="w-5 h-5 mr-2 text-muted-foreground" />
          <Input
            placeholder="Search mutations, therapies, biomarkers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            autoFocus
          />
          <div className="flex items-center ml-2 px-2 py-1 rounded bg-secondary text-xs text-muted-foreground">
            <IconCommand className="w-3 h-3 mr-1" />
            <span>K</span>
          </div>
        </div>

        <div className="py-2 max-h-[300px] overflow-y-auto">
          {results.length > 0 ? (
            results.map((id) => {
              const command = commands.find((cmd) => cmd.id === id)
              if (!command) return null

              return (
                <button
                  key={id}
                  className="w-full text-left px-4 py-2 hover:bg-secondary flex items-center"
                  onClick={() => {
                    onSelect(id)
                    onClose()
                  }}
                >
                  {command.icon}
                  <span>{command.label}</span>
                </button>
              )
            })
          ) : (
            <div className="px-4 py-2 text-muted-foreground">No results found</div>
          )}
        </div>
      </div>
    </div>
  )
}

