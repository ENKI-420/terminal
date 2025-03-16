"use client"

import { SidebarV2 } from "@/components/navigation/sidebar-v2"
import { SidebarInset } from "@/components/ui/sidebar"

export default function ExamplePage() {
  return (
    <div className="flex min-h-screen">
      <SidebarV2 />
      <SidebarInset>
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-4">AGENT 2.0 Platform</h1>
          <p className="mb-4">This is an example page showing the new sidebar navigation in action.</p>
          <div className="p-4 bg-card rounded-lg border border-border">
            <h2 className="text-xl font-semibold mb-2">Sidebar Features</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Collapsible navigation with icon-only mode</li>
              <li>Organized sections for different platform modules</li>
              <li>Session timeout tracking (15-minute inactivity timer)</li>
              <li>HIPAA compliance indicators</li>
              <li>User role and notification display</li>
            </ul>
          </div>
        </main>
      </SidebarInset>
    </div>
  )
}

