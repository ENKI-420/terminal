"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Pill, CheckCircle, Clock, CalendarIcon } from "lucide-react"
import { format, isSameDay, isToday, isTomorrow, parseISO } from "date-fns"
import { useToast } from "@/components/ui/use-toast"

export function MedicationSchedule() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const { toast } = useToast()

  // Mock medication schedule data
  const medicationSchedule = [
    {
      id: 1,
      name: "Venetoclax",
      dosage: "400mg",
      time: "8:00 AM",
      status: "due",
      instructions: "Take with food",
    },
    {
      id: 2,
      name: "Acyclovir",
      dosage: "400mg",
      time: "8:00 AM",
      status: "taken",
      instructions: "Take with or without food",
    },
    {
      id: 3,
      name: "Fluconazole",
      dosage: "200mg",
      time: "8:00 PM",
      status: "upcoming",
      instructions: "Take with or without food",
    },
    {
      id: 4,
      name: "Acyclovir",
      dosage: "400mg",
      time: "8:00 PM",
      status: "upcoming",
      instructions: "Take with or without food",
    },
  ]

  // Mock weekly schedule
  const weeklySchedule = {
    monday: [
      { name: "Venetoclax", dosage: "400mg", time: "8:00 AM" },
      { name: "Acyclovir", dosage: "400mg", time: "8:00 AM" },
      { name: "Fluconazole", dosage: "200mg", time: "8:00 PM" },
      { name: "Acyclovir", dosage: "400mg", time: "8:00 PM" },
    ],
    tuesday: [
      { name: "Venetoclax", dosage: "400mg", time: "8:00 AM" },
      { name: "Acyclovir", dosage: "400mg", time: "8:00 AM" },
      { name: "Fluconazole", dosage: "200mg", time: "8:00 PM" },
      { name: "Acyclovir", dosage: "400mg", time: "8:00 PM" },
    ],
    wednesday: [
      { name: "Venetoclax", dosage: "400mg", time: "8:00 AM" },
      { name: "Acyclovir", dosage: "400mg", time: "8:00 AM" },
      { name: "Fluconazole", dosage: "200mg", time: "8:00 PM" },
      { name: "Acyclovir", dosage: "400mg", time: "8:00 PM" },
    ],
    thursday: [
      { name: "Venetoclax", dosage: "400mg", time: "8:00 AM" },
      { name: "Acyclovir", dosage: "400mg", time: "8:00 AM" },
      { name: "Fluconazole", dosage: "200mg", time: "8:00 PM" },
      { name: "Acyclovir", dosage: "400mg", time: "8:00 PM" },
    ],
    friday: [
      { name: "Venetoclax", dosage: "400mg", time: "8:00 AM" },
      { name: "Acyclovir", dosage: "400mg", time: "8:00 AM" },
      { name: "Fluconazole", dosage: "200mg", time: "8:00 PM" },
      { name: "Acyclovir", dosage: "400mg", time: "8:00 PM" },
    ],
    saturday: [
      { name: "Venetoclax", dosage: "400mg", time: "8:00 AM" },
      { name: "Acyclovir", dosage: "400mg", time: "8:00 AM" },
      { name: "Fluconazole", dosage: "200mg", time: "8:00 PM" },
      { name: "Acyclovir", dosage: "400mg", time: "8:00 PM" },
    ],
    sunday: [
      { name: "Venetoclax", dosage: "400mg", time: "8:00 AM" },
      { name: "Acyclovir", dosage: "400mg", time: "8:00 AM" },
      { name: "Fluconazole", dosage: "200mg", time: "8:00 PM" },
      { name: "Acyclovir", dosage: "400mg", time: "8:00 PM" },
    ],
  }

  // Mock monthly schedule
  const monthlySchedule = [
    {
      date: "2025-04-15",
      medications: [{ name: "Azacitidine", dosage: "75mg/m²", time: "10:00 AM", location: "Memorial Cancer Center" }],
    },
    {
      date: "2025-04-16",
      medications: [{ name: "Azacitidine", dosage: "75mg/m²", time: "10:00 AM", location: "Memorial Cancer Center" }],
    },
    {
      date: "2025-04-17",
      medications: [{ name: "Azacitidine", dosage: "75mg/m²", time: "10:00 AM", location: "Memorial Cancer Center" }],
    },
    {
      date: "2025-04-18",
      medications: [{ name: "Azacitidine", dosage: "75mg/m²", time: "10:00 AM", location: "Memorial Cancer Center" }],
    },
    {
      date: "2025-04-19",
      medications: [{ name: "Azacitidine", dosage: "75mg/m²", time: "10:00 AM", location: "Memorial Cancer Center" }],
    },
    {
      date: "2025-04-20",
      medications: [{ name: "Azacitidine", dosage: "75mg/m²", time: "10:00 AM", location: "Memorial Cancer Center" }],
    },
    {
      date: "2025-04-21",
      medications: [{ name: "Azacitidine", dosage: "75mg/m²", time: "10:00 AM", location: "Memorial Cancer Center" }],
    },
  ]

  // Function to mark medication as taken
  const markAsTaken = (id: number) => {
    toast({
      title: "Medication Marked as Taken",
      description: "Your medication has been marked as taken.",
    })
  }

  // Function to format date display
  const formatDateDisplay = (date: Date) => {
    if (isToday(date)) return "Today"
    if (isTomorrow(date)) return "Tomorrow"
    return format(date, "EEEE, MMMM d")
  }

  // Function to get medication dates for highlighting in calendar
  const getMedicationDates = () => {
    return monthlySchedule.map((schedule) => parseISO(schedule.date))
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>Your medication schedule for {formatDateDisplay(new Date())}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-medium">Morning</h3>
                <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                  8:00 AM
                </Badge>
              </div>

              <div className="space-y-2">
                {medicationSchedule
                  .filter((med) => med.time === "8:00 AM")
                  .map((medication) => (
                    <div key={medication.id} className="flex items-center gap-4 p-3 rounded-lg border">
                      <div
                        className={`p-2 rounded-full ${
                          medication.status === "taken"
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : medication.status === "due"
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
                            <p className="text-sm text-muted-foreground">{medication.instructions}</p>
                          </div>
                          <Badge
                            variant="outline"
                            className={
                              medication.status === "taken"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : medication.status === "due"
                                  ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                                  : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                            }
                          >
                            {medication.status === "taken"
                              ? "Taken"
                              : medication.status === "due"
                                ? "Due Now"
                                : "Upcoming"}
                          </Badge>
                        </div>

                        {medication.status === "due" && (
                          <div className="mt-2">
                            <Button size="sm" className="gap-1" onClick={() => markAsTaken(medication.id)}>
                              <CheckCircle className="h-3.5 w-3.5" />
                              Mark as Taken
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-medium">Evening</h3>
                <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                  8:00 PM
                </Badge>
              </div>

              <div className="space-y-2">
                {medicationSchedule
                  .filter((med) => med.time === "8:00 PM")
                  .map((medication) => (
                    <div key={medication.id} className="flex items-center gap-4 p-3 rounded-lg border">
                      <div
                        className={`p-2 rounded-full ${
                          medication.status === "taken"
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : medication.status === "due"
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
                            <p className="text-sm text-muted-foreground">{medication.instructions}</p>
                          </div>
                          <Badge
                            variant="outline"
                            className={
                              medication.status === "taken"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : medication.status === "due"
                                  ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                                  : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                            }
                          >
                            {medication.status === "taken"
                              ? "Taken"
                              : medication.status === "due"
                                ? "Due Now"
                                : "Upcoming"}
                          </Badge>
                        </div>

                        {medication.status === "due" && (
                          <div className="mt-2">
                            <Button size="sm" className="gap-1" onClick={() => markAsTaken(medication.id)}>
                              <CheckCircle className="h-3.5 w-3.5" />
                              Mark as Taken
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Calendar</CardTitle>
            <CardDescription>View your medication schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              modifiers={{
                medication: getMedicationDates(),
              }}
              modifiersStyles={{
                medication: {
                  fontWeight: "bold",
                  backgroundColor: "var(--primary)",
                  color: "white",
                  borderRadius: "50%",
                },
              }}
            />

            <div className="mt-4">
              <h4 className="font-medium mb-2">{date ? format(date, "MMMM d, yyyy") : "Select a date"}</h4>

              {date && monthlySchedule.some((schedule) => isSameDay(parseISO(schedule.date), date)) ? (
                <div className="space-y-2">
                  {monthlySchedule
                    .filter((schedule) => isSameDay(parseISO(schedule.date), date))
                    .flatMap((schedule) => schedule.medications)
                    .map((medication, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                        <div className="flex items-center gap-2">
                          <Pill className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">
                            {medication.name} {medication.dosage}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-sm">{medication.time}</span>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                date && (
                  <div className="text-center py-2">
                    <p className="text-sm text-muted-foreground">No special medications on this day</p>
                    <p className="text-xs text-muted-foreground mt-1">Your regular daily medications still apply</p>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Schedule Overview</CardTitle>
          <CardDescription>View your weekly and monthly medication schedule</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="weekly" className="space-y-4">
            <TabsList>
              <TabsTrigger value="weekly">Weekly Schedule</TabsTrigger>
              <TabsTrigger value="monthly">Monthly Schedule</TabsTrigger>
            </TabsList>

            <TabsContent value="weekly" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                {Object.entries(weeklySchedule).map(([day, medications]) => (
                  <Card key={day} className="overflow-hidden">
                    <CardHeader className="p-3 bg-muted">
                      <CardTitle className="text-base capitalize">{day}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 space-y-2">
                      {medications.map((medication, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="p-1 rounded-full bg-muted">
                            <Pill className="h-3 w-3" />
                          </div>
                          <div>
                            <p className="text-xs font-medium">
                              {medication.name} {medication.dosage}
                            </p>
                            <p className="text-xs text-muted-foreground">{medication.time}</p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="monthly" className="space-y-4">
              <div className="space-y-4">
                {monthlySchedule.map((schedule, index) => (
                  <div key={index} className="flex items-start gap-4 p-3 rounded-lg border">
                    <div className="p-2 rounded-full bg-muted">
                      <CalendarIcon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <h4 className="font-medium">{format(parseISO(schedule.date), "EEEE, MMMM d, yyyy")}</h4>
                        <Badge
                          variant="outline"
                          className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                        >
                          Special Medication
                        </Badge>
                      </div>

                      <div className="mt-2 space-y-2">
                        {schedule.medications.map((medication, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Pill className="h-3.5 w-3.5 text-blue-500" />
                              <span className="text-sm">
                                {medication.name} {medication.dosage}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="text-sm">{medication.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <p className="mt-2 text-xs text-muted-foreground">Location: {schedule.medications[0].location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
