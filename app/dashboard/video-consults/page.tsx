import type { Metadata } from "next"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus, Filter } from "lucide-react"
import { UpcomingConsultations } from "@/components/video-consults/upcoming-consultations"
import { PastConsultations } from "@/components/video-consults/past-consultations"
import { ScheduleConsultation } from "@/components/video-consults/schedule-consultation"
import { AvailableProviders } from "@/components/video-consults/available-providers"

export const metadata: Metadata = {
  title: "Video Consultations | GenomicInsights",
  description: "Schedule and join video consultations with your healthcare team",
}

export default function VideoConsultsPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Video Consultations"
        text="Schedule and join video consultations with your healthcare team"
      >
        <div className="flex gap-2">
          <Button variant="outline" className="gap-1">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button className="gap-1">
            <Plus className="h-4 w-4" />
            Schedule Consultation
          </Button>
        </div>
      </DashboardHeader>

      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="providers">Providers</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          <UpcomingConsultations />
        </TabsContent>

        <TabsContent value="past">
          <PastConsultations />
        </TabsContent>

        <TabsContent value="schedule">
          <ScheduleConsultation />
        </TabsContent>

        <TabsContent value="providers">
          <AvailableProviders />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
