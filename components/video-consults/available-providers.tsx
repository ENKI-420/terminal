"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Calendar, MessageSquare, Star, GraduationCap, Filter } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"

// Mock providers data
const providersData = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Oncologist",
    avatar: "/placeholder.svg?height=50&width=50",
    rating: 4.9,
    reviewCount: 124,
    education: [
      { degree: "MD", institution: "Harvard Medical School", year: "2005" },
      { degree: "Residency", institution: "Mayo Clinic", year: "2009" },
      { degree: "Fellowship", institution: "MD Anderson Cancer Center", year: "2011" },
    ],
    experience: "15+ years",
    languages: ["English", "Spanish"],
    specializations: ["Leukemia", "Lymphoma", "Genomic Medicine"],
    bio: "Dr. Johnson is a board-certified oncologist specializing in hematologic malignancies and genomic medicine. She has extensive experience in treating patients with acute myeloid leukemia and other blood cancers using targeted therapies based on genetic profiles.",
    nextAvailable: "Today at 2:00 PM",
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Hematologist",
    avatar: "/placeholder.svg?height=50&width=50",
    rating: 4.8,
    reviewCount: 98,
    education: [
      { degree: "MD", institution: "Stanford University", year: "2007" },
      { degree: "Residency", institution: "UCSF Medical Center", year: "2011" },
      { degree: "Fellowship", institution: "Johns Hopkins", year: "2013" },
    ],
    experience: "12+ years",
    languages: ["English", "Mandarin"],
    specializations: ["Blood Disorders", "Bone Marrow Transplant", "Immunotherapy"],
    bio: "Dr. Chen is a hematologist with expertise in bone marrow transplantation and cellular therapies. His research focuses on developing novel immunotherapies for hematologic malignancies, with a particular interest in CAR-T cell therapy.",
    nextAvailable: "Tomorrow at 10:30 AM",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    specialty: "Genetic Counselor",
    avatar: "/placeholder.svg?height=50&width=50",
    rating: 4.9,
    reviewCount: 87,
    education: [
      { degree: "MS", institution: "Johns Hopkins University", year: "2010" },
      { degree: "BS", institution: "University of Michigan", year: "2008" },
    ],
    experience: "13+ years",
    languages: ["English", "Spanish"],
    specializations: ["Cancer Genetics", "Hereditary Cancer Syndromes", "Genomic Testing"],
    bio: "Emily is a certified genetic counselor specializing in cancer genetics. She helps patients understand the implications of genetic testing results and provides guidance on screening and prevention strategies for individuals with hereditary cancer predispositions.",
    nextAvailable: "Thursday at 1:15 PM",
  },
  {
    id: 4,
    name: "Dr. Robert Williams",
    specialty: "Radiation Oncologist",
    avatar: "/placeholder.svg?height=50&width=50",
    rating: 4.7,
    reviewCount: 76,
    education: [
      { degree: "MD", institution: "Duke University", year: "2006" },
      { degree: "Residency", institution: "Memorial Sloan Kettering", year: "2011" },
    ],
    experience: "14+ years",
    languages: ["English"],
    specializations: ["Precision Radiation Therapy", "SBRT", "Proton Therapy"],
    bio: "Dr. Williams is a radiation oncologist with expertise in precision radiation techniques. He specializes in using advanced imaging and targeted radiation approaches to maximize treatment efficacy while minimizing side effects.",
    nextAvailable: "Friday at 9:00 AM",
  },
  {
    id: 5,
    name: "Dr. Jennifer Lee",
    specialty: "Medical Oncologist",
    avatar: "/placeholder.svg?height=50&width=50",
    rating: 4.8,
    reviewCount: 92,
    education: [
      { degree: "MD", institution: "Yale School of Medicine", year: "2008" },
      { degree: "Residency", institution: "Massachusetts General Hospital", year: "2012" },
      { degree: "Fellowship", institution: "Dana-Farber Cancer Institute", year: "2014" },
    ],
    experience: "11+ years",
    languages: ["English", "Korean"],
    specializations: ["Breast Cancer", "Targeted Therapy", "Clinical Trials"],
    bio: "Dr. Lee is a medical oncologist specializing in breast cancer treatment. Her approach focuses on personalized medicine, utilizing genomic testing to guide treatment decisions and optimize outcomes for her patients.",
    nextAvailable: "Next Monday at 11:30 AM",
  },
]

