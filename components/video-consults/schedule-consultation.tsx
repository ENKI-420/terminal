"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format, addDays, isSameDay, setHours, setMinutes, isAfter } from "date-fns"
import { Clock, Search, CheckCircle, Clock3 } from "lucide-react"
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
import { cn } from "@/lib/utils"

// Mock providers data
const providers = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Oncologist",
    avatar: "/placeholder.svg?height=50&width=50",
    availableDates: [addDays(new Date(), 1), addDays(new Date(), 3), addDays(new Date(), 5), addDays(new Date(), 7)],
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Hematologist",
    avatar: "/placeholder.svg?height=50&width=50",
    availableDates: [addDays(new Date(), 2), addDays(new Date(), 4), addDays(new Date(), 6), addDays(new Date(), 8)],
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    specialty: "Genetic Counselor",
    avatar: "/placeholder.svg?height=50&width=50",
    availableDates: [addDays(new Date(), 1), addDays(new Date(), 2), addDays(new Date(), 5), addDays(new Date(), 9)],
  },
  {
    id: 4,
    name: "Dr. Robert Williams",
    specialty: "Radiation Oncologist",
    avatar: "/placeholder.svg?height=50&width=50",
    availableDates: [addDays(new Date(), 3), addDays(new Date(), 4), addDays(new Date(), 7), addDays(new Date(), 10)],
  },
]

// Mock consultation types
const consultationTypes = [
  { id: 1, name: "Initial Consultation", duration: 60 },
  { id: 2, name: "Follow-up Consultation", duration: 30 },
  { id: 3, name: "Treatment Review", duration: 45 },
  { id: 4, name: "Genetic Counseling", duration: 60 },
  { id: 5, name: "Second Opinion", duration: 60 },
]

// Mock time slots
const generateTimeSlots = (date: Date) => {
  const slots = []
  const startHour = 9 // 9 AM
  const endHour = 17 // 5 PM

  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = setMinutes(setHours(new Date(date), hour), minute)
      if (isAfter(time, new Date())) {
        slots.push({
          time,
          available: Math.random() > 0.3, // Randomly mark some slots as unavailable
        })
      }
    }
  }

  return slots
}

