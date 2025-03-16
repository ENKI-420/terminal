"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { IconDna, IconDownload, IconZoomIn, IconZoomOut } from "@tabler/icons-react"
import type { GenomicVariant } from "@/lib/genomic-service"

interface VariantVisualizerProps {
  variants: GenomicVariant[]
  patientId?: string
  title?: string
  description?: string
  onVariantSelect?: (variant: GenomicVariant) => void
  isLoading?: boolean
}

export function VariantVisualizer({
  variants,
  patientId,
  title = "Genomic Variants",
  description = "Interactive visualization of genomic variants",
  onVariantSelect,
  isLoading = false,
}: VariantVisualizerProps) {
  const [activeTab, setActiveTab] = useState("chromosome")
  const [selectedVariant, setSelectedVariant] = useState<GenomicVariant | null>(null)
  const [zoomLevel, setZoomLevel] = useState(1)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Group variants by chromosome
  const variantsByChromosome = variants.reduce(
    (acc, variant) => {
      const chromosome = variant.chromosome || "Unknown"
      if (!acc[chromosome]) {
        acc[chromosome] = []
      }
      acc[chromosome].push(variant)
      return acc
    },
    {} as Record<string, GenomicVariant[]>,
  )

  // Group variants by clinical significance
  const variantsByClinicalSignificance = variants.reduce(
    (acc, variant) => {
      const significance = variant.clinicalSignificance || "Unknown"
      if (!acc[significance]) {
        acc[significance] = []
      }
      acc[significance].push(variant)
      return acc
    },
    {} as Record<string, GenomicVariant[]>,
  )

  // Handle variant selection
  const handleVariantClick = (variant: GenomicVariant) => {
    setSelectedVariant(variant)
    if (onVariantSelect) {
      onVariantSelect(variant)
    }
  }

  // Draw chromosome visualization
  useEffect(() => {
    if (activeTab !== "chromosome" || !canvasRef.current || variants.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set canvas dimensions
    const width = canvas.width
    const height = canvas.height

    // Draw chromosomes
    const chromosomes = Object.keys(variantsByChromosome).sort((a, b) => {
      // Sort chromosomes numerically, with X, Y, and Unknown at the end
      if (a === "Unknown") return 1
      if (b === "Unknown") return -1
      if (a === "X") return b === "Y" ? -1 : 1
      if (a === "Y") return 1
      if (b === "X" || b === "Y") return -1
      return Number.parseInt(a) - Number.parseInt(b)
    })

    const chromosomeWidth = 30 * zoomLevel
    const chromosomeSpacing = 20 * zoomLevel
    const startX = (width - chromosomes.length * (chromosomeWidth + chromosomeSpacing)) / 2

    chromosomes.forEach((chromosome, index) => {
      const variants = variantsByChromosome[chromosome]
      const x = startX + index * (chromosomeWidth + chromosomeSpacing)
      const chromosomeHeight = 200 * zoomLevel
      const y = (height - chromosomeHeight) / 2

      // Draw chromosome
      ctx.fillStyle = "#d1d5db" // Gray
      ctx.strokeStyle = "#6b7280"
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.roundRect(x, y, chromosomeWidth, chromosomeHeight, [15 * zoomLevel])
      ctx.fill()
      ctx.stroke()

      // Draw centromere
      ctx.fillStyle = "#9ca3af"
      ctx.beginPath()
      ctx.ellipse(
        x + chromosomeWidth / 2,
        y + chromosomeHeight / 2,
        chromosomeWidth / 2,
        10 * zoomLevel,
        0,
        0,
        2 * Math.PI,
      )
      ctx.fill()

      // Draw variants
      variants.forEach((variant) => {
        // Calculate position (simplified)
        const variantY = y + 20 * zoomLevel + (chromosomeHeight - 40 * zoomLevel) * Math.random()

        // Determine color based on clinical significance
        let color = "#6b7280" // Default gray
        if (variant.clinicalSignificance?.toLowerCase().includes("pathogenic")) {
          color = "#ef4444" // Red for pathogenic
        } else if (variant.clinicalSignificance?.toLowerCase().includes("benign")) {
          color = "#10b981" // Green for benign
        } else if (variant.clinicalSignificance?.toLowerCase().includes("uncertain")) {
          color = "#f59e0b" // Amber for VUS
        }

        // Draw variant marker
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(x + chromosomeWidth / 2, variantY, 4 * zoomLevel, 0, 2 * Math.PI)
        ctx.fill()

        // Highlight selected variant
        if (
          selectedVariant &&
          variant.gene === selectedVariant.gene &&
          variant.position === selectedVariant.position &&
          variant.referenceAllele === selectedVariant.referenceAllele &&
          variant.alternateAllele === selectedVariant.alternateAllele
        ) {
          ctx.strokeStyle = "#3b82f6"
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.arc(x + chromosomeWidth / 2, variantY, 6 * zoomLevel, 0, 2 * Math.PI)
          ctx.stroke()
        }
      })

      // Draw chromosome label
      ctx.fillStyle = "#111827"
      ctx.font = `${12 * zoomLevel}px sans-serif`
      ctx.textAlign = "center"
      ctx.fillText(chromosome, x + chromosomeWidth / 2, y + chromosomeHeight + 20 * zoomLevel)
    })
  }, [activeTab, variants, variantsByChromosome, selectedVariant, zoomLevel])

  // Draw significance chart
  useEffect(() => {
    if (activeTab !== "significance" || !canvasRef.current || variants.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set canvas dimensions
    const width = canvas.width
    const height = canvas.height

    // Prepare data for pie chart
    const significanceCategories = Object.keys(variantsByClinicalSignificance)
    const total = variants.length

    // Define colors for different significance categories
    const colorMap: Record<string, string> = {
      Pathogenic: "#ef4444",
      "Likely pathogenic": "#f87171",
      "Uncertain significance": "#f59e0b",
      "Likely benign": "#a3e635",
      Benign: "#10b981",
      Unknown: "#6b7280",
    }

    // Draw pie chart
    const centerX = width / 2
    const centerY = height / 2
    const radius = (Math.min(width, height) / 3) * zoomLevel

    let startAngle = 0
    significanceCategories.forEach((category) => {
      const count = variantsByClinicalSignificance[category].length
      const sliceAngle = (count / total) * 2 * Math.PI

      // Find the appropriate color
      let color = "#6b7280" // Default gray
      for (const [key, value] of Object.entries(colorMap)) {
        if (category.toLowerCase().includes(key.toLowerCase())) {
          color = value
          break
        }
      }

      // Draw slice
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle)
      ctx.closePath()
      ctx.fill()

      // Draw label line and text if slice is large enough
      if (sliceAngle > 0.2) {
        const midAngle = startAngle + sliceAngle / 2
        const labelRadius = radius * 1.3
        const labelX = centerX + Math.cos(midAngle) * labelRadius
        const labelY = centerY + Math.sin(midAngle) * labelRadius

        // Draw line
        ctx.strokeStyle = "#9ca3af"
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(centerX + Math.cos(midAngle) * radius, centerY + Math.sin(midAngle) * radius)
        ctx.lineTo(labelX, labelY)
        ctx.stroke()

        // Draw text
        ctx.fillStyle = "#111827"
        ctx.font = `${12 * zoomLevel}px sans-serif`
        ctx.textAlign = midAngle < Math.PI ? "left" : "right"
        ctx.textBaseline = "middle"
        ctx.fillText(`${category} (${count})`, labelX, labelY)
      }

      startAngle += sliceAngle
    })

    // Draw center circle (donut hole)
    ctx.fillStyle = "#ffffff"
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius * 0.5, 0, 2 * Math.PI)
    ctx.fill()

    // Draw total count in center
    ctx.fillStyle = "#111827"
    ctx.font = `bold ${16 * zoomLevel}px sans-serif`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(`${total}`, centerX, centerY - 10 * zoomLevel)
    ctx.font = `${12 * zoomLevel}px sans-serif`
    ctx.fillText("variants", centerX, centerY + 10 * zoomLevel)
  }, [activeTab, variants, variantsByClinicalSignificance, zoomLevel])

  // Handle zoom
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.2, 2))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.2, 0.5))
  }

  // Export visualization as PNG
  const handleExport = () => {
    if (!canvasRef.current) return

    const link = document.createElement("a")
    link.download = `genomic-variants-${patientId || "export"}-${new Date().toISOString().split("T")[0]}.png`
    link.href = canvasRef.current.toDataURL("image/png")
    link.click()
  }

  if (isLoading) {
    return <VariantVisualizerSkeleton />
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <IconDna className="mr-2 h-5 w-5 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {variants.length === 0 ? (
          <div className="text-center py-8">
            <IconDna className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Variants Available</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              No genomic variants have been found or uploaded for analysis.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="chromosome">Chromosome View</TabsTrigger>
                <TabsTrigger value="significance">Significance</TabsTrigger>
                <TabsTrigger value="table">Table View</TabsTrigger>
              </TabsList>

              <div className="flex justify-end space-x-2 mt-2">
                <Button variant="outline" size="sm" onClick={handleZoomOut} title="Zoom out">
                  <IconZoomOut className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleZoomIn} title="Zoom in">
                  <IconZoomIn className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleExport} title="Export as PNG">
                  <IconDownload className="h-4 w-4" />
                </Button>
              </div>

              <div className="relative mt-2 border rounded-lg overflow-hidden bg-white dark:bg-gray-950">
                <canvas ref={canvasRef} width={800} height={400} className="w-full h-[400px]" />
              </div>

              <TabsContent value="table" className="mt-4">
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium">Gene</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">Chromosome</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">Position</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">Ref/Alt</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">Type</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">Significance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {variants.map((variant, index) => (
                        <tr
                          key={index}
                          className={`hover:bg-muted/50 cursor-pointer ${
                            selectedVariant === variant ? "bg-primary/10" : ""
                          }`}
                          onClick={() => handleVariantClick(variant)}
                        >
                          <td className="px-4 py-2 text-sm font-medium">{variant.gene}</td>
                          <td className="px-4 py-2 text-sm">{variant.chromosome || "—"}</td>
                          <td className="px-4 py-2 text-sm">{variant.position || "—"}</td>
                          <td className="px-4 py-2 text-sm">
                            {variant.referenceAllele || "—"}/{variant.alternateAllele || "—"}
                          </td>
                          <td className="px-4 py-2 text-sm">{variant.type || "—"}</td>
                          <td className="px-4 py-2 text-sm">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                variant.clinicalSignificance?.toLowerCase().includes("pathogenic")
                                  ? "bg-destructive/20 text-destructive"
                                  : variant.clinicalSignificance?.toLowerCase().includes("benign")
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                              }`}
                            >
                              {variant.clinicalSignificance || "Unknown"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>

            {selectedVariant && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 border rounded-lg bg-card/50"
              >
                <h3 className="text-lg font-medium mb-2">Selected Variant Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Gene</p>
                    <p className="font-medium">{selectedVariant.gene}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">
                      {selectedVariant.chromosome ? `Chr ${selectedVariant.chromosome}` : "—"}
                      {selectedVariant.position ? `:${selectedVariant.position}` : ""}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Variant Type</p>
                    <p className="font-medium">{selectedVariant.type || "Unknown"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Clinical Significance</p>
                    <p className="font-medium">{selectedVariant.clinicalSignificance || "Unknown"}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Interpretation</p>
                    <p className="font-medium">{selectedVariant.interpretation || "No interpretation available"}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function VariantVisualizerSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader>
        <Skeleton className="h-8 w-[250px] mb-2" />
        <Skeleton className="h-4 w-[300px]" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-4">
            <Skeleton className="h-10 w-[100px]" />
            <Skeleton className="h-10 w-[100px]" />
            <Skeleton className="h-10 w-[100px]" />
          </div>

          <Skeleton className="h-[400px] w-full" />

          <div className="space-y-2">
            <Skeleton className="h-6 w-[200px]" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

