"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { IconZoomIn, IconZoomOut, IconRotate, IconArrowsMaximize } from "@tabler/icons-react"
import { useToast } from "@/hooks/use-toast"

interface GenomicVisualizer3DProps {
  patientId: string
}

export function GenomicVisualizer3D({ patientId }: GenomicVisualizer3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isFullscreen, setIsFullscreen] = useState(false)
  const { toast } = useToast()

  // Mock data for different patients
  const patientData: Record<string, any> = {
    "patient-001": {
      gene: "EGFR",
      mutation: "T790M",
      color: "#2EC4B6",
    },
    "patient-002": {
      gene: "BRCA1",
      mutation: "185delAG",
      color: "#FF3366",
    },
    "patient-003": {
      gene: "KRAS",
      mutation: "G12D",
      color: "#FFD166",
    },
  }

  const patientInfo = patientData[patientId] || patientData["patient-001"]

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      const container = containerRef.current
      if (!container) return

      canvas.width = container.clientWidth
      canvas.height = container.clientHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Simulate loading
    setIsLoading(true)
    const loadingTimer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    // Draw the 3D visualization
    const draw = () => {
      if (!ctx) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Set background
      ctx.fillStyle = "rgba(10, 26, 47, 0.2)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw protein structure
      drawProteinStructure(ctx, canvas.width, canvas.height, patientInfo)
    }

    // Animation loop
    let animationId: number
    const animate = () => {
      draw()
      animationId = requestAnimationFrame(animate)
    }

    if (!isLoading) {
      animate()
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      clearTimeout(loadingTimer)
      cancelAnimationFrame(animationId)
    }
  }, [isLoading, patientId, patientInfo, zoomLevel, rotation])

  // Draw protein structure
  const drawProteinStructure = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    patientInfo: { gene: string; mutation: string; color: string },
  ) => {
    const centerX = width / 2
    const centerY = height / 2

    // Draw helix structure
    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.rotate((rotation.y * Math.PI) / 180)
    ctx.scale(zoomLevel, zoomLevel)

    // Draw DNA double helix
    const helixLength = 300
    const helixWidth = 80
    const steps = 40

    for (let i = 0; i < steps; i++) {
      const t = i / steps
      const y = (t - 0.5) * helixLength

      // First strand
      const x1 = Math.sin(t * Math.PI * 4) * helixWidth

      // Second strand
      const x2 = -Math.sin(t * Math.PI * 4) * helixWidth

      // Draw the main strands
      ctx.beginPath()
      ctx.strokeStyle = "#2EC4B6"
      ctx.lineWidth = 4
      if (i > 0) {
        const prevT = (i - 1) / steps
        const prevY = (prevT - 0.5) * helixLength
        const prevX1 = Math.sin(prevT * Math.PI * 4) * helixWidth

        ctx.moveTo(prevX1, prevY)
        ctx.lineTo(x1, y)
      }
      ctx.stroke()

      ctx.beginPath()
      ctx.strokeStyle = "#0A1A2F"
      ctx.lineWidth = 4
      if (i > 0) {
        const prevT = (i - 1) / steps
        const prevY = (prevT - 0.5) * helixLength
        const prevX2 = -Math.sin(prevT * Math.PI * 4) * helixWidth

        ctx.moveTo(prevX2, prevY)
        ctx.lineTo(x2, y)
      }
      ctx.stroke()

      // Draw the base pairs (connections between strands)
      if (i % 2 === 0) {
        ctx.beginPath()
        ctx.strokeStyle = "#94A3B8"
        ctx.lineWidth = 2
        ctx.moveTo(x1, y)
        ctx.lineTo(x2, y)
        ctx.stroke()
      }

      // Highlight the mutation site
      if (Math.abs(y) < 20) {
        ctx.beginPath()
        ctx.fillStyle = patientInfo.color
        ctx.arc(x1, y, 8, 0, Math.PI * 2)
        ctx.fill()

        // Add label for mutation
        ctx.save()
        ctx.translate(x1 + 20, y)
        ctx.rotate((-rotation.y * Math.PI) / 180)
        ctx.fillStyle = "white"
        ctx.font = "14px sans-serif"
        ctx.fillText(`${patientInfo.gene} ${patientInfo.mutation}`, 0, 0)
        ctx.restore()
      }
    }

    ctx.restore()

    // Draw legend
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
    ctx.font = "14px sans-serif"
    ctx.fillText(`Gene: ${patientInfo.gene}`, 20, 30)
    ctx.fillText(`Mutation: ${patientInfo.mutation}`, 20, 50)

    // Draw controls hint
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)"
    ctx.font = "12px sans-serif"
    ctx.fillText("Drag to rotate • Scroll to zoom", 20, height - 20)
  }

  // Handle mouse events for rotation
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return

    const dx = e.clientX - dragStart.x
    const dy = e.clientY - dragStart.y

    setRotation((prev) => ({
      x: prev.x + dy * 0.5,
      y: prev.y + dx * 0.5,
    }))

    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Handle zoom
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.1, 2))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.1, 0.5))
  }

  // Handle reset
  const handleReset = () => {
    setZoomLevel(1)
    setRotation({ x: 0, y: 0 })
  }

  // Handle fullscreen
  const handleToggleFullscreen = () => {
    if (!containerRef.current) return

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }

    setIsFullscreen(!isFullscreen)
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-t-teal-500 border-teal-200 rounded-full animate-spin"></div>
            <p className="mt-4 text-teal-300">Loading genomic visualization...</p>
          </div>
        </div>
      ) : (
        <>
          <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

          <div className="absolute top-4 left-4 flex flex-col space-y-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Button
                variant="secondary"
                size="icon"
                onClick={handleZoomIn}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm"
              >
                <IconZoomIn className="h-4 w-4" />
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Button
                variant="secondary"
                size="icon"
                onClick={handleZoomOut}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm"
              >
                <IconZoomOut className="h-4 w-4" />
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Button
                variant="secondary"
                size="icon"
                onClick={handleReset}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm"
              >
                <IconRotate className="h-4 w-4" />
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <Button
                variant="secondary"
                size="icon"
                onClick={handleToggleFullscreen}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm"
              >
                <IconArrowsMaximize className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>

          <div className="absolute bottom-4 left-4 bg-black/30 backdrop-blur-sm rounded-lg p-3">
            <div className="text-white text-sm">
              <p className="font-bold">{patientInfo.gene} Protein Structure</p>
              <p className="text-xs text-teal-300">
                Mutation: <span className="font-medium">{patientInfo.mutation}</span>
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

