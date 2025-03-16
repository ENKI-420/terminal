"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { IconDna, IconExternalLink, IconFileText, IconAlertTriangle } from "@tabler/icons-react"
import { useToast } from "@/hooks/use-toast"
import { JBrowseViewer } from "./jbrowse-viewer"

interface VariantDetailProps {
  variantId: string
  gene?: string
  chromosome?: string
  position?: number
  reference?: string
  alternate?: string
  patientId?: string
}

export function VariantDetail({
  variantId,
  gene,
  chromosome,
  position,
  reference,
  alternate,
  patientId,
}: VariantDetailProps) {
  const [variantData, setVariantData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const { toast } = useToast()

  useEffect(() => {
    const fetchVariantData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // In a real implementation, we would fetch variant data from an API
        // For this demo, we'll simulate the API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock variant data
        const mockVariantData = {
          id: variantId,
          gene: gene || "EGFR",
          chromosome: chromosome || "chr7",
          position: position || 55191822,
          reference: reference || "T",
          alternate: alternate || "G",
          type: "SNV",
          clinicalSignificance: "Pathogenic",
          interpretation: "This variant is associated with response to EGFR inhibitors in non-small cell lung cancer.",
          frequency: {
            gnomAD: "0.0001",
            topMed: "0.0002",
            thousandGenomes: "0.0000",
          },
          annotations: {
            sift: "Deleterious",
            polyphen: "Probably Damaging",
            cadd: 25.3,
          },
          publications: [
            {
              title: "EGFR mutations and resistance to irreversible pyrimidine-based EGFR inhibitors",
              authors: "Niederst MJ, Hu H, Mulvey HE, et al.",
              journal: "Clin Cancer Res",
              year: 2015,
              pmid: "25351743",
            },
            {
              title: "The T790M mutation in EGFR kinase causes drug resistance by increasing the affinity for ATP",
              authors: "Yun CH, Mengwasser KE, Toms AV, et al.",
              journal: "Proc Natl Acad Sci USA",
              year: 2008,
              pmid: "18227510",
            },
          ],
          clinicalTrials: [
            {
              id: "NCT02296125",
              title:
                "AZD9291 Versus Platinum-Based Doublet-Chemotherapy in Locally Advanced or Metastatic Non-Small Cell Lung Cancer",
              phase: "Phase 3",
              status: "Completed",
            },
            {
              id: "NCT03778229",
              title:
                "Osimertinib and Necitumumab in Treating Patients With EGFR-Mutant Stage IV or Recurrent Non-small Cell Lung Cancer",
              phase: "Phase 1/2",
              status: "Recruiting",
            },
          ],
          therapeuticImplications: [
            {
              drug: "Osimertinib",
              sensitivity: "Sensitive",
              evidence: "Strong",
              description: "Third-generation EGFR TKI effective against T790M resistance mutations.",
            },
            {
              drug: "Erlotinib",
              sensitivity: "Resistant",
              evidence: "Strong",
              description: "First-generation EGFR TKI with reduced efficacy against T790M mutations.",
            },
          ],
        }

        setVariantData(mockVariantData)
      } catch (error) {
        console.error("Error fetching variant data:", error)
        setError("Failed to load variant data. Please try again.")
        toast({
          title: "Error",
          description: "Failed to load variant details",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchVariantData()
  }, [variantId, gene, chromosome, position, reference, alternate, toast])

  if (isLoading) {
    return <VariantDetailSkeleton />
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader className="bg-destructive/10">
          <CardTitle className="flex items-center text-destructive">
            <IconAlertTriangle className="mr-2 h-5 w-5" />
            Error Loading Variant Data
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p>{error}</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!variantData) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Variant Not Found</CardTitle>
          <CardDescription>The requested variant could not be found</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <IconDna className="mr-2 h-5 w-5 text-primary" />
            Variant Details: {variantData.gene} {variantData.reference}&gt;{variantData.alternate}
          </CardTitle>
          <CardDescription>
            {variantData.chromosome}:{variantData.position} | {variantData.type} | {variantData.clinicalSignificance}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="clinical">Clinical</TabsTrigger>
              <TabsTrigger value="publications">Publications</TabsTrigger>
              <TabsTrigger value="genomic">Genomic View</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Variant Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Gene:</span>
                        <span className="font-medium">{variantData.gene}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Location:</span>
                        <span className="font-medium">
                          {variantData.chromosome}:{variantData.position}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Change:</span>
                        <span className="font-medium">
                          {variantData.reference}>{variantData.alternate}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <span className="font-medium">{variantData.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Clinical Significance:</span>
                        <span className="font-medium">{variantData.clinicalSignificance}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-3">Population Frequency</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">gnomAD:</span>
                        <span className="font-medium">{variantData.frequency.gnomAD}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">TopMed:</span>
                        <span className="font-medium">{variantData.frequency.topMed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">1000 Genomes:</span>
                        <span className="font-medium">{variantData.frequency.thousandGenomes}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Interpretation</h3>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p>{variantData.interpretation}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">In-Silico Predictions</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-muted/50 p-4 rounded-lg text-center">
                      <p className="text-sm text-muted-foreground mb-1">SIFT</p>
                      <p className="font-medium">{variantData.annotations.sift}</p>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg text-center">
                      <p className="text-sm text-muted-foreground mb-1">PolyPhen</p>
                      <p className="font-medium">{variantData.annotations.polyphen}</p>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg text-center">
                      <p className="text-sm text-muted-foreground mb-1">CADD</p>
                      <p className="font-medium">{variantData.annotations.cadd}</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="clinical" className="mt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Therapeutic Implications</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium">Drug</th>
                          <th className="px-4 py-2 text-left text-sm font-medium">Sensitivity</th>
                          <th className="px-4 py-2 text-left text-sm font-medium">Evidence</th>
                          <th className="px-4 py-2 text-left text-sm font-medium">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {variantData.therapeuticImplications.map((therapy: any, index: number) => (
                          <tr key={index} className="hover:bg-muted/50">
                            <td className="px-4 py-2 text-sm font-medium">{therapy.drug}</td>
                            <td className="px-4 py-2 text-sm">
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  therapy.sensitivity === "Sensitive"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                }`}
                              >
                                {therapy.sensitivity}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-sm">{therapy.evidence}</td>
                            <td className="px-4 py-2 text-sm">{therapy.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Clinical Trials</h3>
                  <div className="space-y-4">
                    {variantData.clinicalTrials.map((trial: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{trial.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {trial.id} | {trial.phase} | {trial.status}
                            </p>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <a
                              href={`https://clinicaltrials.gov/study/${trial.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <IconExternalLink className="h-4 w-4 mr-1" />
                              View
                            </a>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="publications" className="mt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Related Publications</h3>
                  <div className="space-y-4">
                    {variantData.publications.map((publication: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{publication.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{publication.authors}</p>
                            <p className="text-sm mt-1">
                              {publication.journal}, {publication.year}
                            </p>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <a
                              href={`https://pubmed.ncbi.nlm.nih.gov/${publication.pmid}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <IconFileText className="h-4 w-4 mr-1" />
                              PubMed
                            </a>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="genomic" className="mt-6">
              <JBrowseViewer
                patientId={patientId || "demo"}
                variantId={variantId}
                region={`${variantData.chromosome}:${variantData.position - 5000}-${variantData.position + 5000}`}
                title="Genomic Context"
                description="Interactive visualization of the variant in its genomic context"
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

function VariantDetailSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader>
        <Skeleton className="h-8 w-[250px] mb-2" />
        <Skeleton className="h-4 w-[300px]" />
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex space-x-4">
            <Skeleton className="h-10 w-[100px]" />
            <Skeleton className="h-10 w-[100px]" />
            <Skeleton className="h-10 w-[100px]" />
            <Skeleton className="h-10 w-[100px]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Skeleton className="h-6 w-[150px]" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-6 w-[150px]" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Skeleton className="h-6 w-[150px]" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

