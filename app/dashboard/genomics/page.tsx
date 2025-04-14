import type { Metadata } from "next"
import { GenomicDataProvider } from "@/components/genomics/genomic-data-provider"
import { GenomicDashboard } from "@/components/genomics/genomic-dashboard"

export const metadata: Metadata = {
  title: "Genomic Analysis | Patient Portal",
  description: "Analyze and visualize genomic data for personalized healthcare insights",
}

export default function GenomicsPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Genomic Analysis</h1>
      <GenomicDataProvider>
        <GenomicDashboard />
      </GenomicDataProvider>
    </div>
  )
}
