"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { IconChevronDown, IconChevronUp, IconFileText, IconDownload, IconChartLine } from "@tabler/icons-react"

interface BeakerReportCardProps {
  report: {
    id: string
    name: string
    date: string
    status: string
    results: Array<{
      name: string
      value: any
      unit: string
      range: string
      normal: boolean
    }>
  }
}

export function BeakerReportCard({ report }: BeakerReportCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation()
    // In a real implementation, this would download the report
    alert(`Downloading ${report.name}`)
  }

  const handleViewTrends = (e: React.MouseEvent, resultName: string) => {
    e.stopPropagation()
    // In a real implementation, this would show trends for the result
    alert(`Viewing trends for ${resultName}`)
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-secondary/30 p-4 flex items-center justify-between cursor-pointer" onClick={toggleExpand}>
        <div>
          <h3 className="font-semibold">{report.name}</h3>
          <div className="flex items-center text-sm text-muted-foreground mt-1">
            <span>{report.date}</span>
            <span className="mx-2">•</span>
            <span>{report.status}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <IconDownload className="h-4 w-4 mr-1" />
            Download
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleExpand}>
            {isExpanded ? <IconChevronUp className="h-5 w-5" /> : <IconChevronDown className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 border-t border-border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/20">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium">Test</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Result</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Reference Range</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {report.results.map((result, index) => (
                  <tr key={index} className={!result.normal ? "bg-destructive/10" : ""}>
                    <td className="px-4 py-2 text-sm font-medium">{result.name}</td>
                    <td className="px-4 py-2 text-sm">
                      <span className={!result.normal ? "text-destructive font-medium" : ""}>
                        {result.value} {result.unit}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm">{result.range}</td>
                    <td className="px-4 py-2 text-sm">
                      <Button variant="ghost" size="sm" onClick={(e) => handleViewTrends(e, result.name)}>
                        <IconChartLine className="h-4 w-4 mr-1" />
                        Trends
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-end">
            <Button variant="outline" size="sm">
              <IconFileText className="h-4 w-4 mr-1" />
              View Full Report
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

