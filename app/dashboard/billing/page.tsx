import type { Metadata } from "next"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Download } from "lucide-react"
import { PaymentMethods } from "@/components/billing/payment-methods"
import { BillingHistory } from "@/components/billing/billing-history"
import { InsuranceInformation } from "@/components/billing/insurance-information"
import { BillingOverview } from "@/components/billing/billing-overview"

export const metadata: Metadata = {
  title: "Billing & Payments | GenomicInsights",
  description: "Manage your billing information and payment methods",
}

export default function BillingPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Billing & Payments"
        text="Manage your payment methods, view billing history, and update insurance information"
      >
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button size="sm" className="gap-1">
            <Plus className="h-4 w-4" />
            Add Payment Method
          </Button>
        </div>
      </DashboardHeader>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="billing-history">Billing History</TabsTrigger>
          <TabsTrigger value="insurance">Insurance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <BillingOverview />
        </TabsContent>

        <TabsContent value="payment-methods">
          <PaymentMethods />
        </TabsContent>

        <TabsContent value="billing-history">
          <BillingHistory />
        </TabsContent>

        <TabsContent value="insurance">
          <InsuranceInformation />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
