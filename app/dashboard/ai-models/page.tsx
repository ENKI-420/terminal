import type { Metadata } from "next"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ModelDemonstrationHub } from "@/components/ai-models/model-demonstration-hub"
import { SurvivalPredictionModel } from "@/components/ai-models/survival-prediction-model"
import { TreatmentResponseModel } from "@/components/ai-models/treatment-response-model"
import { ResistancePredictionModel } from "@/components/ai-models/resistance-prediction-model"
import { DigitalTwinSimulation } from "@/components/ai-models/digital-twin-simulation"
import { Brain, Activity, Microscope, FlaskRoundIcon as Flask } from "lucide-react"

export const metadata: Metadata = {
  title: "AI Model Demonstrations | GenomicInsights",
  description: "Interactive demonstrations of ML/AI models for precision oncology",
}

export default function AIModelsDemonstrationPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="AI Model Demonstrations"
        text="Interactive demonstrations of our machine learning and AI models for precision oncology"
      />

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <TabsTrigger value="overview" className="flex items-center gap-1">
            <Brain className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="survival" className="flex items-center gap-1">
            <Activity className="h-4 w-4" />
            <span>Survival Prediction</span>
          </TabsTrigger>
          <TabsTrigger value="treatment" className="flex items-center gap-1">
            <Flask className="h-4 w-4" />
            <span>Treatment Response</span>
          </TabsTrigger>
          <TabsTrigger value="resistance" className="flex items-center gap-1">
            <Microscope className="h-4 w-4" />
            <span>Resistance Prediction</span>
          </TabsTrigger>
          <TabsTrigger value="digital-twin" className="flex items-center gap-1">
            <Brain className="h-4 w-4" />
            <span>Digital Twin</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <ModelDemonstrationHub />
        </TabsContent>

        <TabsContent value="survival">
          <SurvivalPredictionModel />
        </TabsContent>

        <TabsContent value="treatment">
          <TreatmentResponseModel />
        </TabsContent>

        <TabsContent value="resistance">
          <ResistancePredictionModel />
        </TabsContent>

        <TabsContent value="digital-twin">
          <DigitalTwinSimulation />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
