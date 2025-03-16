"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import {
  IconFlask,
  IconCalendar,
  IconDownload,
  IconChevronDown,
  IconChevronUp,
  IconAlertTriangle,
} from "@tabler/icons-react"
import { type LaboratoryReport, laboratoryService } from "@/lib/laboratory-service"
import { useToast } from "@/hooks/use-toast"

interface LaboratoryReportsProps {
  patientId: string
  title?: string
  description?: string
  isLoading?: boolean
}

export function LaboratoryReports({
  patientId,
  title = "Laboratory Reports",
  description = "Patient laboratory test results",
  isLoading: externalLoading = false,
}: LaboratoryReportsProps) {
  const [reports, setReports] = useState<LaboratoryReport[]>([])
  const [beakerReports, setBeakerReports] = useState<LaboratoryReport[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedReports, setExpandedReports] = useState<Record<string, boolean>>({})
  const [activeTab, setActiveTab] = useState("all")
  const { toast } = useToast()

  useEffect(() => {
    const fetchReports = async () => {
      if (!patientId) return

      setIsLoading(true)
      setError(null)

      try {
        // Fetch all laboratory reports
        const allReports = await laboratoryService.getPatientLaboratoryReports(patientId)
        setReports(allReports)

        // Fetch Beaker-specific reports
        const beakerResults = await laboratoryService.getBeakerLaboratoryReports(patientId)
        setBeakerReports(beakerResults)

        // Initialize expanded state
        const expanded: Record<string, boolean> = {}
        allReports.forEach((report) => {
          expanded[report.id] = false
        })
        setExpandedReports(expanded)
      } catch (error) {
        console.error("Error fetching laboratory reports:", error)
        setError("Failed to load laboratory reports. Please try again.")
        toast({
          title: "Error",
          description: "Failed to load laboratory reports",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchReports()
  }, [patientId, toast])

  const toggleReportExpansion = (reportId: string) => {
    setExpandedReports((prev) => ({
      ...prev,
      [reportId]: !prev[reportId],
    }))
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } catch (e) {
      return dateString
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "final":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "preliminary":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "cancelled":
      case "entered-in-error":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      case "registered":
      case "partial":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  const downloadReport = (report: LaboratoryReport) => {
    // Create a CSV string
    let csv = "Test,Result,Unit,Reference Range,Interpretation\n"

    report.results.forEach((result) => {
      csv += `"${result.name}","${result.value || ""}","${result.unit || ""}","${result.referenceRange || ""}","${result.interpretation || ""}"\n`
    })

    // Create a download link
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `lab-report-${report.id}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Report Downloaded",
      description: "Laboratory report has been downloaded as CSV",
    })
  }

  if (isLoading || externalLoading) {
    return <LaboratoryReportsSkeleton />
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader className="bg-destructive/10">
          <CardTitle className="flex items-center text-destructive">
            <IconAlertTriangle className="mr-2 h-5 w-5" />
            Error Loading Laboratory Reports
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p>{error}</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  const displayReports = activeTab === "beaker" ? beakerReports : reports

  if (displayReports.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <IconFlask className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Laboratory Reports Available</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            {activeTab === "beaker"
              ? "No Beaker laboratory reports found for this patient."
              : "No laboratory reports found for this patient."}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <IconFlask className="mr-2 h-5 w-5 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">All Reports</TabsTrigger>
            <TabsTrigger value="beaker">Beaker Reports</TabsTrigger>
          </TabsList>

          <div className="mt-4 space-y-4">
            {displayReports.map((report) => (
              <div key={report.id} className="border rounded-lg overflow-hidden">
                <div
                  className="bg-muted/50 p-4 flex items-center justify-between cursor-pointer"
                  onClick={() => toggleReportExpansion(report.id)}
                >
                  <div>
                    <h3 className="font-medium">{report.name}</h3>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <IconCalendar className="h-4 w-4 mr-1" />
                      <span>{formatDate(report.reportDate)}</span>
                      <span className={`ml-3 px-2 py-0.5 rounded-full text-xs ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        downloadReport(report)
                      }}
                    >
                      <IconDownload className="h-4 w-4" />
                    </Button>
                    {expandedReports[report.id] ? (
                      <IconChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <IconChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </div>

                <AnimatePresence>
                  {expandedReports[report.id] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="p-4 border-t">
                        {report.performer && (
                          <div className="mb-3 text-sm">
                            <span className="font-medium">Performed by:</span> {report.performer}
                          </div>
                        )}

                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-muted/30">
                              <tr>
                                <th className="px-4 py-2 text-left text-sm font-medium">Test</th>
                                <th className="px-4 py-2 text-left text-sm font-medium">Result</th>
                                <th className="px-4 py-2 text-left text-sm font-medium">Reference Range</th>
                                <th className="px-4 py-2 text-left text-sm font-medium">Interpretation</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y">
                              {report.results.map((result, index) => (
                                <tr key={result.id || index} className={result.abnormal ? "bg-destructive/10" : ""}>
                                  <td className="px-4 py-2 text-sm font-medium">{result.name}</td>
                                  <td className="px-4 py-2 text-sm">
                                    {result.value !== undefined ? `${result.value} ${result.unit || ""}` : "N/A"}
                                  </td>
                                  <td className="px-4 py-2 text-sm">{result.referenceRange || "N/A"}</td>
                                  <td className="px-4 py-2 text-sm">
                                    {result.interpretation ? (
                                      <span
                                        className={`px-2 py-1 rounded-full text-xs ${
                                          result.abnormal
                                            ? "bg-destructive/20 text-destructive"
                                            : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                        }`}
                                      >
                                        {result.interpretation}
                                      </span>
                                    ) : (
                                      "N/A"
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {report.conclusion && (
                          <div className="mt-4 p-3 bg-muted/20 rounded-md">
                            <p className="text-sm font-medium mb-1">Conclusion:</p>
                            <p className="text-sm">{report.conclusion}</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function LaboratoryReportsSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader>
        <Skeleton className="h-8 w-[250px] mb-2" />
        <Skeleton className="h-4 w-[300px]" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-4">
            <Skeleton className="h-10 w-[100px]" />
            <Skeleton className="h-10 w-[100px]" />
          </div>

          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg overflow-hidden">
              <div className="p-4">
                <Skeleton className="h-6 w-[200px] mb-2" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

