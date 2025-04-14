import type { Metadata } from "next"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MultiOmicsDashboard } from "@/components/agent/multi-omics-dashboard"
import { TumorEvolutionTracker } from "@/components/agent/tumor-evolution-tracker"
import { ClinicalTrialMatcher } from "@/components/agent/clinical-trial-matcher"
import { FederatedLearningHub } from "@/components/agent/federated-learning-hub"
import { Dna, Activity, FlaskRoundIcon as Flask, Users } from "lucide-react"

export const metadata: Metadata = {
  title: "AGENT Platform | GenomicInsights",
  description: "Advanced Genomic Evolution and Neoplasia Tracker",
}

export default function AgentPlatformPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="AGENT Platform"
        text="Advanced Genomic Evolution and Neoplasia Tracker with Redox Integration"
      />

      <Tabs defaultValue="multi-omics" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <TabsTrigger value="multi-omics" className="flex items-center gap-1">
            <Dna className="h-4 w-4" />
            <span className="hidden md:inline">Multi-Omics Synthesis</span>
            <span className="md:hidden">Multi-Omics</span>
          </TabsTrigger>
          <TabsTrigger value="tumor-evolution" className="flex items-center gap-1">
            <Activity className="h-4 w-4" />
            <span className="hidden md:inline">Tumor Evolution Tracking</span>
            <span className="md:hidden">Evolution</span>
          </TabsTrigger>
          <TabsTrigger value="clinical-trials" className="flex items-center gap-1">
            <Flask className="h-4 w-4" />
            <span className="hidden md:inline">Clinical Trial Matching</span>
            <span className="md:hidden">Trials</span>
          </TabsTrigger>
          <TabsTrigger value="federated-learning" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span className="hidden md:inline">Federated Learning</span>
            <span className="md:hidden">Collaboration</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="multi-omics">
          <MultiOmicsDashboard />
        </TabsContent>

        <TabsContent value="tumor-evolution">
          <TumorEvolutionTracker />
        </TabsContent>

        <TabsContent value="clinical-trials">
          <ClinicalTrialMatcher />
        </TabsContent>

        <TabsContent value="federated-learning">
          <FederatedLearningHub />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
