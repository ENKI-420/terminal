"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart } from "@/components/charts"
import {
  Microscope,
  FileText,
  RefreshCw,
  Download,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Clock,
  TrendingUp,
  Lightbulb,
  Dna,
  Pill,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function ResistancePredictionModel() {
  const [isLoading, setIsLoading] = useState(false)
  const [resultsVisible, setResultsVisible] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [selectedCancer, setSelectedCancer] = useState("nsclc")
  const [selectedTreatment, setSelectedTreatment] = useState("osimertinib")
  const [selectedTimepoint, setSelectedTimepoint] = useState("6")

  // Mock ctDNA data
  const ctDNAData = [
    { month: 0, vaf: 5.2, tumorFraction: 3.8 },
    { month: 2, vaf: 2.1, tumorFraction: 1.5 },
    { month: 4, vaf: 0.8, tumorFraction: 0.6 },
    { month: 6, vaf: 0.3, tumorFraction: 0.2 },
    { month: 8, vaf: 0.1, tumorFraction: 0.1 },
    { month: 10, vaf: 0.4, tumorFraction: 0.3 },
    { month: 12, vaf: 1.2, tumorFraction: 0.9 },
  ]

  // Mock resistance mutations
  const resistanceMutations = [
    {
      gene: "EGFR",
      mutation: "T790M",
      vaf: 0.4,
      firstDetected: "Month 10",
      trend: "increasing",
      mechanism: "Target alteration",
      drugs: ["Osimertinib"],
    },
    {
      gene: "MET",
      mutation: "Amplification",
      vaf: 0.3,
      firstDetected: "Month 12",
      trend: "increasing",
      mechanism: "Bypass pathway activation",
      drugs: ["Tepotinib", "Savolitinib"],
    },
  ]

  // Treatment options
  const treatmentOptions = {
    nsclc: [
      { id: "osimertinib", name: "Osimertinib (EGFR TKI)" },
      { id: "alectinib", name: "Alectinib (ALK TKI)" },
      { id: "lorlatinib", name: "Lorlatinib (ALK/ROS1 TKI)" },
      { id: "pembrolizumab", name: "Pembrolizumab (Anti-PD-1)" },
    ],
    melanoma: [
      { id: "dabrafenib", name: "Dabrafenib + Trametinib (BRAF/MEK)" },
      { id: "vemurafenib", name: "Vemurafenib + Cobimetinib (BRAF/MEK)" },
      { id: "nivolumab", name: "Nivolumab (Anti-PD-1)" },
      { id: "ipilimumab", name: "Ipilimumab (Anti-CTLA-4)" },
    ],
  }

  const handlePrediction = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setResultsVisible(true)
    }, 2000)
  }

  const handleReset = () => {
    setResultsVisible(false)
  }

  const handleUseExample = () => {
    setSelectedCancer("nsclc")
    setSelectedTreatment("osimertinib")
    setSelectedTimepoint("6")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Microscope className="h-6 w-6 text-red-500" />
                Resistance Prediction Model
              </CardTitle>
              <CardDescription>Identifies emerging resistance mechanisms from longitudinal ctDNA data</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                87% Accuracy
              </Badge>
              <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                3.2 Months Lead Time
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={() => setShowExplanation(!showExplanation)}>
              {showExplanation ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-2" /> Hide Model Explanation
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-2" /> Show Model Explanation
                </>
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={handleUseExample}>
              <FileText className="h-4 w-4 mr-2" /> Use Example Patient
            </Button>
          </div>

          {showExplanation && (
            <Alert className="bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800">
              <Lightbulb className="h-4 w-4 text-red-600 dark:text-red-400" />
              <AlertTitle className="text-red-600 dark:text-red-400">About This Model</AlertTitle>
              <AlertDescription className="text-red-700 dark:text-red-300">
                <p className="mb-2">
                  This resistance prediction model uses a recurrent neural network (RNN) to analyze longitudinal ctDNA
                  data and predict the emergence of resistance mechanisms before they become clinically apparent.
                </p>
                <p className="mb-2">
                  <span className="font-medium">Training Data:</span> The model was trained on longitudinal ctDNA
                  samples from 8,000 patients receiving targeted therapies or immunotherapies, with known resistance
                  mechanisms and clinical outcomes.
                </p>
                <p className="mb-2">
                  <span className="font-medium">Validation:</span> External validation on 2,000 patients achieved 87%
                  accuracy for predicting specific resistance mechanisms with a median lead time of 3.2 months before
                  clinical progression.
                </p>
                <p>
                  <span className="font-medium">Key Features:</span> The model analyzes variant allele frequencies, copy
                  number changes, and clonal dynamics over time to identify emerging resistant clones and predict their
                  impact on treatment efficacy.
                </p>
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Treatment & Monitoring Data</CardTitle>
                <CardDescription>Enter treatment and ctDNA monitoring information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cancer-type">Cancer Type</Label>
                  <Select value={selectedCancer} onValueChange={setSelectedCancer}>
                    <SelectTrigger id="cancer-type">
                      <SelectValue placeholder="Select cancer type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nsclc">Non-Small Cell Lung Cancer</SelectItem>
                      <SelectItem value="melanoma">Melanoma</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="treatment">Current Treatment</Label>
                  <Select value={selectedTreatment} onValueChange={setSelectedTreatment}>
                    <SelectTrigger id="treatment">
                      <SelectValue placeholder="Select treatment" />
                    </SelectTrigger>
                    <SelectContent>
                      {treatmentOptions[selectedCancer]?.map((treatment) => (
                        <SelectItem key={treatment.id} value={treatment.id}>
                          {treatment.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timepoint">Months on Treatment</Label>
                  <Select value={selectedTimepoint} onValueChange={setSelectedTimepoint}>
                    <SelectTrigger id="timepoint">
                      <SelectValue placeholder="Select timepoint" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 months</SelectItem>
                      <SelectItem value="4">4 months</SelectItem>
                      <SelectItem value="6">6 months</SelectItem>
                      <SelectItem value="8">8 months</SelectItem>
                      <SelectItem value="10">10 months</SelectItem>
                      <SelectItem value="12">12 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 pt-2">
                  <h3 className="text-sm font-medium mb-2">Initial Molecular Profile</h3>
                  <div className="rounded-md border p-3 bg-muted/50">
                    <div className="space-y-2">
                      <div>
                        <h4 className="text-xs font-medium text-muted-foreground">Driver Mutation:</h4>
                        <p className="text-sm">EGFR Exon 19 Deletion</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-medium text-muted-foreground">Co-mutations:</h4>
                        <p className="text-sm">TP53 R273H, CDKN2A loss</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-medium text-muted-foreground">Initial ctDNA Level:</h4>
                        <p className="text-sm">5.2% VAF (3.8% tumor fraction)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">ctDNA Monitoring Data</CardTitle>
                <CardDescription>Longitudinal ctDNA measurements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <LineChart
                    data={ctDNAData}
                    categories={["vaf", "tumorFraction"]}
                    index="month"
                    colors={["#ef4444", "#3b82f6"]}
                    valueFormatter={(value) => `${value}%`}
                    showLegend={true}
                    showXAxis={true}
                    showYAxis={true}
                    yAxisWidth={40}
                  />
                </div>
                <div className="text-center text-sm text-muted-foreground mt-2">Time on Treatment (months)</div>

                <div className="mt-4 space-y-2">
                  <Label htmlFor="upload-data">Upload Additional ctDNA Data</Label>
                  <Input id="upload-data" type="file" />
                  <p className="text-xs text-muted-foreground">
                    Supported formats: CSV, Excel with columns for timepoint, gene, variant, and VAF
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={handleReset} disabled={isLoading}>
              <RefreshCw className="h-4 w-4 mr-2" /> Reset
            </Button>
            <Button onClick={handlePrediction} disabled={isLoading}>
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Processing...
                </>
              ) : (
                <>
                  <Microscope className="h-4 w-4 mr-2" /> Predict Resistance
                </>
              )}
            </Button>
          </div>

          {resultsVisible && (
            <div className="space-y-6">
              <Card className="border-red-200 dark:border-red-800">
                <CardHeader className="bg-red-50 dark:bg-red-900/20">
                  <CardTitle className="text-lg">Resistance Prediction Results</CardTitle>
                  <CardDescription>Predicted resistance mechanisms and timeline</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800">
                      <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      <AlertTitle className="text-amber-600 dark:text-amber-400">Early Resistance Detected</AlertTitle>
                      <AlertDescription className="text-amber-700 dark:text-amber-300">
                        The model has detected early signs of resistance emergence. Two resistance mechanisms have been
                        identified with high confidence.
                      </AlertDescription>
                    </Alert>

                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Gene</TableHead>
                            <TableHead>Mutation</TableHead>
                            <TableHead>Current VAF</TableHead>
                            <TableHead>First Detected</TableHead>
                            <TableHead>Trend</TableHead>
                            <TableHead>Mechanism</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {resistanceMutations.map((mutation, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{mutation.gene}</TableCell>
                              <TableCell>{mutation.mutation}</TableCell>
                              <TableCell>{mutation.vaf}%</TableCell>
                              <TableCell>{mutation.firstDetected}</TableCell>
                              <TableCell>
                                <Badge
                                  className={
                                    mutation.trend === "increasing"
                                      ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                      : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                                  }
                                >
                                  <TrendingUp className="h-3 w-3 mr-1" />
                                  {mutation.trend.charAt(0).toUpperCase() + mutation.trend.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell>{mutation.mechanism}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Resistance Timeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-amber-500" />
                                <span className="text-sm">First Detection</span>
                              </div>
                              <span className="text-sm font-medium">Month 10</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 text-red-500" />
                                <span className="text-sm">Predicted Clinical Progression</span>
                              </div>
                              <span className="text-sm font-medium">Month 14-16</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-green-500" />
                                <span className="text-sm">Lead Time</span>
                              </div>
                              <span className="text-sm font-medium">4-6 months</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Resistance Confidence</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">EGFR T790M</span>
                                <span className="text-sm font-medium">85%</span>
                              </div>
                              <Progress value={85} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">MET Amplification</span>
                                <span className="text-sm font-medium">78%</span>
                              </div>
                              <Progress value={78} className="h-2" />
                            </div>
                            <div className="pt-2 text-xs text-muted-foreground">
                              Confidence scores represent the model's certainty in the resistance mechanism prediction
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Recommended Action</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-start gap-2">
                              <Dna className="h-4 w-4 text-blue-500 mt-1" />
                              <div>
                                <p className="text-sm font-medium">Increase Monitoring Frequency</p>
                                <p className="text-xs text-muted-foreground">
                                  Increase ctDNA monitoring to monthly intervals
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <Microscope className="h-4 w-4 text-purple-500 mt-1" />
                              <div>
                                <p className="text-sm font-medium">Tissue Biopsy</p>
                                <p className="text-xs text-muted-foreground">
                                  Consider tissue biopsy to confirm resistance mechanisms
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <Pill className="h-4 w-4 text-green-500 mt-1" />
                              <div>
                                <p className="text-sm font-medium">Treatment Adjustment</p>
                                <p className="text-xs text-muted-foreground">
                                  Consider treatment modification before clinical progression
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Tabs defaultValue="mechanisms" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="mechanisms">Resistance Mechanisms</TabsTrigger>
                  <TabsTrigger value="therapies">Alternative Therapies</TabsTrigger>
                  <TabsTrigger value="monitoring">Monitoring Plan</TabsTrigger>
                </TabsList>

                <TabsContent value="mechanisms">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Resistance Mechanisms</CardTitle>
                      <CardDescription>Detailed explanation of predicted resistance mechanisms</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-red-100 text-red-800">Primary Mechanism</Badge>
                            <h3 className="font-medium">EGFR T790M Mutation</h3>
                          </div>
                          <p className="mt-2 text-sm">
                            The T790M mutation in the EGFR gene is a common resistance mechanism to first and
                            second-generation EGFR TKIs. It occurs in approximately 50-60% of patients with acquired
                            resistance to erlotinib, gefitinib, or afatinib.
                          </p>
                          <div className="mt-3 space-y-2">
                            <div className="flex items-start gap-2">
                              <Dna className="h-4 w-4 text-red-500 mt-1" />
                              <div>
                                <p className="text-sm font-medium">Molecular Mechanism</p>
                                <p className="text-xs text-muted-foreground">
                                  The T790M mutation increases the affinity of EGFR for ATP, reducing the binding of
                                  first and second-generation TKIs.
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <Pill className="h-4 w-4 text-red-500 mt-1" />
                              <div>
                                <p className="text-sm font-medium">Treatment Implications</p>
                                <p className="text-xs text-muted-foreground">
                                  Third-generation EGFR TKIs like osimertinib are effective against T790M-positive
                                  tumors.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-amber-100 text-amber-800">Secondary Mechanism</Badge>
                            <h3 className="font-medium">MET Amplification</h3>
                          </div>
                          <p className="mt-2 text-sm">
                            MET amplification is a bypass pathway mechanism that occurs in approximately 5-20% of
                            patients with acquired resistance to EGFR TKIs. It can co-occur with T790M or be an
                            independent resistance mechanism.
                          </p>
                          <div className="mt-3 space-y-2">
                            <div className="flex items-start gap-2">
                              <Dna className="h-4 w-4 text-amber-500 mt-1" />
                              <div>
                                <p className="text-sm font-medium">Molecular Mechanism</p>
                                <p className="text-xs text-muted-foreground">
                                  MET amplification activates ERBB3/PI3K/AKT signaling, bypassing EGFR inhibition and
                                  promoting cell survival.
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <Pill className="h-4 w-4 text-amber-500 mt-1" />
                              <div>
                                <p className="text-sm font-medium">Treatment Implications</p>
                                <p className="text-xs text-muted-foreground">
                                  MET inhibitors (tepotinib, savolitinib) in combination with EGFR TKIs may overcome
                                  this resistance mechanism.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="therapies">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Alternative Therapy Options</CardTitle>
                      <CardDescription>Recommended therapeutic strategies to address resistance</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Alert>
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Therapeutic Strategy</AlertTitle>
                          <AlertDescription>
                            Based on the predicted resistance mechanisms, the following therapeutic strategies are
                            recommended:
                          </AlertDescription>
                        </Alert>

                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Strategy</TableHead>
                                <TableHead>Drugs</TableHead>
                                <TableHead>Target</TableHead>
                                <TableHead>Evidence</TableHead>
                                <TableHead>Predicted Response</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell className="font-medium">First Choice</TableCell>
                                <TableCell>Osimertinib + Savolitinib</TableCell>
                                <TableCell>EGFR T790M + MET</TableCell>
                                <TableCell>TATTON Phase 1b trial</TableCell>
                                <TableCell>
                                  <Badge className="bg-green-100 text-green-800">70%</Badge>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">Alternative</TableCell>
                                <TableCell>Osimertinib + Tepotinib</TableCell>
                                <TableCell>EGFR T790M + MET</TableCell>
                                <TableCell>INSIGHT 2 trial</TableCell>
                                <TableCell>
                                  <Badge className="bg-green-100 text-green-800">65%</Badge>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">Clinical Trial</TableCell>
                                <TableCell>Amivantamab</TableCell>
                                <TableCell>EGFR + MET bispecific</TableCell>
                                <TableCell>CHRYSALIS trial</TableCell>
                                <TableCell>
                                  <Badge className="bg-amber-100 text-amber-800">55%</Badge>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">Salvage</TableCell>
                                <TableCell>Platinum-based Chemotherapy</TableCell>
                                <TableCell>Cytotoxic</TableCell>
                                <TableCell>Standard of care</TableCell>
                                <TableCell>
                                  <Badge className="bg-amber-100 text-amber-800">40%</Badge>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>

                        <div className="pt-4">
                          <h3 className="text-lg font-medium mb-2">Clinical Trial Opportunities</h3>
                          <div className="space-y-3">
                            <div className="p-3 border rounded-lg">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium">ORCHARD Trial</h4>
                                <Badge>Recruiting</Badge>
                              </div>
                              <p className="text-sm mt-1">
                                A biomarker-directed platform study for patients with EGFR mutation-positive advanced
                                non-small cell lung cancer who have progressed on first-line osimertinib therapy.
                              </p>
                              <Button variant="link" className="px-0 h-auto text-sm">
                                View Details
                              </Button>
                            </div>

                            <div className="p-3 border rounded-lg">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium">SAVANNAH Trial</h4>
                                <Badge>Recruiting</Badge>
                              </div>
                              <p className="text-sm mt-1">
                                A study of savolitinib plus osimertinib in patients with EGFR-mutant, MET-amplified
                                non-small cell lung cancer following progression on osimertinib.
                              </p>
                              <Button variant="link" className="px-0 h-auto text-sm">
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="monitoring">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Monitoring Plan</CardTitle>
                      <CardDescription>Recommended monitoring strategy to track resistance evolution</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <h3 className="font-medium">ctDNA Monitoring</h3>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm">Current Frequency</span>
                                <span className="text-sm">Every 2 months</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm">Recommended Frequency</span>
                                <Badge className="bg-red-100 text-red-800">Monthly</Badge>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm">Next Collection</span>
                                <span className="text-sm font-medium">May 15, 2025</span>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Increased monitoring frequency is recommended to track the evolution of resistance
                              mutations and guide timely therapeutic interventions.
                            </p>
                          </div>

                          <div className="space-y-3">
                            <h3 className="font-medium">Imaging</h3>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm">Current Frequency</span>
                                <span className="text-sm">Every 3 months</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm">Recommended Frequency</span>
                                <span className="text-sm">Every 2 months</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm">Next Scan</span>
                                <span className="text-sm font-medium">June 1, 2025</span>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              More frequent imaging is recommended to detect radiographic progression that may correlate
                              with the molecular changes observed in ctDNA.
                            </p>
                          </div>
                        </div>

                        <div className="pt-2">
                          <h3 className="font-medium mb-2">Comprehensive Monitoring Schedule</h3>
                          <div className="rounded-md border">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Date</TableHead>
                                  <TableHead>ctDNA Collection</TableHead>
                                  <TableHead>Imaging</TableHead>
                                  <TableHead>Clinical Assessment</TableHead>
                                  <TableHead>Action</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                <TableRow>
                                  <TableCell>May 15, 2025</TableCell>
                                  <TableCell>
                                    <Badge variant="outline" className="bg-green-100 text-green-800">
                                      Scheduled
                                    </Badge>
                                  </TableCell>
                                  <TableCell>-</TableCell>
                                  <TableCell>
                                    <Badge variant="outline" className="bg-green-100 text-green-800">
                                      Scheduled
                                    </Badge>
                                  </TableCell>
                                  <TableCell>Review ctDNA results</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>June 1, 2025</TableCell>
                                  <TableCell>-</TableCell>
                                  <TableCell>
                                    <Badge variant="outline" className="bg-green-100 text-green-800">
                                      Scheduled
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant="outline" className="bg-green-100 text-green-800">
                                      Scheduled
                                    </Badge>
                                  </TableCell>
                                  <TableCell>Evaluate for treatment change</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>June 15, 2025</TableCell>
                                  <TableCell>
                                    <Badge variant="outline" className="bg-green-100 text-green-800">
                                      Scheduled
                                    </Badge>
                                  </TableCell>
                                  <TableCell>-</TableCell>
                                  <TableCell>-</TableCell>
                                  <TableCell>Monitor resistance evolution</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>July 15, 2025</TableCell>
                                  <TableCell>
                                    <Badge variant="outline" className="bg-green-100 text-green-800">
                                      Scheduled
                                    </Badge>
                                  </TableCell>
                                  <TableCell>-</TableCell>
                                  <TableCell>
                                    <Badge variant="outline" className="bg-green-100 text-green-800">
                                      Scheduled
                                    </Badge>
                                  </TableCell>
                                  <TableCell>Assess new therapy response</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" className="gap-1">
            <FileText className="h-4 w-4" /> Model Documentation
          </Button>
          {resultsVisible && (
            <Button className="gap-1">
              <Download className="h-4 w-4" /> Download Report
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
