"use client"

import { useEffect, useRef, useState, useCallback } from "react"

interface MatrixRainProps {
  text?: string
  onBurn?: (x: number, y: number) => void
  debugMode?: boolean
  opacity?: number // Control overall opacity
  speed?: number // Control animation speed
  density?: number // Control character density
  highlightLogo?: boolean // Whether to highlight the logo area
}

interface BurnMark {
  x: number
  y: number
  size: number
  opacity: number
  color: string
}

interface BurnLog {
  character: string
  x: number
  y: number
  timestamp: number
}

export default function RefinedMatrixRain({
  text = "AGILE DEFENSE SYSTEMS",
  onBurn,
  debugMode = false,
  opacity = 0.3, // Reduced default opacity
  speed = 0.8, // Slightly slower speed
  density = 0.8, // Slightly reduced density
  highlightLogo = true,
}: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const logoPositionRef = useRef<DOMRect | null>(null)
  const burnMarksRef = useRef<BurnMark[]>([])
  const [burnMarks, setBurnMarks] = useState<BurnMark[]>([])
  const [burnLogs, setBurnLogs] = useState<BurnLog[]>([])
  const [showDebug, setShowDebug] = useState(false)
  const frameCountRef = useRef(0)
  const animationRef = useRef<number | null>(null)

  // Handle keyboard shortcuts
  useEffect(() => {
    if (!debugMode) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Shift + D to toggle debug mode
      if (e.shiftKey && e.key === "D") {
        setShowDebug((prev) => !prev)
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [debugMode])

  // Update logo position for collision detection - using ref instead of state
  const updateLogoPosition = useCallback((rect: DOMRect) => {
    logoPositionRef.current = rect
  }, [])

  // Update burn marks state occasionally for UI updates
  useEffect(() => {
    const updateInterval = setInterval(() => {
      setBurnMarks([...burnMarksRef.current])
    }, 500) // Update every 500ms instead of every frame

    return () => clearInterval(updateInterval)
  }, [])

  // Main animation effect
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Prepare the text to be used in the rain - using only English characters
    const targetText = text.split("")
    const fontSize = 14
    const columns = Math.floor((canvas.width / fontSize) * density) // Apply density factor

    // Characters to display (only English letters, numbers, and symbols)
    const englishChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>/?`~\\SPYDERNET"

    // Add tetrahedral physics symbols and AI calling cards
    const specialChars = "∆∇⊕⊗φΦπΠΩ∞∫∑√∂≡≈≠≤≥±∈∉∩∪⊂⊃⊆⊇⊥∠∟∥∦∧∨¬∀∃∄∴∵∼≅≌≜≝≞≟≠≡≢≣≤≥≦≧≨≩≪≫≬≭≮≯≰≱≲≳≴≵≶≷≸≹"
    const aiChars = "01AIDEN"
    const goldenRatio = "1.618033988749895"

    // Function to get a random character
    function getRandomCharacter() {
      // Special character probability
      const rand = Math.random()

      // 3% chance for special physics symbols (reduced from 5%)
      if (rand > 0.97) {
        return specialChars.charAt(Math.floor(Math.random() * specialChars.length))
      }

      // 3% chance for AI calling card characters (reduced from 5%)
      if (rand > 0.94) {
        return aiChars.charAt(Math.floor(Math.random() * aiChars.length))
      }

      // 3% chance for golden ratio digits (reduced from 5%)
      if (rand > 0.91) {
        return goldenRatio.charAt(Math.floor(Math.random() * goldenRatio.length))
      }

      // 15% chance for target text (reduced from 20%)
      if (rand > 0.76) {
        return targetText[Math.floor(Math.random() * targetText.length)]
      }

      // Otherwise use a random character
      return englishChars.charAt(Math.floor(Math.random() * englishChars.length))
    }

    // Initialize drops at random positions and speeds
    const drops: {
      pos: number
      speed: number
      opacity: number
      burning: boolean
      burnProgress: number
      character: string
      color: string
      size: number
      font: string
    }[] = []

    for (let i = 0; i < columns; i++) {
      // Randomly choose between dark red and green for each column
      const isRed = Math.random() > 0.9 // 10% chance of red (reduced from 20%)
      const color = isRed
        ? `rgba(180, 20, 20, ${Math.random() * 0.15 + 0.1})` // Dark red with 10-25% opacity (reduced)
        : `rgba(57, 255, 20, ${Math.random() * 0.15 + 0.1})` // Green with 10-25% opacity (reduced)

      // Vary font sizes slightly for visual interest
      const size =
        Math.random() > 0.9
          ? fontSize * (Math.random() * 0.5 + 0.8)
          : // 10% chance of smaller/larger
            fontSize

      // Vary fonts occasionally
      const font =
        Math.random() > 0.9
          ? "'Courier New', monospace"
          : // 10% chance of different font
            "'Hack', 'DejaVu Sans Mono', monospace"

      drops[i] = {
        pos: (Math.random() * canvas.height) / fontSize, // Start at random positions from top to bottom
        speed: (Math.random() * 0.5 + 0.2) * speed, // Apply speed factor
        opacity: (Math.random() * 0.15 + 0.1) * opacity, // Apply opacity factor (reduced from 0.18-0.36)
        burning: false,
        burnProgress: 0,
        character: getRandomCharacter(),
        color: color,
        size: size,
        font: font,
      }
    }

    // Array to track the character for each position
    const characters: string[][] = []
    for (let i = 0; i < columns; i++) {
      characters[i] = []
      for (let j = 0; j < canvas.height / fontSize; j++) {
        characters[i][j] = getRandomCharacter()
      }
    }

    // Screen jitter effect
    let jitterX = 0
    let jitterY = 0

    // Add occasional screen jitter
    const jitterInterval = setInterval(() => {
      if (Math.random() > 0.95) {
        // Reduced frequency (from 0.9)
        jitterX = (Math.random() - 0.5) * 2 // Reduced intensity (from 3)
        jitterY = (Math.random() - 0.5) * 2 // Reduced intensity (from 3)

        setTimeout(() => {
          jitterX = 0
          jitterY = 0
        }, 100)
      }
    }, 3000) // Less frequent (from 2000)

    const draw = () => {
      if (!ctx || !canvas) return

      // Semi-transparent black to create trail effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Apply screen jitter
      ctx.save()
      ctx.translate(jitterX, jitterY)

      frameCountRef.current++

      // Draw burn marks from ref
      burnMarksRef.current.forEach((mark) => {
        const gradient = ctx.createRadialGradient(mark.x, mark.y, 0, mark.x, mark.y, mark.size)

        if (mark.color === "green") {
          gradient.addColorStop(0, `rgba(57, 255, 20, ${mark.opacity * 0.6})`) // Reduced intensity
          gradient.addColorStop(0.5, `rgba(57, 255, 20, ${mark.opacity * 0.3})`) // Reduced intensity
          gradient.addColorStop(1, `rgba(57, 255, 20, 0)`)
        } else {
          gradient.addColorStop(0, `rgba(255, 57, 20, ${mark.opacity * 0.6})`) // Reduced intensity
          gradient.addColorStop(0.5, `rgba(255, 57, 20, ${mark.opacity * 0.3})`) // Reduced intensity
          gradient.addColorStop(1, `rgba(255, 57, 20, 0)`)
        }

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(mark.x, mark.y, mark.size, 0, Math.PI * 2)
        ctx.fill()
      })

      // Draw tetrahedral vertices occasionally
      if (frameCountRef.current % 300 === 0) {
        // Less frequent (from 200)
        // Draw subtle tetrahedral vertices
        const centerX = canvas.width / 2
        const centerY = canvas.height / 2
        const size = Math.min(canvas.width, canvas.height) * 0.4

        // Tetrahedron vertices
        const vertices = [
          { x: centerX, y: centerY - size / 2 }, // top
          { x: centerX - size / 2, y: centerY + size / 2 }, // bottom left
          { x: centerX + size / 2, y: centerY + size / 2 }, // bottom right
          { x: centerX, y: centerY }, // center (fourth vertex in 3D)
        ]

        // Draw subtle connections
        ctx.strokeStyle = "rgba(255, 215, 0, 0.03)" // Reduced opacity (from 0.05)
        ctx.lineWidth = 0.5
        ctx.beginPath()
        vertices.forEach((v, i) => {
          vertices.forEach((v2, j) => {
            if (i !== j) {
              ctx.moveTo(v.x, v.y)
              ctx.lineTo(v2.x, v2.y)
            }
          })
        })
        ctx.stroke()
      }

      // Set the text style
      ctx.font = `${fontSize}px "Hack", "DejaVu Sans Mono", monospace`

      // Get logo position for highlighting
      const logoPosition = logoPositionRef.current

      // Draw the matrix rain
      for (let i = 0; i < drops.length; i++) {
        // Get the current position
        const y = Math.floor(drops[i].pos)
        const x = i * fontSize

        // Check if this position is within the logo area
        let isInLogoArea = false
        if (highlightLogo && logoPosition) {
          isInLogoArea =
            x >= logoPosition.left - 20 &&
            x <= logoPosition.right + 20 &&
            y * fontSize >= logoPosition.top - 20 &&
            y * fontSize <= logoPosition.bottom + 20
        }

        // Check for collision with logo
        const yPos = y * fontSize
        if (
          logoPosition &&
          yPos >= logoPosition.top &&
          yPos <= logoPosition.bottom &&
          x >= logoPosition.left &&
          x <= logoPosition.right &&
          !drops[i].burning
        ) {
          // Start burning effect
          drops[i].burning = true
          drops[i].burnProgress = 0

          // Add a burn mark to ref
          const isRed = Math.random() > 0.7
          const newBurnMark = {
            x: x,
            y: yPos,
            size: Math.random() * 15 + 8, // Slightly smaller (from 20+10)
            opacity: Math.random() * 0.25 + 0.08, // Reduced opacity (from 0.3+0.1)
            color: isRed ? "red" : "green",
          }

          burnMarksRef.current = [...burnMarksRef.current.slice(-25), newBurnMark] // Keep fewer (from 30)

          // Add to burn log - only update state occasionally to avoid re-renders
          if (frameCountRef.current % 15 === 0) {
            // Less frequent (from 10)
            const newLog = {
              character: drops[i].character,
              x: x,
              y: yPos,
              timestamp: Date.now(),
            }

            // Use a function to update state to avoid stale closures
            setBurnLogs((prev) => [...prev.slice(-80), newLog]) // Keep fewer (from 100)
          }

          // Callback for burn effect
          if (onBurn) {
            onBurn(x, yPos)
          }
        }

        // Only process if y is within bounds and not fully burned
        if (y >= 0 && y < canvas.height / fontSize && (!drops[i].burning || drops[i].burnProgress < 1)) {
          // Occasionally change the character
          if (Math.random() > 0.92) {
            // Less frequent (from 0.9)
            drops[i].character = getRandomCharacter()
            characters[i][y] = drops[i].character
          }

          // Calculate color based on burning state
          let color
          if (drops[i].burning) {
            // Burning effect - transition from original color to orange to transparent
            const burnPhase = drops[i].burnProgress
            if (burnPhase < 0.3) {
              // Brighten first
              color = drops[i].color.includes("255, 20, 20")
                ? `rgba(255, 20, 20, ${(0.3 + burnPhase) * 2.5})` // Reduced intensity (from 3)
                : `rgba(57, 255, 20, ${(0.3 + burnPhase) * 2.5})` // Reduced intensity (from 3)
            } else if (burnPhase < 0.6) {
              // Transition to orange
              color = `rgba(255, ${Math.floor(255 - (burnPhase - 0.3) * 255 * 2)}, 20, ${(1 - burnPhase) * 1.7})` // Reduced intensity (from 2)
            } else {
              // Fade out
              color = `rgba(255, 20, 20, ${(1 - burnPhase) * 0.8})` // Reduced intensity (from 1)
            }

            // Advance burn progress
            drops[i].burnProgress += 0.05
          } else {
            // Use the column's assigned color
            color = drops[i].color

            // If in logo area, make characters more transparent unless they're burning
            if (isInLogoArea) {
              // Extract base color and reduce opacity even further for characters in logo area
              const baseColor = drops[i].color.substring(0, drops[i].color.lastIndexOf(",") + 1)
              color = `${baseColor} ${drops[i].opacity * 0.4})` // Significantly reduced opacity in logo area
            } else {
              // Add pulsing effect to some characters (less frequently)
              if (Math.random() > 0.995) {
                // Reduced frequency (from 0.99)
                // Extract the base color and increase opacity for a pulse
                const baseColor = drops[i].color.substring(0, drops[i].color.lastIndexOf(",") + 1)
                color = `${baseColor} ${Math.min(0.6, drops[i].opacity * 1.8)})` // Reduced intensity (from 0.8, 2)
              }
            }
          }

          ctx.fillStyle = color

          // Use the drop's font and size
          ctx.font = `${drops[i].size}px ${drops[i].font}`

          // Draw the character
          ctx.fillText(characters[i][y], x, yPos)

          // Draw trailing characters with fading effect
          for (let trail = 1; trail < 6; trail++) {
            // Fewer trailing characters (from 8)
            const trailY = y - trail
            if (trailY >= 0) {
              const trailOpacity = drops[i].opacity * (1 - trail / 6) // Adjusted for fewer trails

              // Extract base color (everything before the last comma)
              const baseColor = drops[i].color.substring(0, drops[i].color.lastIndexOf(",") + 1)
              ctx.fillStyle = `${baseColor} ${trailOpacity})`

              // Draw trail character
              ctx.fillText(characters[i][trailY] || getRandomCharacter(), x, trailY * fontSize)
            }
          }
        }

        // Move the drop down at its specific speed
        drops[i].pos += drops[i].speed

        // Reset when a column reaches the bottom or is fully burned
        if (
          (drops[i].pos * fontSize > canvas.height && Math.random() > 0.975) ||
          (drops[i].burning && drops[i].burnProgress >= 1)
        ) {
          // Randomly choose between dark red and green for each new drop
          const isRed = Math.random() > 0.9 // 10% chance of red (reduced from 20%)
          const color = isRed
            ? `rgba(180, 20, 20, ${Math.random() * 0.15 + 0.1})` // Dark red with 10-25% opacity (reduced)
            : `rgba(57, 255, 20, ${Math.random() * 0.15 + 0.1})` // Green with 10-25% opacity (reduced)

          // Vary font sizes slightly for visual interest
          const size =
            Math.random() > 0.9
              ? fontSize * (Math.random() * 0.5 + 0.8)
              : // 10% chance of smaller/larger
                fontSize

          // Vary fonts occasionally
          const font =
            Math.random() > 0.9
              ? "'Courier New', monospace"
              : // 10% chance of different font
                "'Hack', 'DejaVu Sans Mono', monospace"

          drops[i] = {
            pos: 0,
            speed: (Math.random() * 0.5 + 0.2) * speed,
            opacity: (Math.random() * 0.15 + 0.1) * opacity, // Reduced opacity
            burning: false,
            burnProgress: 0,
            character: getRandomCharacter(),
            color: color,
            size: size,
            font: font,
          }
        }
      }

      // Fade out burn marks over time - update the ref directly
      burnMarksRef.current = burnMarksRef.current
        .map((mark) => ({
          ...mark,
          size: mark.size * 1.01,
          opacity: mark.opacity * 0.97, // Fade out slightly faster (from 0.98)
        }))
        .filter((mark) => mark.opacity > 0.01)

      // Add ambient flicker effect (less frequently)
      if (Math.random() > 0.985) {
        // Reduced frequency (from 0.97)
        const flickerColor =
          Math.random() > 0.7
            ? `rgba(180, 20, 20, ${Math.random() * 0.02})` // Occasional red flicker (reduced from 0.027)
            : `rgba(57, 255, 20, ${Math.random() * 0.02})` // Mostly green flicker (reduced from 0.027)
        ctx.fillStyle = flickerColor
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      ctx.restore()

      // Request next frame
      animationRef.current = requestAnimationFrame(draw)
    }

    // Start the animation
    animationRef.current = requestAnimationFrame(draw)

    // Cleanup function
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      clearInterval(jitterInterval)
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [text, onBurn, updateLogoPosition, opacity, speed, density, highlightLogo])

  return (
    <>
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-0" />

      {/* Logo component with position tracking */}
      <EnhancedLogo onPositionUpdate={updateLogoPosition} rotateMode={true} />

      {/* Debug panel */}
      {showDebug && (
        <div className="fixed bottom-4 right-4 bg-black/80 border border-green-500 p-4 rounded-md z-50 max-h-80 overflow-auto w-80">
          <h3 className="text-green-500 font-mono text-sm mb-2">Burn Log (Shift+D to hide)</h3>
          <div className="text-xs font-mono">
            {burnLogs
              .slice()
              .reverse()
              .map((log, i) => (
                <div key={i} className="text-green-400 mb-1">
                  [{new Date(log.timestamp).toISOString().substr(11, 8)}] Char: '{log.character}' at ({log.x}, {log.y})
                </div>
              ))}
          </div>
        </div>
      )}
    </>
  )
}

// Import Logo component
import EnhancedLogo from "./enhanced-logo"
