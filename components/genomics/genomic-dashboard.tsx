"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, FileText, BarChart3, Dna } from "lucide-react"
import { useGenomicData } from "./genomic-data-provider"
import { GenomicVisualization } from "./genomic-visualization"
import { GenomicReports } from "./genomic-reports"

export function GenomicDashboard() {
  const {
    variants,
    isLoading,
    error,
    fetchVariants,
    selectedPatientId,
    selectedSampleId,
    setSelectedPatientId,
    setSelectedSampleId,
  } = useGenomicData()

  const [activeTab, setActiveTab] = useState("visualization")

  // Mock patient and sample data - in a real app, this would come from an API
  const patients = [
    { id: "patient-001", name: "John Doe" },
    { id: "patient-002", name: "Jane Smith" },
  ]

  const samples = [
    { id: "sample-001", patientId: "patient-001", name: "Primary Tumor Biopsy", date: "2023-05-15" },
    { id: "sample-002", patientId: "patient-001", name: "Circulating Tumor DNA", date: "2023-06-20" },
    { id: "sample-003", patientId: "patient-002", name: "Primary Tumor Biopsy", date: "2023-04-10" },
  ]

  // Filter samples based on selected patient
  const filteredSamples = samples.filter((sample) => !selectedPatientId || sample.patientId === selectedPatientId)

  // Load data when patient and sample are selected
  useEffect(() => {
    if (selectedPatientId && selectedSampleId) {
      fetchVariants(selectedPatientId, selectedSampleId)
    }
  }, [selectedPatientId, selectedSampleId, fetchVariants])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Genomic Data Selection</CardTitle>
          <CardDescription>Select a patient and sample to view genomic data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="patient-select" className="block text-sm font-medium mb-1">
                Patient
              </label>
              <Select
                value={selectedPatientId || ""}
                onValueChange={(value) => {
                  setSelectedPatientId(value)
                  setSelectedSampleId(null) // Reset sample when patient changes
                }}
              >
                <SelectTrigger id="patient-select">
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="sample-select" className="block text-sm font-medium mb-1">
                Sample
              </label>
              <Select
                value={selectedSampleId || ""}
                onValueChange={setSelectedSampleId}
                disabled={!selectedPatientId || filteredSamples.length === 0}
              >
                <SelectTrigger id="sample-select">
                  <SelectValue
                    placeholder={
                      !selectedPatientId
                        ? "Select a patient first"
                        : filteredSamples.length === 0
                          ? "No samples available"
                          : "Select sample"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {filteredSamples.map((sample) => (
                    <SelectItem key={sample.id} value={sample.id}>
                      {sample.name} ({sample.date})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="mt-4 flex justify-end">
            <Button
              onClick={() => {
                if (selectedPatientId && selectedSampleId) {
                  fetchVariants(selectedPatientId, selectedSampleId)
                }
              }}
              disabled={!selectedPatientId || !selectedSampleId || isLoading}
            >
              {isLoading ? "Loading..." : "Load Data"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
          <TabsTrigger value="visualization" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Visualization</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <Dna className="h-4 w-4" />
            <span className="hidden sm:inline">Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Reports</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="visualization" className="mt-6">
          <GenomicVisualization
            patientId={selectedPatientId || undefined}
            sampleId={selectedSampleId || undefined}
            variantData={variants}
            isLoading={isLoading}
            height={500}
          />
        </TabsContent>

        <TabsContent value="analysis" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Genomic Analysis</CardTitle>
              <CardDescription>Advanced analysis of genomic variants and their clinical significance</CardDescription>
            </CardHeader>
            <CardContent>
              {!selectedPatientId || !selectedSampleId ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Please select a patient and sample to view analysis</p>
                </div>
              ) : variants.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No genomic data available for analysis</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Variant Summary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{variants.length}</div>
                        <p className="text-sm text-gray-500">Total variants detected</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Pathogenic Variants</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-red-600">
                          {
                            variants.filter(
                              (v) =>
                                v.clinicalSignificance === "Pathogenic" ||
                                v.clinicalSignificance === "Likely pathogenic",
                            ).length
                          }
                        </div>
                        <p className="text-sm text-gray-500">Clinically significant variants</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">High Impact</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-amber-600">
                          {variants.filter((v) => v.impact === "HIGH").length}
                        </div>
                        <p className="text-sm text-gray-500">Variants with high functional impact</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-4">Top Affected Genes</h3>
                    <div className="space-y-3">
                      {Array.from(
                        variants.reduce((acc, variant) => {
                          if (variant.gene) {
                            acc.set(variant.gene, (acc.get(variant.gene) || 0) + 1)
                          }
                          return acc
                        }, new Map<string, number>()),
                      )
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 5)
                        .map(([gene, count]) => (
                          <div key={gene} className="flex items-center">
                            <div className="w-24 font-medium">{gene}</div>
                            <div className="flex-1">
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                  className="bg-primary h-2.5 rounded-full"
                                  style={{ width: `${(count / variants.length) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                            <div className="w-12 text-right text-sm">{count}</div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <GenomicReports patientId={selectedPatientId} sampleId={selectedSampleId} variants={variants} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
