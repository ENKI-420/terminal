"use client"

import { useEffect, useRef } from "react"

export default function RedMatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions to match window
    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // ASCII characters for the rain (more varied than just 0 and 1)
    const asciiChars = "!@#$%^&*()_+-=[]{}|;:,.<>/?`~\\0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

    const fontSize = 14
    const columns = Math.floor(canvas.width / fontSize)

    // Array to track the y position of each column
    const drops: number[] = []
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -100) // Start above the screen at random positions
    }

    // Array to track the opacity of each column
    const opacities: number[] = []
    for (let i = 0; i < columns; i++) {
      opacities[i] = Math.random() * 0.5 + 0.1 // Random opacity between 0.1 and 0.6
    }

    // Array to track the character change frequency for each column
    const changeFrequency: number[] = []
    for (let i = 0; i < columns; i++) {
      changeFrequency[i] = Math.floor(Math.random() * 20) + 5 // Change every 5-25 frames
    }

    // Array to store the current character for each position
    const characters: string[][] = []
    for (let i = 0; i < columns; i++) {
      characters[i] = []
      for (let j = 0; j < canvas.height / fontSize; j++) {
        characters[i][j] = asciiChars.charAt(Math.floor(Math.random() * asciiChars.length))
      }
    }

    // Frame counter for character changes
    let frameCount = 0

    const draw = () => {
      if (!ctx || !canvas) return

      // Semi-transparent black to create trail effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      frameCount++

      for (let i = 0; i < drops.length; i++) {
        // Change some characters randomly based on their frequency
        if (frameCount % changeFrequency[i] === 0) {
          const charIndex = Math.floor(drops[i])
          if (charIndex >= 0 && charIndex < canvas.height / fontSize) {
            characters[i][charIndex] = asciiChars.charAt(Math.floor(Math.random() * asciiChars.length))
          }
        }

        // Get the current character
        const text =
          characters[i][Math.floor(drops[i])] || asciiChars.charAt(Math.floor(Math.random() * asciiChars.length))

        // Calculate gradient color - brighter at the head of the column
        const headIntensity = Math.min(1, (drops[i] % 10) / 10)
        const red = Math.floor(200 + headIntensity * 55) // Bright red for the head
        const alpha = opacities[i]

        // Set the color with varying opacity
        ctx.fillStyle = `rgba(${red}, 0, 0, ${alpha})`
        ctx.font = `${fontSize}px monospace`

        // Draw the character
        const x = i * fontSize
        const y = Math.floor(drops[i]) * fontSize
        ctx.fillText(text, x, y)

        // Move the drop down
        drops[i] += 0.5

        // Reset when a column reaches the bottom
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
          // Randomize opacity when resetting
          opacities[i] = Math.random() * 0.5 + 0.1
          // Randomize change frequency
          changeFrequency[i] = Math.floor(Math.random() * 20) + 5
        }
      }
    }

    const interval = setInterval(draw, 33) // ~30fps

    return () => {
      clearInterval(interval)
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-0" />
}
