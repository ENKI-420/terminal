"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, TrendingUp, Calendar } from "lucide-react"
import { format, subDays } from "date-fns"
import Link from "next/link"

interface RecentLabResultsWidgetProps {
  fullWidth?: boolean
}

export function RecentLabResultsWidget({ fullWidth = false }: RecentLabResultsWidgetProps) {
  // Mock lab results data
  const recentLabResults = [
    {
      id: "lab-001",
      name: "Complete Blood Count (CBC)",
      category: "Hematology",
      date: subDays(new Date(), 2),
      status: "abnormal",
      provider: "Dr. Sarah Johnson",
      keyFindings: "WBC, RBC, and platelets below normal range but improving from previous results.",
      viewUrl: "/dashboard/lab-history",
    },
    {
      id: "lab-002",
      name: "Comprehensive Metabolic Panel (CMP)",
      category: "Chemistry",
      date: subDays(new Date(), 2),
      status: "normal",
      provider: "Dr. Sarah Johnson",
      keyFindings: "All values within normal range. Liver and kidney function normal.",
      viewUrl: "/dashboard/lab-history",
    },
    {
      id: "lab-003",
      name: "Molecular Testing",
      category: "Genomics",
      date: subDays(new Date(), 2),
      status: "abnormal",
      provider: "Dr. Michael Chen",
      keyFindings:
        "FLT3-ITD and NPM1 mutations detected but showing significant reduction in variant allele frequency.",
      viewUrl: "/dashboard/lab-history",
    },
  ]

  // Limit the number of results shown unless fullWidth is true
  const displayResults = fullWidth ? recentLabResults : recentLabResults.slice(0, 2)

  return (
    <Card className={fullWidth ? "col-span-full" : ""}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Lab Results</CardTitle>
            <CardDescription>Your latest laboratory test results</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/lab-history">View All</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {displayResults.map((result) => (
          <div key={result.id} className="flex items-start gap-4 p-3 rounded-lg border">
            <div className="p-2 rounded-full bg-muted">
              <FileText className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="font-medium truncate">{result.name}</h4>
                  <p className="text-sm text-muted-foreground">{result.category}</p>
                </div>
                <Badge
                  variant="outline"
                  className={
                    result.status === "normal"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                  }
                >
                  {result.status === "normal" ? "Normal" : "Abnormal"}
                </Badge>
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{format(result.date, "MMM d, yyyy")}</span>
              </div>
              <p className="mt-2 text-sm">{result.keyFindings}</p>
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="outline" className="gap-1" asChild>
                  <Link href={result.viewUrl}>
                    <FileText className="h-3.5 w-3.5" />
                    View Details
                  </Link>
                </Button>
                <Button size="sm" variant="outline" className="gap-1">
                  <TrendingUp className="h-3.5 w-3.5" />
                  View Trends
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
      {!fullWidth && recentLabResults.length > 2 && (
        <CardFooter>
          <Button variant="ghost" size="sm" className="w-full" asChild>
            <Link href="/dashboard/lab-history">View All Lab Results</Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
