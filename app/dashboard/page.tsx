"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EncryptionStatus } from "@/components/ui/encryption-status"
import { SecurityBadge } from "@/components/ui/security-badge"
import { AccessibilityMenu } from "@/components/ui/accessibility-menu"
import { ChatbotInterface } from "@/components/chatbot/chatbot-interface"
import { EpicIntegration } from "@/components/epic/epic-integration"
import {
  IconSearch,
  IconUser,
  IconUsers,
  IconDna,
  IconBrandHipchat,
  IconLayoutDashboard,
  IconCommand,
  IconBuildingHospital,
} from "@tabler/icons-react"
import { CommandPalette } from "@/components/ui/command-palette"

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>("patient-001")
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)

  // Mock patient data
  const patients = [
    { id: "patient-001", name: "John Doe", dob: "1975-05-15", mrn: "MRN12345", diagnosis: "NSCLC" },
    { id: "patient-002", name: "Jane Smith", dob: "1982-11-23", mrn: "MRN67890", diagnosis: "Breast Cancer" },
    { id: "patient-003", name: "Robert Johnson", dob: "1968-03-08", mrn: "MRN24680", diagnosis: "Colorectal Cancer" },
  ]

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.mrn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handlePatientSelect = (patientId: string) => {
    setSelectedPatientId(patientId)
  }

  const handleCommandSelect = (command: string) => {
    // Handle command selection
    console.log("Selected command:", command)

    // For demo purposes, we'll just select a patient based on the command
    if (command === "egfr") {
      setSelectedPatientId("patient-001")
    } else if (command === "brca") {
      setSelectedPatientId("patient-002")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <EncryptionStatus />

      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <IconDna className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">AGENT 2.0</h1>
              <p className="text-xs text-muted-foreground">Precision Oncology Platform</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative w-64">
              <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search patients..."
                className="pl-9 pr-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                onClick={() => setIsCommandPaletteOpen(true)}
              >
                <IconCommand className="h-4 w-4" />
              </button>
            </div>

            <AccessibilityMenu />

            <SecurityBadge type="hipaa" />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium">Patients</CardTitle>
                <CardDescription>Select a patient to view details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {filteredPatients.length > 0 ? (
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
                            {patient.diagnosis} • {patient.mrn}
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
                    <IconDna className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Genomic Analyses</div>
                    <div className="text-2xl font-bold">87</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main content */}
          <div className="md:col-span-3">
            <Tabs defaultValue="dashboard">
              <TabsList className="mb-4">
                <TabsTrigger value="dashboard">
                  <IconLayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="chat">
                  <IconBrandHipchat className="h-4 w-4 mr-2" />
                  Chatbot
                </TabsTrigger>
                <TabsTrigger value="epic">
                  <IconBuildingHospital className="h-4 w-4 mr-2" />
                  Epic Integration
                </TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Patient Overview</CardTitle>
                    <CardDescription>
                      {selectedPatientId
                        ? `Viewing data for ${patients.find((p) => p.id === selectedPatientId)?.name}`
                        : "Select a patient to view details"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {selectedPatientId ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                          <IconUser className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">
                          {patients.find((p) => p.id === selectedPatientId)?.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-6">
                          {patients.find((p) => p.id === selectedPatientId)?.diagnosis} • DOB:{" "}
                          {patients.find((p) => p.id === selectedPatientId)?.dob} •
                          {patients.find((p) => p.id === selectedPatientId)?.mrn}
                        </p>
                        <div className="flex justify-center space-x-4">
                          <Button>View Genomic Data</Button>
                          <Button variant="outline">View Medical Records</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p>Please select a patient from the sidebar</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="chat">
                <Card className="h-[600px] overflow-hidden">
                  <ChatbotInterface />
                </Card>
              </TabsContent>

              <TabsContent value="epic">
                <EpicIntegration patientId={selectedPatientId || undefined} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      {/* Command palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelect={handleCommandSelect}
      />
    </div>
  )
}

