"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
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
import { format, addDays, isSameDay } from "date-fns"
import { CalendarIcon, Clock, Video, Phone, MessageSquare, User, MapPin, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Mock appointment data
const appointments = [
  {
    id: 1,
    provider: "Dr. Sarah Johnson",
    specialty: "Oncologist",
    date: addDays(new Date(), 0),
    time: "2:00 PM",
    duration: "30 minutes",
    type: "video",
    status: "confirmed",
    notes: "Follow-up on genomic test results and treatment plan discussion.",
    location: "Virtual",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 2,
    provider: "Dr. Michael Chen",
    specialty: "Hematologist",
    date: addDays(new Date(), 3),
    time: "10:30 AM",
    duration: "45 minutes",
    type: "in-person",
    status: "confirmed",
    notes: "Comprehensive blood work review and treatment adjustment if needed.",
    location: "Memorial Cancer Center, Room 305",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 3,
    provider: "Emily Rodriguez",
    specialty: "Genetic Counselor",
    date: addDays(new Date(), 7),
    time: "1:15 PM",
    duration: "60 minutes",
    type: "video",
    status: "pending",
    notes: "Discussion of genetic test results and implications for family members.",
    location: "Virtual",
    image: "/placeholder.svg?height=50&width=50",
  },
]

export function UpcomingAppointments() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
  const { toast } = useToast()

  // Filter appointments for the selected date
  const filteredAppointments = date ? appointments.filter((appointment) => isSameDay(appointment.date, date)) : []

  // Function to handle appointment rescheduling
  const handleReschedule = () => {
    toast({
      title: "Appointment Rescheduling",
      description: "Your request to reschedule has been sent to your provider.",
    })
  }

  // Function to handle appointment cancellation
  const handleCancel = () => {
    toast({
      title: "Appointment Cancelled",
      description: "Your appointment has been cancelled successfully.",
    })
  }

  // Function to get appointment dates for highlighting in calendar
  const getAppointmentDates = () => {
    return appointments.map((appointment) => appointment.date)
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past Appointments</TabsTrigger>
          <TabsTrigger value="schedule">Schedule New</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
                <CardDescription>Your scheduled consultations with healthcare providers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {appointments.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No upcoming appointments</p>
                  </div>
                ) : (
                  appointments.map((appointment) => (
                    <Card key={appointment.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex flex-col sm:flex-row">
                          <div
                            className={`p-4 sm:w-2 ${
                              appointment.type === "video"
                                ? "bg-blue-500 dark:bg-blue-600"
                                : "bg-green-500 dark:bg-green-600"
                            }`}
                          ></div>
                          <div className="flex-1 p-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="flex items-center gap-3">
                                <div className="relative">
                                  <img
                                    src={appointment.image || "/placeholder.svg"}
                                    alt={appointment.provider}
                                    className="w-12 h-12 rounded-full object-cover"
                                  />
                                  {appointment.type === "video" && (
                                    <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-1 rounded-full">
                                      <Video className="h-3 w-3" />
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <h4 className="font-semibold">{appointment.provider}</h4>
                                  <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
                                </div>
                              </div>
                              <div className="flex flex-col sm:items-end">
                                <div className="flex items-center gap-1">
                                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">{format(appointment.date, "MMM d, yyyy")}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">
                                    {appointment.time} ({appointment.duration})
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="mt-3 flex items-center gap-1">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{appointment.location}</span>
                            </div>

                            {appointment.notes && (
                              <div className="mt-2 text-sm text-muted-foreground">
                                <p>{appointment.notes}</p>
                              </div>
                            )}

                            <div className="mt-4 flex flex-wrap gap-2">
                              {appointment.type === "video" && (
                                <Button size="sm" className="gap-1">
                                  <Video className="h-4 w-4" />
                                  Join Video
                                </Button>
                              )}
                              <Button size="sm" variant="outline" className="gap-1">
                                <Phone className="h-4 w-4" />
                                Call
                              </Button>
                              <Button size="sm" variant="outline" className="gap-1">
                                <MessageSquare className="h-4 w-4" />
                                Message
                              </Button>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setSelectedAppointment(appointment)}
                                  >
                                    More Options
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Appointment Options</DialogTitle>
                                    <DialogDescription>
                                      Manage your appointment with {appointment.provider}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                      <h4 className="font-medium">Appointment Details</h4>
                                      <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div>Provider:</div>
                                        <div>{appointment.provider}</div>
                                        <div>Date:</div>
                                        <div>{format(appointment.date, "MMMM d, yyyy")}</div>
                                        <div>Time:</div>
                                        <div>
                                          {appointment.time} ({appointment.duration})
                                        </div>
                                        <div>Type:</div>
                                        <div className="capitalize">{appointment.type}</div>
                                        <div>Location:</div>
                                        <div>{appointment.location}</div>
                                      </div>
                                    </div>
                                  </div>
                                  <DialogFooter className="flex flex-col sm:flex-row gap-2">
                                    <Button variant="outline" onClick={handleReschedule}>
                                      Reschedule
                                    </Button>
                                    <Button variant="destructive" onClick={handleCancel}>
                                      Cancel Appointment
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
                <CardDescription>View your appointment schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                  modifiers={{
                    appointment: getAppointmentDates(),
                  }}
                  modifiersStyles={{
                    appointment: {
                      fontWeight: "bold",
                      backgroundColor: "var(--primary)",
                      color: "white",
                      borderRadius: "50%",
                    },
                  }}
                />

                <div className="mt-4">
                  <h4 className="font-medium mb-2">{date ? format(date, "MMMM d, yyyy") : "Select a date"}</h4>

                  {filteredAppointments.length > 0 ? (
                    <div className="space-y-2">
                      {filteredAppointments.map((appointment) => (
                        <div key={appointment.id} className="flex items-center justify-between p-2 border rounded-md">
                          <div className="flex items-center gap-2">
                            {appointment.type === "video" ? (
                              <Video className="h-4 w-4 text-blue-500" />
                            ) : (
                              <User className="h-4 w-4 text-green-500" />
                            )}
                            <span className="text-sm">{appointment.time}</span>
                          </div>
                          <span className="text-sm font-medium">{appointment.provider}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    date && (
                      <div className="text-center py-2">
                        <p className="text-sm text-muted-foreground">No appointments on this day</p>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Schedule New Appointment</Button>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="mr-2 h-5 w-5 text-amber-500" />
                Appointment Reminders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-3 bg-amber-50 dark:bg-amber-950/50 rounded-lg border border-amber-200 dark:border-amber-800">
                  <div className="bg-amber-100 dark:bg-amber-900 p-2 rounded-full">
                    <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h4 className="font-medium">Prepare for your upcoming appointment</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Remember to have your recent medication list and any new symptoms documented for your appointment
                      with Dr. Sarah Johnson today at 2:00 PM.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                    <Video className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-medium">Test your video setup</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      For the best telehealth experience, test your camera and microphone before your appointment.
                    </p>
                    <Button size="sm" variant="link" className="p-0 h-auto mt-1">
                      Run Connection Test
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="past">
          <Card>
            <CardHeader>
              <CardTitle>Past Appointments</CardTitle>
              <CardDescription>Review your previous consultations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <p className="text-muted-foreground">Your past appointment history will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Schedule New Appointment</CardTitle>
              <CardDescription>Book a consultation with your healthcare provider</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <p className="text-muted-foreground">Appointment scheduling feature coming soon</p>
                <Button className="mt-4">Contact Support for Scheduling</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