export function AvailableProviders() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProvider, setSelectedProvider] = useState<any>(null)
  const [filterSpecialty, setFilterSpecialty] = useState("all")
  const router = useRouter()

  // Filter providers
  const filteredProviders = providersData.filter((provider) => {
    // Search filter
    const matchesSearch =
      searchQuery === "" ||
      provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.specializations.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))

    // Specialty filter
    const matchesSpecialty = filterSpecialty === "all" || provider.specialty === filterSpecialty

    return matchesSearch && matchesSpecialty
  })

  // Get unique specialties for filter
  const specialties = ["all", ...new Set(providersData.map((p) => p.specialty))]

  // Handle scheduling with provider
  const handleScheduleWithProvider = (providerId: number) => {
    router.push("/dashboard/video-consults?tab=schedule&provider=" + providerId)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Available Healthcare Providers</CardTitle>
          <CardDescription>Browse and learn about our healthcare team</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search and filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search providers by name, specialty, or expertise..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterSpecialty} onValueChange={setFilterSpecialty}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by specialty" />
                </SelectTrigger>
                <SelectContent>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty === "all" ? "All Specialties" : specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" className="gap-1">
                <Filter className="h-4 w-4" />
                More Filters
              </Button>
            </div>
          </div>

          {/* Providers list */}
          <div className="space-y-4">
            {filteredProviders.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No providers found</p>
              </div>
            ) : (
              filteredProviders.map((provider) => (
                <Card key={provider.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex flex-col items-center md:items-start gap-2">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src={provider.avatar} alt={provider.name} />
                          <AvatarFallback>{provider.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(provider.rating)
                                  ? "text-amber-500 fill-amber-500"
                                  : i < provider.rating
                                    ? "text-amber-500 fill-amber-500 opacity-50"
                                    : "text-gray-300"
                              }`}
                            />
                          ))}
                          <span className="ml-1 text-sm">{provider.rating}</span>
                          <span className="ml-1 text-xs text-muted-foreground">({provider.reviewCount})</span>
                        </div>
                        <Badge variant="outline" className="mt-1">
                          {provider.specialty}
                        </Badge>
                      </div>

                      <div className="flex-1 space-y-4">
                        <div>
                          <h3 className="text-xl font-semibold">{provider.name}</h3>
                          <p className="text-sm text-muted-foreground">{provider.experience} experience</p>
                        </div>

                        <p className="text-sm">{provider.bio}</p>

                        <div className="flex flex-wrap gap-2">
                          {provider.specializations.map((specialization, index) => (
                            <Badge key={index} variant="secondary">
                              {specialization}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>Next available: {provider.nextAvailable}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                            <span>Languages: {provider.languages.join(", ")}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" className="gap-1" onClick={() => setSelectedProvider(provider)}>
                                <GraduationCap className="h-4 w-4" />
                                View Credentials
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>{provider.name} - Credentials</DialogTitle>
                                <DialogDescription>
                                  Education, certifications, and professional background
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <h4 className="font-medium">Education</h4>
                                  <div className="space-y-2">
                                    {provider.education.map((edu, index) => (
                                      <div key={index} className="flex justify-between text-sm">
                                        <div>
                                          <span className="font-medium">{edu.degree}</span>, {edu.institution}
                                        </div>
                                        <div className="text-muted-foreground">{edu.year}</div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <h4 className="font-medium">Specializations</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {provider.specializations.map((specialization, index) => (
                                      <Badge key={index} variant="secondary">
                                        {specialization}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <h4 className="font-medium">Languages</h4>
                                  <p className="text-sm">{provider.languages.join(", ")}</p>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button onClick={() => handleScheduleWithProvider(provider.id)}>
                                  Schedule with {provider.name.split(" ")[0]}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          <Button className="gap-1" onClick={() => handleScheduleWithProvider(provider.id)}>
                            <Calendar className="h-4 w-4" />
                            Schedule Consultation
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
