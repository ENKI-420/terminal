"use client"

import { useEffect, useRef } from "react"

interface MutationHeatmapProps {
  gene?: string
  mutations?: string[]
}

export function MutationHeatmap({ gene, mutations = [] }: MutationHeatmapProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // In a real implementation, this would use D3.js to create an interactive heatmap
    // For this demo, we'll create a simple canvas visualization

    const canvas = document.createElement("canvas")
    canvas.width = containerRef.current.clientWidth
    canvas.height = 300
    containerRef.current.appendChild(canvas)

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Draw background
    ctx.fillStyle = "#1E293B"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Define cancer types
    const cancerTypes = ["NSCLC", "SCLC", "CRC", "BRCA", "PAAD", "MELA", "GBM", "PRAD"]

    // Define cell size and padding
    const cellSize = 40
    const padding = 10
    const leftPadding = 100
    const topPadding = 60

    // Draw cancer type labels (y-axis)
    ctx.fillStyle = "#FFFFFF"
    ctx.font = "12px Inter"
    ctx.textAlign = "right"

    cancerTypes.forEach((cancer, i) => {
      const y = topPadding + i * (cellSize + padding) + cellSize / 2
      ctx.fillText(cancer, leftPadding - 10, y + 4)
    })

    // Draw mutation labels (x-axis)
    ctx.textAlign = "center"

    const mutationLabels =
      mutations.length > 0
        ? mutations
        : gene === "EGFR"
          ? ["L858R", "T790M", "Exon 19 del", "G719X", "L861Q"]
          : ["G12C", "G12D", "G12V", "G13D", "Q61H"]

    mutationLabels.forEach((mutation, i) => {
      const x = leftPadding + i * (cellSize + padding) + cellSize / 2
      ctx.fillText(mutation, x, topPadding - 10)
    })

    // Draw title
    ctx.font = "bold 16px Inter"
    ctx.textAlign = "left"
    ctx.fillText(`${gene} Mutation Prevalence by Cancer Type`, 20, 30)

    // Draw heatmap cells
    cancerTypes.forEach((cancer, i) => {
      mutationLabels.forEach((mutation, j) => {
        // Generate a prevalence value (in a real app, this would come from data)
        let prevalence = Math.random()

        // Make some combinations more common for realism
        if (gene === "EGFR" && mutation === "L858R" && cancer === "NSCLC") prevalence = 0.8
        if (gene === "EGFR" && mutation === "T790M" && cancer === "NSCLC") prevalence = 0.6
        if (gene === "KRAS" && mutation === "G12D" && cancer === "PAAD") prevalence = 0.9
        if (gene === "KRAS" && mutation === "G12C" && cancer === "NSCLC") prevalence = 0.7

        // Calculate color based on prevalence (teal gradient)
        const intensity = Math.floor(prevalence * 255)
        const color = `rgb(${46 + (255 - 46) * (1 - prevalence)}, ${196 + (255 - 196) * (1 - prevalence)}, ${182 + (255 - 182) * (1 - prevalence)})`

        // Draw cell
        const x = leftPadding + j * (cellSize + padding)
        const y = topPadding + i * (cellSize + padding)

        ctx.fillStyle = color
        ctx.fillRect(x, y, cellSize, cellSize)

        // Add percentage text
        ctx.fillStyle = prevalence > 0.5 ? "#000000" : "#FFFFFF"
        ctx.font = "bold 12px Inter"
        ctx.textAlign = "center"
        ctx.fillText(`${Math.round(prevalence * 100)}%`, x + cellSize / 2, y + cellSize / 2 + 4)
      })
    })

    // Add legend
    const legendX = leftPadding
    const legendY = topPadding + cancerTypes.length * (cellSize + padding) + 20
    const legendWidth = 200
    const legendHeight = 20

    // Create gradient
    const gradient = ctx.createLinearGradient(legendX, 0, legendX + legendWidth, 0)
    gradient.addColorStop(0, "#FFFFFF")
    gradient.addColorStop(1, "#2EC4B6")

    ctx.fillStyle = gradient
    ctx.fillRect(legendX, legendY, legendWidth, legendHeight)

    // Add legend labels
    ctx.fillStyle = "#FFFFFF"
    ctx.font = "12px Inter"
    ctx.textAlign = "center"
    ctx.fillText("0%", legendX, legendY + legendHeight + 15)
    ctx.fillText("100%", legendX + legendWidth, legendY + legendHeight + 15)
    ctx.textAlign = "left"
    ctx.fillText("Mutation Prevalence", legendX, legendY - 5)

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ""
      }
    }
  }, [gene, mutations])

  return (
    <div
      ref={containerRef}
      className="genomic-heatmap"
      aria-label={`Heatmap showing prevalence of ${gene} mutations across different cancer types`}
    />
  )
}

