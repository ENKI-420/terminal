"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  Activity,
  Microscope,
  FlaskRoundIcon as Flask,
  FileText,
  ArrowRight,
  Lightbulb,
  Database,
  Lock,
  BarChart,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"

export function ModelDemonstrationHub() {
  const [showCredentials, setShowCredentials] = useState(false)

  return (
    <div className="space-y-6">
      <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
        <Lightbulb className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <AlertTitle className="text-blue-600 dark:text-blue-400">Welcome to the AI Model Demonstration Hub</AlertTitle>
        <AlertDescription className="text-blue-700 dark:text-blue-300">
          This environment allows you to interact with our ML/AI models for precision oncology. Select a model from the
          tabs above to explore its capabilities and see it in action.
        </AlertDescription>
      </Alert>

      {showCredentials && (
        <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
          <Lock className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertTitle className="text-green-600 dark:text-green-400">Demo Credentials</AlertTitle>
          <AlertDescription className="text-green-700 dark:text-green-300">
            <p>Username: jake@agiledefensesystems.com</p>
            <p>Password: jake123</p>
            <p className="text-xs mt-1">Note: Authentication is currently disabled for demonstration purposes.</p>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
                <Database className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle>Data Sources & Integration</CardTitle>
                <CardDescription>How our models leverage multi-modal data</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>
                Our AI models integrate data from multiple sources to provide comprehensive insights for precision
                oncology:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-start gap-2 border rounded-md p-3">
                  <Microscope className="h-5 w-5 text-purple-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Genomic Data</h4>
                    <p className="text-sm text-muted-foreground">
                      WGS, WES, targeted panels, RNA-seq, and methylation profiles
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2 border rounded-md p-3">
                  <Activity className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Clinical Data</h4>
                    <p className="text-sm text-muted-foreground">
                      Patient history, treatment records, and outcomes from EHR systems
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2 border rounded-md p-3">
                  <FileText className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Proteomic Data</h4>
                    <p className="text-sm text-muted-foreground">
                      Mass spectrometry-based protein expression and post-translational modifications
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2 border rounded-md p-3">
                  <BarChart className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Imaging Data</h4>
                    <p className="text-sm text-muted-foreground">
                      Radiomics features extracted from CT, MRI, and PET scans
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => setShowCredentials(!showCredentials)}>
              {showCredentials ? "Hide Demo Credentials" : "Show Demo Credentials"}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30">
                <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <CardTitle>Available Model Demonstrations</CardTitle>
                <CardDescription>Interactive AI models for precision oncology</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 border rounded-md p-3">
                <Activity className="h-5 w-5 text-blue-500 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Survival Prediction Model</h4>
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                      93% Accuracy
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Predicts patient survival probability based on genomic and clinical features
                  </p>
                  <Button variant="link" className="px-0 h-auto" asChild>
                    <Link href="#" className="flex items-center gap-1 text-sm">
                      Try Model <ArrowRight className="h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-3 border rounded-md p-3">
                <Flask className="h-5 w-5 text-green-500 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Treatment Response Model</h4>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                      89% Accuracy
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Predicts response to specific therapies based on tumor molecular profile
                  </p>
                  <Button variant="link" className="px-0 h-auto" asChild>
                    <Link href="#" className="flex items-center gap-1 text-sm">
                      Try Model <ArrowRight className="h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-3 border rounded-md p-3">
                <Microscope className="h-5 w-5 text-red-500 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Resistance Prediction Model</h4>
                    <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                      87% Accuracy
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Identifies emerging resistance mechanisms from longitudinal ctDNA data
                  </p>
                  <Button variant="link" className="px-0 h-auto" asChild>
                    <Link href="#" className="flex items-center gap-1 text-sm">
                      Try Model <ArrowRight className="h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-3 border rounded-md p-3">
                <Brain className="h-5 w-5 text-purple-500 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Digital Twin Simulation</h4>
                    <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                      Advanced
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Simulates tumor evolution and treatment response in a virtual patient model
                  </p>
                  <Button variant="link" className="px-0 h-auto" asChild>
                    <Link href="#" className="flex items-center gap-1 text-sm">
                      Try Model <ArrowRight className="h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>How to Use the Model Demonstrations</CardTitle>
          <CardDescription>Step-by-step guide to interacting with our AI models</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 w-8 h-8 text-blue-600 dark:text-blue-400 font-bold">
                  1
                </div>
                <h3 className="font-medium">Select a Model</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Choose one of the available models from the tabs at the top of the page to explore its capabilities.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 w-8 h-8 text-blue-600 dark:text-blue-400 font-bold">
                  2
                </div>
                <h3 className="font-medium">Input Data</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Enter patient data or use pre-populated examples to see how the model processes information.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 w-8 h-8 text-blue-600 dark:text-blue-400 font-bold">
                  3
                </div>
                <h3 className="font-medium">Analyze Results</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Review the model's predictions, explanations, and visualizations to understand its insights.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
