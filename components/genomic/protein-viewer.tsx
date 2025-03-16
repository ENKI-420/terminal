"use client"

import { useEffect, useRef } from "react"

interface ProteinViewerProps {
  gene?: string
  mutation?: string
}

export function ProteinViewer({ gene, mutation }: ProteinViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // In a real implementation, this would initialize a 3D protein viewer
    // using libraries like NGL Viewer, Mol*, or 3Dmol.js

    // For this demo, we'll just create a canvas with a placeholder
    const canvas = document.createElement("canvas")
    canvas.width = containerRef.current.clientWidth
    canvas.height = containerRef.current.clientHeight
    containerRef.current.appendChild(canvas)

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Draw a placeholder visualization
    ctx.fillStyle = "#1E293B"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw protein backbone
    ctx.strokeStyle = "#2EC4B6"
    ctx.lineWidth = 3
    ctx.beginPath()

    // Create a random protein-like path
    let x = 50
    let y = canvas.height / 2
    ctx.moveTo(x, y)

    for (let i = 0; i < 20; i++) {
      x += 30
      y += Math.sin(i * 0.5) * 30
      ctx.lineTo(x, y)
    }

    ctx.stroke()

    // Highlight mutation site
    if (mutation) {
      ctx.fillStyle = "#FF3366"
      ctx.beginPath()
      ctx.arc(200, canvas.height / 2, 15, 0, Math.PI * 2)
      ctx.fill()

      // Add label
      ctx.fillStyle = "#FFFFFF"
      ctx.font = "14px Inter"
      ctx.textAlign = "center"
      ctx.fillText(mutation, 200, canvas.height / 2 - 25)
    }

    // Add gene name
    if (gene) {
      ctx.fillStyle = "#FFFFFF"
      ctx.font = "bold 16px Inter"
      ctx.textAlign = "left"
      ctx.fillText(`${gene} Protein Structure`, 20, 30)
      ctx.font = "12px Inter"
      ctx.fillText("Interactive 3D model simulation", 20, 50)
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ""
      }
    }
  }, [gene, mutation])

  return (
    <div
      ref={containerRef}
      className="protein-viewer"
      aria-label={`3D protein structure of ${gene} ${mutation ? `with ${mutation} mutation highlighted` : ""}`}
    />
  )
}

