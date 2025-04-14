"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Users,
  FileText,
  Video,
  Mic,
  MicOff,
  VideoOff,
  Share2,
  Send,
  Calendar,
  CheckCircle,
  AlertCircle,
  X,
  Maximize2,
  Minimize2,
  UserPlus,
  Pill,
} from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"

// Mock participants data
const participants = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    role: "Oncologist",
    avatar: "/placeholder.svg?height=40&width=40",
    isOnline: true,
    isSpeaking: false,
    cursor: { x: 250, y: 150 },
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    role: "Hematologist",
    avatar: "/placeholder.svg?height=40&width=40",
    isOnline: true,
    isSpeaking: true,
    cursor: { x: 400, y: 300 },
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Genetic Counselor",
    avatar: "/placeholder.svg?height=40&width=40",
    isOnline: true,
    isSpeaking: false,
    cursor: { x: 150, y: 400 },
  },
  {
    id: 4,
    name: "You",
    role: "Patient",
    avatar: "/placeholder.svg?height=40&width=40",
    isOnline: true,
    isSpeaking: false,
    cursor: { x: 0, y: 0 },
  },
]

// Mock timeline events
const timelineEvents = [
  {
    id: 1,
    date: "March 10, 2025",
    title: "Initial Diagnosis",
    description: "Acute Myeloid Leukemia (AML) with FLT3-ITD mutation",
    type: "diagnosis",
    comments: [
      {
        id: 1,
        author: "Dr. Sarah Johnson",
        text: "Bone marrow biopsy confirmed AML with 45% blasts. FLT3-ITD mutation detected with high allelic ratio.",
        timestamp: "March 10, 2025 14:30",
      },
    ],
  },
  {
    id: 2,
    date: "March 15, 2025",
    title: "Treatment Initiation",
    description: "Started Venetoclax + Azacitidine regimen",
    type: "treatment",
    comments: [
      {
        id: 1,
        author: "Dr. Michael Chen",
        text: "Patient tolerated first dose well. Prophylactic antibiotics and antifungals initiated.",
        timestamp: "March 15, 2025 10:15",
      },
    ],
  },
  {
    id: 3,
    date: "April 1, 2025",
    title: "Follow-up Assessment",
    description: "Bone marrow biopsy shows good response",
    type: "assessment",
    comments: [
      {
        id: 1,
        author: "Dr. Sarah Johnson",
        text: "Blast percentage decreased to 8%. FLT3-ITD allelic ratio reduced by 70%.",
        timestamp: "April 1, 2025 16:45",
      },
      {
        id: 2,
        author: "Emily Rodriguez",
        text: "Molecular monitoring shows promising response. Recommend continuing current regimen.",
        timestamp: "April 2, 2025 09:30",
      },
    ],
  },
]

// Mock chat messages
const initialChatMessages = [
  {
    id: 1,
    sender: "Dr. Sarah Johnson",
    content: "Good morning everyone. Let's review the patient's progress since starting treatment.",
    timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 minutes ago
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 2,
    sender: "Dr. Michael Chen",
    content: "The blood counts are showing significant improvement. Neutrophils are now above 1.0.",
    timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(), // 8 minutes ago
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 3,
    sender: "Emily Rodriguez",
    content:
      "I've reviewed the latest molecular testing. The FLT3-ITD mutation burden has decreased by 70%, which is an excellent response.",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    avatar: "/placeholder.svg?height=32&width=32",
  },
]

