"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  IconDna,
  IconMolecule,
  IconChartBar,
  IconDownload,
  IconZoomIn,
  IconZoomOut,
  IconRotate,
  IconInfoCircle,
} from "@tabler/icons-react"
import { ProteinViewer } from "@/components/genomic/protein-viewer"
import { MutationHeatmap } from "@/components/genomic/mutation-heatmap"
import { SecurityBadge } from "@/components/ui/security-badge"

interface GenomicVisualizationProps {
  data?: {
    type: string
    gene?: string
    mutation?: string
    mutations?: string[]
  }
}

export function GenomicVisualization({ data }: GenomicVisualizationProps) {
  const [activeTab, setActiveTab] = useState("3d")

  if (!data) {
    return (
      <div className="text-center p-8">
        <IconDna className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Visualization Data</h3>
        <p className="text-sm text-muted-foreground">
          Ask about specific genomic variants or mutations to see interactive visualizations.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center">
            <IconDna className="h-5 w-5 text-primary mr-2" />
            {data.gene} {data.mutation || data.mutations?.join("/") || ""}
          </h3>
          <p className="text-sm text-muted-foreground">
            {data.type === "protein" ? "Protein structure visualization" : "Mutation comparison analysis"}
          </p>
        </div>
        <SecurityBadge type="encryption" />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="3d">
            <IconMolecule className="h-4 w-4 mr-2" />
            3D Structure
          </TabsTrigger>
          <TabsTrigger value="heatmap">
            <IconChartBar className="h-4 w-4 mr-2" />
            Mutation Prevalence
          </TabsTrigger>
        </TabsList>

        <div className="flex justify-end space-x-2 mt-2">
          <Button variant="outline" size="sm">
            <IconZoomIn className="h-4 w-4 mr-1" />
            Zoom In
          </Button>
          <Button variant="outline" size="sm">
            <IconZoomOut className="h-4 w-4 mr-1" />
            Zoom Out
          </Button>
          <Button variant="outline" size="sm">
            <IconRotate className="h-4 w-4 mr-1" />
            Reset View
          </Button>
          <Button variant="outline" size="sm">
            <IconDownload className="h-4 w-4 mr-1" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <IconInfoCircle className="h-4 w-4" />
          </Button>
        </div>

        <TabsContent value="3d" className="mt-4">
          <ProteinViewer gene={data.gene} mutation={data.mutation || data.mutations?.[0]} />
        </TabsContent>

        <TabsContent value="heatmap" className="mt-4">
          <MutationHeatmap gene={data.gene} mutations={data.mutations || [data.mutation]} />
        </TabsContent>
      </Tabs>

      <div className="bg-secondary/30 p-4 rounded-lg text-sm">
        <h4 className="font-semibold mb-2">Clinical Implications</h4>
        {data.gene === "EGFR" && data.mutation === "T790M" && (
          <p>
            The EGFR T790M mutation is found in approximately 50-60% of patients who develop resistance to
            first/second-generation EGFR TKIs. Third-generation EGFR TKIs like osimertinib are effective against this
            mutation with response rates of 60-70%.
          </p>
        )}
        {data.gene === "KRAS" && (
          <p>
            KRAS G12C mutations are found in approximately 13% of lung adenocarcinomas and 3% of colorectal cancers.
            KRAS G12D mutations are more common in pancreatic ductal adenocarcinoma (35%). G12C-specific inhibitors like
            sotorasib have shown a 37.1% objective response rate in NSCLC.
          </p>
        )}
      </div>
    </div>
  )
}

