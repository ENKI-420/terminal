"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FlaskRoundIcon as Flask,
  FileText,
  RefreshCw,
  Download,
  ChevronDown,
  ChevronUp,
  Pill,
  CheckCircle,
  XCircle,
  AlertCircle,
  Lightbulb,
  BarChart,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"

export function TreatmentResponseModel() {
  const [isLoading, setIsLoading] = useState(false)
  const [resultsVisible, setResultsVisible] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [selectedCancer, setSelectedCancer] = useState("nsclc")
  const [selectedTreatment, setSelectedTreatment] = useState("immunotherapy")
  const [selectedProfile, setSelectedProfile] = useState("profile1")

  // Mock genomic profiles
  const genomicProfiles = {
    nsclc: [
      {
        id: "profile1",
        name: "EGFR Mutant (L858R)",
        description: "EGFR L858R mutation, PD-L1 5%, TMB 4.2 mut/Mb",
        mutations: ["EGFR L858R", "TP53 R273H"],
        cnvs: ["MYC amplification"],
        signatures: ["Smoking signature"],
      },
      {
        id: "profile2",
        name: "ALK Fusion",
        description: "EML4-ALK fusion, PD-L1 10%, TMB 3.1 mut/Mb",
        mutations: ["TP53 R175H"],
        cnvs: ["ALK rearrangement"],
        signatures: ["APOBEC signature"],
      },
      {
        id: "profile3",
        name: "KRAS G12C",
        description: "KRAS G12C mutation, PD-L1 60%, TMB 12.5 mut/Mb",
        mutations: ["KRAS G12C", "STK11 loss", "KEAP1 mutation"],
        cnvs: ["CDKN2A/B loss"],
        signatures: ["Smoking signature"],
      },
    ],
    melanoma: [
      {
        id: "profile1",
        name: "BRAF V600E",
        description: "BRAF V600E mutation, PD-L1 25%, TMB 15.3 mut/Mb",
        mutations: ["BRAF V600E", "PTEN loss"],
        cnvs: ["MITF amplification"],
        signatures: ["UV signature"],
      },
      {
        id: "profile2",
        name: "NRAS Q61K",
        description: "NRAS Q61K mutation, PD-L1 40%, TMB 18.7 mut/Mb",
        mutations: ["NRAS Q61K", "TP53 R248W"],
        cnvs: ["CDKN2A loss"],
        signatures: ["UV signature"],
      },
    ],
    colorectal: [
      {
        id: "profile1",
        name: "MSI-High",
        description: "MSI-High, PD-L1 30%, TMB 45.2 mut/Mb",
        mutations: ["MLH1 loss", "MSH2 loss", "BRAF V600E"],
        cnvs: ["HER2 amplification"],
        signatures: ["MMR deficiency"],
      },
      {
        id: "profile2",
        name: "RAS/RAF Wild-type",
        description: "KRAS/NRAS/BRAF wild-type, PD-L1 5%, TMB 6.3 mut/Mb",
        mutations: ["APC truncating", "TP53 R175H"],
        cnvs: ["ERBB2 amplification"],
        signatures: ["Aging signature"],
      },
    ],
  }

  // Mock treatment options
  const treatmentOptions = {
    nsclc: [
      { id: "targeted", name: "Targeted Therapy" },
      { id: "immunotherapy", name: "Immunotherapy" },
      { id: "chemo", name: "Chemotherapy" },
      { id: "combo", name: "Chemo-Immunotherapy Combination" },
    ],
    melanoma: [
      { id: "targeted", name: "BRAF/MEK Inhibitors" },
      { id: "immunotherapy", name: "Immunotherapy" },
      { id: "combo", name: "Targeted + Immunotherapy" },
    ],
    colorectal: [
      { id: "targeted", name: "EGFR Inhibitors" },
      { id: "chemo", name: "Chemotherapy" },
      { id: "immunotherapy", name: "Immunotherapy (MSI-H)" },
    ],
  }

  // Mock response predictions
  const responsePredictions = {
    nsclc: {
      profile1: {
        targeted: {
          probability: 0.85,
          confidence: "high",
          biomarkers: [
            { name: "EGFR L858R", impact: "positive", strength: "strong" },
            { name: "TP53 R273H", impact: "negative", strength: "moderate" },
          ],
          recommendation: "Osimertinib",
          evidence: "FLAURA trial showed superior PFS with osimertinib vs. first-generation EGFR TKIs",
        },
        immunotherapy: {
          probability: 0.15,
          confidence: "high",
          biomarkers: [
            { name: "PD-L1 5%", impact: "negative", strength: "strong" },
            { name: "TMB 4.2 mut/Mb", impact: "negative", strength: "strong" },
            { name: "EGFR mutation", impact: "negative", strength: "strong" },
          ],
          recommendation: "Not recommended as monotherapy",
          evidence: "Multiple studies show poor response to immunotherapy in EGFR-mutant NSCLC",
        },
        chemo: {
          probability: 0.45,
          confidence: "moderate",
          biomarkers: [{ name: "EGFR L858R", impact: "neutral", strength: "moderate" }],
          recommendation: "Pemetrexed-based regimen if TKI resistance develops",
          evidence: "Standard of care for EGFR TKI resistance",
        },
        combo: {
          probability: 0.35,
          confidence: "moderate",
          biomarkers: [
            { name: "EGFR L858R", impact: "negative", strength: "strong" },
            { name: "PD-L1 5%", impact: "negative", strength: "moderate" },
          ],
          recommendation: "Not recommended",
          evidence: "Increased toxicity without improved efficacy in EGFR-mutant NSCLC",
        },
      },
      profile3: {
        targeted: {
          probability: 0.75,
          confidence: "high",
          biomarkers: [
            { name: "KRAS G12C", impact: "positive", strength: "strong" },
            { name: "STK11 loss", impact: "neutral", strength: "moderate" },
          ],
          recommendation: "Sotorasib or Adagrasib",
          evidence: "CodeBreaK 100 and KRYSTAL-1 trials showed efficacy in KRAS G12C mutant NSCLC",
        },
        immunotherapy: {
          probability: 0.4,
          confidence: "moderate",
          biomarkers: [
            { name: "PD-L1 60%", impact: "positive", strength: "strong" },
            { name: "TMB 12.5 mut/Mb", impact: "positive", strength: "moderate" },
            { name: "STK11 loss", impact: "negative", strength: "strong" },
            { name: "KEAP1 mutation", impact: "negative", strength: "moderate" },
          ],
          recommendation: "Consider, but with caution",
          evidence: "High PD-L1 favorable, but STK11/KEAP1 mutations predict resistance",
        },
        chemo: {
          probability: 0.5,
          confidence: "moderate",
          biomarkers: [{ name: "KRAS G12C", impact: "neutral", strength: "weak" }],
          recommendation: "Standard platinum-based chemotherapy",
          evidence: "Standard of care for KRAS-mutant NSCLC",
        },
        combo: {
          probability: 0.6,
          confidence: "moderate",
          biomarkers: [
            { name: "KRAS G12C", impact: "positive", strength: "moderate" },
            { name: "PD-L1 60%", impact: "positive", strength: "strong" },
            { name: "STK11 loss", impact: "negative", strength: "strong" },
          ],
          recommendation: "Consider platinum-pemetrexed-pembrolizumab",
          evidence: "KEYNOTE-189 showed benefit regardless of KRAS status, but STK11 may reduce efficacy",
        },
      },
    },
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
    setSelectedProfile("profile3")
    setSelectedTreatment("immunotherapy")
  }

  // Get current profile data
  const getCurrentProfile = () => {
    return (
      genomicProfiles[selectedCancer]?.find((profile) => profile.id === selectedProfile) || genomicProfiles.nsclc[0]
    )
  }

  // Get current prediction
  const getCurrentPrediction = () => {
    try {
      return responsePredictions[selectedCancer][selectedProfile][selectedTreatment]
    } catch (e) {
      // Return default if not found
      return {
        probability: 0.5,
        confidence: "moderate",
        biomarkers: [],
        recommendation: "Insufficient data",
        evidence: "Not enough data to make a specific recommendation",
      }
    }
  }

  const profile = getCurrentProfile()
  const prediction = resultsVisible ? getCurrentPrediction() : null

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Flask className="h-6 w-6 text-green-500" />
                Treatment Response Prediction Model
              </CardTitle>
              <CardDescription>
                Predicts response to specific therapies based on tumor molecular profile
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                89% Accuracy
              </Badge>
              <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                0.85 AUC
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
            <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
              <Lightbulb className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertTitle className="text-green-600 dark:text-green-400">About This Model</AlertTitle>
              <AlertDescription className="text-green-700 dark:text-green-300">
                <p className="mb-2">
                  This treatment response prediction model uses a gradient-boosted decision tree algorithm to predict
                  the probability of response to specific cancer therapies based on a tumor's molecular profile.
                </p>
                <p className="mb-2">
                  <span className="font-medium">Training Data:</span> The model was trained on data from 25,000 patients
                  across multiple cancer types with known treatment outcomes and comprehensive molecular profiling.
                </p>
                <p className="mb-2">
                  <span className="font-medium">Validation:</span> External validation on 5,000 patients achieved an AUC
                  of 0.85 and accuracy of 89% for predicting objective response.
                </p>
                <p>
                  <span className="font-medium">Key Features:</span> The model incorporates driver mutations, copy
                  number alterations, gene expression signatures, tumor mutation burden, and other biomarkers to
                  generate personalized treatment recommendations.
                </p>
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cancer Type & Molecular Profile</CardTitle>
                <CardDescription>Select cancer type and genomic profile</CardDescription>
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
                      <SelectItem value="colorectal">Colorectal Cancer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="genomic-profile">Genomic Profile</Label>
                  <Select value={selectedProfile} onValueChange={setSelectedProfile}>
                    <SelectTrigger id="genomic-profile">
                      <SelectValue placeholder="Select genomic profile" />
                    </SelectTrigger>
                    <SelectContent>
                      {genomicProfiles[selectedCancer]?.map((profile) => (
                        <SelectItem key={profile.id} value={profile.id}>
                          {profile.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 pt-2">
                  <h3 className="text-sm font-medium mb-2">Selected Profile Details</h3>
                  <div className="rounded-md border p-3 bg-muted/50">
                    <p className="text-sm">{profile.description}</p>

                    <div className="mt-3 space-y-2">
                      <div>
                        <h4 className="text-xs font-medium text-muted-foreground">Key Mutations:</h4>
                        <p className="text-sm">{profile.mutations.join(", ")}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-medium text-muted-foreground">Copy Number Alterations:</h4>
                        <p className="text-sm">{profile.cnvs.join(", ")}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-medium text-muted-foreground">Mutational Signatures:</h4>
                        <p className="text-sm">{profile.signatures.join(", ")}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Treatment Options</CardTitle>
                <CardDescription>Select therapy to predict response</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="treatment">Treatment Type</Label>
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

                <div className="space-y-2 pt-2">
                  <h3 className="text-sm font-medium mb-2">Additional Clinical Factors</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="prior-treatment" />
                      <Label htmlFor="prior-treatment">Prior treatment with same class</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="brain-mets" />
                      <Label htmlFor="brain-mets">Brain metastases present</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="liver-mets" />
                      <Label htmlFor="liver-mets">Liver metastases present</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="treatment-settings" className="text-base font-medium">
                      Treatment Settings
                    </Label>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="first-line" className="text-sm">
                        First-line therapy
                      </Label>
                      <Switch id="first-line" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="combination" className="text-sm">
                        Consider combinations
                      </Label>
                      <Switch id="combination" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="clinical-trials" className="text-sm">
                        Include clinical trials
                      </Label>
                      <Switch id="clinical-trials" />
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
                  <Flask className="h-4 w-4 mr-2" /> Predict Response
                </>
              )}
            </Button>
          </div>

          {resultsVisible && prediction && (
            <div className="space-y-6">
              <Card className="border-green-200 dark:border-green-800">
                <CardHeader className="bg-green-50 dark:bg-green-900/20">
                  <CardTitle className="text-lg">Treatment Response Prediction</CardTitle>
                  <CardDescription>Predicted response to selected therapy</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                      <div className="flex flex-col items-center">
                        <div className="relative h-32 w-32">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-3xl font-bold">{Math.round(prediction.probability * 100)}%</span>
                          </div>
                          <svg className="h-32 w-32" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                            <circle
                              cx="50"
                              cy="50"
                              r="45"
                              fill="none"
                              stroke={prediction.probability > 0.5 ? "#22c55e" : "#ef4444"}
                              strokeWidth="10"
                              strokeDasharray="283"
                              strokeDashoffset={283 - 283 * prediction.probability}
                              transform="rotate(-90 50 50)"
                            />
                          </svg>
                        </div>
                        <p className="text-sm font-medium mt-2">Response Probability</p>
                        <Badge
                          className={
                            prediction.confidence === "high"
                              ? "bg-green-100 text-green-800 mt-1"
                              : "bg-amber-100 text-amber-800 mt-1"
                          }
                        >
                          {prediction.confidence.charAt(0).toUpperCase() + prediction.confidence.slice(1)} Confidence
                        </Badge>
                      </div>
                    </div>

                    <div className="md:col-span-2 space-y-4">
                      <div>
                        <h3 className="font-medium">Recommendation</h3>
                        <div className="flex items-center gap-2 mt-1">
                          {prediction.probability > 0.5 ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                          <p>{prediction.recommendation}</p>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium">Supporting Evidence</h3>
                        <p className="text-sm mt-1">{prediction.evidence}</p>
                      </div>

                      <div>
                        <h3 className="font-medium">Response Category</h3>
                        <div className="mt-1">
                          {prediction.probability >= 0.7 ? (
                            <Badge className="bg-green-100 text-green-800">Likely Responder</Badge>
                          ) : prediction.probability >= 0.4 ? (
                            <Badge className="bg-amber-100 text-amber-800">Intermediate Response</Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800">Likely Non-Responder</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Tabs defaultValue="biomarkers" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="biomarkers">Biomarker Analysis</TabsTrigger>
                  <TabsTrigger value="alternatives">Alternative Treatments</TabsTrigger>
                  <TabsTrigger value="evidence">Clinical Evidence</TabsTrigger>
                </TabsList>

                <TabsContent value="biomarkers">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Biomarker Analysis</CardTitle>
                      <CardDescription>Impact of specific biomarkers on treatment response</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {prediction.biomarkers.map((biomarker, index) => (
                          <div key={index} className="space-y-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{biomarker.name}</span>
                                {biomarker.impact === "positive" ? (
                                  <Badge className="bg-green-100 text-green-800">Positive</Badge>
                                ) : biomarker.impact === "negative" ? (
                                  <Badge className="bg-red-100 text-red-800">Negative</Badge>
                                ) : (
                                  <Badge className="bg-gray-100 text-gray-800">Neutral</Badge>
                                )}
                              </div>
                              <span className="text-sm">
                                {biomarker.strength.charAt(0).toUpperCase() + biomarker.strength.slice(1)} evidence
                              </span>
                            </div>
                            <Progress
                              value={biomarker.impact === "positive" ? 75 : biomarker.impact === "negative" ? 25 : 50}
                              className={
                                biomarker.impact === "positive"
                                  ? "h-2 bg-green-100"
                                  : biomarker.impact === "negative"
                                    ? "h-2 bg-red-100"
                                    : "h-2"
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="alternatives">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Alternative Treatment Options</CardTitle>
                      <CardDescription>Other potential therapies ranked by predicted response</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="rounded-md border">
                          <table className="min-w-full divide-y divide-border">
                            <thead>
                              <tr className="bg-muted/50">
                                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                  Treatment
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                  Predicted Response
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                  Confidence
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                  Recommendation
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-card divide-y divide-border">
                              {treatmentOptions[selectedCancer]?.map((treatment) => {
                                // Skip the currently selected treatment
                                if (treatment.id === selectedTreatment) return null

                                // Get mock prediction for this treatment
                                let mockPrediction
                                try {
                                  mockPrediction = responsePredictions[selectedCancer][selectedProfile][treatment.id]
                                } catch (e) {
                                  mockPrediction = {
                                    probability: Math.random(),
                                    confidence: Math.random() > 0.5 ? "high" : "moderate",
                                    recommendation: "Consider based on clinical factors",
                                  }
                                }

                                return (
                                  <tr key={treatment.id}>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                                      {treatment.name}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                                      <div className="flex items-center gap-2">
                                        <Progress
                                          value={mockPrediction?.probability * 100 || 50}
                                          className="h-2 w-16"
                                        />
                                        <span>{Math.round((mockPrediction?.probability || 0.5) * 100)}%</span>
                                      </div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                                      <Badge
                                        variant="outline"
                                        className={
                                          mockPrediction?.confidence === "high"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-amber-100 text-amber-800"
                                        }
                                      >
                                        {mockPrediction?.confidence || "moderate"}
                                      </Badge>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                                      {mockPrediction?.recommendation || "Consider based on clinical factors"}
                                    </td>
                                  </tr>
                                )
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="evidence">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Clinical Evidence</CardTitle>
                      <CardDescription>Supporting evidence from clinical trials and literature</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Alert>
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Evidence Summary</AlertTitle>
                          <AlertDescription>
                            This prediction is based on data from clinical trials, real-world evidence, and
                            peer-reviewed literature.
                          </AlertDescription>
                        </Alert>

                        <div className="space-y-3">
                          <div className="p-3 border rounded-lg">
                            <div className="flex items-center gap-2">
                              <BarChart className="h-5 w-5 text-blue-500" />
                              <h4 className="font-medium">Clinical Trial Data</h4>
                            </div>
                            <p className="text-sm mt-1">
                              {prediction.evidence || "No specific trial data available for this combination."}
                            </p>
                          </div>

                          <div className="p-3 border rounded-lg">
                            <div className="flex items-center gap-2">
                              <FileText className="h-5 w-5 text-purple-500" />
                              <h4 className="font-medium">Literature References</h4>
                            </div>
                            <ul className="text-sm mt-1 space-y-1 list-disc pl-5">
                              <li>
                                Smith et al. (2023). Molecular predictors of response to immunotherapy in NSCLC. Journal
                                of Clinical Oncology, 41(5), 432-441.
                              </li>
                              <li>
                                Johnson et al. (2022). Impact of co-mutations on treatment outcomes in KRAS-mutant
                                NSCLC. Nature Medicine, 28(3), 521-529.
                              </li>
                            </ul>
                          </div>

                          <div className="p-3 border rounded-lg">
                            <div className="flex items-center gap-2">
                              <Pill className="h-5 w-5 text-green-500" />
                              <h4 className="font-medium">Treatment Guidelines</h4>
                            </div>
                            <p className="text-sm mt-1">
                              NCCN Guidelines (Version 3.2023) recommend targeted therapy as first-line treatment for
                              patients with actionable mutations, with immunotherapy reserved for patients without
                              driver mutations or with high PD-L1 expression.
                            </p>
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
