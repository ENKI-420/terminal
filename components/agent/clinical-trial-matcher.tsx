"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Search,
  MapPin,
  Beaker,
  FileText,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Clock,
  Users,
  Building,
  ChevronDown,
  ChevronUp,
  Dna,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"

export function ClinicalTrialMatcher() {
  const [searchQuery, setSearchQuery] = useState("")
  const [locationFilter, setLocationFilter] = useState("all")
  const [phaseFilter, setPhaseFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [expandedTrial, setExpandedTrial] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState("matchScore")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  // Mock data for clinical trials
  const clinicalTrials = [
    {
      id: "NCT04538664",
      title: "Osimertinib and Savolitinib in EGFR-Mutant, MET-Amplified NSCLC",
      sponsor: "AstraZeneca",
      phase: "2",
      status: "Recruiting",
      locations: ["Memorial Sloan Kettering", "Dana-Farber Cancer Institute", "MD Anderson"],
      distance: 12,
      matchScore: 95,
      matchReasons: [
        "EGFR T790M mutation detected",
        "MET amplification detected",
        "Prior EGFR TKI therapy",
        "Good performance status (ECOG 0-1)",
      ],
      exclusionReasons: [],
      startDate: "2023-06-15",
      primaryCompletion: "2025-12-31",
      description:
        "A Phase II Study of Osimertinib in Combination with Savolitinib in Patients with EGFR-Mutant, MET-Amplified Non-Small Cell Lung Cancer (NSCLC) Following Progression on EGFR TKI Therapy",
      interventions: ["Osimertinib 80mg oral daily", "Savolitinib 600mg oral daily"],
      primaryOutcomes: ["Objective Response Rate (ORR)", "Progression-Free Survival (PFS)"],
      secondaryOutcomes: ["Overall Survival (OS)", "Duration of Response (DoR)", "Safety and Tolerability"],
      inclusionCriteria: [
        "Histologically or cytologically confirmed locally advanced or metastatic NSCLC",
        "Documented EGFR mutation (exon 19 deletion or L858R)",
        "Documented T790M mutation and/or MET amplification",
        "Radiological progression on prior EGFR TKI therapy",
        "ECOG performance status 0-1",
        "Adequate organ function",
      ],
      exclusionCriteria: [
        "Prior treatment with osimertinib or any MET inhibitor",
        "Symptomatic CNS metastases",
        "Interstitial lung disease",
        "QTc interval > 470 msec",
      ],
      enrollmentTarget: 120,
      currentEnrollment: 78,
      contactName: "Dr. Sarah Johnson",
      contactEmail: "trials@astrazeneca.com",
      contactPhone: "(555) 123-4567",
    },
    {
      id: "NCT04538665",
      title: "ORCHARD: A Biomarker-Directed Phase II Platform Study in EGFR Mutation-Positive NSCLC",
      sponsor: "AstraZeneca",
      phase: "2",
      status: "Recruiting",
      locations: ["Mayo Clinic", "Johns Hopkins", "UCLA Medical Center"],
      distance: 45,
      matchScore: 88,
      matchReasons: ["EGFR T790M mutation detected", "Prior EGFR TKI therapy", "Good performance status (ECOG 0-1)"],
      exclusionReasons: ["Trial does not specifically target MET amplification"],
      startDate: "2023-04-01",
      primaryCompletion: "2025-10-31",
      description:
        "A Biomarker-directed Platform Study in Patients with Advanced Non-small Cell Lung Cancer whose Disease has Progressed on First-line Osimertinib Therapy",
      interventions: ["Multiple treatment arms based on molecular profile"],
      primaryOutcomes: ["Objective Response Rate (ORR)"],
      secondaryOutcomes: ["Progression-Free Survival (PFS)", "Overall Survival (OS)", "Duration of Response (DoR)"],
      inclusionCriteria: [
        "Histologically or cytologically confirmed locally advanced or metastatic NSCLC",
        "Documented EGFR mutation (exon 19 deletion or L858R)",
        "Radiological progression on first-line osimertinib therapy",
        "ECOG performance status 0-1",
        "Adequate organ function",
      ],
      exclusionCriteria: [
        "Prior chemotherapy for advanced NSCLC",
        "Symptomatic CNS metastases",
        "Interstitial lung disease",
      ],
      enrollmentTarget: 200,
      currentEnrollment: 112,
      contactName: "Dr. Michael Chen",
      contactEmail: "orchard@astrazeneca.com",
      contactPhone: "(555) 987-6543",
    },
    {
      id: "NCT04538666",
      title: "METEOR-2: Tepotinib and Osimertinib in EGFR/MET+ NSCLC",
      sponsor: "Merck KGaA",
      phase: "1/2",
      status: "Recruiting",
      locations: ["Memorial Sloan Kettering", "Massachusetts General Hospital", "Stanford Medical Center"],
      distance: 8,
      matchScore: 92,
      matchReasons: [
        "EGFR T790M mutation detected",
        "MET amplification detected",
        "Prior EGFR TKI therapy",
        "Good performance status (ECOG 0-1)",
      ],
      exclusionReasons: [],
      startDate: "2023-07-01",
      primaryCompletion: "2025-12-31",
      description:
        "A Phase I/II Study of Tepotinib in Combination with Osimertinib in Patients with EGFR-Mutant, MET-Amplified Non-Small Cell Lung Cancer Following Progression on EGFR TKI Therapy",
      interventions: ["Osimertinib 80mg oral daily", "Tepotinib 500mg oral daily"],
      primaryOutcomes: ["Maximum Tolerated Dose (Phase I)", "Objective Response Rate (Phase II)"],
      secondaryOutcomes: ["Progression-Free Survival (PFS)", "Overall Survival (OS)", "Safety and Tolerability"],
      inclusionCriteria: [
        "Histologically or cytologically confirmed locally advanced or metastatic NSCLC",
        "Documented EGFR mutation (exon 19 deletion or L858R)",
        "Documented T790M mutation and/or MET amplification",
        "Radiological progression on prior EGFR TKI therapy",
        "ECOG performance status 0-1",
        "Adequate organ function",
      ],
      exclusionCriteria: [
        "Prior treatment with osimertinib or any MET inhibitor",
        "Symptomatic CNS metastases",
        "Interstitial lung disease",
      ],
      enrollmentTarget: 90,
      currentEnrollment: 42,
      contactName: "Dr. Emily Rodriguez",
      contactEmail: "meteor2@merck.com",
      contactPhone: "(555) 456-7890",
    },
    {
      id: "NCT04538667",
      title: "PI3K Inhibitor BLU-945 in EGFR-Mutant NSCLC",
      sponsor: "Blueprint Medicines",
      phase: "1",
      status: "Recruiting",
      locations: ["Dana-Farber Cancer Institute", "MD Anderson", "Fred Hutchinson Cancer Center"],
      distance: 30,
      matchScore: 75,
      matchReasons: ["EGFR mutation detected", "Prior EGFR TKI therapy", "Good performance status (ECOG 0-1)"],
      exclusionReasons: ["Does not specifically target T790M or MET amplification", "Early phase trial"],
      startDate: "2023-09-15",
      primaryCompletion: "2025-06-30",
      description:
        "A Phase I Study of BLU-945, a Novel PI3K Inhibitor, in Patients with EGFR-Mutant Non-Small Cell Lung Cancer Following Progression on EGFR TKI Therapy",
      interventions: ["BLU-945 at escalating dose levels"],
      primaryOutcomes: ["Maximum Tolerated Dose (MTD)", "Recommended Phase 2 Dose (RP2D)", "Safety and Tolerability"],
      secondaryOutcomes: ["Objective Response Rate (ORR)", "Progression-Free Survival (PFS)", "Pharmacokinetics"],
      inclusionCriteria: [
        "Histologically or cytologically confirmed locally advanced or metastatic NSCLC",
        "Documented EGFR mutation (exon 19 deletion or L858R)",
        "Radiological progression on at least one prior EGFR TKI therapy",
        "ECOG performance status 0-1",
        "Adequate organ function",
      ],
      exclusionCriteria: [
        "More than 3 prior lines of therapy for advanced disease",
        "Symptomatic CNS metastases",
        "History of pneumonitis",
        "Significant cardiovascular disease",
      ],
      enrollmentTarget: 60,
      currentEnrollment: 18,
      contactName: "Dr. Robert Johnson",
      contactEmail: "blu945@blueprintmedicines.com",
      contactPhone: "(555) 789-0123",
    },
  ]

  // Filter and sort trials
  const filteredTrials = clinicalTrials
    .filter(
      (trial) =>
        (trial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          trial.id.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (locationFilter === "all" ||
          trial.locations.some((loc) => loc.toLowerCase().includes(locationFilter.toLowerCase()))) &&
        (phaseFilter === "all" || trial.phase.includes(phaseFilter)) &&
        (statusFilter === "all" || trial.status === statusFilter),
    )
    .sort((a, b) => {
      const aValue = a[sortBy as keyof typeof a]
      const bValue = b[sortBy as keyof typeof b]

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      return 0
    })

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("desc")
    }
  }

  const toggleExpandTrial = (id: string) => {
    setExpandedTrial(expandedTrial === id ? null : id)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">AI-Driven Clinical Trial Matching</CardTitle>
              <CardDescription>Personalized trial recommendations based on your genomic profile</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                <Dna className="h-3 w-3 mr-1" />
                Digital Twin Optimized
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search trials by title or ID..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-[180px]">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="memorial">Memorial Sloan Kettering</SelectItem>
                  <SelectItem value="dana">Dana-Farber</SelectItem>
                  <SelectItem value="md anderson">MD Anderson</SelectItem>
                  <SelectItem value="mayo">Mayo Clinic</SelectItem>
                </SelectContent>
              </Select>

              <Select value={phaseFilter} onValueChange={setPhaseFilter}>
                <SelectTrigger className="w-[150px]">
                  <Beaker className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Phase" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Phases</SelectItem>
                  <SelectItem value="1">Phase 1</SelectItem>
                  <SelectItem value="2">Phase 2</SelectItem>
                  <SelectItem value="3">Phase 3</SelectItem>
                  <SelectItem value="4">Phase 4</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Recruiting">Recruiting</SelectItem>
                  <SelectItem value="Not yet recruiting">Not Yet Recruiting</SelectItem>
                  <SelectItem value="Active, not recruiting">Active, Not Recruiting</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead className="cursor-pointer" onClick={() => toggleSort("id")}>
                    <div className="flex items-center gap-1">
                      Trial ID
                      {sortBy === "id" &&
                        (sortOrder === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => toggleSort("title")}>
                    <div className="flex items-center gap-1">
                      Title
                      {sortBy === "title" &&
                        (sortOrder === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
                    </div>
                  </TableHead>
                  <TableHead>Phase</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => toggleSort("matchScore")}>
                    <div className="flex items-center gap-1">
                      Match Score
                      {sortBy === "matchScore" &&
                        (sortOrder === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
                    </div>
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTrials.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      No matching trials found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTrials.map((trial) => (
                    <>
                      <TableRow
                        key={trial.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => toggleExpandTrial(trial.id)}
                      >
                        <TableCell>
                          {expandedTrial === trial.id ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{trial.id}</TableCell>
                        <TableCell>{trial.title}</TableCell>
                        <TableCell>Phase {trial.phase}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              trial.status === "Recruiting"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                            }
                          >
                            {trial.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={trial.matchScore} className="h-2 w-16" />
                            <span className="text-sm font-medium">{trial.matchScore}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="h-8">
                              Details
                            </Button>
                            <Button size="sm" className="h-8">
                              Apply
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      {expandedTrial === trial.id && (
                        <TableRow>
                          <TableCell colSpan={7} className="bg-muted/30 p-0">
                            <div className="p-4">
                              <Tabs defaultValue="overview" className="w-full">
                                <TabsList className="mb-4">
                                  <TabsTrigger value="overview">Overview</TabsTrigger>
                                  <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
                                  <TabsTrigger value="locations">Locations</TabsTrigger>
                                  <TabsTrigger value="match">Match Analysis</TabsTrigger>
                                </TabsList>

                                <TabsContent value="overview" className="space-y-4">
                                  <div>
                                    <h3 className="text-lg font-medium">{trial.title}</h3>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                      <Badge variant="outline" className="flex items-center gap-1">
                                        <FileText className="h-3 w-3" />
                                        {trial.id}
                                      </Badge>
                                      <Badge variant="outline" className="flex items-center gap-1">
                                        <Building className="h-3 w-3" />
                                        {trial.sponsor}
                                      </Badge>
                                      <Badge variant="outline" className="flex items-center gap-1">
                                        <Beaker className="h-3 w-3" />
                                        Phase {trial.phase}
                                      </Badge>
                                      <Badge
                                        variant="outline"
                                        className={
                                          trial.status === "Recruiting"
                                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 flex items-center gap-1"
                                            : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 flex items-center gap-1"
                                        }
                                      >
                                        <Clock className="h-3 w-3" />
                                        {trial.status}
                                      </Badge>
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <h4 className="font-medium">Description</h4>
                                    <p className="text-sm">{trial.description}</p>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <h4 className="font-medium">Interventions</h4>
                                      <ul className="list-disc pl-5 space-y-1 text-sm">
                                        {trial.interventions.map((intervention, index) => (
                                          <li key={index}>{intervention}</li>
                                        ))}
                                      </ul>
                                    </div>

                                    <div className="space-y-2">
                                      <h4 className="font-medium">Primary Outcomes</h4>
                                      <ul className="list-disc pl-5 space-y-1 text-sm">
                                        {trial.primaryOutcomes.map((outcome, index) => (
                                          <li key={index}>{outcome}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                      <h4 className="font-medium">Start Date</h4>
                                      <p className="text-sm">{trial.startDate}</p>
                                    </div>

                                    <div className="space-y-2">
                                      <h4 className="font-medium">Primary Completion</h4>
                                      <p className="text-sm">{trial.primaryCompletion}</p>
                                    </div>

                                    <div className="space-y-2">
                                      <h4 className="font-medium">Enrollment</h4>
                                      <div className="flex items-center gap-2">
                                        <Progress
                                          value={(trial.currentEnrollment / trial.enrollmentTarget) * 100}
                                          className="h-2 flex-1"
                                        />
                                        <span className="text-sm whitespace-nowrap">
                                          {trial.currentEnrollment} / {trial.enrollmentTarget}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <h4 className="font-medium">Contact Information</h4>
                                    <div className="text-sm">
                                      <p>{trial.contactName}</p>
                                      <p>{trial.contactEmail}</p>
                                      <p>{trial.contactPhone}</p>
                                    </div>
                                  </div>
                                </TabsContent>

                                <TabsContent value="eligibility" className="space-y-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                      <h4 className="font-medium flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        Inclusion Criteria
                                      </h4>
                                      <ul className="list-disc pl-5 space-y-1 text-sm">
                                        {trial.inclusionCriteria.map((criterion, index) => (
                                          <li key={index}>{criterion}</li>
                                        ))}
                                      </ul>
                                    </div>

                                    <div className="space-y-2">
                                      <h4 className="font-medium flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4 text-red-500" />
                                        Exclusion Criteria
                                      </h4>
                                      <ul className="list-disc pl-5 space-y-1 text-sm">
                                        {trial.exclusionCriteria.map((criterion, index) => (
                                          <li key={index}>{criterion}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                </TabsContent>

                                <TabsContent value="locations" className="space-y-4">
                                  <div className="space-y-4">
                                    {trial.locations.map((location, index) => (
                                      <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                                        <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div>
                                          <h4 className="font-medium">{location}</h4>
                                          <p className="text-sm text-muted-foreground">
                                            {index === 0 ? `${trial.distance} miles away` : "Distance not available"}
                                          </p>
                                          <Button variant="link" size="sm" className="h-auto p-0 text-sm" asChild>
                                            <a href="#" className="flex items-center gap-1">
                                              View on Map
                                              <ExternalLink className="h-3 w-3" />
                                            </a>
                                          </Button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </TabsContent>

                                <TabsContent value="match" className="space-y-4">
                                  <div className="flex items-center gap-3">
                                    <div className="relative h-20 w-20">
                                      <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-2xl font-bold">{trial.matchScore}%</span>
                                      </div>
                                      <svg className="h-20 w-20" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                                        <circle
                                          cx="50"
                                          cy="50"
                                          r="45"
                                          fill="none"
                                          stroke="#2563eb"
                                          strokeWidth="10"
                                          strokeDasharray="283"
                                          strokeDashoffset={283 - (283 * trial.matchScore) / 100}
                                          transform="rotate(-90 50 50)"
                                        />
                                      </svg>
                                    </div>
                                    <div>
                                      <h4 className="font-medium">Match Score</h4>
                                      <p className="text-sm text-muted-foreground">
                                        Based on your genomic profile and clinical characteristics
                                      </p>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                      <h4 className="font-medium flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        Match Reasons
                                      </h4>
                                      <ul className="list-disc pl-5 space-y-1 text-sm">
                                        {trial.matchReasons.map((reason, index) => (
                                          <li key={index}>{reason}</li>
                                        ))}
                                      </ul>
                                    </div>

                                    {trial.exclusionReasons.length > 0 && (
                                      <div className="space-y-2">
                                        <h4 className="font-medium flex items-center gap-2">
                                          <AlertCircle className="h-4 w-4 text-amber-500" />
                                          Potential Concerns
                                        </h4>
                                        <ul className="list-disc pl-5 space-y-1 text-sm">
                                          {trial.exclusionReasons.map((reason, index) => (
                                            <li key={index}>{reason}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </div>

                                  <div className="pt-2">
                                    <h4 className="font-medium">Digital Twin Simulation</h4>
                                    <p className="text-sm mt-1">
                                      Based on your molecular profile and treatment history, our AI model predicts an
                                      85% probability of response to this trial's intervention.
                                    </p>
                                  </div>
                                </TabsContent>
                              </Tabs>

                              <div className="flex justify-end gap-2 mt-6">
                                <Button variant="outline" className="gap-1" asChild>
                                  <a
                                    href={`https://clinicaltrials.gov/study/${trial.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                    View on ClinicalTrials.gov
                                  </a>
                                </Button>
                                <Button className="gap-1">
                                  <Users className="h-4 w-4" />
                                  Apply for This Trial
                                </Button>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredTrials.length} of {clinicalTrials.length} trials
          </p>
          <Button variant="outline" className="gap-1">
            <FileText className="h-4 w-4" />
            Export Trial List
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
