"use client"

import { useEffect, useRef, useState } from "react"

interface LogoProps {
  onPositionUpdate?: (rect: DOMRect) => void
  rotateMode?: boolean
}

export default function Logo({ onPositionUpdate, rotateMode = false }: LogoProps) {
  const logoRef = useRef<SVGSVGElement>(null)
  const [isRotated, setIsRotated] = useState(false)
  const [mouseProximity, setMouseProximity] = useState(0)
  const positionUpdatedRef = useRef(false)

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
    // This is more reliable than observers and prevents infinite loops
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
      if (Math.random() > 0.7) {
        const glitchDuration = 50 + Math.random() * 200

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
    }, 3000)

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
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
      <svg
        ref={logoRef}
        className={`w-full max-w-2xl opacity-20 logo-svg ${mouseProximity > 0.5 ? "logo-proximity" : ""}`}
        viewBox="0 0 800 120"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          // Increase opacity based on mouse proximity
          opacity: 0.2 + mouseProximity * 0.3,
        }}
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="noise" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feDisplacementMap in="SourceGraphic" scale="3" />
          </filter>

          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#39FF14" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#4CFF33" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#39FF14" stopOpacity="0.7" />
            <animate attributeName="x1" from="0%" to="100%" dur="10s" repeatCount="indefinite" />
            <animate attributeName="x2" from="100%" to="200%" dur="10s" repeatCount="indefinite" />
          </linearGradient>

          {/* Hidden layer revealed on mouse proximity */}
          <linearGradient id="hiddenGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF3939" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#FF5C33" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FF3939" stopOpacity="0.7" />
            <animate attributeName="x1" from="0%" to="100%" dur="8s" repeatCount="indefinite" />
            <animate attributeName="x2" from="100%" to="200%" dur="8s" repeatCount="indefinite" />
          </linearGradient>

          {/* Laser etching effect */}
          <filter id="laserEtch">
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G" />
            <feGaussianBlur stdDeviation="0.5" />
          </filter>
        </defs>

        {/* Industrial wall background */}
        <rect x="0" y="0" width="800" height="120" fill="url(#pattern-metal)" opacity="0.1" />

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
          strokeWidth="1"
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
            strokeWidth="1"
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
          filter="url(#glow)"
          style={{
            fontFamily: "'Hack', monospace",
            fontSize: "40px",
            fontWeight: "bold",
            letterSpacing: "2px",
          }}
        >
          {isRotated ? "AIDEN SECURITY CORE" : "AGILE DEFENSE SYSTEMS, LLC"}
        </text>

        {/* Circuit lines */}
        <path
          d="M20,30 L20,10 L100,10 M780,30 L780,10 L700,10 M20,90 L20,110 L100,110 M780,90 L780,110 L700,110"
          stroke="url(#logoGradient)"
          strokeWidth="1"
          fill="none"
          className="circuit-lines"
        />

        {/* Additional circuit details that appear on mouse proximity */}
        {mouseProximity > 0.3 && (
          <g className="circuit-details" style={{ opacity: mouseProximity }}>
            <path
              d="M400,30 L400,10 M400,90 L400,110 M300,75 L200,75 M500,75 L600,75"
              stroke="url(#logoGradient)"
              strokeWidth="1"
              fill="none"
              className="circuit-lines"
            />
            <circle cx="200" cy="75" r="3" fill="url(#logoGradient)" />
            <circle cx="600" cy="75" r="3" fill="url(#logoGradient)" />
            <circle cx="400" cy="10" r="3" fill="url(#logoGradient)" />
            <circle cx="400" cy="110" r="3" fill="url(#logoGradient)" />
          </g>
        )}
      </svg>
    </div>
  )
}
