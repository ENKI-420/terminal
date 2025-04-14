"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Pill, Search, AlertTriangle, Info, ExternalLink } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function MedicationInteractions() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedInteraction, setSelectedInteraction] = useState<any>(null)

  // Mock medications data
  const currentMedications = [
    {
      id: 1,
      name: "Venetoclax",
      dosage: "400mg",
      category: "Targeted Therapy",
    },
    {
      id: 2,
      name: "Azacitidine",
      dosage: "75mg/m²",
      category: "Hypomethylating Agent",
    },
    {
      id: 3,
      name: "Ondansetron",
      dosage: "8mg",
      category: "Antiemetic",
    },
    {
      id: 4,
      name: "Acyclovir",
      dosage: "400mg",
      category: "Antiviral",
    },
    {
      id: 5,
      name: "Fluconazole",
      dosage: "200mg",
      category: "Antifungal",
    },
  ]

  // Mock interactions data
  const interactions = [
    {
      id: 1,
      medications: ["Venetoclax", "Fluconazole"],
      severity: "moderate",
      description: "Fluconazole may increase the blood levels and effects of Venetoclax.",
      recommendation:
        "Monitor for increased side effects of Venetoclax such as nausea, diarrhea, and low blood counts. Dose adjustment may be necessary.",
      mechanism:
        "Fluconazole inhibits the CYP3A4 enzyme which is responsible for metabolizing Venetoclax, potentially leading to increased Venetoclax concentrations.",
      references: [
        "Smith J, et al. Drug interactions with Venetoclax. Journal of Clinical Oncology. 2023;35(2):112-120.",
      ],
    },
    {
      id: 2,
      medications: ["Ondansetron", "Fluconazole"],
      severity: "minor",
      description: "Concurrent use may increase the risk of QT interval prolongation.",
      recommendation: "Monitor ECG in patients with other risk factors for QT prolongation.",
      mechanism:
        "Both medications can prolong the QT interval, potentially increasing the risk of cardiac arrhythmias when used together.",
      references: [
        "Johnson A, et al. QT prolongation with antiemetics and antifungals. Clinical Pharmacology. 2022;45(3):78-85.",
      ],
    },
    {
      id: 3,
      medications: ["Venetoclax", "Azacitidine"],
      severity: "beneficial",
      description: "Combination therapy with synergistic effects for treatment of AML.",
      recommendation: "Standard combination therapy. Monitor for expected side effects.",
      mechanism: "Azacitidine induces hypomethylation which may enhance the pro-apoptotic effects of Venetoclax.",
      references: [
        "DiNardo CD, et al. Venetoclax combined with azacitidine for newly diagnosed acute myeloid leukemia. New England Journal of Medicine. 2020;383(7):617-629.",
      ],
    },
  ]

  // Filter interactions based on search
  const filteredInteractions = interactions.filter((interaction) => {
    return (
      searchQuery === "" ||
      interaction.medications.some((med) => med.toLowerCase().includes(searchQuery.toLowerCase())) ||
      interaction.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  // Get severity badge
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "severe":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
            Severe
          </Badge>
        )
      case "moderate":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
            Moderate
          </Badge>
        )
      case "minor":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            Minor
          </Badge>
        )
      case "beneficial":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            Beneficial
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle>Current Medications</CardTitle>
            <CardDescription>Your active medications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentMedications.map((medication) => (
              <div key={medication.id} className="flex items-center gap-3 p-3 rounded-lg border">
                <div className="p-2 rounded-full bg-muted">
                  <Pill className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">
                    {medication.name} {medication.dosage}
                  </h4>
                  <p className="text-sm text-muted-foreground">{medication.category}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle>Medication Interactions</CardTitle>
            <CardDescription>Potential interactions between your medications</CardDescription>
            <div className="relative mt-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search interactions..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredInteractions.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No interactions found</p>
              </div>
            ) : (
              filteredInteractions.map((interaction) => (
                <div key={interaction.id} className="flex items-start gap-4 p-4 rounded-lg border">
                  <div
                    className={`p-2 rounded-full ${
                      interaction.severity === "severe"
                        ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                        : interaction.severity === "moderate"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                          : interaction.severity === "minor"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                            : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                    }`}
                  >
                    {interaction.severity === "beneficial" ? (
                      <Info className="h-4 w-4" />
                    ) : (
                      <AlertTriangle className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h4 className="font-medium">{interaction.medications.join(" + ")}</h4>
                      {getSeverityBadge(interaction.severity)}
                    </div>
                    <p className="mt-2 text-sm">{interaction.description}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      <strong>Recommendation:</strong> {interaction.recommendation}
                    </p>
                    <div className="mt-3">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1"
                            onClick={() => setSelectedInteraction(interaction)}
                          >
                            <Info className="h-3.5 w-3.5" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Interaction Details</DialogTitle>
                            <DialogDescription>{interaction?.medications?.join(" + ")}</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">Severity</h4>
                              {getSeverityBadge(interaction?.severity)}
                            </div>

                            <div className="space-y-2">
                              <h4 className="font-medium">Description</h4>
                              <p className="text-sm">{interaction?.description}</p>
                            </div>

                            <div className="space-y-2">
                              <h4 className="font-medium">Recommendation</h4>
                              <p className="text-sm">{interaction?.recommendation}</p>
                            </div>

                            <div className="space-y-2">
                              <h4 className="font-medium">Mechanism</h4>
                              <p className="text-sm">{interaction?.mechanism}</p>
                            </div>

                            <div className="space-y-2">
                              <h4 className="font-medium">References</h4>
                              <ul className="list-disc pl-5 text-sm space-y-1">
                                {interaction?.references.map((reference, index) => (
                                  <li key={index}>{reference}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" className="gap-1">
                              <ExternalLink className="h-4 w-4" />
                              Learn More
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

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Medication Interaction Checker</CardTitle>
          <CardDescription>Check for potential interactions with new medications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Enter a medication to check</label>
              <Input placeholder="Type medication name..." />
            </div>
            <div className="md:mt-7">
              <Button>Check Interactions</Button>
            </div>
          </div>

          <div className="rounded-lg border p-4 bg-muted/40">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium">About Medication Interactions</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Medication interactions occur when a drug affects the activity of another drug when both are
                  administered together. This can cause unexpected side effects or reduce the effectiveness of one or
                  both medications. Always consult with your healthcare provider before starting any new medication.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
