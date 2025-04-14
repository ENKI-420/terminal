"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, Calendar, FileText, MessageSquare, Pill } from "lucide-react"
import { format, subHours } from "date-fns"
import Link from "next/link"

export function NotificationsWidget() {
  // Mock notifications data
  const notifications = [
    {
      id: 1,
      type: "appointment",
      title: "Upcoming Appointment",
      message: "Reminder: You have an appointment with Dr. Sarah Johnson tomorrow at 2:00 PM.",
      time: subHours(new Date(), 1),
      read: false,
      actionUrl: "/dashboard/video-consults",
    },
    {
      id: 2,
      type: "lab",
      title: "New Lab Results",
      message: "Your recent blood work results are now available. Click to view.",
      time: subHours(new Date(), 3),
      read: false,
      actionUrl: "/dashboard/lab-history",
    },
    {
      id: 3,
      type: "message",
      title: "Message from Dr. Chen",
      message: "Dr. Chen sent you a message regarding your treatment plan.",
      time: subHours(new Date(), 5),
      read: true,
      actionUrl: "/dashboard/messages",
    },
    {
      id: 4,
      type: "medication",
      title: "Medication Reminder",
      message: "Remember to take your Venetoclax medication today.",
      time: subHours(new Date(), 8),
      read: true,
      actionUrl: "/dashboard/medications",
    },
  ]

  // Function to format time
  const formatTime = (time: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))

    if (diffInHours < 1) {
      return `${diffInMinutes} min ago`
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`
    } else {
      return format(time, "MMM d, yyyy")
    }
  }

  // Function to get icon based on notification type
  const getIcon = (type: string) => {
    switch (type) {
      case "appointment":
        return <Calendar className="h-4 w-4 text-blue-500" />
      case "lab":
        return <FileText className="h-4 w-4 text-green-500" />
      case "message":
        return <MessageSquare className="h-4 w-4 text-purple-500" />
      case "medication":
        return <Pill className="h-4 w-4 text-amber-500" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Your recent alerts and notifications</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/notifications">View All</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 max-h-[300px] overflow-auto">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`flex gap-3 p-3 rounded-lg ${notification.read ? "bg-muted/40" : "bg-muted/70 border"}`}
          >
            <div className="mt-0.5">{getIcon(notification.type)}</div>
            <div className="flex-1 space-y-1">
              <div className="flex items-start justify-between gap-2">
                <p className={`text-sm font-medium ${!notification.read && "text-primary"}`}>{notification.title}</p>
                <p className="text-xs text-muted-foreground whitespace-nowrap">{formatTime(notification.time)}</p>
              </div>
              <p className="text-xs text-muted-foreground">{notification.message}</p>
              <div>
                <Button variant="link" size="sm" className="h-auto p-0 text-xs" asChild>
                  <Link href={notification.actionUrl}>View Details</Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" className="w-full" asChild>
          <Link href="/dashboard/notifications">
            <Bell className="h-3.5 w-3.5 mr-1" />
            View All Notifications
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
