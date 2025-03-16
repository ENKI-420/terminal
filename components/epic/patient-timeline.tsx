"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { IconCalendarEvent, IconPill, IconFlask, IconRadiation, IconHeartbeat, IconDna } from "@tabler/icons-react"

interface PatientTimelineProps {
  patientId?: string
}

export function PatientTimeline({ patientId }: PatientTimelineProps) {
  const [events, setEvents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTimelineEvents = async () => {
      try {
        setIsLoading(true)

        // In a real implementation, this would fetch data from the Epic FHIR API
        // For this demo, we'll simulate it
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock timeline events
        setEvents([
          {
            id: "event-001",
            date: "2022-03-15",
            type: "diagnosis",
            title: "Initial Diagnosis",
            description: "Diagnosed with Stage IIIA Non-Small Cell Lung Cancer (NSCLC)",
            icon: IconHeartbeat,
          },
          {
            id: "event-002",
            date: "2022-03-20",
            type: "lab",
            title: "Biopsy Results",
            description: "Adenocarcinoma confirmed, EGFR L858R mutation detected",
            icon: IconFlask,
          },
          {
            id: "event-003",
            date: "2022-04-05",
            type: "treatment",
            title: "Treatment Initiated",
            description: "Started on Erlotinib 150mg daily",
            icon: IconPill,
          },
          {
            id: "event-004",
            date: "2022-07-10",
            type: "imaging",
            title: "CT Scan",
            description: "Partial response, 40% reduction in tumor size",
            icon: IconRadiation,
          },
          {
            id: "event-005",
            date: "2023-01-15",
            type: "lab",
            title: "Liquid Biopsy",
            description: "EGFR T790M resistance mutation detected",
            icon: IconDna,
          },
          {
            id: "event-006",
            date: "2023-01-25",
            type: "treatment",
            title: "Treatment Change",
            description: "Switched to Osimertinib 80mg daily",
            icon: IconPill,
          },
          {
            id: "event-007",
            date: "2023-04-12",
            type: "lab",
            title: "Laboratory Tests",
            description: "Comprehensive metabolic panel and CBC within normal limits",
            icon: IconFlask,
          },
        ])
      } catch (error) {
        console.error("Error fetching timeline events:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (patientId) {
      fetchTimelineEvents()
    }
  }, [patientId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="processing-dot mr-2" />
        <span>Loading timeline...</span>
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4">
          <IconCalendarEvent className="h-8 w-8 text-primary" />
        </div>

        <h3 className="text-lg font-semibold mb-2">No Timeline Events</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          No clinical events are available for this patient.
        </p>
      </div>
    )
  }

  return (
    <div className="patient-timeline">
      {events.map((event, index) => {
        const Icon = event.icon

        return (
          <div key={event.id} className="timeline-item">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
              </div>

              <div className="ml-4">
                <div className="flex items-center">
                  <h4 className="font-semibold">{event.title}</h4>
                  <span className="text-xs text-muted-foreground ml-2">{event.date}</span>
                </div>

                <p className="text-sm mt-1">{event.description}</p>

                {(event.type === "lab" || event.type === "imaging") && (
                  <Button variant="outline" size="sm" className="mt-2">
                    View Results
                  </Button>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

