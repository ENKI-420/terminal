"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  IconLock,
  IconShieldLock,
  IconEye,
  IconEyeOff,
  IconUsers,
  IconFileAnalytics,
  IconDna,
  IconFileText,
} from "@tabler/icons-react"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Admin password - in a real app, this would be stored securely on the server
const ADMIN_PASSWORD = "p@$$code"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("users")
  const router = useRouter()
  const { toast } = useToast()

  // Check if already authenticated (from localStorage)
  useEffect(() => {
    const adminAuth = localStorage.getItem("admin_authenticated")
    if (adminAuth === "true") {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        setIsAuthenticated(true)
        localStorage.setItem("admin_authenticated", "true")
        toast({
          title: "Authentication successful",
          description: "Welcome to the admin dashboard",
        })
      } else {
        toast({
          title: "Authentication failed",
          description: "Invalid password. Please try again.",
          variant: "destructive",
        })
      }
      setIsLoading(false)
    }, 1000)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("admin_authenticated")
    setPassword("")
    toast({
      title: "Logged out",
      description: "You have been logged out of the admin dashboard",
    })
  }

  // Mock data for the admin dashboard
  const mockUsers = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Researcher", lastLogin: "2023-05-15 14:30" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Doctor", lastLogin: "2023-05-16 09:45" },
    {
      id: 3,
      name: "Robert Johnson",
      email: "robert@example.com",
      role: "Lab Technician",
      lastLogin: "2023-05-14 11:20",
    },
    { id: 4, name: "Emily Davis", email: "emily@example.com", role: "Administrator", lastLogin: "2023-05-16 16:10" },
    { id: 5, name: "Michael Wilson", email: "michael@example.com", role: "Researcher", lastLogin: "2023-05-13 10:05" },
  ]

  const mockReports = [
    { id: 1, name: "Genomic Analysis Report", date: "2023-05-15", status: "Completed", user: "John Doe" },
    { id: 2, name: "Patient Health Summary", date: "2023-05-16", status: "In Progress", user: "Jane Smith" },
    { id: 3, name: "Laboratory Test Results", date: "2023-05-14", status: "Completed", user: "Robert Johnson" },
    { id: 4, name: "Oncology Research Data", date: "2023-05-13", status: "Completed", user: "Michael Wilson" },
    { id: 5, name: "System Audit Log", date: "2023-05-16", status: "Completed", user: "Emily Davis" },
  ]

  const mockSystemStats = {
    totalUsers: 42,
    activeUsers: 28,
    reportsGenerated: 156,
    genomicAnalyses: 87,
    storageUsed: "1.2 TB",
    apiCalls: "5,432",
    lastBackup: "2023-05-16 03:00 AM",
    systemUptime: "99.98%",
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card>
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <IconShieldLock className="h-8 w-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl text-center">Admin Access</CardTitle>
              <CardDescription className="text-center">
                Enter your admin password to access the dashboard
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <IconLock className="h-5 w-5" />
                    </div>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className="pl-10 pr-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <IconEyeOff className="h-5 w-5" /> : <IconEye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Authenticating..." : "Login to Admin"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <IconShieldLock className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">AGENT 2.0 Admin Dashboard</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => router.push("/admin/content-management")}
              className="flex items-center"
            >
              <IconFileText className="h-4 w-4 mr-2" />
              Content Management
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <IconUsers className="mr-2 h-5 w-5 text-primary" />
                Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{mockSystemStats.totalUsers}</div>
              <p className="text-sm text-muted-foreground">{mockSystemStats.activeUsers} active users</p>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <IconFileAnalytics className="mr-2 h-5 w-5 text-primary" />
                Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{mockSystemStats.reportsGenerated}</div>
              <p className="text-sm text-muted-foreground">Total reports generated</p>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <IconDna className="mr-2 h-5 w-5 text-primary" />
                Analyses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{mockSystemStats.genomicAnalyses}</div>
              <p className="text-sm text-muted-foreground">Genomic analyses performed</p>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <IconShieldLock className="mr-2 h-5 w-5 text-primary" />
                System
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{mockSystemStats.systemUptime}</div>
              <p className="text-sm text-muted-foreground">System uptime</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="system">System Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage user accounts and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium">ID</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">Name</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">Email</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">Role</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">Last Login</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {mockUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-muted/50">
                          <td className="px-4 py-2 text-sm">{user.id}</td>
                          <td className="px-4 py-2 text-sm font-medium">{user.name}</td>
                          <td className="px-4 py-2 text-sm">{user.email}</td>
                          <td className="px-4 py-2 text-sm">{user.role}</td>
                          <td className="px-4 py-2 text-sm">{user.lastLogin}</td>
                          <td className="px-4 py-2 text-sm">
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                Edit
                              </Button>
                              <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Export Users</Button>
                <Button>Add New User</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Reports Management</CardTitle>
                <CardDescription>View and manage system reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium">ID</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">Report Name</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">Date</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">Status</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">User</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {mockReports.map((report) => (
                        <tr key={report.id} className="hover:bg-muted/50">
                          <td className="px-4 py-2 text-sm">{report.id}</td>
                          <td className="px-4 py-2 text-sm font-medium">{report.name}</td>
                          <td className="px-4 py-2 text-sm">{report.date}</td>
                          <td className="px-4 py-2 text-sm">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                report.status === "Completed"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                              }`}
                            >
                              {report.status}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-sm">{report.user}</td>
                          <td className="px-4 py-2 text-sm">
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                View
                              </Button>
                              <Button variant="outline" size="sm">
                                Download
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Export All Reports</Button>
                <Button>Generate New Report</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure system settings and view statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">System Statistics</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Storage Used:</span>
                        <span className="font-medium">{mockSystemStats.storageUsed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">API Calls (Last 30 days):</span>
                        <span className="font-medium">{mockSystemStats.apiCalls}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Backup:</span>
                        <span className="font-medium">{mockSystemStats.lastBackup}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">System Uptime:</span>
                        <span className="font-medium">{mockSystemStats.systemUptime}</span>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button variant="outline" className="w-full">
                        Run System Diagnostics
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Configuration</h3>

                    <div className="space-y-2">
                      <Label htmlFor="backup-frequency">Backup Frequency</Label>
                      <select
                        id="backup-frequency"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="log-retention">Log Retention (days)</Label>
                      <Input id="log-retention" type="number" defaultValue="30" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="api-rate-limit">API Rate Limit (requests/minute)</Label>
                      <Input id="api-rate-limit" type="number" defaultValue="100" />
                    </div>

                    <div className="pt-4">
                      <Button className="w-full">Save Configuration</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="w-full flex justify-between">
                  <Button variant="outline">Reset to Defaults</Button>
                  <Button variant="destructive">Clear All Caches</Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

