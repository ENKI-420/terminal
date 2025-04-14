"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart } from "@/components/charts"
import {
  Activity,
  Info,
  FileText,
  RefreshCw,
  Download,
  ChevronDown,
  ChevronUp,
  Dna,
  Microscope,
  Lightbulb,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"

export function SurvivalPredictionModel() {
  const [isLoading, setIsLoading] = useState(false)
  const [resultsVisible, setResultsVisible] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [patientData, setPatientData] = useState({
    age: 65,
    gender: "female",
    stage: "III",
    histology: "adenocarcinoma",
    smokingStatus: "former",
    performanceStatus: "1",
    tumorMutationBurden: 8.5,
    pdl1Expression: 25,
  })

  // Mock survival curve data
  const survivalData = [
    { month: 0, survival: 100, lowerCI: 100, upperCI: 100 },
    { month: 6, survival: 92, lowerCI: 88, upperCI: 96 },
    { month: 12, survival: 85, lowerCI: 79, upperCI: 91 },
    { month: 18, survival: 78, lowerCI: 71, upperCI: 85 },
    { month: 24, survival: 72, lowerCI: 64, upperCI: 80 },
    { month: 30, survival: 67, lowerCI: 58, upperCI: 76 },
    { month: 36, survival: 63, lowerCI: 53, upperCI: 73 },
    { month: 42, survival: 59, lowerCI: 48, upperCI: 70 },
    { month: 48, survival: 56, lowerCI: 44, upperCI: 68 },
    { month: 54, survival: 53, lowerCI: 41, upperCI: 65 },
    { month: 60, survival: 51, lowerCI: 38, upperCI: 64 },
  ]

  // Mock feature importance data
  const featureImportanceData = [
    { feature: "Stage", importance: 0.28 },
    { feature: "Performance Status", importance: 0.22 },
    { feature: "Tumor Mutation Burden", importance: 0.18 },
    { feature: "PD-L1 Expression", importance: 0.15 },
    { feature: "Age", importance: 0.08 },
    { feature: "Smoking Status", importance: 0.05 },
    { feature: "Histology", importance: 0.03 },
    { feature: "Gender", importance: 0.01 },
  ]

  const handleInputChange = (field: string, value: any) => {
    setPatientData({
      ...patientData,
      [field]: value,
    })
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
    setPatientData({
      age: 65,
      gender: "female",
      stage: "III",
      histology: "adenocarcinoma",
      smokingStatus: "former",
      performanceStatus: "1",
      tumorMutationBurden: 8.5,
      pdl1Expression: 25,
    })
  }

  const handleUseExample = () => {
    setPatientData({
      age: 58,
      gender: "male",
      stage: "IV",
      histology: "squamous",
      smokingStatus: "current",
      performanceStatus: "1",
      tumorMutationBurden: 12.3,
      pdl1Expression: 60,
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Activity className="h-6 w-6 text-blue-500" />
                Survival Prediction Model
              </CardTitle>
              <CardDescription>
                Predicts patient survival probability based on clinical and genomic features
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                93% Accuracy
              </Badge>
              <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                0.91 C-index
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
            <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
              <Lightbulb className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertTitle className="text-blue-600 dark:text-blue-400">About This Model</AlertTitle>
              <AlertDescription className="text-blue-700 dark:text-blue-300">
                <p className="mb-2">
                  This survival prediction model uses a Cox Proportional Hazards model with an XGBoost algorithm to
                  predict patient survival probability over time.
                </p>
                <p className="mb-2">
                  <span className="font-medium">Training Data:</span> The model was trained on a dataset of 15,000
                  non-small cell lung cancer patients with complete clinical and genomic profiles.
                </p>
                <p className="mb-2">
                  <span className="font-medium">Validation:</span> External validation on 3,000 patients achieved a
                  C-index of 0.91, indicating excellent discriminative ability.
                </p>
                <p>
                  <span className="font-medium">Key Features:</span> The model incorporates clinical factors (age,
                  stage, performance status) and molecular biomarkers (tumor mutation burden, PD-L1 expression) to
                  generate personalized survival curves.
                </p>
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Patient Information</CardTitle>
                <CardDescription>Enter clinical characteristics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={patientData.age}
                      onChange={(e) => handleInputChange("age", Number.parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={patientData.gender}
                      onValueChange={(value) => handleInputChange("gender", value)}
                    >
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stage">Cancer Stage</Label>
                    <Select value={patientData.stage} onValueChange={(value) => handleInputChange("stage", value)}>
                      <SelectTrigger id="stage">
                        <SelectValue placeholder="Select stage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="I">Stage I</SelectItem>
                        <SelectItem value="II">Stage II</SelectItem>
                        <SelectItem value="III">Stage III</SelectItem>
                        <SelectItem value="IV">Stage IV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="histology">Histology</Label>
                    <Select
                      value={patientData.histology}
                      onValueChange={(value) => handleInputChange("histology", value)}
                    >
                      <SelectTrigger id="histology">
                        <SelectValue placeholder="Select histology" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="adenocarcinoma">Adenocarcinoma</SelectItem>
                        <SelectItem value="squamous">Squamous Cell</SelectItem>
                        <SelectItem value="large-cell">Large Cell</SelectItem>
                        <SelectItem value="small-cell">Small Cell</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smoking">Smoking Status</Label>
                    <Select
                      value={patientData.smokingStatus}
                      onValueChange={(value) => handleInputChange("smokingStatus", value)}
                    >
                      <SelectTrigger id="smoking">
                        <SelectValue placeholder="Select smoking status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="never">Never Smoker</SelectItem>
                        <SelectItem value="former">Former Smoker</SelectItem>
                        <SelectItem value="current">Current Smoker</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="performance">ECOG Performance Status</Label>
                    <Select
                      value={patientData.performanceStatus}
                      onValueChange={(value) => handleInputChange("performanceStatus", value)}
                    >
                      <SelectTrigger id="performance">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0 - Fully active</SelectItem>
                        <SelectItem value="1">1 - Restricted activity</SelectItem>
                        <SelectItem value="2">2 - Ambulatory</SelectItem>
                        <SelectItem value="3">3 - Limited self-care</SelectItem>
                        <SelectItem value="4">4 - Completely disabled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Molecular Biomarkers</CardTitle>
                <CardDescription>Enter genomic and proteomic data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="tmb">Tumor Mutation Burden (mut/Mb)</Label>
                      <span className="text-sm font-medium">{patientData.tumorMutationBurden}</span>
                    </div>
                    <Slider
                      id="tmb"
                      min={0}
                      max={40}
                      step={0.1}
                      value={[patientData.tumorMutationBurden]}
                      onValueChange={(value) => handleInputChange("tumorMutationBurden", value[0])}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Low</span>
                      <span>Medium</span>
                      <span>High</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="pdl1">PD-L1 Expression (%)</Label>
                      <span className="text-sm font-medium">{patientData.pdl1Expression}%</span>
                    </div>
                    <Slider
                      id="pdl1"
                      min={0}
                      max={100}
                      step={1}
                      value={[patientData.pdl1Expression]}
                      onValueChange={(value) => handleInputChange("pdl1Expression", value[0])}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">\
                      <span>Negative (<1%)</span>
                      <span>Low (1-49%)</span>
                      <span>High (≥50%)</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="genomic-signatures" className="text-base font-medium">
                        Genomic Signatures
                      </Label>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="msi" />
                        <Label htmlFor="msi">Microsatellite Instability (MSI-H)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="hrd" />
                        <Label htmlFor="hrd">Homologous Recombination Deficiency</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="apobec" />
                        <Label htmlFor="apobec">APOBEC Signature</Label>
                      </div>
                    </div>
                  </div>
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
                  <Activity className="h-4 w-4 mr-2" /> Generate Survival Prediction
                </>
              )}
            </Button>
          </div>

          {resultsVisible && (
            <div className="space-y-6">
              <Card className="border-blue-200 dark:border-blue-800">
                <CardHeader className="bg-blue-50 dark:bg-blue-900/20">
                  <CardTitle className="text-lg">Survival Prediction Results</CardTitle>
                  <CardDescription>Personalized survival probability over time</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <div className="h-[300px]">
                        <LineChart
                          data={survivalData}
                          categories={["survival"]}
                          index="month"
                          colors={["#2563eb"]}
                          valueFormatter={(value) => `${value}%`}
                          showLegend={false}
                          showXAxis={true}
                          showYAxis={true}
                          yAxisWidth={40}
                        />
                      </div>
                      <div className="text-center text-sm text-muted-foreground mt-2">
                        Time (months)
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="font-medium">Median Survival</h3>
                        <div className="text-3xl font-bold">42.5 months</div>
                        <p className="text-sm text-muted-foreground">95% CI: 36.2 - 48.8 months</p>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-medium">5-Year Survival Probability</h3>
                        <div className="text-3xl font-bold">51%</div>
                        <p className="text-sm text-muted-foreground">95% CI: 38% - 64%</p>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-medium">Risk Category</h3>
                        <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                          Intermediate Risk
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Tabs defaultValue="features" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="features">Feature Importance</TabsTrigger>
                  <TabsTrigger value="similar">Similar Patients</TabsTrigger>
                  <TabsTrigger value="recommendations">Clinical Recommendations</TabsTrigger>
                </TabsList>

                <TabsContent value="features">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Feature Importance</CardTitle>
                      <CardDescription>
                        Relative contribution of each feature to the survival prediction
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {featureImportanceData.map((feature) => (
                          <div key={feature.feature} className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{feature.feature}</span>
                              <span className="text-sm">{(feature.importance * 100).toFixed(1)}%</span>
                            </div>
                            <Progress value={feature.importance * 100} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="similar">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Similar Patient Cohort</CardTitle>
                      <CardDescription>
                        Outcomes from patients with similar clinical and genomic profiles
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="rounded-md border">
                          <table className="min-w-full divide-y divide-border">
                            <thead>
                              <tr className="bg-muted/50">
                                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                  Patient ID
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                  Age
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                  Stage
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                  TMB
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                  PD-L1
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                  Survival
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-card divide-y divide-border">
                              <tr>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">PT-10284</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">63</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">III</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">9.2</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">30%</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">48 months</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">PT-08753</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">67</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">III</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">7.8</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">20%</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">39 months</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">PT-12456</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">61</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">III</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">8.9</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">35%</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">52 months</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">PT-09321</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">70</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">III</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">7.5</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">15%</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">36 months</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">PT-11578</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">64</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">III</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">9.0</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">28%</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">45 months</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="recommendations">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Clinical Recommendations</CardTitle>
                      <CardDescription>
                        AI-generated suggestions based on survival prediction
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Alert>
                          <Info className="h-4 w-4" />
                          <AlertTitle>Intermediate Risk Profile</AlertTitle>
                          <AlertDescription>
                            This patient has an intermediate risk profile with a 51% 5-year survival probability.
                            Consider the following recommendations:
                          </AlertDescription>
                        </Alert>

                        <div className="space-y-3">
                          <div className="flex items-start gap-2">
                            <div className="mt-1 bg-blue-100 dark:bg-blue-900/30 p-1 rounded-full">
                              <Microscope className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <h4 className="font-medium">Comprehensive Genomic Profiling</h4>
                              <p className="text-sm text-muted-foreground">
                                Consider comprehensive genomic profiling to identify actionable mutations that may
                                guide targeted therapy selection.
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <div className="mt-1 bg-blue-100 dark:bg-blue-900/30 p-1 rounded-full">
                              <Dna className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <h4 className="font-medium">Immunotherapy Consideration</h4>
                              <p className="text-sm text-muted-foreground">
                                With a PD-L1 expression of 25%, consider immunotherapy as part of the treatment
                                regimen, potentially in combination with chemotherapy.
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <div className="mt-1 bg-blue-100 dark:bg-blue-900/30 p-1 rounded-full">
                              <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <h4 className="font-medium">Monitoring Schedule</h4>
                              <p className="text-sm text-muted-foreground">
                                Implement a more intensive monitoring schedule with imaging every 2-3 months and
                                consideration of ctDNA monitoring for early detection of recurrence.
                              </p>
                            </div>
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
            <Info className="h-4 w-4" /> Model Documentation
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
