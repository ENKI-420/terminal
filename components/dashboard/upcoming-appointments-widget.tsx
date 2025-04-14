"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Video, Phone, Plus } from "lucide-react"
import { format, addDays, isToday, isTomorrow } from "date-fns"
import Link from "next/link"

interface UpcomingAppointmentsWidgetProps {
  fullWidth?: boolean
}

export function UpcomingAppointmentsWidget({ fullWidth = false }: UpcomingAppointmentsWidgetProps) {
  // Mock upcoming appointments data
  const upcomingAppointments = [
    {
      id: 1,
      provider: {
        name: "Dr. Sarah Johnson",
        specialty: "Oncologist",
      },
      date: addDays(new Date(), 0),
      time: "2:00 PM",
      duration: "30 minutes",
      type: "Video Consultation",
      joinUrl: "/dashboard/video-consults/join/1",
    },
    {
      id: 2,
      provider: {
        name: "Dr. Michael Chen",
        specialty: "Hematologist",
      },
      date: addDays(new Date(), 2),
      time: "10:30 AM",
      duration: "45 minutes",
      type: "Video Consultation",
      joinUrl: "/dashboard/video-consults/join/2",
    },
    {
      id: 3,
      provider: {
        name: "Emily Rodriguez",
        specialty: "Genetic Counselor",
      },
      date: addDays(new Date(), 5),
      time: "1:15 PM",
      duration: "60 minutes",
      type: "Video Consultation",
      joinUrl: "/dashboard/video-consults/join/3",
    },
  ]

  // Function to format date display
  const formatDateDisplay = (date: Date) => {
    if (isToday(date)) return "Today"
    if (isTomorrow(date)) return "Tomorrow"
    return format(date, "EEE, MMM d")
  }

  // Limit the number of appointments shown unless fullWidth is true
  const displayAppointments = fullWidth ? upcomingAppointments : upcomingAppointments.slice(0, 2)

  return (
    <Card className={fullWidth ? "col-span-full" : ""}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Your scheduled appointments with healthcare providers</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/video-consults?tab=schedule">
              <Plus className="h-3.5 w-3.5 mr-1" />
              Schedule
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {displayAppointments.map((appointment) => (
          <div key={appointment.id} className="flex items-start gap-4 p-3 rounded-lg border">
            <div
              className={`p-2 rounded-full ${isToday(appointment.date) ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" : "bg-muted"}`}
            >
              {appointment.type.includes("Video") ? <Video className="h-4 w-4" /> : <Phone className="h-4 w-4" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="font-medium truncate">{appointment.provider.name}</h4>
                  <p className="text-sm text-muted-foreground">{appointment.provider.specialty}</p>
                </div>
                <Badge variant="outline">{appointment.type}</Badge>
              </div>
              <div className="flex flex-wrap gap-3 mt-2 text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{formatDateDisplay(appointment.date)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>
                    {appointment.time} ({appointment.duration})
                  </span>
                </div>
              </div>
              {isToday(appointment.date) && (
                <div className="mt-3">
                  <Button size="sm" className="gap-1" asChild>
                    <Link href={appointment.joinUrl}>
                      <Video className="h-3.5 w-3.5" />
                      Join Now
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
      {!fullWidth && upcomingAppointments.length > 2 && (
        <CardFooter>
          <Button variant="ghost" size="sm" className="w-full" asChild>
            <Link href="/dashboard/video-consults">View All Appointments</Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
