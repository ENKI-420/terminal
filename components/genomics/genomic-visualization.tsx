"use client"

import type React from "react"

import { useState, useEffect, useRef, useMemo } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Download, ZoomIn, ZoomOut, RotateCcw, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import { useMobile } from "@/hooks/use-mobile"

// Types for genomic data visualization
type GenomicPosition = {
  chromosome: string
  position: number
  reference: string
  alternate: string
  quality: number
  filter: string
  info: Record<string, any>
}

type GenomicVariant = {
  id: string
  position: GenomicPosition
  clinicalSignificance?: string
  impact?: "HIGH" | "MODERATE" | "LOW" | "MODIFIER"
  gene?: string
  consequence?: string
  frequency?: number
  publications?: string[]
}

type GenomicVisualizationProps = {
  patientId?: string
  sampleId?: string
  variantData?: GenomicVariant[]
  isLoading?: boolean
  onRegionSelect?: (region: { chromosome: string; start: number; end: number }) => void
  onVariantSelect?: (variant: GenomicVariant) => void
  height?: number
  width?: number
  className?: string
}

/**
 * GenomicVisualization Component
 *
 * A comprehensive component for visualizing genomic data with interactive features
 * including zooming, filtering, and selection of genomic regions and variants.
 */
export function GenomicVisualization({
  patientId,
  sampleId,
  variantData = [],
  isLoading = false,
  onRegionSelect,
  onVariantSelect,
  height = 500,
  width = 800,
  className = "",
}: GenomicVisualizationProps) {
  const [activeTab, setActiveTab] = useState("variants")
  const [selectedChromosome, setSelectedChromosome] = useState("1")
  const [zoomLevel, setZoomLevel] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState<GenomicVariant | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [dataFetched, setDataFetched] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { toast } = useToast()
  const isMobile = useMobile()

  // Filter variants by selected chromosome
  const filteredVariants = useMemo(() => {
    if (!variantData || variantData.length === 0) return []
    return variantData
      .filter((variant) => variant.position.chromosome === selectedChromosome)
      .sort((a, b) => a.position.position - b.position.position)
  }, [variantData, selectedChromosome])

  // Calculate statistics for the filtered variants
  const variantStats = useMemo(() => {
    if (!filteredVariants || filteredVariants.length === 0) {
      return { total: 0, high: 0, moderate: 0, low: 0, modifier: 0 }
    }

    return filteredVariants.reduce(
      (stats, variant) => {
        stats.total += 1
        if (variant.impact) {
          stats[variant.impact.toLowerCase() as "high" | "moderate" | "low" | "modifier"] += 1
        }
        return stats
      },
      { total: 0, high: 0, moderate: 0, low: 0, modifier: 0 },
    )
  }, [filteredVariants])

  // Fetch genomic data if not provided
  useEffect(() => {
    const fetchGenomicData = async () => {
      if ((!variantData || variantData.length === 0) && patientId && sampleId && !dataFetched) {
        try {
          setError(null)
          // Simulate API call - in production, replace with actual API call
          const response = await fetch(`/api/genomics/variants?patientId=${patientId}&sampleId=${sampleId}`)

          if (!response.ok) {
            throw new Error(`Failed to fetch genomic data: ${response.statusText}`)
          }

          const data = await response.json()
          // In a real implementation, you would set the variant data here
          // setVariantData(data)
          setDataFetched(true)
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
          setError(errorMessage)
          toast({
            title: "Error loading genomic data",
            description: errorMessage,
            variant: "destructive",
          })
        }
      }
    }

    fetchGenomicData()
  }, [patientId, sampleId, variantData, dataFetched, toast])

  // Draw the genomic visualization on canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // If loading or no data, show appropriate message
    if (isLoading) {
      ctx.font = "16px Arial"
      ctx.fillStyle = "#666"
      ctx.textAlign = "center"
      ctx.fillText("Loading genomic data...", canvas.width / 2, canvas.height / 2)
      return
    }

    if (filteredVariants.length === 0) {
      ctx.font = "16px Arial"
      ctx.fillStyle = "#666"
      ctx.textAlign = "center"
      ctx.fillText("No variants found for selected chromosome", canvas.width / 2, canvas.height / 2)
      return
    }

    // Draw chromosome ideogram
    const ideogramHeight = 30
    const ideogramY = 50
    ctx.fillStyle = "#e0e0e0"
    ctx.fillRect(50, ideogramY, canvas.width - 100, ideogramHeight)

    // Draw variants
    const variantAreaHeight = canvas.height - ideogramY - ideogramHeight - 50
    const variantAreaY = ideogramY + ideogramHeight + 20

    // Find min and max positions for scaling
    const minPosition = Math.min(...filteredVariants.map((v) => v.position.position))
    const maxPosition = Math.max(...filteredVariants.map((v) => v.position.position))
    const range = maxPosition - minPosition

    filteredVariants.forEach((variant) => {
      // Calculate x position based on genomic position
      const x = 50 + ((variant.position.position - minPosition) / range) * (canvas.width - 100)

      // Determine color based on impact
      let color = "#888888"
      if (variant.impact === "HIGH") color = "#ff4d4f"
      else if (variant.impact === "MODERATE") color = "#faad14"
      else if (variant.impact === "LOW") color = "#52c41a"
      else if (variant.impact === "MODIFIER") color = "#1890ff"

      // Draw variant marker
      ctx.beginPath()
      ctx.arc(x, variantAreaY + variantAreaHeight / 2, 5 * zoomLevel, 0, 2 * Math.PI)
      ctx.fillStyle = color
      ctx.fill()

      // Highlight selected variant
      if (selectedVariant && variant.id === selectedVariant.id) {
        ctx.beginPath()
        ctx.arc(x, variantAreaY + variantAreaHeight / 2, 8 * zoomLevel, 0, 2 * Math.PI)
        ctx.strokeStyle = "#1d4ed8"
        ctx.lineWidth = 2
        ctx.stroke()
      }
    })

    // Draw axis
    ctx.strokeStyle = "#000"
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(50, variantAreaY + variantAreaHeight + 10)
    ctx.lineTo(canvas.width - 50, variantAreaY + variantAreaHeight + 10)
    ctx.stroke()

    // Draw axis labels
    ctx.font = "12px Arial"
    ctx.fillStyle = "#000"
    ctx.textAlign = "center"

    // Start position
    ctx.fillText(minPosition.toLocaleString(), 50, variantAreaY + variantAreaHeight + 30)

    // End position
    ctx.fillText(maxPosition.toLocaleString(), canvas.width - 50, variantAreaY + variantAreaHeight + 30)

    // Chromosome label
    ctx.font = "14px Arial"
    ctx.fillText(`Chromosome ${selectedChromosome}`, canvas.width / 2, 30)
  }, [filteredVariants, selectedChromosome, zoomLevel, selectedVariant, isLoading])

  // Handle canvas click to select variant
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas || filteredVariants.length === 0) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Find min and max positions for scaling
    const minPosition = Math.min(...filteredVariants.map((v) => v.position.position))
    const maxPosition = Math.max(...filteredVariants.map((v) => v.position.position))
    const range = maxPosition - minPosition

    // Calculate variant area
    const ideogramY = 50
    const ideogramHeight = 30
    const variantAreaY = ideogramY + ideogramHeight + 20
    const variantAreaHeight = canvas.height - variantAreaY - 50

    // Check if click is in variant area
    if (y >= variantAreaY && y <= variantAreaY + variantAreaHeight) {
      // Find closest variant
      let closestVariant: GenomicVariant | null = null
      let minDistance = Number.POSITIVE_INFINITY

      filteredVariants.forEach((variant) => {
        const variantX = 50 + ((variant.position.position - minPosition) / range) * (canvas.width - 100)
        const distance = Math.abs(x - variantX)

        if (distance < minDistance && distance < 10 * zoomLevel) {
          minDistance = distance
          closestVariant = variant
        }
      })

      if (closestVariant) {
        setSelectedVariant(closestVariant)
        if (onVariantSelect) {
          onVariantSelect(closestVariant)
        }
      }
    }
  }

  // Handle zoom in/out
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.2, 3))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.2, 0.5))
  }

  const handleReset = () => {
    setZoomLevel(1)
    setSelectedVariant(null)
  }

  // Handle export data
  const handleExportData = () => {
    try {
      const dataStr = JSON.stringify(filteredVariants, null, 2)
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

      const exportName = `genomic-variants-chr${selectedChromosome}-${new Date().toISOString().slice(0, 10)}.json`

      const linkElement = document.createElement("a")
      linkElement.setAttribute("href", dataUri)
      linkElement.setAttribute("download", exportName)
      linkElement.click()

      toast({
        title: "Export successful",
        description: `Data exported as ${exportName}`,
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
      toast({
        title: "Export failed",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle>Genomic Visualization</CardTitle>
            <CardDescription>Interactive visualization of genomic variants</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleZoomIn}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Zoom In</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleZoomOut}>
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Zoom Out</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleReset}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reset View</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleExportData}>
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Export Data</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="w-full md:w-1/3">
            <label htmlFor="chromosome-select" className="block text-sm font-medium mb-1">
              Chromosome
            </label>
            <Select value={selectedChromosome} onValueChange={setSelectedChromosome}>
              <SelectTrigger id="chromosome-select">
                <SelectValue placeholder="Select chromosome" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 22 }, (_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    Chromosome {i + 1}
                  </SelectItem>
                ))}
                <SelectItem value="X">Chromosome X</SelectItem>
                <SelectItem value="Y">Chromosome Y</SelectItem>
                <SelectItem value="MT">Mitochondrial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:w-2/3">
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="zoom-slider" className="block text-sm font-medium">
                Zoom Level
              </label>
              <span className="text-sm">{zoomLevel.toFixed(1)}x</span>
            </div>
            <Slider
              id="zoom-slider"
              min={0.5}
              max={3}
              step={0.1}
              value={[zoomLevel]}
              onValueChange={([value]) => setZoomLevel(value)}
            />
          </div>
        </div>

        <div className="relative" style={{ height: `${height}px`, width: "100%" }}>
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className="w-full h-full border rounded-md"
            onClick={handleCanvasClick}
          />

          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="mt-2 text-sm text-gray-600">Loading genomic data...</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="variants">Variants</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>

            <TabsContent value="variants" className="mt-2">
              <div className="max-h-60 overflow-y-auto border rounded-md p-2">
                {filteredVariants.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">No variants found for selected chromosome</p>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Position
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Gene
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Impact
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Consequence
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredVariants.slice(0, 10).map((variant) => (
                        <tr
                          key={variant.id}
                          className={`hover:bg-gray-50 cursor-pointer ${selectedVariant?.id === variant.id ? "bg-blue-50" : ""}`}
                          onClick={() => {
                            setSelectedVariant(variant)
                            if (onVariantSelect) onVariantSelect(variant)
                          }}
                        >
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                            {variant.position.position.toLocaleString()}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{variant.gene || "-"}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                              ${
                                variant.impact === "HIGH"
                                  ? "bg-red-100 text-red-800"
                                  : variant.impact === "MODERATE"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : variant.impact === "LOW"
                                      ? "bg-green-100 text-green-800"
                                      : variant.impact === "MODIFIER"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {variant.impact || "Unknown"}
                            </span>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                            {variant.consequence || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                {filteredVariants.length > 10 && (
                  <div className="text-center text-sm text-gray-500 mt-2">
                    Showing 10 of {filteredVariants.length} variants
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="stats" className="mt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-md p-4">
                  <h4 className="text-sm font-medium mb-2">Variant Impact Distribution</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs">High Impact</span>
                      <span className="text-xs font-medium">{variantStats.high}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${variantStats.total ? (variantStats.high / variantStats.total) * 100 : 0}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs">Moderate Impact</span>
                      <span className="text-xs font-medium">{variantStats.moderate}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{
                          width: `${variantStats.total ? (variantStats.moderate / variantStats.total) * 100 : 0}%`,
                        }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs">Low Impact</span>
                      <span className="text-xs font-medium">{variantStats.low}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${variantStats.total ? (variantStats.low / variantStats.total) * 100 : 0}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs">Modifier</span>
                      <span className="text-xs font-medium">{variantStats.modifier}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{
                          width: `${variantStats.total ? (variantStats.modifier / variantStats.total) * 100 : 0}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="border rounded-md p-4">
                  <h4 className="text-sm font-medium mb-2">Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Total Variants:</span>
                      <span className="text-sm font-medium">{variantStats.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Selected Chromosome:</span>
                      <span className="text-sm font-medium">{selectedChromosome}</span>
                    </div>
                    {filteredVariants.length > 0 && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-sm">Position Range:</span>
                          <span className="text-sm font-medium">
                            {Math.min(...filteredVariants.map((v) => v.position.position)).toLocaleString()} -
                            {Math.max(...filteredVariants.map((v) => v.position.position)).toLocaleString()}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details" className="mt-2">
              {selectedVariant ? (
                <div className="border rounded-md p-4">
                  <h4 className="font-medium mb-2">Variant Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-gray-500">ID</p>
                        <p>{selectedVariant.id}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Gene</p>
                        <p>{selectedVariant.gene || "Unknown"}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Position</p>
                        <p>
                          {selectedVariant.position.chromosome}:{selectedVariant.position.position}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Reference/Alternate</p>
                        <p>
                          {selectedVariant.position.reference}/{selectedVariant.position.alternate}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Impact</p>
                        <p>{selectedVariant.impact || "Unknown"}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Consequence</p>
                        <p>{selectedVariant.consequence || "Unknown"}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Clinical Significance</p>
                        <p>{selectedVariant.clinicalSignificance || "Unknown"}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Frequency</p>
                        <p>
                          {selectedVariant.frequency ? `${(selectedVariant.frequency * 100).toFixed(4)}%` : "Unknown"}
                        </p>
                      </div>
                    </div>

                    {selectedVariant.publications && selectedVariant.publications.length > 0 && (
                      <div className="mt-4">
                        <p className="text-gray-500 mb-1">Publications</p>
                        <ul className="list-disc list-inside space-y-1">
                          {selectedVariant.publications.map((pub, index) => (
                            <li key={index} className="text-xs">
                              {pub}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-center">
                  <Info className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-gray-500">Select a variant to view detailed information</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <div className="text-xs text-gray-500">
          {filteredVariants.length > 0
            ? `Showing ${filteredVariants.length} variants on chromosome ${selectedChromosome}`
            : "No variants to display"}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (onRegionSelect && filteredVariants.length > 0) {
              const minPos = Math.min(...filteredVariants.map((v) => v.position.position))
              const maxPos = Math.max(...filteredVariants.map((v) => v.position.position))
              onRegionSelect({
                chromosome: selectedChromosome,
                start: minPos,
                end: maxPos,
              })
            }
          }}
          disabled={filteredVariants.length === 0}
        >
          Select Region
        </Button>
      </CardFooter>
    </Card>
  )
}
