import type React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, Calendar, MessageSquare, FlaskRoundIcon as Flask, Pill, Settings } from "lucide-react"

export default function NotificationsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">Manage your notification preferences and history</p>
        </div>
        <Button variant="outline">
          <Settings className="mr-2 h-4 w-4" />
          Notification Settings
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="lab-results">Lab Results</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Today</CardTitle>
              <CardDescription>Notifications from the last 24 hours</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <NotificationItem
                icon={<Calendar className="h-5 w-5 text-blue-500" />}
                title="Upcoming Appointment"
                description="Reminder: You have an appointment with Dr. Smith tomorrow at 10:00 AM."
                time="2 hours ago"
                isUnread
              />
              <NotificationItem
                icon={<MessageSquare className="h-5 w-5 text-green-500" />}
                title="New Message"
                description="Dr. Johnson sent you a message regarding your recent lab results."
                time="5 hours ago"
                isUnread
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Yesterday</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <NotificationItem
                icon={<Flask className="h-5 w-5 text-purple-500" />}
                title="Lab Results Available"
                description="Your recent blood work results are now available for review."
                time="1 day ago"
              />
              <NotificationItem
                icon={<Pill className="h-5 w-5 text-yellow-500" />}
                title="Medication Reminder"
                description="Time to take your evening medication: Lisinopril 10mg."
                time="1 day ago"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Earlier This Week</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <NotificationItem
                icon={<Bell className="h-5 w-5 text-red-500" />}
                title="System Maintenance"
                description="The telehealth platform will be undergoing maintenance tonight from 2-4 AM EST."
                time="2 days ago"
              />
              <NotificationItem
                icon={<Calendar className="h-5 w-5 text-blue-500" />}
                title="Appointment Confirmed"
                description="Your appointment with Dr. Williams has been confirmed for Friday at 2:30 PM."
                time="3 days ago"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Appointment Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <NotificationItem
                icon={<Calendar className="h-5 w-5 text-blue-500" />}
                title="Upcoming Appointment"
                description="Reminder: You have an appointment with Dr. Smith tomorrow at 10:00 AM."
                time="2 hours ago"
                isUnread
              />
              <NotificationItem
                icon={<Calendar className="h-5 w-5 text-blue-500" />}
                title="Appointment Confirmed"
                description="Your appointment with Dr. Williams has been confirmed for Friday at 2:30 PM."
                time="3 days ago"
              />
              <NotificationItem
                icon={<Calendar className="h-5 w-5 text-blue-500" />}
                title="Appointment Rescheduled"
                description="Your appointment with Dr. Johnson has been rescheduled to next Monday at 11:00 AM."
                time="1 week ago"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Message Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <NotificationItem
                icon={<MessageSquare className="h-5 w-5 text-green-500" />}
                title="New Message"
                description="Dr. Johnson sent you a message regarding your recent lab results."
                time="5 hours ago"
                isUnread
              />
              <NotificationItem
                icon={<MessageSquare className="h-5 w-5 text-green-500" />}
                title="New Message"
                description="Nurse Patel sent you information about your upcoming procedure."
                time="2 days ago"
              />
              <NotificationItem
                icon={<MessageSquare className="h-5 w-5 text-green-500" />}
                title="New Message"
                description="Dr. Smith has responded to your question about medication side effects."
                time="1 week ago"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lab-results" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Lab Result Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <NotificationItem
                icon={<Flask className="h-5 w-5 text-purple-500" />}
                title="Lab Results Available"
                description="Your recent blood work results are now available for review."
                time="1 day ago"
              />
              <NotificationItem
                icon={<Flask className="h-5 w-5 text-purple-500" />}
                title="Lab Results Reviewed"
                description="Dr. Johnson has reviewed your lab results and added comments."
                time="3 days ago"
              />
              <NotificationItem
                icon={<Flask className="h-5 w-5 text-purple-500" />}
                title="New Lab Order"
                description="Dr. Smith has ordered new lab tests for you to complete before your next appointment."
                time="1 week ago"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medications" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Medication Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <NotificationItem
                icon={<Pill className="h-5 w-5 text-yellow-500" />}
                title="Medication Reminder"
                description="Time to take your evening medication: Lisinopril 10mg."
                time="1 day ago"
              />
              <NotificationItem
                icon={<Pill className="h-5 w-5 text-yellow-500" />}
                title="Prescription Refill"
                description="Your prescription for Metformin has been refilled and is ready for pickup."
                time="3 days ago"
              />
              <NotificationItem
                icon={<Pill className="h-5 w-5 text-yellow-500" />}
                title="Medication Change"
                description="Dr. Smith has updated your Atorvastatin dosage from 20mg to 40mg daily."
                time="1 week ago"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface NotificationItemProps {
  icon: React.ReactNode
  title: string
  description: string
  time: string
  isUnread?: boolean
}

function NotificationItem({ icon, title, description, time, isUnread }: NotificationItemProps) {
  return (
    <div className={`flex items-start space-x-4 rounded-lg p-3 ${isUnread ? "bg-muted/50" : ""}`}>
      <div className="mt-0.5">{icon}</div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <p className={`text-sm font-medium ${isUnread ? "font-semibold" : ""}`}>{title}</p>
          <span className="text-xs text-muted-foreground">{time}</span>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {isUnread && (
        <div className="flex h-2 w-2 items-center justify-center">
          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
        </div>
      )}
    </div>
  )
}
