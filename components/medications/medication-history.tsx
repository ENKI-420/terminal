"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Calendar, ArrowUpDown, FileText } from "lucide-react"
import { format, parseISO, subMonths } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"

export function MedicationHistory() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterTimeframe, setFilterTimeframe] = useState("all")
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

  // Mock medication history data
  const medicationHistory = [
    {
      id: 1,
      name: "Venetoclax",
      dosage: "400mg",
      startDate: "2025-01-15",
      endDate: null,
      status: "active",
      prescriber: "Dr. Sarah Johnson",
      reason: "Treatment for AML with FLT3-ITD and NPM1 mutations",
      notes: "Part of combination therapy with Azacitidine",
    },
    {
      id: 2,
      name: "Azacitidine",
      dosage: "75mg/m²",
      startDate: "2025-01-15",
      endDate: null,
      status: "active",
      prescriber: "Dr. Sarah Johnson",
      reason: "Treatment for AML with FLT3-ITD and NPM1 mutations",
      notes: "Administered subcutaneously for 7 days every 28 days",
    },
    {
      id: 3,
      name: "Ondansetron",
      dosage: "8mg",
      startDate: "2025-01-15",
      endDate: null,
      status: "active",
      prescriber: "Dr. Sarah Johnson",
      reason: "Management of nausea and vomiting associated with chemotherapy",
      notes: "Take as needed for nausea, up to 3 times per day",
    },
    {
      id: 4,
      name: "Idarubicin",
      dosage: "12mg/m²",
      startDate: "2024-12-01",
      endDate: "2024-12-03",
      status: "completed",
      prescriber: "Dr. Sarah Johnson",
      reason: "Induction chemotherapy for newly diagnosed AML",
      notes: "Part of 7+3 induction regimen with cytarabine",
    },
    {
      id: 5,
      name: "Cytarabine",
      dosage: "100mg/m²",
      startDate: "2024-12-01",
      endDate: "2024-12-07",
      status: "completed",
      prescriber: "Dr. Sarah Johnson",
      reason: "Induction chemotherapy for newly diagnosed AML",
      notes: "Part of 7+3 induction regimen with idarubicin",
    },
    {
      id: 6,
      name: "Midostaurin",
      dosage: "50mg",
      startDate: "2024-12-08",
      endDate: "2024-12-21",
      status: "completed",
      prescriber: "Dr. Sarah Johnson",
      reason: "Targeted therapy for FLT3-ITD mutation",
      notes: "Added to induction regimen due to FLT3-ITD mutation",
    },
  ]

  // Filter medications
  const filteredMedications = medicationHistory.filter((medication) => {
    // Search filter
    const matchesSearch =
      searchQuery === "" ||
      medication.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      medication.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      medication.prescriber.toLowerCase().includes(searchQuery.toLowerCase())

    // Status filter
    const matchesStatus = filterStatus === "all" || medication.status === filterStatus

    // Timeframe filter
    let matchesTimeframe = true
    const startDate = parseISO(medication.startDate)

    if (filterTimeframe === "3months") {
      matchesTimeframe = startDate >= subMonths(new Date(), 3)
    } else if (filterTimeframe === "6months") {
      matchesTimeframe = startDate >= subMonths(new Date(), 6)
    } else if (filterTimeframe === "1year") {
      matchesTimeframe = startDate >= subMonths(new Date(), 12)
    } else if (filterTimeframe === "custom" && dateRange.from && dateRange.to) {
      matchesTimeframe = startDate >= dateRange.from && startDate <= dateRange.to
    }

    return matchesSearch && matchesStatus && matchesTimeframe
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Medication History</CardTitle>
          <CardDescription>View your complete medication history</CardDescription>
          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search medications..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="discontinued">Discontinued</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterTimeframe} onValueChange={setFilterTimeframe}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="3months">Last 3 Months</SelectItem>
                  <SelectItem value="6months">Last 6 Months</SelectItem>
                  <SelectItem value="1year">Last Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>

              {filterTimeframe === "custom" && (
                <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="gap-1">
                      <Calendar className="h-4 w-4" />
                      {dateRange.from && dateRange.to
                        ? `${format(dateRange.from, "MMM d, yyyy")} - ${format(dateRange.to, "MMM d, yyyy")}`
                        : "Select Date Range"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="range"
                      selected={dateRange}
                      onSelect={(range) => {
                        setDateRange(range as { from: Date | undefined; to: Date | undefined })
                        if (range?.to) {
                          setIsDatePickerOpen(false)
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      Medication
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead>Dosage</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      Start Date
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Prescriber</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMedications.length > 0 ? (
                  filteredMedications.map((medication) => (
                    <TableRow key={medication.id}>
                      <TableCell className="font-medium">{medication.name}</TableCell>
                      <TableCell>{medication.dosage}</TableCell>
                      <TableCell>{format(parseISO(medication.startDate), "MMM d, yyyy")}</TableCell>
                      <TableCell>
                        {medication.endDate ? format(parseISO(medication.endDate), "MMM d, yyyy") : "Current"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            medication.status === "active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : medication.status === "completed"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                          }
                        >
                          {medication.status.charAt(0).toUpperCase() + medication.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{medication.prescriber}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="gap-1">
                          <FileText className="h-4 w-4" />
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No medications found matching your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
