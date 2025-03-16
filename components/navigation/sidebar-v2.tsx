"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { SecurityBadge } from "@/components/ui/security-badge"
import { useAuth } from "@/components/auth/auth-provider"
import { useToast } from "@/hooks/use-toast"
import {
  IconDna,
  IconBrain,
  IconMessage,
  IconUser,
  IconSettings,
  IconLogout,
  IconFlask,
  IconShieldLock,
  IconDashboard,
  IconChartBar,
  IconFileAnalytics,
  IconUsers,
  IconAlertTriangle,
  IconBell,
  IconSearch,
  IconInfoCircle,
  IconHeartbeat,
  IconBuildingHospital,
} from "@tabler/icons-react"

export function SidebarV2() {
  const pathname = usePathname()
  const { signOut, user } = useAuth()
  const { toast } = useToast()
  const [notifications, setNotifications] = useState(3)
  const [sessionTime, setSessionTime] = useState(900) // 15 minutes in seconds
  const [showSessionWarning, setShowSessionWarning] = useState(false)

  // Session timeout countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime((prev) => {
        if (prev <= 60) {
          // Show warning when 1 minute left
          setShowSessionWarning(true)
        }
        if (prev <= 0) {
          clearInterval(timer)
          // Auto logout when session expires
          signOut()
          toast({
            title: "Session Expired",
            description: "Your session has expired due to inactivity.",
            variant: "destructive",
          })
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Reset timer on user activity
    const resetTimer = () => {
      setSessionTime(900)
      setShowSessionWarning(false)
    }

    window.addEventListener("mousemove", resetTimer)
    window.addEventListener("keypress", resetTimer)

    return () => {
      clearInterval(timer)
      window.removeEventListener("mousemove", resetTimer)
      window.removeEventListener("keypress", resetTimer)
    }
  }, [signOut, toast])

  const handleLogout = async () => {
    try {
      await signOut()
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      })
    }
  }

  const formatSessionTime = () => {
    const minutes = Math.floor(sessionTime / 60)
    const seconds = sessionTime % 60
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <SidebarProvider>
      <Sidebar variant="inset" collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center space-x-2 px-2 py-3">
            <div className="bg-primary/20 p-2 rounded-full">
              <IconDna className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">AGENT 2.0</h1>
              <p className="text-xs text-muted-foreground">Precision Oncology Platform</p>
            </div>
          </div>
          <div className="px-4 py-2">
            <div className="relative">
              <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-secondary/20 border-0 rounded-md pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          {/* Main Navigation */}
          <SidebarGroup>
            <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/dashboard"}>
                    <Link href="/dashboard">
                      <IconDashboard className="h-5 w-5" />
                      <span>Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/chat"}>
                    <Link href="/chat">
                      <IconMessage className="h-5 w-5" />
                      <span>AI Chatbot</span>
                    </Link>
                  </SidebarMenuButton>
                  <SidebarMenuBadge>New</SidebarMenuBadge>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/genomics"}>
                    <Link href="/genomics">
                      <IconDna className="h-5 w-5" />
                      <span>Genomic Analysis</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/laboratory"}>
                    <Link href="/laboratory">
                      <IconFlask className="h-5 w-5" />
                      <span>Laboratory</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/patients"}>
                    <Link href="/patients">
                      <IconUser className="h-5 w-5" />
                      <span>Patients</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/epic-integration"}>
                    <Link href="/epic-integration">
                      <IconBuildingHospital className="h-5 w-5" />
                      <span>EPIC Integration</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator />

          {/* AI & Analytics */}
          <SidebarGroup>
            <SidebarGroupLabel>AI & Analytics</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/digital-twin"}>
                    <Link href="/digital-twin">
                      <IconBrain className="h-5 w-5" />
                      <span>Digital Twin</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/federated-learning"}>
                    <Link href="/federated-learning">
                      <IconChartBar className="h-5 w-5" />
                      <span>Federated Learning</span>
                    </Link>
                  </SidebarMenuButton>
                  <SidebarMenuBadge>Beta</SidebarMenuBadge>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/reports"}>
                    <Link href="/reports">
                      <IconFileAnalytics className="h-5 w-5" />
                      <span>Beaker Reports</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/clinical-trials"}>
                    <Link href="/clinical-trials">
                      <IconHeartbeat className="h-5 w-5" />
                      <span>Clinical Trials</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator />

          {/* Administration */}
          <SidebarGroup>
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/admin"}>
                    <Link href="/admin">
                      <IconShieldLock className="h-5 w-5" />
                      <span>Admin Panel</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/users"}>
                    <Link href="/users">
                      <IconUsers className="h-5 w-5" />
                      <span>User Management</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/audit-logs"}>
                    <Link href="/audit-logs">
                      <IconAlertTriangle className="h-5 w-5" />
                      <span>Audit Logs</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/settings"}>
                    <Link href="/settings">
                      <IconSettings className="h-5 w-5" />
                      <span>Settings</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <div className="px-4 py-2 mb-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <IconUser className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{user?.email || "User"}</p>
                  <p className="text-xs text-muted-foreground">Oncologist</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setNotifications(0)}>
                <div className="relative">
                  <IconBell className="h-5 w-5" />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {notifications}
                    </span>
                  )}
                </div>
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${sessionTime > 300 ? "bg-green-500" : "bg-destructive"}`}></div>
                <span className="text-xs text-muted-foreground">Session: {formatSessionTime()}</span>
              </div>
              <SecurityBadge type="hipaa" className="text-xs" />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/help">
                  <IconInfoCircle className="h-4 w-4 mr-1" />
                  Help
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}>
                <IconLogout className="h-4 w-4 mr-1" />
                Logout
              </Button>
            </div>
          </div>
        </SidebarFooter>

        <SidebarTrigger />
      </Sidebar>

      {showSessionWarning && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg shadow-lg border border-border max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <IconAlertTriangle className="h-5 w-5 text-destructive mr-2" />
              Session Timeout Warning
            </h3>
            <p className="mb-4">
              Your session will expire in {formatSessionTime()} due to inactivity. Would you like to continue?
            </p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleLogout}>
                Logout Now
              </Button>
              <Button onClick={() => setShowSessionWarning(false)}>Continue Session</Button>
            </div>
          </div>
        </div>
      )}
    </SidebarProvider>
  )
}

