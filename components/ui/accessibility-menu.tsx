"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { useThemeContext } from "@/app/theme"
import {
  IconAccessible,
  IconEye,
  IconLetterCase,
  IconZoomIn,
  IconZoomOut,
  IconVolume,
  IconVolumeOff,
} from "@tabler/icons-react"

export function AccessibilityMenu() {
  const { isDyslexiaMode, toggleDyslexiaMode } = useThemeContext()
  const [fontSize, setFontSize] = useState(100)
  const [soundEnabled, setSoundEnabled] = useState(false)

  const increaseFontSize = () => {
    if (fontSize < 150) {
      const newSize = fontSize + 10
      setFontSize(newSize)
      document.documentElement.style.fontSize = `${newSize}%`
    }
  }

  const decreaseFontSize = () => {
    if (fontSize > 80) {
      const newSize = fontSize - 10
      setFontSize(newSize)
      document.documentElement.style.fontSize = `${newSize}%`
    }
  }

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled)
    // In a real implementation, this would enable/disable sound effects
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full" aria-label="Accessibility options">
          <IconAccessible className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Accessibility Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={toggleDyslexiaMode}>
          <IconLetterCase className="mr-2 h-4 w-4" />
          <span>{isDyslexiaMode ? "Disable" : "Enable"} Dyslexia Font</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={increaseFontSize}>
          <IconZoomIn className="mr-2 h-4 w-4" />
          <span>Increase Font Size</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={decreaseFontSize}>
          <IconZoomOut className="mr-2 h-4 w-4" />
          <span>Decrease Font Size</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={toggleSound}>
          {soundEnabled ? (
            <>
              <IconVolumeOff className="mr-2 h-4 w-4" />
              <span>Disable Sounds</span>
            </>
          ) : (
            <>
              <IconVolume className="mr-2 h-4 w-4" />
              <span>Enable Sounds</span>
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <IconEye className="mr-2 h-4 w-4" />
          <span>High Contrast Mode</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

