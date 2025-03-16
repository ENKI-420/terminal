"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { FHIRPatient } from "@/lib/fhir-service"
import type { GenomicReport } from "@/lib/genomic-service"
import { securityService } from "@/lib/security-service"
import { useAuth } from "@/components/auth/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { IconDna, IconUser, IconFileReport, IconAlertTriangle, IconUserCog, IconUpload } from "@tabler/icons-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"

interface PatientDataProps {
  patientId: string
}

export function PatientData({ patientId }: PatientDataProps) {
  const [patient, setPatient] = useState<FHIRPatient | null>(null)
  const [genomicReport, setGenomicReport] = useState<GenomicReport | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Log access attempt for audit
        if (user) {
          await securityService.createAuditTrail(user.id, "access", "Patient", patientId, { method: "view" })
        }

        // In a real implementation, this would fetch data from the database
        // For now, we'll set empty data
        setPatient(null)
        setGenomicReport(null)
      } catch (err: any) {
        setError(err.message || "Failed to load patient data")
        toast({
          title: "Error",
          description: err.message || "Failed to load patient data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (patientId) {
      fetchPatientData()
    }
  }, [patientId, user, toast])

  if (loading) {
    return <PatientDataSkeleton />
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader className="bg-destructive/10">
          <CardTitle className="flex items-center text-destructive">
            <IconAlertTriangle className="mr-2 h-5 w-5" />
            Error Loading Patient Data
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p>{error}</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="genomic">Genomic Data</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <IconUser className="mr-2 h-5 w-5 text-primary" />
              Patient Information
            </CardTitle>
            <CardDescription>Basic demographic and clinical information</CardDescription>
          </CardHeader>
          <CardContent>
            {patient ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                    <p>
                      {patient.name?.[0]?.text || `${patient.name?.[0]?.given?.join(" ")} ${patient.name?.[0]?.family}`}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Gender</h3>
                    <p className="capitalize">{patient.gender || "Unknown"}</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Date of Birth</h3>
                    <p>{patient.birthDate || "Unknown"}</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Patient ID</h3>
                    <p>{patient.id}</p>
                  </div>
                </div>

                <div className="pt-2">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Address</h3>
                  {patient.address && patient.address.length > 0 ? (
                    <p>
                      {patient.address[0].line?.join(", ")}
                      <br />
                      {patient.address[0].city}, {patient.address[0].state} {patient.address[0].postalCode}
                      <br />
                      {patient.address[0].country}
                    </p>
                  ) : (
                    <p>No address information available</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <IconUser className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Patient Data Available</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">No patient data has been uploaded yet.</p>
                <div className="flex flex-col items-center gap-4">
                  <Button variant="outline" className="flex items-center">
                    <IconUpload className="mr-2 h-4 w-4" />
                    Upload Patient Data
                  </Button>
                  <div className="flex items-center text-sm text-muted-foreground mt-4">
                    <IconUserCog className="h-4 w-4 mr-2" />
                    <span>Note: Administrators can upload patient data</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          {patient && (
            <CardFooter className="flex justify-between">
              <p className="text-xs text-muted-foreground">Last updated: {patient.meta?.lastUpdated || "Unknown"}</p>
              <Button variant="outline" size="sm">
                View Full Record
              </Button>
            </CardFooter>
          )}
        </Card>
      </TabsContent>

      <TabsContent value="genomic">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <IconDna className="mr-2 h-5 w-5 text-primary" />
              Genomic Analysis
            </CardTitle>
            <CardDescription>Genetic variants and clinical interpretations</CardDescription>
          </CardHeader>
          <CardContent>
            {genomicReport ? (
              <div className="space-y-6">
                <div className="bg-primary/10 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Summary</h3>
                  <p>{genomicReport.summary}</p>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Identified Variants</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium">Gene</th>
                          <th className="px-4 py-2 text-left text-sm font-medium">Type</th>
                          <th className="px-4 py-2 text-left text-sm font-medium">Significance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {genomicReport.variants.map((variant, index) => (
                          <tr key={index} className="hover:bg-muted/50">
                            <td className="px-4 py-2 text-sm">{variant.gene}</td>
                            <td className="px-4 py-2 text-sm">{variant.type || "Unknown"}</td>
                            <td className="px-4 py-2 text-sm">
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  variant.clinicalSignificance?.toLowerCase().includes("pathogenic")
                                    ? "bg-destructive/20 text-destructive"
                                    : variant.clinicalSignificance?.toLowerCase().includes("benign")
                                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                }`}
                              >
                                {variant.clinicalSignificance || "Unknown"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {genomicReport.recommendations && genomicReport.recommendations.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-3">Recommendations</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {genomicReport.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm">
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <IconDna className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Genomic Data Available</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  Genomic data for this patient has not been uploaded or processed yet.
                </p>
                <div className="flex flex-col items-center gap-4">
                  <Button variant="outline" className="flex items-center">
                    <IconUpload className="mr-2 h-4 w-4" />
                    Upload Genomic Data
                  </Button>
                  <div className="flex items-center text-sm text-muted-foreground mt-4">
                    <IconUserCog className="h-4 w-4 mr-2" />
                    <span>Note: Administrators can upload genomic data</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="reports">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <IconFileReport className="mr-2 h-5 w-5 text-primary" />
              Clinical Reports
            </CardTitle>
            <CardDescription>Medical reports and diagnostic findings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <IconFileReport className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Reports Available</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Clinical reports for this patient have not been uploaded yet.
              </p>
              <div className="flex flex-col items-center gap-4">
                <Button variant="outline" className="flex items-center">
                  <IconUpload className="mr-2 h-4 w-4" />
                  Upload Clinical Reports
                </Button>
                <div className="flex items-center text-sm text-muted-foreground mt-4">
                  <IconUserCog className="h-4 w-4 mr-2" />
                  <span>Note: Administrators can upload clinical reports</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

function PatientDataSkeleton() {
  return (
    <div className="w-full space-y-4">
      <div className="flex space-x-4">
        <Skeleton className="h-10 w-[100px]" />
        <Skeleton className="h-10 w-[100px]" />
        <Skeleton className="h-10 w-[100px]" />
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-[250px] mb-2" />
          <Skeleton className="h-4 w-[300px]" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-6 w-[150px]" />
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

