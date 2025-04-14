"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UpcomingAppointments } from "@/components/telehealth/upcoming-appointments"
import { SecureMessaging } from "@/components/telehealth/secure-messaging"
import { RemoteMonitoring } from "@/components/telehealth/remote-monitoring"
import { ProgressTracker } from "@/components/telehealth/progress-tracker"
import { FeedbackSurveys } from "@/components/telehealth/feedback-surveys"
import { VideoConsultation } from "@/components/telehealth/video-consultation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MessageSquare, Activity, LineChart, Star, Video } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function TelehealthHub() {
  const [activeTab, setActiveTab] = useState("appointments")
  const { toast } = useToast()

  // Mock function to simulate joining a consultation
  const handleJoinConsultation = () => {
    toast({
      title: "Joining consultation",
      description: "Connecting to your healthcare provider...",
    })

    // In a real app, this would initiate the video call
    setTimeout(() => {
      setActiveTab("video")
      toast({
        title: "Connected",
        description: "You are now connected to your consultation.",
      })
    }, 1500)
  }

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Video className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
              Upcoming Consultation
            </CardTitle>
            <CardDescription>Today at 2:00 PM with Dr. Sarah Johnson</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={handleJoinConsultation}>
              Join Now
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <MessageSquare className="mr-2 h-5 w-5 text-green-600 dark:text-green-400" />
              New Messages
            </CardTitle>
            <CardDescription>You have 3 unread messages</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              onClick={() => setActiveTab("messaging")}
            >
              View Messages
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 border-amber-200 dark:border-amber-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Activity className="mr-2 h-5 w-5 text-amber-600 dark:text-amber-400" />
              Health Metrics
            </CardTitle>
            <CardDescription>Your latest vitals need attention</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full bg-amber-600 hover:bg-amber-700 text-white"
              onClick={() => setActiveTab("monitoring")}
            >
              Check Metrics
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-2">
          <TabsTrigger value="appointments" className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Appointments</span>
            <span className="sm:hidden">Appts</span>
          </TabsTrigger>
          <TabsTrigger value="video" className="flex items-center">
            <Video className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Video Call</span>
            <span className="sm:hidden">Video</span>
          </TabsTrigger>
          <TabsTrigger value="messaging" className="flex items-center">
            <MessageSquare className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Messaging</span>
            <span className="sm:hidden">Chat</span>
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="flex items-center">
            <Activity className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Monitoring</span>
            <span className="sm:hidden">Monitor</span>
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center">
            <LineChart className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Progress</span>
            <span className="sm:hidden">Progress</span>
          </TabsTrigger>
          <TabsTrigger value="feedback" className="flex items-center">
            <Star className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Feedback</span>
            <span className="sm:hidden">Feedback</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="appointments">
          <UpcomingAppointments />
        </TabsContent>

        <TabsContent value="video">
          <VideoConsultation />
        </TabsContent>

        <TabsContent value="messaging">
          <SecureMessaging />
        </TabsContent>

        <TabsContent value="monitoring">
          <RemoteMonitoring />
        </TabsContent>

        <TabsContent value="progress">
          <ProgressTracker />
        </TabsContent>

        <TabsContent value="feedback">
          <FeedbackSurveys />
        </TabsContent>
      </Tabs>
    </div>
  )
}
