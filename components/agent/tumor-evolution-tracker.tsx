"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { LineChart } from "@/components/charts"
import {
  Activity,
  AlertCircle,
  Clock,
  TrendingDown,
  TrendingUp,
  FileText,
  BarChart,
  Calendar,
  Droplet,
  Beaker,
  Microscope,
  Pill,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function TumorEvolutionTracker() {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data for ctDNA monitoring
  const ctDNAData = [
    { name: "Week 0", "Variant Allele Frequency": 5.2, "Tumor Fraction": 3.8 },
    { name: "Week 2", "Variant Allele Frequency": 3.1, "Tumor Fraction": 2.2 },
    { name: "Week 4", "Variant Allele Frequency": 1.8, "Tumor Fraction": 1.3 },
    { name: "Week 6", "Variant Allele Frequency": 0.9, "Tumor Fraction": 0.7 },
    { name: "Week 8", "Variant Allele Frequency": 0.4, "Tumor Fraction": 0.3 },
    { name: "Week 10", "Variant Allele Frequency": 0.2, "Tumor Fraction": 0.1 },
    { name: "Week 12", "Variant Allele Frequency": 0.7, "Tumor Fraction": 0.5 },
    { name: "Week 14", "Variant Allele Frequency": 1.2, "Tumor Fraction": 0.9 },
  ]

  // Mock data for resistance mutations
  const resistanceMutations = [
    {
      gene: "EGFR",
      mutation: "T790M",
      firstDetected: "Week 12",
      currentVAF: 0.4,
      trend: "increasing",
      significance: "Primary resistance to first-gen TKIs",
      recommendedAction: "Switch to osimertinib",
    },
    {
      gene: "MET",
      mutation: "Amplification",
      firstDetected: "Week 14",
      currentVAF: 0.3,
      trend: "increasing",
      significance: "Bypass resistance mechanism",
      recommendedAction: "Add MET inhibitor",
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">Real-Time Tumor Evolution Tracking</CardTitle>
              <CardDescription>Continuous ctDNA monitoring with AI-powered resistance prediction</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                <Clock className="h-3 w-3 mr-1" />
                Last Updated: Today, 9:45 AM
              </Badge>
              <Button size="sm" className="gap-1">
                <Droplet className="h-4 w-4" />
                Schedule Collection
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <TabsTrigger value="overview" className="flex items-center gap-1">
                <Activity className="h-4 w-4" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger value="ctdna-trends" className="flex items-center gap-1">
                <BarChart className="h-4 w-4" />
                <span>ctDNA Trends</span>
              </TabsTrigger>
              <TabsTrigger value="resistance" className="flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                <span>Resistance</span>
              </TabsTrigger>
              <TabsTrigger value="therapy-response" className="flex items-center gap-1">
                <Pill className="h-4 w-4" />
                <span>Therapy Response</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Droplet className="h-5 w-5 text-blue-500" />
                      ctDNA Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Tumor Fraction</span>
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-medium">0.9%</span>
                            <TrendingUp className="h-4 w-4 text-red-500" />
                          </div>
                        </div>
                        <Progress value={18} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">
                          Increased from 0.5% (Week 12) to 0.9% (Week 14)
                        </p>
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">EGFR T790M VAF</span>
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-medium">0.4%</span>
                            <TrendingUp className="h-4 w-4 text-red-500" />
                          </div>
                        </div>
                        <Progress value={8} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">First detected in Week 12, now increasing</p>
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">MET Amplification</span>
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-medium">0.3%</span>
                            <TrendingUp className="h-4 w-4 text-red-500" />
                          </div>
                        </div>
                        <Progress value={6} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">First detected in Week 14</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-amber-500" />
                      Resistance Alert
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800">
                      <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      <AlertTitle className="text-amber-600 dark:text-amber-400">
                        Emerging Resistance Detected
                      </AlertTitle>
                      <AlertDescription className="text-amber-700 dark:text-amber-300">
                        EGFR T790M mutation and MET amplification detected in recent ctDNA sample.
                      </AlertDescription>
                    </Alert>

                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-medium">AI Prediction:</p>
                      <p className="text-sm">
                        Based on the emergence of T790M and MET amplification, AGENT predicts treatment failure within
                        4-6 weeks if current therapy is continued.
                      </p>
                      <p className="text-sm font-medium mt-3">Recommended Action:</p>
                      <p className="text-sm">
                        Switch to osimertinib + savolitinib combination therapy to address both resistance mechanisms.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-green-500" />
                      Monitoring Schedule
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Droplet className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">Next ctDNA Collection</span>
                        </div>
                        <Badge>May 15, 2025</Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Microscope className="h-4 w-4 text-purple-500" />
                          <span className="text-sm">Next Tissue Biopsy</span>
                        </div>
                        <Badge variant="outline">If clinically indicated</Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Beaker className="h-4 w-4 text-amber-500" />
                          <span className="text-sm">Comprehensive Analysis</span>
                        </div>
                        <Badge>May 18, 2025</Badge>
                      </div>

                      <div className="border-t pt-3 mt-3">
                        <p className="text-sm font-medium">Monitoring Recommendation:</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Increase ctDNA monitoring frequency to weekly due to emerging resistance patterns.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>ctDNA Monitoring Timeline</CardTitle>
                  <CardDescription>Tracking tumor fraction and key mutations over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <LineChart
                      data={ctDNAData}
                      categories={["Variant Allele Frequency", "Tumor Fraction"]}
                      index="name"
                      colors={["#2563eb", "#7c3aed"]}
                    />
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                    <p className="text-sm">
                      <span className="font-medium">Note:</span> The recent uptick in ctDNA levels (Weeks 12-14)
                      suggests emerging resistance to current therapy.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ctdna-trends" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Longitudinal ctDNA Analysis</CardTitle>
                  <CardDescription>Detailed tracking of circulating tumor DNA over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <LineChart
                      data={ctDNAData}
                      categories={["Variant Allele Frequency", "Tumor Fraction"]}
                      index="name"
                      colors={["#2563eb", "#7c3aed"]}
                    />
                  </div>

                  <div className="mt-6 space-y-4">
                    <h3 className="text-lg font-medium">Key Observations</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="border rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <TrendingDown className="h-5 w-5 text-green-500" />
                          <h4 className="font-medium">Initial Response</h4>
                        </div>
                        <p className="text-sm mt-2">
                          Weeks 0-10 showed steady decline in ctDNA levels, indicating good response to therapy with 96%
                          reduction in tumor fraction.
                        </p>
                      </div>

                      <div className="border rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <Activity className="h-5 w-5 text-blue-500" />
                          <h4 className="font-medium">Molecular Remission</h4>
                        </div>
                        <p className="text-sm mt-2">
                          Week 10 showed ctDNA levels approaching the limit of detection (0.1%), suggesting
                          near-complete molecular response.
                        </p>
                      </div>

                      <div className="border rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-red-500" />
                          <h4 className="font-medium">Emerging Resistance</h4>
                        </div>
                        <p className="text-sm mt-2">
                          Weeks 12-14 show a concerning upward trend in ctDNA levels, with 5-fold increase from nadir,
                          suggesting emerging resistance.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resistance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Resistance Mutation Analysis</CardTitle>
                  <CardDescription>Tracking and analysis of emerging resistance mechanisms</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800">
                    <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <AlertTitle className="text-amber-600 dark:text-amber-400">
                      Multiple Resistance Mechanisms Detected
                    </AlertTitle>
                    <AlertDescription className="text-amber-700 dark:text-amber-300">
                      AGENT has detected two concurrent resistance mechanisms emerging in recent samples.
                    </AlertDescription>
                  </Alert>

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Gene</TableHead>
                          <TableHead>Mutation</TableHead>
                          <TableHead>First Detected</TableHead>
                          <TableHead>Current VAF</TableHead>
                          <TableHead>Trend</TableHead>
                          <TableHead>Significance</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {resistanceMutations.map((mutation, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{mutation.gene}</TableCell>
                            <TableCell>{mutation.mutation}</TableCell>
                            <TableCell>{mutation.firstDetected}</TableCell>
                            <TableCell>{mutation.currentVAF}%</TableCell>
                            <TableCell>
                              {mutation.trend === "increasing" ? (
                                <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">
                                  <TrendingUp className="h-3 w-3 mr-1" />
                                  Increasing
                                </Badge>
                              ) : (
                                <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
                                  <Activity className="h-3 w-3 mr-1" />
                                  Stable
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>{mutation.significance}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">AI-Powered Resistance Analysis</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Mechanism of Resistance</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">
                            The concurrent emergence of EGFR T790M mutation and MET amplification suggests two
                            independent resistance mechanisms:
                          </p>
                          <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                            <li>Target modification (T790M) preventing drug binding</li>
                            <li>Bypass pathway activation (MET) circumventing EGFR inhibition</li>
                          </ul>
                          <p className="text-sm mt-3">
                            This pattern is consistent with heterogeneous resistance development and suggests the need
                            for combination therapy.
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Therapeutic Implications</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">Based on the resistance profile, AGENT recommends:</p>
                          <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                            <li>Switch to osimertinib (3rd-gen EGFR TKI effective against T790M)</li>
                            <li>Add savolitinib (selective MET inhibitor) to address MET amplification</li>
                            <li>Consider clinical trial METEOR-2 testing this combination</li>
                          </ul>
                          <div className="mt-3 flex items-center gap-2">
                            <Badge className="bg-green-100 text-green-800">85% Predicted Response</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="therapy-response" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Therapy Response Assessment</CardTitle>
                  <CardDescription>Comprehensive evaluation of treatment efficacy</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Molecular Response</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col items-center">
                          <div className="relative h-32 w-32">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-3xl font-bold">96%</span>
                            </div>
                            <svg className="h-32 w-32" viewBox="0 0 100 100">
                              <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                              <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke="#2563eb"
                                strokeWidth="10"
                                strokeDasharray="283"
                                strokeDashoffset="11.32"
                                transform="rotate(-90 50 50)"
                              />
                            </svg>
                          </div>
                          <p className="text-sm font-medium mt-2">Maximum ctDNA Reduction</p>
                          <p className="text-xs text-muted-foreground">From baseline to nadir (Week 10)</p>
                        </div>

                        <div className="mt-4">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Current Response</span>
                            <Badge className="bg-amber-100 text-amber-800">Partial Response</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Initial excellent response now showing signs of resistance
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Radiographic Response</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Tumor Size Reduction</span>
                              <span className="text-sm font-medium">65%</span>
                            </div>
                            <Progress value={65} className="h-2" />
                          </div>

                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Nodal Involvement</span>
                              <span className="text-sm font-medium">50%</span>
                            </div>
                            <Progress value={50} className="h-2" />
                          </div>

                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Overall Response</span>
                              <Badge className="bg-amber-100 text-amber-800">Partial Response</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">Per RECIST 1.1 criteria</p>
                          </div>

                          <div className="pt-2">
                            <p className="text-sm">
                              <span className="font-medium">Next Imaging:</span> May 20, 2025
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Clinical Response</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Performance Status</span>
                              <span className="text-sm font-medium">ECOG 1</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Improved from ECOG 2 at baseline</p>
                          </div>

                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Symptom Burden</span>
                              <Badge className="bg-green-100 text-green-800">Improved</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">Reduced cough, improved energy levels</p>
                          </div>

                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Quality of Life</span>
                              <span className="text-sm font-medium">75/100</span>
                            </div>
                            <Progress value={75} className="h-2" />
                            <p className="text-xs text-muted-foreground">Improved from 45/100 at baseline</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">AI-Powered Therapy Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Alert>
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Therapy Adjustment Recommended</AlertTitle>
                          <AlertDescription>
                            Based on the emergence of resistance mutations, AGENT recommends adjusting the current
                            treatment regimen.
                          </AlertDescription>
                        </Alert>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Current Therapy</h4>
                            <div className="border rounded-md p-3">
                              <p className="font-medium">Erlotinib</p>
                              <p className="text-sm">150mg daily</p>
                              <div className="flex items-center gap-1 mt-1">
                                <Badge variant="outline" className="bg-red-50 text-red-800 border-red-200">
                                  Resistance Detected
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Recommended Therapy</h4>
                            <div className="border rounded-md p-3">
                              <div className="space-y-3">
                                <div>
                                  <p className="font-medium">Osimertinib</p>
                                  <p className="text-sm">80mg daily</p>
                                  <p className="text-xs text-muted-foreground">Targets EGFR T790M</p>
                                </div>
                                <div className="border-t pt-2">
                                  <p className="font-medium">Savolitinib</p>
                                  <p className="text-sm">600mg daily</p>
                                  <p className="text-xs text-muted-foreground">Targets MET amplification</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="pt-2">
                          <h4 className="text-sm font-medium mb-2">Supporting Evidence</h4>
                          <ul className="list-disc pl-5 space-y-1 text-sm">
                            <li>
                              TATTON Phase Ib trial showed 52% ORR with osimertinib + savolitinib in EGFR-mutant,
                              MET-amplified NSCLC
                            </li>
                            <li>SAVANNAH trial demonstrated safety and efficacy in the post-EGFR TKI setting</li>
                            <li>Digital twin simulation predicts 85% probability of response to this combination</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" className="gap-1">
            <FileText className="h-4 w-4" />
            Download Report
          </Button>
          <Button className="gap-1">
            <Pill className="h-4 w-4" />
            Adjust Treatment Plan
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
