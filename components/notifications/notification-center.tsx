"use client"

import { useState, useEffect } from "react"
import { Bell, Check, X, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Mock notification data
const mockNotifications = [
  {
    id: "1",
    type: "appointment",
    title: "Upcoming Appointment",
    message: "Reminder: You have an appointment with Dr. Smith tomorrow at 10:00 AM.",
    date: new Date(Date.now() + 86400000),
    read: false,
  },
  {
    id: "2",
    type: "message",
    title: "New Message",
    message: "Dr. Johnson sent you a message regarding your recent lab results.",
    date: new Date(Date.now() - 3600000),
    read: false,
  },
  {
    id: "3",
    type: "lab",
    title: "Lab Results Available",
    message: "Your recent blood work results are now available for review.",
    date: new Date(Date.now() - 86400000),
    read: true,
  },
  {
    id: "4",
    type: "medication",
    title: "Medication Reminder",
    message: "Time to take your evening medication: Lisinopril 10mg.",
    date: new Date(Date.now() - 43200000),
    read: true,
  },
  {
    id: "5",
    type: "system",
    title: "System Maintenance",
    message: "The telehealth platform will be undergoing maintenance tonight from 2-4 AM EST.",
    date: new Date(Date.now() - 172800000),
    read: true,
  },
]

type Notification = {
  id: string
  type: "appointment" | "message" | "lab" | "medication" | "system"
  title: string
  message: string
  date: Date
  read: boolean
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [unreadCount, setUnreadCount] = useState(0)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const count = notifications.filter((notification) => !notification.read).length
    setUnreadCount(count)
  }, [notifications])

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  const getRelativeTime = (date: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return "Just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hr ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`

    return date.toLocaleDateString()
  }

  const getTypeIcon = (type: Notification["type"]) => {
    switch (type) {
      case "appointment":
        return <div className="h-2 w-2 rounded-full bg-blue-500" />
      case "message":
        return <div className="h-2 w-2 rounded-full bg-green-500" />
      case "lab":
        return <div className="h-2 w-2 rounded-full bg-purple-500" />
      case "medication":
        return <div className="h-2 w-2 rounded-full bg-yellow-500" />
      case "system":
        return <div className="h-2 w-2 rounded-full bg-red-500" />
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
              variant="destructive"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[380px] p-0" align="end">
        <div className="flex items-center justify-between border-b px-4 py-2">
          <h3 className="font-semibold">Notifications</h3>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
              <Check className="mr-1 h-4 w-4" />
              <span className="text-xs">Mark all read</span>
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Tabs defaultValue="all">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="m-0">
            <ScrollArea className="h-[300px]">
              {notifications.length > 0 ? (
                <div className="divide-y">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "flex items-start gap-2 p-3 hover:bg-muted/50",
                        !notification.read && "bg-muted/20",
                      )}
                    >
                      <div className="mt-1">{getTypeIcon(notification.type)}</div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{notification.title}</p>
                          <span className="text-xs text-muted-foreground">{getRelativeTime(notification.date)}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{notification.message}</p>
                      </div>
                      <div className="flex flex-col gap-1">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => removeNotification(notification.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-muted-foreground">No notifications</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="unread" className="m-0">
            <ScrollArea className="h-[300px]">
              {notifications.filter((n) => !n.read).length > 0 ? (
                <div className="divide-y">
                  {notifications
                    .filter((notification) => !notification.read)
                    .map((notification) => (
                      <div key={notification.id} className="flex items-start gap-2 bg-muted/20 p-3 hover:bg-muted/50">
                        <div className="mt-1">{getTypeIcon(notification.type)}</div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">{notification.title}</p>
                            <span className="text-xs text-muted-foreground">{getRelativeTime(notification.date)}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{notification.message}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => removeNotification(notification.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-muted-foreground">No unread notifications</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="appointments" className="m-0">
            <ScrollArea className="h-[300px]">
              {notifications.filter((n) => n.type === "appointment").length > 0 ? (
                <div className="divide-y">
                  {notifications
                    .filter((notification) => notification.type === "appointment")
                    .map((notification) => (
                      <div
                        key={notification.id}
                        className={cn(
                          "flex items-start gap-2 p-3 hover:bg-muted/50",
                          !notification.read && "bg-muted/20",
                        )}
                      >
                        <div className="mt-1">{getTypeIcon(notification.type)}</div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">{notification.title}</p>
                            <span className="text-xs text-muted-foreground">{getRelativeTime(notification.date)}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{notification.message}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => removeNotification(notification.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-muted-foreground">No appointment notifications</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="messages" className="m-0">
            <ScrollArea className="h-[300px]">
              {notifications.filter((n) => n.type === "message").length > 0 ? (
                <div className="divide-y">
                  {notifications
                    .filter((notification) => notification.type === "message")
                    .map((notification) => (
                      <div
                        key={notification.id}
                        className={cn(
                          "flex items-start gap-2 p-3 hover:bg-muted/50",
                          !notification.read && "bg-muted/20",
                        )}
                      >
                        <div className="mt-1">{getTypeIcon(notification.type)}</div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">{notification.title}</p>
                            <span className="text-xs text-muted-foreground">{getRelativeTime(notification.date)}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{notification.message}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => removeNotification(notification.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-muted-foreground">No message notifications</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
        <div className="border-t p-2">
          <Button variant="outline" size="sm" className="w-full">
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
