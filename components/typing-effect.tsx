"use client"

import { useEffect, useState } from "react"

interface TypingEffectProps {
  text: string | string[]
  speed?: number
  className?: string
  onComplete?: () => void
}

export default function TypingEffect({ text, speed = 50, className = "", onComplete }: TypingEffectProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentLine, setCurrentLine] = useState(0)

  const textArray = Array.isArray(text) ? text : [text]

  useEffect(() => {
    if (currentLine >= textArray.length) {
      if (onComplete) onComplete()
      return
    }

    const currentText = textArray[currentLine]

    if (currentIndex < currentText.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + currentText[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, speed)

      return () => clearTimeout(timer)
    } else {
      // Move to next line
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + "\n")
        setCurrentLine((prev) => prev + 1)
        setCurrentIndex(0)
      }, speed * 10) // Longer pause between lines

      return () => clearTimeout(timer)
    }
  }, [currentIndex, currentLine, textArray, speed, onComplete])

  return (
    <div className={`font-mono whitespace-pre-line ${className}`}>
      {displayedText}
      {currentLine < textArray.length && <span className="animate-pulse">_</span>}
    </div>
  )
}
