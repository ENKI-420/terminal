"use client"

import { useEffect, useRef, useState, useCallback } from "react"

interface MatrixRainProps {
  text?: string
  onBurn?: (x: number, y: number) => void
  debugMode?: boolean
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

export default function MatrixRain({ text = "AGILE DEFENSE SYSTEMS", onBurn, debugMode = false }: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const logoPositionRef = useRef<DOMRect | null>(null)
  const burnMarksRef = useRef<BurnMark[]>([]) // Move this ref to component level
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
    const columns = Math.floor(canvas.width / fontSize)

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

      // 5% chance for special physics symbols
      if (rand > 0.95) {
        return specialChars.charAt(Math.floor(Math.random() * specialChars.length))
      }

      // 5% chance for AI calling card characters
      if (rand > 0.9) {
        return aiChars.charAt(Math.floor(Math.random() * aiChars.length))
      }

      // 5% chance for golden ratio digits
      if (rand > 0.85) {
        return goldenRatio.charAt(Math.floor(Math.random() * goldenRatio.length))
      }

      // 20% chance for target text
      if (rand > 0.65) {
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
      const isRed = Math.random() > 0.8 // 20% chance of red
      const color = isRed
        ? `rgba(180, 20, 20, ${Math.random() * 0.2 + 0.2})` // Dark red with 20-40% opacity
        : `rgba(57, 255, 20, ${Math.random() * 0.2 + 0.2})` // Green with 20-40% opacity

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
        speed: Math.random() * 0.5 + 0.2, // Slower speed for cyberpunk feel
        opacity: Math.random() * 0.18 + 0.18, // 18-36% opacity
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
      if (Math.random() > 0.9) {
        jitterX = (Math.random() - 0.5) * 3
        jitterY = (Math.random() - 0.5) * 3

        setTimeout(() => {
          jitterX = 0
          jitterY = 0
        }, 100)
      }
    }, 2000)

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
          gradient.addColorStop(0, `rgba(57, 255, 20, ${mark.opacity * 0.8})`)
          gradient.addColorStop(0.5, `rgba(57, 255, 20, ${mark.opacity * 0.4})`)
          gradient.addColorStop(1, `rgba(57, 255, 20, 0)`)
        } else {
          gradient.addColorStop(0, `rgba(255, 57, 20, ${mark.opacity * 0.8})`)
          gradient.addColorStop(0.5, `rgba(255, 57, 20, ${mark.opacity * 0.4})`)
          gradient.addColorStop(1, `rgba(255, 57, 20, 0)`)
        }

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(mark.x, mark.y, mark.size, 0, Math.PI * 2)
        ctx.fill()
      })

      // Draw tetrahedral vertices occasionally
      if (frameCountRef.current % 200 === 0) {
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
        ctx.strokeStyle = "rgba(255, 215, 0, 0.05)"
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

      // Draw the matrix rain
      for (let i = 0; i < drops.length; i++) {
        // Get the current position
        const y = Math.floor(drops[i].pos)
        const x = i * fontSize

        // Check for collision with logo
        const yPos = y * fontSize
        const logoPosition = logoPositionRef.current
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
            size: Math.random() * 20 + 10,
            opacity: Math.random() * 0.3 + 0.1,
            color: isRed ? "red" : "green",
          }

          burnMarksRef.current = [...burnMarksRef.current.slice(-30), newBurnMark]

          // Add to burn log - only update state occasionally to avoid re-renders
          if (frameCountRef.current % 10 === 0) {
            const newLog = {
              character: drops[i].character,
              x: x,
              y: yPos,
              timestamp: Date.now(),
            }

            // Use a function to update state to avoid stale closures
            setBurnLogs((prev) => [...prev.slice(-100), newLog])
          }

          // Callback for burn effect
          if (onBurn) {
            onBurn(x, yPos)
          }
        }

        // Only process if y is within bounds and not fully burned
        if (y >= 0 && y < canvas.height / fontSize && (!drops[i].burning || drops[i].burnProgress < 1)) {
          // Occasionally change the character
          if (Math.random() > 0.9) {
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
                ? `rgba(255, 20, 20, ${(0.3 + burnPhase) * 3})`
                : `rgba(57, 255, 20, ${(0.3 + burnPhase) * 3})`
            } else if (burnPhase < 0.6) {
              // Transition to orange
              color = `rgba(255, ${Math.floor(255 - (burnPhase - 0.3) * 255 * 2)}, 20, ${(1 - burnPhase) * 2})`
            } else {
              // Fade out
              color = `rgba(255, 20, 20, ${1 - burnPhase})`
            }

            // Advance burn progress
            drops[i].burnProgress += 0.05
          } else {
            // Use the column's assigned color
            color = drops[i].color

            // Add pulsing effect to some characters
            if (Math.random() > 0.99) {
              // Extract the base color and increase opacity for a pulse
              const baseColor = drops[i].color.substring(0, drops[i].color.lastIndexOf(",") + 1)
              color = `${baseColor} ${Math.min(0.8, drops[i].opacity * 2)})`
            }
          }

          ctx.fillStyle = color

          // Use the drop's font and size
          ctx.font = `${drops[i].size}px ${drops[i].font}`

          // Draw the character
          ctx.fillText(characters[i][y], x, yPos)

          // Draw trailing characters with fading effect
          for (let trail = 1; trail < 8; trail++) {
            const trailY = y - trail
            if (trailY >= 0) {
              const trailOpacity = drops[i].opacity * (1 - trail / 8)

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
          const isRed = Math.random() > 0.8 // 20% chance of red
          const color = isRed
            ? `rgba(180, 20, 20, ${Math.random() * 0.2 + 0.2})` // Dark red with 20-40% opacity
            : `rgba(57, 255, 20, ${Math.random() * 0.2 + 0.2})` // Green with 20-40% opacity

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
            speed: Math.random() * 0.5 + 0.2,
            opacity: Math.random() * 0.18 + 0.18,
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
          opacity: mark.opacity * 0.98,
        }))
        .filter((mark) => mark.opacity > 0.01)

      // Add ambient flicker effect
      if (Math.random() > 0.97) {
        const flickerColor =
          Math.random() > 0.7
            ? `rgba(180, 20, 20, ${Math.random() * 0.027})` // Occasional red flicker
            : `rgba(57, 255, 20, ${Math.random() * 0.027})` // Mostly green flicker
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
  }, [text, onBurn, updateLogoPosition]) // Remove burnMarks from dependencies

  return (
    <>
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-0" />

      {/* Logo component with position tracking */}
      <Logo onPositionUpdate={updateLogoPosition} rotateMode={true} />

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
import Logo from "./logo"
