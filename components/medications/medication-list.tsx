"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Pill, CheckCircle, AlertCircle, Search, Edit, Trash2, ExternalLink, Info } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"

export function MedicationList() {
  // Mock medications data
  const [medications, setMedications] = useState([
    {
      id: 1,
      name: "Venetoclax",
      dosage: "400mg",
      frequency: "Once daily",
      timeOfDay: "Morning with food",
      status: "active",
      adherence: 95,
      refillsRemaining: 2,
      refillBy: "May 15, 2025",
      prescriber: "Dr. Sarah Johnson",
      pharmacy: "Memorial Cancer Center Pharmacy",
      startDate: "January 15, 2025",
      instructions: "Take with a full glass of water and with food to reduce risk of nausea.",
      sideEffects: ["Nausea", "Fatigue", "Decreased appetite"],
      category: "Targeted Therapy",
    },
    {
      id: 2,
      name: "Azacitidine",
      dosage: "75mg/m²",
      frequency: "7 days every 28 days",
      timeOfDay: "Administered at clinic",
      status: "active",
      adherence: 100,
      refillsRemaining: "N/A",
      refillBy: "N/A",
      prescriber: "Dr. Sarah Johnson",
      pharmacy: "Memorial Cancer Center Pharmacy",
      startDate: "January 15, 2025",
      instructions: "Administered subcutaneously at the clinic. Report any injection site reactions.",
      sideEffects: ["Injection site reactions", "Fatigue", "Nausea"],
      category: "Hypomethylating Agent",
    },
    {
      id: 3,
      name: "Ondansetron",
      dosage: "8mg",
      frequency: "As needed",
      timeOfDay: "For nausea",
      status: "active",
      adherence: 100,
      refillsRemaining: 3,
      refillBy: "June 10, 2025",
      prescriber: "Dr. Sarah Johnson",
      pharmacy: "Memorial Cancer Center Pharmacy",
      startDate: "January 15, 2025",
      instructions:
        "Take as needed for nausea, up to 3 times per day. Take 30 minutes before meals if experiencing meal-related nausea.",
      sideEffects: ["Headache", "Constipation"],
      category: "Antiemetic",
    },
    {
      id: 4,
      name: "Acyclovir",
      dosage: "400mg",
      frequency: "Twice daily",
      timeOfDay: "Morning and evening",
      status: "active",
      adherence: 90,
      refillsRemaining: 2,
      refillBy: "May 20, 2025",
      prescriber: "Dr. Sarah Johnson",
      pharmacy: "Memorial Cancer Center Pharmacy",
      startDate: "January 15, 2025",
      instructions: "Take with or without food. Maintain adequate hydration while taking this medication.",
      sideEffects: ["Headache", "Nausea"],
      category: "Antiviral",
    },
    {
      id: 5,
      name: "Fluconazole",
      dosage: "200mg",
      frequency: "Once daily",
      timeOfDay: "Evening",
      status: "active",
      adherence: 92,
      refillsRemaining: 2,
      refillBy: "May 20, 2025",
      prescriber: "Dr. Sarah Johnson",
      pharmacy: "Memorial Cancer Center Pharmacy",
      startDate: "January 15, 2025",
      instructions: "Take with or without food at the same time each day.",
      sideEffects: ["Headache", "Nausea", "Abdominal pain"],
      category: "Antifungal",
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [selectedMedication, setSelectedMedication] = useState<any>(null)
  const { toast } = useToast()

  // Filter medications
  const filteredMedications = medications.filter((medication) => {
    // Search filter
    const matchesSearch =
      searchQuery === "" ||
      medication.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      medication.category.toLowerCase().includes(searchQuery.toLowerCase())

    // Category filter
    const matchesCategory = filterCategory === "all" || medication.category === filterCategory

    return matchesSearch && matchesCategory
  })

  // Get unique categories for filter
  const categories = ["all", ...new Set(medications.map((m) => m.category))]

  // Handle marking medication as taken
  const markAsTaken = (id: number) => {
    toast({
      title: "Medication Marked as Taken",
      description: "Your medication has been marked as taken for today.",
    })
  }

  // Handle requesting a refill
  const requestRefill = (id: number) => {
    toast({
      title: "Refill Requested",
      description: "Your medication refill request has been sent to your pharmacy.",
    })
  }

  // Handle deleting a medication
  const deleteMedication = (id: number) => {
    setMedications(medications.filter((med) => med.id !== id))
    setSelectedMedication(null)
    toast({
      title: "Medication Removed",
      description: "The medication has been removed from your list.",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Current Medications</CardTitle>
          <CardDescription>Manage your current medications and track adherence</CardDescription>
          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search medications..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredMedications.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No medications found</p>
            </div>
          ) : (
            filteredMedications.map((medication) => (
              <div key={medication.id} className="flex items-start gap-4 p-4 rounded-lg border">
                <div className="p-2 rounded-full bg-muted">
                  <Pill className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="font-medium truncate">
                        {medication.name} {medication.dosage}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {medication.frequency} • {medication.timeOfDay}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    >
                      Active
                    </Badge>
                  </div>

                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span>Adherence</span>
                      <span>{medication.adherence}%</span>
                    </div>
                    <Progress value={medication.adherence} className="h-1.5" />
                  </div>

                  {medication.refillsRemaining !== "N/A" &&
                    Number.parseInt(medication.refillsRemaining.toString()) <= 2 && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                        <AlertCircle className="h-3.5 w-3.5" />
                        <span>Refills remaining: {medication.refillsRemaining}</span>
                      </div>
                    )}

                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button size="sm" className="gap-1" onClick={() => markAsTaken(medication.id)}>
                      <CheckCircle className="h-3.5 w-3.5" />
                      Mark as Taken
                    </Button>

                    {medication.refillsRemaining !== "N/A" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1"
                        onClick={() => requestRefill(medication.id)}
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Request Refill
                      </Button>
                    )}

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1"
                          onClick={() => setSelectedMedication(medication)}
                        >
                          <Info className="h-3.5 w-3.5" />
                          Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>
                            {medication?.name} {medication?.dosage}
                          </DialogTitle>
                          <DialogDescription>
                            {medication?.category} • Prescribed by {medication?.prescriber}
                          </DialogDescription>
                        </DialogHeader>
                        <Tabs defaultValue="details" className="mt-4">
                          <TabsList>
                            <TabsTrigger value="details">Details</TabsTrigger>
                            <TabsTrigger value="instructions">Instructions</TabsTrigger>
                            <TabsTrigger value="side-effects">Side Effects</TabsTrigger>
                          </TabsList>
                          <TabsContent value="details" className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div className="text-muted-foreground">Medication:</div>
                              <div>{medication?.name}</div>
                              <div className="text-muted-foreground">Dosage:</div>
                              <div>{medication?.dosage}</div>
                              <div className="text-muted-foreground">Frequency:</div>
                              <div>{medication?.frequency}</div>
                              <div className="text-muted-foreground">Time of Day:</div>
                              <div>{medication?.timeOfDay}</div>
                              <div className="text-muted-foreground">Start Date:</div>
                              <div>{medication?.startDate}</div>
                              <div className="text-muted-foreground">Prescriber:</div>
                              <div>{medication?.prescriber}</div>
                              <div className="text-muted-foreground">Pharmacy:</div>
                              <div>{medication?.pharmacy}</div>
                              <div className="text-muted-foreground">Refills Remaining:</div>
                              <div>{medication?.refillsRemaining}</div>
                              <div className="text-muted-foreground">Refill By:</div>
                              <div>{medication?.refillBy}</div>
                            </div>
                          </TabsContent>
                          <TabsContent value="instructions" className="space-y-4 py-4">
                            <p className="text-sm">{medication?.instructions}</p>
                          </TabsContent>
                          <TabsContent value="side-effects" className="space-y-4 py-4">
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium">Possible Side Effects</h4>
                              <ul className="list-disc pl-5 text-sm space-y-1">
                                {medication?.sideEffects.map((effect, index) => (
                                  <li key={index}>{effect}</li>
                                ))}
                              </ul>
                              <p className="text-xs text-muted-foreground mt-2">
                                Contact your healthcare provider if you experience severe or persistent side effects.
                              </p>
                            </div>
                          </TabsContent>
                        </Tabs>
                        <DialogFooter className="flex flex-col sm:flex-row gap-2">
                          <Button variant="outline" className="gap-1">
                            <Edit className="h-4 w-4" />
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            className="gap-1"
                            onClick={() => deleteMedication(medication?.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            Remove
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
