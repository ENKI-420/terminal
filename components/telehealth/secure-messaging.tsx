"use client"

import { useState } from "react"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import {
  Search,
  PlusCircle,
  Send,
  Paperclip,
  Image,
  MoreVertical,
  Star,
  StarOff,
  CheckCheck,
  AlertCircle,
  FileText,
  User,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Mock conversation data
const conversations = [
  {
    id: 1,
    contact: {
      name: "Dr. Sarah Johnson",
      role: "Oncologist",
      avatar: "/placeholder.svg?height=40&width=40",
      isOnline: true,
    },
    lastMessage: {
      content: "Your genomic test results look promising. Let's discuss them in detail during our next appointment.",
      timestamp: "2023-04-02T10:30:00",
      isRead: true,
      sender: "them",
    },
    isStarred: true,
    unreadCount: 0,
  },
  {
    id: 2,
    contact: {
      name: "Emily Rodriguez",
      role: "Genetic Counselor",
      avatar: "/placeholder.svg?height=40&width=40",
      isOnline: false,
    },
    lastMessage: {
      content: "I've reviewed your family history and would like to discuss some additional testing options.",
      timestamp: "2023-04-01T15:45:00",
      isRead: false,
      sender: "them",
    },
    isStarred: false,
    unreadCount: 2,
  },
  {
    id: 3,
    contact: {
      name: "Dr. Michael Chen",
      role: "Hematologist",
      avatar: "/placeholder.svg?height=40&width=40",
      isOnline: true,
    },
    lastMessage: {
      content: "Your latest blood work shows improvement. Continue with the current medication regimen.",
      timestamp: "2023-03-30T09:15:00",
      isRead: true,
      sender: "them",
    },
    isStarred: false,
    unreadCount: 0,
  },
  {
    id: 4,
    contact: {
      name: "Pharmacy Team",
      role: "Medication Support",
      avatar: "/placeholder.svg?height=40&width=40",
      isOnline: true,
    },
    lastMessage: {
      content: "Your prescription refill has been processed and will be delivered tomorrow.",
      timestamp: "2023-03-29T14:20:00",
      isRead: true,
      sender: "them",
    },
    isStarred: false,
    unreadCount: 0,
  },
  {
    id: 5,
    contact: {
      name: "Support Team",
      role: "Patient Services",
      avatar: "/placeholder.svg?height=40&width=40",
      isOnline: true,
    },
    lastMessage: {
      content: "Thank you for your inquiry. We've scheduled a follow-up call to discuss your insurance coverage.",
      timestamp: "2023-03-28T11:05:00",
      isRead: true,
      sender: "them",
    },
    isStarred: false,
    unreadCount: 0,
  },
]

// Mock messages for the first conversation
const mockMessages = [
  {
    id: 1,
    content: "Hello Charlie, I hope you're doing well today.",
    timestamp: "2023-04-02T10:15:00",
    sender: "them",
    senderName: "Dr. Sarah Johnson",
  },
  {
    id: 2,
    content: "Hi Dr. Johnson, I'm feeling better than last week. The new medication seems to be helping.",
    timestamp: "2023-04-02T10:18:00",
    sender: "me",
  },
  {
    id: 3,
    content: "That's excellent news! I've reviewed your latest genomic test results, and they look promising.",
    timestamp: "2023-04-02T10:22:00",
    sender: "them",
    senderName: "Dr. Sarah Johnson",
  },
  {
    id: 4,
    content:
      "The FLT3 inhibitor appears to be effectively targeting the mutation we identified. Your blood counts are improving as well.",
    timestamp: "2023-04-02T10:24:00",
    sender: "them",
    senderName: "Dr. Sarah Johnson",
  },
  {
    id: 5,
    content: "That's great to hear! Does this mean we're on the right track with the treatment plan?",
    timestamp: "2023-04-02T10:26:00",
    sender: "me",
  },
  {
    id: 6,
    content:
      "Yes, absolutely. The genomic-guided approach is working as we hoped. Let's discuss the details during our video appointment tomorrow at 2:00 PM.",
    timestamp: "2023-04-02T10:30:00",
    sender: "them",
    senderName: "Dr. Sarah Johnson",
  },
]

export function SecureMessaging() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0])
  const [message, setMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [activeMessages, setActiveMessages] = useState(mockMessages)
  const { toast } = useToast()

  // Filter conversations based on search term
  const filteredConversations = conversations.filter((conv) =>
    conv.contact.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Handle sending a new message
  const handleSendMessage = () => {
    if (!message.trim()) return

    // Add the new message to the conversation
    const newMessage = {
      id: activeMessages.length + 1,
      content: message,
      timestamp: new Date().toISOString(),
      sender: "me",
    }

    setActiveMessages([...activeMessages, newMessage])
    setMessage("")

    // Simulate a response after a delay
    setTimeout(() => {
      const responseMessage = {
        id: activeMessages.length + 2,
        content: "Thank you for your message. I'll review this information before our appointment.",
        timestamp: new Date().toISOString(),
        sender: "them",
        senderName: selectedConversation.contact.name,
      }

      setActiveMessages((prev) => [...prev, responseMessage])

      toast({
        title: "New Message",
        description: `${selectedConversation.contact.name} has responded to your message.`,
      })
    }, 5000)
  }

  // Toggle star status for a conversation
  const toggleStar = (id: number) => {
    const updatedConversations = conversations.map((conv) =>
      conv.id === id ? { ...conv, isStarred: !conv.isStarred } : conv,
    )

    // Update the conversations array
    conversations.splice(0, conversations.length, ...updatedConversations)

    // Update selected conversation if it's the one being starred/unstarred
    if (selectedConversation.id === id) {
      setSelectedConversation({ ...selectedConversation, isStarred: !selectedConversation.isStarred })
    }
  }

  // Format timestamp to readable format
  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return format(date, "h:mm a")
  }

  const formatConversationTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()

    // If today, show time
    if (date.toDateString() === now.toDateString()) {
      return format(date, "h:mm a")
    }

    // If this year, show month and day
    if (date.getFullYear() === now.getFullYear()) {
      return format(date, "MMM d")
    }

    // Otherwise show month, day and year
    return format(date, "MMM d, yyyy")
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[700px]">
      {/* Conversations List */}
      <Card className="md:col-span-1 flex flex-col">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>Messages</CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1">
                  <PlusCircle className="h-4 w-4" />
                  New
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>New Message</DialogTitle>
                  <DialogDescription>Start a new conversation with your healthcare team</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Recipient</label>
                    <Input placeholder="Search for a provider..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Message</label>
                    <Textarea placeholder="Type your message here..." rows={5} />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button>Send Message</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search messages..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <Tabs defaultValue="all" className="px-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="starred">Starred</TabsTrigger>
          </TabsList>
        </Tabs>
        <ScrollArea className="flex-1 p-4 pt-2">
          <div className="space-y-2">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedConversation.id === conversation.id ? "bg-muted" : "hover:bg-muted/50"
                  }`}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={conversation.contact.avatar} alt={conversation.contact.name} />
                      <AvatarFallback>{conversation.contact.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {conversation.contact.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium truncate">{conversation.contact.name}</h4>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleStar(conversation.id)
                          }}
                          className="text-muted-foreground hover:text-amber-400 transition-colors"
                        >
                          {conversation.isStarred ? (
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          ) : (
                            <StarOff className="h-4 w-4" />
                          )}
                        </button>
                        <span className="text-xs text-muted-foreground">
                          {formatConversationTime(conversation.lastMessage.timestamp)}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.lastMessage.sender === "me" && "You: "}
                        {conversation.lastMessage.content}
                      </p>
                      {conversation.unreadCount > 0 && <Badge className="ml-2">{conversation.unreadCount}</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">{conversation.contact.role}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No conversations found</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </Card>

      {/* Conversation View */}
      <Card className="md:col-span-2 flex flex-col">
        <CardHeader className="pb-2 border-b">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={selectedConversation.contact.avatar} alt={selectedConversation.contact.name} />
                <AvatarFallback>{selectedConversation.contact.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  {selectedConversation.contact.name}
                  {selectedConversation.contact.isOnline && <span className="w-2 h-2 bg-green-500 rounded-full"></span>}
                </CardTitle>
                <CardDescription>{selectedConversation.contact.role}</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <User className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <FileText className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {activeMessages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                <div className="flex gap-2 max-w-[80%]">
                  {msg.sender !== "me" && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={selectedConversation.contact.avatar} alt={msg.senderName} />
                      <AvatarFallback>{msg.senderName?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                  )}
                  <div>
                    <div
                      className={`rounded-lg px-3 py-2 text-sm ${
                        msg.sender === "me" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      {msg.content}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <p className="text-xs text-muted-foreground">{formatMessageTime(msg.timestamp)}</p>
                      {msg.sender === "me" && <CheckCheck className="h-3 w-3 text-muted-foreground" />}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <CardFooter className="border-t p-4">
          <div className="w-full space-y-2">
            <Textarea
              placeholder="Type your message..."
              className="min-h-[80px]"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
            />
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  <Image className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  <AlertCircle className="h-4 w-4" />
                </Button>
              </div>
              <Button onClick={handleSendMessage} className="gap-1">
                <Send className="h-4 w-4" />
                Send
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
