"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, BarChart } from "@/components/charts"
import {
  Activity,
  Heart,
  Thermometer,
  Droplets,
  Dna,
  Scale,
  Clock,
  Plus,
  Download,
  Share2,
  AlertCircle,
  CheckCircle,
  ArrowDownRight,
  Smartphone,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function RemoteMonitoring() {
  const [timeRange, setTimeRange] = useState("week")
  const { toast } = useToast()

  // Function to handle connecting a new device
  const handleConnectDevice = () => {
    toast({
      title: "Connect Device",
      description: "Please follow the instructions on your device to complete the pairing process.",
    })
  }

  // Function to handle data export
  const handleExportData = () => {
    toast({
      title: "Data Exported",
      description: "Your health data has been exported successfully.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Remote Monitoring</h2>
          <p className="text-muted-foreground">Track your health metrics and share them with your care team</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleConnectDevice} className="gap-1">
            <Plus className="h-4 w-4" />
            Connect Device
          </Button>
          <Button variant="outline" onClick={handleExportData} className="gap-1">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Last 24 Hours</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Connected Devices */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Smartphone className="mr-2 h-5 w-5 text-primary" />
            Connected Devices
          </CardTitle>
          <CardDescription>Devices currently syncing data to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                <Heart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">HealthTrack Pro</h4>
                  <Badge
                    variant="outline"
                    className="text-green-600 bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800"
                  >
                    Connected
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">Last sync: 10 minutes ago</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                <Activity className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">FitBand X2</h4>
                  <Badge
                    variant="outline"
                    className="text-green-600 bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800"
                  >
                    Connected
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">Last sync: 2 hours ago</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="bg-amber-100 dark:bg-amber-900 p-2 rounded-full">
                <Scale className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">SmartScale</h4>
                  <Badge
                    variant="outline"
                    className="text-amber-600 bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800"
                  >
                    Battery Low
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">Last sync: 1 day ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vital Signs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Heart className="mr-2 h-5 w-5 text-red-500" />
              Heart Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold">72</div>
              <div className="text-sm text-muted-foreground">BPM</div>
              <div className="flex items-center gap-1 mt-2 text-green-600 dark:text-green-400">
                <ArrowDownRight className="h-4 w-4" />
                <span className="text-sm">5 BPM from yesterday</span>
              </div>
            </div>
            <div className="h-[100px] mt-4">
              <LineChart
                data={[
                  { time: "Mon", value: 68 },
                  { time: "Tue", value: 75 },
                  { time: "Wed", value: 80 },
                  { time: "Thu", value: 78 },
                  { time: "Fri", value: 74 },
                  { time: "Sat", value: 77 },
                  { time: "Sun", value: 72 },
                ]}
                categories={["value"]}
                index="time"
                colors={["#ef4444"]}
                valueFormatter={(value) => `${value} BPM`}
                yAxisWidth={30}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Activity className="mr-2 h-5 w-5 text-blue-500" />
              Blood Pressure
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold">118/78</div>
              <div className="text-sm text-muted-foreground">mmHg</div>
              <div className="flex items-center gap-1 mt-2 text-green-600 dark:text-green-400">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Normal range</span>
              </div>
            </div>
            <div className="h-[100px] mt-4">
              <LineChart
                data={[
                  { time: "Mon", systolic: 120, diastolic: 80 },
                  { time: "Tue", systolic: 122, diastolic: 82 },
                  { time: "Wed", systolic: 119, diastolic: 79 },
                  { time: "Thu", systolic: 121, diastolic: 81 },
                  { time: "Fri", systolic: 118, diastolic: 78 },
                  { time: "Sat", systolic: 117, diastolic: 77 },
                  { time: "Sun", systolic: 118, diastolic: 78 },
                ]}
                categories={["systolic", "diastolic"]}
                index="time"
                colors={["#3b82f6", "#93c5fd"]}
                valueFormatter={(value) => `${value} mmHg`}
                yAxisWidth={30}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Thermometer className="mr-2 h-5 w-5 text-amber-500" />
              Temperature
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold">98.6°</div>
              <div className="text-sm text-muted-foreground">Fahrenheit</div>
              <div className="flex items-center gap-1 mt-2 text-green-600 dark:text-green-400">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Normal range</span>
              </div>
            </div>
            <div className="h-[100px] mt-4">
              <LineChart
                data={[
                  { time: "Mon", value: 98.4 },
                  { time: "Tue", value: 98.6 },
                  { time: "Wed", value: 98.8 },
                  { time: "Thu", value: 99.1 },
                  { time: "Fri", value: 98.9 },
                  { time: "Sat", value: 98.7 },
                  { time: "Sun", value: 98.6 },
                ]}
                categories={["value"]}
                index="time"
                colors={["#f59e0b"]}
                valueFormatter={(value) => `${value}°F`}
                yAxisWidth={30}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Droplets className="mr-2 h-5 w-5 text-green-500" />
              Blood Oxygen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold">97%</div>
              <div className="text-sm text-muted-foreground">SpO2</div>
              <div className="flex items-center gap-1 mt-2 text-green-600 dark:text-green-400">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Normal range</span>
              </div>
            </div>
            <div className="h-[100px] mt-4">
              <LineChart
                data={[
                  { time: "Mon", value: 96 },
                  { time: "Tue", value: 97 },
                  { time: "Wed", value: 98 },
                  { time: "Thu", value: 97 },
                  { time: "Fri", value: 96 },
                  { time: "Sat", value: 97 },
                  { time: "Sun", value: 97 },
                ]}
                categories={["value"]}
                index="time"
                colors={["#10b981"]}
                valueFormatter={(value) => `${value}%`}
                yAxisWidth={30}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <Tabs defaultValue="vitals" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <TabsTrigger value="vitals" className="flex items-center">
            <Activity className="mr-2 h-4 w-4" />
            Vital Signs
          </TabsTrigger>
          <TabsTrigger value="biomarkers" className="flex items-center">
            <Dna className="mr-2 h-4 w-4" />
            Biomarkers
          </TabsTrigger>
          <TabsTrigger value="medications" className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            Medication
          </TabsTrigger>
          <TabsTrigger value="symptoms" className="flex items-center">
            <AlertCircle className="mr-2 h-4 w-4" />
            Symptoms
          </TabsTrigger>
        </TabsList>

        <TabsContent value="vitals">
          <Card>
            <CardHeader>
              <CardTitle>Vital Signs Trends</CardTitle>
              <CardDescription>Track changes in your vital signs over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <LineChart
                  data={[
                    { date: "Mar 1", heartRate: 72, bloodOxygen: 97, systolic: 118, diastolic: 78 },
                    { date: "Mar 5", heartRate: 75, bloodOxygen: 96, systolic: 120, diastolic: 80 },
                    { date: "Mar 10", heartRate: 78, bloodOxygen: 97, systolic: 122, diastolic: 82 },
                    { date: "Mar 15", heartRate: 76, bloodOxygen: 98, systolic: 119, diastolic: 79 },
                    { date: "Mar 20", heartRate: 74, bloodOxygen: 97, systolic: 121, diastolic: 81 },
                    { date: "Mar 25", heartRate: 73, bloodOxygen: 96, systolic: 118, diastolic: 78 },
                    { date: "Apr 1", heartRate: 72, bloodOxygen: 97, systolic: 117, diastolic: 77 },
                  ]}
                  categories={["heartRate", "bloodOxygen", "systolic", "diastolic"]}
                  index="date"
                  colors={["#ef4444", "#10b981", "#3b82f6", "#93c5fd"]}
                  valueFormatter={(value) => `${value}`}
                  yAxisWidth={40}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex gap-4">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-sm">Heart Rate</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm">Blood Oxygen</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm">Systolic</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-blue-300"></div>
                  <span className="text-sm">Diastolic</span>
                </div>
              </div>
              <Button variant="outline" className="gap-1">
                <Share2 className="h-4 w-4" />
                Share with Provider
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="biomarkers">
          <Card>
            <CardHeader>
              <CardTitle>Biomarker Tracking</CardTitle>
              <CardDescription>Monitor your key biomarkers and lab results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <BarChart
                  data={[
                    { marker: "WBC", value: 6.2, min: 4.5, max: 11.0 },
                    { marker: "RBC", value: 4.8, min: 4.5, max: 5.9 },
                    { marker: "Hemoglobin", value: 14.2, min: 13.5, max: 17.5 },
                    { marker: "Platelets", value: 250, min: 150, max: 450 },
                    { marker: "Neutrophils", value: 3.8, min: 1.8, max: 7.7 },
                    { marker: "Lymphocytes", value: 1.8, min: 1.0, max: 4.8 },
                  ]}
                  categories={["value"]}
                  index="marker"
                  colors={["#3b82f6"]}
                  valueFormatter={(value) => `${value}`}
                  yAxisWidth={60}
                />
              </div>
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2">
                    <Dna className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <div>
                      <h4 className="font-medium">FLT3-ITD Mutation</h4>
                      <p className="text-sm text-muted-foreground">Monitored via liquid biopsy</p>
                    </div>
                  </div>
                  <Badge className="bg-amber-500">Detected</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/50 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2">
                    <Dna className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <div>
                      <h4 className="font-medium">NPM1 Mutation</h4>
                      <p className="text-sm text-muted-foreground">Monitored via liquid biopsy</p>
                    </div>
                  </div>
                  <Badge className="bg-green-500">Responding to Treatment</Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">View Complete Lab Results</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="medications">
          <Card>
            <CardHeader>
              <CardTitle>Medication Adherence</CardTitle>
              <CardDescription>Track your medication schedule and adherence</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/50 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2">
                    <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                      <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-medium">Venetoclax</h4>
                      <p className="text-sm text-muted-foreground">400mg, Once daily</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-500 mb-1">Taken Today</Badge>
                    <p className="text-xs text-muted-foreground">Next dose: Tomorrow, 8:00 AM</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/50 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2">
                    <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                      <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-medium">Azacitidine</h4>
                      <p className="text-sm text-muted-foreground">75mg/m², Days 1-7 of each 28-day cycle</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-500 mb-1">Cycle 2, Day 5</Badge>
                    <p className="text-xs text-muted-foreground">Next dose: Tomorrow, 10:00 AM</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-950/50 rounded-lg border border-amber-200 dark:border-amber-800">
                  <div className="flex items-center gap-2">
                    <div className="bg-amber-100 dark:bg-amber-900 p-2 rounded-full">
                      <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <h4 className="font-medium">Ondansetron</h4>
                      <p className="text-sm text-muted-foreground">8mg, As needed for nausea</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-amber-500 mb-1">As Needed</Badge>
                    <p className="text-xs text-muted-foreground">Last taken: Yesterday, 2:30 PM</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-medium mb-3">Monthly Adherence</h3>
                <div className="h-[200px]">
                  <BarChart
                    data={[
                      { medication: "Venetoclax", adherence: 98 },
                      { medication: "Azacitidine", adherence: 100 },
                      { medication: "Ondansetron", adherence: 100 },
                    ]}
                    categories={["adherence"]}
                    index="medication"
                    colors={["#10b981"]}
                    valueFormatter={(value) => `${value}%`}
                    yAxisWidth={100}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Medication Schedule</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="symptoms">
          <Card>
            <CardHeader>
              <CardTitle>Symptom Tracking</CardTitle>
              <CardDescription>Monitor your symptoms and side effects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/50 rounded-lg border border-red-200 dark:border-red-800">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    <div>
                      <h4 className="font-medium">Fatigue</h4>
                      <p className="text-sm text-muted-foreground">Reported 3 days ago</p>
                    </div>
                  </div>
                  <Badge className="bg-red-500">Moderate</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-950/50 rounded-lg border border-amber-200 dark:border-amber-800">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    <div>
                      <h4 className="font-medium">Nausea</h4>
                      <p className="text-sm text-muted-foreground">Reported yesterday</p>
                    </div>
                  </div>
                  <Badge className="bg-amber-500">Mild</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/50 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <div>
                      <h4 className="font-medium">Appetite</h4>
                      <p className="text-sm text-muted-foreground">Reported today</p>
                    </div>
                  </div>
                  <Badge className="bg-green-500">Improved</Badge>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-medium mb-3">Symptom Trends</h3>
                <div className="h-[200px]">
                  <LineChart
                    data={[
                      { date: "Mar 1", fatigue: 4, nausea: 3, appetite: 2 },
                      { date: "Mar 5", fatigue: 3, nausea: 2, appetite: 3 },
                      { date: "Mar 10", fatigue: 4, nausea: 1, appetite: 3 },
                      { date: "Mar 15", fatigue: 3, nausea: 2, appetite: 4 },
                      { date: "Mar 20", fatigue: 3, nausea: 1, appetite: 4 },
                      { date: "Mar 25", fatigue: 2, nausea: 1, appetite: 4 },
                      { date: "Apr 1", fatigue: 2, nausea: 1, appetite: 5 },
                    ]}
                    categories={["fatigue", "nausea", "appetite"]}
                    index="date"
                    colors={["#ef4444", "#f59e0b", "#10b981"]}
                    valueFormatter={(value) => `${value}`}
                    yAxisWidth={40}
                  />
                </div>
                <div className="flex gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-sm">Fatigue (1-5)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="text-sm">Nausea (1-5)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm">Appetite (1-5)</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Log New Symptom</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Alerts and Notifications */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <AlertCircle className="mr-2 h-5 w-5 text-amber-500" />
            Alerts & Notifications
          </CardTitle>
          <CardDescription>Important health alerts and reminders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-3 bg-amber-50 dark:bg-amber-950/50 rounded-lg border border-amber-200 dark:border-amber-800">
              <div className="bg-amber-100 dark:bg-amber-900 p-2 rounded-full">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h4 className="font-medium">Blood Pressure Alert</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Your systolic blood pressure was slightly elevated yesterday. Continue monitoring and report if it
                  remains above 130.
                </p>
                <Button size="sm" variant="link" className="p-0 h-auto mt-1">
                  View Details
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-4 p-3 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-medium">Medication Reminder</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Remember to take your Venetoclax medication today at 8:00 AM with food.
                </p>
                <Button size="sm" variant="link" className="p-0 h-auto mt-1">
                  Mark as Taken
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-4 p-3 bg-green-50 dark:bg-green-950/50 rounded-lg border border-green-200 dark:border-green-800">
              <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                <Activity className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className="font-medium">Health Goal Achieved</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Congratulations! You've maintained your medication adherence above 95% for 30 days straight.
                </p>
                <Button size="sm" variant="link" className="p-0 h-auto mt-1">
                  View Achievements
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            View All Notifications
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
