"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, TrendingUp, TrendingDown, AlertCircle, CheckCircle, Info } from "lucide-react"

export function HealthSummary() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Health Summary</CardTitle>
            <CardDescription>Your current health status and key metrics</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Treatment Response</span>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                  >
                    Good
                  </Badge>
                </div>
                <Progress value={75} className="h-2" />
                <p className="text-xs text-muted-foreground">Molecular markers showing 75% reduction from baseline</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Blood Counts</span>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                  >
                    Improving
                  </Badge>
                </div>
                <Progress value={60} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  WBC, RBC, and platelets trending upward but still below normal
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Side Effects</span>
                  </div>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    Mild
                  </Badge>
                </div>
                <Progress value={25} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Mild fatigue and occasional nausea, well controlled with medication
                </p>
              </div>
            </div>

            <div className="rounded-lg border p-3">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium">Next Steps</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Continue current treatment regimen. Follow up with Dr. Johnson next week for comprehensive
                    evaluation. Repeat blood work and molecular testing scheduled for Monday.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <div className="rounded-lg border p-4">
              <h3 className="text-sm font-medium mb-2">Key Metrics Trends</h3>
              <div className="h-[200px] w-full bg-muted/50 rounded flex items-center justify-center">
                <p className="text-sm text-muted-foreground">Trend chart visualization</p>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <p className="font-medium">WBC</p>
                  <p className="text-green-600">↑ 20%</p>
                </div>
                <div>
                  <p className="font-medium">Hemoglobin</p>
                  <p className="text-green-600">↑ 15%</p>
                </div>
                <div>
                  <p className="font-medium">Platelets</p>
                  <p className="text-green-600">↑ 25%</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-2">
            <div className="flex items-start gap-3 p-3 rounded-lg border">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium">Treatment Response</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Molecular testing shows significant reduction in mutation burden
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg border">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium">Blood Counts</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Blood counts improving but still below normal range
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg border">
              <Info className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium">Medication Reminder</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Take Venetoclax with food to reduce risk of side effects
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
