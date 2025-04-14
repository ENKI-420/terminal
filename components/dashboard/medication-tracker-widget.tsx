"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pill, Clock, CheckCircle, AlertCircle, Plus } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

interface MedicationTrackerWidgetProps {
  fullWidth?: boolean
}

export function MedicationTrackerWidget({ fullWidth = false }: MedicationTrackerWidgetProps) {
  // Mock medications data
  const medications = [
    {
      id: 1,
      name: "Venetoclax",
      dosage: "400mg",
      frequency: "Once daily",
      timeOfDay: "Morning with food",
      status: "due",
      adherence: 95,
      refillsRemaining: 2,
      refillBy: "May 15, 2025",
    },
    {
      id: 2,
      name: "Azacitidine",
      dosage: "75mg/m²",
      frequency: "7 days every 28 days",
      timeOfDay: "Administered at clinic",
      status: "upcoming",
      adherence: 100,
      refillsRemaining: "N/A",
      refillBy: "N/A",
    },
    {
      id: 3,
      name: "Ondansetron",
      dosage: "8mg",
      frequency: "As needed",
      timeOfDay: "For nausea",
      status: "taken",
      adherence: 100,
      refillsRemaining: 3,
      refillBy: "June 10, 2025",
    },
  ]

  // State for tracking medication taken status
  const [medicationStatus, setMedicationStatus] = useState<Record<number, string>>(
    medications.reduce((acc, med) => ({ ...acc, [med.id]: med.status }), {}),
  )

  // Function to mark medication as taken
  const markAsTaken = (id: number) => {
    setMedicationStatus((prev) => ({ ...prev, [id]: "taken" }))
  }

  // Limit the number of medications shown unless fullWidth is true
  const displayMedications = fullWidth ? medications : medications.slice(0, 2)

  return (
    <Card className={fullWidth ? "col-span-full" : ""}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Medication Tracker</CardTitle>
            <CardDescription>Track and manage your medications</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/medications">
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {displayMedications.map((medication) => (
          <div key={medication.id} className="flex items-start gap-4 p-3 rounded-lg border">
            <div
              className={`p-2 rounded-full ${
                medicationStatus[medication.id] === "taken"
                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                  : medicationStatus[medication.id] === "due"
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                    : "bg-muted"
              }`}
            >
              <Pill className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="font-medium truncate">
                    {medication.name} {medication.dosage}
                  </h4>
                  <p className="text-sm text-muted-foreground">{medication.frequency}</p>
                </div>
                <Badge
                  variant="outline"
                  className={
                    medicationStatus[medication.id] === "taken"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      : medicationStatus[medication.id] === "due"
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                  }
                >
                  {medicationStatus[medication.id] === "taken"
                    ? "Taken"
                    : medicationStatus[medication.id] === "due"
                      ? "Due Now"
                      : "Upcoming"}
                </Badge>
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{medication.timeOfDay}</span>
              </div>
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span>Adherence</span>
                  <span>{medication.adherence}%</span>
                </div>
                <Progress value={medication.adherence} className="h-1.5" />
              </div>
              {medicationStatus[medication.id] === "due" && (
                <div className="mt-3">
                  <Button size="sm" className="gap-1" onClick={() => markAsTaken(medication.id)}>
                    <CheckCircle className="h-3.5 w-3.5" />
                    Mark as Taken
                  </Button>
                </div>
              )}
              {medication.refillsRemaining !== "N/A" &&
                Number.parseInt(medication.refillsRemaining.toString()) <= 2 && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                    <AlertCircle className="h-3.5 w-3.5" />
                    <span>Refills remaining: {medication.refillsRemaining}</span>
                  </div>
                )}
            </div>
          </div>
        ))}
      </CardContent>
      {!fullWidth && medications.length > 2 && (
        <CardFooter>
          <Button variant="ghost" size="sm" className="w-full" asChild>
            <Link href="/dashboard/medications">View All Medications</Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
