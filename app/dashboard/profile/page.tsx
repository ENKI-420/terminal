import type { Metadata } from "next"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Phone, MapPin, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "My Profile | GenomicInsights",
  description: "View and manage your profile information",
}

export default function ProfilePage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="My Profile" text="View and manage your profile information">
        <Button>Edit Profile</Button>
      </DashboardHeader>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder.svg?height=96&width=96" alt="User" />
                <AvatarFallback className="text-2xl">JS</AvatarFallback>
              </Avatar>
              <div className="space-y-1 text-center">
                <h3 className="text-xl font-medium">John Smith</h3>
                <p className="text-sm text-muted-foreground">Patient ID: P12345678</p>
                <div className="flex justify-center gap-1">
                  <Badge
                    variant="outline"
                    className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                  >
                    Active
                  </Badge>
                </div>
              </div>
              <div className="w-full space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Male, 58 years</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">john.smith@example.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">(555) 123-4567</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">123 Main St, Anytown, CA 12345</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Patient since: Jan 2025</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Health Information</CardTitle>
            <CardDescription>Your key health information and history</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="summary" className="space-y-4">
              <TabsList>
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="conditions">Conditions</TabsTrigger>
                <TabsTrigger value="medications">Medications</TabsTrigger>
                <TabsTrigger value="allergies">Allergies</TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Primary Diagnosis</h4>
                  <p className="text-sm">Acute Myeloid Leukemia (AML) with FLT3-ITD mutation</p>
                  <p className="text-sm text-muted-foreground">Diagnosed: March 10, 2025</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Current Treatment</h4>
                  <p className="text-sm">Venetoclax + Azacitidine regimen</p>
                  <p className="text-sm text-muted-foreground">Started: March 15, 2025</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Primary Care Provider</h4>
                  <p className="text-sm">Dr. Robert Johnson</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Specialists</h4>
                  <div className="space-y-1">
                    <p className="text-sm">Dr. Sarah Johnson (Oncologist)</p>
                    <p className="text-sm">Dr. Michael Chen (Hematologist)</p>
                    <p className="text-sm">Emily Rodriguez (Genetic Counselor)</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="conditions">
                <div className="space-y-4">
                  <div className="border-b pb-2">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-medium">Acute Myeloid Leukemia (AML)</h4>
                        <p className="text-sm text-muted-foreground">Diagnosed: March 10, 2025</p>
                      </div>
                      <Badge>Active</Badge>
                    </div>
                    <p className="text-sm mt-1">FLT3-ITD mutation positive, NPM1 mutation positive</p>
                  </div>

                  <div className="border-b pb-2">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-medium">Hypertension</h4>
                        <p className="text-sm text-muted-foreground">Diagnosed: 2020</p>
                      </div>
                      <Badge variant="outline">Controlled</Badge>
                    </div>
                    <p className="text-sm mt-1">Well-controlled with medication</p>
                  </div>

                  <div>
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-medium">Type 2 Diabetes</h4>
                        <p className="text-sm text-muted-foreground">Diagnosed: 2018</p>
                      </div>
                      <Badge variant="outline">Controlled</Badge>
                    </div>
                    <p className="text-sm mt-1">Managed with diet and oral medication</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="medications">
                <div className="space-y-4">
                  <div className="border-b pb-2">
                    <h4 className="font-medium">Venetoclax</h4>
                    <p className="text-sm">400mg daily</p>
                    <p className="text-sm text-muted-foreground">Started: March 15, 2025</p>
                  </div>

                  <div className="border-b pb-2">
                    <h4 className="font-medium">Azacitidine</h4>
                    <p className="text-sm">75mg/m², Days 1-7 of each 28-day cycle</p>
                    <p className="text-sm text-muted-foreground">Started: March 15, 2025</p>
                  </div>

                  <div className="border-b pb-2">
                    <h4 className="font-medium">Lisinopril</h4>
                    <p className="text-sm">10mg daily</p>
                    <p className="text-sm text-muted-foreground">Started: 2020</p>
                  </div>

                  <div>
                    <h4 className="font-medium">Metformin</h4>
                    <p className="text-sm">1000mg twice daily</p>
                    <p className="text-sm text-muted-foreground">Started: 2018</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="allergies">
                <div className="space-y-4">
                  <div className="border-b pb-2">
                    <div className="flex justify-between">
                      <h4 className="font-medium">Penicillin</h4>
                      <Badge variant="destructive">Severe</Badge>
                    </div>
                    <p className="text-sm mt-1">Hives, difficulty breathing</p>
                  </div>

                  <div>
                    <div className="flex justify-between">
                      <h4 className="font-medium">Sulfa Drugs</h4>
                      <Badge variant="destructive">Moderate</Badge>
                    </div>
                    <p className="text-sm mt-1">Skin rash</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
