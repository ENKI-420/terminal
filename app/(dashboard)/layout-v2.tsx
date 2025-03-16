import type React from "react"
import { SidebarV2 } from "@/components/navigation/sidebar-v2"
import { SidebarInset } from "@/components/ui/sidebar"

export default function DashboardLayoutV2({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <SidebarV2 />
      <SidebarInset>
        <main className="flex-1">{children}</main>
      </SidebarInset>
    </div>
  )
}

