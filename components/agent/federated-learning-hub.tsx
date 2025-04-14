"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Lock,
  Shield,
  Database,
  Globe,
  BarChart,
  Users,
  Building,
  CheckCircle,
  RefreshCw,
  FileText,
  Settings,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart } from "@/components/charts"

export function FederatedLearningHub() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isTraining, setIsTraining] = useState(false)

  // Mock data for federated learning
  const federatedPartners = [
    {
      id: 1,
      name: "Memorial Sloan Kettering",
      type: "Cancer Center",
      location: "New York, NY",
      dataContribution: 2450,
      lastSync: "2 hours ago",
      status: "active",
    },
    {
      id: 2,
      name: "MD Anderson",
      type: "Cancer Center",
      location: "Houston, TX",
      dataContribution: 1850,
      lastSync: "4 hours ago",
      status: "active",
    },
    {
      id: 3,
      name: "Dana-Farber Cancer Institute",
      type: "Cancer Center",
      location: "Boston, MA",
      dataContribution: 1620,
      lastSync: "6 hours ago",
      status: "active",
    },
    {
      id: 4,
      name: "Mayo Clinic",
      type: "Hospital System",
      location: "Rochester, MN",
      dataContribution: 1380,
      lastSync: "8 hours ago",
      status: "active",
    },
    {
      id: 5,
      name: "Roche Pharmaceuticals",
      type: "Pharmaceutical",
      location: "Basel, Switzerland",
      dataContribution: 980,
      lastSync: "12 hours ago",
      status: "active",
    },
    {
      id: 6,
      name: "National Cancer Institute",
      type: "Research Institute",
      location: "Bethesda, MD",
      dataContribution: 2100,
      lastSync: "1 day ago",
      status: "active",
    },
    {
      id: 7,
      name: "AstraZeneca",
      type: "Pharmaceutical",
      location: "Cambridge, UK",
      dataContribution: 850,
      lastSync: "2 days ago",
      status: "inactive",
    },
  ]

  const modelPerformanceData = [
    { name: "Jan", Accuracy: 78, Precision: 75, Recall: 72 },
    { name: "Feb", Accuracy: 80, Precision: 77, Recall: 74 },
    { name: "Mar", Accuracy: 82, Precision: 79, Recall: 76 },
    { name: "Apr", Accuracy: 85, Precision: 82, Recall: 80 },
    { name: "May", Accuracy: 87, Precision: 84, Recall: 83 },
    { name: "Jun", Accuracy: 89, Precision: 86, Recall: 85 },
    { name: "Jul", Accuracy: 91, Precision: 88, Recall: 87 },
  ]

  const handleStartTraining = () => {
    setIsTraining(true)

    // Simulate training completion
    setTimeout(() => {
      setIsTraining(false)
    }, 3000)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">Privacy-Preserving Collaboration</CardTitle>
              <CardDescription>
                Federated learning across healthcare institutions without sharing sensitive data
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                <Shield className="h-3 w-3 mr-1" />
                HIPAA Compliant
              </Badge>
              <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                <Globe className="h-3 w-3 mr-1" />
                GDPR Compliant
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <TabsTrigger value="overview" className="flex items-center gap-1">
                <Shield className="h-4 w-4" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger value="partners" className="flex items-center gap-1">
                <Building className="h-4 w-4" />
                <span>Partners</span>
              </TabsTrigger>
              <TabsTrigger value="model" className="flex items-center gap-1">
                <BarChart className="h-4 w-4" />
                <span>Model Performance</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-1">
                <Lock className="h-4 w-4" />
                <span>Security</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertTitle>Privacy-First Collaboration</AlertTitle>
                <AlertDescription>
                  AGENT uses federated learning to train AI models across institutions without sharing sensitive patient
                  data.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-500" />
                      Network Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Active Partners</span>
                        <span className="font-medium">6</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Total Patient Cases</span>
                        <span className="font-medium">11,230</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Genomic Profiles</span>
                        <span className="font-medium">8,450</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Treatment Outcomes</span>
                        <span className="font-medium">9,780</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BarChart className="h-5 w-5 text-purple-500" />
                      Model Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Current Version</span>
                        <span className="font-medium">v2.4.1</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Last Updated</span>
                        <span className="font-medium">Yesterday, 3:45 PM</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Training Rounds</span>
                        <span className="font-medium">128</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Overall Accuracy</span>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">91%</span>
                          <Badge className="bg-green-100 text-green-800">+2%</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Lock className="h-5 w-5 text-green-500" />
                      Privacy Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Differential Privacy</span>
                        </div>
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          Active
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Secure Aggregation</span>
                        </div>
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          Active
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Encrypted Gradients</span>
                        </div>
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          Active
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Audit Logging</span>
                        </div>
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          Active
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>How Federated Learning Works</CardTitle>
                  <CardDescription>
                    Training AI models across institutions without sharing sensitive patient data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="space-y-2 text-center">
                      <div className="mx-auto bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full w-16 h-16 flex items-center justify-center">
                        <Database className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="font-medium">1. Local Data Stays Local</h3>
                      <p className="text-sm text-muted-foreground">
                        Patient data never leaves your institution's secure environment
                      </p>
                    </div>

                    <div className="space-y-2 text-center">
                      <div className="mx-auto bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full w-16 h-16 flex items-center justify-center">
                        <BarChart className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                      </div>
                      <h3 className="font-medium">2. Local Model Training</h3>
                      <p className="text-sm text-muted-foreground">
                        Each institution trains the model on their local data
                      </p>
                    </div>

                    <div className="space-y-2 text-center">
                      <div className="mx-auto bg-green-100 dark:bg-green-900/30 p-3 rounded-full w-16 h-16 flex items-center justify-center">
                        <Lock className="h-8 w-8 text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className="font-medium">3. Secure Updates</h3>
                      <p className="text-sm text-muted-foreground">
                        Only encrypted model updates are shared, not patient data
                      </p>
                    </div>

                    <div className="space-y-2 text-center">
                      <div className="mx-auto bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full w-16 h-16 flex items-center justify-center">
                        <RefreshCw className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                      </div>
                      <h3 className="font-medium">4. Global Aggregation</h3>
                      <p className="text-sm text-muted-foreground">
                        Updates are securely combined to improve the global model
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="partners" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Federated Learning Network</CardTitle>
                  <CardDescription>Institutions participating in the collaborative network</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Institution</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Data Contribution</TableHead>
                          <TableHead>Last Sync</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {federatedPartners.map((partner) => (
                          <TableRow key={partner.id}>
                            <TableCell className="font-medium">{partner.name}</TableCell>
                            <TableCell>{partner.type}</TableCell>
                            <TableCell>{partner.location}</TableCell>
                            <TableCell>{partner.dataContribution} cases</TableCell>
                            <TableCell>{partner.lastSync}</TableCell>
                            <TableCell>
                              {partner.status === "active" ? (
                                <Badge className="bg-green-100 text-green-800">Active</Badge>
                              ) : (
                                <Badge variant="outline">Inactive</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Data Contribution</CardTitle>
                    <CardDescription>Distribution of data across partner institutions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded-md">
                      <p className="text-muted-foreground">Data contribution chart</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Network Growth</CardTitle>
                    <CardDescription>Expansion of the federated learning network over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded-md">
                      <p className="text-muted-foreground">Network growth chart</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="model" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <CardTitle>Model Performance</CardTitle>
                      <CardDescription>Performance metrics of the federated learning model</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleStartTraining}
                        disabled={isTraining}
                        className="gap-1"
                      >
                        <RefreshCw className={`h-4 w-4 ${isTraining ? "animate-spin" : ""}`} />
                        {isTraining ? "Training..." : "Start Training Round"}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="h-[300px]">
                    <LineChart
                      data={modelPerformanceData}
                      categories={["Accuracy", "Precision", "Recall"]}
                      index="name"
                      colors={["#2563eb", "#7c3aed", "#db2777"]}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold">91%</div>
                          <p className="text-sm font-medium mt-1">Accuracy</p>
                          <p className="text-xs text-muted-foreground">+2% from previous version</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold">88%</div>
                          <p className="text-sm font-medium mt-1">Precision</p>
                          <p className="text-xs text-muted-foreground">+2% from previous version</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold">87%</div>
                          <p className="text-sm font-medium mt-1">Recall</p>
                          <p className="text-xs text-muted-foreground">+2% from previous version</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Training History</h3>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Round</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Participants</TableHead>
                            <TableHead>Accuracy</TableHead>
                            <TableHead>Improvement</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">128</TableCell>
                            <TableCell>Jul 5, 2025</TableCell>
                            <TableCell>6 institutions</TableCell>
                            <TableCell>91%</TableCell>
                            <TableCell>
                              <Badge className="bg-green-100 text-green-800">+2%</Badge>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">127</TableCell>
                            <TableCell>Jun 28, 2025</TableCell>
                            <TableCell>6 institutions</TableCell>
                            <TableCell>89%</TableCell>
                            <TableCell>
                              <Badge className="bg-green-100 text-green-800">+2%</Badge>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">126</TableCell>
                            <TableCell>Jun 21, 2025</TableCell>
                            <TableCell>5 institutions</TableCell>
                            <TableCell>87%</TableCell>
                            <TableCell>
                              <Badge className="bg-green-100 text-green-800">+2%</Badge>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy & Security</CardTitle>
                  <CardDescription>Comprehensive privacy and security measures for federated learning</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Privacy Techniques</h3>

                      <div className="space-y-3">
                        <div className="p-3 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-green-500" />
                            <h4 className="font-medium">Differential Privacy</h4>
                          </div>
                          <p className="text-sm mt-1">
                            Mathematical guarantee that individual patient data cannot be reverse-engineered from model
                            updates.
                          </p>
                          <div className="mt-2">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Privacy Budget (ε)</span>
                              <span className="text-sm font-medium">2.5</span>
                            </div>
                            <Progress value={25} className="h-2" />
                            <p className="text-xs text-muted-foreground mt-1">
                              Lower values provide stronger privacy guarantees
                            </p>
                          </div>
                        </div>

                        <div className="p-3 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <Lock className="h-5 w-5 text-blue-500" />
                            <h4 className="font-medium">Secure Aggregation</h4>
                          </div>
                          <p className="text-sm mt-1">
                            Cryptographic protocol that allows model updates to be aggregated without any party seeing
                            individual contributions.
                          </p>
                        </div>

                        <div className="p-3 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <Database className="h-5 w-5 text-purple-500" />
                            <h4 className="font-medium">Local Data Isolation</h4>
                          </div>
                          <p className="text-sm mt-1">
                            Patient data never leaves your institution's secure environment. Only model parameters are
                            shared.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Security & Compliance</h3>

                      <div className="space-y-3">
                        <div className="p-3 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-amber-500" />
                            <h4 className="font-medium">Compliance</h4>
                          </div>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-sm">HIPAA</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-sm">GDPR</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-sm">CCPA</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-sm">SOC 2</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-3 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-red-500" />
                            <h4 className="font-medium">Audit Logging</h4>
                          </div>
                          <p className="text-sm mt-1">
                            Comprehensive audit trails for all model training, updates, and access events.
                          </p>
                          <Button variant="link" size="sm" className="mt-1 h-auto p-0">
                            View Audit Logs
                          </Button>
                        </div>

                        <div className="p-3 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-green-500" />
                            <h4 className="font-medium">Access Controls</h4>
                          </div>
                          <p className="text-sm mt-1">
                            Role-based access controls ensure only authorized personnel can access model and training
                            functions.
                          </p>
                          <Button variant="link" size="sm" className="mt-1 h-auto p-0">
                            Manage Access
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
                    <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <AlertTitle className="text-blue-600 dark:text-blue-400">Privacy Impact Assessment</AlertTitle>
                    <AlertDescription className="text-blue-700 dark:text-blue-300">
                      The last privacy impact assessment was conducted on June 15, 2025. No vulnerabilities were
                      identified.
                    </AlertDescription>
                  </Alert>
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
            <Settings className="h-4 w-4" />
            Configure Settings
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
