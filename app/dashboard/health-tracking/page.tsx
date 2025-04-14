import type { Metadata } from "next"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Health Tracking | GenomicInsights",
  description: "Track and monitor your health metrics",
}

export default function HealthTrackingPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Health Tracking" text="Monitor your health metrics and track your progress">
        <Button className="gap-1">
          <PlusCircle className="h-4 w-4" />
          Add Measurement
        </Button>
      </DashboardHeader>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h3 className="text-lg font-medium">Health Tracking Coming Soon</h3>
          <p className="text-sm text-muted-foreground mt-1">This feature is currently under development.</p>
        </div>
      </div>
    </DashboardShell>
  )
}
