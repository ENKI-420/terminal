"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Link,
  Settings,
  Database,
  RefreshCw,
  AlertCircle,
  Clock,
  User,
  Calendar,
  Pill,
  Dna,
  Microscope,
  Clipboard,
  Download,
  ExternalLink,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function EpicIntegration() {
  const [isConnected, setIsConnected] = useState(true)
  const [activeTab, setActiveTab] = useState("patient-data")
  const [syncStatus, setSyncStatus] = useState("synced") // synced, syncing, error
  const [lastSyncTime, setLastSyncTime] = useState("Today at 10:30 AM")
  const { toast } = useToast()

  // Mock patient data from Epic
  const patientData = {
    demographics: {
      name: "John Smith",
      dob: "05/15/1965",
      mrn: "MRN12345678",
      gender: "Male",
      address: "123 Main St, Anytown, CA 12345",
      phone: "(555) 123-4567",
      email: "john.smith@example.com",
      insurance: "Blue Cross Blue Shield",
      pcp: "Dr. Robert Johnson",
    },
    diagnoses: [
      {
        code: "C92.00",
        description: "Acute myeloid leukemia, not having achieved remission",
        date: "03/10/2025",
        provider: "Dr. Sarah Johnson",
      },
      {
        code: "D64.9",
        description: "Anemia, unspecified",
        date: "03/10/2025",
        provider: "Dr. Sarah Johnson",
      },
      {
        code: "D70.9",
        description: "Neutropenia, unspecified",
        date: "03/10/2025",
        provider: "Dr. Sarah Johnson",
      },
    ],
    medications: [
      {
        name: "Venetoclax",
        dose: "400 mg",
        frequency: "Once daily",
        startDate: "03/15/2025",
        endDate: "",
        prescriber: "Dr. Sarah Johnson",
        status: "Active",
      },
      {
        name: "Azacitidine",
        dose: "75 mg/m²",
        frequency: "Days 1-7 of each 28-day cycle",
        startDate: "03/15/2025",
        endDate: "",
        prescriber: "Dr. Sarah Johnson",
        status: "Active",
      },
      {
        name: "Acyclovir",
        dose: "400 mg",
        frequency: "Twice daily",
        startDate: "03/15/2025",
        endDate: "",
        prescriber: "Dr. Michael Chen",
        status: "Active",
      },
      {
        name: "Posaconazole",
        dose: "300 mg",
        frequency: "Once daily",
        startDate: "03/15/2025",
        endDate: "",
        prescriber: "Dr. Michael Chen",
        status: "Active",
      },
    ],
    labResults: [
      {
        name: "Complete Blood Count (CBC)",
        date: "04/01/2025",
        results: [
          { test: "WBC", value: "3.2", unit: "K/µL", range: "4.5-11.0", flag: "L" },
          { test: "RBC", value: "3.5", unit: "M/µL", range: "4.5-5.9", flag: "L" },
          { test: "Hemoglobin", value: "10.5", unit: "g/dL", range: "13.5-17.5", flag: "L" },
          { test: "Hematocrit", value: "32.0", unit: "%", range: "41.0-53.0", flag: "L" },
          { test: "Platelets", value: "120", unit: "K/µL", range: "150-450", flag: "L" },
          { test: "Neutrophils", value: "1.8", unit: "K/µL", range: "1.8-7.7", flag: "" },
          { test: "Lymphocytes", value: "1.0", unit: "K/µL", range: "1.0-4.8", flag: "" },
        ],
      },
      {
        name: "Comprehensive Metabolic Panel (CMP)",
        date: "04/01/2025",
        results: [
          { test: "Sodium", value: "138", unit: "mmol/L", range: "136-145", flag: "" },
          { test: "Potassium", value: "4.2", unit: "mmol/L", range: "3.5-5.1", flag: "" },
          { test: "Chloride", value: "102", unit: "mmol/L", range: "98-107", flag: "" },
          { test: "CO2", value: "24", unit: "mmol/L", range: "21-32", flag: "" },
          { test: "BUN", value: "15", unit: "mg/dL", range: "7-20", flag: "" },
          { test: "Creatinine", value: "0.9", unit: "mg/dL", range: "0.6-1.2", flag: "" },
          { test: "Glucose", value: "95", unit: "mg/dL", range: "70-99", flag: "" },
          { test: "ALT", value: "25", unit: "U/L", range: "7-56", flag: "" },
          { test: "AST", value: "22", unit: "U/L", range: "10-40", flag: "" },
        ],
      },
      {
        name: "Molecular Testing",
        date: "04/01/2025",
        results: [
          { test: "FLT3-ITD", value: "Positive (8.5% VAF)", unit: "", range: "Negative", flag: "H" },
          { test: "NPM1", value: "Positive (14.1% VAF)", unit: "", range: "Negative", flag: "H" },
          { test: "CEBPA", value: "Negative", unit: "", range: "Negative", flag: "" },
          { test: "IDH1", value: "Negative", unit: "", range: "Negative", flag: "" },
          { test: "IDH2", value: "Negative", unit: "", range: "Negative", flag: "" },
        ],
      },
    ],
    appointments: [
      {
        type: "Oncology Follow-up",
        provider: "Dr. Sarah Johnson",
        date: "04/20/2025",
        time: "2:00 PM",
        location: "Cancer Center, Room 305",
        status: "Scheduled",
      },
      {
        type: "Bone Marrow Biopsy",
        provider: "Dr. Michael Chen",
        date: "04/15/2025",
        time: "10:30 AM",
        location: "Procedure Suite, Room 210",
        status: "Scheduled",
      },
      {
        type: "Genetic Counseling",
        provider: "Emily Rodriguez",
        date: "04/25/2025",
        time: "1:15 PM",
        location: "Cancer Center, Room 220",
        status: "Scheduled",
      },
    ],
  }

  // Handle sync with Epic
  const handleSync = () => {
    setSyncStatus("syncing")

    // Simulate sync delay
    setTimeout(() => {
      setSyncStatus("synced")
      setLastSyncTime("Just now")

      toast({
        title: "Sync Complete",
        description: "Data has been successfully synchronized with Epic.",
      })
    }, 2000)
  }

  // Handle connection toggle
  const handleConnectionToggle = () => {
    setIsConnected(!isConnected)

    toast({
      title: isConnected ? "Disconnected from Epic" : "Connected to Epic",
      description: isConnected
        ? "The connection to Epic has been disabled."
        : "Successfully connected to Epic Hyperdrive.",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-600" />
                Epic Hyperdrive Integration
              </CardTitle>
              <CardDescription>Manage your connection to Epic's EHR system</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  isConnected
                    ? syncStatus === "synced"
                      ? "outline"
                      : syncStatus === "syncing"
                        ? "outline"
                        : "destructive"
                    : "secondary"
                }
                className={
                  isConnected
                    ? syncStatus === "synced"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800"
                      : syncStatus === "syncing"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                        : ""
                    : ""
                }
              >
                {isConnected
                  ? syncStatus === "synced"
                    ? "Connected & Synced"
                    : syncStatus === "syncing"
                      ? "Syncing..."
                      : "Sync Error"
                  : "Disconnected"}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSync}
                disabled={!isConnected || syncStatus === "syncing"}
                className="gap-1"
              >
                <RefreshCw className={`h-4 w-4 ${syncStatus === "syncing" ? "animate-spin" : ""}`} />
                Sync
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${isConnected ? "bg-green-500" : "bg-gray-300"}`}></div>
              <span className="text-sm font-medium">Connection Status</span>
            </div>
            <Switch checked={isConnected} onCheckedChange={handleConnectionToggle} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex flex-col">
              <span className="text-muted-foreground">Connection Type</span>
              <span className="font-medium">SMART on FHIR</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground">Epic Environment</span>
              <span className="font-medium">Production</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground">Last Sync</span>
              <span className="font-medium">{lastSyncTime}</span>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Data Synchronization</h3>
            <p className="text-sm text-muted-foreground">
              Control which data elements are synchronized between GenomicInsights and Epic.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="sync-demographics" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Patient Demographics
                </Label>
                <Switch id="sync-demographics" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="sync-diagnoses" className="flex items-center gap-2">
                  <Clipboard className="h-4 w-4 text-muted-foreground" />
                  Diagnoses
                </Label>
                <Switch id="sync-diagnoses" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="sync-medications" className="flex items-center gap-2">
                  <Pill className="h-4 w-4 text-muted-foreground" />
                  Medications
                </Label>
                <Switch id="sync-medications" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="sync-labs" className="flex items-center gap-2">
                  <Microscope className="h-4 w-4 text-muted-foreground" />
                  Lab Results
                </Label>
                <Switch id="sync-labs" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="sync-appointments" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Appointments
                </Label>
                <Switch id="sync-appointments" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="sync-genomics" className="flex items-center gap-2">
                  <Dna className="h-4 w-4 text-muted-foreground" />
                  Genomic Data
                </Label>
                <Switch id="sync-genomics" defaultChecked />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" className="gap-1">
            <Settings className="h-4 w-4" />
            Advanced Settings
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-1">
              <Link className="h-4 w-4" />
              Test Connection
            </Button>
            <Button className="gap-1" disabled={!isConnected}>
              <RefreshCw className="h-4 w-4" />
              Sync Now
            </Button>
          </div>
        </CardFooter>
      </Card>

      {isConnected && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <TabsTrigger value="patient-data" className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span className="hidden md:inline">Patient Data</span>
              <span className="md:hidden">Patient</span>
            </TabsTrigger>
            <TabsTrigger value="medications" className="flex items-center gap-1">
              <Pill className="h-4 w-4" />
              <span className="hidden md:inline">Medications</span>
              <span className="md:hidden">Meds</span>
            </TabsTrigger>
            <TabsTrigger value="lab-results" className="flex items-center gap-1">
              <Microscope className="h-4 w-4" />
              <span className="hidden md:inline">Lab Results</span>
              <span className="md:hidden">Labs</span>
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span className="hidden md:inline">Appointments</span>
              <span className="md:hidden">Appts</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="patient-data" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Patient Demographics</CardTitle>
                <CardDescription>Basic patient information from Epic</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-muted-foreground">Name</Label>
                      <p className="font-medium">{patientData.demographics.name}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Date of Birth</Label>
                      <p className="font-medium">{patientData.demographics.dob}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">MRN</Label>
                      <p className="font-medium">{patientData.demographics.mrn}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Gender</Label>
                      <p className="font-medium">{patientData.demographics.gender}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-muted-foreground">Address</Label>
                      <p className="font-medium">{patientData.demographics.address}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Phone</Label>
                      <p className="font-medium">{patientData.demographics.phone}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Email</Label>
                      <p className="font-medium">{patientData.demographics.email}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Primary Care Provider</Label>
                      <p className="font-medium">{patientData.demographics.pcp}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Diagnoses</CardTitle>
                <CardDescription>Current diagnoses from Epic</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patientData.diagnoses.map((diagnosis, index) => (
                    <div
                      key={index}
                      className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-4 border-b last:border-0 last:pb-0"
                    >
                      <div>
                        <p className="font-medium">{diagnosis.description}</p>
                        <p className="text-sm text-muted-foreground">Code: {diagnosis.code}</p>
                      </div>
                      <div className="flex flex-col items-start md:items-end">
                        <p className="text-sm">{diagnosis.date}</p>
                        <p className="text-sm text-muted-foreground">{diagnosis.provider}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full gap-1">
                  <ExternalLink className="h-4 w-4" />
                  View in Epic
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="medications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Current Medications</CardTitle>
                <CardDescription>Active medications from Epic</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patientData.medications.map((medication, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{medication.name}</h3>
                            <Badge
                              variant="outline"
                              className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800"
                            >
                              {medication.status}
                            </Badge>
                          </div>
                          <p className="text-sm">
                            {medication.dose} - {medication.frequency}
                          </p>
                        </div>
                        <div className="flex flex-col items-start md:items-end">
                          <p className="text-sm">Started: {medication.startDate}</p>
                          <p className="text-sm text-muted-foreground">Prescribed by: {medication.prescriber}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" className="gap-1">
                  <Download className="h-4 w-4" />
                  Download List
                </Button>
                <Button variant="outline" className="gap-1">
                  <ExternalLink className="h-4 w-4" />
                  View in Epic
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="lab-results" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Lab Results</CardTitle>
                <CardDescription>Recent laboratory results from Epic</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {patientData.labResults.map((labResult, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">{labResult.name}</h3>
                        <p className="text-sm text-muted-foreground">{labResult.date}</p>
                      </div>
                      <div className="border rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-border">
                          <thead className="bg-muted/50">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Test</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Result</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Units</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">
                                Reference Range
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Flag</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {labResult.results.map((result, resultIndex) => (
                              <tr key={resultIndex} className={resultIndex % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                                <td className="px-4 py-2 text-sm">{result.test}</td>
                                <td className="px-4 py-2 text-sm font-medium">{result.value}</td>
                                <td className="px-4 py-2 text-sm">{result.unit}</td>
                                <td className="px-4 py-2 text-sm">{result.range}</td>
                                <td className="px-4 py-2 text-sm">
                                  {result.flag && (
                                    <Badge
                                      variant="outline"
                                      className={
                                        result.flag === "H"
                                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800"
                                          : result.flag === "L"
                                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800"
                                            : ""
                                      }
                                    >
                                      {result.flag}
                                    </Badge>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" className="gap-1">
                  <Download className="h-4 w-4" />
                  Download Results
                </Button>
                <Button variant="outline" className="gap-1">
                  <ExternalLink className="h-4 w-4" />
                  View in Epic
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
                <CardDescription>Scheduled appointments from Epic</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patientData.appointments.map((appointment, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <div>
                          <h3 className="font-medium">{appointment.type}</h3>
                          <p className="text-sm">Provider: {appointment.provider}</p>
                          <p className="text-sm text-muted-foreground">Location: {appointment.location}</p>
                        </div>
                        <div className="flex flex-col items-start md:items-end">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <p className="text-sm">{appointment.date}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <p className="text-sm">{appointment.time}</p>
                          </div>
                          <Badge
                            variant="outline"
                            className="mt-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                          >
                            {appointment.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" className="gap-1">
                  <Download className="h-4 w-4" />
                  Export to Calendar
                </Button>
                <Button variant="outline" className="gap-1">
                  <ExternalLink className="h-4 w-4" />
                  View in Epic
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Data Exchange Settings</CardTitle>
          <CardDescription>Configure how data is shared between GenomicInsights and Epic</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Data Flow Direction</h3>
            <Select defaultValue="bidirectional">
              <SelectTrigger>
                <SelectValue placeholder="Select data flow direction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bidirectional">Bidirectional (Read & Write)</SelectItem>
                <SelectItem value="read-only">Read Only (Epic → GenomicInsights)</SelectItem>
                <SelectItem value="write-only">Write Only (GenomicInsights → Epic)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Sync Frequency</h3>
            <Select defaultValue="realtime">
              <SelectTrigger>
                <SelectValue placeholder="Select sync frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="realtime">Real-time</SelectItem>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="manual">Manual Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-sync" className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-muted-foreground" />
                Automatic Synchronization
              </Label>
              <Switch id="auto-sync" defaultChecked />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="conflict-resolution" className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                Prompt on Data Conflicts
              </Label>
              <Switch id="conflict-resolution" defaultChecked />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="audit-logging" className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                Enable Audit Logging
              </Label>
              <Switch id="audit-logging" defaultChecked />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Save Settings</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
