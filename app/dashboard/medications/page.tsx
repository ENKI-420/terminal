import type { Metadata } from "next"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Filter } from "lucide-react"
import { MedicationList } from "@/components/medications/medication-list"
import { MedicationSchedule } from "@/components/medications/medication-schedule"
import { MedicationHistory } from "@/components/medications/medication-history"
import { MedicationInteractions } from "@/components/medications/medication-interactions"

export const metadata: Metadata = {
  title: "Medications | GenomicInsights",
  description: "Manage your medications and track your adherence",
}

export default function MedicationsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Medication Management" text="Track, manage, and set reminders for your medications">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button size="sm" className="gap-1">
            <Plus className="h-4 w-4" />
            Add Medication
          </Button>
        </div>
      </DashboardHeader>

      <Tabs defaultValue="current" className="space-y-4">
        <TabsList>
          <TabsTrigger value="current">Current Medications</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="interactions">Interactions</TabsTrigger>
        </TabsList>

        <TabsContent value="current">
          <MedicationList />
        </TabsContent>

        <TabsContent value="schedule">
          <MedicationSchedule />
        </TabsContent>

        <TabsContent value="history">
          <MedicationHistory />
        </TabsContent>

        <TabsContent value="interactions">
          <MedicationInteractions />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
