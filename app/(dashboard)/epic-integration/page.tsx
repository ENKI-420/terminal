"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BeakerReportsViewer } from "@/components/epic/beaker-reports-viewer"
import { EpicLoginButton } from "@/components/epic/epic-login-button"
import { IconSearch, IconUser, IconFlask, IconRefresh, IconBuildingHospital } from "@tabler/icons-react"
import { useToast } from "@/hooks/use-toast"

export default function EpicIntegrationPage() {
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { toast } = useToast()

  // Mock patient data for demonstration
  const mockPatients = [
    { id: "patient-001", name: "John Doe", dob: "1975-05-15", mrn: "MRN12345" },
    { id: "patient-002", name: "Jane Smith", dob: "1982-11-23", mrn: "MRN67890" },
    { id: "patient-003", name: "Robert Johnson", dob: "1968-03-08", mrn: "MRN24680" },
  ]

  const filteredPatients = mockPatients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.mrn.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  useEffect(() => {
    // Check if authenticated with Epic
    // In a real app, this would check the authentication status with the Epic FHIR API
    const checkAuthentication = async () => {
      try {
        // For demo purposes, we'll check if the epic_authenticated cookie exists
        const epicAuthenticated = document.cookie.includes("epic_authenticated=true")
        setIsAuthenticated(epicAuthenticated)
      } catch (error) {
        console.error("Error checking Epic authentication:", error)
        setIsAuthenticated(false)
      }
    }

    checkAuthentication()
  }, [])

  const handlePatientSelect = (patientId: string) => {
    setIsLoading(true)
    setSelectedPatientId(patientId)

    // Simulate loading delay
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  const handleRefreshConnection = () => {
    // In a real app, this would refresh the connection with the Epic FHIR API
    toast({
      title: "Refreshing Connection",
      description: "Attempting to refresh Epic FHIR connection...",
    })

    // Simulate refreshing
    setTimeout(() => {
      setIsAuthenticated(true)
      toast({
        title: "Connection Refreshed",
        description: "Successfully refreshed Epic FHIR connection.",
      })
    }, 2000)
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-4">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <IconBuildingHospital className="mr-2 h-8 w-8 text-primary" />
            Epic FHIR Integration
          </h1>
          <p className="text-muted-foreground">Access and analyze patient data from Epic</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium">Epic Connection</CardTitle>
                <CardDescription>Status and authentication</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${isAuthenticated ? "bg-green-500" : "bg-red-500"}`}></div>
                    <span className="text-sm font-medium">
                      {isAuthenticated ? "Connected to Epic" : "Not Connected"}
                    </span>
                  </div>

                  {isAuthenticated ? (
                    <Button variant="outline" className="w-full" onClick={handleRefreshConnection}>
                      <IconRefresh className="mr-2 h-4 w-4" />
                      Refresh Connection
                    </Button>
                  ) : (
                    <EpicLoginButton className="w-full" />
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium">Patient Search</CardTitle>
                <CardDescription>Find patients by name or MRN</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search patients..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    disabled={!isAuthenticated}
                  />
                </div>

                <div className="mt-4 space-y-2">
                  {!isAuthenticated ? (
                    <p className="text-center text-sm text-muted-foreground py-4">Connect to Epic to search patients</p>
                  ) : filteredPatients.length > 0 ? (
                    filteredPatients.map((patient) => (
                      <Button
                        key={patient.id}
                        variant={selectedPatientId === patient.id ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => handlePatientSelect(patient.id)}
                      >
                        <IconUser className="mr-2 h-4 w-4" />
                        <div className="text-left">
                          <div>{patient.name}</div>
                          <div className="text-xs text-muted-foreground">
                            DOB: {patient.dob} • {patient.mrn}
                          </div>
                        </div>
                      </Button>
                    ))
                  ) : (
                    <p className="text-center text-sm text-muted-foreground py-4">No patients found</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-3">
            {!isAuthenticated ? (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center py-12">
                  <IconBuildingHospital className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">Epic FHIR Integration</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    Connect to Epic FHIR to access patient data, Beaker reports, and genomic information.
                  </p>
                  <EpicLoginButton />
                </CardContent>
              </Card>
            ) : selectedPatientId ? (
              <BeakerReportsViewer patientId={selectedPatientId} />
            ) : (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center py-12">
                  <IconFlask className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Patient Selected</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    Select a patient from the list to view their Beaker laboratory reports.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

