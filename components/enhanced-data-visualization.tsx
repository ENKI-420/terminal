"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { colors } from "@/lib/design-tokens"

interface DataPoint {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string
  value: number
  connected: boolean
  age: number
  maxAge: number
  type: "standard" | "critical" | "warning" | "info"
}

interface LogoPosition {
  left: number
  right: number
  top: number
  bottom: number
}

interface EnhancedDataVisualizationProps {
  intensity?: number // 0-1 value for visualization intensity
  primaryColor?: string
  secondaryColor?: string
  warningColor?: string
  infoColor?: string
  speed?: number // 1-10 value for animation speed
  onDataPoint?: (x: number, y: number, value: number, type: string) => void
  logoPosition?: LogoPosition | null
  className?: string
}

export default function EnhancedDataVisualization({
  intensity = 0.5,
  primaryColor = colors.primary[500],
  secondaryColor = colors.accent[500],
  warningColor = colors.warning,
  infoColor = colors.info,
  speed = 5,
  onDataPoint,
  logoPosition = null,
  className = "",
}: EnhancedDataVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const dataPointsRef = useRef<DataPoint[]>([])
  const lastFrameTimeRef = useRef<number>(0)
  const fpsRef = useRef<number>(0)
  const frameCountRef = useRef<number>(0)
  const logoPositionRef = useRef<LogoPosition | null>(logoPosition)

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [fps, setFps] = useState(0)

  // Update logo position ref when prop changes
  useEffect(() => {
    logoPositionRef.current = logoPosition
  }, [logoPosition])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const { width, height } = canvasRef.current.getBoundingClientRect()
        setDimensions({ width, height })
        canvasRef.current.width = width * window.devicePixelRatio
        canvasRef.current.height = height * window.devicePixelRatio
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Create a data point
  const createDataPoint = useCallback(
    (x: number, y: number, type: "standard" | "critical" | "warning" | "info" = "standard"): DataPoint => {
      const speedFactor = speed * 0.2
      const value = Math.random()
      const maxAge = 300 + Math.random() * 300 // Lifetime in frames

      let pointColor
      switch (type) {
        case "critical":
          pointColor = secondaryColor
          break
        case "warning":
          pointColor = warningColor
          break
        case "info":
          pointColor = infoColor
          break
        default:
          pointColor = primaryColor
      }

      return {
        x,
        y,
        vx: (Math.random() - 0.5) * speedFactor,
        vy: (Math.random() - 0.5) * speedFactor,
        radius: type === "critical" ? 3 + Math.random() * 2 : 1 + Math.random() * 2,
        color: pointColor,
        value,
        connected: false,
        age: 0,
        maxAge,
        type,
      }
    },
    [primaryColor, secondaryColor, warningColor, infoColor, speed],
  )

  // Initialize data points
  useEffect(() => {
    if (dimensions.width === 0) return

    // Create initial data points
    const pointCount = Math.floor(30 * intensity) + 20
    const newPoints: DataPoint[] = []

    for (let i = 0; i < pointCount; i++) {
      const type =
        Math.random() > 0.9 ? "critical" : Math.random() > 0.8 ? "warning" : Math.random() > 0.7 ? "info" : "standard"

      newPoints.push(createDataPoint(Math.random() * dimensions.width, Math.random() * dimensions.height, type))
    }

    dataPointsRef.current = newPoints
  }, [dimensions, intensity, createDataPoint])

  // Add occasional new data points
  const addRandomDataPoint = useCallback(() => {
    if (dimensions.width === 0) return

    const edge = Math.floor(Math.random() * 4)
    let x, y

    // Create point at a random edge
    switch (edge) {
      case 0: // Top
        x = Math.random() * dimensions.width
        y = 0
        break
      case 1: // Right
        x = dimensions.width
        y = Math.random() * dimensions.height
        break
      case 2: // Bottom
        x = Math.random() * dimensions.width
        y = dimensions.height
        break
      case 3: // Left
        x = 0
        y = Math.random() * dimensions.height
        break
    }

    // Determine point type with weighted randomness
    const rand = Math.random()
    const type = rand > 0.95 ? "critical" : rand > 0.85 ? "warning" : rand > 0.75 ? "info" : "standard"

    dataPointsRef.current.push(createDataPoint(x, y, type))
  }, [dimensions, createDataPoint])

  // Main animation effect
  useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set high DPI canvas
    const dpr = window.devicePixelRatio || 1
    ctx.scale(dpr, dpr)

    // Animation function
    const animate = (timestamp: number) => {
      if (!ctx) return

      // Calculate FPS
      if (!lastFrameTimeRef.current) {
        lastFrameTimeRef.current = timestamp
      }

      const deltaTime = timestamp - lastFrameTimeRef.current
      if (deltaTime >= 1000) {
        fpsRef.current = frameCountRef.current
        setFps(fpsRef.current)
        frameCountRef.current = 0
        lastFrameTimeRef.current = timestamp
      }

      frameCountRef.current++

      // Clear canvas with semi-transparent black for trail effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, dimensions.width, dimensions.height)

      // Add occasional new data point
      if (Math.random() > 0.97) {
        addRandomDataPoint()
      }

      // Update and draw data points
      const points = dataPointsRef.current

      // Reset connection status
      points.forEach((point) => {
        point.connected = false
      })

      // Draw connections between points
      ctx.lineWidth = 0.5

      for (let i = 0; i < points.length; i++) {
        const point = points[i]

        for (let j = i + 1; j < points.length; j++) {
          const otherPoint = points[j]
          const dx = point.x - otherPoint.x
          const dy = point.y - otherPoint.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          // Connect points that are close enough
          const connectionDistance = 100 * intensity
          if (distance < connectionDistance) {
            // Calculate opacity based on distance
            const opacity = 1 - distance / connectionDistance

            // Determine connection color
            let connectionColor
            if (point.type === "critical" || otherPoint.type === "critical") {
              connectionColor = secondaryColor
            } else if (point.type === "warning" || otherPoint.type === "warning") {
              connectionColor = warningColor
            } else if (point.type === "info" || otherPoint.type === "info") {
              connectionColor = infoColor
            } else {
              connectionColor = primaryColor
            }

            ctx.strokeStyle = `${connectionColor}${Math.floor(opacity * 50)
              .toString(16)
              .padStart(2, "0")}`

            ctx.beginPath()
            ctx.moveTo(point.x, point.y)
            ctx.lineTo(otherPoint.x, otherPoint.y)
            ctx.stroke()

            point.connected = true
            otherPoint.connected = true
          }
        }
      }

      // Draw and update points
      for (let i = 0; i < points.length; i++) {
        const point = points[i]

        // Update position
        point.x += point.vx
        point.y += point.vy
        point.age++

        // Check for logo collision
        const logo = logoPositionRef.current
        if (logo) {
          const inLogoArea =
            point.x >= logo.left && point.x <= logo.right && point.y >= logo.top && point.y <= logo.bottom

          if (inLogoArea) {
            // Interact with logo - create visual effect and trigger callback
            if (onDataPoint && Math.random() > 0.5) {
              onDataPoint(point.x, point.y, point.value, point.type)
            }

            // Change direction with slight randomization
            point.vx = -point.vx * (0.8 + Math.random() * 0.4)
            point.vy = -point.vy * (0.8 + Math.random() * 0.4)

            // Increase speed slightly when bouncing off logo
            const speedBoost = 1.2
            point.vx *= speedBoost
            point.vy *= speedBoost

            // Move point outside logo area to prevent getting stuck
            if (point.x < logo.left + 10) point.x = logo.left - 5
            if (point.x > logo.right - 10) point.x = logo.right + 5
            if (point.y < logo.top + 10) point.y = logo.top - 5
            if (point.y > logo.bottom - 10) point.y = logo.bottom + 5
          }
        }

        // Bounce off edges
        if (point.x < 0 || point.x > dimensions.width) {
          point.vx *= -1
          // Trigger data point event on edge collision
          if (onDataPoint && Math.random() > 0.7) {
            onDataPoint(point.x, point.y, point.value, point.type)
          }
        }
        if (point.y < 0 || point.y > dimensions.height) {
          point.vy *= -1
          // Trigger data point event on edge collision
          if (onDataPoint && Math.random() > 0.7) {
            onDataPoint(point.x, point.y, point.value, point.type)
          }
        }

        // Calculate opacity based on age
        let opacity = 1
        if (point.age < 20) {
          // Fade in
          opacity = point.age / 20
        } else if (point.age > point.maxAge - 20) {
          // Fade out
          opacity = (point.maxAge - point.age) / 20
        }

        // Draw the point with glow effect
        const glow = point.connected ? 10 : 5
        const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, point.radius + glow)

        gradient.addColorStop(0, `${point.color}ff`)
        gradient.addColorStop(0.5, `${point.color}80`)
        gradient.addColorStop(1, `${point.color}00`)

        ctx.globalAlpha = opacity
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(point.x, point.y, point.radius + glow, 0, Math.PI * 2)
        ctx.fill()

        // Draw the point core
        ctx.fillStyle = point.color
        ctx.beginPath()
        ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1

        // Occasionally trigger data point event
        if (onDataPoint && Math.random() > 0.995) {
          onDataPoint(point.x, point.y, point.value, point.type)
        }
      }

      // Remove old points and add new ones to maintain count
      dataPointsRef.current = points.filter((point) => point.age < point.maxAge).sort((a, b) => a.age - b.age)

      // Request next frame
      animationRef.current = requestAnimationFrame(animate)
    }

    // Start animation
    animationRef.current = requestAnimationFrame(animate)

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [
    dimensions,
    intensity,
    primaryColor,
    secondaryColor,
    warningColor,
    infoColor,
    speed,
    onDataPoint,
    addRandomDataPoint,
  ])

  return (
    <>
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full z-0 ${className}`}
        style={{ opacity: 0.2 + intensity * 0.3 }}
      />
      {process.env.NODE_ENV === "development" && (
        <div className="absolute bottom-2 right-2 text-xs text-neutral-500 bg-black/50 px-2 py-1 rounded">
          FPS: {fps}
        </div>
      )}
    </>
  )
}