export function ScheduleConsultation() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProvider, setSelectedProvider] = useState<any>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<Date | undefined>(undefined)
  const [selectedType, setSelectedType] = useState<string>("")
  const [reason, setReason] = useState("")
  const [filterSpecialty, setFilterSpecialty] = useState("all")
  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const { toast } = useToast()

  // Filter providers
  const filteredProviders = providers.filter((provider) => {
    // Search filter
    const matchesSearch =
      searchQuery === "" ||
      provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.specialty.toLowerCase().includes(searchQuery.toLowerCase())

    // Specialty filter
    const matchesSpecialty = filterSpecialty === "all" || provider.specialty === filterSpecialty

    return matchesSearch && matchesSpecialty
  })

  // Get unique specialties for filter
  const specialties = ["all", ...new Set(providers.map((p) => p.specialty))]

  // Get available time slots for selected date
  const timeSlots = selectedDate ? generateTimeSlots(selectedDate) : []

  // Get available dates for selected provider
  const getAvailableDates = () => {
    return selectedProvider ? selectedProvider.availableDates : []
  }

  // Handle scheduling confirmation
  const handleScheduleConsultation = () => {
    toast({
      title: "Consultation Scheduled",
      description: "Your video consultation has been scheduled successfully.",
    })
    setConfirmationOpen(false)

    // Reset form
    setSelectedProvider(null)
    setSelectedDate(undefined)
    setSelectedTime(undefined)
    setSelectedType("")
    setReason("")
  }

  // Check if form is complete
  const isFormComplete = selectedProvider && selectedDate && selectedTime && selectedType

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Schedule a Video Consultation</CardTitle>
            <CardDescription>Select a provider, date, and time for your video consultation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Select Provider */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Step 1: Select a Provider</h3>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search providers..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
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
              </div>

              <div className="space-y-2">
                {filteredProviders.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No providers found</p>
                  </div>
                ) : (
                  filteredProviders.map((provider) => (
                    <div
                      key={provider.id}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                        selectedProvider?.id === provider.id ? "border-primary bg-primary/5" : "hover:bg-muted/50",
                      )}
                      onClick={() => setSelectedProvider(provider)}
                    >
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={provider.avatar} alt={provider.name} />
                        <AvatarFallback>{provider.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold">{provider.name}</h4>
                          {selectedProvider?.id === provider.id && <CheckCircle className="h-5 w-5 text-primary" />}
                        </div>
                        <p className="text-sm text-muted-foreground">{provider.specialty}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Step 2: Select Date and Time */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Step 2: Select Date and Time</h3>

              {selectedProvider ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Select a Date</h4>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border"
                      disabled={(date) => {
                        // Disable dates that are not available for the selected provider
                        return !getAvailableDates().some((availableDate) => isSameDay(availableDate, date))
                      }}
                      modifiers={{
                        available: getAvailableDates(),
                      }}
                      modifiersStyles={{
                        available: {
                          fontWeight: "bold",
                        },
                      }}
                    />
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Select a Time</h4>
                    {selectedDate ? (
                      <div className="grid grid-cols-2 gap-2">
                        {timeSlots.map((slot, index) => (
                          <Button
                            key={index}
                            variant={
                              selectedTime &&
                              isSameDay(selectedTime, slot.time) &&
                              selectedTime.getHours() === slot.time.getHours() &&
                              selectedTime.getMinutes() === slot.time.getMinutes()
                                ? "default"
                                : "outline"
                            }
                            className={cn("justify-start", !slot.available && "opacity-50 cursor-not-allowed")}
                            disabled={!slot.available}
                            onClick={() => setSelectedTime(slot.time)}
                          >
                            <Clock className="mr-2 h-4 w-4" />
                            {format(slot.time, "h:mm a")}
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-[200px] border rounded-md">
                        <p className="text-muted-foreground">Please select a date first</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[200px] border rounded-md">
                  <p className="text-muted-foreground">Please select a provider first</p>
                </div>
              )}
            </div>

            {/* Step 3: Consultation Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Step 3: Consultation Details</h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Consultation Type</label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select consultation type" />
                    </SelectTrigger>
                    <SelectContent>
                      {consultationTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.name} ({type.duration} min)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Reason for Consultation</label>
                  <Textarea
                    placeholder="Please describe the reason for your consultation..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={4}
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Dialog open={confirmationOpen} onOpenChange={setConfirmationOpen}>
              <DialogTrigger asChild>
                <Button className="w-full" disabled={!isFormComplete}>
                  Schedule Consultation
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Consultation</DialogTitle>
                  <DialogDescription>Please review your consultation details before confirming</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Consultation Details</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Provider:</div>
                      <div>{selectedProvider?.name}</div>
                      <div>Specialty:</div>
                      <div>{selectedProvider?.specialty}</div>
                      <div>Date:</div>
                      <div>{selectedDate && format(selectedDate, "MMMM d, yyyy")}</div>
                      <div>Time:</div>
                      <div>{selectedTime && format(selectedTime, "h:mm a")}</div>
                      <div>Type:</div>
                      <div>
                        {selectedType && consultationTypes.find((t) => t.id.toString() === selectedType)?.name}
                        {selectedType &&
                          ` (${consultationTypes.find((t) => t.id.toString() === selectedType)?.duration} min)`}
                      </div>
                    </div>
                  </div>

                  {reason && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Reason for Consultation</h4>
                      <p className="text-sm">{reason}</p>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setConfirmationOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleScheduleConsultation}>Confirm Scheduling</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Consultation Information</CardTitle>
            <CardDescription>Learn about our video consultation services</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">What to Expect</h4>
              <p className="text-sm text-muted-foreground">
                Our video consultations provide a convenient way to meet with your healthcare providers from the comfort
                of your home. You'll need a device with a camera and microphone, and a stable internet connection.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Consultation Types</h4>
              <div className="space-y-2">
                {consultationTypes.map((type) => (
                  <div key={type.id} className="flex items-start gap-2">
                    <Clock3 className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{type.name}</p>
                      <p className="text-xs text-muted-foreground">{type.duration} minutes</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Insurance & Billing</h4>
              <p className="text-sm text-muted-foreground">
                Most insurance plans cover video consultations. Your copay will typically be the same as an in-person
                visit. Contact your insurance provider for specific coverage details.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
