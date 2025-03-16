"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SecurityBadge } from "@/components/ui/security-badge"
import {
  IconSend,
  IconMicrophone,
  IconDna,
  IconBrandHipchat,
  IconFileUpload,
  IconTrash,
  IconInfoCircle,
} from "@tabler/icons-react"
import { ChatMessage } from "@/components/chatbot/chat-message"
import { GenomicVisualization } from "@/components/genomic/genomic-visualization"
import { QuerySuggestion } from "@/components/chatbot/query-suggestion"

// Mock message type
interface Message {
  id: string
  content: string
  role: "user" | "agent"
  timestamp: Date
  citations?: Array<{ source: string; id: string }>
  visualizationData?: any
}

export function ChatbotInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Welcome to AGENT 2.0. How can I assist with your genomic analysis today?",
      role: "agent",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeTab, setActiveTab] = useState("chat")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  //  setActiveTab] = useState("chat")

  // Scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Mock query suggestions based on context
  const querySuggestions = [
    "Show EGFR T790M resistance mechanisms",
    "Compare KRAS G12C vs G12D mutations",
    "Analyze MSI status in colorectal cancer",
    "Explain PD-L1 expression significance",
  ]

  // Mock function to handle message submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsProcessing(true)

    // Simulate AI response after a delay
    setTimeout(() => {
      let responseMessage: Message

      // Generate different responses based on input content
      if (input.toLowerCase().includes("egfr") && input.toLowerCase().includes("resistance")) {
        responseMessage = {
          id: (Date.now() + 1).toString(),
          content:
            "EGFR T790M is a common resistance mechanism to first-generation EGFR TKIs like erlotinib and gefitinib. This mutation occurs in the ATP-binding pocket of EGFR and reduces the binding affinity of these drugs. Third-generation EGFR TKIs like osimertinib were specifically designed to target T790M mutations.",
          role: "agent",
          timestamp: new Date(),
          citations: [
            { source: "PMID", id: "25351743" },
            { source: "PMID", id: "28168087" },
          ],
          visualizationData: {
            type: "protein",
            mutation: "T790M",
            gene: "EGFR",
          },
        }
      } else if (input.toLowerCase().includes("kras")) {
        responseMessage = {
          id: (Date.now() + 1).toString(),
          content:
            "KRAS G12C and G12D mutations both occur at the same position (glycine 12) but have different amino acid substitutions. G12C (glycine to cysteine) is more common in lung adenocarcinoma and can be targeted by covalent inhibitors like sotorasib. G12D (glycine to aspartic acid) is more common in pancreatic cancer and currently lacks specific targeted therapies.",
          role: "agent",
          timestamp: new Date(),
          citations: [
            { source: "PMID", id: "31068700" },
            { source: "PMID", id: "33472833" },
          ],
          visualizationData: {
            type: "comparison",
            mutations: ["G12C", "G12D"],
            gene: "KRAS",
          },
        }
      } else {
        responseMessage = {
          id: (Date.now() + 1).toString(),
          content:
            "I understand your query about genomic analysis. Could you provide more specific details about the gene, mutation, or cancer type you're interested in? This will help me provide more accurate and relevant information.",
          role: "agent",
          timestamp: new Date(),
        }
      }

      setMessages((prev) => [...prev, responseMessage])
      setIsProcessing(false)
    }, 2000)
  }

  const handleClear = () => {
    setMessages([
      {
        id: "welcome",
        content: "Welcome to AGENT 2.0. How can I assist with your genomic analysis today?",
        role: "agent",
        timestamp: new Date(),
      },
    ])
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center">
          <IconBrandHipchat className="h-5 w-5 text-primary mr-2" />
          <h2 className="text-lg font-semibold">AGENT 2.0 Genomic Assistant</h2>
        </div>
        <div className="flex items-center space-x-2">
          <SecurityBadge type="hipaa" />
          <Button variant="ghost" size="icon" onClick={handleClear} aria-label="Clear chat">
            <IconTrash className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Information">
            <IconInfoCircle className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left panel - Chat history */}
        <div className="w-1/2 border-r border-border flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />

            {isProcessing && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <div className="processing-dot" />
                <span>AGENT is processing...</span>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-border">
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about genomic variants, biomarkers, or treatments..."
                className="flex-1"
              />
              <Button type="submit" disabled={isProcessing || !input.trim()}>
                <IconSend className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
              <Button type="button" variant="outline">
                <IconMicrophone className="h-4 w-4" />
                <span className="sr-only">Voice input</span>
              </Button>
              <Button type="button" variant="outline">
                <IconFileUpload className="h-4 w-4" />
                <span className="sr-only">Upload file</span>
              </Button>
            </form>

            {/* Query suggestions */}
            <div className="mt-4 flex flex-wrap gap-2">
              {querySuggestions.map((suggestion, index) => (
                <QuerySuggestion key={index} text={suggestion} onClick={() => setInput(suggestion)} />
              ))}
            </div>
          </div>
        </div>

        {/* Right panel - Visualization */}
        <div className="w-1/2 flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="border-b border-border px-4">
              <TabsList className="h-10">
                <TabsTrigger value="chat" className="data-[state=active]:bg-primary/20">
                  <IconBrandHipchat className="h-4 w-4 mr-2" />
                  Chat
                </TabsTrigger>
                <TabsTrigger value="visualization" className="data-[state=active]:bg-primary/20">
                  <IconDna className="h-4 w-4 mr-2" />
                  Visualization
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="chat" className="flex-1 p-4 overflow-y-auto">
              <div className="text-center p-8">
                <IconDna className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Genomic Analysis Assistant</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Ask questions about genomic variants, biomarkers, or treatment options to get AI-powered insights.
                </p>
                <div className="text-xs text-muted-foreground">
                  <p>Example queries:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Explain EGFR T790M resistance mechanisms</li>
                    <li>Compare KRAS G12C vs G12D mutations</li>
                    <li>Show clinical trials for BRAF V600E melanoma</li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="visualization" className="flex-1 p-4 overflow-y-auto">
              {messages.some((m) => m.visualizationData) ? (
                <GenomicVisualization data={messages.find((m) => m.visualizationData)?.visualizationData} />
              ) : (
                <div className="text-center p-8">
                  <IconDna className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Visualization Available</h3>
                  <p className="text-sm text-muted-foreground">
                    Ask about specific genomic variants or mutations to see interactive visualizations.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

