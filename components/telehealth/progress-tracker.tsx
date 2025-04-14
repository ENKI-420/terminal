"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { LineChart, BarChart } from "@/components/charts"
import {
  Trophy,
  Target,
  Calendar,
  CheckCircle,
  Clock,
  Share2,
  Download,
  Dna,
  Activity,
  Pill,
  Heart,
  Droplets,
  Thermometer,
  Scale,
  Utensils,
  Footprints,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function ProgressTracker() {
  const [timeRange, setTimeRange] = useState("month")
  const { toast } = useToast()

  // Function to handle sharing progress
  const handleShareProgress = () => {
    toast({
      title: "Progress Shared",
      description: "Your progress report has been shared with your healthcare team.",
    })
  }

  // Function to handle downloading progress report
  const handleDownloadReport = () => {
    toast({
      title: "Report Downloaded",
      description: "Your progress report has been downloaded successfully.",
    })
  }

  return (
    <div className="space-y-6">
      {/* Treatment Progress Overview */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl flex items-center">
                <Trophy className="mr-2 h-5 w-5 text-amber-500" />
                Treatment Progress
              </CardTitle>
              <CardDescription>Track your progress through your treatment journey</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleShareProgress} className="gap-1">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadReport} className="gap-1">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Treatment Plan: Venetoclax + Azacitidine</h3>
              <Badge className="bg-green-600">Cycle 2 of 6</Badge>
            </div>
            <Progress value={33} className="h-2" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Started: March 10, 2025</span>
              <span>33% Complete</span>
              <span>Estimated completion: August 10, 2025</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Dna className="mr-2 h-5 w-5 text-blue-500" />
                  Genomic Response
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">65%</div>
                  <div className="text-sm text-muted-foreground">Reduction in mutation burden</div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">FLT3-ITD</span>
                    <span className="text-sm font-medium">70% ↓</span>
                  </div>
                  <Progress value={70} className="h-1.5 bg-blue-100 dark:bg-blue-950" />

                  <div className="flex justify-between items-center">
                    <span className="text-sm">NPM1</span>
                    <span className="text-sm font-medium">60% ↓</span>
                  </div>
                  <Progress value={60} className="h-1.5 bg-blue-100 dark:bg-blue-950" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Activity className="mr-2 h-5 w-5 text-green-500" />
                  Clinical Response
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className="text-4xl font-bold text-green-600 dark:text-green-400">85%</div>
                  <div className="text-sm text-muted-foreground">Symptom improvement</div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Energy Level</span>
                    <span className="text-sm font-medium">80% ↑</span>
                  </div>
                  <Progress value={80} className="h-1.5 bg-green-100 dark:bg-green-950" />

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Blood Counts</span>
                    <span className="text-sm font-medium">90% ↑</span>
                  </div>
                  <Progress value={90} className="h-1.5 bg-green-100 dark:bg-green-950" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Pill className="mr-2 h-5 w-5 text-amber-500" />
                  Treatment Adherence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className="text-4xl font-bold text-amber-600 dark:text-amber-400">98%</div>
                  <div className="text-sm text-muted-foreground">Medication adherence</div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Venetoclax</span>
                    <span className="text-sm font-medium">98%</span>
                  </div>
                  <Progress value={98} className="h-1.5 bg-amber-100 dark:bg-amber-950" />

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Azacitidine</span>
                    <span className="text-sm font-medium">100%</span>
                  </div>
                  <Progress value={100} className="h-1.5 bg-amber-100 dark:bg-amber-950" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-medium mb-2">Next Steps in Your Treatment Journey</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 dark:bg-blue-900 p-1.5 rounded-full">
                  <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Bone Marrow Biopsy</p>
                  <p className="text-xs text-muted-foreground">Scheduled for April 15, 2025</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-green-100 dark:bg-green-900 p-1.5 rounded-full">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Begin Cycle 3 of Treatment</p>
                  <p className="text-xs text-muted-foreground">Scheduled for April 10, 2025</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-amber-100 dark:bg-amber-900 p-1.5 rounded-full">
                  <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Follow-up with Dr. Sarah Johnson</p>
                  <p className="text-xs text-muted-foreground">Scheduled for April 20, 2025</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Progress Tracking */}
      <Tabs defaultValue="biomarkers" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <TabsTrigger value="biomarkers" className="flex items-center">
            <Dna className="mr-2 h-4 w-4" />
            Biomarkers
          </TabsTrigger>
          <TabsTrigger value="vitals" className="flex items-center">
            <Heart className="mr-2 h-4 w-4" />
            Vital Signs
          </TabsTrigger>
          <TabsTrigger value="lifestyle" className="flex items-center">
            <Footprints className="mr-2 h-4 w-4" />
            Lifestyle
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex items-center">
            <Target className="mr-2 h-4 w-4" />
            Goals
          </TabsTrigger>
        </TabsList>

        <TabsContent value="biomarkers">
          <Card>
            <CardHeader>
              <CardTitle>Biomarker Trends</CardTitle>
              <CardDescription>Track changes in your key biomarkers over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <LineChart
                  data={[
                    { date: "Baseline", wbc: 2.1, hgb: 9.2, plt: 85, blasts: 45 },
                    { date: "Week 2", wbc: 2.5, hgb: 9.8, plt: 95, blasts: 30 },
                    { date: "Week 4", wbc: 3.2, hgb: 10.5, plt: 120, blasts: 15 },
                    { date: "Week 6", wbc: 3.8, hgb: 11.2, plt: 145, blasts: 8 },
                    { date: "Week 8", wbc: 4.2, hgb: 11.8, plt: 165, blasts: 3 },
                  ]}
                  categories={["wbc", "hgb", "plt", "blasts"]}
                  index="date"
                  colors={["#3b82f6", "#10b981", "#f59e0b", "#ef4444"]}
                  valueFormatter={(value) => `${value}`}
                  yAxisWidth={40}
                />
              </div>
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm">White Blood Cells (K/µL)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm">Hemoglobin (g/dL)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span className="text-sm">Platelets (K/µL)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-sm">Blast Cells (%)</span>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <h3 className="font-medium">Genomic Markers</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">FLT3-ITD Mutation Burden</span>
                      <span className="text-sm font-medium text-green-600">70% Reduction</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={70} className="h-2 flex-1" />
                      <span className="text-xs text-muted-foreground">70%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Baseline: 28.4% VAF → Current: 8.5% VAF</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">NPM1 Mutation Burden</span>
                      <span className="text-sm font-medium text-green-600">60% Reduction</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={60} className="h-2 flex-1" />
                      <span className="text-xs text-muted-foreground">60%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Baseline: 35.2% VAF → Current: 14.1% VAF</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">View Complete Lab History</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="vitals">
          <Card>
            <CardHeader>
              <CardTitle>Vital Signs Progress</CardTitle>
              <CardDescription>Track improvements in your vital signs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Heart className="h-5 w-5 text-red-500 mr-2" />
                        <h3 className="font-medium">Heart Rate</h3>
                      </div>
                      <Badge className="bg-green-600">Improved</Badge>
                    </div>
                    <div className="mt-2">
                      <div className="text-2xl font-bold">72 BPM</div>
                      <p className="text-xs text-muted-foreground">Baseline: 85 BPM</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Activity className="h-5 w-5 text-blue-500 mr-2" />
                        <h3 className="font-medium">Blood Pressure</h3>
                      </div>
                      <Badge className="bg-green-600">Improved</Badge>
                    </div>
                    <div className="mt-2">
                      <div className="text-2xl font-bold">118/78</div>
                      <p className="text-xs text-muted-foreground">Baseline: 135/88</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Droplets className="h-5 w-5 text-green-500 mr-2" />
                        <h3 className="font-medium">Blood Oxygen</h3>
                      </div>
                      <Badge className="bg-green-600">Improved</Badge>
                    </div>
                    <div className="mt-2">
                      <div className="text-2xl font-bold">97%</div>
                      <p className="text-xs text-muted-foreground">Baseline: 94%</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Thermometer className="h-5 w-5 text-amber-500 mr-2" />
                        <h3 className="font-medium">Temperature</h3>
                      </div>
                      <Badge className="bg-green-600">Normal</Badge>
                    </div>
                    <div className="mt-2">
                      <div className="text-2xl font-bold">98.6°F</div>
                      <p className="text-xs text-muted-foreground">Baseline: 99.2°F</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="h-[300px]">
                <LineChart
                  data={[
                    { date: "Baseline", heartRate: 85, systolic: 135, diastolic: 88, oxygen: 94 },
                    { date: "Week 2", heartRate: 82, systolic: 130, diastolic: 85, oxygen: 95 },
                    { date: "Week 4", heartRate: 78, systolic: 125, diastolic: 82, oxygen: 96 },
                    { date: "Week 6", heartRate: 75, systolic: 120, diastolic: 80, oxygen: 97 },
                    { date: "Week 8", heartRate: 72, systolic: 118, diastolic: 78, oxygen: 97 },
                  ]}
                  categories={["heartRate", "systolic", "diastolic", "oxygen"]}
                  index="date"
                  colors={["#ef4444", "#3b82f6", "#93c5fd", "#10b981"]}
                  valueFormatter={(value) => `${value}`}
                  yAxisWidth={40}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lifestyle">
          <Card>
            <CardHeader>
              <CardTitle>Lifestyle Progress</CardTitle>
              <CardDescription>Track improvements in your daily activities and habits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Footprints className="h-5 w-5 text-blue-500 mr-2" />
                        <h3 className="font-medium">Daily Steps</h3>
                      </div>
                      <Badge className="bg-green-600">Improved</Badge>
                    </div>
                    <div className="mt-2">
                      <div className="text-2xl font-bold">3,245</div>
                      <p className="text-xs text-muted-foreground">Baseline: 1,200</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Scale className="h-5 w-5 text-amber-500 mr-2" />
                        <h3 className="font-medium">Weight</h3>
                      </div>
                      <Badge className="bg-green-600">Stable</Badge>
                    </div>
                    <div className="mt-2">
                      <div className="text-2xl font-bold">165 lbs</div>
                      <p className="text-xs text-muted-foreground">Baseline: 160 lbs</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Utensils className="h-5 w-5 text-green-500 mr-2" />
                        <h3 className="font-medium">Nutrition</h3>
                      </div>
                      <Badge className="bg-green-600">Improved</Badge>
                    </div>
                    <div className="mt-2">
                      <div className="text-2xl font-bold">85%</div>
                      <p className="text-xs text-muted-foreground">Baseline: 60%</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-blue-500 mr-2" />
                        <h3 className="font-medium">Sleep</h3>
                      </div>
                      <Badge className="bg-green-600">Improved</Badge>
                    </div>
                    <div className="mt-2">
                      <div className="text-2xl font-bold">7.2 hrs</div>
                      <p className="text-xs text-muted-foreground">Baseline: 5.5 hrs</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="h-[300px]">
                <BarChart
                  data={[
                    { week: "Baseline", steps: 1200, sleep: 5.5, nutrition: 60 },
                    { week: "Week 2", steps: 1800, sleep: 6.2, nutrition: 65 },
                    { week: "Week 4", steps: 2400, sleep: 6.8, nutrition: 75 },
                    { week: "Week 6", steps: 2900, sleep: 7.0, nutrition: 80 },
                    { week: "Week 8", steps: 3245, sleep: 7.2, nutrition: 85 },
                  ]}
                  categories={["steps", "sleep", "nutrition"]}
                  index="week"
                  colors={["#3b82f6", "#8b5cf6", "#10b981"]}
                  valueFormatter={(value) => `${value}`}
                  yAxisWidth={60}
                />
              </div>
              <div className="flex flex-wrap gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm">Daily Steps (avg)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-sm">Sleep Hours (avg)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm">Nutrition Score (%)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals">
          <Card>
            <CardHeader>
              <CardTitle>Health Goals & Achievements</CardTitle>
              <CardDescription>Track your progress towards personalized health goals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Active Goals</h3>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <Target className="h-5 w-5 text-blue-600 mr-2" />
                        <h4 className="font-medium">Complete Treatment Cycle</h4>
                      </div>
                      <Badge>In Progress</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Complete all 6 cycles of Venetoclax + Azacitidine treatment with at least 95% adherence.
                    </p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>33% (2/6 cycles)</span>
                      </div>
                      <Progress value={33} className="h-2" />
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <Target className="h-5 w-5 text-green-600 mr-2" />
                        <h4 className="font-medium">Increase Daily Activity</h4>
                      </div>
                      <Badge>In Progress</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Gradually increase daily steps to 5,000 by the end of treatment.
                    </p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>65% (3,245/5,000 steps)</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <Target className="h-5 w-5 text-amber-600 mr-2" />
                        <h4 className="font-medium">Maintain Medication Adherence</h4>
                      </div>
                      <Badge className="bg-green-600">On Track</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Maintain at least 95% adherence to all prescribed medications.
                    </p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>98% adherence</span>
                      </div>
                      <Progress value={98} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Completed Goals</h3>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 bg-muted/30">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                        <h4 className="font-medium">Complete Initial Treatment Education</h4>
                      </div>
                      <Badge className="bg-green-600">Completed</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Complete all educational modules about AML and treatment options.
                    </p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Completed on</span>
                        <span>March 12, 2025</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Set New Goal</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
