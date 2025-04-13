"use client"

import { useEffect, useRef, useState, useCallback } from "react"

interface LogoProps {
  onPositionUpdate?: (rect: DOMRect) => void
  rotateMode?: boolean
  onInteraction?: (x: number, y: number, intensity: number) => void
  className?: string
  enhancedVisibility?: boolean // New prop to control enhanced visibility
}

export default function EnhancedLogo({
  onPositionUpdate,
  rotateMode = false,
  onInteraction,
  className = "",
  enhancedVisibility = true, // Default to enhanced visibility
}: LogoProps) {
  const logoRef = useRef<SVGSVGElement>(null)
  const [isRotated, setIsRotated] = useState(false)
  const [mouseProximity, setMouseProximity] = useState(0)
  const [interactionPoints, setInteractionPoints] = useState<{ x: number; y: number; opacity: number; size: number }[]>(
    [],
  )
  const positionUpdatedRef = useRef(false)
  const interactionPointsRef = useRef<{ x: number; y: number; opacity: number; size: number }[]>([])

  // Handle logo position updates for collision detection
  useEffect(() => {
    if (!logoRef.current || !onPositionUpdate) return

    const updatePosition = () => {
      if (logoRef.current) {
        const rect = logoRef.current.getBoundingClientRect()
        onPositionUpdate(rect)
        positionUpdatedRef.current = true
      }
    }

    // Initial position
    updatePosition()

    // Update on resize
    const handleResize = () => {
      requestAnimationFrame(updatePosition)
    }

    window.addEventListener("resize", handleResize)

    // Use a simple interval to update position occasionally
    const positionInterval = setInterval(() => {
      if (logoRef.current) {
        updatePosition()
      }
    }, 1000) // Update position every second

    return () => {
      window.removeEventListener("resize", handleResize)
      clearInterval(positionInterval)
    }
  }, [onPositionUpdate])

  // Add occasional glitching effect
  useEffect(() => {
    if (!logoRef.current) return

    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.8) {
        // Reduced frequency (from 0.7)
        const glitchDuration = 50 + Math.random() * 150 // Shorter duration (from 200)

        if (logoRef.current) {
          // Apply glitch effect
          logoRef.current.classList.add("glitching")

          // Remove glitch effect after duration
          setTimeout(() => {
            if (logoRef.current) {
              logoRef.current.classList.remove("glitching")
            }
          }, glitchDuration)
        }
      }
    }, 4000) // Less frequent (from 3000)

    return () => {
      clearInterval(glitchInterval)
    }
  }, [])

  // Handle keyboard shortcuts
  useEffect(() => {
    if (!rotateMode) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Shift + R to rotate logo
      if (e.shiftKey && e.key === "R") {
        setIsRotated((prev) => !prev)
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [rotateMode])

  // Handle mouse proximity effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!logoRef.current) return

      const rect = logoRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      // Calculate distance from mouse to center of logo
      const dx = e.clientX - centerX
      const dy = e.clientY - centerY
      const distance = Math.sqrt(dx * dx + dy * dy)

      // Convert distance to proximity (1 = close, 0 = far)
      const maxDistance = 300
      const proximity = Math.max(0, 1 - distance / maxDistance)

      setMouseProximity(proximity)

      // Add interaction point on hover with high proximity
      if (proximity > 0.7 && Math.random() > 0.9) {
        const relativeX = e.clientX - rect.left
        const relativeY = e.clientY - rect.top

        if (onInteraction) {
          onInteraction(relativeX, relativeY, proximity)
        }

        addInteractionPoint(relativeX, relativeY)
      }
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [onInteraction])

  // Add interaction point
  const addInteractionPoint = useCallback((x: number, y: number) => {
    const newPoint = {
      x,
      y,
      opacity: 1,
      size: 5 + Math.random() * 10,
    }

    interactionPointsRef.current = [...interactionPointsRef.current, newPoint]
    setInteractionPoints([...interactionPointsRef.current])
  }, [])

  // Handle external interaction
  useEffect(() => {
    // Animation loop to update interaction points
    const updateInteractionPoints = () => {
      if (interactionPointsRef.current.length === 0) return

      interactionPointsRef.current = interactionPointsRef.current
        .map((point) => ({
          ...point,
          opacity: point.opacity * 0.95,
          size: point.size * 1.05,
        }))
        .filter((point) => point.opacity > 0.05)

      setInteractionPoints([...interactionPointsRef.current])
    }

    const interval = setInterval(updateInteractionPoints, 50)

    return () => clearInterval(interval)
  }, [])

  // Public method to add interaction point
  const handleExternalInteraction = useCallback(
    (x: number, y: number, intensity = 1) => {
      if (!logoRef.current) return

      const rect = logoRef.current.getBoundingClientRect()
      const relativeX = x - rect.left
      const relativeY = y - rect.top

      // Only add if within bounds
      if (relativeX >= 0 && relativeX <= rect.width && relativeY >= 0 && relativeY <= rect.height) {
        addInteractionPoint(relativeX, relativeY)
      }
    },
    [addInteractionPoint],
  )

  // Expose the interaction method
  useEffect(() => {
    if (onInteraction) {
      // @ts-ignore - Adding a method to the ref
      logoRef.current.addInteraction = handleExternalInteraction
    }
  }, [handleExternalInteraction, onInteraction])

  // Calculate base opacity based on enhanced visibility setting
  const baseOpacity = enhancedVisibility ? 0.4 : 0.2 // Increased from 0.2

  return (
    <div className={`absolute inset-0 flex items-center justify-center pointer-events-none z-0 ${className}`}>
      <svg
        ref={logoRef}
        className={`w-full max-w-2xl logo-svg ${mouseProximity > 0.5 ? "logo-proximity" : ""} ${
          enhancedVisibility ? "enhanced-logo" : ""
        }`}
        viewBox="0 0 800 120"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          // Increase opacity based on mouse proximity and enhanced visibility setting
          opacity: baseOpacity + mouseProximity * 0.4,
          // Add subtle shadow for better visibility against background
          filter: enhancedVisibility ? "drop-shadow(0 0 10px rgba(24, 144, 255, 0.5))" : "none",
          transition: "opacity 0.3s ease, filter 0.3s ease",
        }}
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={enhancedVisibility ? "3.5" : "2.5"} result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="noise" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feDisplacementMap in="SourceGraphic" scale="3" />
          </filter>

          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1890ff" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#40a9ff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#1890ff" stopOpacity="0.8" />
            <animate attributeName="x1" from="0%" to="100%" dur="10s" repeatCount="indefinite" />
            <animate attributeName="x2" from="100%" to="200%" dur="10s" repeatCount="indefinite" />
          </linearGradient>

          {/* Hidden layer revealed on mouse proximity */}
          <linearGradient id="hiddenGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f5222d" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#ff4d4f" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#f5222d" stopOpacity="0.7" />
            <animate attributeName="x1" from="0%" to="100%" dur="8s" repeatCount="indefinite" />
            <animate attributeName="x2" from="100%" to="200%" dur="8s" repeatCount="indefinite" />
          </linearGradient>

          {/* Laser etching effect */}
          <filter id="laserEtch">
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G" />
            <feGaussianBlur stdDeviation="0.5" />
          </filter>

          {/* Enhanced background glow for better visibility */}
          <filter id="enhancedGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Background for logo - semi-transparent to improve contrast */}
        {enhancedVisibility && (
          <rect
            x="5"
            y="25"
            width="790"
            height="70"
            rx="5"
            ry="5"
            fill="rgba(0, 0, 0, 0.6)"
            opacity="0.7"
            className="logo-bg-enhance"
          />
        )}

        {/* Etched background effect */}
        <rect
          x="10"
          y="30"
          width="780"
          height="60"
          rx="5"
          ry="5"
          fill="none"
          stroke="url(#logoGradient)"
          strokeWidth={enhancedVisibility ? "1.5" : "1"}
          className="logo-bg"
          filter="url(#laserEtch)"
        />

        {/* Hidden layer revealed on mouse proximity */}
        {mouseProximity > 0.5 && (
          <rect
            x="10"
            y="30"
            width="780"
            height="60"
            rx="5"
            ry="5"
            fill="none"
            stroke="url(#hiddenGradient)"
            strokeWidth={enhancedVisibility ? "1.5" : "1"}
            className="logo-hidden"
            style={{ opacity: (mouseProximity - 0.5) * 2 }}
          />
        )}

        {/* Main text */}
        <text
          x="400"
          y="75"
          textAnchor="middle"
          className="logo-text"
          fill="url(#logoGradient)"
          filter={enhancedVisibility ? "url(#enhancedGlow)" : "url(#glow)"}
          style={{
            fontFamily: "'Hack', monospace",
            fontSize: "40px",
            fontWeight: "bold",
            letterSpacing: "2px",
            // Add text stroke for better visibility
            stroke: enhancedVisibility ? "rgba(0, 0, 0, 0.5)" : "none",
            strokeWidth: "0.5px",
          }}
        >
          {isRotated ? "AIDEN SECURITY CORE" : "AGILE DEFENSE SYSTEMS, LLC"}
        </text>

        {/* Circuit lines */}
        <path
          d="M20,30 L20,10 L100,10 M780,30 L780,10 L700,10 M20,90 L20,110 L100,110 M780,90 L780,110 L700,110"
          stroke="url(#logoGradient)"
          strokeWidth={enhancedVisibility ? "1.5" : "1"}
          fill="none"
          className="circuit-lines"
        />

        {/* Additional circuit details that appear on mouse proximity */}
        {mouseProximity > 0.3 && (
          <g className="circuit-details" style={{ opacity: mouseProximity }}>
            <path
              d="M400,30 L400,10 M400,90 L400,110 M300,75 L200,75 M500,75 L600,75"
              stroke="url(#logoGradient)"
              strokeWidth={enhancedVisibility ? "1.5" : "1"}
              fill="none"
              className="circuit-lines"
            />
            <circle cx="200" cy="75" r={enhancedVisibility ? "4" : "3"} fill="url(#logoGradient)" />
            <circle cx="600" cy="75" r={enhancedVisibility ? "4" : "3"} fill="url(#logoGradient)" />
            <circle cx="400" cy="10" r={enhancedVisibility ? "4" : "3"} fill="url(#logoGradient)" />
            <circle cx="400" cy="110" r={enhancedVisibility ? "4" : "3"} fill="url(#logoGradient)" />
          </g>
        )}

        {/* Interaction points */}
        {interactionPoints.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r={point.size}
            fill={`rgba(24, 144, 255, ${point.opacity * 0.7})`}
            filter="url(#glow)"
          />
        ))}
      </svg>
    </div>
  )
}
