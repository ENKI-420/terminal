import type { Metadata } from "next"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { LabHistory } from "@/components/telehealth/lab-history"
import { Button } from "@/components/ui/button"
import { Download, Filter } from "lucide-react"

export const metadata: Metadata = {
  title: "Lab History | GenomicInsights",
  description: "View and analyze your complete laboratory history",
}

export default function LabHistoryPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Lab History"
        text="View and analyze your complete laboratory history with advanced filtering and trending capabilities."
      >
        <div className="flex gap-2">
          <Button variant="outline" className="gap-1">
            <Filter className="h-4 w-4" />
            Advanced Filters
          </Button>
          <Button className="gap-1">
            <Download className="h-4 w-4" />
            Export All
          </Button>
        </div>
      </DashboardHeader>
      <LabHistory />
    </DashboardShell>
  )
}
