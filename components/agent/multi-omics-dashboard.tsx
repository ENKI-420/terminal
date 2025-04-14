"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { LineChart } from "@/components/charts"
import {
  Dna,
  Activity,
  FileText,
  ImageIcon,
  Database,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Zap,
  Lock,
  Share2,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function MultiOmicsDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(false)
  const [lastSyncTime, setLastSyncTime] = useState("10 minutes ago")
  const { toast } = useToast()

  // Mock data for multi-omics integration
  const genomicsData = [
    { name: "Jan", Mutations: 12, CNVs: 5, Fusions: 2 },
    { name: "Feb", Mutations: 14, CNVs: 6, Fusions: 3 },
    { name: "Mar", Mutations: 10, CNVs: 4, Fusions: 1 },
    { name: "Apr", Mutations: 15, CNVs: 7, Fusions: 4 },
    { name: "May", Mutations: 13, CNVs: 5, Fusions: 2 },
    { name: "Jun", Mutations: 18, CNVs: 8, Fusions: 5 },
  ]

  const proteomicsData = [
    { name: "Jan", HER2: 45, "PD-L1": 20, EGFR: 30 },
    { name: "Feb", HER2: 50, "PD-L1": 25, EGFR: 35 },
    { name: "Mar", HER2: 40, "PD-L1": 15, EGFR: 25 },
    { name: "Apr", HER2: 55, "PD-L1": 30, EGFR: 40 },
    { name: "May", HER2: 60, "PD-L1": 35, EGFR: 45 },
    { name: "Jun", HER2: 65, "PD-L1": 40, EGFR: 50 },
  ]

  const radiomicsData = [
    { name: "Jan", "Tumor Volume": 45, Heterogeneity: 60, Necrosis: 20 },
    { name: "Feb", "Tumor Volume": 42, Heterogeneity: 55, Necrosis: 18 },
    { name: "Mar", "Tumor Volume": 38, Heterogeneity: 50, Necrosis: 15 },
    { name: "Apr", "Tumor Volume": 35, Heterogeneity: 45, Necrosis: 12 },
    { name: "May", "Tumor Volume": 30, Heterogeneity: 40, Necrosis: 10 },
    { name: "Jun", "Tumor Volume": 25, Heterogeneity: 35, Necrosis: 8 },
  ]

  const handleSyncData = () => {
    setIsLoading(true)

    // Simulate API call to sync data
    setTimeout(() => {
      setIsLoading(false)
      setLastSyncTime("Just now")

      toast({
        title: "Data Synchronized",
        description: "Multi-omics data has been successfully synchronized via Redox.",
      })
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">Dynamic Multi-Omics Synthesis</CardTitle>
              <CardDescription>Integrated analysis of genomics, proteomics, and radiomics data</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                Redox Connected
              </Badge>
              <Button variant="outline" size="sm" onClick={handleSyncData} disabled={isLoading} className="gap-1">
                <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                {isLoading ? "Syncing..." : "Sync Data"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground mb-4">
            Last synchronized: {lastSyncTime} • Data sources: Epic EHR, Illumina Connect, Thermo Fisher Cloud
          </div>

          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <TabsTrigger value="overview" className="flex items-center gap-1">
                <Activity className="h-4 w-4" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger value="genomics" className="flex items-center gap-1">
                <Dna className="h-4 w-4" />
                <span>Genomics</span>
              </TabsTrigger>
              <TabsTrigger value="proteomics" className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>Proteomics</span>
              </TabsTrigger>
              <TabsTrigger value="radiomics" className="flex items-center gap-1">
                <ImageIcon className="h-4 w-4" />
                <span>Radiomics</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Dna className="h-5 w-5 text-blue-500" />
                      Genomics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Key Mutations</span>
                        <span className="font-medium">18</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Copy Number Variations</span>
                        <span className="font-medium">8</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Gene Fusions</span>
                        <span className="font-medium">5</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tumor Mutation Burden</span>
                        <span className="font-medium">12.4 mut/Mb</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5 text-purple-500" />
                      Proteomics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>HER2 Expression</span>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">65%</span>
                          <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
                            HER2-low
                          </Badge>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>PD-L1 Expression</span>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">40%</span>
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            Positive
                          </Badge>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>EGFR Expression</span>
                        <span className="font-medium">50%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <ImageIcon className="h-5 w-5 text-red-500" />
                      Radiomics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Tumor Volume</span>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">25 cm³</span>
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            -44% ↓
                          </Badge>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Heterogeneity Score</span>
                        <span className="font-medium">35/100</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Necrosis</span>
                        <span className="font-medium">8%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Multi-Omics Integration</CardTitle>
                  <CardDescription>AI-driven synthesis of genomic, proteomic, and radiomic data</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">Treatment Response Prediction</p>
                        <p className="text-sm text-muted-foreground">
                          Based on integrated biomarkers, AGENT predicts 85% likelihood of response to current therapy.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-amber-500" />
                      <div>
                        <p className="font-medium">Resistance Monitoring</p>
                        <p className="text-sm text-muted-foreground">
                          Early molecular signs of resistance detected in ctDNA. Recommend increased monitoring
                          frequency.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">Novel Therapeutic Targets</p>
                        <p className="text-sm text-muted-foreground">
                          Integrated analysis identified PI3K pathway activation as a potential target for combination
                          therapy.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="genomics">
              <Card>
                <CardHeader>
                  <CardTitle>Genomic Profile</CardTitle>
                  <CardDescription>Comprehensive genomic analysis from NGS data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="h-[300px]">
                    <LineChart
                      data={genomicsData}
                      categories={["Mutations", "CNVs", "Fusions"]}
                      index="name"
                      colors={["#2563eb", "#7c3aed", "#db2777"]}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Key Driver Mutations</h3>
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">EGFR L858R</span>
                          <Badge>Pathogenic</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">TP53 R273H</span>
                          <Badge>Pathogenic</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">KRAS G12C</span>
                          <Badge>Pathogenic</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">PIK3CA E545K</span>
                          <Badge>Pathogenic</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Genomic Signatures</h3>
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Microsatellite Status</span>
                          <Badge variant="outline">MSS</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Tumor Mutation Burden</span>
                          <Badge variant="outline">12.4 mut/Mb (High)</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Homologous Recombination</span>
                          <Badge variant="outline">Proficient</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">APOBEC Signature</span>
                          <Badge variant="outline">Present</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="proteomics">
              <Card>
                <CardHeader>
                  <CardTitle>Proteomic Profile</CardTitle>
                  <CardDescription>Mass spectrometry-based protein expression analysis</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="h-[300px]">
                    <LineChart
                      data={proteomicsData}
                      categories={["HER2", "PD-L1", "EGFR"]}
                      index="name"
                      colors={["#2563eb", "#7c3aed", "#db2777"]}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Key Protein Biomarkers</h3>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">HER2</span>
                            <span className="text-sm font-medium">65%</span>
                          </div>
                          <Progress value={65} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">PD-L1</span>
                            <span className="text-sm font-medium">40%</span>
                          </div>
                          <Progress value={40} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">EGFR</span>
                            <span className="text-sm font-medium">50%</span>
                          </div>
                          <Progress value={50} className="h-2" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Pathway Activation</h3>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">PI3K/AKT/mTOR</span>
                            <span className="text-sm font-medium">75%</span>
                          </div>
                          <Progress value={75} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">MAPK/ERK</span>
                            <span className="text-sm font-medium">60%</span>
                          </div>
                          <Progress value={60} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">JAK/STAT</span>
                            <span className="text-sm font-medium">45%</span>
                          </div>
                          <Progress value={45} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="radiomics">
              <Card>
                <CardHeader>
                  <CardTitle>Radiomic Profile</CardTitle>
                  <CardDescription>Quantitative features extracted from medical imaging</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="h-[300px]">
                    <LineChart
                      data={radiomicsData}
                      categories={["Tumor Volume", "Heterogeneity", "Necrosis"]}
                      index="name"
                      colors={["#2563eb", "#7c3aed", "#db2777"]}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Tumor Characteristics</h3>
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Location</span>
                          <span className="text-sm font-medium">Right Upper Lobe</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Volume</span>
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-medium">25 cm³</span>
                            <Badge className="bg-green-100 text-green-800">-44% ↓</Badge>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Longest Diameter</span>
                          <span className="text-sm font-medium">3.2 cm</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Shape Complexity</span>
                          <span className="text-sm font-medium">Moderate</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Texture Analysis</h3>
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Heterogeneity</span>
                          <span className="text-sm font-medium">35/100</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Necrosis</span>
                          <span className="text-sm font-medium">8%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Contrast Enhancement</span>
                          <span className="text-sm font-medium">Moderate</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Invasiveness Score</span>
                          <span className="text-sm font-medium">42/100</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-2 justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Data integrated via Redox from 3 sources</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-1">
              <Lock className="h-4 w-4" />
              Privacy Settings
            </Button>
            <Button variant="outline" className="gap-1">
              <Share2 className="h-4 w-4" />
              Share Report
            </Button>
            <Button className="gap-1">
              <FileText className="h-4 w-4" />
              Generate Report
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