export function ConferenceMode() {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [activeTab, setActiveTab] = useState("timeline")
  const [isMicMuted, setIsMicMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [message, setMessage] = useState("")
  const [chatMessages, setChatMessages] = useState(initialChatMessages)
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null)
  const [newComment, setNewComment] = useState("")
  const [localParticipants, setLocalParticipants] = useState(participants)
  const timelineRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Simulate cursor movements
  useEffect(() => {
    const interval = setInterval(() => {
      setLocalParticipants((prev) =>
        prev.map((p) => {
          if (p.id === 4) return p // Don't move the user's cursor

          return {
            ...p,
            cursor: {
              x: p.cursor.x + (Math.random() - 0.5) * 20,
              y: p.cursor.y + (Math.random() - 0.5) * 20,
            },
            isSpeaking: Math.random() > 0.8 ? !p.isSpeaking : p.isSpeaking,
          }
        }),
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  // Track mouse movement for user's cursor
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!timelineRef.current) return

    const rect = timelineRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setLocalParticipants((prev) => prev.map((p) => (p.id === 4 ? { ...p, cursor: { x, y } } : p)))
  }

  // Handle sending a chat message
  const handleSendMessage = () => {
    if (!message.trim()) return

    const newMessage = {
      id: chatMessages.length + 1,
      sender: "You",
      content: message,
      timestamp: new Date().toISOString(),
      avatar: "/placeholder.svg?height=32&width=32",
    }

    setChatMessages([...chatMessages, newMessage])
    setMessage("")

    // Simulate response after a delay
    setTimeout(() => {
      const responseMessage = {
        id: chatMessages.length + 2,
        sender: "Dr. Sarah Johnson",
        content: "That's a good point. Let's discuss this further in our next follow-up appointment.",
        timestamp: new Date().toISOString(),
        avatar: "/placeholder.svg?height=32&width=32",
      }

      setChatMessages((prev) => [...prev, responseMessage])
    }, 5000)
  }

  // Handle adding a comment to a timeline event
  const handleAddComment = () => {
    if (!selectedEvent || !newComment.trim()) return

    const updatedEvents = timelineEvents.map((event) => {
      if (event.id === selectedEvent) {
        return {
          ...event,
          comments: [
            ...event.comments,
            {
              id: event.comments.length + 1,
              author: "You",
              text: newComment,
              timestamp: new Date().toLocaleString(),
            },
          ],
        }
      }
      return event
    })

    // In a real app, you would update the state with the new events
    // For this demo, we'll just show a toast
    toast({
      title: "Comment Added",
      description: "Your comment has been added to the timeline.",
    })

    setNewComment("")
  }

  // Handle toggling fullscreen mode
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  // Format timestamp for chat messages
  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div
      className={`${
        isFullscreen ? "fixed inset-0 z-50 bg-background" : "relative"
      } transition-all duration-300 ease-in-out`}
    >
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-2 border-b">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-lg">Case Conference: AML Treatment Review</CardTitle>
                <CardDescription>Real-time collaboration session</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={toggleFullscreen} className="h-8 w-8">
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 flex-1 overflow-hidden">
          {/* Main content area */}
          <div className="md:col-span-2 flex flex-col border-r">
            <div className="p-2 bg-muted/50 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant={activeTab === "timeline" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("timeline")}
                  className="gap-1"
                >
                  <Calendar className="h-4 w-4" />
                  Timeline
                </Button>
                <Button
                  variant={activeTab === "documents" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("documents")}
                  className="gap-1"
                >
                  <FileText className="h-4 w-4" />
                  Documents
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-1">
                  <UserPlus className="h-4 w-4" />
                  Invite
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              <Tabs value={activeTab} className="h-full">
                <TabsContent value="timeline" className="h-full m-0 p-0">
                  <div ref={timelineRef} className="relative h-full p-4 overflow-auto" onMouseMove={handleMouseMove}>
                    {/* Participant cursors */}
                    {localParticipants
                      .filter((p) => p.id !== 4)
                      .map((participant) => (
                        <motion.div
                          key={participant.id}
                          className="absolute pointer-events-none z-10"
                          animate={{ x: participant.cursor.x, y: participant.cursor.y }}
                          transition={{ type: "spring", damping: 20 }}
                        >
                          <div className="relative">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M5 3L19 12L12 13L9 20L5 3Z"
                                fill="#3b82f6"
                                stroke="#3b82f6"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <div className="absolute -right-1 -top-1">
                              <Avatar className="h-6 w-6 border-2 border-background">
                                <AvatarImage src={participant.avatar} alt={participant.name} />
                                <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              {participant.isSpeaking && (
                                <span className="absolute -right-1 -top-1 flex h-3 w-3">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                </span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}

                    {/* Timeline content */}
                    <div className="space-y-8">
                      {timelineEvents.map((event, index) => (
                        <div key={event.id} className="relative">
                          {/* Timeline connector */}
                          {index < timelineEvents.length - 1 && (
                            <div className="absolute left-6 top-10 bottom-0 w-0.5 bg-muted-foreground/20"></div>
                          )}

                          <div className="flex gap-4">
                            <div
                              className={`
                              flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center
                              ${
                                event.type === "diagnosis"
                                  ? "bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-400"
                                  : event.type === "treatment"
                                    ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400"
                                    : "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
                              }
                            `}
                            >
                              {event.type === "diagnosis" ? (
                                <AlertCircle className="h-6 w-6" />
                              ) : event.type === "treatment" ? (
                                <Pill className="h-6 w-6" />
                              ) : (
                                <CheckCircle className="h-6 w-6" />
                              )}
                            </div>

                            <div className="flex-1">
                              <Card>
                                <CardHeader className="pb-2">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <CardTitle className="text-lg">{event.title}</CardTitle>
                                      <CardDescription>{event.description}</CardDescription>
                                    </div>
                                    <Badge variant="outline">{event.date}</Badge>
                                  </div>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-3">
                                    {event.comments.map((comment) => (
                                      <div key={comment.id} className="bg-muted/50 p-3 rounded-md">
                                        <div className="flex justify-between items-center mb-1">
                                          <span className="font-medium">{comment.author}</span>
                                          <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                                        </div>
                                        <p className="text-sm">{comment.text}</p>
                                      </div>
                                    ))}
                                  </div>
                                </CardContent>
                                <CardFooter>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                    onClick={() => setSelectedEvent(event.id)}
                                  >
                                    Add Comment
                                  </Button>
                                </CardFooter>
                              </Card>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="documents" className="h-full m-0 p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Bone Marrow Biopsy Report</CardTitle>
                        <CardDescription>March 10, 2025</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">
                          Bone marrow aspirate shows hypercellular marrow with 45% blasts. Immunophenotyping confirms
                          AML. Cytogenetics shows normal karyotype. Molecular testing positive for FLT3-ITD mutation
                          with high allelic ratio.
                        </p>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" size="sm">
                          View Full Report
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Treatment Protocol</CardTitle>
                        <CardDescription>Venetoclax + Azacitidine</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">
                          Venetoclax 400mg daily (days 1-28) with dose ramp-up. Azacitidine 75mg/m² (days 1-7) of each
                          28-day cycle. Planned for 6 cycles with response assessment after cycle 2.
                        </p>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" size="sm">
                          View Protocol
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Follow-up Bone Marrow Report</CardTitle>
                        <CardDescription>April 1, 2025</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">
                          Bone marrow aspirate shows normocellular marrow with 8% blasts, indicating good response to
                          therapy. FLT3-ITD mutation burden decreased by 70% from baseline.
                        </p>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" size="sm">
                          View Full Report
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Medication List</CardTitle>
                        <CardDescription>Current Prescriptions</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm">
                          <li>Venetoclax 400mg daily</li>
                          <li>Azacitidine 75mg/m² (days 1-7)</li>
                          <li>Acyclovir 400mg twice daily</li>
                          <li>Posaconazole 300mg daily</li>
                          <li>Ondansetron 8mg as needed</li>
                        </ul>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" size="sm">
                          View All Medications
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Comment input area */}
            {selectedEvent && (
              <div className="p-4 border-t">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium">
                      Add comment to: {timelineEvents.find((e) => e.id === selectedEvent)?.title}
                    </h3>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setSelectedEvent(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Type your comment here..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="min-h-[80px]"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleAddComment}>Add Comment</Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1 flex flex-col">
            <Tabs defaultValue="participants" className="flex flex-col h-full">
              <TabsList className="grid grid-cols-2 px-2 py-2">
                <TabsTrigger value="participants">Participants</TabsTrigger>
                <TabsTrigger value="chat">Chat</TabsTrigger>
              </TabsList>

              <TabsContent value="participants" className="flex-1 p-0 m-0 flex flex-col">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {localParticipants.map((participant) => (
                      <div key={participant.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar>
                              <AvatarImage src={participant.avatar} alt={participant.name} />
                              <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {participant.isOnline && (
                              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></span>
                            )}
                            {participant.isSpeaking && (
                              <span className="absolute -right-1 -top-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{participant.name}</p>
                            <p className="text-xs text-muted-foreground">{participant.role}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          {participant.id === 4 ? (
                            <>
                              <Button
                                variant={isMicMuted ? "destructive" : "outline"}
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setIsMicMuted(!isMicMuted)}
                              >
                                {isMicMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                              </Button>
                              <Button
                                variant={isVideoOff ? "destructive" : "outline"}
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setIsVideoOff(!isVideoOff)}
                              >
                                {isVideoOff ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                              </Button>
                            </>
                          ) : (
                            <>
                              {!participant.isSpeaking && <Mic className="h-4 w-4 text-muted-foreground" />}
                              <Video className="h-4 w-4 text-muted-foreground" />
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="p-4 border-t">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium">Your Settings</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="mic">Microphone</Label>
                        <Switch id="mic" checked={!isMicMuted} onCheckedChange={(checked) => setIsMicMuted(!checked)} />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="video">Camera</Label>
                        <Switch
                          id="video"
                          checked={!isVideoOff}
                          onCheckedChange={(checked) => setIsVideoOff(!checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="screen">Screen Sharing</Label>
                        <Switch id="screen" checked={isScreenSharing} onCheckedChange={setIsScreenSharing} />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="chat" className="flex-1 p-0 m-0 flex flex-col">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {chatMessages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}>
                        <div className="flex gap-2 max-w-[80%]">
                          {msg.sender !== "You" && (
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={msg.avatar} alt={msg.sender} />
                              <AvatarFallback>{msg.sender.charAt(0)}</AvatarFallback>
                            </Avatar>
                          )}
                          <div>
                            <div
                              className={`rounded-lg px-3 py-2 text-sm ${
                                msg.sender === "You" ? "bg-primary text-primary-foreground" : "bg-muted"
                              }`}
                            >
                              {msg.content}
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              <p className="text-xs text-muted-foreground">
                                {msg.sender !== "You" && `${msg.sender} • `}
                                {formatMessageTime(msg.timestamp)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                    />
                    <Button size="icon" onClick={handleSendMessage}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </Card>
    </div>
  )
}
