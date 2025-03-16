"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { IconDna, IconZoomIn, IconZoomOut, IconRefresh } from "@tabler/icons-react"
import { useToast } from "@/hooks/use-toast"

interface JBrowseViewerProps {
  patientId: string
  variantId?: string
  region?: string
  title?: string
  description?: string
}

export function JBrowseViewer({
  patientId,
  variantId,
  region = "chr7:55,086,724-55,275,031", // Default to EGFR gene region
  title = "Genomic Browser",
  description = "Interactive visualization of genomic variants using JBrowse",
}: JBrowseViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [jbrowseInstance, setJbrowseInstance] = useState<any>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Load JBrowse dynamically
    const loadJBrowse = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // In a real implementation, we would load JBrowse from CDN or local package
        // For this demo, we'll simulate the loading
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Simulate JBrowse initialization
        if (containerRef.current) {
          // In a real implementation, we would initialize JBrowse here
          // const browser = new JBrowse.create({
          //   container: containerRef.current,
          //   assembly: "hg38",
          //   tracks: [
          //     {
          //       type: "ReferenceSequenceTrack",
          //       trackId: "refseq",
          //       adapter: { type: "BgzipFastaAdapter", fastaLocation: { uri: "https://jbrowse.org/genomes/hg38/fasta/hg38.fa.gz" } },
          //     },
          //     {
          //       type: "VariantTrack",
          //       trackId: "patient_variants",
          //       adapter: { type: "VcfTabixAdapter", vcfGzLocation: { uri: `/api/genomic/variants/${patientId}.vcf.gz` } },
          //     }
          //   ]
          // })

          // Simulate JBrowse instance
          const mockJBrowseInstance = {
            navigate: (newRegion: string) => {
              console.log(`Navigating to ${newRegion}`)
              // In a real implementation, this would navigate the JBrowse view
            },
            zoomIn: () => {
              console.log("Zooming in")
              // In a real implementation, this would zoom in the JBrowse view
            },
            zoomOut: () => {
              console.log("Zooming out")
              // In a real implementation, this would zoom out the JBrowse view
            },
          }

          setJbrowseInstance(mockJBrowseInstance)

          // Navigate to the specified region
          if (region) {
            mockJBrowseInstance.navigate(region)
          }

          // If a specific variant is provided, highlight it
          if (variantId) {
            console.log(`Highlighting variant ${variantId}`)
            // In a real implementation, this would highlight the specific variant
          }
        }
      } catch (error) {
        console.error("Error initializing JBrowse:", error)
        setError("Failed to initialize genomic browser. Please try again.")
        toast({
          title: "Error",
          description: "Failed to load genomic browser",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadJBrowse()

    // Cleanup function
    return () => {
      // In a real implementation, we would destroy the JBrowse instance here
      if (jbrowseInstance) {
        // jbrowseInstance.destroy()
        console.log("Cleaning up JBrowse instance")
      }
    }
  }, [patientId, region, variantId, toast])

  const handleZoomIn = () => {
    if (jbrowseInstance) {
      jbrowseInstance.zoomIn()
    }
  }

  const handleZoomOut = () => {
    if (jbrowseInstance) {
      jbrowseInstance.zoomOut()
    }
  }

  const handleRefresh = () => {
    if (jbrowseInstance) {
      // In a real implementation, this would refresh the JBrowse view
      console.log("Refreshing JBrowse view")
      toast({
        title: "Refreshing",
        description: "Refreshing genomic browser view",
      })
    }
  }

  if (error) {
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
          <div className="text-center py-8">
            <div className="bg-destructive/10 p-4 rounded-lg text-destructive mb-4">
              <p>{error}</p>
            </div>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </CardContent>
      </Card>
    )
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
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-sm">
              {!isLoading && <span className="font-mono bg-muted px-2 py-1 rounded">{region}</span>}
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleZoomIn} disabled={isLoading}>
                <IconZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleZoomOut} disabled={isLoading}>
                <IconZoomOut className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
                <IconRefresh className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="w-full h-[400px] bg-card/50 rounded-lg border border-border flex items-center justify-center">
              <div className="text-center">
                <Skeleton className="h-8 w-8 rounded-full mx-auto mb-4" />
                <p className="text-muted-foreground">Loading genomic browser...</p>
              </div>
            </div>
          ) : (
            <div
              ref={containerRef}
              className="w-full h-[400px] bg-white dark:bg-gray-900 rounded-lg border border-border overflow-hidden"
            >
              {/* JBrowse will be initialized here */}
              {/* For demo purposes, we'll show a placeholder */}
              <div className="w-full h-full flex flex-col">
                <div className="bg-muted/50 p-2 text-xs font-mono">
                  {region} | Patient ID: {patientId} {variantId ? `| Variant: ${variantId}` : ""}
                </div>
                <div className="flex-1 p-4 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-muted-foreground mb-2">JBrowse Genomic Browser Simulation</p>
                    <p className="text-xs text-muted-foreground">
                      In a production environment, this would display an interactive JBrowse genomic browser with
                      reference genome, variant tracks, and gene annotations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="text-xs text-muted-foreground">
            <p>
              This genomic browser allows you to explore the patient's genomic variants in their genomic context. You
              can zoom in/out, navigate to specific regions, and click on variants to see detailed information.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

