"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs } from "@/components/ui/tabs"
import { CreditCard } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"

export function BillingOverview() {
  // Mock billing data
  const billingOverview = {
    currentBalance: 250.0,
    nextPaymentDate: new Date(2025, 4, 15),
    nextPaymentAmount: 250.0,
    insuranceCoverage: 85,
    outOfPocketMax: 5000.0,
    outOfPocketUsed: 1250.0,
    recentTransactions: [
      {
        id: 1,
        date: new Date(2025, 3, 1),
        description: "Video Consultation - Dr. Sarah Johnson",
        amount: 150.0,
        status: "paid",
      },
      {
        id: 2,
        date: new Date(2025, 3, 15),
        description: "Laboratory Tests - Molecular Testing",
        amount: 350.0,
        status: "insurance pending",
      },
      {
        id: 3,
        date: new Date(2025, 3, 22),
        description: "Medication - Venetoclax (30-day supply)",
        amount: 250.0,
        status: "due",
      },
    ],
    upcomingCharges: [
      {
        id: 1,
        date: new Date(2025, 4, 1),
        description: "Video Consultation - Dr. Sarah Johnson",
        estimatedAmount: 150.0,
      },
      {
        id: 2,
        date: new Date(2025, 4, 15),
        description: "Medication - Venetoclax (30-day supply)",
        estimatedAmount: 250.0,
      },
    ],
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Current Balance</CardTitle>
            <CardDescription>Amount due for payment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold">${billingOverview.currentBalance.toFixed(2)}</span>
              <span className="text-muted-foreground ml-2">USD</span>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              Next payment of ${billingOverview.nextPaymentAmount.toFixed(2)} due on{" "}
              {format(billingOverview.nextPaymentDate, "MMMM d, yyyy")}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Make a Payment</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Insurance Coverage</CardTitle>
            <CardDescription>Your current insurance details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Coverage Rate</span>
              <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                {billingOverview.insuranceCoverage}%
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Out-of-Pocket Maximum</span>
                <span>${billingOverview.outOfPocketMax.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Used</span>
                <span>${billingOverview.outOfPocketUsed.toFixed(2)}</span>
              </div>
              <Progress
                value={(billingOverview.outOfPocketUsed / billingOverview.outOfPocketMax) * 100}
                className="h-2"
              />
              <p className="text-xs text-muted-foreground">
                You've used {((billingOverview.outOfPocketUsed / billingOverview.outOfPocketMax) * 100).toFixed(0)}% of
                your out-of-pocket maximum for this year.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/dashboard/billing?tab=insurance">View Insurance Details</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Payment Methods</CardTitle>
            <CardDescription>Your saved payment methods</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <div className="p-2 rounded-full bg-muted">
                  <CreditCard className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium truncate">Visa ending in 4242</h4>
                    <Badge variant="outline">Default</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Expires 12/2026</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <div className="p-2 rounded-full bg-muted">
                  <CreditCard className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">Mastercard ending in 5555</h4>
                  <p className="text-sm text-muted-foreground">Expires 08/2025</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/dashboard/billing?tab=payment-methods">Manage Payment Methods</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Recent & Upcoming Charges</CardTitle>
          <CardDescription>View your recent and upcoming billing activity</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="recent" className=""></Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
