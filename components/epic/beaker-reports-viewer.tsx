"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import {
  IconFlask,
  IconCalendar,
  IconDownload,
  IconChevronDown,
  IconChevronUp,
  IconAlertTriangle,
} from "@tabler/icons-react"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"

interface BeakerReportsViewerProps {
  patientId: string
}

export function BeakerReportsViewer({ patientId }: BeakerReportsViewerProps) {
  const [reports, setReports] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedReports, setExpandedReports] = useState<Record<string, boolean>>({})
  const { toast } = useToast()

  useEffect(() => {
    const fetchBeakerReports = async () => {
      if (!patientId) return

      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/epic/beaker-reports?patientId=${patientId}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch Beaker reports: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()

        if (!data.reports) {
          throw new Error("Invalid response format")
        }

        setReports(data.reports)

        // Initialize expanded state
        const expanded: Record<string, boolean> = {}
        data.reports.forEach((report: any) => {
          expanded[report.id] = false
        })
        setExpandedReports(expanded)
      } catch (error: any) {
        console.error("Error fetching Beaker reports:", error)
        setError(error.message || "Failed to load Beaker reports")
        toast({
          title: "Error",
          description: "Failed to load Beaker reports. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchBeakerReports()
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

  const downloadReport = (report: any) => {
    // Create a CSV string
    let csv = "Test,Result,Unit,Reference Range,Interpretation\n"

    if (report.result) {
      report.result.forEach((result: any) => {
        const resultValue = result.valueQuantity?.value || result.valueString || ""
        const unit = result.valueQuantity?.unit || ""
        const refRange = result.referenceRange?.[0]?.text || ""
        const interpretation = result.interpretation?.[0]?.text || ""

        csv += `"${result.code?.text || ""}","${resultValue}","${unit}","${refRange}","${interpretation}"\n`
      })
    }

    // Create a download link
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `beaker-report-${report.id}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Report Downloaded",
      description: "Beaker laboratory report has been downloaded as CSV",
    })
  }

  if (isLoading) {
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

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader className="bg-destructive/10">
          <CardTitle className="flex items-center text-destructive">
            <IconAlertTriangle className="mr-2 h-5 w-5" />
            Error Loading Beaker Reports
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

  if (reports.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            <IconFlask className="mr-2 h-5 w-5 text-primary" />
            Beaker Laboratory Reports
          </CardTitle>
          <CardDescription>Epic FHIR Beaker laboratory test results</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <IconFlask className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Beaker Reports Available</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            No Beaker laboratory reports found for this patient in Epic.
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
          Epic Beaker Laboratory Reports
        </CardTitle>
        <CardDescription>Laboratory test results from Epic FHIR</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">All Reports</TabsTrigger>
            <TabsTrigger value="abnormal">Abnormal Results</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4 space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="border rounded-lg overflow-hidden">
                <div
                  className="bg-muted/50 p-4 flex items-center justify-between cursor-pointer"
                  onClick={() => toggleReportExpansion(report.id)}
                >
                  <div>
                    <h3 className="font-medium">{report.code?.text || "Laboratory Report"}</h3>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <IconCalendar className="h-4 w-4 mr-1" />
                      <span>{formatDate(report.effectiveDateTime || report.issued || "")}</span>
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
                            <span className="font-medium">Performed by:</span>{" "}
                            {report.performer[0]?.display || report.performer[0]?.reference || "Unknown"}
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
                              {report.result?.map((result: any, index: number) => {
                                const resultValue = result.valueQuantity?.value || result.valueString || "N/A"
                                const unit = result.valueQuantity?.unit || ""
                                const refRange = result.referenceRange?.[0]?.text || "N/A"
                                const interpretation = result.interpretation?.[0]?.text || "Normal"
                                const isAbnormal = interpretation.toLowerCase() !== "normal"

                                return (
                                  <tr key={result.id || index} className={isAbnormal ? "bg-destructive/10" : ""}>
                                    <td className="px-4 py-2 text-sm font-medium">
                                      {result.code?.text || "Unknown Test"}
                                    </td>
                                    <td className="px-4 py-2 text-sm">
                                      {resultValue} {unit}
                                    </td>
                                    <td className="px-4 py-2 text-sm">{refRange}</td>
                                    <td className="px-4 py-2 text-sm">
                                      {interpretation ? (
                                        <span
                                          className={`px-2 py-1 rounded-full text-xs ${
                                            isAbnormal
                                              ? "bg-destructive/20 text-destructive"
                                              : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                          }`}
                                        >
                                          {interpretation}
                                        </span>
                                      ) : (
                                        "N/A"
                                      )}
                                    </td>
                                  </tr>
                                )
                              })}
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
          </TabsContent>

          <TabsContent value="abnormal" className="mt-4 space-y-4">
            {reports
              .filter((report) =>
                report.result?.some((result: any) => result.interpretation?.[0]?.text?.toLowerCase() !== "normal"),
              )
              .map((report) => (
                <div key={report.id} className="border rounded-lg overflow-hidden border-destructive/20">
                  <div
                    className="bg-destructive/10 p-4 flex items-center justify-between cursor-pointer"
                    onClick={() => toggleReportExpansion(`abnormal-${report.id}`)}
                  >
                    <div>
                      <h3 className="font-medium">{report.code?.text || "Laboratory Report"}</h3>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <IconCalendar className="h-4 w-4 mr-1" />
                        <span>{formatDate(report.effectiveDateTime || report.issued || "")}</span>
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
                      {expandedReports[`abnormal-${report.id}`] ? (
                        <IconChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <IconChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedReports[`abnormal-${report.id}`] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="p-4 border-t">
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
                                {report.result
                                  ?.filter(
                                    (result: any) => result.interpretation?.[0]?.text?.toLowerCase() !== "normal",
                                  )
                                  .map((result: any, index: number) => {
                                    const resultValue = result.valueQuantity?.value || result.valueString || "N/A"
                                    const unit = result.valueQuantity?.unit || ""
                                    const refRange = result.referenceRange?.[0]?.text || "N/A"
                                    const interpretation = result.interpretation?.[0]?.text || "Abnormal"

                                    return (
                                      <tr key={result.id || index} className="bg-destructive/10">
                                        <td className="px-4 py-2 text-sm font-medium">
                                          {result.code?.text || "Unknown Test"}
                                        </td>
                                        <td className="px-4 py-2 text-sm">
                                          {resultValue} {unit}
                                        </td>
                                        <td className="px-4 py-2 text-sm">{refRange}</td>
                                        <td className="px-4 py-2 text-sm">
                                          <span className="px-2 py-1 rounded-full text-xs bg-destructive/20 text-destructive">
                                            {interpretation}
                                          </span>
                                        </td>
                                      </tr>
                                    )
                                  })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

            {reports.filter((report) =>
              report.result?.some((result: any) => result.interpretation?.[0]?.text?.toLowerCase() !== "normal"),
            ).length === 0 && (
              <div className="text-center py-8">
                <IconFlask className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Abnormal Results</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  No abnormal laboratory results found in the Beaker reports.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

