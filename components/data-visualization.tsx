"use client"

import { useEffect, useRef, useState } from "react"
import { colors } from "@/lib/design-tokens"

interface DataVisualizationProps {
  intensity?: number // 0-1 value for visualization intensity
  primaryColor?: string
  secondaryColor?: string
  speed?: number // 1-10 value for animation speed
  onDataPoint?: (x: number, y: number, value: number) => void
}

export default function DataVisualization({
  intensity = 0.5,
  primaryColor = colors.primary[500],
  secondaryColor = colors.accent[500],
  speed = 5,
  onDataPoint,
}: DataVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const { width, height } = canvasRef.current.getBoundingClientRect()
        setDimensions({ width, height })
        canvasRef.current.width = width
        canvasRef.current.height = height
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Main animation effect
  useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Data points for visualization
    const dataPoints: {
      x: number
      y: number
      vx: number
      vy: number
      radius: number
      color: string
      value: number
      connected: boolean
    }[] = []

    // Create initial data points
    const pointCount = Math.floor(30 * intensity) + 10
    for (let i = 0; i < pointCount; i++) {
      const radius = Math.random() * 3 + 1
      dataPoints.push({
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        vx: (Math.random() - 0.5) * speed * 0.2,
        vy: (Math.random() - 0.5) * speed * 0.2,
        radius,
        color: Math.random() > 0.8 ? secondaryColor : primaryColor,
        value: Math.random(),
        connected: false,
      })
    }

    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height)

      // Update and draw data points
      for (let i = 0; i < dataPoints.length; i++) {
        const point = dataPoints[i]

        // Update position
        point.x += point.vx
        point.y += point.vy

        // Bounce off edges
        if (point.x < 0 || point.x > dimensions.width) {
          point.vx *= -1
          // Trigger data point event on edge collision
          if (onDataPoint && Math.random() > 0.7) {
            onDataPoint(point.x, point.y, point.value)
          }
        }
        if (point.y < 0 || point.y > dimensions.height) {
          point.vy *= -1
          // Trigger data point event on edge collision
          if (onDataPoint && Math.random() > 0.7) {
            onDataPoint(point.x, point.y, point.value)
          }
        }

        // Draw connections between nearby points
        point.connected = false
        for (let j = i + 1; j < dataPoints.length; j++) {
          const otherPoint = dataPoints[j]
          const dx = point.x - otherPoint.x
          const dy = point.y - otherPoint.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          // Connect points that are close enough
          const connectionDistance = 100 * intensity
          if (distance < connectionDistance) {
            // Calculate opacity based on distance
            const opacity = 1 - distance / connectionDistance
            ctx.strokeStyle =
              point.color === secondaryColor || otherPoint.color === secondaryColor
                ? `${secondaryColor}${Math.floor(opacity * 50)
                    .toString(16)
                    .padStart(2, "0")}`
                : `${primaryColor}${Math.floor(opacity * 50)
                    .toString(16)
                    .padStart(2, "0")}`

            ctx.lineWidth = Math.min(point.radius, otherPoint.radius) * 0.5
            ctx.beginPath()
            ctx.moveTo(point.x, point.y)
            ctx.lineTo(otherPoint.x, otherPoint.y)
            ctx.stroke()

            point.connected = true
            otherPoint.connected = true
          }
        }

        // Draw the point
        ctx.beginPath()
        ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2)
        ctx.fillStyle = point.color + (point.connected ? "ff" : "80")
        ctx.fill()

        // Occasionally trigger data point event
        if (onDataPoint && Math.random() > 0.995) {
          onDataPoint(point.x, point.y, point.value)
        }
      }

      // Request next animation frame
      animationRef.current = requestAnimationFrame(animate)
    }

    // Start animation
    animate()

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [dimensions, intensity, primaryColor, secondaryColor, speed, onDataPoint])

  return (
    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" style={{ opacity: 0.2 + intensity * 0.3 }} />
  )
}
