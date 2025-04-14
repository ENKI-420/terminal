"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  Phone,
  MessageSquare,
  Users,
  Settings,
  Share2,
  FileText,
  Send,
  PlusCircle,
  Paperclip,
  Image,
  Loader2,
} from "lucide-react"

export function VideoConsultation() {
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isMicMuted, setIsMicMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [activeTab, setActiveTab] = useState("video")
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<{ sender: string; content: string; time: string }[]>([])
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const { toast } = useToast()

  // Simulate connection to video call
  const handleConnect = () => {
    setIsConnecting(true)

    // Simulate connection delay
    setTimeout(() => {
      setIsConnected(true)
      setIsConnecting(false)

      toast({
        title: "Connected",
        description: "You are now connected to your healthcare provider.",
      })

      // Add a welcome message
      setMessages([
        {
          sender: "Dr. Sarah Johnson",
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
    setIsConnected(false)

    // Stop media streams
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const streams = localVideoRef.current.srcObject as MediaStream
      streams.getTracks().forEach((track) => track.stop())
      localVideoRef.current.srcObject = null
    }

    toast({
      title: "Call Ended",
      description: "Your telehealth consultation has ended.",
    })
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
          sender: "Dr. Sarah Johnson",
          content: "Thank you for sharing that information. It helps me understand your situation better.",
          time: "Just now",
        },
      ])
    }, 3000)
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
    <div className="space-y-4">
      {!isConnected ? (
        <Card>
          <CardHeader>
            <CardTitle>Video Consultation</CardTitle>
            <CardDescription>Connect with your healthcare provider through secure video</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Video className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Your video will appear here</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Appointment Details</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Provider:</div>
                    <div>Dr. Sarah Johnson</div>
                    <div className="text-muted-foreground">Specialty:</div>
                    <div>Oncologist</div>
                    <div className="text-muted-foreground">Time:</div>
                    <div>Today at 2:00 PM (30 minutes)</div>
                    <div className="text-muted-foreground">Reason:</div>
                    <div>Follow-up on genomic test results</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Before You Begin</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-100 dark:bg-blue-900 p-1.5 rounded-full">
                          <Video className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm">Ensure your camera and microphone are working properly.</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="bg-blue-100 dark:bg-blue-900 p-1.5 rounded-full">
                          <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm">Find a quiet, private space for your consultation.</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="bg-blue-100 dark:bg-blue-900 p-1.5 rounded-full">
                          <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm">Have your questions and medical information ready.</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-3">
                  <h3 className="font-medium">Connection Test</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="camera">Camera</Label>
                      <Switch id="camera" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="microphone">Microphone</Label>
                      <Switch id="microphone" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="speaker">Speaker</Label>
                      <Switch id="speaker" defaultChecked />
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Run Connection Test
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
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
          </CardFooter>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3 space-y-4">
            <Card className="overflow-hidden">
              <div className="relative aspect-video bg-black">
                {/* Remote video (doctor) */}
                <video
                  ref={remoteVideoRef}
                  className="w-full h-full object-cover"
                  poster="/placeholder.svg?height=720&width=1280"
                  autoPlay
                  muted
                ></video>

                {/* Local video (patient) - small overlay */}
                <div className="absolute bottom-4 right-4 w-1/4 aspect-video bg-muted rounded-lg overflow-hidden border-2 border-background shadow-lg">
                  <video ref={localVideoRef} className="w-full h-full object-cover" autoPlay muted></video>

                  {isVideoOff && (
                    <div className="absolute inset-0 bg-muted flex items-center justify-center">
                      <VideoOff className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Doctor name overlay */}
                <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  Dr. Sarah Johnson
                </div>

                {/* Call duration */}
                <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
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

                <Button variant="destructive" size="icon" className="rounded-full h-12 w-12" onClick={handleEndCall}>
                  <Phone className="h-5 w-5" />
                </Button>

                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full h-10 w-10"
                  onClick={() => setActiveTab("chat")}
                >
                  <MessageSquare className="h-5 w-5" />
                </Button>

                <Button variant="secondary" size="icon" className="rounded-full h-10 w-10">
                  <Share2 className="h-5 w-5" />
                </Button>

                <Button variant="secondary" size="icon" className="rounded-full h-10 w-10">
                  <Settings className="h-5 w-5" />
                </Button>
              </div>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Consultation Notes</CardTitle>
                <CardDescription>Take notes during your consultation</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea placeholder="Type your notes here..." className="min-h-[100px]" />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">
                  <FileText className="mr-2 h-4 w-4" />
                  Save Notes
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share with Provider
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="info">Info</TabsTrigger>
              </TabsList>

              <TabsContent value="chat" className="mt-4">
                <Card className="h-[500px] flex flex-col">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Chat</CardTitle>
                    <CardDescription>Message your provider</CardDescription>
                  </CardHeader>
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}>
                          <div className="flex gap-2 max-w-[80%]">
                            {msg.sender !== "You" && (
                              <Avatar className="h-8 w-8">
                                <AvatarImage src="/placeholder.svg?height=32&width=32" alt={msg.sender} />
                                <AvatarFallback>SJ</AvatarFallback>
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
                              <p className="text-xs text-muted-foreground mt-1">{msg.time}</p>
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
                </Card>
              </TabsContent>

              <TabsContent value="info" className="mt-4">
                <Card className="h-[500px]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Provider Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col items-center">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src="/placeholder.svg?height=80&width=80" alt="Dr. Sarah Johnson" />
                        <AvatarFallback>SJ</AvatarFallback>
                      </Avatar>
                      <h3 className="font-medium mt-2">Dr. Sarah Johnson</h3>
                      <p className="text-sm text-muted-foreground">Oncologist</p>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">About</h4>
                      <p className="text-sm text-muted-foreground">
                        Dr. Johnson specializes in genomic-driven cancer treatment approaches with over 15 years of
                        experience in oncology. She focuses on personalized medicine based on genetic profiles.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Consultation Details</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-muted-foreground">Date:</div>
                        <div>Today</div>
                        <div className="text-muted-foreground">Time:</div>
                        <div>2:00 PM - 2:30 PM</div>
                        <div className="text-muted-foreground">Type:</div>
                        <div>Video Consultation</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Contact Information</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-muted-foreground">Email:</div>
                        <div>dr.johnson@genomicinsights.com</div>
                        <div className="text-muted-foreground">Office:</div>
                        <div>(555) 123-4567</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  )
}
