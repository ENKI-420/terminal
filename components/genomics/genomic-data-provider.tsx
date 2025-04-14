"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

// Types for genomic data
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

type GenomicRegion = {
  chromosome: string
  start: number
  end: number
  features?: Array<{
    id: string
    type: string
    start: number
    end: number
    name?: string
  }>
}

type GenomicDataContextType = {
  variants: GenomicVariant[]
  regions: GenomicRegion[]
  selectedPatientId: string | null
  selectedSampleId: string | null
  isLoading: boolean
  error: string | null
  setSelectedPatientId: (id: string | null) => void
  setSelectedSampleId: (id: string | null) => void
  fetchVariants: (patientId: string, sampleId: string) => Promise<void>
  fetchRegions: (chromosome: string) => Promise<void>
}

// Create context with default values
const GenomicDataContext = createContext<GenomicDataContextType>({
  variants: [],
  regions: [],
  selectedPatientId: null,
  selectedSampleId: null,
  isLoading: false,
  error: null,
  setSelectedPatientId: () => {},
  setSelectedSampleId: () => {},
  fetchVariants: async () => {},
  fetchRegions: async () => {},
})

// Provider component
export function GenomicDataProvider({ children }: { children: ReactNode }) {
  const [variants, setVariants] = useState<GenomicVariant[]>([])
  const [regions, setRegions] = useState<GenomicRegion[]>([])
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null)
  const [selectedSampleId, setSelectedSampleId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Function to fetch variants for a patient and sample
  const fetchVariants = async (patientId: string, sampleId: string) => {
    try {
      setIsLoading(true)
      setError(null)

      // In a real implementation, this would be an API call
      // For demo purposes, we'll simulate a delay and return mock data
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock data - in production, replace with actual API call
      const mockVariants: GenomicVariant[] = Array.from({ length: 50 }, (_, i) => ({
        id: `var-${i + 1}`,
        position: {
          chromosome: i % 2 === 0 ? "1" : "2",
          position: 100000 + i * 10000,
          reference: "A",
          alternate: "G",
          quality: 100,
          filter: "PASS",
          info: {},
        },
        clinicalSignificance:
          i % 5 === 0
            ? "Pathogenic"
            : i % 5 === 1
              ? "Likely pathogenic"
              : i % 5 === 2
                ? "Uncertain significance"
                : "Benign",
        impact: i % 4 === 0 ? "HIGH" : i % 4 === 1 ? "MODERATE" : i % 4 === 2 ? "LOW" : "MODIFIER",
        gene: `GENE${i + 1}`,
        consequence: i % 3 === 0 ? "missense_variant" : i % 3 === 1 ? "frameshift_variant" : "synonymous_variant",
        frequency: Math.random() * 0.1,
        publications: i % 10 === 0 ? ["PMID:12345678", "PMID:87654321"] : [],
      }))

      setVariants(mockVariants)
      setSelectedPatientId(patientId)
      setSelectedSampleId(sampleId)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      console.error("Error fetching genomic variants:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // Function to fetch genomic regions for a chromosome
  const fetchRegions = async (chromosome: string) => {
    try {
      setIsLoading(true)
      setError(null)

      // In a real implementation, this would be an API call
      // For demo purposes, we'll simulate a delay and return mock data
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Mock data - in production, replace with actual API call
      const mockRegions: GenomicRegion[] = Array.from({ length: 5 }, (_, i) => ({
        chromosome,
        start: 100000 + i * 1000000,
        end: 100000 + ((i + 1) * 1000000 - 1),
        features: Array.from({ length: 3 }, (_, j) => ({
          id: `feature-${i}-${j}`,
          type: j % 3 === 0 ? "gene" : j % 3 === 1 ? "exon" : "regulatory",
          start: 100000 + i * 1000000 + j * 10000,
          end: 100000 + i * 1000000 + j * 10000 + 5000,
          name: `Feature-${i}-${j}`,
        })),
      }))

      setRegions(mockRegions)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      console.error("Error fetching genomic regions:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // Context value
  const value = {
    variants,
    regions,
    selectedPatientId,
    selectedSampleId,
    isLoading,
    error,
    setSelectedPatientId,
    setSelectedSampleId,
    fetchVariants,
    fetchRegions,
  }

  return <GenomicDataContext.Provider value={value}>{children}</GenomicDataContext.Provider>
}

// Custom hook to use the genomic data context
export function useGenomicData() {
  const context = useContext(GenomicDataContext)
  if (context === undefined) {
    throw new Error("useGenomicData must be used within a GenomicDataProvider")
  }
  return context
}
