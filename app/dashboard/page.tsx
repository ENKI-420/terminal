import type { Metadata } from "next"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Plus } from "lucide-react"
import { HealthSummary } from "@/components/dashboard/health-summary"
import { UpcomingAppointmentsWidget } from "@/components/dashboard/upcoming-appointments-widget"
import { RecentLabResultsWidget } from "@/components/dashboard/recent-lab-results-widget"
import { MedicationTrackerWidget } from "@/components/dashboard/medication-tracker-widget"
import { HealthMetricsWidget } from "@/components/dashboard/health-metrics-widget"
import { TreatmentPlanWidget } from "@/components/dashboard/treatment-plan-widget"
import { NotificationsWidget } from "@/components/dashboard/notifications-widget"
import { ResourcesWidget } from "@/components/dashboard/resources-widget"

export const metadata: Metadata = {
  title: "Dashboard | GenomicInsights",
  description: "Your personalized genomic insights dashboard",
}

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Welcome, John"
        text="Here's an overview of your health information and upcoming activities."
      >
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Plus className="h-3.5 w-3.5" />
            Add Widget
          </Button>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Settings className="h-3.5 w-3.5" />
            Customize
          </Button>
        </div>
      </DashboardHeader>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="health">Health</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <HealthSummary />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UpcomingAppointmentsWidget />
            <RecentLabResultsWidget />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MedicationTrackerWidget />
            <NotificationsWidget />
            <ResourcesWidget />
          </div>
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <HealthMetricsWidget />
            <TreatmentPlanWidget />
          </div>

          <RecentLabResultsWidget fullWidth />
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <UpcomingAppointmentsWidget fullWidth />
        </TabsContent>

        <TabsContent value="medications" className="space-y-4">
          <MedicationTrackerWidget fullWidth />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
