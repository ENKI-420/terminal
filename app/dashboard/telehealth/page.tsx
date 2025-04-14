import type { Metadata } from "next"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { TelehealthHub } from "@/components/telehealth/telehealth-hub"
import { Button } from "@/components/ui/button"
import { Users, FileText } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Telehealth | GenomicInsights",
  description: "Connect with your healthcare team and manage your care remotely.",
}

export default function TelehealthPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Telehealth Center"
        text="Connect with your healthcare team, track your progress, and manage your care remotely."
      >
        <div className="flex gap-2">
          <Button asChild variant="outline" className="gap-1">
            <Link href="/dashboard/lab-history">
              <FileText className="h-4 w-4" />
              Lab History
            </Link>
          </Button>
          <Button className="gap-1">
            <Users className="h-4 w-4" />
            Conference Mode
          </Button>
        </div>
      </DashboardHeader>
      <TelehealthHub />
    </DashboardShell>
  )
}
