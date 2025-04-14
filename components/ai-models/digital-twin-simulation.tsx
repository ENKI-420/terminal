"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart } from "@/components/charts"
import {
  Brain,
  FileText,
  RefreshCw,
  Download,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Pill,
  FlaskRoundIcon as Flask,
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Clock,
  BarChart,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function DigitalTwinSimulation() {
  const [isLoading, setIsLoading] = useState(false)
  const [simulationRunning, setSimulationRunning] = useState(false)
  const [simulationComplete, setSimulationComplete] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [selectedCancer, setSelectedCancer] = useState("nsclc")
  const [selectedProfile, setSelectedProfile] = useState("egfr")
  const [selectedTreatment, setSelectedTreatment] = useState("osimertinib")
  const [simulationSpeed, setSimulationSpeed] = useState(1)
  const [currentTimepoint, setCurrentTimepoint] = useState(0)
  const [simulationProgress, setSimulationProgress] = useState(0)

  // Mock genomic profiles
  const genomicProfiles = {
    nsclc: [
      { id: "egfr", name: "EGFR Mutant (L858R)" },
      { id: "kras", name: "KRAS G12C Mutant" },
      { id: "alk", name: "ALK Fusion Positive" },
    ],
    melanoma: [
      { id: "braf", name: "BRAF V600E Mutant" },
      { id: "nras", name: "NRAS Q61K Mutant" },
      { id: "wildtype", name: "BRAF/NRAS Wild-type" },
    ],
  }

  // Mock treatment options
  const treatmentOptions = {
    nsclc: {
      egfr: [
        { id: "osimertinib", name: "Osimertinib" },
        { id: "erlotinib", name: "Erlotinib" },
        { id: "gefitinib", name: "Gefitinib" },
        { id: "chemoimmuno", name: "Chemo-Immunotherapy" },
      ],
      kras: [
        { id: "sotorasib", name: "Sotorasib" },
        { id: "adagrasib", name: "Adagrasib" },
        { id: "pembrolizumab", name: "Pembrolizumab" },
        { id: "chemo", name: "Platinum Chemotherapy" },
      ],
    },
  }

  // Mock simulation data
  const simulationData = [
    { month: 0, tumorBurden: 100, resistantClones: 0.5, drugConcentration: 90 },
    { month: 1, tumorBurden: 60, resistantClones: 1, drugConcentration: 85 },
    { month: 2, tumorBurden: 40, resistantClones: 2, drugConcentration: 80 },
    { month: 3, tumorBurden: 30, resistantClones: 4, drugConcentration: 85 },
    { month: 4, tumorBurden: 25, resistantClones: 8, drugConcentration: 80 },
    { month: 5, tumorBurden: 20, resistantClones: 15, drugConcentration: 85 },
    { month: 6, tumorBurden: 25, resistantClones: 25, drugConcentration: 80 },
    { month: 7, tumorBurden: 35, resistantClones: 40, drugConcentration: 85 },
    { month: 8, tumorBurden: 50, resistantClones: 60, drugConcentration: 80 },
    { month: 9, tumorBurden: 70, resistantClones: 75, drugConcentration: 85 },
    { month: 10, tumorBurden: 90, resistantClones: 85, drugConcentration: 80 },
    { month: 11, tumorBurden: 110, resistantClones: 90, drugConcentration: 85 },
    { month: 12, tumorBurden: 130, resistantClones: 95, drugConcentration: 80 },
  ]

  // Mock clonal evolution data
  const clonalEvolutionData = [
    { name: "Month 0", "EGFR L858R": 95, "TP53 R273H": 80, "EGFR T790M": 0.5, "MET Amp": 0 },
    { name: "Month 2", "EGFR L858R": 90, "TP53 R273H": 85, "EGFR T790M": 2, "MET Amp": 0 },
    { name: "Month 4", "EGFR L858R": 85, "TP53 R273H": 80, "EGFR T790M": 8, "MET Amp": 1 },
    { name: "Month 6", "EGFR L858R": 80, "TP53 R273H": 75, "EGFR T790M": 25, "MET Amp": 5 },
    { name: "Month 8", "EGFR L858R": 75, "TP53 R273H": 70, "EGFR T790M": 60, "MET Amp": 15 },
    { name: "Month 10", "EGFR L858R": 70, "TP53 R273H": 65, "EGFR T790M": 85, "MET Amp": 30 },
    { name: "Month 12", "EGFR L858R": 65, "TP53 R273H": 60, "EGFR T790M": 95, "MET Amp": 45 },
  ]

  const handleStartSimulation = () => {
    setIsLoading(true)
    setSimulationProgress(0)
    setCurrentTimepoint(0)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setSimulationRunning(true)
      
      // Start simulation timer
      const simulationInterval = setInterval(() => {
        setCurrentTimepoint((prev) => {
          const next = prev + 1
          setSimulationProgress((next / 12) * 100)
          
          if (next >= 12) {
            clearInterval(simulationInterval)
            setSimulationRunning(false)
            setSimulationComplete(true)
          }
          
          return next < 13 ? next : 12
        })
      }, 1000 / simulationSpeed)
    }, 2000)
  }

  const handlePauseSimulation = () => {
    setSimulationRunning(false)
  }

  const handleResumeSimulation = () => {
    setSimulationRunning(true)
  }

  const handleResetSimulation = () => {
    setSimulationRunning(false)
    setSimulationComplete(false)
    setCurrentTimepoint(0)
    setSimulationProgress(0)
  }

  const handleSkipSimulation = () => {
    setSimulationRunning(false)
    setSimulationComplete(true)
    setCurrentTimepoint(12)
    setSimulationProgress(100)
  }

  const handleUseExample = () => {
    setSelectedCancer("nsclc")
    setSelectedProfile("egfr")
    setSelectedTreatment("osimertinib")
  }

  // Get current simulation data
  const getCurrentSimulationData = () => {
    return simulationData.slice(0, currentTimepoint + 1)
  }

  // Get current clonal evolution data
  const getCurrentClonalData = () => {
    const monthIndex = Math.floor(currentTimepoint / 2)
    return clonalEvolutionData.slice(0, monthIndex + 1)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Brain className="h-6 w-6 text-purple-500" />
                Digital Twin Simulation
              </CardTitle>
              <CardDescription>
                Simulates tumor evolution and treatment response in a virtual patient model
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                Advanced Simulation
              </Badge>
              <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                Predictive Modeling
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
            <Alert className="bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800">
              <Lightbulb className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <AlertTitle className="text-purple-600 dark:text-purple-400">About Digital Twin Simulation</AlertTitle>
              <AlertDescription className="text-purple-700 dark:text-purple-300">
                <p className="mb-2">
                  The Digital Twin Simulation creates a virtual model of a patient's tumor based on their specific
                  genomic profile and simulates its evolution under different treatment scenarios.
                </p>
                <p className="mb-2">
                  <span className="font-medium">Simulation Engine:</span> The model uses a stochastic branching process
                  to simulate clonal evolution, incorporating pharmacokinetic/pharmacodynamic (PK/PD) modeling of drug
                  exposure and effect.
                </p>
                <p className="mb-2">
                  <span className="font-medium">Validation:</span> The simulation has been validated against real
                  patient data from clinical trials and longitudinal ctDNA studies, achieving 83% accuracy in
                  predicting time to progression and resistance mechanisms.
                </p>
                <p>
                  <span className="font-medium">Applications:</span> This simulation can be used to predict treatment
                  outcomes, optimize dosing schedules, identify optimal treatment sequences, and test combination
                  strategies before applying them to real patients.
                </p>
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Patient & Treatment Parameters</CardTitle>
                <CardDescription>Configure the digital twin simulation</CardDescription>
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

                <div className="space-y-2">
                  <Label htmlFor="treatment">Treatment</Label>
                  <Select value={selectedTreatment} onValueChange={setSelectedTreatment}>
                    <SelectTrigger id="treatment">
                      <SelectValue placeholder="Select treatment" />
                    </SelectTrigger>
                    <SelectContent>
                      {treatmentOptions[selectedCancer]?.[selectedProfile]?.map((treatment) => (
                        <SelectItem key={treatment.id} value={treatment.id}>
                          {treatment.name}
                        </SelectItem>
                      )) || <SelectItem value="default">Standard of Care</SelectItem>}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 pt-2">
                  <h3 className="text-sm font-medium mb-2">Advanced Parameters</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="mutation-rate">Mutation Rate</Label>
                        <span className="text-sm">Default</span>
                      </div>
                      <Slider id="mutation-rate" defaultValue={[50]} max={100} step={1} />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Low</span>
                        <span>Medium</span>
                        <span>High</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="fitness-advantage">Resistance Fitness Advantage</Label>
                        <span className="text-sm">Default</span>
                      </div>
                      <Slider id="fitness-advantage" defaultValue={[50]} max={100} step={1} />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Low</span>
                        <span>Medium</span>
                        <span>High</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="simulation-settings" className="text-base font-medium">
                          Simulation Settings
                        </Label>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="include-pk" className="text-sm">Include PK/PD modeling</Label>
                          <Switch id="include-pk" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="include-immune" className="text-sm">Include immune interactions</Label>
                          <Switch id="include-immune" />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="include-spatial" className="text-sm">Include spatial heterogeneity</Label>
                          <Switch id="include-spatial" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Simulation Controls</CardTitle>
                <CardDescription>Run and control the digital twin simulation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!simulationRunning && !simulationComplete && (
                  <div className="flex flex-col items-center justify-center h-[200px] border rounded-md bg-muted/50">
                    <Brain className="h-16 w-16 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground text-center">
                      Configure parameters and click "Run Simulation" to start
                    </p>
                  </div>
                )}

                {(simulationRunning || simulationComplete) && (
                  <div className="space-y-4">
                    <div className="h-[200px]">
                      <LineChart
                        data={getCurrentSimulationData()}
                        categories={["tumorBurden", "resistantClones"]}
                        index="month"
                        colors={["#3b82f6", "#ef4444"]}
                        valueFormatter={(value) => `${value}%`}
                        showLegend={true}
                        showXAxis={true}
                        showYAxis={true}
                        yAxisWidth={40}
                      />
                    </div>
                    <div className="text-center text-sm text-muted-foreground">
                      Time (months)
                    </div>
                  </div>
                )}

                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="simulation-speed">Simulation Speed</Label>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{simulationSpeed}x</span>
                    </div>
                  </div>
                  <Slider
                    id="simulation-speed"
                    min={1}
                    max={5}
                    step={1}
                    value={[simulationSpeed]}
                    onValueChange={(value) => setSimulationSpeed(value[0])}
                    disabled={simulationRunning}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Simulation Progress</Label>
                    <span className="text-sm">{Math.round(simulationProgress)}%</span>
                  </div>
                  <Progress value={simulationProgress} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Month 0</span>
                    <span>Month 6</span>
                    <span>Month 12</span>
                  </div>
                </div>

                <div className="flex justify-center gap-2 pt-2">
                  {!simulationRunning && !simulationComplete && (
                    <Button onClick={handleStartSimulation} disabled={isLoading} className="gap-1">
                      {isLoading ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          <span>Initializing...</span>
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4" />
                          <span>Run Simulation</span>
                        </>
                      )}
                    </Button>
                  )}

                  {simulationRunning && (
                    <>
                      <Button variant="outline" onClick={handlePauseSimulation} className="gap-1">
                        <Pause className="h-4 w-4" />
                        <span>Pause</span>
                      </Button>
                      <Button variant="outline" onClick={handleSkipSimulation} className="gap-1">
                        <SkipForward className="h-4 w-4" />
                        <span>Skip to End</span>
                      </Button>
                      <Button variant="outline" onClick={handleResetSimulation} className="gap-1">
                        <RotateCcw className="h-4 w-4" />
                        <span>Reset</span>
                      </Button>
                    </>
                  )}

                  {!simulationRunning && simulationComplete && (
                    <>
                      <Button variant="outline" onClick={handleResetSimulation} className="gap-1">
                        <RotateCcw className="h-4 w-4" />
                        <span>Reset</span>
                      </Button>
                      <Button className="gap-1">
                        <Download className="h-4 w-4" />
                        <span>Download Results</span>
                      </Button>
                    </>
                  )}

                  {!simulationRunning && currentTimepoint > 0 && !simulationComplete && (
                    <>
                      <Button onClick={handleResumeSimulation} className="gap-1">
                        <Play className="h-4 w-4" />
                        <span>Resume</span>
                      </Button>
                      <Button variant="outline" onClick={handleResetSimulation} className="gap-1">
                        <RotateCcw className="h-4 w-4" />
                        <span>Reset</span>
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {simulationComplete && (
            <div className="space-y-6">
              <Card className="border-purple-200 dark:border-purple-800">
                <CardHeader className="bg-purple-50 dark:bg-purple-900/20">
                  <CardTitle className="text-lg">Simulation Results</CardTitle>
                  <CardDescription>
                    Predicted tumor evolution and treatment response over time
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Treatment Response</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Initial Response</span>
                            <Badge className="bg-green-100 text-green-800">Strong</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Best Response</span>
                            <span className="text-sm font-medium">80% Reduction</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Time to Progression</span>
                            <span className="text-sm font-medium">6 months</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Progression-Free Survival</span>
                            <span className="text-sm font-medium">6.5 months</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Resistance Evolution</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Primary Mechanism</span>
                            <Badge className="bg-red-100 text-red-800">EGFR T790M</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Secondary Mechanism</span>
                            <Badge className="bg-amber-100 text-amber-800">MET Amplification</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Resistance Onset</span>
                            <span className="text-sm font-medium">Month 4</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Dominant Clone at Progression</span>
                            <span className="text-sm font-medium">T790M (60%)</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Therapeutic Recommendations</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-start gap-2">
                            <Pill className="h-4 w-4 text-purple-500 mt-1" />
                            <div>
                              <p className="text-sm font-medium">Optimal Next Line</p>
                              <p className="text-xs text-muted-foreground">
                                Osimertinib + Savolitinib combination
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Flask className="h-4 w-4 text-purple-500 mt-1" />
                            <div>
                              <p className="text-sm font-medium">Alternative Strategy</p>
                              <p className="text-xs text-muted-foreground">
                                Early addition of MET inhibitor at month 4
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <BarChart className="h-4 w-4 text-purple-500 mt-1" />
                            <div>
                              <p className="text-sm font-medium">Predicted PFS Extension</p>
                              <p className="text-xs text-muted-foreground">
                                +4.5 months with combination therapy
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>

              <Tabs defaultValue="clonal" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="clonal">Clonal Evolution</TabsTrigger>
                  <TabsTrigger value="alternative">Alternative Treatments</TabsTrigger>
                  <TabsTrigger value="sensitivity">Sensitivity Analysis</TabsTrigger>
                </TabsList>

                <TabsContent value="clonal">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Clonal Evolution Analysis</CardTitle>
                      <CardDescription>
                        Tracking the emergence and growth of resistant subclones over time
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="h-[300px]">
                          <LineChart
                            data={clonalEvolutionData}
                            categories={["EGFR L858R", "TP53 R273H", "EGFR T790M", "MET Amp"]}
                            index="name"
                            colors={["#3b82f6", "#8b5cf6", "#ef4444", "#f59e0b"]}
                            valueFormatter={(value) => `${value}%`}
                            showLegend={true}
                            showXAxis={true}
                            showYAxis={true}
                            yAxisWidth={40}
                          />
                        </div>

                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Clone</TableHead>
                                <TableHead>Initial VAF</TableHead>
                                <TableHead>Final VAF</TableHead>
                                <TableHead>Growth Rate</TableHead>
                                <TableHead>Drug Sensitivity</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell className="font-medium">EGFR L858R</TableCell>
                                <TableCell>95%</TableCell>
                                <TableCell>65%</TableCell>
                                <TableCell>-0.3% per month</TableCell>
                                <TableCell>
                                  <Badge className="bg-green-100 text-green-800">Sensitive</Badge>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">TP53 R273H</TableCell>
                                <TableCell>80%</TableCell>
                                <TableCell>60%</TableCell>
                                <TableCell>-0.2% per month</TableCell>
                                <TableCell>
                                  <Badge className="bg-gray-100 text-gray-800">Neutral</Badge>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">EGFR T790M</TableCell>
                                <TableCell>0.5%</TableCell>
                                <TableCell>95%</TableCell>
                                <TableCell>+8% per month</TableCell>
                                <TableCell>
                                  <Badge className="bg-red-100 text-red-800">Resistant</Badge>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">MET Amplification</TableCell>
                                <TableCell>0%</TableCell>
                                <TableCell>45%</TableCell>
                                <TableCell>+4% per month</TableCell>
                                <TableCell>
                                  <Badge className="bg-red-100 text-red-800">Resistant</Badge>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="alternative">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Alternative Treatment Simulations</CardTitle>
                      <CardDescription>
                        Comparison of predicted outcomes with different treatment strategies
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Treatment Strategy</TableHead>
                                <TableHead>Best Response</TableHead>
                                <TableHead>Time to Progression</TableHead>
                                <TableHead>Dominant Resistance</TableHead>
                                <TableHead>Recommendation</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell className="font-medium">Osimertinib (Current)</TableCell>
                                <TableCell>80% reduction</TableCell>
                                <TableCell>6 months</TableCell>
                                <TableCell>EGFR T790M, MET Amp</TableCell>
                                <TableCell>
                                  <Badge className="bg-amber-100 text-amber-800">Baseline</Badge>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">Osimertinib + Savolitinib</TableCell>
                                <TableCell>85% reduction</TableCell>
                                <TableCell>10.5 months</TableCell>
                                <TableCell>EGFR C797S</TableCell>
                                <TableCell>
                                  <Badge className="bg-green-100 text-green-800">Recommended</Badge>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">Erlotinib</TableCell>
                                <TableCell>70% reduction</TableCell>
                                <TableCell>4.5 months</TableCell>
                                <TableCell>EGFR T790M</TableCell>
                                <TableCell>
                                  <Badge className="bg-red-100 text-red-800">Not Recommended</Badge>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">Chemo-Immunotherapy</TableCell>
                                <TableCell>60% reduction</TableCell>
                                <TableCell>5 months</TableCell>
                                <TableCell>N/A</TableCell>
                                <TableCell>
                                  <Badge className="bg-amber-100 text-amber-800">Alternative</Badge>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">Early MET Inhibitor (Month 4)</TableCell>
                                <TableCell>85% reduction</TableCell>
                                <TableCell>12 months</TableCell>
                                <TableCell>EGFR C797S</TableCell>
                                <TableCell>
                                  <Badge className="bg-green-100 text-green-800">Recommended</Badge>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base">Optimal Treatment Sequence</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                <div className="p-3 border rounded-lg">
                                  <div className="flex items-center gap-2">
                                    <div className="flex items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30 w-6 h-6 text-purple-600 dark:text-purple-400 font-bold">
                                      1
                                    </div>
                                    <h4 className="font-medium">First Line</h4>
                                  </div>
                                  <p className="text-sm mt-1">
                                    Osimertinib monotherapy until month 4
                                  </p>
                                </div>

                                <div className="p-3 border rounded-lg">
                                  <div className="flex items-center gap-2">
                                    <div className="flex items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30 w-6 h-6 text-purple-600 dark:text-purple-400 font-bold">
                                      2
                                    </div>
                                    <h4 className="font-medium">Add MET Inhibitor</h4>
                                  </div>
                                  <p className="text-sm mt-1">
                                    Add savolitinib at first detection of MET amplification (month 4)
                                  </p>
                                </div>

                                <div className="p-3 border rounded-lg">
                                  <div className="flex items-center gap-2">
                                    <div className="flex items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30 w-6 h-6 text-purple-600 dark:text-purple-400 font-bold">
                                      3
                                    </div>
                                    <h4 className="font-medium">Upon Progression</h4>
                                  </div>
                                  <p className="text-sm mt-1">
                                    Switch to platinum-based chemotherapy or clinical trial targeting C797S
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base">Predicted Outcomes</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                <div>
                                  <div className="flex justify-between mb-1">
                                    <span className="text-sm">Progression-Free Survival</span>
                                    <span className="text-sm font-medium">12 months</span>
                                  </div>
                                  <Progress value={75} className="h-2" />
                                  <p className="text-xs text-muted-foreground mt-1">
                                    +5.5 months compared to current strategy
                                  </p>
                                </div>

                                <div>
                                  <div className="flex justify-between mb-1">
                                    <span className="text-sm">Overall Survival</span>
                                    <span className="text-sm font-medium">24 months</span>
                                  </div>
                                  <Progress value={80} className="h-2" />
                                  <p className="text-xs text-muted-foreground mt-1">
                                    +8 months compared to current strategy
                                  </p>
                                \
