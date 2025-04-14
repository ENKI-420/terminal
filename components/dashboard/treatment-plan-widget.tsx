"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clipboard, Calendar, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

export function TreatmentPlanWidget() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Treatment Plan</CardTitle>
            <CardDescription>Your current treatment regimen and progress</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border p-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Venetoclax + Azacitidine</h3>
            <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
              Active
            </Badge>
          </div>
          <div className="mt-2">
            <div className="flex items-center justify-between text-xs mb-1">
              <span>Treatment Cycle</span>
              <span>3 of 6</span>
            </div>
            <Progress value={50} className="h-1.5" />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Started: Jan 15, 2025</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Next cycle: May 1, 2025</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium">Treatment Milestones</h4>

          <div className="flex items-start gap-3">
            <div className="bg-green-100 dark:bg-green-900 p-1.5 rounded-full">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium">Initial Response Assessment</p>
              <p className="text-xs text-muted-foreground">Completed on Feb 15, 2025</p>
              <p className="text-xs mt-1">Bone marrow blast reduction from 45% to 15%</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-green-100 dark:bg-green-900 p-1.5 rounded-full">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium">Molecular Response Assessment</p>
              <p className="text-xs text-muted-foreground">Completed on Apr 1, 2025</p>
              <p className="text-xs mt-1">70% reduction in FLT3-ITD mutation burden</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-amber-100 dark:bg-amber-900 p-1.5 rounded-full">
              <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-medium">Mid-Treatment Assessment</p>
              <p className="text-xs text-muted-foreground">Scheduled for May 15, 2025</p>
              <p className="text-xs mt-1">Comprehensive evaluation including bone marrow biopsy</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" className="w-full" asChild>
          <Link href="/dashboard/treatment-plan">
            <Clipboard className="h-3.5 w-3.5 mr-1" />
            View Complete Treatment Plan
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
