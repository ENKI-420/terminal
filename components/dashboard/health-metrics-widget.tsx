"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart } from "@/components/charts"
import { Activity, Plus } from "lucide-react"
import Link from "next/link"

export function HealthMetricsWidget() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Health Metrics</CardTitle>
            <CardDescription>Track your key health indicators over time</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add Metric
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="blood" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="blood">Blood Counts</TabsTrigger>
            <TabsTrigger value="molecular">Molecular</TabsTrigger>
            <TabsTrigger value="vitals">Vitals</TabsTrigger>
          </TabsList>

          <TabsContent value="blood" className="space-y-4">
            <div className="h-[200px]">
              <LineChart
                data={[
                  { date: "Feb 1", wbc: 2.0, hgb: 9.0, plt: 80 },
                  { date: "Feb 15", wbc: 2.2, hgb: 9.2, plt: 85 },
                  { date: "Mar 1", wbc: 2.5, hgb: 9.5, plt: 95 },
                  { date: "Mar 15", wbc: 2.8, hgb: 10.0, plt: 110 },
                  { date: "Apr 1", wbc: 3.2, hgb: 10.5, plt: 120 },
                ]}
                categories={["wbc", "hgb", "plt"]}
                index="date"
                colors={["#3b82f6", "#ef4444", "#10b981"]}
                valueFormatter={(value) => `${value}`}
                yAxisWidth={40}
              />
            </div>
            <div className="flex flex-wrap gap-4 mt-2">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm">WBC (K/µL)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm">Hemoglobin (g/dL)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm">Platelets (K/µL)</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="molecular" className="space-y-4">
            <div className="h-[200px]">
              <LineChart
                data={[
                  { date: "Jan 1", flt3: 28.4, npm1: 35.2 },
                  { date: "Feb 1", flt3: 22.8, npm1: 27.8 },
                  { date: "Mar 1", flt3: 15.2, npm1: 20.3 },
                  { date: "Apr 1", flt3: 8.5, npm1: 14.1 },
                ]}
                categories={["flt3", "npm1"]}
                index="date"
                colors={["#8b5cf6", "#ec4899"]}
                valueFormatter={(value) => `${value}% VAF`}
                yAxisWidth={40}
              />
            </div>
            <div className="flex flex-wrap gap-4 mt-2">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span className="text-sm">FLT3-ITD (% VAF)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                <span className="text-sm">NPM1 (% VAF)</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="vitals" className="space-y-4">
            <div className="h-[200px]">
              <LineChart
                data={[
                  { date: "Feb 1", temp: 98.6, hr: 72, bp: 120 },
                  { date: "Feb 15", temp: 98.8, hr: 75, bp: 122 },
                  { date: "Mar 1", temp: 98.7, hr: 73, bp: 118 },
                  { date: "Mar 15", temp: 98.6, hr: 70, bp: 119 },
                  { date: "Apr 1", temp: 98.7, hr: 71, bp: 120 },
                ]}
                categories={["temp", "hr", "bp"]}
                index="date"
                colors={["#f59e0b", "#3b82f6", "#ef4444"]}
                valueFormatter={(value) => `${value}`}
                yAxisWidth={40}
              />
            </div>
            <div className="flex flex-wrap gap-4 mt-2">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span className="text-sm">Temperature (°F)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm">Heart Rate (bpm)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm">Systolic BP (mmHg)</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" className="w-full" asChild>
          <Link href="/dashboard/health-tracking">
            <Activity className="h-3.5 w-3.5 mr-1" />
            View Detailed Health Metrics
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
