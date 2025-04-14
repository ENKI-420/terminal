"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format, subDays } from "date-fns"
import { CalendarIcon, Clock, FileText, MessageSquare, Search, Download, Star } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"

// Mock past consultations data
const pastConsultations = [
  {
    id: 101,
    provider: {
      name: "Dr. Sarah Johnson",
      specialty: "Oncologist",
      avatar: "/placeholder.svg?height=50&width=50",
    },
    date: subDays(new Date(), 7),
    time: "2:00 PM",
    duration: "30 minutes",
    status: "completed",
    type: "Follow-up Consultation",
    notes: "Discussed recent lab results showing improvement in blood counts. Continuing current treatment regimen.",
    summary:
      "Patient reported feeling better with less fatigue. Blood counts showing improvement. Continue current treatment regimen. Follow up in 2 weeks with repeat CBC.",
    rating: 5,
  },
  {
    id: 102,
    provider: {
      name: "Dr. Michael Chen",
      specialty: "Hematologist",
      avatar: "/placeholder.svg?height=50&width=50",
    },
    date: subDays(new Date(), 14),
    time: "10:30 AM",
    duration: "45 minutes",
    status: "completed",
    type: "Treatment Review",
    notes: "Comprehensive review of treatment progress. Discussed side effect management strategies.",
    summary:
      "Reviewed molecular testing results showing 70% reduction in FLT3-ITD mutation burden. Patient tolerating treatment well with mild nausea controlled with antiemetics. Continue current regimen.",
    rating: 4,
  },
  {
    id: 103,
    provider: {
      name: "Emily Rodriguez",
      specialty: "Genetic Counselor",
      avatar: "/placeholder.svg?height=50&width=50",
    },
    date: subDays(new Date(), 21),
    time: "1:15 PM",
    duration: "60 minutes",
    status: "completed",
    type: "Genetic Counseling",
    notes: "Discussed genetic test results and implications for family members.",
    summary:
      "Reviewed genetic testing results confirming FLT3-ITD and NPM1 mutations. Discussed implications for treatment and prognosis. Provided information about testing options for first-degree relatives.",
    rating: 5,
  },
  {
    id: 104,
    provider: {
      name: "Dr. Sarah Johnson",
      specialty: "Oncologist",
      avatar: "/placeholder.svg?height=50&width=50",
    },
    date: subDays(new Date(), 28),
    time: "3:30 PM",
    duration: "30 minutes",
    status: "completed",
    type: "Initial Consultation",
    notes: "Initial discussion of diagnosis and treatment options.",
    summary:
      "Discussed new diagnosis of AML with FLT3-ITD mutation. Reviewed treatment options and decided on Venetoclax + Azacitidine regimen. Scheduled bone marrow biopsy and additional testing.",
    rating: 5,
  },
]

export function PastConsultations() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedConsultation, setSelectedConsultation] = useState<any>(null)
  const [filterProvider, setFilterProvider] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [sortOrder, setSortOrder] = useState("newest")
  const { toast } = useToast()

  // Filter and sort consultations
  const filteredConsultations = pastConsultations
    .filter((consultation) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        consultation.provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        consultation.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        consultation.notes.toLowerCase().includes(searchQuery.toLowerCase())

      // Provider filter
      const matchesProvider = filterProvider === "all" || consultation.provider.name === filterProvider

      // Type filter
      const matchesType = filterType === "all" || consultation.type === filterType

      return matchesSearch && matchesProvider && matchesType
    })
    .sort((a, b) => {
      // Sort by date
      if (sortOrder === "newest") {
        return b.date.getTime() - a.date.getTime()
      } else {
        return a.date.getTime() - b.date.getTime()
      }
    })

  // Get unique providers for filter
  const providers = ["all", ...new Set(pastConsultations.map((c) => c.provider.name))]

  // Get unique consultation types for filter
  const consultationTypes = ["all", ...new Set(pastConsultations.map((c) => c.type))]

  // Handle downloading consultation summary
  const handleDownloadSummary = () => {
    toast({
      title: "Summary Downloaded",
      description: "Consultation summary has been downloaded successfully.",
    })
  }

  // Handle requesting follow-up
  const handleRequestFollowUp = () => {
    toast({
      title: "Follow-up Requested",
      description: "Your request for a follow-up consultation has been sent.",
    })
    setSelectedConsultation(null)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Past Video Consultations</CardTitle>
          <CardDescription>Review your previous video consultations with healthcare providers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search consultations..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={filterProvider} onValueChange={setFilterProvider}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by provider" />
                </SelectTrigger>
                <SelectContent>
                  {providers.map((provider) => (
                    <SelectItem key={provider} value={provider}>
                      {provider === "all" ? "All Providers" : provider}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  {consultationTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type === "all" ? "All Types" : type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Consultations list */}
          <div className="space-y-4">
            {filteredConsultations.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No past consultations found</p>
              </div>
            ) : (
              filteredConsultations.map((consultation) => (
                <Card key={consultation.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row">
                      <div className="p-4 sm:w-2 bg-gray-200 dark:bg-gray-700"></div>
                      <div className="flex-1 p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={consultation.provider.avatar} alt={consultation.provider.name} />
                              <AvatarFallback>{consultation.provider.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-semibold">{consultation.provider.name}</h4>
                              <p className="text-sm text-muted-foreground">{consultation.provider.specialty}</p>
                              <div className="flex items-center mt-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < consultation.rating ? "text-amber-500 fill-amber-500" : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col sm:items-end">
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{format(consultation.date, "MMMM d, yyyy")}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                {consultation.time} ({consultation.duration})
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3">
                          <Badge variant="outline">{consultation.type}</Badge>
                        </div>

                        {consultation.notes && (
                          <div className="mt-2 text-sm text-muted-foreground">
                            <p>{consultation.notes}</p>
                          </div>
                        )}

                        <div className="mt-4 flex flex-wrap gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1"
                                onClick={() => setSelectedConsultation(consultation)}
                              >
                                <FileText className="h-4 w-4" />
                                View Summary
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Consultation Summary</DialogTitle>
                                <DialogDescription>
                                  {consultation?.provider?.name} -{" "}
                                  {consultation?.date && format(consultation.date, "MMMM d, yyyy")}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <h4 className="font-medium">Consultation Details</h4>
                                  <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>Provider:</div>
                                    <div>{consultation?.provider?.name}</div>
                                    <div>Specialty:</div>
                                    <div>{consultation?.provider?.specialty}</div>
                                    <div>Date:</div>
                                    <div>{consultation?.date && format(consultation.date, "MMMM d, yyyy")}</div>
                                    <div>Time:</div>
                                    <div>
                                      {consultation?.time} ({consultation?.duration})
                                    </div>
                                    <div>Type:</div>
                                    <div>{consultation?.type}</div>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <h4 className="font-medium">Summary</h4>
                                  <p className="text-sm">{consultation?.summary}</p>
                                </div>
                              </div>
                              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                                <Button variant="outline" className="gap-1" onClick={handleDownloadSummary}>
                                  <Download className="h-4 w-4" />
                                  Download Summary
                                </Button>
                                <Button onClick={handleRequestFollowUp}>Request Follow-up</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          <Button size="sm" variant="outline" className="gap-1">
                            <MessageSquare className="h-4 w-4" />
                            Message Provider
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
