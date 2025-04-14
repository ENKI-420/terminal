"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  Phone,
  MessageSquare,
  Settings,
  Send,
  FileText,
  Paperclip,
  Image,
  PlusCircle,
  Maximize2,
  Minimize2,
  X,
  Volume2,
  Volume1,
  VolumeX,
  ScreenShare,
  Layout,
  Loader2,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock consultation data based on ID
const getConsultationData = (id: string) => {
  return {
    id: Number.parseInt(id),
    provider: {
      name: id === "1" ? "Dr. Sarah Johnson" : id === "2" ? "Dr. Michael Chen" : "Emily Rodriguez",
      specialty: id === "1" ? "Oncologist" : id === "2" ? "Hematologist" : "Genetic Counselor",
      avatar: "/placeholder.svg?height=50&width=50",
    },
    date: new Date(),
    time: "2:00 PM",
    duration: "30 minutes",
    type: "Follow-up Consultation",
    notes: "Discussion of recent lab results and treatment plan adjustments.",
  }
}

export default function JoinConsultationPage({ params }: { params: { id: string } }) {
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isMicMuted, setIsMicMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [activeTab, setActiveTab] = useState("chat")
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<{ sender: string; content: string; time: string }[]>([])
  const [showEndCallDialog, setShowEndCallDialog] = useState(false)
  const [showSettingsDialog, setShowSettingsDialog] = useState(false)
  const [layout, setLayout] = useState("default") // default, focus, grid

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const router = useRouter()
  const { toast } = useToast()

  const consultation = getConsultationData(params.id)

  // Simulate connection to video call
  const handleConnect = () => {
    setIsConnecting(true)

    // Simulate connection delay
    setTimeout(() => {
      setIsConnected(true)
      setIsConnecting(false)

      toast({
        title: "Connected",
        description: `You are now connected with ${consultation.provider.name}.`,
      })

      // Add a welcome message
      setMessages([
        {
          sender: consultation.provider.name,
          content: "Hello! I can see you now. How are you feeling today?",
          time: "Just now",
        },
      ])

      // Request camera and microphone access
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then((stream) => {
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = stream
            }
          })
          .catch((error) => {
            console.error("Error accessing media devices:", error)
            toast({
              title: "Camera Access Error",
              description: "Unable to access your camera and microphone. Please check your permissions.",
              variant: "destructive",
            })
          })
      }
    }, 2000)
  }

  // Handle ending the call
  const handleEndCall = () => {
    // Stop media streams
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const streams = localVideoRef.current.srcObject as MediaStream
      streams.getTracks().forEach((track) => track.stop())
      localVideoRef.current.srcObject = null
    }

    toast({
      title: "Call Ended",
      description: "Your video consultation has ended.",
    })

    router.push("/dashboard/video-consults")
  }

  // Handle sending a message
  const handleSendMessage = () => {
    if (!message.trim()) return

    setMessages([
      ...messages,
      {
        sender: "You",
        content: message,
        time: "Just now",
      },
    ])

    setMessage("")

    // Simulate doctor response after a delay
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: consultation.provider.name,
          content: "Thank you for sharing that information. It helps me understand your situation better.",
          time: "Just now",
        },
      ])
    }, 3000)
  }

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  // Format timestamp for chat messages
  const formatMessageTime = (timestamp: string) => {
    if (timestamp === "Just now") return timestamp
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Clean up media streams when component unmounts
  useEffect(() => {
    return () => {
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        const streams = localVideoRef.current.srcObject as MediaStream
        streams.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  return (
    <div
      className={`${
        isFullscreen ? "fixed inset-0 z-50 bg-background" : "relative"
      } transition-all duration-300 ease-in-out`}
    >
      <Card className="h-full flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={consultation.provider.avatar} alt={consultation.provider.name} />
              <AvatarFallback>{consultation.provider.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold">{consultation.provider.name}</h2>
              <p className="text-sm text-muted-foreground">{consultation.provider.specialty}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <FileText className="h-3 w-3" />
              {consultation.type}
            </Badge>
            <Button variant="outline" size="icon" onClick={toggleFullscreen} className="h-8 w-8">
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setShowEndCallDialog(true)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {!isConnected ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <div className="max-w-md w-full space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Ready to Join?</h2>
                <p className="text-muted-foreground mb-6">
                  Your video consultation with {consultation.provider.name} is ready to begin.
                </p>
              </div>

              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                <video ref={localVideoRef} className="w-full h-full object-cover" autoPlay muted playsInline></video>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Video className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Your video will appear here</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-2">
                <Button
                  variant={isMicMuted ? "destructive" : "outline"}
                  size="icon"
                  className="rounded-full h-10 w-10"
                  onClick={() => setIsMicMuted(!isMicMuted)}
                >
                  {isMicMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>

                <Button
                  variant={isVideoOff ? "destructive" : "outline"}
                  size="icon"
                  className="rounded-full h-10 w-10"
                  onClick={() => setIsVideoOff(!isVideoOff)}
                >
                  {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-10 w-10"
                  onClick={() => setShowSettingsDialog(true)}
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </div>

              <Button className="w-full gap-2" onClick={handleConnect} disabled={isConnecting}>
                {isConnecting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Video className="h-4 w-4" />
                    Join Consultation
                  </>
                )}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                <p>By joining, you agree to our terms of service and privacy policy.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 overflow-hidden">
            {/* Main video area */}
            <div className={`${activeTab === "chat" ? "md:col-span-2 lg:col-span-3" : "md:col-span-3 lg:col-span-4"}`}>
              <div className="relative h-full flex flex-col">
                <div className="flex-1 bg-black relative">
                  {/* Layout selection */}
                  <div className="absolute top-4 right-4 z-10">
                    <Select value={layout} onValueChange={setLayout}>
                      <SelectTrigger className="w-[130px] bg-black/50 text-white border-0">
                        <SelectValue placeholder="Select layout" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default View</SelectItem>
                        <SelectItem value="focus">Focus View</SelectItem>
                        <SelectItem value="grid">Grid View</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Remote video (doctor) */}
                  <div className={`absolute inset-0 ${layout === "focus" ? "z-0" : "z-10"}`}>
                    <video
                      ref={remoteVideoRef}
                      className="w-full h-full object-cover"
                      poster="/placeholder.svg?height=720&width=1280"
                      autoPlay
                      muted
                    ></video>

                    {/* Provider name overlay */}
                    <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      {consultation.provider.name}
                    </div>
                  </div>

                  {/* Local video (patient) - small overlay */}
                  <div
                    className={`
                      ${
                        layout === "default"
                          ? "absolute bottom-4 right-4 w-1/4 aspect-video"
                          : layout === "focus"
                            ? "absolute inset-0 z-10"
                            : "absolute top-0 right-0 w-1/2 h-1/2"
                      }
                      bg-muted rounded-lg overflow-hidden border-2 border-background shadow-lg
                    `}
                  >
                    <video ref={localVideoRef} className="w-full h-full object-cover" autoPlay muted></video>

                    {isVideoOff && (
                      <div className="absolute inset-0 bg-muted flex items-center justify-center">
                        <VideoOff className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}

                    {/* Your name overlay */}
                    <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-0.5 rounded-full text-xs">
                      You
                    </div>
                  </div>

                  {/* Call duration */}
                  <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    00:05:32
                  </div>
                </div>

                <div className="bg-muted p-2 flex items-center justify-center gap-2">
                  <Button
                    variant={isMicMuted ? "destructive" : "secondary"}
                    size="icon"
                    className="rounded-full h-10 w-10"
                    onClick={() => setIsMicMuted(!isMicMuted)}
                  >
                    {isMicMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </Button>

                  <Button
                    variant={isVideoOff ? "destructive" : "secondary"}
                    size="icon"
                    className="rounded-full h-10 w-10"
                    onClick={() => setIsVideoOff(!isVideoOff)}
                  >
                    {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
                  </Button>

                  <Button
                    variant={isScreenSharing ? "destructive" : "secondary"}
                    size="icon"
                    className="rounded-full h-10 w-10"
                    onClick={() => setIsScreenSharing(!isScreenSharing)}
                  >
                    <ScreenShare className="h-5 w-5" />
                  </Button>

                  <Button
                    variant="destructive"
                    size="icon"
                    className="rounded-full h-12 w-12"
                    onClick={() => setShowEndCallDialog(true)}
                  >
                    <Phone className="h-5 w-5" />
                  </Button>

                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full h-10 w-10"
                    onClick={() => setActiveTab(activeTab === "chat" ? "" : "chat")}
                  >
                    <MessageSquare className="h-5 w-5" />
                  </Button>

                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full h-10 w-10"
                    onClick={() => setShowSettingsDialog(true)}
                  >
                    <Settings className="h-5 w-5" />
                  </Button>

                  <Button variant="secondary" size="icon" className="rounded-full h-10 w-10">
                    <Layout className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            {activeTab === "chat" && (
              <div className="border-l h-full flex flex-col">
                <Tabs defaultValue="chat" className="flex flex-col h-full">
                  <TabsList className="grid w-full grid-cols-2 px-2 py-2">
                    <TabsTrigger value="chat">Chat</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                  </TabsList>

                  <TabsContent value="chat" className="flex-1 p-0 m-0 flex flex-col">
                    <ScrollArea className="flex-1 p-4">
                      <div className="space-y-4">
                        {messages.map((msg, index) => (
                          <div key={index} className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}>
                            <div className="flex gap-2 max-w-[80%]">
                              {msg.sender !== "You" && (
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={consultation.provider.avatar} alt={msg.sender} />
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
                                <p className="text-xs text-muted-foreground mt-1">{formatMessageTime(msg.time)}</p>
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
                      <div className="flex gap-2 mt-2">
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          <Paperclip className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          <Image className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          <PlusCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="notes" className="flex-1 p-0 m-0 flex flex-col">
                    <div className="p-4 flex-1">
                      <Textarea
                        placeholder="Take notes during your consultation..."
                        className="min-h-[200px] h-full resize-none"
                      />
                    </div>
                    <div className="p-4 border-t">
                      <Button className="w-full">Save Notes</Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* End Call Dialog */}
      <Dialog open={showEndCallDialog} onOpenChange={setShowEndCallDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>End Consultation</DialogTitle>
            <DialogDescription>Are you sure you want to end this consultation?</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              If you end the consultation now, you will need to reschedule if you need further assistance.
            </p>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowEndCallDialog(false)}>
              Continue Consultation
            </Button>
            <Button variant="destructive" onClick={handleEndCall}>
              End Consultation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Consultation Settings</DialogTitle>
            <DialogDescription>Adjust your audio, video, and other settings</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-6">
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Audio Settings</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="microphone">Microphone</Label>
                  <Switch
                    id="microphone"
                    checked={!isMicMuted}
                    onCheckedChange={(checked) => setIsMicMuted(!checked)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="mic-select">Microphone Device</Label>
                  <Select defaultValue="default">
                    <SelectTrigger id="mic-select">
                      <SelectValue placeholder="Select microphone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default Microphone</SelectItem>
                      <SelectItem value="headset">Headset Microphone</SelectItem>
                      <SelectItem value="external">External Microphone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label>Microphone Volume</Label>
                    <span className="text-sm">80%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <VolumeX className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="bg-primary h-full w-4/5"></div>
                    </div>
                    <Volume2 className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="text-sm font-medium">Video Settings</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="camera">Camera</Label>
                  <Switch id="camera" checked={!isVideoOff} onCheckedChange={(checked) => setIsVideoOff(!checked)} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="camera-select">Camera Device</Label>
                  <Select defaultValue="default">
                    <SelectTrigger id="camera-select">
                      <SelectValue placeholder="Select camera" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default Camera</SelectItem>
                      <SelectItem value="external">External Webcam</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="text-sm font-medium">Speaker Settings</h4>
              <div className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="speaker-select">Speaker Device</Label>
                  <Select defaultValue="default">
                    <SelectTrigger id="speaker-select">
                      <SelectValue placeholder="Select speaker" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default Speaker</SelectItem>
                      <SelectItem value="headphones">Headphones</SelectItem>
                      <SelectItem value="external">External Speakers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label>Speaker Volume</Label>
                    <span className="text-sm">70%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Volume1 className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="bg-primary h-full w-[70%]"></div>
                    </div>
                    <Volume2 className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowSettingsDialog(false)}>Save Settings</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
