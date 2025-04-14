"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Download, Printer, Share2, FileText, AlertTriangle, CheckCircle2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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

type GenomicReportsProps = {
  patientId: string | null
  sampleId: string | null
  variants: GenomicVariant[]
}

export function GenomicReports({ patientId, sampleId, variants }: GenomicReportsProps) {
  const [activeTab, setActiveTab] = useState("clinical")
  const { toast } = useToast()

  // Mock report data - in a real app, this would be generated from the variants
  const reportDate = new Date().toLocaleDateString()

  const handleDownload = () => {
    toast({
      title: "Report Downloaded",
      description: "The genomic report has been downloaded successfully.",
    })
  }

  const handlePrint = () => {
    toast({
      title: "Printing Report",
      description: "The genomic report has been sent to the printer.",
    })
  }

  const handleShare = () => {
    toast({
      title: "Share Report",
      description: "The sharing options have been opened.",
    })
  }

  if (!patientId || !sampleId) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileText className="h-12 w-12 text-gray-300 mb-4" />
          <p className="text-gray-500 text-center">Please select a patient and sample to view genomic reports</p>
        </CardContent>
      </Card>
    )
  }

  if (variants.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertTriangle className="h-12 w-12 text-gray-300 mb-4" />
          <p className="text-gray-500 text-center">No genomic data available to generate reports</p>
        </CardContent>
      </Card>
    )
  }

  // Count pathogenic variants
  const pathogenicCount = variants.filter(
    (v) => v.clinicalSignificance === "Pathogenic" || v.clinicalSignificance === "Likely pathogenic",
  ).length

  // Count high impact variants
  const highImpactCount = variants.filter((v) => v.impact === "HIGH").length

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle>Genomic Analysis Report</CardTitle>
            <CardDescription>
              Comprehensive analysis of genomic variants and their clinical significance
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="border rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Report Date</p>
              <p className="font-medium">{reportDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Patient ID</p>
              <p className="font-medium">{patientId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Sample ID</p>
              <p className="font-medium">{sampleId}</p>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="clinical">Clinical Summary</TabsTrigger>
            <TabsTrigger value="technical">Technical Details</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="clinical" className="mt-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Variant Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Variants</span>
                      <Badge variant="outline" className="ml-auto">
                        {variants.length}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Pathogenic Variants</span>
                      <Badge variant={pathogenicCount > 0 ? "destructive" : "outline"} className="ml-auto">
                        {pathogenicCount}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>High Impact Variants</span>
                      <Badge variant={highImpactCount > 0 ? "secondary" : "outline"} className="ml-auto">
                        {highImpactCount}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Clinical Interpretation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm">
                      {pathogenicCount > 0 ? (
                        <span className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <span>Clinically significant variants detected</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span>No clinically significant variants detected</span>
                        </span>
                      )}
                    </p>
                    <p className="text-sm mt-2">
                      This genomic analysis identified {variants.length} variants, of which {pathogenicCount} are
                      classified as pathogenic or likely pathogenic.
                      {highImpactCount > 0 &&
                        ` ${highImpactCount} variants are predicted to have a high functional impact.`}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Key Findings</CardTitle>
              </CardHeader>
              <CardContent>
                {pathogenicCount > 0 ? (
                  <div className="space-y-4">
                    {variants
                      .filter(
                        (v) =>
                          v.clinicalSignificance === "Pathogenic" || v.clinicalSignificance === "Likely pathogenic",
                      )
                      .slice(0, 3)
                      .map((variant, index) => (
                        <div key={variant.id} className="border-b pb-4 last:border-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{variant.gene || `Variant ${index + 1}`}</h4>
                              <p className="text-sm text-gray-500">
                                {variant.position.chromosome}:{variant.position.position} {variant.position.reference}
                                &gt;{variant.position.alternate}
                              </p>
                            </div>
                            <Badge variant="destructive">{variant.clinicalSignificance}</Badge>
                          </div>
                          <p className="text-sm mt-2">
                            {variant.consequence ||
                              "This variant may affect protein function and has been associated with disease."}
                          </p>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-sm">
                    No clinically significant variants were identified in this analysis. The detected variants are
                    classified as benign or of uncertain significance.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="technical" className="mt-4 space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Analysis Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Genomic DNA was extracted and sequenced using next-generation sequencing technology. Variants were
                  called using a bioinformatics pipeline that includes alignment to the reference genome (GRCh38),
                  variant calling, and annotation.
                </p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Sequencing Platform</span>
                    <span className="font-medium">Illumina NovaSeq 6000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Mean Coverage</span>
                    <span className="font-medium">120x</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Variant Caller</span>
                    <span className="font-medium">GATK HaplotypeCaller v4.2.0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Annotation Tools</span>
                    <span className="font-medium">VEP, ANNOVAR</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Variant Classification</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">
                  Variants are classified according to the ACMG/AMP guidelines for the interpretation of sequence
                  variants. The following criteria are used for classification:
                </p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Badge variant="destructive">Pathogenic</Badge>
                    <p className="text-sm">Strong evidence that the variant causes disease</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge variant="destructive">Likely Pathogenic</Badge>
                    <p className="text-sm">Evidence suggests the variant is likely to cause disease</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge>Uncertain Significance</Badge>
                    <p className="text-sm">Insufficient evidence to determine the clinical significance</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge variant="outline">Likely Benign</Badge>
                    <p className="text-sm">Evidence suggests the variant is likely not disease-causing</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge variant="outline">Benign</Badge>
                    <p className="text-sm">Strong evidence that the variant is not disease-causing</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Variant Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">By Impact</h4>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <span className="text-sm w-24">High</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-red-500 h-2 rounded-full"
                            style={{
                              width: `${(variants.filter((v) => v.impact === "HIGH").length / variants.length) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm w-12 text-right">
                          {variants.filter((v) => v.impact === "HIGH").length}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm w-24">Moderate</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-yellow-500 h-2 rounded-full"
                            style={{
                              width: `${(variants.filter((v) => v.impact === "MODERATE").length / variants.length) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm w-12 text-right">
                          {variants.filter((v) => v.impact === "MODERATE").length}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm w-24">Low</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{
                              width: `${(variants.filter((v) => v.impact === "LOW").length / variants.length) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm w-12 text-right">
                          {variants.filter((v) => v.impact === "LOW").length}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm w-24">Modifier</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{
                              width: `${(variants.filter((v) => v.impact === "MODIFIER").length / variants.length) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm w-12 text-right">
                          {variants.filter((v) => v.impact === "MODIFIER").length}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">By Clinical Significance</h4>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <span className="text-sm w-24">Pathogenic</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-red-500 h-2 rounded-full"
                            style={{
                              width: `${(variants.filter((v) => v.clinicalSignificance === "Pathogenic").length / variants.length) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm w-12 text-right">
                          {variants.filter((v) => v.clinicalSignificance === "Pathogenic").length}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm w-24">Likely Path.</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-orange-500 h-2 rounded-full"
                            style={{
                              width: `${(variants.filter((v) => v.clinicalSignificance === "Likely pathogenic").length / variants.length) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm w-12 text-right">
                          {variants.filter((v) => v.clinicalSignificance === "Likely pathogenic").length}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm w-24">Uncertain</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gray-500 h-2 rounded-full"
                            style={{
                              width: `${(variants.filter((v) => v.clinicalSignificance === "Uncertain significance").length / variants.length) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm w-12 text-right">
                          {variants.filter((v) => v.clinicalSignificance === "Uncertain significance").length}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm w-24">Benign</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{
                              width: `${(variants.filter((v) => v.clinicalSignificance === "Benign").length / variants.length) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm w-12 text-right">
                          {variants.filter((v) => v.clinicalSignificance === "Benign").length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations" className="mt-4 space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Clinical Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                {pathogenicCount > 0 ? (
                  <div className="space-y-4">
                    <p className="text-sm">
                      Based on the genomic analysis, the following clinical recommendations are provided:
                    </p>
                    <ul className="space-y-2 list-disc list-inside text-sm">
                      <li>Consider referral to a clinical geneticist for further evaluation</li>
                      <li>Additional testing may be warranted to confirm the findings</li>
                      <li>Family testing should be considered for the identified pathogenic variants</li>
                      <li>Regular monitoring for early detection of potential disease manifestations</li>
                      <li>Consider targeted therapies based on the genomic profile</li>
                    </ul>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm">
                      No clinically significant variants were identified in this analysis. Standard clinical management
                      is recommended based on the patient's clinical presentation and family history.
                    </p>
                    <ul className="space-y-2 list-disc list-inside text-sm">
                      <li>Continue routine clinical follow-up</li>
                      <li>No specific genomic-guided interventions are indicated at this time</li>
                      <li>Consider re-evaluation if clinical status changes</li>
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Treatment Implications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm">
                    The genomic findings may have implications for treatment selection and response:
                  </p>

                  {pathogenicCount > 0 ? (
                    <div className="border rounded-md divide-y">
                      {variants
                        .filter(
                          (v) =>
                            v.clinicalSignificance === "Pathogenic" || v.clinicalSignificance === "Likely pathogenic",
                        )
                        .slice(0, 3)
                        .map((variant) => (
                          <div key={variant.id} className="p-3">
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium">{variant.gene || "Unknown Gene"}</h4>
                              <Badge variant="outline">
                                {variant.position.chromosome}:{variant.position.position}
                              </Badge>
                            </div>
                            <p className="text-sm mt-1">
                              {variant.gene
                                ? `Alterations in ${variant.gene} may affect response to targeted therapies.`
                                : "This variant may have implications for treatment selection."}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              <Badge variant="secondary">Potential Drug Sensitivity</Badge>
                              <Badge variant="secondary">Clinical Trial Eligibility</Badge>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-sm">
                      No genomic alterations were identified that would suggest specific targeted therapies or treatment
                      modifications at this time.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Follow-up Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm">
                    Based on the genomic analysis, the following follow-up actions are recommended:
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 rounded-full p-1.5 mt-0.5">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Genetic Counseling</p>
                        <p className="text-sm text-gray-500">
                          {pathogenicCount > 0
                            ? "Recommended to discuss the implications of the identified variants"
                            : "Optional to discuss the negative findings and residual risks"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 rounded-full p-1.5 mt-0.5">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Additional Testing</p>
                        <p className="text-sm text-gray-500">
                          {pathogenicCount > 0
                            ? "Consider confirmatory testing for the identified variants"
                            : "No additional genomic testing indicated at this time"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 rounded-full p-1.5 mt-0.5">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Clinical Monitoring</p>
                        <p className="text-sm text-gray-500">
                          Regular follow-up with the healthcare provider to monitor for any changes in clinical status
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 rounded-full p-1.5 mt-0.5">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Family Testing</p>
                        <p className="text-sm text-gray-500">
                          {pathogenicCount > 0
                            ? "Consider cascade testing for family members"
                            : "Not indicated based on current findings"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="flex justify-between">
        <p className="text-xs text-gray-500">
          This report is based on current knowledge and may be subject to revision as new information becomes available.
        </p>
        <p className="text-xs text-gray-500">
          Report ID: GR-{patientId}-{sampleId}-{new Date().getTime().toString().slice(-6)}
        </p>
      </CardFooter>
    </Card>
  )
}
