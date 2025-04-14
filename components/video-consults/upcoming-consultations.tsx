"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { format, addDays, isSameDay, isToday, isTomorrow } from "date-fns"
import {
  CalendarIcon,
  Clock,
  Video,
  Phone,
  MessageSquare,
  FileText,
  AlertCircle,
  CheckCircle,
  Info,
  Plus,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Mock upcoming consultations data
const upcomingConsultations = [
  {
    id: 1,
    provider: {
      name: "Dr. Sarah Johnson",
      specialty: "Oncologist",
      avatar: "/placeholder.svg?height=50&width=50",
    },
    date: addDays(new Date(), 0),
    time: "2:00 PM",
    duration: "30 minutes",
    status: "scheduled",
    type: "Follow-up Consultation",
    notes: "Discussion of recent lab results and treatment plan adjustments.",
    joinUrl: "/dashboard/video-consults/join/1",
  },
  {
    id: 2,
    provider: {
      name: "Dr. Michael Chen",
      specialty: "Hematologist",
      avatar: "/placeholder.svg?height=50&width=50",
    },
    date: addDays(new Date(), 2),
    time: "10:30 AM",
    duration: "45 minutes",
    status: "scheduled",
    type: "Treatment Review",
    notes: "Comprehensive review of treatment progress and side effect management.",
    joinUrl: "/dashboard/video-consults/join/2",
  },
  {
    id: 3,
    provider: {
      name: "Emily Rodriguez",
      specialty: "Genetic Counselor",
      avatar: "/placeholder.svg?height=50&width=50",
    },
    date: addDays(new Date(), 5),
    time: "1:15 PM",
    duration: "60 minutes",
    status: "scheduled",
    type: "Genetic Counseling",
    notes: "Discussion of genetic test results and implications for family members.",
    joinUrl: "/dashboard/video-consults/join/3",
  },
]

export function UpcomingConsultations() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedConsultation, setSelectedConsultation] = useState<any>(null)
  const router = useRouter()
  const { toast } = useToast()

  // Filter consultations for the selected date
  const filteredConsultations = date
    ? upcomingConsultations.filter((consultation) => isSameDay(consultation.date, date))
    : upcomingConsultations

  // Function to handle joining a consultation
  const handleJoinConsultation = (consultation: any) => {
    router.push(consultation.joinUrl)
  }

  // Function to handle cancellation
  const handleCancelConsultation = () => {
    toast({
      title: "Consultation Cancelled",
      description: "Your consultation has been cancelled successfully.",
    })
    setSelectedConsultation(null)
  }

  // Function to handle rescheduling
  const handleRescheduleConsultation = () => {
    toast({
      title: "Reschedule Requested",
      description: "Your request to reschedule has been sent to your provider.",
    })
    setSelectedConsultation(null)
  }

  // Function to get consultation dates for highlighting in calendar
  const getConsultationDates = () => {
    return upcomingConsultations.map((consultation) => consultation.date)
  }

  // Function to format date display
  const formatDateDisplay = (date: Date) => {
    if (isToday(date)) return "Today"
    if (isTomorrow(date)) return "Tomorrow"
    return format(date, "EEEE, MMMM d")
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Upcoming Video Consultations</CardTitle>
            <CardDescription>Your scheduled video consultations with healthcare providers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredConsultations.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No consultations scheduled for this date</p>
              </div>
            ) : (
              filteredConsultations.map((consultation) => (
                <Card key={consultation.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row">
                      <div
                        className={`p-4 sm:w-2 ${isToday(consultation.date) ? "bg-blue-500 dark:bg-blue-600" : "bg-green-500 dark:bg-green-600"}`}
                      ></div>
                      <div className="flex-1 p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={consultation.provider.avatar} alt={consultation.provider.name} />
                              <AvatarFallback>{consultation.provider.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-semibold">{consultation.provider.name}</h4>
                              <p className="text-sm text-muted-foreground">{consultation.provider.specialty}</p>
                            </div>
                          </div>
                          <div className="flex flex-col sm:items-end">
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{formatDateDisplay(consultation.date)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                {consultation.time} ({consultation.duration})
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3">
                          <Badge variant="outline">{consultation.type}</Badge>
                        </div>

                        {consultation.notes && (
                          <div className="mt-2 text-sm text-muted-foreground">
                            <p>{consultation.notes}</p>
                          </div>
                        )}

                        <div className="mt-4 flex flex-wrap gap-2">
                          {isToday(consultation.date) && (
                            <Button size="sm" className="gap-1" onClick={() => handleJoinConsultation(consultation)}>
                              <Video className="h-4 w-4" />
                              Join Now
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
                          <Button size="sm" variant="outline" className="gap-1">
                            <FileText className="h-4 w-4" />
                            View Details
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" onClick={() => setSelectedConsultation(consultation)}>
                                More Options
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Consultation Options</DialogTitle>
                                <DialogDescription>
                                  Manage your consultation with {consultation?.provider?.name}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <h4 className="font-medium">Consultation Details</h4>
                                  <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>Provider:</div>
                                    <div>{consultation?.provider?.name}</div>
                                    <div>Specialty:</div>
                                    <div>{consultation?.provider?.specialty}</div>
                                    <div>Date:</div>
                                    <div>{consultation?.date && format(consultation.date, "MMMM d, yyyy")}</div>
                                    <div>Time:</div>
                                    <div>
                                      {consultation?.time} ({consultation?.duration})
                                    </div>
                                    <div>Type:</div>
                                    <div>{consultation?.type}</div>
                                  </div>
                                </div>
                              </div>
                              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                                <Button variant="outline" onClick={handleRescheduleConsultation}>
                                  Reschedule
                                </Button>
                                <Button variant="destructive" onClick={handleCancelConsultation}>
                                  Cancel Consultation
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
            <CardDescription>View your consultation schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              modifiers={{
                consultation: getConsultationDates(),
              }}
              modifiersStyles={{
                consultation: {
                  fontWeight: "bold",
                  backgroundColor: "var(--primary)",
                  color: "white",
                  borderRadius: "50%",
                },
              }}
            />

            <div className="mt-4">
              <h4 className="font-medium mb-2">{date ? format(date, "MMMM d, yyyy") : "Select a date"}</h4>

              {filteredConsultations.length > 0 ? (
                <div className="space-y-2">
                  {filteredConsultations.map((consultation) => (
                    <div key={consultation.id} className="flex items-center justify-between p-2 border rounded-md">
                      <div className="flex items-center gap-2">
                        <Video className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">{consultation.time}</span>
                      </div>
                      <span className="text-sm font-medium">{consultation.provider.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                date && (
                  <div className="text-center py-2">
                    <p className="text-sm text-muted-foreground">No consultations on this day</p>
                  </div>
                )
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full gap-1">
              <Plus className="h-4 w-4" />
              Schedule New Consultation
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Info className="mr-2 h-5 w-5 text-blue-500" />
            Preparing for Your Video Consultation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-3 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-medium">Test your equipment</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Make sure your camera, microphone, and speakers are working properly before your consultation.
                </p>
                <Button size="sm" variant="link" className="p-0 h-auto mt-1">
                  Run Connection Test
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-4 p-3 bg-green-50 dark:bg-green-950/50 rounded-lg border border-green-200 dark:border-green-800">
              <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className="font-medium">Prepare your questions</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Write down any questions or concerns you want to discuss with your healthcare provider.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-3 bg-amber-50 dark:bg-amber-950/50 rounded-lg border border-amber-200 dark:border-amber-800">
              <div className="bg-amber-100 dark:bg-amber-900 p-2 rounded-full">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h4 className="font-medium">Find a quiet, private space</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Choose a well-lit, quiet location where you can speak privately with your healthcare provider.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
