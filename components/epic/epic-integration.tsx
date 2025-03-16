"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SecurityBadge } from "@/components/ui/security-badge"
import {
  IconLock,
  IconUserCheck,
  IconCalendar,
  IconClipboardList,
  IconFlask,
  IconDna,
  IconFileText,
  IconExternalLink,
  IconBuildingHospital,
} from "@tabler/icons-react"
import { PatientTimeline } from "@/components/epic/patient-timeline"
import { BeakerReportCard } from "@/components/epic/beaker-report-card"

interface EpicIntegrationProps {
  patientId?: string
}

export function EpicIntegration({ patientId }: EpicIntegrationProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [patientData, setPatientData] = useState<any>(null)
  const [reports, setReports] = useState<any[]>([])

  useEffect(() => {
    // Check if authenticated with Epic
    const checkAuthentication = async () => {
      try {
        // In a real implementation, this would check the authentication status with the Epic FHIR API
        // For this demo, we'll simulate it
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Simulate authentication status
        const epicAuthenticated = localStorage.getItem("epic_authenticated") === "true"
        setIsAuthenticated(epicAuthenticated)

        if (epicAuthenticated && patientId) {
          // Fetch patient data
          await fetchPatientData(patientId)
        }
      } catch (error) {
        console.error("Error checking Epic authentication:", error)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthentication()
  }, [patientId])

  const fetchPatientData = async (id: string) => {
    try {
      setIsLoading(true)

      // In a real implementation, this would fetch data from the Epic FHIR API
      // For this demo, we'll simulate it
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock patient data
      setPatientData({
        id,
        name: "John Doe",
        dob: "1975-05-15",
        gender: "Male",
        mrn: "MRN12345",
        diagnoses: [
          { code: "C34.1", description: "Malignant neoplasm of upper lobe, lung", date: "2022-03-15" },
          { code: "I10", description: "Essential (primary) hypertension", date: "2020-01-10" },
        ],
      })

      // Mock Beaker reports
      setReports([
        {
          id: "report-001",
          name: "Comprehensive Metabolic Panel",
          date: "2023-04-12",
          status: "Final",
          results: [
            { name: "Glucose", value: 95, unit: "mg/dL", range: "70-99", normal: true },
            { name: "Creatinine", value: 0.9, unit: "mg/dL", range: "0.6-1.2", normal: true },
            { name: "ALT", value: 32, unit: "U/L", range: "7-56", normal: true },
            { name: "AST", value: 28, unit: "U/L", range: "10-40", normal: true },
            { name: "Total Bilirubin", value: 0.8, unit: "mg/dL", range: "0.1-1.2", normal: true },
          ],
        },
        {
          id: "report-002",
          name: "Complete Blood Count",
          date: "2023-04-12",
          status: "Final",
          results: [
            { name: "WBC", value: 6.5, unit: "K/uL", range: "4.5-11.0", normal: true },
            { name: "RBC", value: 4.8, unit: "M/uL", range: "4.5-5.9", normal: true },
            { name: "Hemoglobin", value: 14.2, unit: "g/dL", range: "13.5-17.5", normal: true },
            { name: "Platelets", value: 250, unit: "K/uL", range: "150-450", normal: true },
          ],
        },
        {
          id: "report-003",
          name: "Genomic Sequencing Panel",
          date: "2023-03-28",
          status: "Final",
          results: [
            { name: "EGFR", value: "T790M Mutation Detected", unit: "", range: "Not Detected", normal: false },
            { name: "ALK", value: "No Rearrangement Detected", unit: "", range: "Not Detected", normal: true },
            { name: "ROS1", value: "No Rearrangement Detected", unit: "", range: "Not Detected", normal: true },
            { name: "PD-L1 Expression", value: "60%", unit: "TPS", range: "<1%", normal: false },
          ],
        },
      ])
    } catch (error) {
      console.error("Error fetching patient data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEpicLogin = () => {
    // In a real implementation, this would redirect to the Epic FHIR OAuth endpoint
    // For this demo, we'll simulate it
    localStorage.setItem("epic_authenticated", "true")
    setIsAuthenticated(true)

    if (patientId) {
      fetchPatientData(patientId)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <IconBuildingHospital className="h-5 w-5 text-primary mr-2" />
            Epic FHIR Integration
          </CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="processing-dot mr-2" />
            <span>Loading Epic data...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!isAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <IconBuildingHospital className="h-5 w-5 text-primary mr-2" />
            Epic FHIR Integration
          </CardTitle>
          <CardDescription>Connect to Epic to access patient data and Beaker reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4">
              <IconLock className="h-8 w-8 text-primary" />
            </div>

            <h3 className="text-lg font-semibold mb-2">Epic Authentication Required</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
              Connect to Epic FHIR to access patient data, Beaker laboratory reports, and genomic information.
            </p>

            <div className="bg-secondary/30 p-4 rounded-lg text-sm text-left max-w-md mx-auto mb-6">
              <h4 className="font-semibold mb-2">You'll get access to:</h4>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <IconUserCheck className="h-4 w-4 text-primary mr-2" />
                  <span>Patient demographics and diagnoses</span>
                </li>
                <li className="flex items-center">
                  <IconFlask className="h-4 w-4 text-primary mr-2" />
                  <span>Beaker laboratory reports</span>
                </li>
                <li className="flex items-center">
                  <IconDna className="h-4 w-4 text-primary mr-2" />
                  <span>Genomic test results</span>
                </li>
                <li className="flex items-center">
                  <IconCalendar className="h-4 w-4 text-primary mr-2" />
                  <span>Clinical timeline events</span>
                </li>
              </ul>
            </div>

            <Button onClick={handleEpicLogin} className="flex items-center">
              <IconBuildingHospital className="h-5 w-5 mr-2" />
              Connect with Epic
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!patientData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <IconBuildingHospital className="h-5 w-5 text-primary mr-2" />
            Epic FHIR Integration
          </CardTitle>
          <CardDescription>No patient selected</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4">
              <IconUserCheck className="h-8 w-8 text-primary" />
            </div>

            <h3 className="text-lg font-semibold mb-2">No Patient Selected</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
              Please select a patient to view their Epic data and Beaker reports.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <IconBuildingHospital className="h-5 w-5 text-primary mr-2" />
                Epic FHIR Integration
              </CardTitle>
              <CardDescription>Connected to Epic</CardDescription>
            </div>
            <SecurityBadge type="hipaa" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Patient Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-medium">{patientData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">DOB:</span>
                  <span className="font-medium">{patientData.dob}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gender:</span>
                  <span className="font-medium">{patientData.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">MRN:</span>
                  <span className="font-medium">{patientData.mrn}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Diagnoses</h3>
              <div className="space-y-3">
                {patientData.diagnoses.map((diagnosis: any, index: number) => (
                  <div key={index} className="bg-secondary/30 p-3 rounded-lg">
                    <div className="flex justify-between">
                      <span className="font-medium">{diagnosis.description}</span>
                      <span className="text-sm text-muted-foreground">{diagnosis.date}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">ICD-10: {diagnosis.code}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="timeline">
        <TabsList>
          <TabsTrigger value="timeline">
            <IconCalendar className="h-4 w-4 mr-2" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="reports">
            <IconClipboardList className="h-4 w-4 mr-2" />
            Beaker Reports
          </TabsTrigger>
          <TabsTrigger value="genomic">
            <IconDna className="h-4 w-4 mr-2" />
            Genomic Data
          </TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Patient Timeline</CardTitle>
              <CardDescription>Clinical events, treatments, and biomarkers</CardDescription>
            </CardHeader>
            <CardContent>
              <PatientTimeline patientId={patientId} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Beaker Laboratory Reports</CardTitle>
              <CardDescription>Laboratory test results from Epic Beaker</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports.map((report) => (
                  <BeakerReportCard key={report.id} report={report} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="genomic" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Genomic Data</CardTitle>
              <CardDescription>Genomic test results from Epic</CardDescription>
            </CardHeader>
            <CardContent>
              {reports.some((r) => r.name.includes("Genomic")) ? (
                <div className="space-y-4">
                  {reports
                    .filter((r) => r.name.includes("Genomic"))
                    .map((report) => (
                      <div key={report.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold">{report.name}</h3>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">{report.date}</span>
                            <Button variant="outline" size="sm">
                              <IconFileText className="h-4 w-4 mr-1" />
                              View Report
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-3">
                          {report.results.map((result: any, index: number) => (
                            <div
                              key={index}
                              className="flex justify-between items-center p-2 rounded-lg bg-secondary/30"
                            >
                              <div>
                                <span className="font-medium">{result.name}</span>
                                <div className="text-sm text-muted-foreground">Reference: {result.range}</div>
                              </div>
                              <div className="flex items-center">
                                <span className={`font-medium ${!result.normal ? "text-destructive" : ""}`}>
                                  {result.value}
                                </span>
                                {!result.normal && (
                                  <Button variant="ghost" size="sm" className="ml-2">
                                    <IconExternalLink className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4">
                    <IconDna className="h-8 w-8 text-primary" />
                  </div>

                  <h3 className="text-lg font-semibold mb-2">No Genomic Data Available</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                    No genomic test results are available for this patient in Epic.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

