"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PatientData } from "@/components/patient/patient-data"
import { IconSearch, IconUser, IconUsers, IconFileAnalytics, IconDna } from "@tabler/icons-react"
import { useAuth } from "@/components/auth/auth-provider"

export default function DashboardPage() {
  const [activePatientId, setActivePatientId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const { user } = useAuth()

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

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-4">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">AGENT 2.0 Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.email}</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1 space-y-6">
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
                  />
                </div>

                <div className="mt-4 space-y-2">
                  {filteredPatients.length > 0 ? (
                    filteredPatients.map((patient) => (
                      <Button
                        key={patient.id}
                        variant={activePatientId === patient.id ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => setActivePatientId(patient.id)}
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

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <div className="bg-primary/10 p-2 rounded-full mr-3">
                    <IconUsers className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Total Patients</div>
                    <div className="text-2xl font-bold">128</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="bg-primary/10 p-2 rounded-full mr-3">
                    <IconFileAnalytics className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Reports Generated</div>
                    <div className="text-2xl font-bold">47</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="bg-primary/10 p-2 rounded-full mr-3">
                    <IconDna className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Genomic Analyses</div>
                    <div className="text-2xl font-bold">32</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-3">
            {activePatientId ? (
              <PatientData patientId={activePatientId} />
            ) : (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center py-12">
                  <IconUser className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Patient Selected</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    Select a patient from the list to view their genomic data and clinical information.
                  </p>
                  <Button variant="outline">Add New Patient</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

