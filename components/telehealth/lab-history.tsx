"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Calendar, ChevronDown, Download, Filter, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Sample lab results data
const labResults = [
  {
    id: "1",
    testName: "Complete Blood Count (CBC)",
    date: new Date(2023, 11, 15),
    status: "Complete",
    provider: "GenomLab Inc.",
    category: "Hematology",
    results: [
      { name: "White Blood Cell Count", value: "7.5", unit: "K/uL", range: "4.5-11.0", status: "normal" },
      { name: "Red Blood Cell Count", value: "4.8", unit: "M/uL", range: "4.5-5.9", status: "normal" },
      { name: "Hemoglobin", value: "14.2", unit: "g/dL", range: "13.5-17.5", status: "normal" },
      { name: "Hematocrit", value: "42", unit: "%", range: "41-50", status: "normal" },
      { name: "Platelet Count", value: "250", unit: "K/uL", range: "150-450", status: "normal" },
    ],
  },
  {
    id: "2",
    testName: "Comprehensive Metabolic Panel",
    date: new Date(2023, 10, 20),
    status: "Complete",
    provider: "GenomLab Inc.",
    category: "Chemistry",
    results: [
      { name: "Glucose", value: "95", unit: "mg/dL", range: "70-99", status: "normal" },
      { name: "Sodium", value: "140", unit: "mmol/L", range: "136-145", status: "normal" },
      { name: "Potassium", value: "4.1", unit: "mmol/L", range: "3.5-5.0", status: "normal" },
      { name: "Chloride", value: "102", unit: "mmol/L", range: "98-107", status: "normal" },
      { name: "Carbon Dioxide", value: "24", unit: "mmol/L", range: "23-29", status: "normal" },
      { name: "Blood Urea Nitrogen", value: "15", unit: "mg/dL", range: "8-20", status: "normal" },
      { name: "Creatinine", value: "0.9", unit: "mg/dL", range: "0.6-1.2", status: "normal" },
      { name: "Calcium", value: "9.5", unit: "mg/dL", range: "8.5-10.2", status: "normal" },
    ],
  },
  {
    id: "3",
    testName: "Lipid Panel",
    date: new Date(2023, 9, 10),
    status: "Complete",
    provider: "HealthFirst Medical",
    category: "Chemistry",
    results: [
      { name: "Total Cholesterol", value: "210", unit: "mg/dL", range: "<200", status: "high" },
      { name: "HDL Cholesterol", value: "55", unit: "mg/dL", range: ">40", status: "normal" },
      { name: "LDL Cholesterol", value: "130", unit: "mg/dL", range: "<100", status: "high" },
      { name: "Triglycerides", value: "125", unit: "mg/dL", range: "<150", status: "normal" },
    ],
  },
  {
    id: "4",
    testName: "Thyroid Function Panel",
    date: new Date(2023, 8, 5),
    status: "Complete",
    provider: "GenomLab Inc.",
    category: "Endocrinology",
    results: [
      { name: "TSH", value: "2.5", unit: "uIU/mL", range: "0.4-4.0", status: "normal" },
      { name: "Free T4", value: "1.2", unit: "ng/dL", range: "0.8-1.8", status: "normal" },
      { name: "Free T3", value: "3.1", unit: "pg/mL", range: "2.3-4.2", status: "normal" },
    ],
  },
  {
    id: "5",
    testName: "Vitamin D, 25-Hydroxy",
    date: new Date(2023, 7, 22),
    status: "Complete",
    provider: "HealthFirst Medical",
    category: "Nutrition",
    results: [{ name: "Vitamin D, 25-Hydroxy", value: "28", unit: "ng/mL", range: "30-100", status: "low" }],
  },
]

// Status badge component
function StatusBadge({ status }: { status: string }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "bg-green-100 text-green-800 hover:bg-green-100/80"
      case "low":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100/80"
      case "high":
        return "bg-red-100 text-red-800 hover:bg-red-100/80"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100/80"
    }
  }

  return (
    <Badge className={getStatusColor(status)} variant="outline">
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}

export function LabHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  // Filter lab results based on search term and category
  const filteredResults = labResults.filter((result) => {
    const matchesSearch =
      result.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.provider.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || result.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const categories = ["All", ...Array.from(new Set(labResults.map((lab) => lab.category)))]

  return (
    <DashboardShell>
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Lab History</CardTitle>
          <CardDescription>View and manage your laboratory test results</CardDescription>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by test name or provider..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Categories</SelectLabel>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Export as PDF</DropdownMenuItem>
                  <DropdownMenuItem>Export as CSV</DropdownMenuItem>
                  <DropdownMenuItem>Print results</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="list" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="detailed">Detailed View</TabsTrigger>
            </TabsList>
            <TabsContent value="list">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Test Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResults.length > 0 ? (
                      filteredResults.map((lab) => (
                        <TableRow key={lab.id}>
                          <TableCell className="font-medium">{lab.testName}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                              {format(lab.date, "MMM d, yyyy")}
                            </div>
                          </TableCell>
                          <TableCell>{lab.provider}</TableCell>
                          <TableCell>{lab.category}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50/80">
                              {lab.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                // Handle view action
                                console.log("View details for", lab.id)
                              }}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No lab results found matching your criteria
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="detailed">
              <div className="space-y-4">
                {filteredResults.length > 0 ? (
                  filteredResults.map((lab) => (
                    <Accordion type="single" collapsible className="border rounded-lg" key={lab.id}>
                      <AccordionItem value={lab.id} className="border-0">
                        <AccordionTrigger className="px-4 py-2 hover:bg-muted/50">
                          <div className="flex items-center justify-between w-full">
                            <div className="flex flex-col text-left">
                              <span className="font-medium">{lab.testName}</span>
                              <span className="text-sm text-muted-foreground">{format(lab.date, "MMM d, yyyy")}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-blue-50 text-blue-700">{lab.category}</Badge>
                              <Badge variant="outline" className="bg-green-50 text-green-700">
                                {lab.status}
                              </Badge>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-sm font-medium">Provider: {lab.provider}</p>
                              </div>
                              <Button size="sm" variant="outline">
                                <Download className="mr-2 h-4 w-4" />
                                Download Results
                              </Button>
                            </div>
                            <div className="rounded-md border">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Test</TableHead>
                                    <TableHead>Result</TableHead>
                                    <TableHead>Units</TableHead>
                                    <TableHead>Reference Range</TableHead>
                                    <TableHead>Status</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {lab.results.map((result, idx) => (
                                    <TableRow key={idx}>
                                      <TableCell className="font-medium">{result.name}</TableCell>
                                      <TableCell>{result.value}</TableCell>
                                      <TableCell>{result.unit}</TableCell>
                                      <TableCell>{result.range}</TableCell>
                                      <TableCell>
                                        <StatusBadge status={result.status} />
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground border rounded-lg">
                    No lab results found matching your criteria
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-4">
          <div className="text-sm text-muted-foreground">
            Showing {filteredResults.length} of {labResults.length} results
          </div>
          <Button variant="outline" size="sm">
            See All Lab Tests
          </Button>
        </CardFooter>
      </Card>
    </DashboardShell>
  )
}
